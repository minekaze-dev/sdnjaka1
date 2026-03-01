import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Role } from '../types';
import { storage } from '../storage';
import { LogIn, LogOut, LayoutDashboard, ChevronDown, UserCircle } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  onLogout: () => void;
  onSwitchRole: (role: Role) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser, onLogout, onSwitchRole }) => {
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const navigate = useNavigate();

  const roles: Role[] = ['Admin', 'Guru', 'Murid'];

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 print:hidden">
      <div className="max-layout h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
            S
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg leading-tight text-primary">SDN Jakasampurna I</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Unggul & Berkarakter</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Beranda</Link>
          <Link to="/berita" className="text-sm font-medium hover:text-primary transition-colors">Berita</Link>
          <Link to="/guru" className="text-sm font-medium hover:text-primary transition-colors">Data Guru</Link>
          <Link to="/siswa" className="text-sm font-medium hover:text-primary transition-colors">Data Siswa</Link>
          <Link to="/galeri" className="text-sm font-medium hover:text-primary transition-colors">Galeri</Link>
          <Link to="/ppdb" className="text-sm font-medium text-secondary font-bold hover:opacity-80 transition-opacity">PPDB 2026</Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Role Switcher */}
          <div className="relative">
            <button 
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center gap-1 text-xs bg-slate-100 px-3 py-1.5 rounded-full font-medium hover:bg-slate-200 transition-colors"
            >
              Role: {currentUser?.role || 'Guest'}
              <ChevronDown size={14} />
            </button>
            
            {isRoleMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                {roles.map(role => (
                  <button
                    key={role}
                    onClick={() => {
                      onSwitchRole(role);
                      setIsRoleMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
                  >
                    Switch to {role}
                  </button>
                ))}
              </div>
            )}
          </div>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 text-sm font-medium bg-primary/10 text-primary px-4 py-2 rounded-xl hover:bg-primary/20 transition-colors"
              >
                <LayoutDashboard size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <button 
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center gap-2 text-sm font-medium bg-primary text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <LogIn size={18} />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
