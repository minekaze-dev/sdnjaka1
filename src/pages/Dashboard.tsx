import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { User } from '../types';
import { 
  LayoutDashboard, Users, GraduationCap, Newspaper, Image as ImageIcon, 
  BarChart3, Settings, LogOut, ChevronRight, BookOpen, ClipboardCheck, 
  UserCircle, FileText, PieChart
} from 'lucide-react';

// Sub-dashboards
import { AdminDashboard } from './dashboards/AdminDashboard';
import { GuruDashboard } from './dashboards/GuruDashboard';
import { MuridDashboard } from './dashboards/MuridDashboard';

interface DashboardProps {
  currentUser: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ currentUser }) => {
  const location = useLocation();

  const menuItems = {
    Admin: [
      { label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
      { label: 'Kelola Guru', icon: GraduationCap, path: '/dashboard/guru' },
      { label: 'Kelola Siswa', icon: Users, path: '/dashboard/siswa' },
      { label: 'Kelola Berita', icon: Newspaper, path: '/dashboard/berita' },
      { label: 'Kelola Galeri', icon: ImageIcon, path: '/dashboard/galeri' },
      { label: 'Statistik', icon: BarChart3, path: '/dashboard/statistik' },
    ],
    Guru: [
      { label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
      { label: 'Input Nilai Rapor', icon: ClipboardCheck, path: '/dashboard/nilai' },
      { label: 'Data Siswa', icon: Users, path: '/dashboard/siswa-guru' },
      { label: 'Cetak Rapor', icon: FileText, path: '/dashboard/rapor' },
    ],
    Murid: [
      { label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
      { label: 'Lihat Nilai Rapor', icon: PieChart, path: '/dashboard/nilai-siswa' },
      { label: 'Berita Sekolah', icon: Newspaper, path: '/dashboard/berita-siswa' },
      { label: 'Galeri Kegiatan', icon: ImageIcon, path: '/dashboard/galeri-siswa' },
    ]
  };

  const currentMenu = menuItems[currentUser.role];

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50 print:bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 hidden lg:flex flex-col sticky top-16 h-[calc(100vh-64px)] print:hidden">
        <div className="p-6 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <UserCircle size={28} />
            </div>
            <div className="flex-grow min-w-0">
              <h3 className="font-bold text-slate-900 truncate">{currentUser.name}</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{currentUser.role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-1">
          {currentMenu.map((item, i) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={i} 
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                  isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-50">
          <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bantuan</p>
            <Link to="/" className="text-xs font-semibold text-slate-600 hover:text-primary flex items-center gap-2">
              <BookOpen size={14} /> Panduan Pengguna
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-10 overflow-x-hidden print:p-0 print:overflow-visible">
        <Routes>
          <Route path="/" element={
            currentUser.role === 'Admin' ? <AdminDashboard /> : 
            currentUser.role === 'Guru' ? <GuruDashboard currentUser={currentUser} activeTab="overview" /> : 
            <MuridDashboard currentUser={currentUser} />
          } />
          
          {/* Admin Routes */}
          {currentUser.role === 'Admin' && (
            <>
              <Route path="/guru" element={<Navigate to="/guru" />} />
              <Route path="/siswa" element={<Navigate to="/siswa" />} />
              <Route path="/berita" element={<Navigate to="/berita" />} />
              <Route path="/galeri" element={<Navigate to="/galeri" />} />
              <Route path="/statistik" element={<AdminDashboard />} />
            </>
          )}

          {/* Guru Routes */}
          {currentUser.role === 'Guru' && (
            <>
              <Route path="/" element={<GuruDashboard currentUser={currentUser} activeTab="overview" />} />
              <Route path="/nilai" element={<GuruDashboard currentUser={currentUser} activeTab="input" />} />
              <Route path="/siswa-guru" element={<GuruDashboard currentUser={currentUser} activeTab="students" />} />
              <Route path="/rapor" element={<GuruDashboard currentUser={currentUser} activeTab="report" />} />
            </>
          )}

          {/* Murid Routes */}
          {currentUser.role === 'Murid' && (
            <>
              <Route path="/nilai-siswa" element={<MuridDashboard currentUser={currentUser} />} />
              <Route path="/berita-siswa" element={<Navigate to="/berita" />} />
              <Route path="/galeri-siswa" element={<Navigate to="/galeri" />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
};
