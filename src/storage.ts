import { INITIAL_CLASSES, INITIAL_GALLERY, INITIAL_NEWS, INITIAL_STUDENTS, INITIAL_TEACHERS, INITIAL_USERS } from './constants';
import { Teacher, Class, Student, News, GalleryItem, User, Grades } from './types';

const KEYS = {
  TEACHERS: 'sdn_teachers',
  CLASSES: 'sdn_classes',
  STUDENTS: 'sdn_students',
  NEWS: 'sdn_news',
  GALLERY: 'sdn_gallery',
  USERS: 'sdn_users',
  GRADES: 'sdn_grades',
  CURRENT_USER: 'sdn_current_user'
};

export const storage = {
  init: () => {
    if (!localStorage.getItem(KEYS.TEACHERS)) localStorage.setItem(KEYS.TEACHERS, JSON.stringify(INITIAL_TEACHERS));
    if (!localStorage.getItem(KEYS.CLASSES)) localStorage.setItem(KEYS.CLASSES, JSON.stringify(INITIAL_CLASSES));
    if (!localStorage.getItem(KEYS.STUDENTS)) localStorage.setItem(KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    if (!localStorage.getItem(KEYS.NEWS)) localStorage.setItem(KEYS.NEWS, JSON.stringify(INITIAL_NEWS));
    if (!localStorage.getItem(KEYS.GALLERY)) localStorage.setItem(KEYS.GALLERY, JSON.stringify(INITIAL_GALLERY));
    if (!localStorage.getItem(KEYS.USERS)) localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
    if (!localStorage.getItem(KEYS.GRADES)) localStorage.setItem(KEYS.GRADES, JSON.stringify([]));

    // Migration: Update old i.pravatar.cc URLs to picsum.photos
    const students = JSON.parse(localStorage.getItem(KEYS.STUDENTS) || '[]');
    let updated = false;
    const migratedStudents = students.map((s: any) => {
      if (s.avatar && s.avatar.includes('i.pravatar.cc')) {
        updated = true;
        return { ...s, avatar: `https://picsum.photos/seed/${s.id}/200` };
      }
      return s;
    });
    if (updated) {
      localStorage.setItem(KEYS.STUDENTS, JSON.stringify(migratedStudents));
    }
  },

  getTeachers: (): Teacher[] => JSON.parse(localStorage.getItem(KEYS.TEACHERS) || '[]'),
  saveTeachers: (data: Teacher[]) => localStorage.setItem(KEYS.TEACHERS, JSON.stringify(data)),

  getClasses: (): Class[] => JSON.parse(localStorage.getItem(KEYS.CLASSES) || '[]'),
  saveClasses: (data: Class[]) => localStorage.setItem(KEYS.CLASSES, JSON.stringify(data)),

  getStudents: (): Student[] => JSON.parse(localStorage.getItem(KEYS.STUDENTS) || '[]'),
  saveStudents: (data: Student[]) => localStorage.setItem(KEYS.STUDENTS, JSON.stringify(data)),

  getNews: (): News[] => JSON.parse(localStorage.getItem(KEYS.NEWS) || '[]'),
  saveNews: (data: News[]) => localStorage.setItem(KEYS.NEWS, JSON.stringify(data)),

  getGallery: (): GalleryItem[] => JSON.parse(localStorage.getItem(KEYS.GALLERY) || '[]'),
  saveGallery: (data: GalleryItem[]) => localStorage.setItem(KEYS.GALLERY, JSON.stringify(data)),

  getUsers: (): User[] => JSON.parse(localStorage.getItem(KEYS.USERS) || '[]'),
  saveUsers: (data: User[]) => localStorage.setItem(KEYS.USERS, JSON.stringify(data)),

  getGrades: (): Grades[] => JSON.parse(localStorage.getItem(KEYS.GRADES) || '[]'),
  saveGrades: (data: Grades[]) => localStorage.setItem(KEYS.GRADES, JSON.stringify(data)),

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },
  setCurrentUser: (user: User | null) => {
    if (user) localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    else localStorage.removeItem(KEYS.CURRENT_USER);
  }
};
