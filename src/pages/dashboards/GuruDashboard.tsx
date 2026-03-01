import React, { useState, useEffect } from 'react';
import { storage } from '../../storage';
import { User, Student, Class, Grades } from '../../types';
import { ClipboardCheck, Users, FileText, Save, Printer, ArrowLeft, CheckCircle2, X } from 'lucide-react';

interface GuruDashboardProps {
  currentUser: User;
  activeTab: 'overview' | 'input' | 'students' | 'report';
}

export const GuruDashboard: React.FC<GuruDashboardProps> = ({ currentUser, activeTab }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [grades, setGrades] = useState<Grades[]>([]);
  
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [isInputMode, setIsInputMode] = useState(false);
  const [isReportMode, setIsReportMode] = useState(false);

  const [formData, setFormData] = useState({
    matematika: 0,
    bahasaIndonesia: 0,
    ipa: 0,
    ips: 0,
    ppkn: 0,
    seniBudaya: 0,
    olahraga: 0,
    sikap: 'B' as Grades['sikap']
  });

  useEffect(() => {
    setStudents(storage.getStudents());
    setClasses(storage.getClasses());
    setGrades(storage.getGrades());
    setIsReportMode(false);
  }, [activeTab]);

  useEffect(() => {
    if (isReportMode) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isReportMode]);

  const filteredStudents = students.filter(s => s.classId === selectedClass);
  const currentGrade = grades.find(g => g.studentId === selectedStudent && g.classId === selectedClass);

  const handleStartInput = (studentId: string) => {
    setSelectedStudent(studentId);
    const existing = grades.find(g => g.studentId === studentId && g.classId === selectedClass);
    if (existing) {
      setFormData({
        matematika: existing.matematika,
        bahasaIndonesia: existing.bahasaIndonesia,
        ipa: existing.ipa,
        ips: existing.ips,
        ppkn: existing.ppkn,
        seniBudaya: existing.seniBudaya,
        olahraga: existing.olahraga,
        sikap: existing.sikap
      });
    } else {
      setFormData({
        matematika: 0,
        bahasaIndonesia: 0,
        ipa: 0,
        ips: 0,
        ppkn: 0,
        seniBudaya: 0,
        olahraga: 0,
        sikap: 'B'
      });
    }
    setIsInputMode(true);
  };

  const handleSaveGrades = (e: React.FormEvent) => {
    e.preventDefault();
    const currentGrades = storage.getGrades();
    const values = Object.values(formData).filter(v => typeof v === 'number') as number[];
    const average = values.reduce((a, b) => a + b, 0) / values.length;

    const newGrade: Grades = {
      id: currentGrade?.id || 'g' + Date.now(),
      studentId: selectedStudent,
      classId: selectedClass,
      ...formData,
      average: parseFloat(average.toFixed(2))
    };

    let updated;
    if (currentGrade) {
      updated = currentGrades.map(g => g.id === currentGrade.id ? newGrade : g);
    } else {
      updated = [...currentGrades, newGrade];
    }

    storage.saveGrades(updated);
    setGrades(updated);
    setIsInputMode(false);
    alert('Nilai berhasil disimpan!');
  };

  const handlePrint = () => {
    window.print();
  };

  const renderReport = () => {
    if (!selectedStudent) return null;
    const student = students.find(s => s.id === selectedStudent);
    const cls = classes.find(c => c.id === selectedClass);
    const grade = grades.find(g => g.studentId === selectedStudent && g.classId === selectedClass);

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-between items-center print:hidden">
          <button onClick={() => setIsReportMode(false)} className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors">
            <ArrowLeft size={20} /> Kembali
          </button>
          <button onClick={handlePrint} className="btn-primary flex items-center gap-2">
            <Printer size={20} /> Cetak Rapor
          </button>
        </div>

        <div className="card p-12 space-y-10 bg-white print:shadow-none print:border-none print:p-0">
          <div className="text-center space-y-2 border-b-2 border-slate-900 pb-6">
            <h1 className="text-2xl font-bold uppercase">Laporan Hasil Belajar Siswa (Rapor)</h1>
            <h2 className="text-xl font-bold uppercase">SDN Jakasampurna I</h2>
            <p className="text-sm">Jl. Jakasampurna No. 1, Bekasi, Jawa Barat</p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm font-medium">
            <div className="space-y-1">
              <p>Nama Siswa : <span className="font-bold">{student?.name}</span></p>
              <p>NISN : <span className="font-bold">{student?.nisn}</span></p>
            </div>
            <div className="space-y-1 text-right">
              <p>Kelas : <span className="font-bold">{cls?.name}</span></p>
              <p>Semester : <span className="font-bold">Genap</span></p>
              <p>Tahun Ajaran : <span className="font-bold">2026/2027</span></p>
            </div>
          </div>

          <table className="w-full border-collapse border-2 border-slate-900">
            <thead>
              <tr className="bg-slate-100">
                <th className="border-2 border-slate-900 px-4 py-2 text-left">Mata Pelajaran</th>
                <th className="border-2 border-slate-900 px-4 py-2 text-center w-24">Nilai</th>
                <th className="border-2 border-slate-900 px-4 py-2 text-center w-32">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Matematika', val: grade?.matematika },
                { name: 'Bahasa Indonesia', val: grade?.bahasaIndonesia },
                { name: 'IPA', val: grade?.ipa },
                { name: 'IPS', val: grade?.ips },
                { name: 'PPKn', val: grade?.ppkn },
                { name: 'Seni Budaya', val: grade?.seniBudaya },
                { name: 'Olahraga', val: grade?.olahraga },
              ].map((m, i) => (
                <tr key={i}>
                  <td className="border-2 border-slate-900 px-4 py-2">{m.name}</td>
                  <td className="border-2 border-slate-900 px-4 py-2 text-center font-bold">{m.val || '-'}</td>
                  <td className="border-2 border-slate-900 px-4 py-2 text-center text-xs">
                    {(m.val || 0) >= 75 ? 'Tuntas' : 'Perlu Bimbingan'}
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold">
                <td className="border-2 border-slate-900 px-4 py-2">Rata-rata</td>
                <td className="border-2 border-slate-900 px-4 py-2 text-center text-primary">{grade?.average || '-'}</td>
                <td className="border-2 border-slate-900 px-4 py-2"></td>
              </tr>
              <tr>
                <td className="border-2 border-slate-900 px-4 py-2">Nilai Sikap</td>
                <td className="border-2 border-slate-900 px-4 py-2 text-center font-bold">{grade?.sikap || '-'}</td>
                <td className="border-2 border-slate-900 px-4 py-2 text-center text-xs">
                  {grade?.sikap === 'A' ? 'Sangat Baik' : grade?.sikap === 'B' ? 'Baik' : 'Cukup'}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="grid grid-cols-2 gap-20 pt-10 text-center">
            <div className="space-y-20">
              <p>Orang Tua/Wali</p>
              <p className="font-bold border-b border-slate-900 inline-block px-10">( ............................ )</p>
            </div>
            <div className="space-y-20">
              <p>Bekasi, {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })} <br /> Wali Kelas</p>
              <p className="font-bold border-b border-slate-900 inline-block px-10">{currentUser.name}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isReportMode) return renderReport();

  return (
    <div className="space-y-6">
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Users size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Siswa Anda</p>
                <h3 className="text-2xl font-bold">{students.length} Siswa</h3>
              </div>
            </div>
            <div className="card p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                <ClipboardCheck size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nilai Terinput</p>
                <h3 className="text-2xl font-bold">{grades.length} Rapor</h3>
              </div>
            </div>
          </div>

          <div className="card p-8 space-y-6">
            <h2 className="text-xl font-bold">Selamat Datang, {currentUser.name}</h2>
            <p className="text-slate-600 leading-relaxed">
              Gunakan menu di samping untuk mengelola data akademik siswa Anda. Anda dapat menginput nilai rapor, melihat daftar siswa di kelas Anda, dan mencetak rapor hasil belajar siswa.
            </p>
          </div>
        </div>
      )}

      {(activeTab === 'input' || activeTab === 'report') && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="card">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold">{activeTab === 'input' ? 'Input Nilai Rapor' : 'Cetak Rapor Siswa'}</h2>
                <select 
                  className="px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                  value={selectedClass}
                  onChange={e => setSelectedClass(e.target.value)}
                >
                  <option value="">-- Pilih Kelas --</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>Kelas {c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedClass ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Siswa</th>
                      <th className="px-6 py-4">NISN</th>
                      <th className="px-6 py-4">Status Nilai</th>
                      <th className="px-6 py-4">Rata-rata</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map(student => {
                      const grade = grades.find(g => g.studentId === student.id && g.classId === selectedClass);
                      return (
                        <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 bg-slate-50">
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
                              <span className="font-semibold text-slate-900">{student.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500 font-mono">{student.nisn}</td>
                          <td className="px-6 py-4">
                            {grade ? (
                              <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                                <CheckCircle2 size={14} /> Terisi
                              </span>
                            ) : (
                              <span className="text-slate-400 text-xs font-bold">Belum Diisi</span>
                            )}
                          </td>
                          <td className="px-6 py-4 font-bold text-primary">
                            {grade?.average || '-'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {activeTab === 'input' ? (
                              <button 
                                onClick={() => handleStartInput(student.id)}
                                className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary-dark transition-colors flex items-center gap-2 ml-auto"
                              >
                                <ClipboardCheck size={14} /> Input Nilai
                              </button>
                            ) : (
                              grade ? (
                                <button 
                                  onClick={() => {
                                    setSelectedStudent(student.id);
                                    setIsReportMode(true);
                                  }}
                                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 ml-auto"
                                >
                                  <Printer size={14} /> Cetak Rapor
                                </button>
                              ) : (
                                <span className="text-xs text-slate-400 italic">Nilai belum tersedia</span>
                              )
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-20 text-center text-slate-400">
                Silakan pilih kelas terlebih dahulu untuk melihat daftar siswa.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="card">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold">Daftar Siswa Kelas</h2>
              <select 
                className="px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
              >
                <option value="">-- Pilih Kelas --</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>Kelas {c.name}</option>
                ))}
              </select>
            </div>
            {selectedClass ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {filteredStudents.map(student => (
                  <div key={student.id} className="p-4 rounded-2xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
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
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900">{student.name}</p>
                      <p className="text-xs text-slate-500 font-mono">NISN: {student.nisn}</p>
                      <span className="inline-block px-2 py-0.5 bg-blue-50 text-primary text-[10px] font-bold rounded-full uppercase">
                        {classes.find(c => c.id === student.classId)?.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-20 text-center text-slate-400">
                Pilih kelas untuk melihat data siswa.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input Modal */}
      {isInputMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl">Input Nilai Rapor</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                  Siswa: {students.find(s => s.id === selectedStudent)?.name}
                </p>
              </div>
              <button onClick={() => setIsInputMode(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSaveGrades} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Matematika', key: 'matematika' },
                  { label: 'Bahasa Indonesia', key: 'bahasaIndonesia' },
                  { label: 'IPA', key: 'ipa' },
                  { label: 'IPS', key: 'ips' },
                  { label: 'PPKn', key: 'ppkn' },
                  { label: 'Seni Budaya', key: 'seniBudaya' },
                  { label: 'Olahraga', key: 'olahraga' },
                ].map(subject => (
                  <div key={subject.key} className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">{subject.label}</label>
                    <input 
                      type="number" 
                      required
                      min={0}
                      max={100}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                      value={formData[subject.key as keyof typeof formData]}
                      onChange={e => setFormData({ ...formData, [subject.key]: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                ))}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Nilai Sikap</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                    value={formData.sikap}
                    onChange={e => setFormData({ ...formData, sikap: e.target.value as Grades['sikap'] })}
                  >
                    <option value="A">A (Sangat Baik)</option>
                    <option value="B">B (Baik)</option>
                    <option value="C">C (Cukup)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsInputMode(false)} className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                  Batal
                </button>
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save size={20} /> Simpan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
