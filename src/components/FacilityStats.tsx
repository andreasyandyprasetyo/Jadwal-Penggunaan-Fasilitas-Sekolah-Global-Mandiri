import React from 'react';
import { Calendar, PlayCircle, Clock3, CheckCircle2 } from 'lucide-react';
import { Booking } from '../types/facility';
import { getBookingStatus, formatDateISO } from '../utils/dateUtils';

interface FacilityStatsProps {
  bookings: Booking[];
  onFilterToday: () => void;
  onFilterOngoing: () => void;
  onFilterAll: () => void;
  activeFilter: string;
}

export const FacilityStats: React.FC<FacilityStatsProps> = ({
  bookings,
  onFilterToday,
  onFilterOngoing,
  onFilterAll,
  activeFilter,
}) => {
  const todayStr = formatDateISO(new Date());

  const todayBookings = bookings.filter((b) => b.date === todayStr);
  const ongoingBookings = bookings.filter(
    (b) => getBookingStatus(b.date, b.startTime, b.endTime) === 'berlangsung'
  );
  const upcomingBookings = bookings.filter(
    (b) => getBookingStatus(b.date, b.startTime, b.endTime) === 'akan_datang'
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6">
      {/* Stat 1: Total Penggunaan */}
      <button
        onClick={onFilterAll}
        className={`text-left p-4 rounded-2xl border transition-all ${
          activeFilter === 'all'
            ? 'bg-blue-50/80 border-blue-400 shadow-md ring-2 ring-blue-500/20'
            : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Agenda
          </span>
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {bookings.length}
        </div>
        <p className="text-xs text-slate-500 mt-1">Jadwal tercatat di sistem</p>
      </button>

      {/* Stat 2: Sedang Berlangsung */}
      <button
        onClick={onFilterOngoing}
        className={`text-left p-4 rounded-2xl border transition-all ${
          activeFilter === 'berlangsung'
            ? 'bg-emerald-50 border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
            : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Sedang Berlangsung
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <PlayCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800">
          {ongoingBookings.length}
        </div>
        <p className="text-xs text-emerald-600 font-medium mt-1">
          {ongoingBookings.length > 0 ? 'Fasilitas aktif terpakai sekarang' : 'Tidak ada aktivitas saat ini'}
        </p>
      </button>

      {/* Stat 3: Jadwal Hari Ini */}
      <button
        onClick={onFilterToday}
        className={`text-left p-4 rounded-2xl border transition-all ${
          activeFilter === 'today'
            ? 'bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-500/20'
            : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Jadwal Hari Ini
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Clock3 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-amber-800">
          {todayBookings.length}
        </div>
        <p className="text-xs text-amber-600 font-medium mt-1">
          Agenda terdaftar untuk hari ini
        </p>
      </button>

      {/* Stat 4: Fasilitas Siap Digunakan */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Akan Datang
          </span>
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-indigo-900">
          {upcomingBookings.length}
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Kegiatan terjadwal berikutnya
        </p>
      </div>
    </div>
  );
};
