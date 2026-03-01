import { Teacher, Class, Student, News, GalleryItem, User } from './types';

export const INITIAL_TEACHERS: Teacher[] = [
  { id: 't1', name: 'Budi Santoso, S.Pd.', nip: '198501012010011001', subject: 'Matematika', position: 'Wali Kelas 1A', avatar: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=0D8ABC&color=fff' },
  { id: 't2', name: 'Siti Aminah, S.Pd.', nip: '198705122012012002', subject: 'Bahasa Indonesia', position: 'Wali Kelas 2A', avatar: 'https://ui-avatars.com/api/?name=Siti+Aminah&background=0D8ABC&color=fff' },
  { id: 't3', name: 'Ahmad Fauzi, S.Pd.', nip: '198203152008011003', subject: 'IPA', position: 'Guru Mapel', avatar: 'https://ui-avatars.com/api/?name=Ahmad+Fauzi&background=0D8ABC&color=fff' },
  { id: 't4', name: 'Dewi Lestari, S.Pd.', nip: '199011202015012004', subject: 'IPS', position: 'Wali Kelas 3A', avatar: 'https://ui-avatars.com/api/?name=Dewi+Lestari&background=0D8ABC&color=fff' },
  { id: 't5', name: 'Rahmat Hidayat, S.Pd.', nip: '198807082014011005', subject: 'PJOK', position: 'Guru Olahraga', avatar: 'https://ui-avatars.com/api/?name=Rahmat+Hidayat&background=0D8ABC&color=fff' },
];

export const INITIAL_CLASSES: Class[] = [
  { id: 'c1', name: '1A', capacity: 32 },
  { id: 'c2', name: '2A', capacity: 32 },
  { id: 'c3', name: '3A', capacity: 30 },
];

export const INITIAL_STUDENTS: Student[] = [
  { id: 's1', name: 'Andi Wijaya', nisn: '0123456781', classId: 'c1', avatar: 'https://ui-avatars.com/api/?name=Andi+Wijaya&background=random' },
  { id: 's2', name: 'Bunga Citra', nisn: '0123456782', classId: 'c1', avatar: 'https://ui-avatars.com/api/?name=Bunga+Citra&background=random' },
  { id: 's3', name: 'Candra Kirana', nisn: '0123456783', classId: 'c2', avatar: 'https://ui-avatars.com/api/?name=Candra+Kirana&background=random' },
  { id: 's4', name: 'Dedi Kurniawan', nisn: '0123456784', classId: 'c3', avatar: 'https://ui-avatars.com/api/?name=Dedi+Kurniawan&background=random' },
];

export const INITIAL_NEWS: News[] = [
  { id: 'n1', title: 'Lomba 17 Agustus SDN Jakasampurna I', content: 'Kemeriahan lomba dalam rangka memperingati hari kemerdekaan Indonesia ke-81.', category: 'Kegiatan', date: '2026-08-17', image: 'https://picsum.photos/seed/merdeka/800/400' },
  { id: 'n2', title: 'Persiapan Ulangan Kenaikan Kelas', content: 'Diharapkan seluruh siswa mempersiapkan diri untuk menghadapi UKK semester genap.', category: 'Akademik', date: '2026-05-10', image: 'https://picsum.photos/seed/exam/800/400' },
  { id: 'n3', title: 'Study Tour ke Museum Geologi Bandung', content: 'Siswa kelas 4, 5, dan 6 akan melaksanakan kunjungan edukasi ke Bandung.', category: 'Event', date: '2026-03-15', image: 'https://picsum.photos/seed/bandung/800/400' },
];

export const INITIAL_GALLERY: GalleryItem[] = [
  { id: 'g1', title: 'Upacara Bendera', imageUrl: 'https://picsum.photos/seed/upacara/600/400', date: '2026-02-01' },
  { id: 'g2', title: 'Kegiatan Pramuka', imageUrl: 'https://picsum.photos/seed/pramuka/600/400', date: '2026-02-05' },
  { id: 'g3', title: 'Lomba Mewarnai', imageUrl: 'https://picsum.photos/seed/mewarnai/600/400', date: '2026-02-10' },
  { id: 'g4', title: 'Perpustakaan Sekolah', imageUrl: 'https://picsum.photos/seed/library/600/400', date: '2026-02-15' },
];

export const INITIAL_USERS: User[] = [
  { id: 'u1', email: 'admin@sdn.id', password: '123456', role: 'Admin', name: 'Administrator' },
  { id: 'u2', email: 'guru@sdn.id', password: '123456', role: 'Guru', name: 'Budi Santoso, S.Pd.', teacherId: 't1' },
  { id: 'u3', email: 'murid@sdn.id', password: '123456', role: 'Murid', name: 'Andi Wijaya', studentId: 's1' },
];
