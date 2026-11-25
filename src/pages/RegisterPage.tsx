/**
 * @file src/pages/RegisterPage.tsx
 * Register Page with comprehensive field validations and WCAG 2.2 AA accessibility
 */

import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { RegisterFormData } from '../types';
import { validateRegisterForm, ValidationErrors } from '../lib/validation';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Stethoscope, User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { navigate } = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
    if (serverError) setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const validationErrors = validateRegisterForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Focus first error field for accessibility
      const firstField = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstField);
      if (element) element.focus();
      return;
    }

    setIsLoading(true);
    const result = await register(formData);
    setIsLoading(false);

    if (result.success) {
      setSuccessMessage('Registrasi akun berhasil! Mengalihkan Anda ke halaman masuk...');
      // Specification: After registration succeeds: Register -> Login (not auto-login)
      setTimeout(() => {
        navigate('/login?registered=1');
      }, 1500);
    } else {
      setServerError(result.error || 'Terjadi kesalahan saat pendaftaran.');
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
            Daftar Akun Baru
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Buat akun pasien CareConnect untuk mulai berkonsultasi dengan dokter terpercaya
          </p>
        </div>

        {/* Prototype security notice */}
        <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            <strong>Simulasi Frontend MVP:</strong> Data akun tersimpan aman di penyimpanan lokal peramban untuk keperluan demonstrasi.
          </span>
        </div>

        {serverError && (
          <div
            className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <span className="font-semibold">Pendaftaran Gagal:</span> {serverError}
            </div>
          </div>
        )}

        {successMessage && (
          <div
            className="mb-5 p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-start gap-2 animate-in fade-in"
            role="status"
          >
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" aria-hidden="true" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            id="fullName"
            label="Nama Lengkap Pasien"
            required
            placeholder="Contoh: Rian Pratama"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            error={errors.fullName}
            leftIcon={<User className="w-4 h-4" aria-hidden="true" />}
            autoComplete="name"
          />

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
            id="phone"
            label="Nomor Telepon / WhatsApp"
            type="tel"
            required
            placeholder="081234567890"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            error={errors.phone}
            hint="Minimal 10 digit, diawali 08..."
            leftIcon={<Phone className="w-4 h-4" aria-hidden="true" />}
            autoComplete="tel"
          />

          <Input
            id="password"
            label="Kata Sandi"
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="Minimal 8 karakter"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
            hint="Minimal 8 karakter, mengandung huruf kapital dan angka"
            leftIcon={<Lock className="w-4 h-4" aria-hidden="true" />}
            autoComplete="new-password"
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

          <Input
            id="confirmPassword"
            label="Konfirmasi Kata Sandi"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            placeholder="Ulangi kata sandi Anda"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            leftIcon={<Lock className="w-4 h-4" aria-hidden="true" />}
            autoComplete="new-password"
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="p-1 text-slate-400 hover:text-slate-600 min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi kata sandi' : 'Tampilkan konfirmasi kata sandi'}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Eye className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            }
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Daftar Sekarang
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-600">
            Sudah memiliki akun terdaftar?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-semibold text-teal-700 hover:text-teal-800 underline focus-visible:outline-teal-600 cursor-pointer"
            >
              Masuk di sini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
