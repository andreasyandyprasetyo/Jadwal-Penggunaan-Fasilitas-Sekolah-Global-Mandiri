import { BookingStatus } from '../types/facility';

export const ID_DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const ID_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];
export const ID_MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];
export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function formatIndonesianDate(dateStr: string, includeDayName = true): string {
  if (!dateStr) return '';
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);

  const d = new Date(year, month, day);
  const dayName = ID_DAYS[d.getDay()];
  const monthName = ID_MONTHS[month];

  if (includeDayName) {
    return `${dayName}, ${day} ${monthName} ${year}`;
  }
  return `${day} ${monthName} ${year}`;
}

export function formatShortDate(dateStr: string): { dayName: string; dateNum: number; monthYear: string } {
  if (!dateStr) return { dayName: '', dateNum: 1, monthYear: '' };
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);
  const d = new Date(year, month, day);

  return {
    dayName: ID_DAYS[d.getDay()],
    dateNum: day,
    monthYear: `${ID_MONTHS_SHORT[month]} ${year}`,
  };
}

export function getBookingStatus(dateStr: string, startTime: string, endTime: string, now = new Date()): BookingStatus {
  try {
    const [yearStr, monthStr, dayStr] = dateStr.split('-');
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const start = new Date(
      parseInt(yearStr, 10),
      parseInt(monthStr, 10) - 1,
      parseInt(dayStr, 10),
      startH,
      startM,
      0
    );

    const end = new Date(
      parseInt(yearStr, 10),
      parseInt(monthStr, 10) - 1,
      parseInt(dayStr, 10),
      endH,
      endM,
      0
    );

    if (now >= start && now <= end) {
      return 'berlangsung';
    } else if (now < start) {
      return 'akan_datang';
    } else {
      return 'selesai';
    }
  } catch {
    return 'akan_datang';
  }
}

export function cleanPhoneForWa(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.startsWith('0')) {
    return '62' + digits.substring(1);
  }
  if (digits.startsWith('62')) {
    return digits;
  }
  return '62' + digits;
}

// Check time overlap: (StartA < EndB) and (EndA > StartB)
export function checkTimeOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  return startA < endB && endA > startB;
}
