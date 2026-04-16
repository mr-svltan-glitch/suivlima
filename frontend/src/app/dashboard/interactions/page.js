"use client";

import { useState, useEffect } from 'react';
import { Mail, MessageSquare, Phone, Smartphone, Link as LinkIcon } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function InteractionsPage() {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInteractions = async () => {
      setLoading(true);
      try {
        const response = await api.get('/interactions');
        setInteractions(response.data.data.items || []);
      } catch (error) {
         toast.error('Erreur lors du chargement de l\'historique');
      } finally {
        setLoading(false);
      }
    };

    fetchInteractions();
  }, []);

  const getIcon = (type) => {
    switch(type) {
      case 'email': return <Mail size={20} className="text-white" />;
      case 'whatsapp': return <MessageSquare size={20} className="text-white" />;
      case 'telephone': return <Phone size={20} className="text-white" />;
      case 'app': return <Smartphone size={20} className="text-white" />;
      default: return <LinkIcon size={20} className="text-white" />;
    }
  };

  const getIconBg = (type) => {
    switch(type) {
      case 'email': return 'bg-blue-500';
      case 'whatsapp': return 'bg-green-500';
      case 'telephone': return 'bg-purple-500';
      case 'app': return 'bg-suivlima-orange';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-suivlima-blue">Historique des Interactions</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {loading ? (
           <div className="text-center py-10 text-gray-500">Chargement de la timeline...</div>
        ) : interactions.length === 0 ? (
           <div className="text-center py-10 text-gray-500">Aucune interaction trouvée</div>
        ) : (
          <div className="flow-root">
            <ul role="list" className="-mb-8">
              {interactions.map((interaction, interactionIdx) => (
                <li key={interaction.id}>
                  <div className="relative pb-8">
                    {interactionIdx !== interactions.length - 1 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getIconBg(interaction.type_interaction)}`}>
                          {getIcon(interaction.type_interaction)}
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-gray-900">
                            Interaction via <span className="font-medium capitalize">{interaction.type_interaction}</span> avec{' '}
                            <span className="font-medium text-suivlima-blue">
                              {interaction.client?.prenom} {interaction.client?.nom}
                            </span>
                          </p>
                          <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <p>{interaction.contenu}</p>
                          </div>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                          {format(new Date(interaction.date), 'dd MMM HH:mm', { locale: fr })}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
