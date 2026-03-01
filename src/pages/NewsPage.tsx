import React, { useState, useEffect } from 'react';
import { storage } from '../storage';
import { News, User } from '../types';
import { Plus, Edit2, Trash2, Search, Filter, X } from 'lucide-react';

interface NewsPageProps {
  currentUser: User | null;
}

export const NewsPage: React.FC<NewsPageProps> = ({ currentUser }) => {
  const [news, setNews] = useState<News[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Kegiatan' as News['category'],
    image: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    setNews(storage.getNews());
  }, []);

  const isAdmin = currentUser?.role === 'Admin';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const currentNews = storage.getNews();
    if (editingNews) {
      const updated = currentNews.map(n => n.id === editingNews.id ? { ...editingNews, ...formData } : n);
      storage.saveNews(updated);
      setNews(updated);
    } else {
      const newItem: News = {
        id: 'n' + Date.now(),
        ...formData
      };
      const updated = [newItem, ...currentNews];
      storage.saveNews(updated);
      setNews(updated);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus berita ini?')) {
      const updated = news.filter(n => n.id !== id);
      storage.saveNews(updated);
      setNews(updated);
    }
  };

  const openModal = (item?: News) => {
    if (item) {
      setEditingNews(item);
      setFormData({
        title: item.title,
        content: item.content,
        category: item.category,
        image: item.image,
        date: item.date
      });
    } else {
      setEditingNews(null);
      setFormData({
        title: '',
        content: '',
        category: 'Kegiatan',
        image: 'https://picsum.photos/seed/' + Date.now() + '/800/400',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNews(null);
  };

  const filteredNews = news.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || n.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-layout py-12 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl">Berita & Kegiatan</h1>
          <p className="text-slate-500">Informasi terkini seputar SDN Jakasampurna I.</p>
        </div>
        {isAdmin && (
          <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 self-start">
            <Plus size={20} /> Tambah Berita
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari berita..." 
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {['All', 'Kegiatan', 'Akademik', 'Event'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                filterCategory === cat 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredNews.map(item => (
          <div key={item.id} className="card group flex flex-col h-full">
            <div className="h-56 overflow-hidden relative">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-primary px-3 py-1.5 rounded-full shadow-lg">
                  {item.category}
                </span>
              </div>
              {isAdmin && (
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openModal(item)}
                    className="p-2 bg-white text-slate-700 rounded-lg shadow-lg hover:text-primary transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-white text-slate-700 rounded-lg shadow-lg hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
            <div className="p-6 flex-grow flex flex-col space-y-4">
              <p className="text-slate-400 text-xs font-medium">
                {new Date(item.date).toLocaleDateString('id-ID', { dateStyle: 'long' })}
              </p>
              <h3 className="text-xl leading-tight group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-slate-500 text-sm line-clamp-3 flex-grow">{item.content}</p>
              <button className="text-primary font-bold text-sm hover:underline self-start">Baca Selengkapnya</button>
            </div>
          </div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400">Tidak ada berita ditemukan.</p>
        </div>
      )}

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl">{editingNews ? 'Edit Berita' : 'Tambah Berita'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Judul Berita</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Kategori</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as News['category'] })}
                  >
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Akademik">Akademik</option>
                    <option value="Event">Event</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Tanggal</label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">URL Gambar</label>
                  <input 
                    type="url" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Konten</label>
                <textarea 
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                  Batal
                </button>
                <button type="submit" className="btn-primary">
                  Simpan Berita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
