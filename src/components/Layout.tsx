'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  Home, 
  Users, 
  CreditCard, 
  Wrench, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  User,
  Bell
} from 'lucide-react';
import { User as UserType } from '@/types';
import { Card, CardContent } from '@/components/ui';
import { themeClasses } from '@/lib/theme';

interface LayoutProps {
  children: React.ReactNode;
  user: UserType;
}

export default function Layout({ children, user }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('demoUser');
    router.push('/');
  };

  const navigation = user.role === 'admin' ? [
    { name: 'Dashboard', href: '/admin', icon: Home, current: true },
    { name: 'Units', href: '/admin/units', icon: Building2, current: false },
    { name: 'Residents', href: '/admin/residents', icon: Users, current: false },
    { name: 'Bills', href: '/admin/bills', icon: CreditCard, current: false },
    { name: 'Maintenance', href: '/admin/maintenance', icon: Wrench, current: false },
    { name: 'Documents', href: '/admin/documents', icon: FileText, current: false },
    { name: 'Settings', href: '/admin/settings', icon: Settings, current: false },
  ] : [
    { name: 'Dashboard', href: '/resident', icon: Home, current: true },
    { name: 'My Unit', href: '/resident/unit', icon: Building2, current: false },
    { name: 'Bills & Payments', href: '/resident/bills', icon: CreditCard, current: false },
    { name: 'Maintenance', href: '/resident/maintenance', icon: Wrench, current: false },
    { name: 'My Lease', href: '/resident/lease', icon: FileText, current: false },
    { name: 'Profile', href: '/resident/profile', icon: User, current: false },
  ];

  const isAdmin = user.role === 'admin';
  const navItems = isAdmin ? navigation : navigation.slice(0, 5); // Only keep the first 5 items for residents

  return (
    <div className="min-h-screen bg-[#0f1419]">
      {/* Header */}
      <header className="bg-[#181c23] border-b border-[#22304a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-[#e5e7eb]">SuiteProp</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-[#e5e7eb] hover:bg-[#22304a] rounded-lg transition-colors duration-200">
                <Bell className="h-5 w-5" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-[#e5e7eb]">{user.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-[#e5e7eb] hover:bg-[#22304a] rounded-lg transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-[#181c23] border-r border-[#22304a] min-h-screen">
          <div className="p-4">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive 
                        ? 'text-blue-400 bg-[#22304a]' 
                        : 'text-gray-400 hover:text-[#e5e7eb] hover:bg-[#22304a]'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 