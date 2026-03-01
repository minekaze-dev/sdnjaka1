import React from 'react';
import { CheckCircle2, Calendar, FileText, Download, ArrowRight, Info } from 'lucide-react';

export const PPDBPage: React.FC = () => {
  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="bg-primary text-white py-24 relative overflow-hidden">
        <div className="max-layout relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-sm font-bold uppercase tracking-widest">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            Pendaftaran Dibuka
          </div>
          <h1 className="text-5xl md:text-6xl max-w-3xl leading-tight">
            Penerimaan Peserta Didik Baru <br />
            <span className="text-secondary">Tahun Ajaran 2026/2027</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Bergabunglah bersama kami di SDN Jakasampurna I. Sekolah yang mengedepankan kualitas pendidikan dan pembentukan karakter anak bangsa.
          </p>
          <div className="flex gap-4 pt-6">
            <button 
              onClick={() => alert('Fitur pendaftaran online akan segera tersedia!')}
              className="btn-secondary text-lg px-10 py-4 shadow-xl shadow-orange-500/20"
            >
              Daftar Online Sekarang
            </button>
            <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-10 py-4 rounded-xl transition-all font-bold border border-white/20 flex items-center gap-2">
              <Download size={20} /> Download Brosur
            </button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-1/4 translate-y-1/4">
          <FileText size={600} />
        </div>
      </section>

      <div className="max-layout mt-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Persyaratan */}
        <div className="lg:col-span-2 space-y-12">
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <CheckCircle2 size={28} />
              </div>
              <h2 className="text-3xl">Persyaratan Pendaftaran</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                'Fotocopy Kartu Keluarga (KK)',
                'Fotocopy Akta Kelahiran',
                'Pas foto terbaru ukuran 3x4 (4 lembar)',
                'Usia minimal 6 tahun per 1 Juli 2026',
                'Fotocopy Ijazah TK/PAUD (jika ada)',
                'Mengisi formulir pendaftaran'
              ].map((item, i) => (
                <div key={i} className="card p-6 flex items-start gap-4 hover:border-primary/30 transition-colors group">
                  <div className="mt-1 text-primary group-hover:scale-110 transition-transform">
                    <CheckCircle2 size={20} />
                  </div>
                  <p className="font-medium text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500">
                <Calendar size={28} />
              </div>
              <h2 className="text-3xl">Jadwal Pelaksanaan</h2>
            </div>
            <div className="card divide-y divide-slate-100">
              {[
                { event: 'Pendaftaran Gelombang 1', date: 'Januari – Februari 2026' },
                { event: 'Pendaftaran Gelombang 2', date: 'Maret 2026' },
                { event: 'Seleksi Administrasi & Observasi', date: 'April 2026' },
                { event: 'Pengumuman Hasil Seleksi', date: 'Mei 2026' },
                { event: 'Daftar Ulang', date: 'Juni 2026' },
              ].map((item, i) => (
                <div key={i} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <span className="font-bold text-lg text-slate-800">{item.event}</span>
                  <div className="flex items-center gap-2 text-slate-500 font-medium bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                    <Calendar size={16} />
                    {item.date}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="card p-8 bg-slate-900 text-white space-y-6">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
              <Info size={24} />
            </div>
            <h3 className="text-2xl">Butuh Bantuan?</h3>
            <p className="text-slate-400 leading-relaxed">
              Jika Anda memiliki pertanyaan seputar pendaftaran, silakan hubungi panitia PPDB kami melalui kontak di bawah ini.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <ArrowRight size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">WhatsApp</p>
                  <p className="font-medium">0812-3456-7890</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <ArrowRight size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Email</p>
                  <p className="font-medium">ppdb@sdnjakasampurna1.sch.id</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-8 space-y-6 border-2 border-primary/20 bg-primary/5">
            <h3 className="text-xl font-bold text-primary">Alur Pendaftaran</h3>
            <div className="space-y-6 relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-primary/20"></div>
              {[
                'Ambil/Download Formulir',
                'Lengkapi Berkas Persyaratan',
                'Serahkan Berkas ke Panitia',
                'Ikuti Observasi Siswa',
                'Tunggu Pengumuman'
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-6 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-lg shadow-primary/30">
                    {i + 1}
                  </div>
                  <p className="font-semibold text-slate-700 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
