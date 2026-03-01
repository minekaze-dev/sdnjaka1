import React, { useState, useEffect } from 'react';
import { storage } from '../storage';
import { GalleryItem, User } from '../types';
import { Plus, Trash2, X, Image as ImageIcon, Calendar, Maximize2 } from 'lucide-react';

interface GalleryPageProps {
  currentUser: User | null;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ currentUser }) => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    setGallery(storage.getGallery());
  }, []);

  const isAdmin = currentUser?.role === 'Admin';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const currentGallery = storage.getGallery();
    const newItem: GalleryItem = {
      id: 'g' + Date.now(),
      ...formData
    };
    const updated = [newItem, ...currentGallery];
    storage.saveGallery(updated);
    setGallery(updated);
    closeModal();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Hapus foto ini dari galeri?')) {
      const updated = gallery.filter(g => g.id !== id);
      storage.saveGallery(updated);
      setGallery(updated);
    }
  };

  const openModal = () => {
    setFormData({
      title: '',
      imageUrl: 'https://picsum.photos/seed/' + Date.now() + '/800/600',
      date: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-layout py-12 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl">Galeri Sekolah</h1>
          <p className="text-slate-500">Kumpulan dokumentasi kegiatan dan fasilitas SDN Jakasampurna I.</p>
        </div>
        {isAdmin && (
          <button onClick={openModal} className="btn-primary flex items-center gap-2 self-start">
            <Plus size={20} /> Upload Foto
          </button>
        )}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {gallery.map(item => (
          <div 
            key={item.id} 
            className="card group cursor-pointer relative aspect-[4/3]"
            onClick={() => setSelectedImage(item)}
          >
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-white font-bold text-lg leading-tight">{item.title}</p>
                  <p className="text-white/60 text-xs flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(item.date).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                  </p>
                </div>
                <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white">
                  <Maximize2 size={16} />
                </div>
              </div>
            </div>
            {isAdmin && (
              <button 
                onClick={(e) => handleDelete(item.id, e)}
                className="absolute top-4 right-4 p-2 bg-white/90 text-red-500 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {gallery.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <ImageIcon className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-400">Belum ada foto di galeri.</p>
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl">Upload Foto Baru</h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Judul Foto</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">URL Gambar</label>
                <input 
                  type="url" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Tanggal Kegiatan</label>
                <input 
                  type="date" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                  Batal
                </button>
                <button type="submit" className="btn-primary">
                  Upload Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center gap-6" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-slate-300 transition-colors"
            >
              <X size={32} />
            </button>
            <img 
              src={selectedImage.imageUrl} 
              alt={selectedImage.title} 
              className="w-full h-full object-contain rounded-2xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">{selectedImage.title}</h2>
              <p className="text-white/60 flex items-center justify-center gap-2">
                <Calendar size={16} />
                {new Date(selectedImage.date).toLocaleDateString('id-ID', { dateStyle: 'long' })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
