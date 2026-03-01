import React, { useState, useEffect } from 'react';
import { storage } from '../../storage';
import { User, Student, Class, Grades } from '../../types';
import { PieChart, Newspaper, Image as ImageIcon, FileText, Calendar, ArrowRight, UserCircle } from 'lucide-react';

interface MuridDashboardProps {
  currentUser: User;
}

export const MuridDashboard: React.FC<MuridDashboardProps> = ({ currentUser }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [cls, setCls] = useState<Class | null>(null);
  const [grade, setGrade] = useState<Grades | null>(null);
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    const students = storage.getStudents();
    const classes = storage.getClasses();
    const grades = storage.getGrades();
    const newsData = storage.getNews();

    const currentStudent = students.find(s => s.id === currentUser.studentId);
    if (currentStudent) {
      setStudent(currentStudent);
      setCls(classes.find(c => c.id === currentStudent.classId) || null);
      setGrade(grades.find(g => g.studentId === currentStudent.id) || null);
    }
    setNews(newsData.slice(0, 2));
  }, [currentUser]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl">Dashboard Murid</h1>
          <p className="text-slate-500">Halo, {currentUser.name}! Pantau nilai dan kegiatan sekolahmu di sini.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 shadow-inner">
            {student?.avatar ? (
              <img 
                src={student.avatar} 
                alt={student.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${student?.name}&background=random`;
                }}
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary">
                <UserCircle size={24} />
              </div>
            )}
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kelas Kamu</p>
            <p className="font-bold text-slate-800">{cls?.name || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rapor Summary */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card p-8 space-y-8 bg-gradient-to-br from-primary to-blue-700 text-white relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">Rata-rata Nilai</h2>
                  <p className="text-blue-100 text-sm">Semester Genap 2026/2027</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-3xl text-center min-w-[100px]">
                  <p className="text-4xl font-bold">{grade?.average || '-'}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Skala 100</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {[
                  { label: 'Matematika', val: grade?.matematika },
                  { label: 'B. Indonesia', val: grade?.bahasaIndonesia },
                  { label: 'IPA', val: grade?.ipa },
                  { label: 'Sikap', val: grade?.sikap },
                ].map((m, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">{m.label}</p>
                    <p className="text-xl font-bold">{m.val || '-'}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-1/4 translate-y-1/4">
              <PieChart size={300} />
            </div>
          </div>

          <div className="card">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold">Detail Nilai Rapor</h2>
            </div>
            <div className="p-6">
              {grade ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Matematika', val: grade.matematika },
                    { label: 'Bahasa Indonesia', val: grade.bahasaIndonesia },
                    { label: 'IPA', val: grade.ipa },
                    { label: 'IPS', val: grade.ips },
                    { label: 'PPKn', val: grade.ppkn },
                    { label: 'Seni Budaya', val: grade.seniBudaya },
                    { label: 'Olahraga', val: grade.olahraga },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="font-medium text-slate-700">{item.label}</span>
                      <span className="font-bold text-primary">{item.val}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-slate-400 space-y-4">
                  <FileText className="mx-auto opacity-20" size={48} />
                  <p>Nilai rapor kamu belum diinput oleh wali kelas.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar News */}
        <div className="space-y-8">
          <div className="card p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Berita Terbaru</h2>
              <a href="/berita" className="text-primary text-xs font-bold hover:underline">Lihat Semua</a>
            </div>
            <div className="space-y-6">
              {news.map(item => (
                <div key={item.id} className="space-y-3 group cursor-pointer">
                  <div className="h-32 rounded-xl overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{item.category}</p>
                    <h3 className="font-bold text-slate-800 leading-tight group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(item.date).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6 bg-secondary text-white space-y-4">
            <h3 className="font-bold text-lg">Info PPDB 2026</h3>
            <p className="text-xs text-orange-100 leading-relaxed">
              Pendaftaran siswa baru sudah dibuka! Beritahu teman atau saudaramu untuk bergabung bersama kami.
            </p>
            <a href="/ppdb" className="inline-flex items-center gap-2 bg-white text-secondary px-4 py-2 rounded-xl text-xs font-bold hover:bg-orange-50 transition-colors">
              Lihat Selengkapnya <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
