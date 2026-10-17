export type Department = 
  | 'TK / Early Childhood'
  | 'SD / Primary'
  | 'SMP / Junior High'
  | 'SMA / Senior High'
  | 'Tata Usaha & Admin'
  | 'Yayasan & Manajemen'
  | 'Kesiswaan & OSIS'
  | 'IT & Multimedia';

export type FacilityType = 
  | 'Auditorium Utama'
  | 'Aula Lantai 3'
  | 'Lapangan Basket Indoor'
  | 'Lapangan Futsal Outdoor'
  | 'Kolam Renang'
  | 'Lab Komputer 1'
  | 'Lab Komputer 2'
  | 'Lab Sains / IPA'
  | 'Ruang Audio Visual (AV)'
  | 'Ruang Musik'
  | 'Perpustakaan Utama'
  | 'Ruang Rapat Guru (Meeting Room)';

export type BookingStatus = 'berlangsung' | 'akan_datang' | 'selesai' | 'dibatalkan';

export interface Booking {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (e.g. 08:00)
  endTime: string; // HH:mm (e.g. 10:30)
  facility: FacilityType;
  department: Department;
  contactPerson: {
    name: string;
    role: string;
    phone: string; // e.g. 0812-xxxx-xxxx
    email?: string;
  };
  occasion: string; // Kegiatan / Acara
  description?: string;
  participantsCount?: number;
  equipmentNeeded?: string[]; // e.g. ["Proyektor", "Sound System", "Wireless Mic (2)"]
  notes?: string;
  createdAt: string;
}

export interface FacilityInfo {
  id: FacilityType;
  name: string;
  building: string;
  floor: string;
  capacity: number;
  amenities: string[];
  inCharge: string;
}
