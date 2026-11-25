/**
 * @file src/pages/DoctorDetailPage.tsx
 * Doctor profile detail, interactive date/time picker, and complete booking workflow modal
 */

import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import { MOCK_DOCTORS } from '../data/doctors';
import { Doctor, ConsultationType } from '../types';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/StateView';
import { formatRupiah, formatIndoDate } from '../lib/utils';
import {
  Star,
  Hospital,
  ShieldCheck,
  GraduationCap,
  Languages,
  Calendar,
  Clock,
  Video,
  MessageSquare,
  Building2,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
  Info,
} from 'lucide-react';

export const DoctorDetailPage: React.FC = () => {
  const { params, navigate, goBack } = useRouter();
  const { user } = useAuth();
  const { bookAppointment } = useAppointments();

  const doctorId = params.id;
  const doctor = MOCK_DOCTORS.find((d) => d.id === doctorId);

  // Booking selection states
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [consultationType, setConsultationType] = useState<ConsultationType>('video');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccessResult, setBookingSuccessResult] = useState<any | null>(null);

  // Patient booking form details
  const [patientName, setPatientName] = useState(user?.name || '');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '');
  const [symptoms, setSymptoms] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  if (!doctor) {
    return (
      <div className="py-12">
        <EmptyState
          title="Dokter Tidak Ditemukan"
          description="Profil dokter yang Anda cari tidak tersedia atau tautan salah."
          actionText="Kembali ke Daftar Dokter"
          onAction={() => navigate('/doctors')}
        />
      </div>
    );
  }

  const activeSchedule = doctor.schedule[selectedDateIndex] || doctor.schedule[0];
  const selectedSlot = activeSchedule?.slots.find((s) => s.id === selectedSlotId);

  const handleOpenBookingModal = () => {
    if (!selectedSlot) {
      // Auto-select first available slot if user hasn't chosen one
      const firstAvailable = activeSchedule.slots.find((s) => s.isAvailable);
      if (firstAvailable) {
        setSelectedSlotId(firstAvailable.id);
      }
    }
    setFormError(null);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setFormError('Nama lengkap pasien wajib diisi.');
      return;
    }
    if (!patientPhone.trim() || patientPhone.trim().length < 10) {
      setFormError('Nomor telepon pasien wajib diisi minimal 10 digit.');
      return;
    }
    if (!selectedSlot) {
      setFormError('Silakan pilih jam konsultasi yang tersedia.');
      return;
    }

    setIsSubmitting(true);
    // Simulate real booking confirmation delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      const created = await bookAppointment({
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        doctorAvatar: doctor.avatarUrl,
        hospital: doctor.hospital,
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        date: activeSchedule.date,
        dayName: activeSchedule.dayName,
        time: selectedSlot.time,
        consultationType,
        symptoms: symptoms.trim() || 'Konsultasi keluhan umum.',
        fee: doctor.consultationFee,
      });

      setIsSubmitting(false);
      setBookingSuccessResult(created);
    } catch {
      setIsSubmitting(false);
      setFormError('Gagal memproses pemesanan konsultasi. Silakan coba lagi.');
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-150">
      {/* Top back navigation button */}
      <div className="flex items-center gap-2">
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 p-2 rounded-xl hover:bg-white transition-colors cursor-pointer min-h-[44px]"
          aria-label="Kembali ke halaman sebelumnya"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Kembali</span>
        </button>
      </div>

      {/* Doctor Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <img
            src={doctor.avatarUrl}
            alt={doctor.name}
            referrerPolicy="no-referrer"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border border-slate-200 bg-slate-100 shrink-0 shadow-xs"
          />

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {doctor.name}
              </h1>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" aria-hidden="true" />
                <span>STR: {doctor.strNumber}</span>
              </span>
            </div>

            <p className="text-sm font-semibold text-teal-700">
              {doctor.specialty} · {doctor.subSpecialty}
            </p>

            <p className="text-xs text-slate-600 flex items-center gap-1.5">
              <Hospital className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span>{doctor.hospital}</span>
            </p>

            {/* Zero-Pill Unboxed Key Metrics */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1 font-bold text-slate-900">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                <span className="tabular-nums">{doctor.rating}</span>
                <span className="font-normal text-slate-500">({doctor.reviewCount} ulasan)</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums font-medium">{doctor.experienceYears} tahun pengalaman</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums font-medium">{doctor.patientCount}+ konsultasi selesai</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Details & Schedule Picker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Bio, Education, Languages */}
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-2">Tentang Dokter</h2>
              <p className="text-xs text-slate-600 leading-relaxed">{doctor.bio}</p>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-teal-700" aria-hidden="true" />
                <span>Riwayat Pendidikan</span>
              </h2>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                {doctor.education.map((edu, idx) => (
                  <li key={idx} className="leading-snug">
                    {edu}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Languages className="w-4 h-4 text-teal-700" aria-hidden="true" />
                <span>Bahasa yang Digunakan</span>
              </h2>
              <p className="text-xs text-slate-600">{doctor.languages.join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Schedule Slot Picker & Consultation Method */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Pilih Jadwal Konsultasi
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih tanggal dan jam yang tersedia sesuai waktu senggang Anda
              </p>
            </div>

            {/* 1. Date Selector (Horizontal Date Scroller) */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                1. Pilih Tanggal
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {doctor.schedule.map((sch, idx) => {
                  const isSelected = selectedDateIndex === idx;
                  return (
                    <button
                      key={sch.date}
                      type="button"
                      onClick={() => {
                        setSelectedDateIndex(idx);
                        setSelectedSlotId(null); // reset slot for new date
                      }}
                      className={`min-h-[64px] min-w-[90px] p-2.5 rounded-2xl border text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-[11px] font-medium tracking-tight">
                        {sch.dayName}
                      </span>
                      <span className="text-sm font-bold mt-0.5 tabular-nums">
                        {sch.date.split('-')[2]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Time Slot Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700">
                  2. Pilih Jam Konsultasi ({activeSchedule.dayName},{' '}
                  {formatIndoDate(activeSchedule.date)})
                </label>
                <span className="text-[11px] text-slate-400">Durasi: 30 Menit</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {activeSchedule.slots.map((slot) => {
                  const isSelected = selectedSlotId === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`min-h-[48px] p-2 rounded-xl text-center border text-xs font-semibold transition-all cursor-pointer flex flex-col items-center justify-center ${
                        !slot.isAvailable
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs ring-2 ring-teal-200'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-teal-400 hover:bg-teal-50/30'
                      }`}
                    >
                      <span className="tabular-nums">{slot.time}</span>
                      <span
                        className={`text-[10px] font-normal ${
                          isSelected ? 'text-teal-100' : 'text-slate-500'
                        }`}
                      >
                        {slot.period}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Consultation Mode */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                3. Metode Konsultasi
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setConsultationType('video')}
                  className={`min-h-[56px] p-3 rounded-2xl border text-left flex items-center gap-3 transition-colors cursor-pointer ${
                    consultationType === 'video'
                      ? 'bg-teal-50/70 border-teal-500 text-teal-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      consultationType === 'video'
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Video className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Video Call HD</span>
                    <span className="text-[10px] text-slate-500">Tatap muka daring</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setConsultationType('chat')}
                  className={`min-h-[56px] p-3 rounded-2xl border text-left flex items-center gap-3 transition-colors cursor-pointer ${
                    consultationType === 'chat'
                      ? 'bg-teal-50/70 border-teal-500 text-teal-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      consultationType === 'chat'
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Chat Dokter</span>
                    <span className="text-[10px] text-slate-500">Pesan teks & foto</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setConsultationType('klinik')}
                  className={`min-h-[56px] p-3 rounded-2xl border text-left flex items-center gap-3 transition-colors cursor-pointer ${
                    consultationType === 'klinik'
                      ? 'bg-teal-50/70 border-teal-500 text-teal-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      consultationType === 'klinik'
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Building2 className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Tatap Muka RS</span>
                    <span className="text-[10px] text-slate-500">Hadir di klinik</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Price & Primary CTA */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 block">Total Biaya Konsultasi:</span>
                <span className="text-xl font-bold text-slate-900 tabular-nums">
                  {formatRupiah(doctor.consultationFee)}
                </span>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleOpenBookingModal}
                className="w-full sm:w-auto px-8"
                rightIcon={<ChevronRight className="w-4 h-4" aria-hidden="true" />}
              >
                Pilih Jadwal & Konfirmasi
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL WORKFLOW: KONFIRMASI KONSULTASI & PEMESANAN BERHASIL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsBookingModalOpen(false);
            setBookingSuccessResult(null);
          }
        }}
        title={
          bookingSuccessResult
            ? 'Pemesanan Konsultasi Berhasil!'
            : 'Konfirmasi Jadwal Konsultasi'
        }
        description={
          bookingSuccessResult
            ? 'Janji temu Anda telah terdaftar dalam sistem CareConnect'
            : 'Periksa kembali rincian janji temu sebelum melakukan konfirmasi'
        }
        maxWidth="md"
        showCloseButton={!isSubmitting}
      >
        {/* SUCCESS VIEW */}
        {bookingSuccessResult ? (
          <div className="space-y-5 text-center py-2 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" aria-hidden="true" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Konsultasi Berhasil Dipesan!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Kode Pemesanan:{' '}
                <strong className="text-slate-800 font-mono text-sm tabular-nums">
                  {bookingSuccessResult.bookingCode}
                </strong>
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Dokter:</span>
                <span className="font-semibold text-slate-900">{doctor.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Spesialisasi:</span>
                <span className="font-semibold text-slate-900">{doctor.specialty}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Waktu:</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {bookingSuccessResult.dayName}, {formatIndoDate(bookingSuccessResult.date)} ({bookingSuccessResult.time})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">No. Antrean:</span>
                <span className="font-bold text-teal-700">{bookingSuccessResult.queueNumber}</span>
              </div>
              <div className="flex justify-between py-1 pt-2">
                <span className="text-slate-500">Total Biaya:</span>
                <span className="font-bold text-slate-900">{formatRupiah(doctor.consultationFee)}</span>
              </div>
            </div>

            {/* Navigation shortcuts (No dead ends!) */}
            <div className="space-y-2 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setIsBookingModalOpen(false);
                  navigate('/appointments');
                }}
                className="w-full"
                leftIcon={<Calendar className="w-4 h-4" aria-hidden="true" />}
              >
                Lihat Jadwal Saya
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsBookingModalOpen(false);
                    navigate('/dashboard');
                  }}
                  className="w-full text-xs"
                >
                  Ke Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsBookingModalOpen(false);
                    navigate('/history');
                  }}
                  className="w-full text-xs"
                >
                  Ke Riwayat
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* CONFIRMATION FORM */
          <form onSubmit={handleConfirmBooking} className="space-y-4" noValidate>
            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {formError}
              </div>
            )}

            {/* Appointment Summary Card */}
            <div className="bg-teal-50/50 rounded-2xl p-4 border border-teal-200 text-xs space-y-1.5">
              <div className="flex items-center gap-3 mb-2 pb-2 border-b border-teal-100">
                <img
                  src={doctor.avatarUrl}
                  alt={doctor.name}
                  className="w-10 h-10 rounded-xl object-cover border border-teal-200 shrink-0"
                />
                <div>
                  <span className="font-bold text-slate-900 block">{doctor.name}</span>
                  <span className="text-teal-800 text-[11px]">{doctor.specialty}</span>
                </div>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Tanggal & Waktu:</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {activeSchedule.dayName}, {formatIndoDate(activeSchedule.date)} · {selectedSlot?.time || '-'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Metode:</span>
                <span className="font-semibold text-slate-900 capitalize">
                  {consultationType === 'video'
                    ? 'Video Call HD'
                    : consultationType === 'chat'
                    ? 'Chat Dokter'
                    : 'Klinik / Rumah Sakit'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Rumah Sakit:</span>
                <span className="font-medium text-slate-800">{doctor.hospital}</span>
              </div>
            </div>

            {/* Patient Form Fields */}
            <Input
              id="patientName"
              label="Nama Lengkap Pasien"
              required
              placeholder="Contoh: Rian Pratama"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />

            <Input
              id="patientPhone"
              label="Nomor Telepon / WhatsApp Pasien"
              type="tel"
              required
              placeholder="081234567890"
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="symptoms" className="text-xs font-semibold text-slate-800">
                Keluhan / Gejala Utama (Opsional)
              </label>
              <textarea
                id="symptoms"
                rows={3}
                placeholder="Ceritakan singkat gejala yang Anda rasakan (misal: demam sejak kemarin, batuk berdahak)..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder:text-slate-400"
              />
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
              <span>Total Pembayaran:</span>
              <span className="text-base font-bold text-slate-900 tabular-nums">
                {formatRupiah(doctor.consultationFee)}
              </span>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setIsBookingModalOpen(false)}
                className="flex-1"
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="flex-1"
                isLoading={isSubmitting}
              >
                Konfirmasi Konsultasi
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
