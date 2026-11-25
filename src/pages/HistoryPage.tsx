/**
 * @file src/pages/HistoryPage.tsx
 * Consultation History with completed & cancelled records, prescriptions, and diagnosis notes
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
  History,
  CheckCircle2,
  XCircle,
  FileText,
  Pill,
  Calendar,
  Clock,
  ArrowRight,
  Stethoscope,
  Info,
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { navigate } = useRouter();
  const { historyAppointments } = useAppointments();

  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'cancelled'>('all');
  const [selectedRecord, setSelectedRecord] = useState<Appointment | null>(null);

  const filteredHistory = historyAppointments.filter((item) => {
    if (activeTab === 'completed') return item.status === 'completed';
    if (activeTab === 'cancelled') return item.status === 'cancelled';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Riwayat Konsultasi & Rekam Medis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Daftar sesi konsultasi terdahulu, catatan diagnosa dokter, dan ringkasan e-resep
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/doctors')}
          leftIcon={<Stethoscope className="w-4 h-4 text-teal-600" aria-hidden="true" />}
          className="self-start sm:self-auto bg-white"
        >
          Konsultasi Baru
        </Button>
      </div>

      {/* Filter Tabs (Interactive button tabs) */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl max-w-sm" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'all'}
          onClick={() => setActiveTab('all')}
          className={`flex-1 min-h-[38px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'all'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Semua ({historyAppointments.length})
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'completed'}
          onClick={() => setActiveTab('completed')}
          className={`flex-1 min-h-[38px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Selesai ({historyAppointments.filter((a) => a.status === 'completed').length})
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'cancelled'}
          onClick={() => setActiveTab('cancelled')}
          className={`flex-1 min-h-[38px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'cancelled'
              ? 'bg-white text-rose-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Dibatalkan ({historyAppointments.filter((a) => a.status === 'cancelled').length})
        </button>
      </div>

      {/* List Records */}
      {filteredHistory.length === 0 ? (
        <EmptyState
          title="Tidak Ada Riwayat Konsultasi"
          description={
            activeTab === 'all'
              ? 'Anda belum memiliki rekam konsultasi yang telah selesai.'
              : `Tidak ditemukan sesi dengan status ${activeTab === 'completed' ? 'Selesai' : 'Dibatalkan'}.`
          }
          actionText="Pesan Konsultasi Dokter"
          onAction={() => navigate('/doctors')}
          icon={<History className="w-7 h-7 text-slate-400" aria-hidden="true" />}
        />
      ) : (
        <div className="space-y-3.5">
          {filteredHistory.map((item) => {
            const isCompleted = item.status === 'completed';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 hover:border-slate-300 transition-all shadow-2xs flex flex-col sm:flex-row items-start justify-between gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={item.doctorAvatar}
                    alt={item.doctorName}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-slate-200 bg-slate-100 shrink-0 shadow-2xs"
                  />

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm sm:text-base font-bold text-slate-900">
                        {item.doctorName}
                      </h2>
                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                          Konsultasi Selesai
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                          <XCircle className="w-3 h-3 text-rose-600" aria-hidden="true" />
                          Dibatalkan
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-teal-800">
                      {item.doctorSpecialty} · {item.hospital}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" aria-hidden="true" />
                        <span>
                          {item.dayName}, {formatIndoDate(item.date)}
                        </span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{item.time} WIB</span>
                      <span aria-hidden="true">·</span>
                      <span>No. Antrean {item.queueNumber}</span>
                    </div>

                    {item.notes && isCompleted && (
                      <p className="text-xs text-slate-600 line-clamp-1 mt-1 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                        <strong className="text-slate-800">Diagnosa:</strong> {item.notes}
                      </p>
                    )}

                    {item.cancelReason && !isCompleted && (
                      <p className="text-xs text-rose-600 line-clamp-1 mt-1 bg-rose-50/50 p-1.5 rounded-lg border border-rose-100">
                        <strong>Alasan Batal:</strong> {item.cancelReason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <div className="sm:text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">Biaya</span>
                    <span className="text-xs font-bold text-slate-900 tabular-nums">
                      {formatRupiah(item.fee)}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRecord(item)}
                    leftIcon={<FileText className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />}
                    className="text-xs min-h-[38px] px-3"
                  >
                    Rincian Konsultasi
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: RINCIAN REKAM MEDIS & RESEP KONSULTASI */}
      {/* ========================================================================= */}
      <Modal
        isOpen={Boolean(selectedRecord)}
        onClose={() => setSelectedRecord(null)}
        title="Rincian Rekam Konsultasi"
        description={`Kode Pemesanan: ${selectedRecord?.bookingCode || '-'}`}
        maxWidth="md"
      >
        {selectedRecord && (
          <div className="space-y-4 text-xs">
            {/* Doctor info */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <img
                src={selectedRecord.doctorAvatar}
                alt={selectedRecord.doctorName}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {selectedRecord.doctorName}
                </h3>
                <p className="text-teal-700 text-xs">{selectedRecord.doctorSpecialty}</p>
                <p className="text-slate-500 text-[11px]">{selectedRecord.hospital}</p>
              </div>
            </div>

            {/* Session info */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[11px]">Pasien</span>
                <span className="font-semibold text-slate-800">{selectedRecord.patientName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Tanggal & Jam</span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  {selectedRecord.dayName}, {formatIndoDate(selectedRecord.date)} ({selectedRecord.time})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Metode</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {selectedRecord.consultationType}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Total Biaya</span>
                <span className="font-bold text-slate-900">{formatRupiah(selectedRecord.fee)}</span>
              </div>
            </div>

            {/* Complaints */}
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Keluhan Awal Pasien</h4>
              <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                {selectedRecord.symptoms || 'Tidak ada keluhan tertulis.'}
              </p>
            </div>

            {/* Notes / Diagnosis */}
            {selectedRecord.notes && (
              <div>
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-teal-600" aria-hidden="true" />
                  <span>Catatan & Diagnosa Dokter</span>
                </h4>
                <p className="p-3 bg-teal-50/50 rounded-xl border border-teal-200 text-teal-950 leading-relaxed font-medium">
                  {selectedRecord.notes}
                </p>
              </div>
            )}

            {/* Prescription */}
            {selectedRecord.prescriptionSummary && (
              <div>
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-teal-600" aria-hidden="true" />
                  <span>Resep Obat Elektronik (E-Prescription)</span>
                </h4>
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 text-emerald-950 leading-relaxed font-medium">
                  {selectedRecord.prescriptionSummary}
                </div>
              </div>
            )}

            {/* Cancellation reason if cancelled */}
            {selectedRecord.cancelReason && (
              <div>
                <h4 className="font-bold text-rose-900 mb-1 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" aria-hidden="true" />
                  <span>Alasan Pembatalan</span>
                </h4>
                <p className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 leading-relaxed">
                  {selectedRecord.cancelReason}
                </p>
              </div>
            )}

            <div className="pt-2">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setSelectedRecord(null)}
                className="w-full"
              >
                Tutup Rincian
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
