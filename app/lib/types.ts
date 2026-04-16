export type Subject = 'Math' | 'Arabic' | 'English';

export type Package = '1 Week' | '4 Weeks' | '8 Weeks';

export const PACKAGE_PRICES: Record<Package, number> = {
  '1 Week': 100,
  '4 Weeks': 350,
  '8 Weeks': 650,
};

export interface Student {
  id: string;
  // Parent
  parentName: string;
  parentPhone: string;
  parentAddress: string;
  // Child
  childName: string;
  childAge: number;
  childDob: string;
  schoolName: string;
  subjects: Subject[];
  package: Package;
  imageDataUrl: string; // base64
  createdAt: string;
}

export interface Booking {
  id: string;
  date: string;      // YYYY-MM-DD
  timeSlot: string;  // "10:00 AM"
  studentId: string;
  createdAt: string;
}
