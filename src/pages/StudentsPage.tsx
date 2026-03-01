import React, { useState, useEffect } from 'react';
import { storage } from '../storage';
import { Student, Class, User } from '../types';
import { Plus, Edit2, Trash2, Search, X, Users, DoorOpen, Settings } from 'lucide-react';

interface StudentsPageProps {
  currentUser: User | null;
}

export const StudentsPage: React.FC<StudentsPageProps> = ({ currentUser }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [studentFormData, setStudentFormData] = useState({
    name: '',
    nisn: '',
    classId: '',
    avatar: ''
  });

  const [classFormData, setClassFormData] = useState({
    name: '',
    capacity: 32
  });

  useEffect(() => {
    setStudents(storage.getStudents());
    setClasses(storage.getClasses());
  }, []);

  const isAdmin = currentUser?.role === 'Admin';

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const currentStudents = storage.getStudents();
    if (editingStudent) {
      const updated = currentStudents.map(s => s.id === editingStudent.id ? { ...editingStudent, ...studentFormData } : s);
      storage.saveStudents(updated);
      setStudents(updated);
    } else {
      const newItem: Student = {
        id: 's' + Date.now(),
        ...studentFormData
      };
      const updated = [...currentStudents, newItem];
      storage.saveStudents(updated);
      setStudents(updated);
    }
    closeStudentModal();
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    const currentClasses = storage.getClasses();
    if (editingClass) {
      const updated = currentClasses.map(c => c.id === editingClass.id ? { ...editingClass, ...classFormData } : c);
      storage.saveClasses(updated);
      setClasses(updated);
    } else {
      const newItem: Class = {
        id: 'c' + Date.now(),
        ...classFormData
      };
      const updated = [...currentClasses, newItem];
      storage.saveClasses(updated);
      setClasses(updated);
    }
    closeClassModal();
  };

  const handleDeleteStudent = (id: string) => {
    if (window.confirm('Hapus data siswa ini?')) {
      const updated = students.filter(s => s.id !== id);
      storage.saveStudents(updated);
      setStudents(updated);
    }
  };

  const handleDeleteClass = (id: string) => {
    if (window.confirm('Hapus kelas ini? Semua data siswa di kelas ini akan kehilangan referensi kelas.')) {
      const updated = classes.filter(c => c.id !== id);
      storage.saveClasses(updated);
      setClasses(updated);
    }
  };

  const openStudentModal = (item?: Student) => {
    if (item) {
      setEditingStudent(item);
      setStudentFormData({
        name: item.name,
        nisn: item.nisn,
        classId: item.classId,
        avatar: item.avatar
      });
    } else {
      setEditingStudent(null);
      setStudentFormData({
        name: '',
        nisn: '',
        classId: classes[0]?.id || '',
        avatar: `https://ui-avatars.com/api/?name=Siswa&background=random`
      });
    }
    setIsStudentModalOpen(true);
  };

  const openClassModal = (item?: Class) => {
    if (item) {
      setEditingClass(item);
      setClassFormData({
        name: item.name,
        capacity: item.capacity
      });
    } else {
      setEditingClass(null);
      setClassFormData({
        name: '',
        capacity: 32
      });
    }
    setIsClassModalOpen(true);
  };

  const closeStudentModal = () => {
    setIsStudentModalOpen(false);
    setEditingStudent(null);
  };

  const closeClassModal = () => {
    setIsClassModalOpen(false);
    setEditingClass(null);
  };

  const getStudentCount = (classId: string) => students.filter(s => s.classId === classId).length;

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.nisn.includes(searchTerm)
  );

  return (
    <div className="max-layout py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl">Data Siswa & Kelas</h1>
          <p className="text-slate-500">Manajemen data peserta didik dan pembagian kelas.</p>
        </div>
        {isAdmin && (
          <div className="flex gap-3">
            <button onClick={() => openClassModal()} className="bg-white text-slate-700 border border-slate-200 px-6 py-2 rounded-xl font-medium hover:bg-slate-50 transition-all flex items-center gap-2">
              <DoorOpen size={18} /> Tambah Kelas
            </button>
            <button onClick={() => openStudentModal()} className="btn-primary flex items-center gap-2">
              <Plus size={20} /> Tambah Siswa
            </button>
          </div>
        )}
      </div>

      {/* Classes Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {classes.map(cls => {
          const count = getStudentCount(cls.id);
          const empty = cls.capacity - count;
          return (
            <div key={cls.id} className="card p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-slate-900">Kelas {cls.name}</h3>
                  <p className="text-sm text-slate-500">Kapasitas: {cls.capacity} Siswa</p>
                </div>
                {isAdmin && (
                  <div className="flex gap-1">
                    <button onClick={() => openClassModal(cls)} className="p-2 text-slate-400 hover:text-primary transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDeleteClass(cls.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span className="text-slate-400">Terisi</span>
                  <span className="text-primary">{count} Siswa</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500" 
                    style={{ width: `${(count / cls.capacity) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 text-right">
                  Bangku Kosong: <span className="font-bold text-secondary">{empty}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Students Table */}
      <div className="card">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl">Daftar Seluruh Siswa</h2>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari nama atau NISN..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Siswa</th>
                <th className="px-6 py-4">NISN</th>
                <th className="px-6 py-4">Kelas</th>
                {isAdmin && <th className="px-6 py-4 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student, index) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-500">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100">
                        <img 
                          src={student.avatar} 
                          alt={student.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${student.name}&background=random`;
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-mono">{student.nisn}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-primary text-xs font-bold rounded-full">
                      {classes.find(c => c.id === student.classId)?.name || 'N/A'}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openStudentModal(student)} className="p-2 text-slate-400 hover:text-primary transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDeleteStudent(student.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredStudents.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            Tidak ada data siswa ditemukan.
          </div>
        )}
      </div>

      {/* Student Modal */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl">{editingStudent ? 'Edit Siswa' : 'Tambah Siswa'}</h2>
              <button onClick={closeStudentModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSaveStudent} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                  value={studentFormData.name}
                  onChange={e => setStudentFormData({ ...studentFormData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">NISN</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                  value={studentFormData.nisn}
                  onChange={e => setStudentFormData({ ...studentFormData, nisn: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Kelas</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                  value={studentFormData.classId}
                  onChange={e => setStudentFormData({ ...studentFormData, classId: e.target.value })}
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>Kelas {c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">URL Foto Profil (Formal)</label>
                <input 
                  type="url" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                  value={studentFormData.avatar}
                  onChange={e => setStudentFormData({ ...studentFormData, avatar: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={closeStudentModal} className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                  Batal
                </button>
                <button type="submit" className="btn-primary">
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Class Modal */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl">{editingClass ? 'Edit Kelas' : 'Tambah Kelas'}</h2>
              <button onClick={closeClassModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSaveClass} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Nama Kelas</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: 1A"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                  value={classFormData.name}
                  onChange={e => setClassFormData({ ...classFormData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Kapasitas Maksimal</label>
                <input 
                  type="number" 
                  required
                  min={1}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                  value={classFormData.capacity}
                  onChange={e => setClassFormData({ ...classFormData, capacity: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={closeClassModal} className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                  Batal
                </button>
                <button type="submit" className="btn-primary">
                  Simpan Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
