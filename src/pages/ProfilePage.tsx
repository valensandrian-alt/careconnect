/**
 * @file src/pages/ProfilePage.tsx
 * User profile management, edit profile, security disclaimer, and logout
 */

import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  LogOut,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Edit3,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { navigate } = useRouter();
  const { user, updateProfile, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    birthDate: user?.birthDate || '',
    gender: user?.gender || 'Laki-laki',
    bloodType: user?.bloodType || 'O+',
    address: user?.address || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim()) {
      setErrorMessage('Nama lengkap tidak boleh kosong.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setErrorMessage('Nomor telepon minimal 10 digit.');
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const result = await updateProfile({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      birthDate: formData.birthDate,
      gender: formData.gender as any,
      bloodType: formData.bloodType,
      address: formData.address.trim(),
    });
    setIsSaving(false);

    if (result.success) {
      setIsEditing(false);
      setSuccessMessage('Profil berhasil diperbarui!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setErrorMessage(result.error || 'Gagal menyimpan perubahan.');
    }
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-150">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Profil Pasien
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola data diri, kontak, dan preferensi akun CareConnect Anda
          </p>
        </div>

        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            leftIcon={<Edit3 className="w-3.5 h-3.5" aria-hidden="true" />}
            className="bg-white text-xs"
          >
            Ubah Profil
          </Button>
        )}
      </div>

      {successMessage && (
        <div
          className="p-3.5 bg-teal-50 border border-teal-200 text-teal-800 text-xs rounded-xl flex items-center gap-2"
          role="status"
        >
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" aria-hidden="true" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div
          className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Profile Card Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex items-center gap-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-xs">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
        </div>

        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>{user?.email}</span>
          </p>
          <div className="flex items-center gap-2 text-[11px] text-teal-800 font-semibold pt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" aria-hidden="true" />
            <span>Akun Pasien Terverifikasi</span>
          </div>
        </div>
      </div>

      {/* Profile Details Form / View */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
          Informasi Pribadi Pasien
        </h3>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4" noValidate>
            <Input
              id="editName"
              label="Nama Lengkap"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Input
              id="editPhone"
              label="Nomor Telepon / WhatsApp"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="editBirth"
                label="Tanggal Lahir"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              />

              <div className="flex flex-col gap-1.5">
                <label htmlFor="editGender" className="text-xs font-semibold text-slate-800">
                  Jenis Kelamin
                </label>
                <select
                  id="editGender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="min-h-[44px] px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="editBlood" className="text-xs font-semibold text-slate-800">
                  Golongan Darah
                </label>
                <select
                  id="editBlood"
                  value={formData.bloodType}
                  onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                  className="min-h-[44px] px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                  <option value="O+">O+</option>
                  <option value="Tidak Tahu">Tidak Tahu</option>
                </select>
              </div>

              <Input
                id="editAddress"
                label="Kota Domisili"
                placeholder="Contoh: Jakarta Selatan"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="pt-3 flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => {
                  setIsEditing(false);
                  setErrorMessage(null);
                }}
                className="flex-1"
                disabled={isSaving}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="flex-1"
                isLoading={isSaving}
                leftIcon={<Save className="w-4 h-4" aria-hidden="true" />}
              >
                Simpan Perubahan
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block mb-0.5">Nama Lengkap</span>
              <span className="font-semibold text-slate-800 text-sm">{user?.name}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block mb-0.5">Alamat Email</span>
              <span className="font-semibold text-slate-800">{user?.email}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block mb-0.5">Nomor Telepon</span>
              <span className="font-semibold text-slate-800 tabular-nums">{user?.phone}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block mb-0.5">Tanggal Lahir</span>
              <span className="font-semibold text-slate-800">{user?.birthDate || '-'}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block mb-0.5">Jenis Kelamin</span>
              <span className="font-semibold text-slate-800">{user?.gender || '-'}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block mb-0.5">Golongan Darah</span>
              <span className="font-semibold text-slate-800">{user?.bloodType || '-'}</span>
            </div>

            <div className="sm:col-span-2 p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block mb-0.5">Domisili</span>
              <span className="font-semibold text-slate-800">{user?.address || '-'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Security & Prototype Architecture Notice */}
      <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200 text-slate-600 text-xs leading-relaxed flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <strong className="text-slate-800 block">Keterangan Keamanan & Sesi Mock:</strong>
          <span>
            Aplikasi ini berjalan sebagai MVP Frontend telemedis. Sesi autentikasi disimpan di penyimpanan lokal browser. Pada lingkungan produksi penuh, sistem akan terhubung ke backend tersertifikasi ISO 27001 / HIPAA dengan sesi berbasis HttpOnly cookie dan enkripsi end-to-end.
          </span>
        </div>
      </div>

      {/* Logout Action Area */}
      <div className="pt-2">
        <Button
          variant="danger"
          size="md"
          onClick={() => setIsLogoutModalOpen(true)}
          className="w-full"
          leftIcon={<LogOut className="w-4 h-4" aria-hidden="true" />}
        >
          Keluar dari Akun (Logout)
        </Button>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: KONFIRMASI LOGOUT */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Konfirmasi Keluar"
        description="Apakah Anda yakin ingin mengakhiri sesi aktif di perangkat ini?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Anda harus masuk kembali menggunakan email dan kata sandi untuk mengakses jadwal konsultasi dan rekam medis Anda berikutnya.
          </p>

          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsLogoutModalOpen(false)}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={handleConfirmLogout}
              className="flex-1"
            >
              Ya, Keluar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
