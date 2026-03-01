import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storage } from '../storage';
import { News, GalleryItem, Teacher, Student, Class } from '../types';
import { Users, BookOpen, GraduationCap, DoorOpen, ArrowRight } from 'lucide-react';

export const Home: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    emptySeats: 0
  });

  useEffect(() => {
    const newsData = storage.getNews();
    const galleryData = storage.getGallery();
    const studentsData = storage.getStudents();
    const teachersData = storage.getTeachers();
    const classesData = storage.getClasses();

    setNews(newsData.slice(0, 3));
    setGallery(galleryData.slice(0, 4));

    const totalCapacity = classesData.reduce((acc, curr) => acc + curr.capacity, 0);
    setStats({
      students: studentsData.length,
      teachers: teachersData.length,
      classes: classesData.length,
      emptySeats: totalCapacity - studentsData.length
    });
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-64px)] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/school/1920/1080" 
            alt="School Hero" 
            className="w-full h-full object-cover brightness-50"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-layout relative z-10 text-white">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-5xl md:text-6xl leading-tight font-bold">
              Selamat Datang di <br />
              <span className="text-secondary">SDN Jakasampurna I</span>
            </h1>
            <p className="text-xl text-slate-200">
              Mewujudkan generasi unggul, berkarakter, dan siap menghadapi tantangan masa depan melalui pendidikan yang berkualitas dan inklusif.
            </p>
            <div className="flex gap-4 pt-4">
              <Link to="/ppdb" className="btn-secondary text-lg px-8 py-3">
                Lihat PPDB 2026/2027
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white animate-bounce hidden md:block">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest opacity-60">Scroll Down</span>
            <ArrowRight className="rotate-90" size={20} />
          </div>
        </div>
      </section>

      {/* Principal's Message Section */}
      <section className="max-layout py-10">
        <div className="card p-8 md:p-12 bg-white flex flex-col md:flex-row items-center gap-10 border-none shadow-xl shadow-slate-200/50">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-[2rem] overflow-hidden flex-shrink-0 shadow-2xl shadow-primary/20 rotate-3">
            <img 
              src="https://ui-avatars.com/api/?name=Kepala+Sekolah&background=0D8ABC&color=fff&size=512" 
              alt="Kepala Sekolah" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl text-primary">Sambutan Kepala Sekolah</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">SDN Jakasampurna I</p>
            </div>
            <div className="relative">
              <span className="absolute -left-6 -top-4 text-6xl text-primary/10 font-serif">"</span>
              <p className="text-lg text-slate-600 leading-relaxed italic">
                Assalamu'alaikum Warahmatullahi Wabarakatuh. Selamat datang di portal resmi SDN Jakasampurna I. Kami berkomitmen untuk memberikan layanan pendidikan terbaik bagi putra-putri Anda, mencetak generasi yang tidak hanya cerdas secara intelektual, namun juga memiliki karakter yang kuat dan berakhlak mulia. Mari bersama-sama membangun masa depan gemilang bagi anak bangsa.
              </p>
            </div>
            <div className="pt-4">
              <p className="font-bold text-slate-900 text-lg">H. Ahmad Syarifuddin, M.Pd.</p>
              <p className="text-sm text-slate-500">Kepala Sekolah SDN Jakasampurna I</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="max-layout">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Siswa', value: stats.students, icon: Users, color: 'bg-blue-500' },
            { label: 'Total Guru', value: stats.teachers, icon: GraduationCap, color: 'bg-orange-500' },
            { label: 'Jumlah Kelas', value: stats.classes, icon: BookOpen, color: 'bg-emerald-500' },
            { label: 'Bangku Kosong', value: stats.emptySeats, icon: DoorOpen, color: 'bg-purple-500' },
          ].map((stat, i) => (
            <div key={i} className="card p-6 flex flex-col items-center text-center space-y-2">
              <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-2 shadow-lg`}>
                <stat.icon size={24} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* News Preview */}
      <section className="max-layout space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl">Berita Terbaru</h2>
            <p className="text-slate-500">Ikuti perkembangan dan kegiatan terbaru di sekolah kami.</p>
          </div>
          <Link to="/berita" className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all">
            Lihat Semua <ArrowRight size={18} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map(item => (
            <div key={item.id} className="card group cursor-pointer">
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">
                  {item.category}
                </span>
                <h3 className="text-xl leading-snug group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-2">{item.content}</p>
                <p className="text-slate-400 text-xs pt-2">{new Date(item.date).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="bg-slate-50 py-20">
        <div className="max-layout space-y-8">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl">Galeri Kegiatan</h2>
              <p className="text-slate-500">Momen-momen berharga dalam perjalanan belajar mengajar.</p>
            </div>
            <Link to="/galeri" className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all">
              Lihat Galeri <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map(item => (
              <div key={item.id} className="aspect-square rounded-2xl overflow-hidden shadow-sm group relative">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-white text-sm font-medium">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA PPDB */}
      <section className="max-layout">
        <div className="bg-primary rounded-[2rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-primary/20">
          <div className="relative z-10 max-w-xl space-y-6">
            <h2 className="text-4xl">Siap Bergabung Bersama Kami?</h2>
            <p className="text-blue-100 text-lg">
              Pendaftaran Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027 telah dibuka. Segera daftarkan putra-putri Anda!
            </p>
            <Link to="/ppdb" className="inline-block bg-white text-primary px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-colors">
              Daftar Sekarang
            </Link>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <GraduationCap size={400} />
          </div>
        </div>
      </section>
    </div>
  );
};
