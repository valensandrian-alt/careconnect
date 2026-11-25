/**
 * @file src/App.tsx
 * Main application router and root provider setup for CareConnect
 */

import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppointmentProvider } from './context/AppointmentContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { AppLayout } from './components/layout/AppLayout';

import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { DoctorDetailPage } from './pages/DoctorDetailPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';

import { Stethoscope, Loader2 } from 'lucide-react';

const RouteDispatcher: React.FC = () => {
  const { path } = useRouter();
  const { status } = useAuth();

  // Initial loading splash screen
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-600/20 mb-4 animate-bounce">
          <Stethoscope className="w-8 h-8" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">CareConnect</h1>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" aria-hidden="true" />
          <span>Memuat sesi layanan kesehatan...</span>
        </p>
      </div>
    );
  }

  // Public / Auth routes
  if (path === '/login') return <LoginPage />;
  if (path === '/register') return <RegisterPage />;

  // Protected application routes
  const renderContent = () => {
    if (path === '/dashboard' || path === '/') return <DashboardPage />;
    if (path === '/doctors') return <DoctorsPage />;
    if (path.startsWith('/doctors/')) return <DoctorDetailPage />;
    if (path === '/appointments') return <AppointmentsPage />;
    if (path === '/history') return <HistoryPage />;
    if (path === '/profile') return <ProfilePage />;

    // Fallback default
    return <DashboardPage />;
  };

  return <AppLayout>{renderContent()}</AppLayout>;
};

export default function App() {
  return (
    <AuthProvider>
      <AppointmentProvider>
        <RouterProvider>
          <RouteDispatcher />
        </RouterProvider>
      </AppointmentProvider>
    </AuthProvider>
  );
}
