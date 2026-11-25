/**
 * @file src/data/doctors.ts
 * Mock doctor catalog and specialties for CareConnect
 */

import { Doctor, SpecialtyCategory, DoctorDailySchedule } from '../types';

import docSarahImg from '../assets/images/doc_sarah_anak_1791429474239.jpg';
import docBudiImg from '../assets/images/doc_budi_umum_1791429488327.jpg';
import docMayaImg from '../assets/images/doc_maya_kulit_1791429499898.jpg';
import docDimasImg from '../assets/images/doc_dimas_jantung_1791429510473.jpg';

// Helper to generate dynamic dates starting from today
export function getRelativeDate(offsetDays: number): { dateStr: string; dayName: string; formattedDisplay: string } {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  const daysIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthsIndo = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayName = daysIndo[d.getDay()];
  const formattedDisplay = `${d.getDate()} ${monthsIndo[d.getMonth()]} ${year}`;

  return { dateStr, dayName, formattedDisplay };
}

function generateDoctorSchedule(offsetDaysList: number[]): DoctorDailySchedule[] {
  return offsetDaysList.map((offset) => {
    const { dateStr, dayName } = getRelativeDate(offset);
    return {
      date: dateStr,
      dayName,
      slots: [
        { id: `${dateStr}-s1`, time: '09:00 - 09:30', period: 'Pagi', isAvailable: true },
        { id: `${dateStr}-s2`, time: '10:00 - 10:30', period: 'Pagi', isAvailable: true },
        { id: `${dateStr}-s3`, time: '11:00 - 11:30', period: 'Pagi', isAvailable: offset !== 0 },
        { id: `${dateStr}-s4`, time: '13:30 - 14:00', period: 'Siang', isAvailable: true },
        { id: `${dateStr}-s5`, time: '14:30 - 15:00', period: 'Siang', isAvailable: true },
        { id: `${dateStr}-s6`, time: '16:00 - 16:30', period: 'Sore', isAvailable: true },
        { id: `${dateStr}-s7`, time: '19:00 - 19:30', period: 'Malam', isAvailable: true },
      ],
    };
  });
}

export const SPECIALTY_CATEGORIES: SpecialtyCategory[] = [
  {
    id: 'sp-1',
    name: 'Dokter Umum',
    slug: 'umum',
    iconName: 'Stethoscope',
    description: 'Konsultasi keluhan umum, demam, flu, dan pemeriksaan awal.',
    doctorCount: 18,
  },
  {
    id: 'sp-2',
    name: 'Spesialis Anak (Pediatri)',
    slug: 'anak',
    iconName: 'Baby',
    description: 'Kesehatan bayi, balita, tumbuh kembang anak, dan imunisasi.',
    doctorCount: 12,
  },
  {
    id: 'sp-3',
    name: 'Spesialis Kulit & Kelamin',
    slug: 'kulit',
    iconName: 'Sparkles',
    description: 'Jerawat, eksim, alergi kulit, perawatan rambut dan estetika.',
    doctorCount: 9,
  },
  {
    id: 'sp-4',
    name: 'Spesialis Jantung & Pembuluh',
    slug: 'jantung',
    iconName: 'HeartPulse',
    description: 'Tekanan darah tinggi, aritmia, nyeri dada, dan kesehatan kardiovaskular.',
    doctorCount: 7,
  },
  {
    id: 'sp-5',
    name: 'Spesialis Penyakit Dalam',
    slug: 'penyakit-dalam',
    iconName: 'Activity',
    description: 'Diabetes, lambung/GERD, hipertensi, tiroid, dan organ dalam.',
    doctorCount: 14,
  },
  {
    id: 'sp-6',
    name: 'Spesialis Mata',
    slug: 'mata',
    iconName: 'Eye',
    description: 'Gangguan refraksi, iritasi, katarak, dan kelelahan mata digital.',
    doctorCount: 8,
  },
  {
    id: 'sp-7',
    name: 'Spesialis Gigi & Mulut',
    slug: 'gigi',
    iconName: 'Smile',
    description: 'Sakit gigi, gusi berdarah, pembersihan karang, dan konsultasi ortodonti.',
    doctorCount: 10,
  },
];

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'dr. Sarah Amanda, Sp.A',
    specialty: 'Spesialis Anak (Pediatri)',
    specialtySlug: 'anak',
    subSpecialty: 'Tumbuh Kembang & Nutrisi Anak',
    rating: 4.9,
    reviewCount: 342,
    experienceYears: 9,
    hospital: 'RS Ibu & Anak Bunda Sejahtera, Jakarta',
    avatarUrl: docSarahImg,
    bio: 'dr. Sarah Amanda, Sp.A berfokus pada kesehatan bayi dan anak, penanganan demam, gangguan pencernaan anak, alergi susu sapi, serta pemantauan kurva pertumbuhan gizi anak.',
    consultationFee: 125000,
    availableDays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
    schedule: generateDoctorSchedule([0, 1, 2, 3, 4]),
    strNumber: 'STR-3171-8849-0129',
    education: [
      'Spesialis Ilmu Kesehatan Anak - Fakultas Kedokteran Universitas Indonesia (2017)',
      'Dokter Umum - Fakultas Kedokteran Universitas Indonesia (2012)'
    ],
    languages: ['Bahasa Indonesia', 'English'],
    isOnline: true,
    patientCount: 1850,
  },
  {
    id: 'doc-2',
    name: 'dr. Budi Santoso',
    specialty: 'Dokter Umum',
    specialtySlug: 'umum',
    subSpecialty: 'Pelayanan Primer & Preventif',
    rating: 4.8,
    reviewCount: 520,
    experienceYears: 7,
    hospital: 'Klinik Pratama Medika Sehat, Jakarta Selatan',
    avatarUrl: docBudiImg,
    bio: 'dr. Budi Santoso berpengalaman melayani konsultasi keluhan umum seperti flu, batuk alergi, migrain, gangguan pencernaan akut, serta interpretasi hasil laboratorium rutin.',
    consultationFee: 65000,
    availableDays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
    schedule: generateDoctorSchedule([0, 1, 2, 3]),
    strNumber: 'STR-3174-5512-9011',
    education: [
      'Pendidikan Profesi Dokter - Universitas Gadjah Mada (2019)',
      'Sarjana Kedokteran - Universitas Gadjah Mada (2017)'
    ],
    languages: ['Bahasa Indonesia', 'Jawa', 'English'],
    isOnline: true,
    patientCount: 3200,
  },
  {
    id: 'doc-3',
    name: 'dr. Maya Kartika, Sp.DVE',
    specialty: 'Spesialis Kulit & Kelamin',
    specialtySlug: 'kulit',
    subSpecialty: 'Dermatologi Estetika & Alergi Kulit',
    rating: 4.95,
    reviewCount: 418,
    experienceYears: 11,
    hospital: 'Siloam Hospitals Kebon Jeruk, Jakarta Barat',
    avatarUrl: docMayaImg,
    bio: 'dr. Maya Kartika, Sp.DVE adalah dokter spesialis dermatologi dan venereologi yang ramah dan teliti dalam mendiagnosis masalah jerawat kronis, eksim atopik, psoriasis, serta hiperpigmentasi.',
    consultationFee: 175000,
    availableDays: ['Senin', 'Rabu', 'Kamis', 'Sabtu'],
    schedule: generateDoctorSchedule([0, 1, 3, 5]),
    strNumber: 'STR-3172-7741-4322',
    education: [
      'Spesialis Dermatologi & Venereologi - Universitas Airlangga (2015)',
      'Dokter Umum - Universitas Airlangga (2010)'
    ],
    languages: ['Bahasa Indonesia', 'English'],
    isOnline: false,
    patientCount: 2410,
  },
  {
    id: 'doc-4',
    name: 'dr. Dimas Prasetyo, Sp.JP, FIHA',
    specialty: 'Spesialis Jantung & Pembuluh',
    specialtySlug: 'jantung',
    subSpecialty: 'Kardiologi Intervensi & Hipertensi',
    rating: 4.9,
    reviewCount: 289,
    experienceYears: 14,
    hospital: 'RS Jantung & Pembuluh Darah Harapan Medika, Jakarta Pusat',
    avatarUrl: docDimasImg,
    bio: 'dr. Dimas Prasetyo, Sp.JP berdedikasi dalam pencegahan penyakit jantung koroner, tata laksana hipertensi resisten, penanganan aritmia, dan panduan gaya hidup sehat pasien pasca-pasang ring.',
    consultationFee: 220000,
    availableDays: ['Selasa', 'Kamis', 'Jumat'],
    schedule: generateDoctorSchedule([1, 2, 4]),
    strNumber: 'STR-3173-9912-7801',
    education: [
      'Fellow of Indonesian Heart Association (FIHA) (2016)',
      'Spesialis Jantung dan Pembuluh Darah - Universitas Indonesia (2012)',
      'Dokter Umum - Universitas Diponegoro (2007)'
    ],
    languages: ['Bahasa Indonesia', 'English'],
    isOnline: true,
    patientCount: 1640,
  },
  {
    id: 'doc-5',
    name: 'dr. Nadia Safitri, Sp.PD',
    specialty: 'Spesialis Penyakit Dalam',
    specialtySlug: 'penyakit-dalam',
    subSpecialty: 'Gastroenterologi & Hepatologi',
    rating: 4.88,
    reviewCount: 310,
    experienceYears: 10,
    hospital: 'RS Premier Jatinegara, Jakarta Timur',
    avatarUrl: docMayaImg, // fallback portrait
    bio: 'dr. Nadia Safitri, Sp.PD berpengalaman menangani gangguan lambung kronis (GERD/Dispepsia), diabetes mellitus, asam urat, gangguan tiroid, dan sindrom metabolik.',
    consultationFee: 160000,
    availableDays: ['Senin', 'Selasa', 'Rabu', 'Jumat'],
    schedule: generateDoctorSchedule([0, 1, 2, 4]),
    strNumber: 'STR-3175-6623-1109',
    education: [
      'Spesialis Ilmu Penyakit Dalam - Universitas Padjadjaran (2016)',
      'Dokter Umum - Universitas Padjadjaran (2011)'
    ],
    languages: ['Bahasa Indonesia', 'English', 'Sunda'],
    isOnline: true,
    patientCount: 1980,
  },
  {
    id: 'doc-6',
    name: 'dr. Kevin Wijaya, Sp.M',
    specialty: 'Spesialis Mata',
    specialtySlug: 'mata',
    subSpecialty: 'Kornea & Infeksi Mata Luar',
    rating: 4.82,
    reviewCount: 195,
    experienceYears: 8,
    hospital: 'Jakarta Eye Center (JEC) Menteng',
    avatarUrl: docBudiImg, // fallback portrait
    bio: 'dr. Kevin Wijaya, Sp.M melayani telekonsultasi untuk iritasi mata, konjungtivitis, mata lelah karena layar gawai (Computer Vision Syndrome), dan rujukan operasi katarak.',
    consultationFee: 140000,
    availableDays: ['Rabu', 'Kamis', 'Sabtu'],
    schedule: generateDoctorSchedule([0, 2, 3]),
    strNumber: 'STR-3171-4439-8802',
    education: [
      'Spesialis Mata - Universitas Indonesia (2018)',
      'Dokter Umum - Universitas Katolik Atma Jaya (2013)'
    ],
    languages: ['Bahasa Indonesia', 'English', 'Mandarin'],
    isOnline: true,
    patientCount: 1120,
  },
];
