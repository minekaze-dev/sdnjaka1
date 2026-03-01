import React, { useState, useEffect } from 'react';
import { storage } from '../../storage';
import { Users, GraduationCap, BookOpen, DoorOpen, Newspaper, Image as ImageIcon } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    news: 0,
    gallery: 0,
    emptySeats: 0
  });

  useEffect(() => {
    const students = storage.getStudents();
    const teachers = storage.getTeachers();
    const classes = storage.getClasses();
    const news = storage.getNews();
    const gallery = storage.getGallery();

    const totalCapacity = classes.reduce((acc, curr) => acc + curr.capacity, 0);

    setStats({
      students: students.length,
      teachers: teachers.length,
      classes: classes.length,
      news: news.length,
      gallery: gallery.length,
      emptySeats: totalCapacity - students.length
    });
  }, []);

  const statCards = [
    { label: 'Total Siswa', value: stats.students, icon: Users, color: 'bg-blue-500', shadow: 'shadow-blue-500/20' },
    { label: 'Total Guru', value: stats.teachers, icon: GraduationCap, color: 'bg-orange-500', shadow: 'shadow-orange-500/20' },
    { label: 'Jumlah Kelas', value: stats.classes, icon: BookOpen, color: 'bg-emerald-500', shadow: 'shadow-emerald-500/20' },
    { label: 'Bangku Kosong', value: stats.emptySeats, icon: DoorOpen, color: 'bg-purple-500', shadow: 'shadow-purple-500/20' },
    { label: 'Total Berita', value: stats.news, icon: Newspaper, color: 'bg-rose-500', shadow: 'shadow-rose-500/20' },
    { label: 'Total Galeri', value: stats.gallery, icon: ImageIcon, color: 'bg-indigo-500', shadow: 'shadow-indigo-500/20' },
  ];

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl">Admin Overview</h1>
        <p className="text-slate-500">Selamat datang kembali, Administrator. Berikut adalah ringkasan data sekolah hari ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="card p-8 flex items-center gap-6 hover:scale-[1.02] transition-transform">
            <div className={`${stat.color} w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-xl ${stat.shadow}`}>
              <stat.icon size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-4xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-8 space-y-6">
          <h2 className="text-xl font-bold">Aktivitas Terakhir</h2>
          <div className="space-y-4">
            {[
              { text: 'Admin menambahkan berita baru: "Lomba 17 Agustus"', time: '2 jam yang lalu' },
              { text: 'Guru Budi Santoso menginput nilai rapor kelas 1A', time: '5 jam yang lalu' },
              { text: 'Admin memperbarui data guru Siti Aminah', time: '1 hari yang lalu' },
              { text: 'Admin mengupload 4 foto baru ke galeri', time: '2 hari yang lalu' },
            ].map((act, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-700">{act.text}</p>
                  <p className="text-xs text-slate-400">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-8 space-y-6">
          <h2 className="text-xl font-bold">Kapasitas Kelas</h2>
          <div className="space-y-6">
            {storage.getClasses().map(cls => {
              const students = storage.getStudents().filter(s => s.classId === cls.id).length;
              const percentage = (students / cls.capacity) * 100;
              return (
                <div key={cls.id} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <h3 className="font-bold text-slate-800">Kelas {cls.name}</h3>
                    <p className="text-xs font-bold text-slate-400">{students} / {cls.capacity} Siswa</p>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${percentage > 90 ? 'bg-rose-500' : percentage > 70 ? 'bg-orange-500' : 'bg-primary'}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
