import React, { useState, useEffect } from 'react';
import { X, Save, Sprout, CheckCircle2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Product, Language } from '../types/nammaraitha';
import { t } from '../utils/translations';

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  lang: Language;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
  lang,
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        id: `prod-${Date.now()}`,
        name: '',
        nameKn: '',
        category: 'produce',
        price: 100,
        unit: 'kg',
        stock: 50,
        rating: 4.8,
        reviewsCount: 1,
        sellerName: 'Local Farmer / Seller',
        sellerPhone: '+91 98450 12345',
        location: 'Karnataka, India',
        description: '',
        descriptionKn: '',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
        organic: false,
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    setIsSubmitting(true);

    const fullProduct: Product = {
      id: formData.id || `prod-${Date.now()}`,
      name: formData.name || 'Produce Item',
      nameKn: formData.nameKn || formData.name || 'ಕೃಷಿ ಉತ್ಪನ್ನ',
      category: formData.category || 'produce',
      price: Number(formData.price) || 0,
      unit: formData.unit || 'kg',
      stock: Number(formData.stock) || 0,
      rating: formData.rating || 4.8,
      reviewsCount: formData.reviewsCount || 1,
      sellerName: formData.sellerName || 'Farmer Producer',
      sellerPhone: formData.sellerPhone || '+91 98450 12345',
      location: formData.location || 'Karnataka',
      description: formData.description || '',
      descriptionKn: formData.descriptionKn || formData.description || '',
      image: formData.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
      organic: !!formData.organic,
      featured: formData.featured,
    };

    setTimeout(() => {
      onSave(fullProduct);
      setIsSubmitting(false);
      onClose();
    }, 200);
  };

  const sampleImages = [
    { label: 'Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' },
    { label: 'Paddy / Rice', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
    { label: 'Red Chillies', url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80' },
    { label: 'Bio Fertilizer', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80' },
    { label: 'Drip Kit', url: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-700/60 border border-emerald-500/30">
              <Sprout className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {product ? t('edit', lang) : t('addProduce', lang)}
              </h2>
              <p className="text-xs text-emerald-300 font-medium flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{product ? t('edit', lang) : t('postProduceDirect', lang)}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-700/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Product Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {lang === 'kn' ? 'ಉತ್ಪನ್ನದ ಹೆಸರು (English)' : 'Product Name (English) *'}
              </label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sona Masoori Paddy (Grade A)"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {lang === 'kn' ? 'ಉತ್ಪನ್ನದ ಹೆಸರು (ಕನ್ನಡ)' : 'Product Name (Kannada)'}
              </label>
              <input
                type="text"
                value={formData.nameKn || ''}
                onChange={(e) => setFormData({ ...formData, nameKn: e.target.value })}
                placeholder="ಉದಾ. ಸೋನಾ ಮಸೂರಿ ಭತ್ತ"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
              />
            </div>
          </div>

          {/* Category, Price, Unit, Stock */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
              <select
                value={formData.category || 'produce'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm bg-white"
              >
                <option value="produce">Crop Produce / ಧಾನ್ಯ & ತರಕಾರಿ</option>
                <option value="tools">Farming Tools & Sprayers / ಉಪಕರಣಗಳು</option>
                <option value="pesticides">Pesticides & Bio-Controls / ಕೀಟನಾಶಕಗಳು</option>
                <option value="seeds">Certified Seeds / ಬಿತ್ತನೆ ಬೀಜಗಳು</option>
                <option value="fertilizers">Fertilizers & Nutrients / ರಸಗೊಬ್ಬರ</option>
                <option value="machinery">Machinery & Implements / ಯಂತ್ರೋಪಕರಣ</option>
                <option value="irrigation">Drip & Irrigation / ನೀರಾವರಿ</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-semibold text-emerald-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Unit</label>
              <input
                type="text"
                value={formData.unit || 'kg'}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="kg, Quintal, Packet"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={formData.stock || 0}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
              />
            </div>
          </div>

          {/* Seller Name, Phone, Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Seller / Farmer Name</label>
              <input
                type="text"
                value={formData.sellerName || ''}
                onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                placeholder="e.g. Ramesh Gowda"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.sellerPhone || ''}
                onChange={(e) => setFormData({ ...formData, sellerPhone: e.target.value })}
                placeholder="+91 98450 12345"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Farm / Market Location</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Mandya, Karnataka"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
              />
            </div>
          </div>

          {/* Image URL & Quick Sample Pick */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-stone-700">Image URL</label>
              <span className="text-[11px] text-stone-500">Pick quick sample photo:</span>
            </div>
            <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1">
              {sampleImages.map((s, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setFormData({ ...formData, image: s.url })}
                  className="px-2 py-1 rounded text-[11px] bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-800 border border-stone-200 transition shrink-0"
                >
                  {s.label}
                </button>
              ))}
            </div>
            <input
              type="url"
              value={formData.image || ''}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-mono text-xs"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide quality details, harvest date, variety or usage advice..."
              className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
            />
          </div>

          {/* Organic & Featured Checkboxes */}
          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-stone-700">
              <input
                type="checkbox"
                checked={!!formData.organic}
                onChange={(e) => setFormData({ ...formData, organic: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
              />
              <span>🌿 100% Certified Organic (ಸಾವಯವ)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-stone-700">
              <input
                type="checkbox"
                checked={!!formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
              />
              <span>⭐ Featured on Homepage</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-sm font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-md shadow-emerald-900/20 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Product Directly'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
