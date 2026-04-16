"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  CreditCard, 
  MessageSquare, 
  BellRing,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import useAuthStore from '@/store/authStore';

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Clients', href: '/dashboard/clients', icon: Users },
  { name: 'Dossiers', href: '/dashboard/dossiers', icon: FolderOpen },
  { name: 'Paiements', href: '/dashboard/paiements', icon: CreditCard },
  { name: 'Interactions', href: '/dashboard/interactions', icon: MessageSquare },
  { name: 'Relances', href: '/dashboard/relances', icon: BellRing },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const { logout } = useAuthStore();

  return (
    <div 
      className={`fixed inset-y-0 left-0 z-50 flex flex-col gradient-blue text-white transition-all duration-300 shadow-xl ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Logo Area */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-suivlima-blue-light/50">
        <Link href="/dashboard" className={`flex items-center space-x-2 ${!isOpen && 'justify-center w-full'}`}>
          <div className="shrink-0 flex items-center mr-1">
             <Image 
                src="/logo.png" 
                alt="Logo Suivlima" 
                width={36} 
                height={36} 
                className="object-contain rounded"
             />
          </div>
          {isOpen && (
            <span className="text-2xl font-bold tracking-tight text-white mt-1">suivlima</span>
          )}
        </Link>
        {isOpen && (
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md text-gray-300 hover:text-white hover:bg-suivlima-blue-light"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>

      {!isOpen && (
         <button 
          onClick={() => setIsOpen(true)}
          className="mx-auto mt-4 p-1 rounded-md text-gray-300 hover:text-white hover:bg-suivlima-blue-light"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto pt-6 px-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-suivlima-blue-light text-white' 
                  : 'text-gray-300 hover:bg-suivlima-blue-light/50 hover:text-white'
              } ${!isOpen && 'justify-center'}`}
            >
              <Icon size={22} className="shrink-0" />
              {isOpen && <span className="ml-3 font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-suivlima-blue-light/50">
        <button
          onClick={logout}
          className={`flex items-center w-full px-3 py-3 text-red-300 rounded-lg hover:bg-red-500/10 transition-colors ${
            !isOpen ? 'justify-center' : ''
          }`}
        >
          <LogOut size={22} className="shrink-0" />
          {isOpen && <span className="ml-3 font-medium">Déconnexion</span>}
        </button>
      </div>
    </div>
  );
}
