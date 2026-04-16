"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, ExternalLink, Filter } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function PaiementsPage() {
  const [paiements, setPaiements] = useState([]);
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatut, setFilterStatut] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ dossier_id: '', montant: '', statut: 'non_paye', mode_paiement: '' });

  const fetchPaiements = async (statut = '') => {
    setLoading(true);
    try {
      const response = await api.get(`/paiements${statut ? `?statut=${statut}` : ''}`);
      setPaiements(response.data.data.items || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des paiements');
    } finally {
      setLoading(false);
    }
  };

  const fetchDossiers = async () => {
    try {
      const response = await api.get('/dossiers?size=100');
      setDossiers(response.data.data.items || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPaiements(filterStatut);
  }, [filterStatut]);

  useEffect(() => {
    fetchDossiers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/paiements', formData);
      toast.success('Paiement enregistré');
      setIsModalOpen(false);
      setFormData({ dossier_id: '', montant: '', statut: 'non_paye', mode_paiement: '' });
      fetchPaiements(filterStatut);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    toast.success('Lien copié dans le presse-papier');
  };

  const formatCur = (val) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(val || 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-suivlima-blue">Paiements</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-suivlima-orange hover:bg-suivlima-orange-light text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Nouveau Paiement
        </button>
      </div>

      <Card className="p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-400" />
            <select 
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="block w-full py-2 pl-3 pr-8 border border-gray-300 rounded-lg text-sm focus:ring-suivlima-blue focus:border-suivlima-blue"
            >
              <option value="">Tous les statuts</option>
              <option value="paye">Payé</option>
              <option value="non_paye">Non payé</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client & Dossier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="relative px-6 py-3"><span className="sr-only">Lien</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500">Chargement...</td></tr>
              ) : paiements.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500">Aucun paiement trouvé</td></tr>
              ) : (
                paiements.map((paiement) => (
                  <tr key={paiement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{paiement.dossier?.client?.prenom} {paiement.dossier?.client?.nom}</div>
                      <div className="text-sm text-gray-500">{paiement.dossier?.titre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCur(paiement.montant)}</div>
                      <div className="text-xs text-gray-500 capitalize">{paiement.mode_paiement || '—'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${paiement.statut === 'paye' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {paiement.statut === 'paye' ? 'Payé' : 'Non payé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {paiement.date_paiement ? format(new Date(paiement.date_paiement), 'dd MMM yyyy', { locale: fr }) : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {paiement.lien_paiement && (
                         <button 
                          onClick={() => copyLink(paiement.lien_paiement)} 
                          className="text-suivlima-blue hover:text-suivlima-blue-light flex items-center justify-end"
                          title="Copier le lien"
                        >
                          <ExternalLink size={16} className="mr-1" /> Lien
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouveau Paiement">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Dossier <span className="text-red-500">*</span></label>
            <select name="dossier_id" required value={formData.dossier_id} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-suivlima-blue focus:border-suivlima-blue sm:text-sm">
              <option value="">Sélectionner un dossier</option>
              {dossiers.map(d => <option key={d.id} value={d.id}>{d.titre} ({d.client?.nom})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Montant (FCFA) <span className="text-red-500">*</span></label>
            <input type="number" min="0" name="montant" required value={formData.montant} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-suivlima-blue focus:border-suivlima-blue sm:text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Statut</label>
              <select name="statut" value={formData.statut} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-suivlima-blue focus:border-suivlima-blue sm:text-sm">
                <option value="non_paye">Non payé</option>
                <option value="paye">Payé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mode</label>
              <select name="mode_paiement" value={formData.mode_paiement} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-suivlima-blue focus:border-suivlima-blue sm:text-sm">
                <option value="">À définir</option>
                <option value="virement">Virement</option>
                <option value="carte">Carte</option>
                <option value="especes">Espèces</option>
                <option value="mobile money">Mobile Money</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-suivlima-blue">
              Annuler
            </button>
            <button type="submit" disabled={isSubmitting} className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-suivlima-blue hover:bg-suivlima-blue-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-suivlima-blue disabled:opacity-50">
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
