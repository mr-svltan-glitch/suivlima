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
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Activity size={20} className="text-suivlima-orange" />
          Activité Récente
        </h3>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium animate-pulse">
          LIVE
        </span>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
        {logs.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">Aucune activité récente.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-4 p-3 rounded-xl hover:bg-white/50 transition-colors border border-transparent hover:border-gray-100 group">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-suivlima-blue group-hover:text-white transition-colors">
                <UserIcon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-medium truncate">
                    {log.user ? `${log.user.prenom} ${log.user.nom}` : 'Système'}
                  </p>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1 font-mono">
                    <Clock size={10} />
                    {getTimeAgo(log.created_at)}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {formatAction(log.action)} : <span className="font-semibold">{log.details?.nom || log.details?.titre || 'Détails'}</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
