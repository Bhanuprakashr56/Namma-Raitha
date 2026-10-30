import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { Marketplace } from './components/Marketplace';
import { SellerDashboard } from './components/SellerDashboard';
import { AiCropDoctor } from './components/AiCropDoctor';
import { WeatherMandi } from './components/WeatherMandi';
import { ContractFarming } from './components/ContractFarming';
import { Forum } from './components/Forum';
import { AgriInputsStore } from './components/AgriInputsStore';
import { WeatherForecast } from './components/WeatherForecast';
import { SoilHealth } from './components/SoilHealth';
import { CropCalendar } from './components/CropCalendar';
import { CartDrawer } from './components/CartDrawer';
import { EditProductModal } from './components/EditProductModal';
import { LanguageModal } from './components/LanguageModal';
import { OneClickLoginModal } from './components/OneClickLoginModal';
import { LoginPage } from './components/LoginPage';
import { CropGuidance } from './components/CropGuidance';
import { AdminDashboard } from './components/AdminDashboard';
import { LiveLocationModal } from './components/LiveLocationModal';
import { JavaBackendConsole } from './components/JavaBackendConsole';
import { Product, Order, OrderItem, Language, AuthUser, UserRole, UserLiveLocation } from './types/nammaraitha';
import { INITIAL_PRODUCTS, PRESET_AUTH_USERS } from './data/mockData';
import { reverseGeocode, findNearestDistrict } from './utils/weatherService';
import { Phone, Sprout, Heart, ShieldCheck, ShoppingCart } from 'lucide-react';
import { t, getAppTitle } from './utils/translations';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('nammaraitha_lang_v1');
      if (saved) return saved as Language;
    } catch (e) {}
    return 'en'; // Top most is English
  });
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // Live Accurate Location State
  const [userLocation, setUserLocation] = useState<UserLiveLocation>(() => {
    try {
      const saved = localStorage.getItem('nammaraitha_live_location_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      lat: 12.5218,
      lng: 76.8951,
      accuracyMeters: 15,
      district: 'Mandya',
      districtKn: 'ಮಂಡ್ಯ',
      state: 'Karnataka',
      formattedAddress: 'Mandya, Karnataka, India',
      source: 'manual',
      updatedAt: 'Initial',
    };
  });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const handleLocationSelect = useCallback((loc: UserLiveLocation) => {
    setUserLocation(loc);
    try {
      localStorage.setItem('nammaraitha_live_location_v2', JSON.stringify(loc));
    } catch (e) {}
  }, []);

  // Automatic silent live GPS check on app load
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude, accuracy, altitude, speed, heading } = pos.coords;
            const geo = await reverseGeocode(latitude, longitude);
            const nearest = findNearestDistrict(latitude, longitude);
            const resolvedDistrict = geo.district || nearest.district.district;
            const resolvedState = geo.state || nearest.district.state;
            const liveLoc: UserLiveLocation = {
              lat: latitude,
              lng: longitude,
              accuracyMeters: accuracy,
              altitude: altitude ?? null,
              heading: heading ?? null,
              speed: speed ?? null,
              village: geo.village,
              taluk: geo.taluk,
              city: geo.city || resolvedDistrict,
              district: resolvedDistrict,
              districtKn: nearest.district.districtKn,
              state: resolvedState,
              formattedAddress: geo.formattedAddress || `${geo.village ? geo.village + ', ' : ''}${resolvedDistrict}, ${resolvedState}`,
              source: 'gps',
              updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            };
            setUserLocation(liveLoc);
            localStorage.setItem('nammaraitha_live_location_v2', JSON.stringify(liveLoc));
          } catch (err) {
            console.debug('Background GPS reverse geocoding skipped:', err);
          }
        },
        (err) => {
          console.debug('Background GPS silent check:', err.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }
  }, []);

  // Default to 'marketplace' so user lands directly into the working app without having to log in again and again
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    try {
      const saved = localStorage.getItem('nammaraitha_active_tab_v2');
      if (saved && saved !== 'login') return saved as ActiveTab;
    } catch (e) {}
    return 'marketplace'; // Default page as requested
  });

  useEffect(() => {
    try {
      if (activeTab !== 'login') {
        localStorage.setItem('nammaraitha_active_tab_v2', activeTab);
      }
    } catch (e) {}
  }, [activeTab]);

  useEffect(() => {
    try {
      localStorage.setItem('nammaraitha_lang_v1', lang);
    } catch (e) {}
    const titleInfo = getAppTitle(lang);
    document.title = `${titleInfo.full} - ${t('appSlogan', lang)}`;
  }, [lang]);

  // Products state (persisted in localStorage)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('nammaraitha_products_v3');
      if (saved) return JSON.parse(saved);
      const oldSaved = localStorage.getItem('nammaraitha_products_v2');
      if (oldSaved) {
        const parsed = JSON.parse(oldSaved) as Product[];
        const existingIds = new Set(parsed.map((p) => p.id));
        const merged = [
          ...parsed,
          ...INITIAL_PRODUCTS.filter((p) => !existingIds.has(p.id))
        ];
        return merged;
      }
    } catch (e) {
      console.warn('Failed to parse saved products', e);
    }
    return INITIAL_PRODUCTS;
  });

  // Save products to localStorage on edit
  useEffect(() => {
    try {
      localStorage.setItem('nammaraitha_products_v3', JSON.stringify(products));
    } catch (e) {
      console.warn('Failed to save products', e);
    }
  }, [products]);

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('nammaraitha_orders_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'ORD-8921',
        items: [
          { product: INITIAL_PRODUCTS[0], quantity: 2 },
          { product: INITIAL_PRODUCTS[3], quantity: 1 }
        ],
        totalAmount: 8240,
        customerName: 'Shivaraj Kumar',
        phone: '+91 94481 99201',
        deliveryAddress: 'Farm Gate #12, Pandavapura, Mandya District',
        status: 'Confirmed',
        orderDate: 'Today, 11:30 AM'
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('nammaraitha_orders_v1', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  // Cart state
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Edit Product Modal state (Direct Editing - No Login Required!)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Handlers for cart (Memoized for high performance and fast rendering)
  const handleAddToCart = useCallback((product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const handleUpdateQuantity = useCallback((productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as OrderItem[]
    );
  }, []);

  const handleRemoveItem = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const handlePlaceOrder = useCallback((customer: { name: string; phone: string; address: string }) => {
    setCartItems((prevItems) => {
      const totalAmount = prevItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      const newOrder: Order = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        items: [...prevItems],
        totalAmount,
        customerName: customer.name,
        phone: customer.phone,
        deliveryAddress: customer.address,
        status: 'Pending',
        orderDate: new Date().toLocaleDateString('en-IN', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      setOrders((prevOrders) => [newOrder, ...prevOrders]);
      return [];
    });
  }, []);

  const handlePlaceExpressOrder = useCallback((orderData: {
    product: Product;
    quantity: number;
    customerName: string;
    phone: string;
    address: string;
    paymentMethod: 'cod' | 'upi';
  }) => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [{ product: orderData.product, quantity: orderData.quantity }],
      totalAmount: orderData.product.price * orderData.quantity,
      customerName: orderData.customerName,
      phone: orderData.phone,
      deliveryAddress: orderData.address,
      status: 'Pending',
      orderDate: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setOrders((prev) => [newOrder, ...prev]);
  }, []);

  // Direct Product Editing (Zero Login Required)
  const handleOpenEditProduct = useCallback((product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  }, []);

  const handleOpenAddProduct = useCallback(() => {
    setEditingProduct(null);
    setIsEditModalOpen(true);
  }, []);

  const handleSaveProduct = useCallback((savedProduct: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === savedProduct.id);
      if (exists) {
        return prev.map((p) => (p.id === savedProduct.id ? savedProduct : p));
      }
      return [savedProduct, ...prev];
    });
  }, []);

  const handleDeleteProduct = useCallback((productId: string) => {
    if (confirm('Are you sure you want to remove this listing?')) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  }, []);

  const handleUpdateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  }, []);

  // User Authentication state: loads from localStorage; defaults to Farmer (Ningappa Gowda) so user is never forced to log in again and again
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('nammaraitha_auth_user_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return PRESET_AUTH_USERS.farmer; // Default to logged-in farmer
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Save auth user to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('nammaraitha_auth_user_v1', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('nammaraitha_auth_user_v1');
      }
    } catch (e) {}
  }, [currentUser]);

  const handleSelectRole = useCallback((role: UserRole) => {
    const user = PRESET_AUTH_USERS[role];
    setCurrentUser(user);
    if (role === 'admin') {
      setActiveTab('admin');
    } else if (role === 'contract_farming') {
      setActiveTab('contract');
    } else if (role === 'company') {
      setActiveTab('marketplace');
    } else if (role === 'consumer') {
      setActiveTab('marketplace');
    } else if (role === 'farmer') {
      setActiveTab('marketplace');
    }
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setActiveTab('login');
  }, []);

  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);
  const cartTotal = useMemo(() => cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  ), [cartItems]);

  return (
    <div
      dir={['ur', 'ks', 'sd'].includes(lang) ? 'rtl' : 'ltr'}
      className={activeTab === 'login' ? 'h-screen max-h-screen overflow-hidden bg-[#eef7f0] flex flex-col font-sans text-stone-900 selection:bg-emerald-200' : 'min-h-screen bg-stone-100 flex flex-col font-sans text-stone-900 selection:bg-emerald-200 overflow-x-hidden relative'}
    >
      {/* Navigation Header - Only shown once entered into the app */}
      {activeTab !== 'login' && (
        <Navbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          lang={lang}
          onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
          cartCount={cartCount}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenAddProduct={handleOpenAddProduct}
          currentUser={currentUser}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          currentLocation={userLocation}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
        />
      )}

      {/* Main Container */}
      <main className={activeTab === 'login' ? 'h-screen max-h-screen overflow-hidden w-full bg-[#eef7f0]' : 'flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'}>
        {activeTab === 'home' && (
          <HomeHero
            onTabChange={setActiveTab}
            lang={lang}
            featuredProducts={products}
            onOpenAddProduct={handleOpenAddProduct}
            onEditProduct={handleOpenEditProduct}
            onAddToCart={handleAddToCart}
            currentUser={currentUser}
            onOpenOneClickLogin={() => setIsLoginModalOpen(true)}
            onSelectRole={handleSelectRole}
          />
        )}

        {/* Dedicated AgriAI Role Login Page (Matching image.png) */}
        {activeTab === 'login' && (
          <LoginPage
            currentUser={currentUser}
            onSelectRole={handleSelectRole}
            onLogout={handleLogout}
            lang={lang}
            onNavigateTab={setActiveTab}
            onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
          />
        )}

        {activeTab === 'marketplace' && (
          <Marketplace
            products={products}
            lang={lang}
            onAddToCart={handleAddToCart}
            onEditProduct={handleOpenEditProduct}
            onOpenAddProduct={handleOpenAddProduct}
            onNavigateAgriInputs={() => setActiveTab('agriInputs')}
          />
        )}

        {activeTab === 'agriInputs' && (
          <AgriInputsStore
            products={products}
            lang={lang}
            onAddToCart={handleAddToCart}
            onPlaceExpressOrder={handlePlaceExpressOrder}
            onNavigateMarketplace={() => setActiveTab('marketplace')}
          />
        )}

        {activeTab === 'seller' && (
          <SellerDashboard
            products={products}
            orders={orders}
            lang={lang}
            onEditProduct={handleOpenEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onOpenAddProduct={handleOpenAddProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {activeTab === 'cropDoctor' && <AiCropDoctor lang={lang} />}

        {activeTab === 'cropGuidance' && (
          <CropGuidance
            lang={lang}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'soilHealth' && (
          <SoilHealth lang={lang} onOpenAgriInputs={() => setActiveTab('agriInputs')} />
        )}

        {activeTab === 'cropCalendar' && <CropCalendar lang={lang} />}

        {activeTab === 'weather' && (
          <WeatherForecast
            lang={lang}
            currentLocation={userLocation}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            onLocationChange={handleLocationSelect}
          />
        )}

        {activeTab === 'mandi' && (
          <WeatherMandi
            lang={lang}
            onOpenWeather={() => setActiveTab('weather')}
            currentLocation={userLocation}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
          />
        )}

        {activeTab === 'contract' && <ContractFarming lang={lang} />}

        {activeTab === 'forum' && <Forum lang={lang} />}

        {/* 10. Admin Console Tab (State Directorate) */}
        {activeTab === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
            lang={lang}
            onOpenOneClickLogin={() => setIsLoginModalOpen(true)}
          />
        )}

        {/* 11. Java Full Stack Architecture Console (Spring Boot 3 + MySQL) */}
        {activeTab === 'javaBackend' && (
          <JavaBackendConsole lang={lang} />
        )}
      </main>

      {/* 1-Click Fast Login Modal (Farmer, Company, Contract Farming, Admin) */}
      <OneClickLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        onSelectRole={handleSelectRole}
        onLogout={handleLogout}
        lang={lang}
      />

      {/* Direct Edit Product Modal (No Login Required) */}
      <EditProductModal
        isOpen={isEditModalOpen}
        product={editingProduct}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProduct}
        lang={lang}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onPlaceOrder={handlePlaceOrder}
        lang={lang}
      />

      {/* Floating Quick Cart Access Button - Stays securely pinned within viewport */}
      {cartCount > 0 && !isCartOpen && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 bg-emerald-800 hover:bg-emerald-700 text-white pl-4 pr-5 py-2.5 sm:py-3 rounded-full shadow-2xl border-2 border-amber-400 flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 group"
          title="Open Shopping Cart"
          aria-label="Open Shopping Cart"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 text-amber-300" />
            <span className="absolute -top-2 -right-2 bg-amber-400 text-emerald-950 font-black text-[11px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center border-2 border-emerald-900 shadow">
              {cartCount}
            </span>
          </div>
          <div className="text-left">
            <div className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">
              {t('cart', lang)}
            </div>
            <div className="text-xs font-black text-amber-300">
              ₹{cartTotal.toLocaleString('en-IN')}
            </div>
          </div>
        </button>
      )}

      {/* 23 Languages Modal (English top most + 22 Scheduled Indian Languages) */}
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentLang={lang}
        onSelectLang={(newLang) => setLang(newLang)}
      />

      {/* High-Accuracy Live Location & Agro Hub Modal */}
      <LiveLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        lang={lang}
        currentLocation={userLocation}
        onLocationSelect={handleLocationSelect}
      />

      {/* Footer - Only shown once entered into the app */}
      {activeTab !== 'login' && (
        <footer className="bg-emerald-950 text-emerald-200 border-t border-emerald-900 mt-16 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
                  <Sprout className="w-5 h-5" />
                </div>
                <span className="text-xl font-extrabold text-white font-heading">
                  {getAppTitle(lang).full}
                </span>
              </div>
              <p className="text-xs text-emerald-300/80 max-w-md leading-relaxed">
                Karnataka&apos;s smart agricultural empowerment network. Connecting farmers directly to buyers, offering AI disease diagnostics, transparent APMC market prices, and guaranteed contract farming.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('smartAgriNetwork', lang)}</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                {t('agriHelplineTitle', lang)}
              </h4>
              <ul className="space-y-2 text-xs text-emerald-300">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{t('kisanCallCenter', lang)}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Raitha Vani: <strong>080-22212811</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Crop Insurance Helpline: <strong>14447</strong></span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                {t('keyFeaturesTitle', lang)}
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-300/90">
                <li>&bull; {t('featureProduceListing', lang)}</li>
                <li>&bull; {t('featureAiVision', lang)}</li>
                <li>&bull; {t('featureApmcRates', lang)}</li>
                <li>&bull; {t('featureBuyback', lang)}</li>
                <li>&bull; 23 Indian Languages Supported</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-emerald-900 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-400 gap-2">
            <div>
              &copy; {new Date().getFullYear()} Namma Raitha Platform. {t('smartAgriNetwork', lang)}.
            </div>
            <div className="flex items-center gap-1 text-emerald-300">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span>{t('madeForFarmers', lang)}</span>
            </div>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
}
