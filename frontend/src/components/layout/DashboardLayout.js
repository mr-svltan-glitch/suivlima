"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileBottomNav from './MobileBottomNav';
import useAuthStore from '@/store/authStore';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Redirect if not authenticated (basic check, full check would be in middleware)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        setSidebarOpen(false);
      } else {
        setIsMobile(false);
        setSidebarOpen(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-suivlima-blue border-t-suivlima-orange rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-suivlima-bg md:pb-0 pb-16 relative">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 right-0 w-[40%] h-[40%] bg-suivlima-blue/5 blur-[120px] rounded-full -z-0 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[40%] h-[40%] bg-suivlima-orange/5 blur-[120px] rounded-full -z-0 pointer-events-none" />

      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div 
        className={`flex flex-col flex-1 w-0 overflow-hidden transition-all duration-300 ${
          sidebarOpen && !isMobile ? 'ml-64' : (isMobile ? 'ml-0' : 'ml-20')
        } w-full`}
      >
        <Topbar setSidebarOpen={setSidebarOpen} isMobile={isMobile} />
        
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
