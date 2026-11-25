/**
 * @file src/lib/utils.ts
 * Common utility functions
 */

export function cn(...inputs: (string | boolean | undefined | null)[]): string {
  return inputs.filter(Boolean).join(' ');
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatIndoDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-');
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const monthName = months[parseInt(month, 10) - 1] || month;
    return `${parseInt(day, 10)} ${monthName} ${year}`;
  } catch {
    return dateStr;
  }
}

export function generateBookingCode(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();
  return `CC-${year}-${randomNum}`;
}

export function generateQueueNumber(): string {
  const letters = ['A', 'B', 'C'];
  const letter = letters[Math.floor(Math.random() * letters.length)];
  const num = Math.floor(1 + Math.random() * 20);
  return `${letter}-${String(num).padStart(2, '0')}`;
}
