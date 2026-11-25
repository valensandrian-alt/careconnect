/**
 * @file src/components/layout/AppLayout.tsx
 * Main application layout container with responsive navigation
 */

import React from 'react';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { ShieldCheck, Info } from 'lucide-react';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { status } = useAuth();
  const { path } = useRouter();

  const isAuthPage = path === '/login' || path === '/register';
  const showNavbars = !isAuthPage && status === 'authenticated';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-teal-100 selection:text-teal-900">
      {/* WCAG 2.2 Skip to main content link for screen readers and keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
      >
        Lewati ke konten utama
      </a>

      {showNavbars && <Navbar />}

      {/* Main Content Area */}
      <main
        id="main-content"
        className={`flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-7 ${
          showNavbars ? 'pb-24 md:pb-12' : 'pb-8'
        }`}
      >
        {children}
      </main>

      {/* Bottom Nav for Mobile Screens */}
      {showNavbars && <BottomNav />}

      {/* Footer (Desktop & Tablet) */}
      <footer className="hidden md:block bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">CareConnect</span>
            <span aria-hidden="true">·</span>
            <span>Platform Telemedis & Konsultasi Dokter Terpercaya</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-teal-700">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Privasi Terlindungi</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>Standar Aksesibilitas WCAG 2.2 AA</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
