import React from 'react';
import { 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  Layers, 
  Building, 
  X, 
  LayoutList, 
  Clock, 
  LayoutGrid 
} from 'lucide-react';
import { FacilityType, Department } from '../types/facility';
import { FACILITIES_LIST, DEPARTMENTS_LIST } from '../data/mockData';

export type DateFilterType = 'all' | 'today' | 'tomorrow' | 'week' | 'month' | 'custom';
export type ViewMode = 'table' | 'timeline' | 'cards';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedFacility: string;
  onFacilityChange: (val: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (val: string) => void;
  dateFilter: DateFilterType;
  onDateFilterChange: (val: DateFilterType) => void;
  customDate: string;
  onCustomDateChange: (val: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (val: ViewMode) => void;
  onClearFilters: () => void;
  totalFiltered: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedFacility,
  onFacilityChange,
  selectedDepartment,
  onDepartmentChange,
  dateFilter,
  onDateFilterChange,
  customDate,
  onCustomDateChange,
  viewMode,
  onViewModeChange,
  onClearFilters,
  totalFiltered,
}) => {
  const isFiltered =
    searchQuery !== '' ||
    selectedFacility !== '' ||
    selectedDepartment !== '' ||
    dateFilter !== 'all' ||
    customDate !== '';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5 mb-6 space-y-4">
      {/* Top Row: Search and View Mode */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari kegiatan, nama pemohon, fasilitas, atau topik..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0 self-start md:self-auto border border-slate-200">
          <button
            onClick={() => onViewModeChange('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'table'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Tampilan Tabel Konten (Standar)"
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>Tabel Konten</span>
          </button>
          <button
            onClick={() => onViewModeChange('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'timeline'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Tampilan Garis Waktu Jam per Hari"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timeline Jam</span>
          </button>
          <button
            onClick={() => onViewModeChange('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'cards'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Tampilan Kartu Agenda"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Kartu</span>
          </button>
        </div>
      </div>

      {/* Second Row: Filter Tabs & Dropdowns */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
        {/* Date Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-slate-500 mr-1 flex items-center gap-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            Waktu:
          </span>
          <button
            onClick={() => {
              onDateFilterChange('all');
              onCustomDateChange('');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              dateFilter === 'all' && !customDate
                ? 'bg-indigo-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => {
              onDateFilterChange('today');
              onCustomDateChange('');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              dateFilter === 'today' && !customDate
                ? 'bg-indigo-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Hari Ini
          </button>
          <button
            onClick={() => {
              onDateFilterChange('tomorrow');
              onCustomDateChange('');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              dateFilter === 'tomorrow' && !customDate
                ? 'bg-indigo-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Besok
          </button>
          <button
            onClick={() => {
              onDateFilterChange('week');
              onCustomDateChange('');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              dateFilter === 'week' && !customDate
                ? 'bg-indigo-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Minggu Ini
          </button>
          <button
            onClick={() => {
              onDateFilterChange('month');
              onCustomDateChange('');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              dateFilter === 'month' && !customDate
                ? 'bg-indigo-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Bulan Ini
          </button>

          {/* Custom Date Picker input */}
          <div className="relative inline-flex items-center ml-1">
            <input
              type="date"
              value={customDate}
              onChange={(e) => {
                onCustomDateChange(e.target.value);
                onDateFilterChange('custom');
              }}
              className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100"
              title="Pilih tanggal khusus"
            />
          </div>
        </div>

        {/* Dropdowns: Facility & Department */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Facility Select */}
          <div className="relative">
            <select
              value={selectedFacility}
              onChange={(e) => onFacilityChange(e.target.value)}
              className="appearance-none pl-8 pr-8 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 focus:outline-none focus:border-indigo-600 focus:bg-white"
            >
              <option value="">Semua Fasilitas</option>
              {FACILITIES_LIST.map((fac) => (
                <option key={fac.id} value={fac.id}>
                  {fac.name}
                </option>
              ))}
            </select>
            <Building className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
              ▼
            </div>
          </div>

          {/* Department Select */}
          <div className="relative">
            <select
              value={selectedDepartment}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="appearance-none pl-8 pr-8 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 focus:outline-none focus:border-indigo-600 focus:bg-white"
            >
              <option value="">Semua Departemen / Unit</option>
              {DEPARTMENTS_LIST.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <Layers className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
              ▼
            </div>
          </div>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Reset ({totalFiltered} hasil)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
