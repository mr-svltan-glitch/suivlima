"use client";

import { Bell, Search, Menu, UserCircle } from 'lucide-react';
import useAuthStore from '@/store/authStore';

export default function Topbar({ setSidebarOpen, isMobile }) {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 h-14 md:h-16 flex items-center justify-between px-2 sm:px-4 md:px-6 shadow-sm">
      <div className="flex items-center flex-1 min-w-0">
        {isMobile && (
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 mr-2 -ml-2 text-gray-500 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-suivlima-blue shrink-0"
          >
            <Menu size={20} />
          </button>
        )}
        
        {/* Search */}
        <div className="hidden sm:flex max-w-md w-full relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un client, un dossier..."
            className="block w-full py-2 pl-10 pr-3 text-sm border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-suivlima-blue focus:border-suivlima-blue transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4 shrink-0">
        <button className="p-2 text-gray-400 hover:text-gray-500 relative focus:outline-none rounded-full hover:bg-gray-100 transition-colors">
          <Bell size={18} className="md:w-5 md:h-5" />
          <span className="absolute top-1 right-1 block h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-suivlima-orange ring-2 ring-white"></span>
        </button>

        <div className="flex items-center space-x-2 md:space-x-3 border-l border-gray-200 pl-2 md:pl-4">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-medium text-gray-900 leading-none">{user?.nom || 'Utilisateur'}</span>
            <span className="text-xs text-gray-500 mt-1 capitalize">{user?.role || 'Admin'}</span>
          </div>
          <button className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out">
            <UserCircle size={28} className="text-suivlima-blue md:w-8 md:h-8" />
          </button>
        </div>
      </div>
    </header>
  );
}
