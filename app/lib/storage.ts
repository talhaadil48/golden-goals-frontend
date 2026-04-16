import { Student, Booking } from './types';

const KEYS = {
  auth: 'gg_auth',
  students: 'gg_students',
  bookings: 'gg_bookings',
} as const;

// ── Auth ──────────────────────────────────────────────
export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(KEYS.auth) === 'true';
}

export function login(): void {
  localStorage.setItem(KEYS.auth, 'true');
}

export function logout(): void {
  localStorage.removeItem(KEYS.auth);
}

// ── Students ──────────────────────────────────────────
export function getStudents(): Student[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEYS.students) || '[]');
  } catch {
    return [];
  }
}

export function saveStudents(students: Student[]): void {
  localStorage.setItem(KEYS.students, JSON.stringify(students));
}

export function addStudent(student: Student): void {
  const list = getStudents();
  list.push(student);
  saveStudents(list);
}

export function deleteStudent(id: string): void {
  saveStudents(getStudents().filter((s) => s.id !== id));
}

// ── Bookings ──────────────────────────────────────────
export function getBookings(): Booking[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEYS.bookings) || '[]');
  } catch {
    return [];
  }
}

export function saveBookings(bookings: Booking[]): void {
  localStorage.setItem(KEYS.bookings, JSON.stringify(bookings));
}

export function addBooking(booking: Booking): void {
  const list = getBookings();
  list.push(booking);
  saveBookings(list);
}

export function deleteBooking(id: string): void {
  saveBookings(getBookings().filter((b) => b.id !== id));
}

export function getBookingForSlot(date: string, timeSlot: string): Booking | undefined {
  return getBookings().find((b) => b.date === date && b.timeSlot === timeSlot);
}

// ── Helpers ───────────────────────────────────────────
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
  '4:00 PM', '5:00 PM', '6:00 PM',
];

export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}
