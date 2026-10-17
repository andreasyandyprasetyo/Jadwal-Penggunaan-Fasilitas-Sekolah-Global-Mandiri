import React, { useState, useEffect, useMemo } from 'react';
import { 
  getInitialBookings, 
  formatDateISO, 
  addDays, 
  FACILITIES_LIST, 
  DEPARTMENTS_LIST 
} from './data/mockData';
import { Booking, FacilityType, Department } from './types/facility';
import { Header } from './components/Header';
import { FacilityStats } from './components/FacilityStats';
import { FilterBar, DateFilterType, ViewMode } from './components/FilterBar';
import { ScheduleTable } from './components/ScheduleTable';
import { TimelineView } from './components/TimelineView';
import { CardsView } from './components/CardsView';
import { BookingModal } from './components/BookingModal';
import { DetailModal } from './components/DetailModal';
import { FacilityDirectoryModal } from './components/FacilityDirectoryModal';
import { exportBookingsToCSV } from './utils/exportCsv';
import { getBookingStatus, formatIndonesianDate } from './utils/dateUtils';
import { 
  FileSpreadsheet, 
  Printer, 
  Info, 
  HelpCircle, 
  PhoneCall, 
  ShieldCheck, 
  CheckCircle,
  Building2,
  CalendarCheck
} from 'lucide-react';

const STORAGE_KEY = 'sgm_facility_bookings_v1';

export default function App() {
  // Initialize bookings with local storage or default realistic data
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return getInitialBookings();
  });

  // Save to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.error('Failed to save bookings to localStorage', e);
    }
  }, [bookings]);

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFacility, setSelectedFacility] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
  const [customDate, setCustomDate] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // Modals State
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Pre-fill for BookingModal
  const [prefillFacility, setPrefillFacility] = useState<FacilityType | undefined>(undefined);
  const [prefillDate, setPrefillDate] = useState<string | undefined>(undefined);
  const [prefillStartTime, setPrefillStartTime] = useState<string | undefined>(undefined);

  // Reset to initial mock data
  const handleResetData = () => {
    if (window.confirm('Muat ulang data simulasi jadwal Sekolah Global Mandiri?')) {
      const initial = getInitialBookings();
      setBookings(initial);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    }
  };

  // Add new booking
  const handleAddBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  // Delete/Cancel booking
  const handleDeleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  // Quick slot booking from Timeline view
  const handleOpenSlotBooking = (facility: FacilityType, date: string, startHour: string) => {
    setPrefillFacility(facility);
    setPrefillDate(date);
    setPrefillStartTime(startHour);
    setIsBookingOpen(true);
  };

  const handleOpenFacilityForBooking = (facility: FacilityType) => {
    setPrefillFacility(facility);
    setPrefillDate(formatDateISO(new Date()));
    setPrefillStartTime('08:00');
    setIsBookingOpen(true);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedFacility('');
    setSelectedDepartment('');
    setDateFilter('all');
    setCustomDate('');
    setStatusFilter('all');
  };

  // Filtered and Sorted Bookings
  const filteredBookings = useMemo(() => {
    const today = new Date();
    const todayStr = formatDateISO(today);
    const tomorrowStr = formatDateISO(addDays(today, 1));
    const next7DaysStr = formatDateISO(addDays(today, 7));
    const currentMonthPrefix = todayStr.slice(0, 7); // YYYY-MM

    return bookings
      .filter((booking) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchOccasion = booking.occasion.toLowerCase().includes(q);
          const matchContact = booking.contactPerson.name.toLowerCase().includes(q);
          const matchFacility = booking.facility.toLowerCase().includes(q);
          const matchDept = booking.department.toLowerCase().includes(q);
          const matchDesc = (booking.description || '').toLowerCase().includes(q);
          const matchNotes = (booking.notes || '').toLowerCase().includes(q);
          if (
            !matchOccasion &&
            !matchContact &&
            !matchFacility &&
            !matchDept &&
            !matchDesc &&
            !matchNotes
          ) {
            return false;
          }
        }

        // Facility filter
        if (selectedFacility && booking.facility !== selectedFacility) {
          return false;
        }

        // Department filter
        if (selectedDepartment && booking.department !== selectedDepartment) {
          return false;
        }

        // Status filter
        if (statusFilter !== 'all') {
          const status = getBookingStatus(booking.date, booking.startTime, booking.endTime);
          if (status !== statusFilter) {
            return false;
          }
        }

        // Date filter
        if (customDate) {
          return booking.date === customDate;
        }

        if (dateFilter === 'today') {
          return booking.date === todayStr;
        } else if (dateFilter === 'tomorrow') {
          return booking.date === tomorrowStr;
        } else if (dateFilter === 'week') {
          return booking.date >= todayStr && booking.date <= next7DaysStr;
        } else if (dateFilter === 'month') {
          return booking.date.startsWith(currentMonthPrefix);
        }

        return true;
      })
      .sort((a, b) => {
        // Primary sort: Date ascending
        if (a.date !== b.date) {
          return a.date.localeCompare(b.date);
        }
        // Secondary sort: Start time ascending
        return a.startTime.localeCompare(b.startTime);
      });
  }, [
    bookings,
    searchQuery,
    selectedFacility,
    selectedDepartment,
    dateFilter,
    customDate,
    statusFilter,
  ]);

  return (
    <div className="min-h-screen bg-slate-100/70 font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* App Header */}
      <Header
        onOpenBooking={() => {
          setPrefillFacility(undefined);
          setPrefillDate(undefined);
          setPrefillStartTime(undefined);
          setIsBookingOpen(true);
        }}
        onOpenDirectory={() => setIsDirectoryOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {/* Printable Title Header for Paper/PDF */}
        <div className="hidden print:block mb-6 border-b-2 border-slate-900 pb-4">
          <h1 className="text-2xl font-black text-slate-950 uppercase">
            JADWAL PENGGUNAAN FASILITAS SEKOLAH GLOBAL MANDIRI
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Dicetak pada: {formatIndonesianDate(formatDateISO(new Date()))} • Sistem Sarana & Prasarana
          </p>
        </div>

        {/* School announcement banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold shrink-0 mt-0.5">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                Pemberitahuan Peminjaman Fasilitas Semester Ini
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold">
                  SOP 2026
                </span>
              </h3>
              <p className="text-xs text-indigo-100 mt-0.5 leading-relaxed">
                Seluruh guru dan staf wajib mendaftarkan penggunaan ruangan minimal H-2 kegiatan agar Bagian Sarpras dapat mempersiapkan kelengkapan audio visual, pendingin ruangan, dan kebersihan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <button
              onClick={() => exportBookingsToCSV(filteredBookings)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all shadow-xs"
              title="Unduh jadwal tabel dalam format file spreadsheet Excel/CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Ekspor CSV</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="print:hidden">
          <FacilityStats
            bookings={bookings}
            activeFilter={
              statusFilter === 'berlangsung'
                ? 'berlangsung'
                : dateFilter === 'today'
                ? 'today'
                : statusFilter === 'all' && dateFilter === 'all'
                ? 'all'
                : ''
            }
            onFilterAll={() => {
              handleClearFilters();
            }}
            onFilterToday={() => {
              handleClearFilters();
              setDateFilter('today');
            }}
            onFilterOngoing={() => {
              handleClearFilters();
              setStatusFilter('berlangsung');
            }}
          />
        </div>

        {/* Filter Bar */}
        <div className="print:hidden">
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedFacility={selectedFacility}
            onFacilityChange={setSelectedFacility}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={setSelectedDepartment}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            customDate={customDate}
            onCustomDateChange={setCustomDate}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onClearFilters={handleClearFilters}
            totalFiltered={filteredBookings.length}
          />
        </div>

        {/* Dynamic Views */}
        {viewMode === 'table' && (
          <ScheduleTable
            bookings={filteredBookings}
            onSelectBooking={(b) => setSelectedBooking(b)}
            onClearFilters={handleClearFilters}
          />
        )}

        {viewMode === 'timeline' && (
          <TimelineView
            bookings={bookings}
            onSelectBooking={(b) => setSelectedBooking(b)}
            onOpenBookingForSlot={handleOpenSlotBooking}
          />
        )}

        {viewMode === 'cards' && (
          <CardsView
            bookings={filteredBookings}
            onSelectBooking={(b) => setSelectedBooking(b)}
          />
        )}

        {/* School Information / SOP Footer Guide */}
        <div className="mt-10 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm print:hidden">
          <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            Panduan & Prosedur Peminjaman Fasilitas untuk Guru & Karyawan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                  1
                </span>
                Cek Ketersediaan
              </div>
              <p className="leading-relaxed">
                Gunakan filter tanggal dan fasilitas untuk memastikan tidak ada kegiatan lain yang bertabrakan pada jam yang diajukan.
              </p>
            </div>

            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                  2
                </span>
                Ajukan Formulir Online
              </div>
              <p className="leading-relaxed">
                Klik tombol <strong>+ Ajukan Penggunaan</strong>, lengkapi data kontak, penanggung jawab, serta perlengkapan yang dibutuhkan.
              </p>
            </div>

            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                  3
                </span>
                Koordinasi & Kebersihan
              </div>
              <p className="leading-relaxed">
                Hubungi PIC Sarpras jika membutuhkan operator sound/lighting, dan pastikan ruangan kembali rapi setelah acara berakhir.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 mt-12 border-t border-slate-800 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
              SGM
            </div>
            <div>
              <div className="font-bold text-slate-200">
                SEKOLAH GLOBAL MANDIRI
              </div>
              <div className="text-[11px] text-slate-400">
                Divisi Sarana Prasarana & Sistem Informasi Akademik
              </div>
            </div>
          </div>

          <div className="text-center sm:text-right text-[11px] text-slate-400">
            <div>Helpdesk Sarpras: ext. 104 / WhatsApp: 0812-9844-3210</div>
            <div>© {new Date().getFullYear()} Sekolah Global Mandiri. All rights reserved.</div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onAddBooking={handleAddBooking}
        existingBookings={bookings}
        initialFacility={prefillFacility}
        initialDate={prefillDate}
        initialStartTime={prefillStartTime}
      />

      <DetailModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onDeleteBooking={handleDeleteBooking}
      />

      <FacilityDirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
        onSelectFacilityForBooking={handleOpenFacilityForBooking}
      />
    </div>
  );
}
