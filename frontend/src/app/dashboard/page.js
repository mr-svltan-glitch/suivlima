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
    <div className="space-y-8 pb-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-suivlima-blue">Tableau de bord</h1>
          <p className="text-gray-500 mt-2 text-lg">Optimisez la gestion de vos dossiers et clients en temps réel.</p>
        </div>
        <button className="px-6 py-3 bg-suivlima-blue text-white rounded-2xl font-semibold shadow-premium hover-lift transition-all">
          Nouveau Dossier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Main KPI: Revenue */}
        <div className="md:col-span-2 bento-item glass-card p-8 border-orange-200/50 bg-gradient-to-br from-white/40 to-orange-50/50 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-sm font-semibold text-orange-600 uppercase tracking-wider mb-1">Chiffre d&apos;Affaires Mensuel</p>
              <h2 className="text-5xl font-bold text-suivlima-blue">{formatCur(stats?.ca_mensuel)}</h2>
            </div>
            <div className="p-4 bg-orange-100 rounded-2xl text-suivlima-orange"><DollarSign size={32} /></div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="text-green-600 font-bold font-mono">↑ 12.5%</span>
            <span>vs mois dernier</span>
          </div>
        </div>

        {/* Small KPIs */}
        <div className="bento-item glass-card p-6 border-white/40 hover:bg-white/60">
           <div className="p-3 bg-blue-100 rounded-xl text-suivlima-blue w-fit mb-4"><Users size={24} /></div>
           <p className="text-sm font-medium text-gray-500 mb-1">Clients Actifs</p>
           <h3 className="text-3xl font-bold text-suivlima-blue">{stats?.clients_actifs || 0}</h3>
        </div>

        <div className="bento-item glass-card p-6 border-white/40 hover:bg-white/60">
           <div className="p-3 bg-red-100 rounded-xl text-red-600 w-fit mb-4"><AlertCircle size={24} /></div>
           <p className="text-sm font-medium text-gray-500 mb-1">Retards</p>
           <h3 className="text-3xl font-bold text-red-600">{stats?.paiements_en_retard || 0}</h3>
        </div>

        {/* Activity Feed */}
        <div className="md:col-span-1 md:row-span-2 bento-item glass-card p-6 bg-white/20 backdrop-blur-xl border-white/30 shadow-sm">
           <ActivityFeed />
        </div>

        {/* Revenue Chart */}
        <div className="md:col-span-3 bento-item glass-card p-8 bg-white/30 border-white/40 shadow-sm">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
            <span className="w-2 h-8 bg-suivlima-orange rounded-full"></span>
            Performance des encaissements
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{fill: "#6B7280", fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: "#6B7280", fontSize: 12}} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: "16px", border: "none" }} />
                <Line type="monotone" dataKey="total" stroke="#F5A623" strokeWidth={4} dot={{r: 4, fill: "#F5A623", strokeWidth: 2, stroke: "#fff"}} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
