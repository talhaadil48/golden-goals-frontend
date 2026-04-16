'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Calendar, LogOut } from 'lucide-react';
import { logout } from '../lib/storage';

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { href: '/students',  label: 'Students',  icon: <Users size={18} /> },
  { href: '/schedule',  label: 'Schedule',  icon: <Calendar size={18} /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <nav className="sticky top-0 z-50 px-4 sm:px-6 py-3">
      <div className="glass max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-2xl">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold text-white bg-[#D9A441] shadow-md">
            GG
          </div>
          <span className="font-bold text-xl tracking-tight text-[#1F2A2E] hidden sm:block">
            Golden Goals
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map(({ href, label, icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active 
                    ? 'neu-flat text-[#5AB0B2]' 
                    : 'text-[#5F6B6F] hover:text-[#1F2A2E] hover:bg-white/30'
                }`}
              >
                {icon}
                {label}
              </Link>
            );
          })}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all neu-flat text-[#1F2A2E] cursor-pointer"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      {/* Mobile nav indicator (Bottom) */}
      <div className="md:hidden glass fixed bottom-4 left-4 right-4 py-2 px-4 rounded-2xl flex justify-around items-center z-50">
        {NAV_LINKS.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-medium transition-all ${
                active 
                  ? 'neu-flat text-[#5AB0B2]' 
                  : 'text-[#5F6B6F]'
              }`}
            >
              {icon}
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
