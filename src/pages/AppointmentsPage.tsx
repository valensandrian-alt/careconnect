/**
 * @file src/pages/AppointmentsPage.tsx
 * Upcoming consultations schedule, reminders, room link, reschedule & cancellation management
 */

import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAppointments } from '../context/AppointmentContext';
import { Appointment } from '../types';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/StateView';
import { formatRupiah, formatIndoDate } from '../lib/utils';
import {
  Calendar,
  Clock,
  Video,
  MessageSquare,
  Building2,
  CalendarDays,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

export const AppointmentsPage: React.FC = () => {
  const { navigate } = useRouter();
  const { upcomingAppointments, cancelAppointment, rescheduleAppointment } = useAppointments();

  // Active interaction states
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const handleOpenCancel = (apt: Appointment) => {
    setSelectedApt(apt);
    setCancelReason('');
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedApt) return;
    setIsActionLoading(true);
    await cancelAppointment(selectedApt.id, cancelReason || 'Dibatalkan oleh pasien');
    setIsActionLoading(false);
    setIsCancelModalOpen(false);
    setActionSuccessMessage(`Jadwal konsultasi bersama ${selectedApt.doctorName} telah dibatalkan.`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleOpenRoom = (apt: Appointment) => {
    setSelectedApt(apt);
    setIsRoomModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Jadwal Konsultasi Mendatang
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola janji temu dokter yang telah dijadwalkan dan masuki ruang konsultasi daring
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/doctors')}
          leftIcon={<CalendarDays className="w-4 h-4" aria-hidden="true" />}
          className="self-start sm:self-auto"
        >
          Buat Janji Baru
        </Button>
      </div>

      {actionSuccessMessage && (
        <div
          className="p-3.5 bg-teal-50 border border-teal-200 text-teal-800 text-xs rounded-xl flex items-center gap-2"
          role="status"
        >
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" aria-hidden="true" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Appointment List / Empty State */}
      {upcomingAppointments.length === 0 ? (
        <EmptyState
          title="Belum Ada Jadwal Konsultasi Mendatang"
          description="Anda belum memiliki janji temu yang aktif saat ini. Butuh konsultasi dokter spesialis hari ini?"
          actionText="Cari Dokter Spesialis"
          onAction={() => navigate('/doctors')}
          icon={<Calendar className="w-7 h-7 text-slate-400" aria-hidden="true" />}
        />
      ) : (
        <div className="space-y-4">
          {upcomingAppointments.map((apt, index) => {
            const isFirst = index === 0;

            return (
              <div
                key={apt.id}
                className={`bg-white rounded-2xl border p-5 transition-all ${
                  isFirst
                    ? 'border-teal-300 ring-1 ring-teal-200/50 shadow-sm'
                    : 'border-slate-200 shadow-2xs hover:border-slate-300'
                }`}
              >
                {/* Notice for earliest appointment */}
                {isFirst && (
                  <div className="flex items-center gap-1.5 text-xs text-teal-800 font-semibold mb-3">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                    <span>Konsultasi Berikutnya (Terdekat)</span>
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Doctor & Appointment info */}
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={apt.doctorAvatar}
                      alt={apt.doctorName}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 bg-slate-100 shrink-0 shadow-2xs"
                    />

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900">
                          {apt.doctorName}
                        </h2>
                        {/* Status text unboxed */}
                        <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                          Terjadwal
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-teal-800">
                        {apt.doctorSpecialty} · {apt.hospital}
                      </p>

                      <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-600 pt-1">
                        <span className="flex items-center gap-1 font-semibold text-slate-900">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                          <span>
                            {apt.dayName}, {formatIndoDate(apt.date)}
                          </span>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1 tabular-nums font-semibold text-slate-900">
                          <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                          <span>{apt.time} WIB</span>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="text-teal-700 font-semibold">
                          Antrean: {apt.queueNumber}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 pt-1">
                        <strong className="text-slate-700">Pasien:</strong> {apt.patientName} ·{' '}
                        <strong className="text-slate-700">Kode:</strong>{' '}
                        <span className="font-mono text-slate-800">{apt.bookingCode}</span>
                      </p>

                      {apt.symptoms && (
                        <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-xl border border-slate-100">
                          &ldquo;{apt.symptoms}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenRoom(apt)}
                      leftIcon={
                        apt.consultationType === 'chat' ? (
                          <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                        ) : (
                          <Video className="w-3.5 h-3.5" aria-hidden="true" />
                        )
                      }
                      className="w-full"
                    >
                      Masuk Ruang Konsultasi
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenCancel(apt)}
                      className="w-full text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200"
                    >
                      Batalkan Janji
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: RUANG KONSULTASI TELEMEDIS (SIMULASI TELEMEDIS AKTIF) */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        title="Ruang Konsultasi Telemedis"
        description="Sambungan telekonsultasi aman terenkripsi CareConnect"
        maxWidth="md"
      >
        {selectedApt && (
          <div className="space-y-4">
            <div className="bg-slate-900 rounded-2xl p-6 text-white text-center relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-teal-400 mx-auto mb-3 flex items-center justify-center overflow-hidden">
                <img
                  src={selectedApt.doctorAvatar}
                  alt={selectedApt.doctorName}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-base font-bold text-white">{selectedApt.doctorName}</h3>
              <p className="text-xs text-teal-300 mt-0.5">{selectedApt.doctorSpecialty}</p>

              <div className="inline-flex items-center gap-2 mt-4 px-3 py-1 bg-teal-500/20 text-teal-200 rounded-full text-xs">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span>Dokter siap terhubung pada jam jadwal</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Pasien:</span>
                <span className="font-semibold text-slate-800">{selectedApt.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jadwal:</span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  {selectedApt.dayName}, {formatIndoDate(selectedApt.date)} ({selectedApt.time} WIB)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">No. Antrean:</span>
                <span className="font-bold text-teal-700">{selectedApt.queueNumber}</span>
              </div>
            </div>

            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-[11px] text-teal-900 leading-relaxed">
              <strong>Panduan Konsultasi:</strong> Pastikan mikrofon dan kamera peramban Anda aktif. Tautan ruang telekonsultasi akan otomatis membuka sesi tatap muka langsung begitu waktu jadwal dimulai.
            </div>

            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsRoomModalOpen(false)}
              className="w-full"
            >
              Tutup Ruang Konsultasi
            </Button>
          </div>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL: BATALKAN JANJI TEMU */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => !isActionLoading && setIsCancelModalOpen(false)}
        title="Batalkan Janji Konsultasi?"
        description="Tindakan ini akan membatalkan jadwal yang telah dikonfirmasi"
        maxWidth="sm"
      >
        {selectedApt && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin membatalkan janji konsultasi bersama{' '}
              <strong>{selectedApt.doctorName}</strong> pada{' '}
              <strong>
                {selectedApt.dayName}, {formatIndoDate(selectedApt.date)} ({selectedApt.time})
              </strong>
              ?
            </p>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="cancelReason" className="text-xs font-semibold text-slate-800">
                Alasan Pembatalan (Opsional)
              </label>
              <textarea
                id="cancelReason"
                rows={2}
                placeholder="Contoh: Jadwal bentrok, kondisi membaik..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsCancelModalOpen(false)}
                className="flex-1"
                disabled={isActionLoading}
              >
                Kembali
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={handleConfirmCancel}
                className="flex-1"
                isLoading={isActionLoading}
              >
                Ya, Batalkan
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
