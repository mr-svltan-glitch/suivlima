"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Edit, Trash2, UserPlus, Mail, Phone, MapPin } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({ nom: '', prenom: '', email: '', telephone: '', adresse: '', statut_actif: true });

  const fetchClients = async (searchQuery = '') => {
    setLoading(true);
    try {
      const response = await api.get(`/clients?search=${searchQuery}`);
      setClients(response.data.data.items || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClients(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const openModal = (client = null) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        nom: client.nom,
        prenom: client.prenom,
        email: client.email || '',
        telephone: client.telephone || '',
        adresse: client.adresse || '',
        statut_actif: client.statut_actif
      });
    } else {
      setEditingClient(null);
      setFormData({ nom: '', prenom: '', email: '', telephone: '', adresse: '', statut_actif: true });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingClient) {
        await api.put(`/clients/${editingClient.id}`, formData);
        toast.success('Client mis à jour');
      } else {
        await api.post('/clients', formData);
        toast.success('Client ajouté avec succès');
      }
      setIsModalOpen(false);
      fetchClients(search);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        await api.delete(`/clients/${id}`);
        toast.success('Client supprimé');
        fetchClients(search);
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-suivlima-blue">Clients</h1>
          <p className="text-gray-500 mt-2 text-lg">Gérez votre base de contacts et suivez leur activité en temps réel.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-suivlima-blue text-white px-8 py-4 rounded-2xl flex items-center shadow-premium hover-lift font-bold"
        >
          <UserPlus size={20} className="mr-2" />
          Nouveau Client
        </button>
      </div>

      <div className="glass-card overflow-hidden border-white/40 shadow-sm">
        <div className="p-6 bg-white/30 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un nom, email ou téléphone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-suivlima-blue focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="text-sm font-medium text-gray-500">
            {clients.length} client(s) au total
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Identité</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Coordonnées</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white/10">
              {loading ? (
                <tr><td colSpan="4" className="px-8 py-20 text-center"><div className="w-8 h-8 border-4 border-suivlima-blue border-t-suivlima-orange rounded-full animate-spin mx-auto"></div></td></tr>
              ) : clients.length === 0 ? (
                <tr><td colSpan="4" className="px-8 py-20 text-center text-gray-500 font-medium">Aucun client trouvé.</td></tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="group hover:bg-white/40 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-suivlima-blue to-suivlima-blue-light flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-suivlima-blue/10">
                          {client.prenom[0]}{client.nom[0]}
                        </div>
                        <div>
                          <div className="text-lg font-bold text-suivlima-blue">{client.prenom} {client.nom}</div>
                          <div className="text-sm text-gray-400 flex items-center gap-1 mt-0.5 font-medium">
                            <FolderOpen size={14} className="text-gray-300" />
                            {client.dossiers?.length || 0} dossier(s)
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail size={14} className="text-suivlima-orange" />
                          {client.email || '—'}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Phone size={14} className="text-suivlima-blue-light" />
                          {client.telephone || '—'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        client.statut_actif 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${client.statut_actif ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                        {client.statut_actif ? 'ACTIF' : 'INACTIF'}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openModal(client)}
                          className="p-3 text-suivlima-blue hover:bg-suivlima-blue/10 rounded-xl transition-colors"
                          title="Modifier"
                        >
                          <Edit size={20} />
                        </button>
                        <button 
                          onClick={() => handleDelete(client.id)}
                          className="p-3 text-red-500 hover:bg-red-50/50 rounded-xl transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingClient ? "Modifier le Client" : "Nouveau Client"}>
        <form onSubmit={handleSubmit} className="p-2 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Prénom <span className="text-red-500">*</span></label>
              <input type="text" name="prenom" required value={formData.prenom} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-suivlima-blue focus:bg-white transition-all outline-none" placeholder="Jean" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Nom <span className="text-red-500">*</span></label>
              <input type="text" name="nom" required value={formData.nom} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-suivlima-blue focus:bg-white transition-all outline-none" placeholder="Dupont" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Email professionnel</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-suivlima-blue transition-all outline-none" placeholder="jean@exemple.com" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Numéro de téléphone</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="tel" name="telephone" value={formData.telephone} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-suivlima-blue transition-all outline-none" placeholder="+223 00 00 00 00" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Localisation / Adresse</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
              <textarea name="adresse" rows={2} value={formData.adresse} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-suivlima-blue transition-all outline-none" placeholder="Bamako, Mali" />
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
             <input 
                type="checkbox" 
                name="statut_actif" 
                id="statut_actif" 
                checked={formData.statut_actif} 
                onChange={handleInputChange}
                className="w-5 h-5 rounded border-gray-300 text-suivlima-blue focus:ring-suivlima-blue cursor-pointer"
             />
             <label htmlFor="statut_actif" className="text-sm font-bold text-suivlima-blue cursor-pointer select-none">
               Compte client actif
             </label>
          </div>
          
          <div className="pt-6 flex gap-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 px-6 bg-white border border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all">
              Annuler
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-4 px-6 bg-suivlima-blue text-white rounded-2xl font-bold shadow-lg shadow-suivlima-blue/20 hover:bg-suivlima-blue-light transition-all disabled:opacity-50">
              {isSubmitting ? 'Opération...' : (editingClient ? 'Modifier le client' : 'Créer le client')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
