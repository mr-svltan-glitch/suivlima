"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  CreditCard, 
  MessageSquare, 
  BellRing,
  MoreVertical
} from 'lucide-react';

const navigation = [
  { name: 'Tableau', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Clients', href: '/dashboard/clients', icon: Users },
  { name: 'Dossiers', href: '/dashboard/dossiers', icon: FolderOpen },
  { name: 'Paiements', href: '/dashboard/paiements', icon: CreditCard },
  { name: 'Messages', href: '/dashboard/interactions', icon: MessageSquare },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const primaryNav = navigation.slice(0, 4);
  const extraNav = navigation.slice(4);

  const isActive = (href) => pathname === href;

  return (
    <>
      {/* Bottom Navigation Bar - Desktop: hidden, Mobile: fixed */}
      <nav className="fixed md:hidden bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-lg safe-bottom">
        <div className="flex items-center justify-between h-16 px-2">
          {/* Primary Navigation Items */}
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 relative group transition-colors ${
                  active 
                    ? 'text-suivlima-blue' 
                    : 'text-gray-600 hover:text-suivlima-blue'
                }`}
              >
                <Icon size={24} className="mb-1" />
                <span className="text-xs font-medium truncate">{item.name}</span>
                {active && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-suivlima-blue to-suivlima-orange rounded-t-full"></div>
                )}
              </Link>
            );
          })}

          {/* More Menu Button */}
          <div className="relative">
            <button 
              onClick={() => setShowMore(!showMore)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 relative group transition-colors ${
                showMore
                  ? 'text-suivlima-blue'
                  : 'text-gray-600 hover:text-suivlima-blue'
              }`}
            >
              <MoreVertical size={24} className="mb-1" />
              <span className="text-xs font-medium">Plus</span>
              {showMore && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-suivlima-blue to-suivlima-orange rounded-t-full"></div>
              )}
            </button>

            {/* More Menu Dropdown */}
            {showMore && (
              <div className="absolute bottom-16 right-0 bg-white rounded-t-2xl rounded-b-2xl shadow-xl border border-gray-100 w-48 overflow-hidden z-40">
                {extraNav.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setShowMore(false)}
                      className={`flex items-center px-4 py-3 text-sm font-medium transition-colors border-b border-gray-100 last:border-b-0 ${
                        active
                          ? 'bg-suivlima-blue/10 text-suivlima-blue'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={18} className="mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Overlay for mobile when menu is open */}
      {showMore && (
        <div 
          className="fixed md:hidden inset-0 z-20" 
          onClick={() => setShowMore(false)}
        />
      )}

      {/* Safe area spacer for notched devices */}
      <div className="md:hidden h-16 safe-bottom"></div>
    </>
  );
}
