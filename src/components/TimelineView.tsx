import React, { useState } from 'react';
import { Booking, FacilityType } from '../types/facility';
import { FACILITIES_LIST, formatDateISO } from '../data/mockData';
import { formatIndonesianDate, checkTimeOverlap } from '../utils/dateUtils';
import { ChevronLeft, ChevronRight, Clock, Info } from 'lucide-react';

interface TimelineViewProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  onOpenBookingForSlot?: (facility: FacilityType, date: string, startHour: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  bookings,
  onSelectBooking,
  onOpenBookingForSlot,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(formatDateISO(new Date()));

  const hours = [
    '07:00', '08:00', '09:00', '10:00', '11:00', 
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(formatDateISO(d));
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(formatDateISO(d));
  };

  const handleToday = () => {
    setSelectedDate(formatDateISO(new Date()));
  };

  const dayBookings = bookings.filter((b) => b.date === selectedDate);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      {/* Date Header Controls */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block">
            Visual Jadwal Ruangan & Sarana
          </span>
          <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2 mt-0.5">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>{formatIndonesianDate(selectedDate, true)}</span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 transition-colors"
          >
            Hari Ini
          </button>
          <div className="flex items-center bg-white/10 rounded-lg p-0.5 border border-white/20">
            <button
              onClick={handlePrevDay}
              className="p-1.5 hover:bg-white/20 rounded-md transition-colors"
              title="Hari Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs text-white px-2 py-1 outline-none text-center font-medium cursor-pointer"
            />
            <button
              onClick={handleNextDay}
              className="p-1.5 hover:bg-white/20 rounded-md transition-colors"
              title="Hari Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Helper Legend */}
      <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-indigo-600 inline-block"></span>
            <span>Terpakai (Klik untuk rincian)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-50 border border-emerald-200 inline-block"></span>
            <span>Tersedia / Kosong</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-500 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Total {dayBookings.length} kegiatan pada tanggal ini</span>
        </div>
      </div>

      {/* Grid Timeline Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Hour Headers */}
          <div className="grid grid-cols-[220px_repeat(11,1fr)] bg-slate-100 border-b border-slate-200 text-center text-xs font-bold text-slate-700">
            <div className="py-2.5 px-3 text-left border-r border-slate-200">
              Fasilitas
            </div>
            {hours.map((hr) => (
              <div key={hr} className="py-2.5 border-r border-slate-200 font-mono text-[11px]">
                {hr}
              </div>
            ))}
          </div>

          {/* Rows per facility */}
          <div className="divide-y divide-slate-100 text-xs">
            {FACILITIES_LIST.map((fac) => {
              // Find bookings for this facility on selected date
              const facBookings = dayBookings.filter((b) => b.facility === fac.id);

              return (
                <div
                  key={fac.id}
                  className="grid grid-cols-[220px_repeat(11,1fr)] hover:bg-slate-50/70 transition-colors"
                >
                  {/* Facility Name cell */}
                  <div className="p-3 border-r border-slate-200 bg-white">
                    <div className="font-bold text-slate-900 truncate" title={fac.name}>
                      {fac.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {fac.floor} • Kapasitas {fac.capacity}
                    </div>
                  </div>

                  {/* Hourly cells */}
                  {hours.map((hr, idx) => {
                    const nextHr = hours[idx + 1] || '18:00';

                    // Check if any booking overlaps with this slot
                    const matchedBooking = facBookings.find((b) =>
                      checkTimeOverlap(hr, nextHr, b.startTime, b.endTime)
                    );

                    if (matchedBooking) {
                      return (
                        <div
                          key={hr}
                          onClick={() => onSelectBooking(matchedBooking)}
                          className="p-1 border-r border-slate-200 bg-indigo-50/60 cursor-pointer relative group flex flex-col justify-center"
                          title={`${matchedBooking.occasion} (${matchedBooking.department}) - Klik detail`}
                        >
                          <div className="w-full h-full min-h-[38px] rounded bg-indigo-600 text-white p-1 text-[10px] font-medium leading-tight shadow-xs overflow-hidden flex flex-col justify-between">
                            <span className="truncate font-semibold">{matchedBooking.occasion}</span>
                            <span className="text-[9px] text-indigo-200 truncate">
                              {matchedBooking.department.split('/')[0]}
                            </span>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={hr}
                        onClick={() => {
                          if (onOpenBookingForSlot) {
                            onOpenBookingForSlot(fac.id, selectedDate, hr);
                          }
                        }}
                        className="p-1 border-r border-slate-200 hover:bg-emerald-50/50 cursor-pointer flex items-center justify-center transition-colors group"
                        title={`Tersedia pada ${hr}. Klik untuk ajukan jadwal.`}
                      >
                        <span className="text-[10px] text-transparent group-hover:text-emerald-700 font-medium">
                          + Ajukan
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
