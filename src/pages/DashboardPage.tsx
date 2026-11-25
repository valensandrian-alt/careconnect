/**
 * @file src/pages/DashboardPage.tsx
 * Telemedicine Patient Dashboard with greeting, upcoming reminder, specialties, and doctor recommendations
 */

import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import { SPECIALTY_CATEGORIES, MOCK_DOCTORS } from '../data/doctors';
import { Button } from '../components/ui/Button';
import { formatRupiah, formatIndoDate } from '../lib/utils';
import {
  Search,
  Calendar,
  Clock,
  Video,
  ChevronRight,
  Star,
  ShieldCheck,
  Stethoscope,
  Baby,
  Sparkles,
  HeartPulse,
  Activity,
  Eye,
  Smile,
  ArrowRight,
  BellRing,
  History,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Stethoscope,
  Baby,
  Sparkles,
  HeartPulse,
  Activity,
  Eye,
  Smile,
};

export const DashboardPage: React.FC = () => {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const { nextAppointment, upcomingAppointments } = useAppointments();
  const [searchQuery, setSearchQuery] = useState('');

  // Time-aware Indonesian greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/doctors?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/doctors');
    }
  };

  const handleSpecialtyClick = (slug: string) => {
    navigate(`/doctors?specialty=${slug}`);
  };

  // Recommended doctors: take top 3
  const recommendedDoctors = MOCK_DOCTORS.slice(0, 3);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* 1. Header & Greeting Area */}
      <section className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        {/* Subtle decorative background blur */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <span className="text-teal-200 text-xs font-semibold tracking-wide uppercase">
            {getGreeting()},
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            {user?.name || 'Pasien CareConnect'}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 mt-2 leading-relaxed">
            Butuh konsultasi dokter spesialis hari ini? Temukan jadwal praktek yang sesuai dan konsultasikan kesehatan Anda dengan cepat.
          </p>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-5 relative flex items-center">
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari dokter, spesialisasi, atau rumah sakit..."
              aria-label="Cari dokter spesialisasi atau keluhan"
              className="w-full min-h-[46px] pl-10 pr-28 py-2.5 bg-white text-slate-900 rounded-2xl text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-md"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="absolute right-1.5 min-h-[38px] text-xs px-3.5 rounded-xl bg-teal-600 hover:bg-teal-700"
            >
              Cari
            </Button>
          </form>

          {/* Primary CTA Shortcut */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/doctors')}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs min-h-[40px] px-4 backdrop-blur-xs"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />}
            >
              Jelajahi Semua Dokter
            </Button>
            <button
              onClick={() => navigate('/history')}
              className="text-xs text-teal-200 hover:text-white underline underline-offset-4 cursor-pointer p-1 min-h-[40px] flex items-center"
            >
              Lihat Riwayat Konsultasi
            </button>
          </div>
        </div>
      </section>

      {/* 2. Upcoming Consultation Reminder Card (Pengingat Konsultasi) */}
      <section aria-labelledby="upcoming-heading">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BellRing className="w-4 h-4 text-teal-600" aria-hidden="true" />
            <h2 id="upcoming-heading" className="text-base font-bold text-slate-900">
              Pengingat Konsultasi Terdekat
            </h2>
          </div>
          {upcomingAppointments.length > 1 && (
            <button
              onClick={() => navigate('/appointments')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
            >
              <span>{upcomingAppointments.length} Jadwal Lainnya</span>
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        {nextAppointment ? (
          <div className="p-5 bg-white rounded-2xl border border-teal-200/90 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <img
                  src={nextAppointment.doctorAvatar}
                  alt={nextAppointment.doctorName}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                />
                <div>
                  {/* Clean unboxed metadata (anti-pill) */}
                  <div className="flex items-center gap-2 text-xs text-teal-800 font-semibold mb-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                    <span>Konsultasi Terjadwal</span>
                    <span aria-hidden="true">·</span>
                    <span>No. Antrean {nextAppointment.queueNumber}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {nextAppointment.doctorName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {nextAppointment.doctorSpecialty} · {nextAppointment.hospital}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-3">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                      {nextAppointment.dayName}, {formatIndoDate(nextAppointment.date)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1.5 font-medium tabular-nums">
                      <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                      {nextAppointment.time} WIB
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-row md:flex-col gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/appointments')}
                  leftIcon={<Video className="w-3.5 h-3.5" aria-hidden="true" />}
                  className="flex-1 md:flex-initial"
                >
                  Buka Detail Jadwal
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/appointments')}
                  className="flex-1 md:flex-initial text-slate-600"
                >
                  Kelola Janji Temu
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-100/70 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" aria-hidden="true" />
              </div>
              <p className="text-xs text-slate-600">
                Belum ada jadwal konsultasi mendatang. Butuh bantuan medis dokter spesialis?
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/doctors')}
              className="shrink-0 text-xs"
            >
              Pesan Konsultasi
            </Button>
          </div>
        )}
      </section>

      {/* 3. Popular Specializations (Spesialisasi Populer) */}
      <section aria-labelledby="specialties-heading">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 id="specialties-heading" className="text-base font-bold text-slate-900">
              Spesialisasi Populer
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih kategori dokter spesialis yang sesuai dengan kebutuhan Anda
            </p>
          </div>
          <button
            onClick={() => navigate('/doctors')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Semua Spesialisasi</span>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {SPECIALTY_CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.iconName] || Stethoscope;
            return (
              <button
                key={cat.id}
                onClick={() => handleSpecialtyClick(cat.slug)}
                className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-teal-400 hover:shadow-xs transition-all text-left flex flex-col justify-between group cursor-pointer focus-visible:outline-teal-600 min-h-[104px]"
              >
                <div className="w-9 h-9 rounded-xl bg-teal-50 group-hover:bg-teal-600 text-teal-700 group-hover:text-white transition-colors flex items-center justify-center mb-2.5">
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    {cat.doctorCount} dokter aktif
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Recommended Doctors (Dokter Rekomendasi) */}
      <section aria-labelledby="recommended-heading">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 id="recommended-heading" className="text-base font-bold text-slate-900">
              Dokter Rekomendasi
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Dokter spesialis dengan ulasan tertinggi dan respon konsultasi cepat
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/doctors')}
            className="text-teal-700 hover:text-teal-800 text-xs"
            rightIcon={<ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />}
          >
            Lihat Semua
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3.5">
                  <img
                    src={doc.avatarUrl}
                    alt={doc.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 bg-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-teal-700 font-medium line-clamp-1">
                      {doc.specialty}
                    </p>

                    {/* Unboxed clean metadata (Zero-Pill) */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-0.5 font-bold text-slate-800">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                        <span className="tabular-nums">{doc.rating}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{doc.experienceYears} thn exp</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-700 font-medium">Online</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mt-3 leading-relaxed">
                  {doc.bio}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Biaya Konsultasi
                  </span>
                  <span className="text-xs font-bold text-slate-900 tabular-nums">
                    {formatRupiah(doc.consultationFee)}
                  </span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/doctors/${doc.id}`)}
                  className="text-xs min-h-[38px] px-3.5"
                >
                  Pilih Jadwal
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Health & Consultation Guarantee Trust Card */}
      <section className="bg-slate-100/80 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              Tenaga Medis Bersertifikat Resmi (SIP & STR Terverifikasi)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Semua dokter mitra CareConnect berpraktik aktif di rumah sakit terkemuka dan terafiliasi resmi IDI.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/history')}
          leftIcon={<History className="w-3.5 h-3.5" aria-hidden="true" />}
          className="text-xs shrink-0 bg-white"
        >
          Lihat Riwayat
        </Button>
      </section>
    </div>
  );
};
