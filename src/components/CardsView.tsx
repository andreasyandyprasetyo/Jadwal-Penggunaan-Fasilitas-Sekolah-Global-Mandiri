import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  MessageSquare, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Booking } from '../types/facility';
import { formatIndonesianDate, cleanPhoneForWa, getBookingStatus } from '../utils/dateUtils';

interface CardsViewProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
}

export const CardsView: React.FC<CardsViewProps> = ({
  bookings,
  onSelectBooking,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {bookings.map((booking) => {
        const status = getBookingStatus(booking.date, booking.startTime, booking.endTime);
        const waLink = `https://wa.me/${cleanPhoneForWa(booking.contactPerson.phone)}?text=${encodeURIComponent(
          `Halo ${booking.contactPerson.name}, terkait jadwal "${booking.facility}"...`
        )}`;

        return (
          <div
            key={booking.id}
            onClick={() => onSelectBooking(booking)}
            className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all p-5 flex flex-col justify-between cursor-pointer"
          >
            <div>
              {/* Date & Time pill on top */}
              <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{formatIndonesianDate(booking.date, true)}</span>
                </div>
                <div className="font-mono text-xs font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                  {booking.startTime} - {booking.endTime}
                </div>
              </div>

              {/* Facility & Department */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
                  <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>{booking.facility}</span>
                </div>
              </div>

              <div className="mb-3">
                <span className="inline-block px-2 py-0.5 text-[11px] font-bold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {booking.department}
                </span>
              </div>

              {/* Occasion */}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {booking.occasion}
                </h4>
                {booking.description && (
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {booking.description}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Person & Action */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="text-xs">
                <div className="font-semibold text-slate-900 truncate max-w-[150px]">
                  {booking.contactPerson.name}
                </div>
                <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                  {booking.contactPerson.role}
                </div>
              </div>

              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                  title="WhatsApp"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => onSelectBooking(booking)}
                  className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                  title="Detail"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
