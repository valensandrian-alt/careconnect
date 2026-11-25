/**
 * @file src/pages/LoginPage.tsx
 * Login Page with form validation, error states, and quick demo credentials
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { LoginFormData } from '../types';
import { validateLoginForm, ValidationErrors } from '../lib/validation';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { DEMO_CREDENTIALS } from '../data/users';
import { Stethoscope, Mail, Lock, Eye, EyeOff, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { navigate } = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: true,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasRegisteredNotice, setHasRegisteredNotice] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('registered=1')) {
      setHasRegisteredNotice(true);
    }
  }, []);

  const handleChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
    if (authError) setAuthError(null);
  };

  const handleFillDemo = () => {
    setFormData({
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
      rememberMe: true,
    });
    setErrors({});
    setAuthError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const validationErrors = validateLoginForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstField = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstField);
      if (element) element.focus();
      return;
    }

    setIsLoading(true);
    const result = await login(formData);
    setIsLoading(false);

    if (result.success) {
      setIsSuccess(true);
      // Login -> Dashboard
      navigate('/dashboard');
    } else {
      setAuthError(result.error || 'Email atau kata sandi tidak valid.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-2">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-teal-600 rounded-2xl text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Stethoscope className="w-6 h-6" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Masuk ke CareConnect
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Akses jadwal konsultasi kesehatan dan rekam riwayat telemedis Anda
          </p>
        </div>

        {hasRegisteredNotice && (
          <div
            className="mb-5 p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-start gap-2 animate-in fade-in"
            role="status"
          >
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <strong>Akun berhasil dibuat!</strong> Silakan masuk menggunakan email dan kata sandi yang baru Anda daftarkan.
            </div>
          </div>
        )}

        {authError && (
          <div
            className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <span className="font-semibold">Gagal Masuk:</span> {authError}
            </div>
          </div>
        )}

        {/* Demo Auto-Fill Assistant Button */}
        <div className="mb-5 p-3 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex items-center justify-between gap-3">
          <div className="text-[11px] text-teal-900 leading-snug">
            <span className="font-semibold block text-teal-950">Akun Demo Pengujian:</span>
            <span>{DEMO_CREDENTIALS.email}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleFillDemo}
            className="bg-white border-teal-300 text-teal-800 hover:bg-teal-100 text-xs py-1.5 h-auto min-h-[38px] shrink-0"
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-teal-600" aria-hidden="true" />}
          >
            Gunakan Demo
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            id="email"
            label="Alamat Email"
            type="email"
            required
            placeholder="nama@email.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            leftIcon={<Mail className="w-4 h-4" aria-hidden="true" />}
            autoComplete="email"
          />

          <Input
            id="password"
            label="Kata Sandi"
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="Masukkan kata sandi"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
            leftIcon={<Lock className="w-4 h-4" aria-hidden="true" />}
            autoComplete="current-password"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-slate-400 hover:text-slate-600 min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Eye className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            }
          />

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 min-h-[36px]">
              <input
                type="checkbox"
                checked={Boolean(formData.rememberMe)}
                onChange={(e) => handleChange('rememberMe', e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
              />
              <span>Ingat saya di perangkat ini</span>
            </label>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading || isSuccess}
            >
              {isSuccess ? 'Berhasil Masuk...' : 'Masuk ke Aplikasi'}
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-600">
            Belum memiliki akun CareConnect?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="font-semibold text-teal-700 hover:text-teal-800 underline focus-visible:outline-teal-600 cursor-pointer"
            >
              Daftar sekarang
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
