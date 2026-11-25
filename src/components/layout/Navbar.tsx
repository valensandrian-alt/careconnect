/**
 * @file src/components/layout/Navbar.tsx
 * Top Navigation Bar adhering to the 3-Zone Top Bar Contract
 */

import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, User as UserIcon, LogOut, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Navbar: React.FC = () => {
  const { path, navigate } = useRouter();
  const { user, status, logout } = useAuth();

  const navLinks = [
    { label: 'Beranda', href: '/dashboard' },
    { label: 'Cari Dokter', href: '/doctors' },
    { label: 'Jadwal Konsultasi', href: '/appointments' },
    { label: 'Riwayat Medis', href: '/history' },
  ];

  const isAuthenticated = status === 'authenticated' && user;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand wordmark (single text element) */}
        <button
          onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
          className="flex items-center gap-2.5 text-left group focus-visible:outline-teal-600 rounded-lg cursor-pointer"
          aria-label="CareConnect Beranda"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs group-hover:bg-teal-700 transition-colors">
            <Stethoscope className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
              CareConnect
            </span>
          </div>
        </button>

        {/* Zone 2: Clean text navigation links (Desktop & Tablet) */}
        {isAuthenticated && (
          <nav
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
            aria-label="Navigasi Utama"
          >
            {navLinks.map((link) => {
              const isActive = path === link.href || (link.href !== '/dashboard' && path.startsWith(link.href));
              return (
                <button
                  key={link.href}
                  onClick={() => navigate(link.href)}
                  className={cn(
                    'transition-colors py-1 cursor-pointer focus-visible:outline-teal-600 rounded-md',
                    isActive
                      ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                      : 'hover:text-slate-900'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        )}

        {/* Zone 3: Primary Action / User Profile */}
        <div className="flex items-center gap-2.5">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/profile')}
                className={cn(
                  'flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer min-h-[44px]',
                  path === '/profile' && 'border-teal-500 bg-teal-50/50 text-teal-800'
                )}
                aria-label={`Buka profil ${user.name}`}
              >
                <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-slate-800 max-w-[120px] truncate">
                  {user.name}
                </span>
              </button>

              <button
                onClick={logout}
                className="hidden sm:flex items-center justify-center p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer min-h-[44px] min-w-[44px]"
                aria-label="Keluar akun"
                title="Keluar akun"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/login')}
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg cursor-pointer min-h-[44px] flex items-center"
              >
                Masuk
              </button>
              <button
                onClick={() => navigate('/register')}
                className="text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 px-3.5 py-2 rounded-xl transition-colors cursor-pointer min-h-[44px] flex items-center shadow-xs"
              >
                Daftar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
