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
      className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#111827] text-white transition-all duration-500 ease-in-out border-r border-white/5 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Logo Area */}
      <div className="flex items-center justify-between h-24 px-6">
        <Link href="/dashboard" className={`flex items-center gap-3 ${!isOpen && 'justify-center w-full'}`}>
          <div className="shrink-0 p-2 bg-white/5 rounded-xl border border-white/10 hover-lift">
             <Image 
                src="/logo.png" 
                alt="Logo Suivlima" 
                width={32} 
                height={32} 
                className="object-contain"
             />
          </div>
          {isOpen && (
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">suiv<span>lima</span></span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto pt-4 px-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-suivlima-blue text-white shadow-lg shadow-suivlima-blue/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              } ${!isOpen && 'justify-center'}`}
            >
              <Icon size={22} className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-suivlima-orange' : ''}`} />
              {isOpen && <span className="ml-4 font-bold text-sm tracking-wide">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-6">
        <button
          onClick={logout}
          className={`flex items-center w-full px-4 py-4 text-gray-500 rounded-2xl hover:bg-red-500/10 hover:text-red-400 transition-all group ${
            !isOpen ? 'justify-center' : ''
          }`}
        >
          <LogOut size={22} className="shrink-0 group-hover:-translate-x-1 transition-transform" />
          {isOpen && <span className="ml-4 font-bold text-sm">Déconnexion</span>}
        </button>
      </div>
    </div>
  );
}
