import React, { useState, useEffect } from 'react';
import { storage } from '../storage';
import { Teacher, User } from '../types';
import { Plus, Edit2, Trash2, Search, X, Mail, Phone, Briefcase, Book } from 'lucide-react';

interface TeachersPageProps {
  currentUser: User | null;
}

export const TeachersPage: React.FC<TeachersPageProps> = ({ currentUser }) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    nip: '',
    subject: '',
    position: '',
    avatar: ''
  });

  useEffect(() => {
    setTeachers(storage.getTeachers());
  }, []);

  const isAdmin = currentUser?.role === 'Admin';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const currentTeachers = storage.getTeachers();
    if (editingTeacher) {
      const updated = currentTeachers.map(t => t.id === editingTeacher.id ? { ...editingTeacher, ...formData } : t);
      storage.saveTeachers(updated);
      setTeachers(updated);
    } else {
      const newItem: Teacher = {
        id: 't' + Date.now(),
        ...formData
      };
      const updated = [...currentTeachers, newItem];
      storage.saveTeachers(updated);
      setTeachers(updated);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus data guru ini?')) {
      const updated = teachers.filter(t => t.id !== id);
      storage.saveTeachers(updated);
      setTeachers(updated);
    }
  };

  const openModal = (item?: Teacher) => {
    if (item) {
      setEditingTeacher(item);
      setFormData({
        name: item.name,
        nip: item.nip,
        subject: item.subject,
        position: item.position,
        avatar: item.avatar
      });
    } else {
      setEditingTeacher(null);
      setFormData({
        name: '',
        nip: '',
        subject: '',
        position: '',
        avatar: `https://ui-avatars.com/api/?name=Guru&background=0D8ABC&color=fff`
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTeacher(null);
  };

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.nip.includes(searchTerm)
  );

  return (
    <div className="max-layout py-12 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl">Data Guru</h1>
          <p className="text-slate-500">Tenaga pendidik profesional SDN Jakasampurna I.</p>
        </div>
        {isAdmin && (
          <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 self-start">
            <Plus size={20} /> Tambah Guru
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Cari nama, NIP, atau mata pelajaran..." 
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTeachers.map(teacher => (
          <div key={teacher.id} className="card group relative">
            <div className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-inner group-hover:scale-105 transition-transform duration-300">
                <img 
                  src={teacher.avatar} 
                  alt={teacher.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${teacher.name}&background=0D8ABC&color=fff`;
                  }}
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{teacher.name}</h3>
                <p className="text-sm text-slate-400 font-medium tracking-wider">NIP: {teacher.nip}</p>
              </div>
              
              <div className="w-full grid grid-cols-2 gap-4 pt-4">
                <div className="bg-slate-50 p-3 rounded-2xl space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-primary">
                    <Book size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Mapel</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">{teacher.subject}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-secondary">
                    <Briefcase size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Jabatan</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">{teacher.position}</p>
                </div>
              </div>

              {isAdmin && (
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openModal(teacher)}
                    className="p-2 bg-white text-slate-700 rounded-lg shadow-lg hover:text-primary transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(teacher.id)}
                    className="p-2 bg-white text-slate-700 rounded-lg shadow-lg hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredTeachers.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400">Tidak ada data guru ditemukan.</p>
        </div>
      )}

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl">{editingTeacher ? 'Edit Data Guru' : 'Tambah Data Guru'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Nama Lengkap</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">NIP</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                    value={formData.nip}
                    onChange={e => setFormData({ ...formData, nip: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Mata Pelajaran</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Jabatan</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                    value={formData.position}
                    onChange={e => setFormData({ ...formData, position: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">URL Foto Avatar</label>
                  <input 
                    type="url" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                    value={formData.avatar}
                    onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors">
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
    </div>
  );
};
