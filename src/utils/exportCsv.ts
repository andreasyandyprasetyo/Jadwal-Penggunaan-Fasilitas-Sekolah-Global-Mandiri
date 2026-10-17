import { Booking } from '../types/facility';
import { formatIndonesianDate } from './dateUtils';

export function exportBookingsToCSV(bookings: Booking[]): void {
  const headers = [
    'No',
    'Tanggal',
    'Waktu Mulai',
    'Waktu Selesai',
    'Fasilitas',
    'Departemen/Unit',
    'Penanggung Jawab',
    'No. Kontak',
    'Email',
    'Kegiatan/Acara (Occasion)',
    'Jumlah Peserta',
    'Perlengkapan',
    'Catatan Khusus',
  ];

  const rows = bookings.map((b, idx) => [
    idx + 1,
    `"${b.date} (${formatIndonesianDate(b.date)})"`,
    `"${b.startTime} WIB"`,
    `"${b.endTime} WIB"`,
    `"${b.facility}"`,
    `"${b.department}"`,
    `"${b.contactPerson.name}"`,
    `"${b.contactPerson.phone}"`,
    `"${b.contactPerson.email || '-'}"`,
    `"${b.occasion.replace(/"/g, '""')}"`,
    b.participantsCount || 0,
    `"${(b.equipmentNeeded || []).join('; ')}"`,
    `"${(b.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,\uFEFF' +
    [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute(
    'download',
    `Jadwal_Fasilitas_Sekolah_Global_Mandiri_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
