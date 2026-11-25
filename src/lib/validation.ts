/**
 * @file src/lib/validation.ts
 * Form validation schemas and error messages
 */

import { RegisterFormData, LoginFormData } from '../types';

export interface ValidationErrors {
  [key: string]: string;
}

export function validateEmail(email: string): string | null {
  if (!email || !email.trim()) {
    return 'Alamat email wajib diisi.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Format alamat email tidak valid (contoh: nama@email.com).';
  }
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone || !phone.trim()) {
    return 'Nomor telepon wajib diisi.';
  }
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.length < 10) {
    return 'Nomor telepon minimal terdiri dari 10 digit angka.';
  }
  if (!cleanPhone.startsWith('08') && !cleanPhone.startsWith('628')) {
    return 'Nomor telepon harus diawali 08... atau 628...';
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return 'Kata sandi wajib diisi.';
  }
  if (password.length < 8) {
    return 'Kata sandi minimal 8 karakter.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Kata sandi harus mengandung minimal 1 huruf kapital (A-Z).';
  }
  if (!/[0-9]/.test(password)) {
    return 'Kata sandi harus mengandung minimal 1 angka (0-9).';
  }
  return null;
}

export function validateRegisterForm(data: RegisterFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.fullName || data.fullName.trim().length < 3) {
    errors.fullName = 'Nama lengkap wajib diisi minimal 3 karakter.';
  }

  const emailErr = validateEmail(data.email);
  if (emailErr) errors.email = emailErr;

  const phoneErr = validatePhone(data.phone);
  if (phoneErr) errors.phone = phoneErr;

  const passErr = validatePassword(data.password);
  if (passErr) errors.password = passErr;

  if (!data.confirmPassword) {
    errors.confirmPassword = 'Konfirmasi kata sandi wajib diisi.';
  } else if (data.confirmPassword !== data.password) {
    errors.confirmPassword = 'Kata sandi dan konfirmasi kata sandi tidak cocok.';
  }

  return errors;
}

export function validateLoginForm(data: LoginFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  const emailErr = validateEmail(data.email);
  if (emailErr) errors.email = emailErr;

  if (!data.password) {
    errors.password = 'Kata sandi wajib diisi.';
  } else if (data.password.length < 6) {
    errors.password = 'Kata sandi minimal 6 karakter.';
  }

  return errors;
}
