"use client";

import { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from "recharts";
import { 
  DollarSign, 
  Users, 
  FolderOpen, 
  AlertCircle 
} from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/dashboard/stats");
        setStats(response.data.data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
        toast.error("Impossible de charger les statistiques");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex h-[calc(100vh-200px)] items-center justify-center">
      <div className="w-12 h-12 border-4 border-suivlima-blue border-t-suivlima-orange rounded-full animate-spin shadow-lg"></div>
    </div>
  );

  const formatCur = (val) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", maximumFractionDigits: 0 }).format(val || 0);
  const evolutionData = stats?.evolution_ca?.length > 0 ? stats.evolution_ca : [{ mois: "Jan", total: 0 }];

  return (
    <div className="space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-suivlima-blue">Tableau de bord</h1>
          <p className="text-gray-400 font-bold text-sm md:text-base uppercase tracking-widest mt-2">Suivi de performance en temps réel</p>
        </div>
        <button className="group flex items-center justify-center gap-3 px-8 py-4 bg-suivlima-blue text-white rounded-[2rem] font-black shadow-2xl shadow-suivlima-blue/20 hover:bg-suivlima-blue-light hover-lift transition-all w-full md:w-auto">
          <FolderOpen size={20} className="group-hover:rotate-12 transition-transform" />
          Nouveau Dossier
        </button>
      </div>

      {/* Main Grid */}
      <div className="bento-grid">
        {/* Primary KPI: Revenue */}
        <div className="lg:col-span-8 glass-card p-8 md:p-12 relative overflow-hidden group hover-lift">
          <div className="absolute top-0 right-0 w-64 h-64 bg-suivlima-orange/5 blur-[80px] rounded-full -mr-20 -mt-20 group-hover:bg-suivlima-orange/10 transition-colors" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-10">
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-xs font-black text-suivlima-orange uppercase tracking-[0.2em]">Chiffre d'Affaires Mensuel</p>
                <h2 className="text-4xl md:text-6xl font-black text-suivlima-blue tracking-tighter">
                  {formatCur(stats?.ca_mensuel)}
                </h2>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-600 rounded-full text-sm font-black">
                  <TrendingUp size={16} />
                  +12.5%
                </div>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">vs mois dernier</p>
              </div>
            </div>

            <div className="shrink-0">
               <div className="w-20 h-20 md:w-24 md:h-24 bg-suivlima-blue rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-suivlima-blue/30 group-hover:rotate-6 transition-transform">
                  <DollarSign size={40} className="md:w-12 md:h-12" />
               </div>
            </div>
          </div>

          {/* Inline Chart Preview */}
          <div className="mt-12 h-[200px] w-full -mx-4 md:-mx-8 opacity-60 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolutionData}>
                <Line type="monotone" dataKey="total" stroke="#F5A623" strokeWidth={6} dot={false} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Small KPIs Column */}
        <div className="lg:col-span-4 grid grid-cols-1 gap-6">
          <div className="glass-card p-8 hover-lift group border-l-4 border-l-suivlima-blue">
             <div className="flex justify-between items-center mb-6">
                <div className="w-12 h-12 bg-suivlima-blue/5 rounded-2xl flex items-center justify-center text-suivlima-blue group-hover:scale-110 transition-transform">
                   <Users size={24} />
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Croissance</span>
             </div>
             <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Clients Actifs</p>
             <h3 className="text-4xl font-black text-suivlima-blue tracking-tighter">{stats?.clients_actifs || 0}</h3>
          </div>

          <div className="glass-card p-8 hover-lift group border-l-4 border-l-red-500">
             <div className="flex justify-between items-center mb-6">
                <div className="w-12 h-12 bg-red-500/5 rounded-2xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                   <AlertCircle size={24} />
                </div>
                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest animate-pulse">Action Requise</span>
             </div>
             <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Paiements en retard</p>
             <h3 className="text-4xl font-black text-red-600 tracking-tighter">{stats?.paiements_en_retard || 0}</h3>
          </div>
        </div>

        {/* Activity Feed Column */}
        <div className="lg:col-span-5 glass-card p-8 shadow-premium">
           <ActivityFeed />
        </div>

        {/* Detailed Performance Chart */}
        <div className="lg:col-span-7 glass-card p-8 md:p-12 shadow-premium">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-xl font-black text-suivlima-blue tracking-tight flex items-center gap-3">
              <span className="w-2 h-8 bg-suivlima-orange rounded-full"></span>
              Performance Annuelle
            </h3>
            <div className="flex gap-2">
               <div className="w-3 h-3 bg-suivlima-orange rounded-full"></div>
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Encaissements</span>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{fill: "#94A3B8", fontSize: 11, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: "#94A3B8", fontSize: 11, fontWeight: 700}} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip 
                  cursor={{fill: '#F8FAFC'}}
                  contentStyle={{ borderRadius: "24px", border: "none", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", padding: "16px" }} 
                />
                <Bar dataKey="total" fill="#F5A623" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
