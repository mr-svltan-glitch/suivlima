"use client";

import { useState, useEffect } from 'react';
import { Mail, MessageSquare, Calendar, CheckCircle } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function RelancesPage() {
  const [relances, setRelances] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRelances = async () => {
    setLoading(true);
    try {
      const response = await api.get('/relances');
      setRelances(response.data.data.items || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des relances');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelances();
  }, []);

  const markAsSent = async (id) => {
    try {
      await api.put(`/relances/${id}`, { statut: 'envoyee' });
      toast.success('Relance marquée comme envoyée');
      fetchRelances();
    } catch (error) {
       toast.error('Erreur lors de la mise à jour');
    }
  };

  const getStatusBadge = (statut) => {
    const badges = {
      'non_envoyee': 'bg-yellow-100 text-yellow-800',
      'envoyee': 'bg-green-100 text-green-800',
      'echouee': 'bg-red-100 text-red-800',
    };
    return badges[statut] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-suivlima-blue">Relances Programmées</h1>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client & Dossier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Programmée</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500">Chargement...</td></tr>
              ) : relances.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500">Aucune relance programmée</td></tr>
              ) : (
                relances.map((relance) => (
                  <tr key={relance.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className="flex items-center text-sm text-gray-900">
                        {relance.type_relance === 'email' ? <Mail size={18} className="text-blue-500 mr-2" /> : <MessageSquare size={18} className="text-green-500 mr-2" />}
                        <span className="capitalize">{relance.type_relance}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{relance.dossier?.client?.prenom} {relance.dossier?.client?.nom}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{relance.dossier?.titre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        {format(new Date(relance.date_programmee), 'dd MMM yyyy, HH:mm', { locale: fr })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(relance.statut)}`}>
                        {relance.statut.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {relance.statut === 'non_envoyee' && (
                        <button 
                          onClick={() => markAsSent(relance.id)}
                          className="text-suivlima-blue hover:text-suivlima-blue-light"
                          title="Marquer comme envoyée"
                        >
                          <CheckCircle size={20} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
