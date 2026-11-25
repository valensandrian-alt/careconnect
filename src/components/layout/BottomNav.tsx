/**
 * @file src/components/layout/BottomNav.tsx
 * Mobile thumb-zone bottom navigation bar (WCAG 2.2 touch target compliant >= 44px)
 */

import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { useAppointments } from '../../context/AppointmentContext';
import { Home, Stethoscope, CalendarDays, History, User } from 'lucide-react';
import { cn } from '../../lib/utils';

export const BottomNav: React.FC = () => {
  const { path, navigate } = useRouter();
  const { upcomingAppointments } = useAppointments();

  const items = [
    { label: 'Beranda', href: '/dashboard', icon: Home },
    { label: 'Cari Dokter', href: '/doctors', icon: Stethoscope },
    {
      label: 'Jadwal',
      href: '/appointments',
      icon: CalendarDays,
      badgeCount: upcomingAppointments.length,
    },
    { label: 'Riwayat', href: '/history', icon: History },
    { label: 'Profil', href: '/profile', icon: User },
  ];

  return (
    <nav
      aria-label="Navigasi Seluler"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg pb-safe"
    >
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto items-center px-1">
        {items.map((item) => {
          const isActive =
            path === item.href ||
            (item.href !== '/dashboard' && path.startsWith(item.href));
          const Icon = item.icon;

          return (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className={cn(
                'relative flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] py-1 cursor-pointer transition-colors',
                isActive
                  ? 'text-teal-700 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              )}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    'w-5 h-5 transition-transform',
                    isActive && 'scale-110 text-teal-600 stroke-[2.5]'
                  )}
                  aria-hidden="true"
                />
                {item.badgeCount && item.badgeCount > 0 ? (
                  <span
                    aria-label={`${item.badgeCount} konsultasi mendatang`}
                    className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-teal-600 text-[10px] font-bold text-white flex items-center justify-center tabular-nums"
                  >
                    {item.badgeCount}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] tracking-tight mt-1 line-clamp-1">
                {item.label}
              </span>
              {isActive && (
                <span
                  className="w-1 h-1 rounded-full bg-teal-600 mt-0.5"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
