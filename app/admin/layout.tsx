'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, LogOut, Menu, X, Settings } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show the admin sidebar on the login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Analytics', href: '/admin/analytics', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    document.cookie = 'admin_session=; path=/; max-age=0';
    window.location.href = '/admin/login';
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-[#E0DDD8] flex justify-between items-center bg-white/50 backdrop-blur-sm">
        <h1 className="text-xl font-display font-bold text-stone-900 tracking-wide">
          Admin <span className="text-gold-accent italic">Panel</span>
        </h1>
        {/* Mobile close button inside the sidebar itself if we want it, but we handle it at the overlay level */}
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href) && (item.href !== '/admin/products' || pathname === '/admin/products' || pathname.startsWith('/admin/products/edit'));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-sans tracking-widest transition-all duration-300 ${
                isActive
                  ? 'bg-gold-accent/10 text-stone-900 shadow-[inset_2px_0_0_0_#C9A84C]'
                  : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900 hover:shadow-[inset_2px_0_0_0_#E0DDD8]'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-gold-accent' : ''}`} />
              <span className={`uppercase font-semibold ${isActive ? 'text-stone-900' : ''}`}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#E0DDD8] bg-white">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full text-left text-sm font-sans uppercase tracking-widest text-stone-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors duration-300"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col md:flex-row bg-[#FAF8F5]">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-[#E0DDD8] shadow-sm z-20">
        <h1 className="text-lg font-display font-bold text-stone-900 tracking-wide">
          Admin <span className="text-gold-accent italic">Panel</span>
        </h1>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-stone-600 hover:text-gold-accent transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-72 bg-white border-r border-[#E0DDD8] shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] flex-col z-10">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Overlay background */}
          <div 
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Slide-out panel */}
          <div className="relative flex flex-col w-4/5 max-w-sm bg-white h-full shadow-2xl transform transition-transform duration-300 ease-in-out translate-x-0 z-10">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-[#FAF8F5] relative">
        <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">{children}</div>
      </div>
    </div>
  );
}
