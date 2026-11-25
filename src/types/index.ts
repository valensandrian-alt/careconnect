/**
 * @file src/types/index.ts
 * Type definitions for CareConnect Telemedicine application
 */

export type UserGender = 'Laki-laki' | 'Perempuan' | 'Lainnya';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate?: string;
  gender?: UserGender;
  avatarUrl?: string;
  address?: string;
  bloodType?: string;
  createdAt: string;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface DoctorScheduleSlot {
  id: string;
  time: string; // e.g. "09:00 - 09:30"
  period: 'Pagi' | 'Siang' | 'Sore' | 'Malam';
  isAvailable: boolean;
}

export interface DoctorDailySchedule {
  date: string; // ISO date format YYYY-MM-DD
  dayName: string; // e.g. "Senin", "Selasa"
  slots: DoctorScheduleSlot[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  specialtySlug: string;
  subSpecialty?: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  hospital: string;
  avatarUrl: string;
  bio: string;
  consultationFee: number;
  availableDays: string[];
  schedule: DoctorDailySchedule[];
  strNumber: string;
  education: string[];
  languages: string[];
  isOnline: boolean;
  patientCount: number;
}

export type ConsultationType = 'video' | 'chat' | 'klinik';

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  bookingCode: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  hospital: string;
  patientName: string;
  patientPhone: string;
  date: string; // YYYY-MM-DD
  dayName: string;
  time: string; // "09:00 - 09:30"
  consultationType: ConsultationType;
  symptoms: string;
  fee: number;
  status: AppointmentStatus;
  queueNumber: string;
  meetLink?: string;
  notes?: string;
  prescriptionSummary?: string;
  cancelReason?: string;
  createdAt: string;
}

export interface SpecialtyCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  doctorCount: number;
}

export interface DoctorFilterState {
  searchQuery: string;
  specialty: string;
  dayFilter: 'all' | 'today' | 'tomorrow' | 'week';
  sortBy: 'recommended' | 'rating' | 'experience' | 'fee-low' | 'fee-high';
  onlyOnline: boolean;
}
