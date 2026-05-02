"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Clock, User as UserIcon, Activity } from 'lucide-react';

export function ActivityFeed() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/dashboard/logs');
        setLogs(response.data.data.logs);
      } catch (error) {
        console.error("Failed to fetch logs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    // Refresh every 30 seconds for "live" feel
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatAction = (action) => {
    return action.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now - then) / 1000);
    
    if (diffInSeconds < 60) return "À l'instant";
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)}h`;
    return then.toLocaleDateString();
  };

  if (loading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="w-6 h-6 border-2 border-suivlima-blue border-t-suivlima-orange rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-suivlima-blue tracking-tight">Activité Directe</h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Événements système</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
           <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
           <span className="text-[10px] text-green-600 font-black uppercase tracking-wider">Live</span>
        </div>
      </div>

      <div className="space-y-6 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-2xl mb-4 opacity-50">📜</div>
            <p className="text-sm text-gray-400 font-medium">Aucune activité récente détectée.</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="relative pl-6 border-l-2 border-gray-100 hover:border-suivlima-blue transition-colors group pb-2">
              <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-white border-2 border-gray-200 group-hover:border-suivlima-blue group-hover:scale-125 transition-all" />
              
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-suivlima-blue uppercase tracking-wider opacity-60">
                    {log.user ? `${log.user.prenom} ${log.user.nom}` : 'SYSTÈME'}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold font-mono">
                    {getTimeAgo(log.created_at)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-700 leading-snug">
                  <span className="font-bold text-suivlima-blue">{formatAction(log.action)}</span>
                  <span className="mx-2 text-gray-300">/</span>
                  <span className="text-gray-500">{log.details?.nom || log.details?.titre || 'Opération réussie'}</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
