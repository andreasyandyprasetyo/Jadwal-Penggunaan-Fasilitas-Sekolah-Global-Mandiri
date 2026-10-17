import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  CalendarPlus, 
  Printer, 
  Clock, 
  Compass, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { formatIndonesianDate } from '../utils/dateUtils';

interface HeaderProps {
  onOpenBooking: () => void;
  onOpenDirectory: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBooking,
  onOpenDirectory,
  onResetData,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDateFormatted, setCurrentDateFormatted] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds} WIB`);

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      setCurrentDateFormatted(formatIndonesianDate(`${year}-${month}-${day}`));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white shadow-xl border-b border-indigo-800/40 sticky top-0 z-30">
      {/* Top micro banner */}
      <div className="bg-slate-950/60 border-b border-white/10 px-4 sm:px-8 py-1.5 text-xs text-indigo-200 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2 font-medium tracking-wide">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>PORTAL INFORMASI SARANA & PRASARANA SEKOLAH GLOBAL MANDIRI</span>
        </div>
        <div className="flex items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-amber-300 font-semibold">{currentTime}</span>
            <span className="text-slate-400 hidden md:inline">• {currentDateFormatted}</span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Logo & Title */}
          <div className="flex items-start sm:items-center gap-4">
            {/* School Emblem Badge */}
            <div className="relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex flex-col items-center justify-center text-center p-1.5">
                <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
                <span className="text-[9px] font-black tracking-wider text-amber-200 uppercase mt-0.5">SGM</span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-slate-900 text-white shadow">
                LIVE
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  Sistem Informasi Guru & Staf
                </span>
                <span className="text-slate-400 text-xs hidden sm:inline">
                  • Academic Year 2026/2027
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
                JADWAL PENGGUNAAN FASILITAS SEKOLAH GLOBAL MANDIRI
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
                Pantau ketersediaan auditorium, laboratorium, lapangan olahraga, dan ruang serbaguna secara transparan & real-time.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-2.5 pt-2 lg:pt-0">
            <button
              onClick={onOpenDirectory}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold border border-white/15 backdrop-blur-sm transition-all hover:border-white/30 shadow-sm"
              title="Lihat profil, kapasitas, dan fasilitas seluruh ruangan"
            >
              <Compass className="w-4 h-4 text-cyan-300" />
              <span>Daftar Fasilitas</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold border border-white/15 backdrop-blur-sm transition-all hover:border-white/30 shadow-sm print:hidden"
              title="Cetak jadwal untuk mading atau arsip"
            >
              <Printer className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">Cetak Jadwal</span>
            </button>

            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/25 transition-all transform active:scale-95"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>+ Ajukan Penggunaan</span>
            </button>

            <button
              onClick={onResetData}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors"
              title="Muat ulang data simulasi awal"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
