import React, { useState, useId } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Phone, 
  AlertTriangle, 
  CheckCircle2, 
  PlusCircle, 
  Sparkles 
} from 'lucide-react';
import { Booking, Department, FacilityType } from '../types/facility';
import { FACILITIES_LIST, DEPARTMENTS_LIST, formatDateISO } from '../data/mockData';
import { checkTimeOverlap, formatIndonesianDate } from '../utils/dateUtils';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBooking: (booking: Booking) => void;
  existingBookings: Booking[];
  initialFacility?: FacilityType;
  initialDate?: string;
  initialStartTime?: string;
}

const COMMON_EQUIPMENT = [
  'Sound System & Operator',
  'Proyektor & Layar',
  'Wireless Microphone (2 unit)',
  'Kursi Lipat Tambahan (50 unit)',
  'Podium Pidato',
  'Lampu Sorot / Lighting',
  'Koneksi Internet Kabel LAN',
  'AC dinyalakan lebih awal (15 mnt)',
  'Papan Tulis / Smart Whiteboard',
  'Peralatan P3K',
];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onAddBooking,
  existingBookings,
  initialFacility,
  initialDate,
  initialStartTime,
}) => {
  const formId = useId();

  const [facility, setFacility] = useState<FacilityType>(
    initialFacility || 'Auditorium Utama'
  );
  const [date, setDate] = useState<string>(
    initialDate || formatDateISO(new Date())
  );
  const [startTime, setStartTime] = useState<string>(initialStartTime || '08:00');
  const [endTime, setEndTime] = useState<string>('10:00');
  const [department, setDepartment] = useState<Department>('SMA / Senior High');
  const [occasion, setOccasion] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [contactName, setContactName] = useState<string>('');
  const [contactRole, setContactRole] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [participantsCount, setParticipantsCount] = useState<string>('50');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  if (!isOpen) return null;

  // Real-time conflict checking
  const conflictingBooking = existingBookings.find(
    (b) =>
      b.facility === facility &&
      b.date === date &&
      checkTimeOverlap(startTime, endTime, b.startTime, b.endTime)
  );

  const toggleEquipment = (item: string) => {
    if (selectedEquipment.includes(item)) {
      setSelectedEquipment(selectedEquipment.filter((e) => e !== item));
    } else {
      setSelectedEquipment([...selectedEquipment, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!occasion.trim()) {
      setFormError('Harap isi nama kegiatan atau acara (Occasion).');
      return;
    }
    if (!contactName.trim()) {
      setFormError('Harap isi nama guru atau staf penanggung jawab.');
      return;
    }
    if (!contactPhone.trim()) {
      setFormError('Harap isi nomor telepon / WhatsApp penanggung jawab.');
      return;
    }
    if (startTime >= endTime) {
      setFormError('Jam selesai harus lebih akhir dari jam mulai.');
      return;
    }

    if (conflictingBooking) {
      setFormError('Terdapat jadwal bentrok pada fasilitas dan jam yang dipilih.');
      return;
    }

    const newBooking: Booking = {
      id: `BKG-${Date.now().toString().slice(-4)}`,
      date,
      startTime,
      endTime,
      facility,
      department,
      contactPerson: {
        name: contactName.trim(),
        role: contactRole.trim() || 'Guru / Staf',
        phone: contactPhone.trim(),
        email: contactEmail.trim() || undefined,
      },
      occasion: occasion.trim(),
      description: description.trim() || undefined,
      participantsCount: participantsCount ? parseInt(participantsCount, 10) : undefined,
      equipmentNeeded: selectedEquipment.length > 0 ? selectedEquipment : undefined,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    onAddBooking(newBooking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
              Formulir Pengajuan
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">
            Ajukan Jadwal Penggunaan Fasilitas
          </h2>
          <p className="text-xs text-indigo-200 mt-1">
            Masukkan rincian kegiatan sekolah untuk didaftarkan ke jadwal sarana & prasarana.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-sm">
          {formError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          {/* Conflict Warning */}
          {conflictingBooking && (
            <div className="p-4 bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs rounded-2xl flex items-start gap-3 shadow-xs">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-amber-900">
                  Perhatian: Jadwal Bentrok Terdeteksi!
                </p>
                <p className="mt-1">
                  Ruang <strong>{facility}</strong> sudah terdaftar digunakan pada{' '}
                  <strong>{formatIndonesianDate(date)}</strong> pukul{' '}
                  <span className="font-mono font-bold">{conflictingBooking.startTime} - {conflictingBooking.endTime} WIB</span>.
                </p>
                <p className="mt-1 text-amber-800">
                  Agenda: <em>"{conflictingBooking.occasion}"</em> oleh <strong>{conflictingBooking.contactPerson.name}</strong> ({conflictingBooking.department}).
                </p>
                <p className="mt-1 text-[11px] text-amber-700 italic">
                  Silakan ubah jam, tanggal, atau pilih fasilitas lain agar tidak bertabrakan.
                </p>
              </div>
            </div>
          )}

          {/* Section 1: Fasilitas & Waktu */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              1. Fasilitas & Waktu
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pilih Fasilitas Sekolah *
              </label>
              <select
                value={facility}
                onChange={(e) => setFacility(e.target.value as FacilityType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100"
              >
                {FACILITIES_LIST.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.floor} • Kapasitas {f.capacity})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Kegiatan *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jam Mulai (WIB) *
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jam Selesai (WIB) *
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Kegiatan & Departemen */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              2. Detail Kegiatan & Penyelenggara
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Departemen / Unit Pemohon *
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as Department)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-600"
                >
                  {DEPARTMENTS_LIST.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Perkiraan Jumlah Peserta
                </label>
                <input
                  type="number"
                  min="1"
                  value={participantsCount}
                  onChange={(e) => setParticipantsCount(e.target.value)}
                  placeholder="Contoh: 45"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Kegiatan / Keperluan (Occasion) *
              </label>
              <input
                type="text"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="Contoh: Workshop Kurikulum Cambridge Guru SD / Try Out UN / Pentas Seni"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Keterangan Singkat Agenda
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Jelaskan ringkasan acara atau susunan kegiatan..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Section 3: Contact Person */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              3. Penanggung Jawab (Contact Person)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Guru / Staf *
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Contoh: Ibu Siti Rahmawati, M.Pd"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jabatan / Peran
                </label>
                <input
                  type="text"
                  value={contactRole}
                  onChange={(e) => setContactRole(e.target.value)}
                  placeholder="Contoh: Koordinator Level / Guru Biologi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor WhatsApp / HP *
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Contoh: 0812-3456-7890"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Sekolah (Opsional)
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="nama@teacher.globalmandiri.sch.id"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Equipment & Notes */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              4. Perlengkapan & Sarana Tambahan
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {COMMON_EQUIPMENT.map((eq) => {
                const checked = selectedEquipment.includes(eq);
                return (
                  <label
                    key={eq}
                    onClick={() => toggleEquipment(eq)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer select-none transition-colors ${
                      checked
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-semibold'
                        : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}} // handled by label onClick
                      className="rounded text-indigo-600"
                    />
                    <span>{eq}</span>
                  </label>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Khusus untuk Tim Sarpras
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Mohon sediakan 2 colokan listrik tambahan di area panggung"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium text-xs transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={!!conflictingBooking}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all ${
                conflictingBooking
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-900 hover:bg-indigo-800 text-white shadow-indigo-900/20 active:scale-95'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Daftarkan Jadwal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
