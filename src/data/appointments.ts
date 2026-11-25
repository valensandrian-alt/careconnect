/**
 * @file src/data/appointments.ts
 * Seed data and storage manager for user appointments
 */

import { Appointment } from '../types';
import { getRelativeDate } from './doctors';
import docSarahImg from '../assets/images/doc_sarah_anak_1791429474239.jpg';
import docBudiImg from '../assets/images/doc_budi_umum_1791429488327.jpg';
import docMayaImg from '../assets/images/doc_maya_kulit_1791429499898.jpg';

const STORAGE_KEY = 'careconnect_appointments_v1';

export function getInitialAppointments(): Appointment[] {
  const tomorrow = getRelativeDate(1);
  const pastWeek = getRelativeDate(-7);
  const pastTwoWeeks = getRelativeDate(-14);

  return [
    {
      id: 'apt-001',
      bookingCode: 'CC-2026-8819',
      doctorId: 'doc-1',
      doctorName: 'dr. Sarah Amanda, Sp.A',
      doctorSpecialty: 'Spesialis Anak (Pediatri)',
      doctorAvatar: docSarahImg,
      hospital: 'RS Ibu & Anak Bunda Sejahtera, Jakarta',
      patientName: 'Rian Pratama (Anak: Kenzo - 3 Th)',
      patientPhone: '0812-3456-7890',
      date: tomorrow.dateStr,
      dayName: tomorrow.dayName,
      time: '10:00 - 10:30',
      consultationType: 'video',
      symptoms: 'Demam 38.2°C naik turun sejak 2 hari yang lalu, disertai batuk ringan dan nafsu makan berkurang.',
      fee: 125000,
      status: 'upcoming',
      queueNumber: 'A-04',
      meetLink: 'https://careconnect.id/room/cc-video-8819',
      notes: 'Harap persiapkan riwayat konsumsi obat penurun panas dan termometer digital saat sesi.',
      createdAt: '2026-10-06T14:30:00Z',
    },
    {
      id: 'apt-002',
      bookingCode: 'CC-2026-7241',
      doctorId: 'doc-2',
      doctorName: 'dr. Budi Santoso',
      doctorSpecialty: 'Dokter Umum',
      doctorAvatar: docBudiImg,
      hospital: 'Klinik Pratama Medika Sehat, Jakarta Selatan',
      patientName: 'Rian Pratama',
      patientPhone: '0812-3456-7890',
      date: pastWeek.dateStr,
      dayName: pastWeek.dayName,
      time: '14:30 - 15:00',
      consultationType: 'chat',
      symptoms: 'Nyeri tenggorokan saat menelan dan sakit kepala sebelah kiri setelah kehujanan.',
      fee: 65000,
      status: 'completed',
      queueNumber: 'B-12',
      notes: 'Pasien didiagnosis Faringitis Akut ringan. Disarankan istirahat cukup dan banyak minum air hangat.',
      prescriptionSummary: 'Paracetamol 500mg (3x1 sesudah makan), Vitamin C 500mg (1x1), Lozenges antiseptik tenggorokan.',
      createdAt: '2026-09-30T10:00:00Z',
    },
    {
      id: 'apt-003',
      bookingCode: 'CC-2026-6102',
      doctorId: 'doc-3',
      doctorName: 'dr. Maya Kartika, Sp.DVE',
      doctorSpecialty: 'Spesialis Kulit & Kelamin',
      doctorAvatar: docMayaImg,
      hospital: 'Siloam Hospitals Kebon Jeruk, Jakarta Barat',
      patientName: 'Rian Pratama',
      patientPhone: '0812-3456-7890',
      date: pastTwoWeeks.dateStr,
      dayName: pastTwoWeeks.dayName,
      time: '16:00 - 16:30',
      consultationType: 'video',
      symptoms: 'Ruam kemerahan gatal di kedua lengan setelah mengonsumsi udang laut.',
      fee: 175000,
      status: 'completed',
      queueNumber: 'C-08',
      notes: 'Urtikaria akut / alergi seafood. Keluhan membaik setelah pengobatan antihistamin oral.',
      prescriptionSummary: 'Cetirizine 10mg (1x1 malam), Krim hidrokortison 1% oles tipis 2x sehari pada area gatal.',
      createdAt: '2026-09-23T11:15:00Z',
    },
    {
      id: 'apt-004',
      bookingCode: 'CC-2026-5510',
      doctorId: 'doc-2',
      doctorName: 'dr. Budi Santoso',
      doctorSpecialty: 'Dokter Umum',
      doctorAvatar: docBudiImg,
      hospital: 'Klinik Pratama Medika Sehat, Jakarta Selatan',
      patientName: 'Rian Pratama',
      patientPhone: '0812-3456-7890',
      date: getRelativeDate(-20).dateStr,
      dayName: getRelativeDate(-20).dayName,
      time: '09:00 - 09:30',
      consultationType: 'klinik',
      symptoms: 'Pemeriksaan tensi rutin bulanan dan konsultasi hasil lab darah asam urat.',
      fee: 65000,
      status: 'cancelled',
      queueNumber: 'A-02',
      cancelReason: 'Ada agenda rapat mendadak di kantor pada jam yang sama.',
      createdAt: '2026-09-15T08:00:00Z',
    },
  ];
}

export function loadStoredAppointments(): Appointment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialAppointments();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw) as Appointment[];
  } catch {
    return getInitialAppointments();
  }
}

export function saveStoredAppointments(appointments: Appointment[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  } catch (err) {
    console.error('Failed to save appointments to localStorage', err);
  }
}
