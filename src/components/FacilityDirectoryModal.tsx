import React from 'react';
import { 
  X, 
  Building, 
  MapPin, 
  Users, 
  Wrench, 
  CalendarPlus, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { FacilityInfo, FacilityType } from '../types/facility';
import { FACILITIES_LIST } from '../data/mockData';

interface FacilityDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFacilityForBooking: (facility: FacilityType) => void;
}

export const FacilityDirectoryModal: React.FC<FacilityDirectoryModalProps> = ({
  isOpen,
  onClose,
  onSelectFacilityForBooking,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
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

          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
            Direktori Fasilitas Kampus
          </span>
          <h2 className="text-xl sm:text-2xl font-bold mt-1">
            Fasilitas Sekolah Global Mandiri
          </h2>
          <p className="text-xs text-indigo-200 mt-1 max-w-xl">
            Rincian sarana prasarana sekolah, daya tampung peserta, perlengkapan bawaan, dan penanggung jawab ruangan.
          </p>
        </div>

        {/* Directory Grid */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FACILITIES_LIST.map((fac) => (
              <div
                key={fac.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {fac.name}
                    </h3>
                    <span className="shrink-0 text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                      {fac.capacity} Orang
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 mb-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{fac.building} • {fac.floor}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>PIC Sarpras: <strong>{fac.inCharge}</strong></span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mb-4">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Fasilitas Bawaan:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {fac.amenities.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[11px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md"
                        >
                          <Check className="w-3 h-3 text-emerald-600" />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-end">
                  <button
                    onClick={() => {
                      onSelectFacilityForBooking(fac.id);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    <span>Ajukan Penggunaan</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Tutup Direktori
          </button>
        </div>
      </div>
    </div>
  );
};
