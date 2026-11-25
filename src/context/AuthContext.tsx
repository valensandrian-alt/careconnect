/**
 * @file src/context/AuthContext.tsx
 * Authentication state provider for CareConnect MVP
 * 
 * SECURITY & ARCHITECTURAL NOTE:
 * This authentication module is built for an interactive MVP prototype.
 * In production, authentication must be managed via HttpOnly secure session cookies
 * or JWT access tokens issued by a hardened backend, with passwords hashed
 * using Argon2 or bcrypt on the server side.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthStatus, LoginFormData, RegisterFormData } from '../types';
import { DEMO_USER } from '../data/users';

const ACTIVE_USER_KEY = 'careconnect_active_user_v1';
const REGISTERED_USERS_KEY = 'careconnect_registered_users_v1';

interface AuthContextType {
  user: User | null;
  status: AuthStatus;
  login: (data: LoginFormData) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterFormData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  // Load persisted session on initial mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedActive = localStorage.getItem(ACTIVE_USER_KEY) || sessionStorage.getItem(ACTIVE_USER_KEY);
        if (storedActive) {
          const parsedUser = JSON.parse(storedActive) as User;
          setUser(parsedUser);
          setStatus('authenticated');
          return;
        }

        // If no active session, initialize registered users repository if empty
        const storedUsers = localStorage.getItem(REGISTERED_USERS_KEY);
        if (!storedUsers) {
          localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify([DEMO_USER]));
        }

        // Unauthenticated state
        setUser(null);
        setStatus('unauthenticated');
      } catch (err) {
        console.error('Error initializing auth state:', err);
        setUser(null);
        setStatus('unauthenticated');
      }
    };

    const timer = setTimeout(initializeAuth, 200);
    return () => clearTimeout(timer);
  }, []);

  const login = async (data: LoginFormData): Promise<{ success: boolean; error?: string }> => {
    setStatus('loading');
    // Simulate real network request delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const emailNormalized = data.email.trim().toLowerCase();
      
      // Get all registered users from storage
      const rawRegistered = localStorage.getItem(REGISTERED_USERS_KEY);
      let registeredUsers: User[] = rawRegistered ? JSON.parse(rawRegistered) : [DEMO_USER];

      // Check if matches demo or stored user
      const matchedUser = registeredUsers.find((u) => u.email.toLowerCase() === emailNormalized);

      // For MVP testing, allow login if matches demo email or any registered email
      if (matchedUser) {
        setUser(matchedUser);
        setStatus('authenticated');
        
        const storage = data.rememberMe ? localStorage : sessionStorage;
        storage.setItem(ACTIVE_USER_KEY, JSON.stringify(matchedUser));
        return { success: true };
      }

      // Check fallback test demo
      if (emailNormalized === DEMO_USER.email.toLowerCase()) {
        setUser(DEMO_USER);
        setStatus('authenticated');
        localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(DEMO_USER));
        return { success: true };
      }

      setStatus('unauthenticated');
      return { 
        success: false, 
        error: 'Email atau kata sandi tidak sesuai. Silakan periksa kembali atau gunakan akun demo.' 
      };
    } catch {
      setStatus('unauthenticated');
      return { success: false, error: 'Terjadi kesalahan sistem saat memproses login.' };
    }
  };

  const register = async (data: RegisterFormData): Promise<{ success: boolean; error?: string }> => {
    setStatus('loading');
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      const emailNormalized = data.email.trim().toLowerCase();
      const rawRegistered = localStorage.getItem(REGISTERED_USERS_KEY);
      let registeredUsers: User[] = rawRegistered ? JSON.parse(rawRegistered) : [DEMO_USER];

      const exists = registeredUsers.some((u) => u.email.toLowerCase() === emailNormalized);
      if (exists) {
        setStatus('unauthenticated');
        return { success: false, error: 'Email ini sudah terdaftar. Silakan gunakan email lain atau login.' };
      }

      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: data.fullName.trim(),
        email: emailNormalized,
        phone: data.phone.trim(),
        gender: 'Laki-laki',
        birthDate: '1995-01-01',
        address: 'DKI Jakarta',
        bloodType: 'O+',
        createdAt: new Date().toISOString(),
      };

      registeredUsers.push(newUser);
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));

      // As requested in the specification: Register -> Redirect to Login (do not auto-login)
      setStatus('unauthenticated');
      return { success: true };
    } catch {
      setStatus('unauthenticated');
      return { success: false, error: 'Gagal melakukan registrasi akun. Silakan coba lagi.' };
    }
  };

  const logout = () => {
    localStorage.removeItem(ACTIVE_USER_KEY);
    sessionStorage.removeItem(ACTIVE_USER_KEY);
    setUser(null);
    setStatus('unauthenticated');
  };

  const updateProfile = async (updatedData: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Sesi pengguna tidak ditemukan.' };

    const mergedUser: User = { ...user, ...updatedData };
    setUser(mergedUser);

    try {
      if (localStorage.getItem(ACTIVE_USER_KEY)) {
        localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(mergedUser));
      } else {
        sessionStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(mergedUser));
      }

      // Update in registered array
      const rawRegistered = localStorage.getItem(REGISTERED_USERS_KEY);
      if (rawRegistered) {
        const users: User[] = JSON.parse(rawRegistered);
        const index = users.findIndex((u) => u.id === mergedUser.id);
        if (index !== -1) {
          users[index] = mergedUser;
          localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
        }
      }

      return { success: true };
    } catch {
      return { success: false, error: 'Gagal menyimpan perubahan profil.' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, status, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
