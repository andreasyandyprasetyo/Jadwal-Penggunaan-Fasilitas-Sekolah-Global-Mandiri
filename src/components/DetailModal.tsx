import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Phone, 
  Mail, 
  MessageSquare, 
  CheckCircle, 
  AlertTriangle, 
  Tag, 
  Sliders, 
  FileText,
  Trash2
} from 'lucide-react';
import { Booking } from '../types/facility';
import { 
  formatIndonesianDate, 
  cleanPhoneForWa, 
  getBookingStatus 
} from '../utils/dateUtils';
import { FACILITIES_LIST } from '../data/mockData';

interface DetailModalProps {
  booking: Booking | null;
  onClose: () => void;
  onDeleteBooking?: (id: string) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  booking,
  onClose,
  onDeleteBooking,
}) => {
  if (!booking) return null;

  const facilityInfo = FACILITIES_LIST.find((f) => f.id === booking.facility);
  const status = getBookingStatus(booking.date, booking.startTime, booking.endTime);
  const waLink = `https://wa.me/${cleanPhoneForWa(booking.contactPerson.phone)}?text=${encodeURIComponent(
    `Halo ${booking.contactPerson.name}, terkait jadwal penggunaan fasilitas "${booking.facility}" pada ${formatIndonesianDate(booking.date)} (${booking.startTime}-${booking.endTime} WIB) untuk kegiatan "${booking.occasion}"...`
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-amber-400 text-slate-950">
              {booking.department}
            </span>
            <span className="text-slate-300 text-xs">ID: {booking.id}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold pr-10">
            {booking.occasion}
          </h2>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-indigo-200">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{formatIndonesianDate(booking.date, true)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="font-mono">{booking.startTime} - {booking.endTime} WIB</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-sm text-slate-700">
          {/* Facility Location Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span className="font-bold text-slate-900">{booking.facility}</span>
              </div>
              {facilityInfo && (
                <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-medium">
                  Kapasitas: {facilityInfo.capacity} Orang
                </span>
              )}
            </div>
            {facilityInfo && (
              <div className="text-xs text-slate-600 space-y-1 mt-1">
                <p><strong>Lokasi:</strong> {facilityInfo.building}, {facilityInfo.floor}</p>
                <p><strong>Koordinator Ruangan:</strong> {facilityInfo.inCharge}</p>
              </div>
            )}
          </div>

          {/* Occasion / Activity description */}
          <div>
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              Deskripsi & Agenda Kegiatan
            </h4>
            <p className="text-slate-600 leading-relaxed bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
              {booking.description || 'Tidak ada deskripsi tambahan.'}
            </p>
          </div>

          {/* Participants & Equipment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                <Users className="w-4 h-4 text-indigo-600" />
                Perkiraan Peserta
              </div>
              <div className="text-xl font-extrabold text-slate-900">
                {booking.participantsCount ? `${booking.participantsCount} Siswa / Staf` : 'Tidak dispesifikasikan'}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                <Tag className="w-4 h-4 text-indigo-600" />
                Unit Penyelenggara
              </div>
              <div className="text-base font-bold text-slate-900">
                {booking.department}
              </div>
            </div>
          </div>

          {/* Equipment requested */}
          {booking.equipmentNeeded && booking.equipmentNeeded.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                Peralatan / Sarpras yang Diajukan
              </h4>
              <div className="flex flex-wrap gap-2">
                {booking.equipmentNeeded.map((eq, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-800 border border-indigo-200"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
                    {eq}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {booking.notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900">
              <strong>Catatan Khusus dari Pemohon:</strong> {booking.notes}
            </div>
          )}

          {/* Contact Person Details */}
          <div className="bg-gradient-to-br from-slate-50 to-indigo-50/40 rounded-2xl p-5 border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Informasi Penanggung Jawab (Contact Person)
            </h4>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-bold text-base text-slate-900">
                  {booking.contactPerson.name}
                </div>
                <div className="text-xs text-slate-600">
                  {booking.contactPerson.role} • {booking.department}
                </div>
                {booking.contactPerson.email && (
                  <div className="text-xs text-indigo-700 mt-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{booking.contactPerson.email}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp ({booking.contactPerson.phone})</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {onDeleteBooking ? (
            <button
              onClick={() => {
                if (window.confirm(`Yakin ingin membatalkan/menghapus jadwal "${booking.occasion}"?`)) {
                  onDeleteBooking(booking.id);
                  onClose();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus / Batalkan Jadwal</span>
            </button>
          ) : <div></div>}

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
