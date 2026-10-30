import {
  Sprout,
  ShoppingCart,
  Globe,
  PlusCircle,
  Stethoscope,
  TrendingUp,
  Handshake,
  MessageSquare,
  Store,
  Home,
  ChevronDown,
  PackageCheck,
  CloudSun,
  FlaskConical,
  CalendarDays,
  ShieldCheck,
  Building2,
  Zap,
  LogIn,
  BookOpen,
  MapPin
} from 'lucide-react';
import { Language, AuthUser, UserLiveLocation } from '../types/nammaraitha';
import { LANGUAGES, t, getAppTitle } from '../utils/translations';
import { getLocalizedDistrictName } from '../utils/weatherService';

export type ActiveTab =
  | 'home'
  | 'login'
  | 'marketplace'
  | 'agriInputs'
  | 'seller'
  | 'cropDoctor'
  | 'cropGuidance'
  | 'soilHealth'
  | 'cropCalendar'
  | 'weather'
  | 'mandi'
  | 'contract'
  | 'forum'
  | 'admin'
  | 'javaBackend';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  lang: Language;
  onOpenLanguageModal: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAddProduct: () => void;
  currentUser: AuthUser | null;
  onOpenLoginModal: () => void;
  currentLocation?: UserLiveLocation;
  onOpenLocationModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  lang,
  onOpenLanguageModal,
  cartCount,
  onOpenCart,
  onOpenAddProduct,
  currentUser,
  onOpenLoginModal,
  currentLocation,
  onOpenLocationModal,
}) => {
  const currentLangInfo = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  const appTitle = getAppTitle(lang);

  return (
    <header className="sticky top-0 z-40 bg-emerald-900 text-white shadow-lg border-b border-emerald-800">
      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Logo & Dynamic Localized Title - Always Prominently Visible with shrink-0 */}
          <div
            onClick={() => onTabChange('home')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group shrink-0"
            title={`${appTitle.full} - Home`}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-emerald-950 shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Sprout className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-baseline gap-1 sm:gap-1.5 flex-nowrap">
                <h1 className="font-extrabold text-base sm:text-lg lg:text-xl tracking-tight text-white flex items-center font-heading whitespace-nowrap">
                  <span>{appTitle.main}</span>
                </h1>
                <span className="text-amber-300 text-xs sm:text-sm font-bold tracking-normal whitespace-nowrap">
                  {appTitle.subtitle}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-emerald-300 font-medium tracking-wide whitespace-nowrap hidden md:block">
                {t('appSlogan', lang)}
              </p>
            </div>
          </div>

          {/* Right Action buttons - 1-Click Role Login, Language Selector, Cart, Add Produce & Seller Hub */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto">
            {/* Login / Profile Button */}
            {!currentUser ? (
              <button
                onClick={() => onTabChange('login')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-xs shadow-md transition hover:scale-105 shrink-0 border border-emerald-400/40"
                title="Login to AgriAI"
                aria-label="Login"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{lang === 'kn' ? 'ಲಾಗಿನ್' : 'Login'}</span>
              </button>
            ) : (
              <button
                onClick={() => onTabChange('login')}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-xl bg-emerald-950/90 hover:bg-emerald-800 text-white font-bold text-xs border border-amber-400/60 shadow-sm transition hover:scale-105 shrink-0 group"
                title="Click to Switch Role or Open Login Portals"
                aria-label="Switch User Profile"
              >
                {currentUser.role === 'farmer' && (
                  <div className="w-5 h-5 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center font-bold shrink-0">
                    <Sprout className="w-3 h-3 stroke-[2.5]" />
                  </div>
                )}
                {currentUser.role === 'company' && (
                  <div className="w-5 h-5 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold shrink-0">
                    <Building2 className="w-3 h-3 stroke-[2.5]" />
                  </div>
                )}
                {currentUser.role === 'contract_farming' && (
                  <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold shrink-0">
                    <Handshake className="w-3 h-3 stroke-[2.5]" />
                  </div>
                )}
                {currentUser.role === 'admin' && (
                  <div className="w-5 h-5 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold shrink-0">
                    <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
                  </div>
                )}

                <div className="flex flex-col text-left leading-tight hidden sm:flex">
                  <span className="text-white text-[11px] font-black truncate max-w-[110px]">
                    {lang === 'kn' && currentUser.nameKn ? currentUser.nameKn : currentUser.name}
                  </span>
                  <span className="text-[9px] text-amber-300 uppercase font-extrabold tracking-wider">
                    {currentUser.role === 'contract_farming' ? 'Contract' : currentUser.role} &bull; Switch ▾
                  </span>
                </div>

                <span className="sm:hidden text-[11px] font-bold text-amber-300 uppercase">
                  {currentUser.role === 'contract_farming' ? 'Contract' : currentUser.role} ▾
                </span>
              </button>
            )}

            {/* Live Location Selector Button */}
            <button
              onClick={onOpenLocationModal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-800/90 hover:bg-emerald-700 text-white font-medium text-xs border border-emerald-600/70 shadow-sm transition hover:scale-105 shrink-0 group"
              title="Click to view or detect accurate live location"
              aria-label="Accurate Live Location"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <div className="flex flex-col text-left leading-tight hidden xs:flex">
                <span className="font-bold text-xs truncate max-w-[85px] sm:max-w-[120px] flex items-center gap-1 text-white">
                  <span>
                    {lang === 'kn'
                      ? (currentLocation?.districtKn || currentLocation?.district || 'ಮಂಡ್ಯ')
                      : getLocalizedDistrictName(currentLocation?.district || 'Mandya', 'en')}
                  </span>
                  {currentLocation?.source === 'gps' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </span>
                <span className="text-[9px] text-amber-300 font-semibold truncate">
                  {currentLocation?.source === 'gps'
                    ? (currentLocation.accuracyMeters ? `±${Math.round(currentLocation.accuracyMeters)}m GPS` : 'Live GPS')
                    : (lang === 'kn' ? 'ಸ್ಥಳ ▾' : 'Loc ▾')}
                </span>
              </div>
              <span className="xs:hidden font-bold text-xs">
                {lang === 'kn'
                  ? (currentLocation?.districtKn?.slice(0, 4) || 'ಸ್ಥಳ')
                  : getLocalizedDistrictName(currentLocation?.district || 'Loc', 'en').slice(0, 4)}
              </span>
            </button>

            {/* Global Language Selector Button */}
            <button
              onClick={onOpenLanguageModal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-800/90 hover:bg-emerald-700 text-white font-medium text-xs border border-emerald-600/70 shadow-sm transition hover:scale-105 shrink-0"
              title="Change Language (23 Languages Available)"
              aria-label="Change Language"
            >
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
              <span className="font-bold text-xs">{currentLangInfo.name}</span>
              <span className="text-emerald-300 text-[11px] hidden md:inline">
                ({currentLangInfo.nativeName})
              </span>
              <ChevronDown className="w-3 h-3 text-emerald-300 shrink-0 ml-0.5" />
            </button>

            {activeTab !== 'admin' && (
              <>
                {/* Shopping Cart button - primary anchor with shrink-0 */}
                <button
                  onClick={onOpenCart}
                  className="relative p-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white transition border border-emerald-600/80 shadow-md shrink-0 flex items-center justify-center"
                  title="View Cart"
                  aria-label="View Shopping Cart"
                >
                  <ShoppingCart className="w-5 h-5 text-amber-300" />
                  {cartCount > 0 ? (
                    <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-emerald-950 font-black text-[11px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center border-2 border-emerald-900 shadow">
                      {cartCount}
                    </span>
                  ) : (
                    <span className="sr-only">0 items in cart</span>
                  )}
                </button>

                {/* Direct Add Product (comes after cart block) */}
                <button
                  onClick={onOpenAddProduct}
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-md hover:shadow-lg transition-all whitespace-nowrap shrink-0"
                  title="Add produce or tool directly without login"
                >
                  <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="hidden sm:inline">
                    {t('addProduce', lang)}
                  </span>
                  <span className="sm:hidden">+ {t('add', lang)}</span>
                </button>

                {/* Seller Portal Tab button (comes after cart block) */}
                <button
                  onClick={() => onTabChange('seller')}
                  className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border transition text-xs font-semibold whitespace-nowrap shrink-0 ${
                    activeTab === 'seller'
                      ? 'bg-white text-emerald-900 border-white shadow-sm font-bold'
                      : 'bg-emerald-800/70 border-emerald-600/60 text-white hover:bg-emerald-800'
                  }`}
                  title="Manage product prices and listings (No login required)"
                >
                  <span>{t('sellerHub', lang)}</span>
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Next Line: Dedicated Navigation Bar with Rich Agrarian Background (Changed as requested) */}
      <div className="bg-emerald-950 border-t border-emerald-800/80 border-b border-emerald-900 shadow-inner">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 sm:gap-1.5 py-2 overflow-x-auto no-scrollbar" aria-label="Main Navigation">
            {activeTab === 'admin' ? (
              /* IN ADMIN INTERFACE: Remove all features except the Admin Console */
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onTabChange('admin')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 bg-purple-600 text-white font-black shadow-md ring-2 ring-purple-300"
                    title="State Agri Directorate & System Admin Console"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-white" />
                    <span>{lang === 'kn' ? 'ಅಡ್ಮಿನ್ ಕನ್ಸೋಲ್' : 'Admin Console'}</span>
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping ml-0.5" />
                  </button>
                  <span className="text-xs font-semibold text-purple-200 hidden sm:inline ml-2">
                    {lang === 'kn' ? '• ರಾಜ್ಯ ಕೃಷಿ ನಿರ್ದೇಶನಾಲಯ ಅಧಿಕೃತ ಆಡಳಿತ ಕನ್ಸೋಲ್' : '• State Agri Directorate Admin Console'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onTabChange('marketplace')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-200 hover:text-white bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-600/60 transition whitespace-nowrap shadow-xs"
                    title="Exit Admin Interface and return to Farmer Portal"
                  >
                    <span>{lang === 'kn' ? '← ರೈತ ಪೋರ್ಟಲ್‌ಗೆ ಹಿಂತಿರುಗಿ' : '← Exit to Farmer Portal'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* 1. Home */}
                <button
                  onClick={() => onTabChange('home')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'home'
                  ? 'bg-amber-400 text-emerald-950 font-black shadow-md ring-1 ring-amber-300'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-900/80 font-semibold'
              }`}
            >
              <Home className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === 'home' ? 'text-emerald-950' : 'text-amber-300'}`} />
              <span>{t('home', lang)}</span>
            </button>

            {/* 2. Marketplace (Default Page) */}
            <button
              onClick={() => onTabChange('marketplace')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'marketplace'
                  ? 'bg-amber-400 text-emerald-950 font-black shadow-md ring-1 ring-amber-300'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-900/80 font-semibold'
              }`}
            >
              <Store className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === 'marketplace' ? 'text-emerald-950' : 'text-amber-300'}`} />
              <span>{t('marketplace', lang)}</span>
            </button>

            {/* 3. Community Chat */}
            <button
              onClick={() => onTabChange('forum')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'forum'
                  ? 'bg-amber-400 text-emerald-950 font-black shadow-md ring-1 ring-amber-300'
                  : 'text-emerald-100 bg-emerald-900/90 border border-emerald-700/60 hover:bg-emerald-800/80 font-bold'
              }`}
              title="Community of all farmers chat for queries"
            >
              <MessageSquare className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === 'forum' ? 'text-emerald-950' : 'text-amber-300'}`} />
              <span className="font-bold">{t('forum', lang)}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            </button>

            {/* 4. Tools, Fertilizer & Seeds */}
            <button
              onClick={() => onTabChange('agriInputs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'agriInputs'
                  ? 'bg-amber-400 text-emerald-950 font-black shadow-md ring-1 ring-amber-300'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-900/80 font-semibold'
              }`}
              title="Tools, Fertilizer & Seeds"
            >
              <PackageCheck className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === 'agriInputs' ? 'text-emerald-950' : 'text-emerald-400'}`} />
              <span>{t('agriStoreShort', lang)}</span>
            </button>

            {/* 5. AI Crop Doctor */}
            <button
              onClick={() => onTabChange('cropDoctor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'cropDoctor'
                  ? 'bg-amber-400 text-emerald-950 font-black shadow-md ring-1 ring-amber-300'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-900/80 font-semibold'
              }`}
            >
              <Stethoscope className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === 'cropDoctor' ? 'text-emerald-950' : 'text-emerald-400'}`} />
              <span>{t('cropDoctor', lang)}</span>
            </button>

            {/* 6. Crop Growing Guidance */}
            <button
              onClick={() => onTabChange('cropGuidance')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'cropGuidance'
                  ? 'bg-amber-400 text-emerald-950 font-black shadow-md ring-2 ring-amber-300'
                  : 'text-emerald-100 bg-emerald-900/90 border border-emerald-700/60 hover:bg-emerald-800/80 font-bold'
              }`}
              title="Crop Growing Guidance, Varieties & NPK Schedules"
            >
              <BookOpen className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === 'cropGuidance' ? 'text-emerald-950' : 'text-amber-300'}`} />
              <span>{lang === 'kn' ? 'ಬೆಳೆ ಮಾರ್ಗದರ್ಶಿ' : 'Crop Guidance'}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'cropGuidance' ? 'bg-emerald-950' : 'bg-emerald-400 animate-pulse'}`} />
            </button>

            {/* 7. Soil Health Advice (New Feature) */}
            <button
              onClick={() => onTabChange('soilHealth')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'soilHealth'
                  ? 'bg-amber-400 text-emerald-950 font-black shadow-md ring-1 ring-amber-300'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-900/80 font-semibold'
              }`}
              title="Soil Health Card & Fertilizer Prescriptions"
            >
              <FlaskConical className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === 'soilHealth' ? 'text-emerald-950' : 'text-amber-300'}`} />
              <span>{lang === 'kn' ? 'ಮಣ್ಣು ಆರೋಗ್ಯ' : 'Soil Health'}</span>
            </button>

            {/* 7. Crop Calendar Alerts (New Feature) */}
            <button
              onClick={() => onTabChange('cropCalendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'cropCalendar'
                  ? 'bg-amber-400 text-emerald-950 font-black shadow-md ring-1 ring-amber-300'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-900/80 font-semibold'
              }`}
              title="Stage-by-Stage Growth Calendar & SMS Alerts"
            >
              <CalendarDays className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === 'cropCalendar' ? 'text-emerald-950' : 'text-amber-300'}`} />
              <span>{lang === 'kn' ? 'ಬೆಳೆ ದಿನದರ್ಶಿ' : 'Crop Calendar'}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'cropCalendar' ? 'bg-emerald-950' : 'bg-amber-400 animate-ping'}`} />
            </button>

            {/* 8. Weather Forecasting */}
            <button
              onClick={() => onTabChange('weather')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'weather'
                  ? 'bg-amber-400 text-emerald-950 font-black shadow-md ring-1 ring-amber-300'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-900/80 font-semibold'
              }`}
              title="Agricultural Weather Forecast, 7-Day Prediction & Smart Spray Advisories"
            >
              <CloudSun className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === 'weather' ? 'text-emerald-950' : 'text-amber-300'}`} />
              <span>
                {lang === 'kn' ? 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ' : lang === 'en' ? 'Weather Forecast' : (t('weatherForecast', lang) || 'Weather Forecast')}
              </span>
            </button>

            {/* 7. Market Rates */}
            <button
              onClick={() => onTabChange('mandi')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'mandi'
                  ? 'bg-amber-400 text-emerald-950 font-black shadow-md ring-1 ring-amber-300'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-900/80 font-semibold'
              }`}
            >
              <TrendingUp className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === 'mandi' ? 'text-emerald-950' : 'text-amber-300'}`} />
              <span>{t('marketRates', lang)}</span>
            </button>

            {/* 8. Contracts */}
            <button
              onClick={() => onTabChange('contract')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'contract'
                  ? 'bg-amber-400 text-emerald-950 font-black shadow-md ring-1 ring-amber-300'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-900/80 font-semibold'
              }`}
            >
              <Handshake className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === 'contract' ? 'text-emerald-950' : 'text-amber-300'}`} />
              <span>{t('contracts', lang)}</span>
            </button>

            {/* Login / Role Portals (Optional access without forcing on startup) */}
            <button
              onClick={() => onTabChange('login')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'login'
                  ? 'bg-amber-400 text-emerald-950 font-black shadow-md ring-2 ring-amber-300'
                  : 'text-amber-300 bg-emerald-900/70 border border-emerald-700/80 hover:bg-emerald-800 font-bold'
              }`}
              title="Switch role or access dedicated login portals"
            >
              <LogIn className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === 'login' ? 'text-emerald-950' : 'text-amber-400'}`} />
              <span>{lang === 'kn' ? 'ಲಾಗಿನ್ / ಪಾತ್ರ ಬದಲಾವಣೆ' : 'Login / Roles'}</span>
            </button>
          </>
        )}
      </nav>
        </div>
      </div>
    </header>
  );
};
