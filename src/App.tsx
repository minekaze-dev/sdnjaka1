import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { storage } from './storage';
import { User, Role } from './types';

// Pages
import { Home } from './pages/Home';
import { NewsPage } from './pages/NewsPage';
import { TeachersPage } from './pages/TeachersPage';
import { StudentsPage } from './pages/StudentsPage';
import { GalleryPage } from './pages/GalleryPage';
import { PPDBPage } from './pages/PPDBPage';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    storage.init();
    const user = storage.getCurrentUser();
    setCurrentUser(user);
    setIsLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    storage.setCurrentUser(user);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    storage.setCurrentUser(null);
    setCurrentUser(null);
  };

  const handleSwitchRole = (role: Role) => {
    const users = storage.getUsers();
    const targetUser = users.find(u => u.role === role);
    if (targetUser) {
      handleLogin(targetUser);
    }
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar 
          currentUser={currentUser} 
          onLogout={handleLogout} 
          onSwitchRole={handleSwitchRole} 
        />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/berita" element={<NewsPage currentUser={currentUser} />} />
            <Route path="/guru" element={<TeachersPage currentUser={currentUser} />} />
            <Route path="/siswa" element={<StudentsPage currentUser={currentUser} />} />
            <Route path="/galeri" element={<GalleryPage currentUser={currentUser} />} />
            <Route path="/ppdb" element={<PPDBPage />} />
            <Route 
              path="/login" 
              element={currentUser ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />} 
            />
            <Route 
              path="/dashboard/*" 
              element={currentUser ? <Dashboard currentUser={currentUser} /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>

        <footer className="bg-slate-900 text-white py-12 mt-20">
          <div className="max-layout grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">S</div>
                <h2 className="text-xl">SDN Jakasampurna I</h2>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Sekolah Dasar Negeri Jakasampurna I berkomitmen untuk mencetak generasi yang cerdas, kreatif, dan berakhlak mulia.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Kontak Kami</h3>
              <ul className="text-slate-400 text-sm space-y-2">
                <li>Jl. Jakasampurna No. 1, Bekasi</li>
                <li>Telp: (021) 12345678</li>
                <li>Email: info@sdnjakasampurna1.sch.id</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Tautan Cepat</h3>
              <ul className="text-slate-400 text-sm space-y-2">
                <li><a href="/berita" className="hover:text-white">Berita Sekolah</a></li>
                <li><a href="/ppdb" className="hover:text-white">PPDB 2026/2027</a></li>
                <li><a href="/galeri" className="hover:text-white">Galeri Kegiatan</a></li>
              </ul>
            </div>
          </div>
          <div className="max-layout border-t border-slate-800 mt-10 pt-6 text-center text-slate-500 text-xs">
            &copy; 2026 SDN Jakasampurna I. All rights reserved.
          </div>
        </footer>
      </div>
    </Router>
  );
}
