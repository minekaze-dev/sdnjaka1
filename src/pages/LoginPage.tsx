import React, { useState } from 'react';
import { storage } from '../storage';
import { User } from '../types';
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = storage.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      onLogin(user);
    } else {
      setError('Email atau password salah. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto shadow-xl shadow-primary/20 mb-6">
            S
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Selamat Datang</h1>
          <p className="text-slate-500">Masuk ke Sistem Informasi SDN Jakasampurna I</p>
        </div>

        <div className="card p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Sekolah</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="admin@sdn.id"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  placeholder="••••••"
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg shadow-lg shadow-primary/20">
              <LogIn size={20} /> Masuk Sekarang
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs text-center text-slate-400 font-medium uppercase tracking-widest mb-4">Akun Demo</p>
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: 'Admin', email: 'admin@sdn.id' },
                { label: 'Guru', email: 'guru@sdn.id' },
                { label: 'Murid', email: 'murid@sdn.id' }
              ].map(acc => (
                <button 
                  key={acc.email}
                  onClick={() => {
                    setEmail(acc.email);
                    setPassword('123456');
                  }}
                  className="text-left px-4 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between group"
                >
                  <span className="text-xs font-bold text-slate-600">{acc.label}</span>
                  <span className="text-[10px] text-slate-400 group-hover:text-primary transition-colors">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
