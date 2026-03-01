export type Role = 'Admin' | 'Guru' | 'Murid';

export interface User {
  id: string;
  email: string;
  password: string;
  role: Role;
  name: string;
  studentId?: string; // For Murid role
  teacherId?: string; // For Guru role
}

export interface Teacher {
  id: string;
  name: string;
  nip: string;
  subject: string;
  position: string;
  avatar: string;
}

export interface Student {
  id: string;
  name: string;
  nisn: string;
  classId: string;
  avatar: string;
}

export interface Class {
  id: string;
  name: string;
  capacity: number;
}

export interface News {
  id: string;
  title: string;
  content: string;
  category: 'Kegiatan' | 'Akademik' | 'Event';
  date: string;
  image: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  date: string;
}

export interface Grades {
  id: string;
  studentId: string;
  classId: string;
  matematika: number;
  bahasaIndonesia: number;
  ipa: number;
  ips: number;
  ppkn: number;
  seniBudaya: number;
  olahraga: number;
  sikap: 'A' | 'B' | 'C';
  average: number;
}
