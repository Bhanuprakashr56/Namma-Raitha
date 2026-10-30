import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Star,
  MapPin,
  Phone,
  Edit,
  ShoppingCart,
  Check,
  Tag,
  ShieldCheck
} from 'lucide-react';
import { Product, Language } from '../types/nammaraitha';
import { t, getCommodityName } from '../utils/translations';

interface MarketplaceProps {
  products: Product[];
  lang: Language;
  onAddToCart: (product: Product, quantity?: number) => void;
  onEditProduct: (product: Product) => void;
  onOpenAddProduct: () => void;
  onNavigateAgriInputs?: () => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  products,
  lang,
  onAddToCart,
  onEditProduct,
  onOpenAddProduct,
  onNavigateAgriInputs,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  // EXCLUSIVELY VEGETABLES & FARM PRODUCE IN MARKETPLACE
  // Strictly filter out tools, fertilizers, seeds, machinery, pesticides, irrigation
  const vegetableAndProduceProducts = useMemo(() => {
    const inputCategories = new Set(['seeds', 'fertilizers', 'tools', 'machinery', 'irrigation', 'pesticides']);
    return products.filter((p) => !inputCategories.has(p.category));
  }, [products]);

  const isVegetable = (p: Product) => {
    const name = (p.name + ' ' + (p.nameKn || '')).toLowerCase();
    return (
      name.includes('tomato') || name.includes('ಟೊಮೆಟೊ') ||
      name.includes('onion') || name.includes('ಈರುಳ್ಳಿ') ||
      name.includes('potato') || name.includes('ಆಲೂಗಡ್ಡೆ') ||
      name.includes('cabbage') || name.includes('ಎಲೆಕೋಸು') ||
      name.includes('cauliflower') || name.includes('ಹೂಕೋಸು') ||
      name.includes('carrot') || name.includes('ಕ್ಯಾರೆಟ್') ||
      name.includes('brinjal') || name.includes('ಬದನೆ') ||
      name.includes('capsicum') || name.includes('ದಪ್ಪ ಮೆಣಸಿನಕಾಯಿ') ||
      name.includes('okra') || name.includes('bhendi') || name.includes('ಬೆಂಡೆ') ||
      name.includes('corn') || name.includes('ಮೆಕ್ಕೆಜೋಳ')
    );
  };

  const isGreens = (p: Product) => {
    const name = (p.name + ' ' + (p.nameKn || '')).toLowerCase();
    return (
      name.includes('coriander') || name.includes('ಕೊತ್ತಂಬರಿ') ||
      name.includes('mint') || name.includes('ಪುದೀನಾ') ||
      name.includes('beans') || name.includes('ಹುರುಳಿ') ||
      name.includes('peas') || name.includes('ಬಟಾಣಿ') ||
      name.includes('cucumber') || name.includes('ಸೌತೆ') ||
      name.includes('moringa') || name.includes('drumstick') || name.includes('ನುಗ್ಗೆ') ||
      name.includes('gourd') || name.includes('ಸೋರೆ') || name.includes('ಹೀರೆ')
    );
  };

  const isSpices = (p: Product) => {
    const name = (p.name + ' ' + (p.nameKn || '')).toLowerCase();
    return (
      name.includes('chilli') || name.includes('chillies') || name.includes('ಮೆಣಸಿನಕಾಯಿ') ||
      name.includes('ginger') || name.includes('ಶುಂಠಿ') ||
      name.includes('garlic') || name.includes('ಬೆಳ್ಳುಳ್ಳಿ') ||
      name.includes('lemon') || name.includes('ಲಿಂಬೆ') || name.includes('ನಿಂಬೆ')
    );
  };

  const isGrains = (p: Product) => {
    const name = (p.name + ' ' + (p.nameKn || '')).toLowerCase();
    return (
      name.includes('paddy') || name.includes('ಭತ್ತ') ||
      name.includes('ragi') || name.includes('ರಾಗಿ') ||
      name.includes('tur dal') || name.includes('ತೊಗರಿ') ||
      name.includes('gram') || name.includes('groundnut') || name.includes('ಕಡಲೆ') ||
      name.includes('rice') || name.includes('ಅಕ್ಕಿ') ||
      name.includes('millet')
    );
  };

  const categories = [
    {
      id: 'all',
      label: lang === 'kn' ? 'ಎಲ್ಲಾ ತರಕಾರಿಗಳು & ಬೆಳೆಗಳು (All)' : 'All Vegetables & Crops',
      count: vegetableAndProduceProducts.length,
    },
    {
      id: 'vegetables',
      label: lang === 'kn' ? 'ತಾಜಾ ತರಕಾರಿಗಳು (Tomatoes, Onions, Potatoes, etc.)' : 'Fresh Vegetables',
      count: vegetableAndProduceProducts.filter(isVegetable).length,
    },
    {
      id: 'greens',
      label: lang === 'kn' ? 'ಹಸಿರು ಸೊಪ್ಪು & ಬೀನ್ಸ್ (Greens & Beans)' : 'Greens & Herbs',
      count: vegetableAndProduceProducts.filter(isGreens).length,
    },
    {
      id: 'spices',
      label: lang === 'kn' ? 'ಮೆಣಸಿನಕಾಯಿ, ಶುಂಠಿ & ಬೆಳ್ಳುಳ್ಳಿ (Spices & Chillies)' : 'Spices & Chillies',
      count: vegetableAndProduceProducts.filter(isSpices).length,
    },
    {
      id: 'grains',
      label: lang === 'kn' ? 'ಧಾನ್ಯಗಳು & ಬೇಳೆಕಾಳುಗಳು (Grains & Pulses)' : 'Grains & Pulses',
      count: vegetableAndProduceProducts.filter(isGrains).length,
    },
  ];

  const filteredProducts = useMemo(() => {
    return vegetableAndProduceProducts.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.nameKn.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase()) ||
        p.sellerName.toLowerCase().includes(search.toLowerCase());

      let matchCat = true;
      if (selectedCategory === 'vegetables') {
        matchCat = isVegetable(p);
      } else if (selectedCategory === 'greens') {
        matchCat = isGreens(p);
      } else if (selectedCategory === 'spices') {
        matchCat = isSpices(p);
      } else if (selectedCategory === 'grains') {
        matchCat = isGrains(p);
      }

      const matchOrganic = !organicOnly || p.organic;

      return matchSearch && matchCat && matchOrganic;
    });
  }, [vegetableAndProduceProducts, search, selectedCategory, organicOnly]);

  const handleAdd = (product: Product) => {
    onAddToCart(product);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Direct Editing notification */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
          <Tag className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-400/30 text-amber-300 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>{t('directFarmToBuyer', lang)} &bull; {lang === 'kn' ? 'ರೈತರ ತಾಜಾ ತರಕಾರಿಗಳು' : 'Fresh Vegetables Market'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
            {lang === 'kn' ? 'ರೈತರ ತರಕಾರಿ ಮತ್ತು ಕೃಷಿ ಉತ್ಪನ್ನಗಳ ಮಾರುಕಟ್ಟೆ' : 'Farmers Fresh Vegetable & Produce Marketplace'}
          </h2>
          <p className="mt-2 text-emerald-100 text-sm leading-relaxed">
            {lang === 'kn'
              ? 'ತಾಜಾ ತರಕಾರಿಗಳು (ಟೊಮೆಟೊ, ಈರುಳ್ಳಿ, ಆಲೂಗಡ್ಡೆ, ಹಸಿ ಮೆಣಸಿನಕಾಯಿ, ಕೋಸು, ಕ್ಯಾರೆಟ್, ಬೀನ್ಸ್, ಸೊಪ್ಪುಗಳು) ಮತ್ತು ಧಾನ್ಯಗಳ ನೇರ ಮಾರುಕಟ್ಟೆ.'
              : 'Direct farm-to-table marketplace for 100% fresh vegetables (tomatoes, onions, potatoes, chillies, cabbage, carrots, beans, greens) and grains directly from farmers.'}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="text-xs text-emerald-200 flex items-center gap-1 bg-emerald-900/50 px-3 py-2 rounded-xl border border-emerald-600/30">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>{t('apmcCompliantBadge', lang)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === 'kn' ? 'ತರಕಾರಿಗಳು, ಬೆಳೆ ಅಥವಾ ರೈತರ ಹೆಸರನ್ನು ಹುಡುಕಿ...' : 'Search vegetables, crops, or farmer location...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
            />
          </div>

          {/* Organic Only Toggle */}
          <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold cursor-pointer shrink-0 select-none hover:bg-emerald-100 transition">
            <input
              type="checkbox"
              checked={organicOnly}
              onChange={(e) => setOrganicOnly(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
            />
            <span>🌿 {t('organicOnly', lang)}</span>
          </label>
        </div>

        {/* Categories scrollable pill tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedCategory === c.id
                  ? 'bg-emerald-800 text-white shadow-sm font-bold'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              <span>{c.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedCategory === c.id
                    ? 'bg-amber-400 text-emerald-950'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                {c.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.map((p) => {
          const isAdded = !!addedIds[p.id];

          return (
            <div
              key={p.id}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col group"
            >
              {/* Image & Badges */}
              <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                  {p.organic && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-700 text-white text-[10px] font-bold shadow tracking-wide">
                      🌿 {t('organic', lang)}
                    </span>
                  )}
                  {p.featured && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500 text-stone-950 text-[10px] font-bold shadow">
                      ⭐ {t('topChoice', lang)}
                    </span>
                  )}
                </div>

                {/* Direct Edit Button overlaid on Card (No Login Required) */}
                <button
                  onClick={() => onEditProduct(p)}
                  className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-900/80 hover:bg-emerald-700 text-white text-[11px] font-medium backdrop-blur-md transition shadow border border-white/20"
                  title="Directly edit price, stock, or details (No login required)"
                >
                  <Edit className="w-3 h-3 text-amber-300" />
                  <span>{t('edit', lang)}</span>
                </button>

                <div className="absolute bottom-2 left-2 right-2 bg-stone-900/70 backdrop-blur-sm px-2.5 py-1 rounded-lg text-white text-[11px] flex items-center justify-between">
                  <span className="flex items-center gap-1 text-stone-200 truncate">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{p.location}</span>
                  </span>
                  <span className="flex items-center gap-1 text-amber-300 font-semibold shrink-0">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {p.rating}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm leading-snug line-clamp-1 group-hover:text-emerald-700 transition">
                    {lang === 'kn' && p.nameKn ? p.nameKn : getCommodityName(p.name, lang)}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                    {lang === 'kn' && p.descriptionKn ? p.descriptionKn : p.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs text-stone-600 pt-2 border-t border-stone-100">
                    <span className="truncate font-medium">{p.sellerName}</span>
                    <a
                      href={`tel:${p.sellerPhone}`}
                      className="flex items-center gap-1 text-emerald-700 hover:underline shrink-0"
                    >
                      <Phone className="w-3 h-3" />
                      <span className="text-[11px]">{t('call', lang)}</span>
                    </a>
                  </div>
                </div>

                {/* Pricing & Add to Cart */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs text-stone-400 font-medium">{p.unit}</div>
                    <div className="text-lg font-extrabold text-emerald-800">
                      ₹{p.price.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleAdd(p)}
                      disabled={p.stock <= 0}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : p.stock > 0
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                          : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{t('added', lang)}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>{p.stock > 0 ? t('add', lang) : t('outOfStock', lang)}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 shadow-sm">
          <p className="text-stone-500 text-sm">{t('noItemsFound', lang)}</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setOrganicOnly(false);
            }}
            className="mt-3 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition"
          >
            {t('clearFilters', lang)}
          </button>
        </div>
      )}
    </div>
  );
};
