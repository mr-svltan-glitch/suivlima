"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Edit, FileText, Calendar, User, Trash2, LayoutGrid } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function DossiersPage() {
  const [dossiers, setDossiers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingDossier, setEditingDossier] = useState(null);
  const [formData, setFormData] = useState({ client_id: '', titre: '', description: '', statut: 'en_attente' });

  const fetchDossiers = async (searchQuery = '') => {
    setLoading(true);
    try {
      const response = await api.get(`/dossiers?search=${searchQuery}`);
      setDossiers(response.data.data.items || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des dossiers');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients?size=100');
      setClients(response.data.data.items || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDossiers(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchClients();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (dossier = null) => {
    if (dossier) {
      setEditingDossier(dossier);
      setFormData({
        client_id: dossier.client_id,
        titre: dossier.titre,
        description: dossier.description || '',
        statut: dossier.statut
      });
    } else {
      setEditingDossier(null);
      setFormData({ client_id: '', titre: '', description: '', statut: 'en_attente' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingDossier) {
        await api.put(`/dossiers/${editingDossier.id}`, formData);
        toast.success('Dossier mis à jour');
      } else {
        await api.post('/dossiers', formData);
        toast.success('Dossier créé avec succès');
      }
      setIsModalOpen(false);
      fetchDossiers(search);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Supprimer ce dossier définitivement ?')) {
      try {
        await api.delete(`/dossiers/${id}`);
        toast.success('Dossier supprimé');
        fetchDossiers(search);
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const getStatusStyles = (statut) => {
    const styles = {
      'en_attente': 'bg-amber-100 text-amber-700 border-amber-200',
      'en_cours': 'bg-blue-100 text-blue-700 border-blue-200',
      'termine': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'relance_necessaire': 'bg-rose-100 text-rose-700 border-rose-200',
    };
    return styles[statut] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusLabel = (statut) => {
    const labels = {
      'en_attente': 'En attente',
      'en_cours': 'En cours',
      'termine': 'Terminé',
      'relance_necessaire': 'À relancer',
    };
    return labels[statut] || statut;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-suivlima-blue">Dossiers</h1>
          <p className="text-gray-500 mt-2 text-lg">Centralisez vos dossiers clients et suivez leur progression.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-suivlima-orange text-white px-8 py-4 rounded-2xl flex items-center shadow-lg shadow-orange-200 hover-lift font-bold transition-all"
        >
          <Plus size={20} className="mr-2" />
          Nouveau Dossier
        </button>
      </div>

      <div className="glass-card overflow-hidden border-white/40 shadow-sm">
        <div className="p-6 bg-white/30 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par titre ou client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-suivlima-orange outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
               {dossiers.length} DOSSIERS
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Dossier</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Client Associé</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Progression</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Échéance</th>
                <th className="relative px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white/10">
              {loading ? (
                <tr><td colSpan="5" className="px-8 py-20 text-center"><div className="w-8 h-8 border-4 border-suivlima-orange border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
              ) : dossiers.length === 0 ? (
                <tr><td colSpan="5" className="px-8 py-20 text-center text-gray-500 font-medium">Aucun dossier trouvé.</td></tr>
              ) : (
                dossiers.map((dossier) => (
                  <tr key={dossier.id} className="group hover:bg-white/40 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-suivlima-orange">
                          <FileText size={24} />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-suivlima-blue leading-tight">{dossier.titre}</div>
                          <div className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-tighter">REF-{dossier.id.split('-')[0]}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-8 h-8 rounded-full bg-suivlima-blue/10 flex items-center justify-center text-suivlima-blue text-xs font-bold">
                          {dossier.client?.prenom[0]}{dossier.client?.nom[0]}
                        </div>
                        <span className="font-semibold text-sm">{dossier.client?.prenom} {dossier.client?.nom}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusStyles(dossier.statut)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-2"></span>
                        {getStatusLabel(dossier.statut)}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-500 font-medium">
                       <span className="flex items-center gap-2">
                         <Calendar size={14} className="text-gray-300" />
                         {format(new Date(dossier.created_at), 'dd MMM yyyy', { locale: fr })}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openModal(dossier)}
                          className="p-3 text-suivlima-blue hover:bg-suivlima-blue/10 rounded-xl transition-colors"
                        >
                          <Edit size={20} />
                        </button>
                        <button 
                          onClick={() => handleDelete(dossier.id)}
                          className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingDossier ? "Modifier le Dossier" : "Nouveau Dossier"}>
        <form onSubmit={handleSubmit} className="p-2 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Client Associé <span className="text-red-500">*</span></label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select name="client_id" required value={formData.client_id} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-suivlima-orange outline-none transition-all appearance-none cursor-pointer">
                <option value="">Sélectionner un client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Titre du dossier <span className="text-red-500">*</span></label>
            <input type="text" name="titre" required value={formData.titre} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-suivlima-orange transition-all outline-none" placeholder="Ex: Visa France - Renouvellement" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Note / Description</label>
            <textarea name="description" rows={3} value={formData.description} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-suivlima-orange transition-all outline-none" placeholder="Précisez les détails du dossier ici..." />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Statut actuel</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                {id: 'en_attente', label: 'En attente', color: 'bg-amber-500'},
                {id: 'en_cours', label: 'En cours', color: 'bg-blue-500'},
                {id: 'termine', label: 'Terminé', color: 'bg-green-500'},
                {id: 'relance_necessaire', label: 'À relancer', color: 'bg-red-500'}
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setFormData(prev => ({...prev, statut: s.id}))}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    formData.statut === s.id 
                      ? 'border-suivlima-orange bg-orange-50 shadow-sm' 
                      : 'border-transparent bg-gray-50 text-gray-500'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${s.color}`}></span>
                  <span className="text-xs font-bold uppercase">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-6 flex gap-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 px-6 bg-white border border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all">
              Annuler
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-4 px-6 bg-suivlima-orange text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-suivlima-orange-light transition-all disabled:opacity-50">
              {isSubmitting ? 'Traitement...' : (editingDossier ? 'Mettre à jour' : 'Créer le Dossier')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
