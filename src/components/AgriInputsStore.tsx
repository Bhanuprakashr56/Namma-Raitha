import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Sparkles,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle,
  Truck,
  Phone,
  ShoppingCart,
  Zap,
  Info,
  Tag,
  X,
  Layers,
  ArrowRight,
  Plus,
  Minus,
  Check,
  Sprout,
  PackageCheck,
  Store,
  Award,
  Landmark,
  HelpCircle,
  CheckCheck,
  BadgePercent,
  Clock,
  Headphones
} from 'lucide-react';
import { Product, Language } from '../types/nammaraitha';
import { t } from '../utils/translations';

interface AgriInputsStoreProps {
  products: Product[];
  lang: Language;
  onAddToCart: (product: Product) => void;
  onPlaceExpressOrder?: (orderData: {
    product: Product;
    quantity: number;
    customerName: string;
    phone: string;
    address: string;
    paymentMethod: 'cod' | 'upi';
  }) => void;
  onNavigateMarketplace?: () => void;
}

type InputCategory = 'all' | 'seeds' | 'fertilizers' | 'tools';

export const AgriInputsStore: React.FC<AgriInputsStoreProps> = ({
  products,
  lang,
  onAddToCart,
  onPlaceExpressOrder,
  onNavigateMarketplace,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<InputCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlySubsidized, setOnlySubsidized] = useState(false);
  const [onlyOrganic, setOnlyOrganic] = useState(false);

  // Selected product for Express Modal
  const [expressModalProduct, setExpressModalProduct] = useState<Product | null>(null);
  const [expressQty, setExpressQty] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod');
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState(false);

  // Selected product for Usage & Spec modal
  const [usageModalProduct, setUsageModalProduct] = useState<Product | null>(null);

  // Temporary state for quantity counters per card
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  // Feedback state for "Added to Cart" animations
  const [addedAnimation, setAddedAnimation] = useState<Record<string, boolean>>({});

  const handleQtyChange = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const handleAddWithQty = (product: Product) => {
    const qty = quantities[product.id] || 1;
    for (let i = 0; i < qty; i++) {
      onAddToCart(product);
    }
    setAddedAnimation((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedAnimation((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  // Bundle feedback animation
  const [bundleAdded, setBundleAdded] = useState<Record<string, boolean>>({});

  const handleAddBundle = (bundleId: string, productIds: string[]) => {
    productIds.forEach((id) => {
      const p = products.find((item) => item.id === id);
      if (p) onAddToCart(p);
    });
    setBundleAdded((prev) => ({ ...prev, [bundleId]: true }));
    setTimeout(() => {
      setBundleAdded((prev) => ({ ...prev, [bundleId]: false }));
    }, 2000);
  };

  // Filter products specifically belonging to agri input categories:
  // ONLY SEEDS, FERTILIZERS, AND TOOLS.
  // STRICTLY NO VEGETABLES, FRUITS, CROPS, OR PRODUCE (those belong in Marketplace).
  const inputProducts = useMemo(() => {
    return products.filter((p) => {
      // Exclude all vegetables, fruits, crops, grains, and general farm produce
      if (p.category === 'produce') {
        return false;
      }
      // ONLY ALLOW: seeds, fertilizers, and tools (including machinery and irrigation tools)
      return (
        p.category === 'seeds' ||
        p.category === 'fertilizers' ||
        p.category === 'tools' ||
        p.category === 'machinery' ||
        p.category === 'irrigation'
      );
    });
  }, [products]);

  // Apply active category and filter toggles
  const filteredProducts = useMemo(() => {
    return inputProducts.filter((product) => {
      // Category filter: seeds, fertilizers, tools
      if (selectedCategory === 'tools') {
        if (product.category !== 'tools' && product.category !== 'machinery' && product.category !== 'irrigation') {
          return false;
        }
      } else if (selectedCategory === 'seeds') {
        if (product.category !== 'seeds' && !product.name.toLowerCase().includes('seed')) {
          return false;
        }
      } else if (selectedCategory === 'fertilizers') {
        if (product.category !== 'fertilizers' && !product.name.toLowerCase().includes('fertilizer') && !product.name.toLowerCase().includes('compost')) {
          return false;
        }
      }

      // Subsidy toggle
      if (onlySubsidized && (!product.subsidyPercentage || product.subsidyPercentage <= 0)) {
        return false;
      }

      // Organic toggle
      if (onlyOrganic && !product.organic) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query) || (product.nameKn && product.nameKn.toLowerCase().includes(query));
        const matchesDesc = product.description.toLowerCase().includes(query) || (product.descriptionKn && product.descriptionKn.toLowerCase().includes(query));
        const matchesBrand = product.brand && product.brand.toLowerCase().includes(query);
        const matchesSeller = product.sellerName.toLowerCase().includes(query) || product.location.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesBrand || matchesSeller;
      }

      return true;
    });
  }, [inputProducts, selectedCategory, onlySubsidized, onlyOrganic, searchQuery]);

  // Counts for tabs (Seeds, Fertilizers, Tools)
  const categoryCounts = useMemo(() => {
    const counts = {
      all: inputProducts.length,
      seeds: inputProducts.filter((p) => p.category === 'seeds' || p.name.toLowerCase().includes('seed')).length,
      fertilizers: inputProducts.filter((p) => p.category === 'fertilizers' || p.name.toLowerCase().includes('fertilizer') || p.name.toLowerCase().includes('compost')).length,
      tools: inputProducts.filter((p) => p.category === 'tools' || p.category === 'machinery' || p.category === 'irrigation').length,
    };
    return counts;
  }, [inputProducts]);

  const handleOpenExpressModal = (product: Product) => {
    setExpressModalProduct(product);
    setExpressQty(quantities[product.id] || 1);
    setOrderPlacedSuccess(false);
  };

  const handleExpressOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expressModalProduct || !customerName || !customerPhone || !deliveryAddress) return;

    if (onPlaceExpressOrder) {
      onPlaceExpressOrder({
        product: expressModalProduct,
        quantity: expressQty,
        customerName,
        phone: customerPhone,
        address: deliveryAddress,
        paymentMethod,
      });
    } else {
      // Fallback: add to cart
      for (let i = 0; i < expressQty; i++) {
        onAddToCart(expressModalProduct);
      }
    }
    setOrderPlacedSuccess(true);
  };

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'tools':
      case 'machinery':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'pesticides':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'seeds':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'fertilizers':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      default:
        return 'bg-stone-100 text-stone-900 border-stone-200';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Banner - Uniform solid emerald green */}
      <section className="relative rounded-2xl overflow-hidden bg-emerald-950 text-white p-5 sm:p-7 lg:p-8 shadow-xl border border-emerald-800/80 w-full">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/90 border border-emerald-400/40 text-amber-300 text-xs font-bold shadow-xs">
              <PackageCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Dedicated Kisan Store &bull; ಉಪಕರಣ, ಗೊಬ್ಬರ & ಬೀಜಗಳು</span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight font-heading leading-tight">
              {lang === 'kn' ? 'ಉಪಕರಣ, ಗೊಬ್ಬರ & ಬೀಜಗಳ ಮಳಿಗೆ' : 'Tools, Fertilizer & Seeds Store'}
            </h1>

            <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed max-w-xl">
              {lang === 'kn'
                ? 'ಪ್ರಮಾಣೀಕೃತ ಬೀಜಗಳು, ಸಾವಯವ ರಸಗೊಬ್ಬರಗಳು ಮತ್ತು ಕೃಷಿ ಉಪಕರಣಗಳು ಇಲ್ಲಿ ಮಾತ್ರ ಲಭ್ಯ. ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ನೇರ ರಿಯಾಯಿತಿ ದರ ಮತ್ತು ಗ್ರಾಮ ಮಟ್ಟದ ಮನೆಬಾಗಿಲಿಗೆ ಡೆಲಿವರಿ.'
                : 'Direct farmer store exclusively for certified seeds, fertilizers, and agricultural tools with DBT subsidy support, zero middlemen, and doorstep village delivery.'}
            </p>
          </div>

          {/* Compact Trust Assurance Pills */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0 text-xs text-emerald-200">
            <div className="flex items-center gap-2 bg-emerald-900/80 px-3 py-1.5 rounded-xl border border-emerald-700/60 shadow-xs">
              <Truck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="font-semibold text-[11px] sm:text-xs">Doorstep Village Delivery (2-4 Days)</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-900/80 px-3 py-1.5 rounded-xl border border-emerald-700/60 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span className="font-semibold text-[11px] sm:text-xs">Govt. Certified Purity Guarantee</span>
            </div>
          </div>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/10 to-transparent pointer-events-none" />
      </section>


      {/* 4 Interactive Category Filter Cards (All, Seeds, Fertilizers, Tools) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Category: All */}
        <button
          onClick={() => setSelectedCategory('all')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedCategory === 'all'
              ? 'bg-emerald-950 text-white border-emerald-900 shadow-md ring-2 ring-emerald-500/50'
              : 'bg-white border-stone-200 hover:border-emerald-300 hover:shadow-sm text-stone-900'
          }`}
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold mb-2 ${
            selectedCategory === 'all' ? 'bg-emerald-800 text-amber-300' : 'bg-stone-100 text-stone-700'
          }`}>
            <PackageCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-xs sm:text-sm flex items-center justify-between">
            <span>{lang === 'kn' ? 'ಎಲ್ಲಾ ಪರಿಕರಗಳು' : 'All 3 Categories'}</span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              selectedCategory === 'all' ? 'bg-emerald-800 text-amber-300' : 'bg-stone-100 text-stone-700'
            }`}>
              {categoryCounts.all}
            </span>
          </h3>
          <p className={`text-[11px] mt-0.5 line-clamp-1 ${selectedCategory === 'all' ? 'text-emerald-200' : 'text-stone-500'}`}>
            Tools, Fertilizer & Seeds
          </p>
        </button>

        {/* Category: Seeds */}
        <button
          onClick={() => setSelectedCategory('seeds')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedCategory === 'seeds'
              ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-400/50'
              : 'bg-white border-stone-200 hover:border-emerald-300 hover:shadow-sm'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-2">
            <Sprout className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-stone-900 text-xs sm:text-sm flex items-center justify-between">
            <span>{t('seedsCategory', lang)}</span>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              {categoryCounts.seeds}
            </span>
          </h3>
          <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
            Certified Foundation & Hybrid Seeds
          </p>
        </button>

        {/* Category: Fertilizers */}
        <button
          onClick={() => setSelectedCategory('fertilizers')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedCategory === 'fertilizers'
              ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-400/50'
              : 'bg-white border-stone-200 hover:border-amber-300 hover:shadow-sm'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-2">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-stone-900 text-xs sm:text-sm flex items-center justify-between">
            <span>{t('fertilizersCategory', lang)}</span>
            <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full">
              {categoryCounts.fertilizers}
            </span>
          </h3>
          <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
            NPK, Vermicompost & Micronutrients
          </p>
        </button>

        {/* Category: Tools */}
        <button
          onClick={() => setSelectedCategory('tools')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedCategory === 'tools'
              ? 'bg-blue-50 border-blue-500 shadow-md ring-2 ring-blue-400/50'
              : 'bg-white border-stone-200 hover:border-blue-300 hover:shadow-sm'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-2">
            <Wrench className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-stone-900 text-xs sm:text-sm flex items-center justify-between">
            <span>{t('toolsCategory', lang)}</span>
            <span className="text-[11px] font-semibold text-blue-600 bg-blue-100/80 px-2 py-0.5 rounded-full">
              {categoryCounts.tools}
            </span>
          </h3>
          <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
            Sprayers, Tillers, Shears & Weeder
          </p>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools, sprayer, seeds, fertilizers, neem oil, brand..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-stone-50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Toggles */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === 'all'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              All Inputs ({categoryCounts.all})
            </button>

            <button
              onClick={() => setOnlySubsidized(!onlySubsidized)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition ${
                onlySubsidized
                  ? 'bg-amber-400 text-emerald-950 border-amber-500 shadow-sm'
                  : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
              }`}
            >
              <Tag className="w-3 h-3 text-amber-700" />
              <span>{t('subsidyDiscount', lang)}</span>
            </button>

            <button
              onClick={() => setOnlyOrganic(!onlyOrganic)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition ${
                onlyOrganic
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                  : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
              }`}
            >
              <Sprout className="w-3 h-3 text-emerald-600" />
              <span>100% Organic</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Catalog Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-800 text-sm">No Agri Inputs Found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            No tools, pesticides, seeds or fertilizers matched your filter criteria. Try resetting the filters or clearing the search.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setOnlySubsidized(false);
              setOnlyOrganic(false);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold shadow hover:bg-emerald-700 transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => {
            const currentQty = quantities[product.id] || 1;
            const isAdded = addedAnimation[product.id];
            const discountPct = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : null;

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
              >
                {/* Product Image & Badges */}
                <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Category Pill Tag */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shadow-sm uppercase ${getCategoryBadgeStyle(
                        product.category
                      )}`}
                    >
                      {product.category}
                    </span>

                    {product.organic && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white shadow-sm flex items-center gap-0.5">
                        <Sprout className="w-2.5 h-2.5" />
                        Organic
                      </span>
                    )}
                  </div>

                  {/* Subsidy Tag */}
                  {product.subsidyPercentage && product.subsidyPercentage > 0 && (
                    <div className="absolute top-2.5 right-2.5 bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-md shadow-md border border-amber-300">
                      {product.subsidyPercentage}% Subsidy
                    </div>
                  )}

                  {/* Delivery Days Badge */}
                  {product.deliveryDays && (
                    <div className="absolute bottom-2 left-2.5 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Truck className="w-2.5 h-2.5 text-amber-300" />
                      <span>{product.deliveryDays} Days Delivery</span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Brand & Stock */}
                    <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                      <span className="font-semibold text-emerald-800">
                        {product.brand || product.sellerName}
                      </span>
                      <span className="text-emerald-700 font-medium">In Stock</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-stone-900 text-sm leading-tight group-hover:text-emerald-800 transition-colors line-clamp-2">
                      {lang === 'kn' && product.nameKn ? product.nameKn : product.name}
                    </h3>

                    {/* Technical Specification / Dosage Tag */}
                    {product.dosageOrSpec && (
                      <div className="mt-2 p-1.5 rounded-lg bg-stone-50 border border-stone-200 text-[11px] text-stone-600 flex items-start gap-1.5">
                        <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 font-mono text-[10px] leading-tight">
                          {product.dosageOrSpec}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Pricing Block */}
                  <div className="pt-2 border-t border-stone-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-emerald-900">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-stone-400 line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      {discountPct && (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                          {discountPct}% OFF
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-500 font-medium block">
                      Per {product.unit}
                    </span>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between mt-3 gap-2">
                      <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 p-0.5">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(product.id, -1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-stone-200 text-stone-700 transition"
                          title="Decrease Quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-stone-900">
                          {currentQty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(product.id, 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-stone-200 text-stone-700 transition"
                          title="Increase Quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Direct Add to Cart Button */}
                      <button
                        type="button"
                        onClick={() => handleAddWithQty(product)}
                        className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-800 hover:bg-emerald-700 text-white hover:shadow'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Action Footer: Express Order & Call Dealer */}
                    <div className="grid grid-cols-2 gap-1.5 mt-2">
                      <button
                        type="button"
                        onClick={() => handleOpenExpressModal(product)}
                        className="py-1.5 px-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-[11px] flex items-center justify-center gap-1 transition shadow-xs"
                      >
                        <Zap className="w-3 h-3 fill-emerald-950" />
                        <span>Express Order</span>
                      </button>

                      <a
                        href={`tel:${product.sellerPhone}`}
                        className="py-1.5 px-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-[11px] flex items-center justify-center gap-1 transition"
                        title={`Call dealer ${product.sellerName}`}
                      >
                        <Phone className="w-3 h-3 text-emerald-700" />
                        <span>Call Dealer</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ==================================================== */}
      {/* 1. CURATED KISAN VALUE BUNDLES (ಉತ್ಕೃಷ್ಟ ಕೃಷಿ ಪ್ಯಾಕೇಜ್‌ಗಳು) */}
      {/* ==================================================== */}
      <section className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full mb-1">
              <BadgePercent className="w-3.5 h-3.5" />
              <span>{lang === 'kn' ? 'ವಿಶೇಷ ಉಳಿತಾಯ ಪ್ಯಾಕ್‌ಗಳು' : 'Kisan Special Saver Kits'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-heading">
              {lang === 'kn' ? 'ಹೆಚ್ಚು ಮಾರಾಟವಾಗುವ ಕೃಷಿ ಪ್ಯಾಕೇಜ್‌ಗಳು' : 'Popular Farmer Value Bundles'}
            </h2>
            <p className="text-xs text-stone-500">
              {lang === 'kn'
                ? 'ಸಂಪೂರ್ಣ ಕೃಷಿ ನಿರ್ವಹಣೆಗೆ ಅಗತ್ಯವಿರುವ ಬೀಜ, ಗೊಬ್ಬರ ಮತ್ತು ಸಲಕರಣೆಗಳ ಸಂಯೋಜಿತ ಕಿಟ್‌ಗಳು.'
                : 'Complete crop kits bundled with certified seeds, fertilizers, and precision tools at extra 15-20% combo savings.'}
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            ⚡ 1-Click Multi-Item Order
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Bundle 1: Paddy Sowing Power Combo */}
          <div className="bg-white rounded-3xl border-2 border-emerald-500/40 p-5 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow">
              SAVE ₹700
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <Sprout className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-extrabold text-stone-900 text-base leading-snug group-hover:text-emerald-800 transition">
                {lang === 'kn' ? 'ಭತ್ತದ ಬಿತ್ತನೆ ಸಂಪೂರ್ಣ ಪ್ಯಾಕೇಜ್' : 'Paddy Sowing Complete Package'}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                For 1 Acre Paddy cultivation from seed to weed control.
              </p>

              {/* Items included list */}
              <ul className="mt-4 space-y-2 text-xs text-stone-700 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                <li className="flex items-center gap-2">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>25kg KSSC BPT-5204 Paddy Seeds</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>5kg Zinc Sulphate 33% Micronutrient</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1kg Trichoderma Viride Bio-Fungicide</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Twin-Cone Rotary Paddy Weeder</span>
                </li>
              </ul>
            </div>

            <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <div className="text-lg font-black text-emerald-950">₹3,980</div>
                <div className="text-[11px] text-stone-400 line-through">₹4,680 Combined</div>
              </div>
              <button
                type="button"
                onClick={() => handleAddBundle('bundle-1', ['seed-1', 'fert-3', 'pest-1', 'tool-4'])}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow ${
                  bundleAdded['bundle-1']
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                }`}
              >
                {bundleAdded['bundle-1'] ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Bundle Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add All 4 Items</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Bundle 2: Organic Bio-Defense & Soil Rejuvenation Kit */}
          <div className="bg-white rounded-3xl border border-amber-300 p-5 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-3 right-3 bg-amber-500 text-stone-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow">
              SAVE ₹340
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-3">
                <Layers className="w-5 h-5 text-amber-800" />
              </div>
              <h3 className="font-extrabold text-stone-900 text-base leading-snug group-hover:text-emerald-800 transition">
                {lang === 'kn' ? 'ಜೈವಿಕ ಮಣ್ಣು & ರೋಗ ನಿಗ್ರಹ ಕಿಟ್' : 'Organic Bio-Defense & Soil Kit'}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Zero chemical soil carbon revitalization & pest protection.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-stone-700 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                <li className="flex items-center gap-2">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>50kg Enriched Vermicompost (PSB+Trichoderma)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>25kg Pure Cold-Pressed Neem Cake</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1L Pure Neem Oil 10000 PPM Bio-Pesticide</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pack of 5 Pheromone Insect Traps</span>
                </li>
              </ul>
            </div>

            <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <div className="text-lg font-black text-emerald-950">₹1,960</div>
                <div className="text-[11px] text-stone-400 line-through">₹2,300 Combined</div>
              </div>
              <button
                type="button"
                onClick={() => handleAddBundle('bundle-2', ['prod-7', 'fert-2', 'prod-4', 'pest-2'])}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow ${
                  bundleAdded['bundle-2']
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                }`}
              >
                {bundleAdded['bundle-2'] ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Bundle Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add All 4 Items</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Bundle 3: Small Farm Spraying & Orchard Pruning Set */}
          <div className="bg-white rounded-3xl border border-blue-300 p-5 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow">
              SAVE ₹920
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3">
                <Wrench className="w-5 h-5 text-blue-700" />
              </div>
              <h3 className="font-extrabold text-stone-900 text-base leading-snug group-hover:text-emerald-800 transition">
                {lang === 'kn' ? 'ತೋಟಗಾರಿಕೆ ಕಸಿ & ಸಿಂಪರಣಾ ಕಿಟ್' : 'Orchard Spray & Pruning Set'}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Precision tools for fruit orchards, plantation & vegetable crops.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-stone-700 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                <li className="flex items-center gap-2">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>16L Dual-Motor Battery Knapsack Sprayer</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Stainless Steel SK5 Bypass Pruning Shears</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>12ft Telescopic Fruit Harvester Pole</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>4-in-1 Soil pH, Moisture & Sunlight Tester</span>
                </li>
              </ul>
            </div>

            <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <div className="text-lg font-black text-emerald-950">₹4,280</div>
                <div className="text-[11px] text-stone-400 line-through">₹5,200 Combined</div>
              </div>
              <button
                type="button"
                onClick={() => handleAddBundle('bundle-3', ['tool-1', 'tool-2', 'tool-8', 'tool-3'])}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow ${
                  bundleAdded['bundle-3']
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                }`}
              >
                {bundleAdded['bundle-3'] ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Bundle Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add All 4 Items</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 2. GOVT SUBSIDIES & DBT SCHEMES GUIDE (ಸಹಾಯಧನ ಮಾಹಿತಿ) */}
      {/* ==================================================== */}
      <section className="bg-gradient-to-br from-stone-900 via-emerald-950 to-stone-900 text-white p-6 sm:p-8 rounded-3xl border border-emerald-800/80 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-800/60">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 bg-emerald-900/80 px-3 py-1 rounded-full mb-1 border border-emerald-700">
              <Landmark className="w-3.5 h-3.5 text-amber-400" />
              <span>Karnataka Agriculture Department & GoI Schemes</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-heading">
              {lang === 'kn' ? 'ಸರ್ಕಾರಿ ಕೃಷಿ ಸಬ್ಸಿಡಿ & ಡಿಬಿಟಿ ಮಾರ್ಗದರ್ಶಿ' : 'Govt Subsidy & Direct Benefit Transfer (DBT) Guide'}
            </h2>
            <p className="text-xs text-emerald-200">
              Clear information on claiming 40-50% subsidy on sprayers, seeds, and soil testing.
            </p>
          </div>
          <a
            href="https://raitamitra.karnataka.gov.in"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs flex items-center gap-1.5 transition self-start sm:self-auto shadow"
          >
            <span>Raita Mitra Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Scheme 1 */}
          <div className="bg-emerald-900/40 p-4 rounded-2xl border border-emerald-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-amber-400 text-sm">SMAM Scheme</span>
              <span className="text-[10px] font-bold bg-emerald-800 px-2 py-0.5 rounded text-white">40-50% Subsidy</span>
            </div>
            <h4 className="font-bold text-xs text-white">Sub-Mission on Agri Mechanization</h4>
            <p className="text-[11px] text-emerald-200 leading-relaxed">
              Provides direct financial grant on Battery Knapsack Sprayers, Power Tillers, Brush Cutters, and Seed Drills. 50% for SC/ST/Small/Women farmers, 40% for General.
            </p>
            <div className="text-[10px] text-amber-300 font-semibold pt-1">
              Required: Pahani (RTC), Aadhaar & Bank Passbook
            </div>
          </div>

          {/* Scheme 2 */}
          <div className="bg-emerald-900/40 p-4 rounded-2xl border border-emerald-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-amber-400 text-sm">NFSM & Seed Mission</span>
              <span className="text-[10px] font-bold bg-emerald-800 px-2 py-0.5 rounded text-white">₹15-25/kg Off</span>
            </div>
            <h4 className="font-bold text-xs text-white">Certified Seed Distribution at RSK</h4>
            <p className="text-[11px] text-emerald-200 leading-relaxed">
              Karnataka State Seeds Corporation (KSSC) provides foundation and certified seeds of Paddy, Ragi, Groundnut, and Bengal Gram with direct price reduction at billing.
            </p>
            <div className="text-[10px] text-amber-300 font-semibold pt-1">
              Distributed via: Local Raitha Samparka Kendras
            </div>
          </div>

          {/* Scheme 3 */}
          <div className="bg-emerald-900/40 p-4 rounded-2xl border border-emerald-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-amber-400 text-sm">PMKSY Drip Scheme</span>
              <span className="text-[10px] font-bold bg-emerald-800 px-2 py-0.5 rounded text-white">Up to 90% Subsidy</span>
            </div>
            <h4 className="font-bold text-xs text-white">Pradhan Mantri Krishi Sinchayee Yojana</h4>
            <p className="text-[11px] text-emerald-200 leading-relaxed">
              Massive subsidy on micro-irrigation systems (Drip lateral pipes, filters, and sprinkler setups). 90% subsidy for SC/ST and up to 75% for small farmers up to 5 acres.
            </p>
            <div className="text-[10px] text-amber-300 font-semibold pt-1">
              Eligible: Borewell or canal water source registered
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 3. QUALITY GUARANTEE & SERVICE PILLARS (ಖಾತರಿ ವ್ಯವಸ್ಥೆ) */}
      {/* ==================================================== */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
          </div>
          <h4 className="font-bold text-xs sm:text-sm text-stone-900">
            {lang === 'kn' ? '100% ಶುದ್ಧ ಬೀಜ ಪ್ರಮಾಣೀಕರಣ' : '100% Certified Germination'}
          </h4>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            All seeds are tested for &gt;90% germination rate and sealed in tamper-proof bags.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Truck className="w-5 h-5 text-amber-700" />
          </div>
          <h4 className="font-bold text-xs sm:text-sm text-stone-900">
            {lang === 'kn' ? 'ಗ್ರಾಮ ಮಟ್ಟದ ಮನೆಬಾಗಿಲಿಗೆ ಡೆಲಿವರಿ' : 'Doorstep Village Delivery'}
          </h4>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            Dispatched via rural courier network directly to your village within 2-4 working days.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
            <Zap className="w-5 h-5 text-blue-700" />
          </div>
          <h4 className="font-bold text-xs sm:text-sm text-stone-900">
            {lang === 'kn' ? 'ಕ್ಯಾಶ್ ಆನ್ ಡೆಲಿವರಿ & ಯುಪಿಐ' : 'COD & Instant UPI on Delivery'}
          </h4>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            Check the sealed package and pay only when goods arrive safely at your doorstep.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
            <Headphones className="w-5 h-5 text-teal-700" />
          </div>
          <h4 className="font-bold text-xs sm:text-sm text-stone-900">
            {lang === 'kn' ? 'ಉಚಿತ ಕೃಷಿ ಸಲಹೆ ಸಹಾಯವಾಣಿ' : 'Free Agronomist Hotline'}
          </h4>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            Call toll-free 1800-180-1551 for dosage, spray timing, and fertilizer prescription advice.
          </p>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 4. FARMERS FAQS ON SEEDS, TOOLS & FERTILIZERS */}
      {/* ==================================================== */}
      <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-stone-900 text-base sm:text-lg font-heading">
              {lang === 'kn' ? 'ಬೀಜ, ಗೊಬ್ಬರ & ಉಪಕರಣಗಳ ಬಗ್ಗೆ ರೈತರ ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು' : 'Frequently Asked Questions by Farmers'}
            </h3>
            <p className="text-xs text-stone-500">
              Clear answers regarding delivery, quality certification, returns, and vegetable policy.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
            <h4 className="font-bold text-xs sm:text-sm text-stone-900">
              Q: Are vegetables, fruits, or harvest crops sold in this store?
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              No. By strict policy, this store sells <strong>only certified seeds, fertilizers, and farm tools/machinery</strong>. Harvested vegetables, fruits, and grain produce are sold exclusively in our <span className="text-emerald-700 font-semibold cursor-pointer underline" onClick={onNavigateMarketplace}>Marketplace</span> section.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
            <h4 className="font-bold text-xs sm:text-sm text-stone-900">
              Q: How does village doorstep delivery work?
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Orders are dispatched through rural logistics partners directly to your village, taluk point, or farm gate. You receive SMS updates with tracking and driver phone number.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
            <h4 className="font-bold text-xs sm:text-sm text-stone-900">
              Q: Can I claim government subsidies (DBT) on sprayers and tillers purchased here?
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Yes. All listed sprayers, tillers, and machinery come with GST-compliant tax invoices and manufacturer test certificates valid for state DBT subsidy applications at your local RSK or Krishi Bhavan.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
            <h4 className="font-bold text-xs sm:text-sm text-stone-900">
              Q: What is the return or replacement policy if a tool is defective?
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              All tools and sprayers carry a 1-year manufacturer warranty. If any part arrives damaged or fails during initial operation, our dealer network provides a free 7-day doorstep replacement.
            </p>
          </div>
        </div>
      </section>
      {expressModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-400 text-emerald-950 font-bold">
                  <Zap className="w-4 h-4 fill-emerald-950" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base font-heading">
                    {t('expressOrder', lang)}
                  </h3>
                  <p className="text-[11px] text-emerald-200">
                    Fast Doorstep Delivery with Cash on Delivery / UPI
                  </p>
                </div>
              </div>
              <button
                onClick={() => setExpressModalProduct(null)}
                className="p-1 rounded-xl text-emerald-300 hover:text-white hover:bg-emerald-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {orderPlacedSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle className="w-8 h-8 stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-black text-stone-900 font-heading">
                    Order Placed Successfully!
                  </h4>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto">
                    Your order for <strong>{expressModalProduct.name}</strong> ({expressQty} {expressModalProduct.unit}) has been booked. The dealer will dispatch within 24 hours.
                  </p>
                </div>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-left space-y-1">
                  <div><strong>Customer:</strong> {customerName} ({customerPhone})</div>
                  <div><strong>Delivery Address:</strong> {deliveryAddress}</div>
                  <div><strong>Total Amount:</strong> ₹{(expressModalProduct.price * expressQty).toLocaleString('en-IN')} ({paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI on Delivery'})</div>
                </div>
                <button
                  onClick={() => setExpressModalProduct(null)}
                  className="w-full py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold shadow hover:bg-emerald-700 transition"
                >
                  Done & Continue Shopping
                </button>
              </div>
            ) : (
              <form onSubmit={handleExpressOrderSubmit} className="p-6 space-y-4">
                {/* Product Summary Card */}
                <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <img
                    src={expressModalProduct.image}
                    alt={expressModalProduct.name}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-stone-900 text-xs truncate">
                      {expressModalProduct.name}
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      ₹{expressModalProduct.price} &bull; {expressModalProduct.unit}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-emerald-800">
                        Qty: {expressQty}
                      </span>
                      <span className="text-xs text-stone-400">&bull;</span>
                      <span className="text-xs font-black text-emerald-950">
                        Total: ₹{(expressModalProduct.price * expressQty).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Farmer Details */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Farmer Name / ರೈತರ ಹೆಸರು *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Basavaraj Gowda"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 bg-stone-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Mobile Number / ಮೊಬೈಲ್ ಸಂಖ್ಯೆ *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 98451 23456"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 bg-stone-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Delivery Address (Village, Taluk, District, PIN) *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="e.g. Near Milk Dairy, Halaguru Village, Malavalli Taluk, Mandya - 571421"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 bg-stone-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Payment Mode
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <label
                        className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer text-xs ${
                          paymentMethod === 'cod'
                            ? 'bg-emerald-50 border-emerald-600 font-bold text-emerald-950'
                            : 'border-stone-200 text-stone-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="accent-emerald-700"
                        />
                        <span>Cash on Delivery</span>
                      </label>
                      <label
                        className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer text-xs ${
                          paymentMethod === 'upi'
                            ? 'bg-emerald-50 border-emerald-600 font-bold text-emerald-950'
                            : 'border-stone-200 text-stone-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                          className="accent-emerald-700"
                        />
                        <span>UPI on Delivery</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setExpressModalProduct(null)}
                    className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
                  >
                    Confirm Express Order &rarr;
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
