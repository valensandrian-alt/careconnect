/**
 * @file src/data/users.ts
 * Mock users and mock authentication database
 */

import { User } from '../types';

export const DEMO_USER: User = {
  id: 'usr-demo-01',
  name: 'Rian Pratama',
  email: 'rian.pratama@example.com',
  phone: '0812-3456-7890',
  birthDate: '1994-08-15',
  gender: 'Laki-laki',
  avatarUrl: '',
  address: 'Jl. Senopati Raya No. 42, Kebayoran Baru, Jakarta Selatan',
  bloodType: 'O+',
  createdAt: '2026-01-10T08:00:00Z',
};

export const DEMO_CREDENTIALS = {
  email: 'rian.pratama@example.com',
  password: 'Password123!',
};
