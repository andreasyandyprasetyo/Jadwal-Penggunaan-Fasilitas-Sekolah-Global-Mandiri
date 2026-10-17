import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Users, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  PlayCircle,
  Sparkles
} from 'lucide-react';
import { Booking, Department } from '../types/facility';
import { 
  formatIndonesianDate, 
  formatShortDate, 
  getBookingStatus, 
  cleanPhoneForWa 
} from '../utils/dateUtils';

interface ScheduleTableProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  onClearFilters: () => void;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({
  bookings,
  onSelectBooking,
  onClearFilters,
}) => {
  // Helper for Department badge color
  const getDepartmentBadgeStyle = (dept: Department) => {
    switch (dept) {
      case 'SD / Primary':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'SMP / Junior High':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'SMA / Senior High':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'TK / Early Childhood':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Yayasan & Manajemen':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Tata Usaha & Admin':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'Kesiswaan & OSIS':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'IT & Multimedia':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (dateStr: string, startTime: string, endTime: string) => {
    const status = getBookingStatus(dateStr, startTime, endTime);
    if (status === 'berlangsung') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
          <PlayCircle className="w-3 h-3 text-emerald-600" />
          Berlangsung
        </span>
      );
    }
    if (status === 'akan_datang') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Clock className="w-3 h-3 text-blue-500" />
          Akan Datang
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
        <CheckCircle2 className="w-3 h-3 text-slate-400" />
        Selesai
      </span>
    );
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">
          Tidak Ada Jadwal yang Cocok
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-5">
          Tidak ditemukan jadwal peminjaman fasilitas untuk kriteria pencarian dan filter yang dipilih.
        </p>
        <button
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
        >
          Reset Semua Filter
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Table Subheader / Record count */}
      <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">TABEL JADWAL PENGGUNAAN FASILITAS</span>
          <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
            {bookings.length} Agenda
          </span>
        </div>
        <div className="text-[11px] text-slate-500 italic">
          * Klik pada baris jadwal untuk melihat rincian fasilitas & perlengkapan
        </div>
      </div>

      {/* Main Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/90 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
              {/* Column 1: Date on the left */}
              <th scope="col" className="py-4 px-4 sm:px-6 w-[200px] shrink-0">
                <div className="flex items-center gap-1.5 text-slate-900">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Tanggal & Waktu</span>
                </div>
              </th>

              {/* Column 2: Name of facilities */}
              <th scope="col" className="py-4 px-4 sm:px-6 w-[220px]">
                <div className="flex items-center gap-1.5 text-slate-900">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Nama Fasilitas</span>
                </div>
              </th>

              {/* Column 3: Department using facilities */}
              <th scope="col" className="py-4 px-4 sm:px-6 w-[180px]">
                <span className="text-slate-900">Departemen / Unit</span>
              </th>

              {/* Column 4: Contact person */}
              <th scope="col" className="py-4 px-4 sm:px-6 w-[230px]">
                <div className="flex items-center gap-1.5 text-slate-900">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Penanggung Jawab</span>
                </div>
              </th>

              {/* Column 5: Occasion (Kegiatan / Acara) */}
              <th scope="col" className="py-4 px-4 sm:px-6 min-w-[280px]">
                <span className="text-slate-900">Kegiatan / Keperluan (Occasion)</span>
              </th>

              {/* Column 6: Action */}
              <th scope="col" className="py-4 px-4 text-center w-[90px] print:hidden">
                <span>Rincian</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {bookings.map((booking, idx) => {
              const { dayName, dateNum, monthYear } = formatShortDate(booking.date);
              const status = getBookingStatus(booking.date, booking.startTime, booking.endTime);
              const waLink = `https://wa.me/${cleanPhoneForWa(booking.contactPerson.phone)}?text=${encodeURIComponent(
                `Halo ${booking.contactPerson.name}, terkait jadwal penggunaan fasilitas "${booking.facility}" untuk acara "${booking.occasion}"...`
              )}`;

              return (
                <tr
                  key={booking.id}
                  onClick={() => onSelectBooking(booking)}
                  className={`group cursor-pointer transition-colors duration-150 ${
                    status === 'berlangsung'
                      ? 'bg-emerald-50/40 hover:bg-emerald-50/70'
                      : idx % 2 === 0
                      ? 'bg-white hover:bg-indigo-50/30'
                      : 'bg-slate-50/40 hover:bg-indigo-50/40'
                  }`}
                >
                  {/* 1. Date on the left */}
                  <td className="py-3.5 px-4 sm:px-6 align-top">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-12 text-center rounded-xl bg-slate-100 border border-slate-200 group-hover:border-indigo-300 py-1 shadow-xs">
                        <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                          {dayName.slice(0, 3)}
                        </span>
                        <span className="block text-base font-extrabold text-slate-900 leading-none">
                          {dateNum}
                        </span>
                        <span className="block text-[9px] font-medium text-slate-500">
                          {monthYear.split(' ')[0]}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-slate-800">
                          {formatIndonesianDate(booking.date, true)}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-600 bg-slate-100/90 px-2 py-0.5 rounded-md inline-block">
                          <Clock className="w-3 h-3 text-indigo-600 inline mr-1" />
                          {booking.startTime} - {booking.endTime} WIB
                        </div>
                        <div>
                          {getStatusBadge(booking.date, booking.startTime, booking.endTime)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 2. Name of facilities */}
                  <td className="py-3.5 px-4 sm:px-6 align-top">
                    <div className="font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
                      {booking.facility}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>Kampus Global Mandiri</span>
                    </div>
                    {booking.participantsCount && (
                      <div className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1 font-medium">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>Est. {booking.participantsCount} Peserta</span>
                      </div>
                    )}
                  </td>

                  {/* 3. Which department using facilities */}
                  <td className="py-3.5 px-4 sm:px-6 align-top">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border tracking-wide ${getDepartmentBadgeStyle(
                        booking.department
                      )}`}
                    >
                      {booking.department}
                    </span>
                  </td>

                  {/* 4. Contact person */}
                  <td className="py-3.5 px-4 sm:px-6 align-top">
                    <div className="font-semibold text-slate-900">
                      {booking.contactPerson.name}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      {booking.contactPerson.role}
                    </div>
                    <div className="flex items-center gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 transition-colors"
                        title="Chat via WhatsApp"
                      >
                        <MessageSquare className="w-3 h-3 text-emerald-600" />
                        <span>{booking.contactPerson.phone}</span>
                      </a>
                    </div>
                  </td>

                  {/* 5. Occasion (The Occasion) */}
                  <td className="py-3.5 px-4 sm:px-6 align-top">
                    <div className="font-bold text-slate-900 text-sm leading-snug">
                      {booking.occasion}
                    </div>
                    {booking.description && (
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {booking.description}
                      </p>
                    )}
                    {/* Equipment badges if any */}
                    {booking.equipmentNeeded && booking.equipmentNeeded.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 mt-2">
                        {booking.equipmentNeeded.slice(0, 3).map((item, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200"
                          >
                            {item}
                          </span>
                        ))}
                        {booking.equipmentNeeded.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            +{booking.equipmentNeeded.length - 3} lainnya
                          </span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* 6. View button */}
                  <td className="py-3.5 px-4 align-top text-center print:hidden">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBooking(booking);
                      }}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                      title="Lihat detail lengkap jadwal"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer info */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
        <span className="font-medium">
          Menampilkan {bookings.length} jadwal peminjaman fasilitas
        </span>
        <span className="text-slate-400">
          Untuk perubahan atau pembatalan jadwal, harap hubungi Bagian Sarpras & PIC tertera.
        </span>
      </div>
    </div>
  );
};
