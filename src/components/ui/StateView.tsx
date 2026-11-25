/**
 * @file src/components/ui/StateView.tsx
 * Standard Empty, Error, and Loading UI states
 */

import React from 'react';
import { AlertTriangle, SearchX, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Tidak Ada Data Ditemukan',
  description = 'Coba ubah kata kunci pencarian atau sesuaikan filter yang Anda pilih.',
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border border-dashed border-slate-300 my-4">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 mb-3.5">
        {icon || <SearchX className="w-7 h-7" aria-hidden="true" />}
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Gagal Memuat Informasi',
  message = 'Terjadi kendala saat memuat data dari sistem. Silakan periksa koneksi Anda dan coba lagi.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-rose-50/50 rounded-2xl border border-rose-200 my-4" role="alert">
      <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 mb-3.5">
        <AlertTriangle className="w-7 h-7" aria-hidden="true" />
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-600 max-w-sm mb-5 leading-relaxed">{message}</p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />}
        >
          Coba Lagi
        </Button>
      )}
    </div>
  );
};

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Memuat data layanan kesehatan...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 my-4">
      <Loader2 className="w-8 h-8 text-teal-600 animate-spin mb-3" aria-hidden="true" />
      <p className="text-xs font-medium text-slate-500">{message}</p>
    </div>
  );
};
