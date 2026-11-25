/**
 * @file src/context/RouterContext.tsx
 * Client-side App Router supporting browser history and protected route guards
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface RouterContextType {
  path: string;
  navigate: (newPath: string) => void;
  goBack: () => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

const PROTECTED_ROUTES = ['/dashboard', '/doctors', '/appointments', '/history', '/profile'];
const AUTH_ROUTES = ['/login', '/register'];

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { status } = useAuth();
  
  // Normalize initial path or default to /dashboard (which redirects to /login if unauth)
  const getInitialPath = (): string => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      if (p && p !== '/') return p;
    }
    return '/dashboard';
  };

  const [path, setPath] = useState<string>(getInitialPath);

  const navigate = useCallback((newPath: string) => {
    if (newPath === path) return;
    window.history.pushState({}, '', newPath);
    setPath(newPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [path]);

  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      setPath(p === '/' ? '/dashboard' : p);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Protected route redirects and auth route redirects
  useEffect(() => {
    if (status === 'loading') return;

    const isProtected = PROTECTED_ROUTES.some((route) => path === route || path.startsWith(`${route}/`));
    const isAuthRoute = AUTH_ROUTES.includes(path);

    if (status === 'unauthenticated' && (isProtected || path === '/')) {
      navigate('/login');
    } else if (status === 'authenticated' && (isAuthRoute || path === '/')) {
      navigate('/dashboard');
    }
  }, [status, path, navigate]);

  // Extract params (e.g. for /doctors/:id)
  const params: Record<string, string> = {};
  if (path.startsWith('/doctors/')) {
    const segments = path.split('/');
    if (segments.length >= 3 && segments[2]) {
      params.id = segments[2];
    }
  }

  return (
    <RouterContext.Provider value={{ path, navigate, goBack, params }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
