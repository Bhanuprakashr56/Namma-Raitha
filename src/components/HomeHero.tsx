import React from 'react';
import {
  Sprout,
  Store,
  Stethoscope,
  TrendingUp,
  Handshake,
  MessageSquare,
  ShieldCheck,
  PlusCircle,
  ArrowRight,
  Sun,
  Droplets,
  CloudSun,
  PackageCheck,
  FlaskConical,
  CalendarDays,
  BellRing,
  Landmark,
  Zap,
  Phone,
  CheckCircle2,
  Award,
  Building2,
  BookOpen
} from 'lucide-react';
import { Language, Product, AuthUser, UserRole } from '../types/nammaraitha';
import { ActiveTab } from './Navbar';
import { t, getCommodityName } from '../utils/translations';

interface HomeHeroProps {
  onTabChange: (tab: ActiveTab) => void;
  lang: Language;
  featuredProducts: Product[];
  onOpenAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  currentUser?: AuthUser | null;
  onOpenOneClickLogin?: () => void;
  onSelectRole?: (role: UserRole) => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onTabChange,
  lang,
  featuredProducts,
  onOpenAddProduct,
  onEditProduct,
  onAddToCart,
  currentUser,
  onOpenOneClickLogin,
  onSelectRole,
}) => {
  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Hero Header Section - One consistent green color throughout */}
      <section className="relative rounded-2xl overflow-hidden bg-emerald-950 text-white p-5 sm:p-7 lg:p-8 shadow-xl border border-emerald-800/80 w-full">
        <div className="relative z-10 max-w-4xl space-y-3.5">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900 border border-emerald-700/70 text-amber-300 text-xs font-bold shadow-xs">
            <Sprout className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('heroBadge', lang)}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight font-heading">
            {t('heroTitle', lang)}
          </h1>

          <p className="text-emerald-100/90 text-xs sm:text-sm md:text-base leading-relaxed font-normal">
            {t('heroSubtitle', lang)}
          </p>

          {/* Action CTAs - Consistent styling and sizing across all buttons */}
          <div className="pt-1.5 flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Topmost Community CTA */}
            <button
              onClick={() => onTabChange('forum')}
              className="flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs sm:text-sm shadow-md transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t('communityChat', lang)}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-900 animate-pulse" />
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onTabChange('marketplace')}
              className="flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm border border-emerald-700/80 transition shadow-xs"
            >
              <Store className="w-4 h-4" />
              <span>{t('exploreMarketplace', lang)}</span>
            </button>

            <button
              onClick={() => onTabChange('agriInputs')}
              className="flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm shadow-md transition"
              title="Tools, Fertilizer & Seeds"
            >
              <PackageCheck className="w-4 h-4 text-emerald-950" />
              <span>{t('agriStoreShort', lang)}</span>
            </button>

            <button
              onClick={() => onTabChange('cropDoctor')}
              className="flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm border border-emerald-700/80 transition shadow-xs"
            >
              <Stethoscope className="w-4 h-4 text-emerald-300" />
              <span>{t('diagnoseCrop', lang)}</span>
            </button>

            <button
              onClick={() => onTabChange('cropGuidance')}
              className="flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm shadow-md transition"
              title="Stage-by-stage crop growing guidance and NPK schedules"
            >
              <BookOpen className="w-4 h-4 text-emerald-950" />
              <span>{lang === 'kn' ? 'ಬೆಳೆ ಮಾರ್ಗದರ್ಶಿ' : 'Crop Guidance'}</span>
            </button>

            <button
              onClick={onOpenAddProduct}
              className="flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-amber-300 font-bold text-xs sm:text-sm border border-emerald-700/80 transition shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('postProduceDirect', lang)}</span>
            </button>
          </div>
        </div>
      </section>



      {/* 4 Feature Pillars Grid - Community Chat moved to #1 top-left position */}
      {/* 6 Feature Pillars Grid - Including Community Chat, Agri Inputs, Crop Doctor, Weather, Mandi, Contracts */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Pillar #1: Community Forum & Farmer Chat (Top Most Feature) */}
        <div
          onClick={() => onTabChange('forum')}
          className="bg-white p-6 rounded-3xl border-2 border-emerald-500/40 shadow-sm hover:shadow-lg transition cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>{t('topPriority', lang)}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-900 text-base mt-4 group-hover:text-emerald-700 transition flex items-center gap-1.5">
            <span>{t('forum', lang)}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </h3>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            {t('liveFarmerBannerDesc', lang)}
          </p>
          <div className="mt-3 text-xs font-bold text-emerald-700 flex items-center gap-1">
            <span>{t('joinChatLive', lang)}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Pillar #2: Tools, Fertilizer & Seeds */}
        <div
          onClick={() => onTabChange('agriInputs')}
          className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-lg transition cursor-pointer group relative"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center group-hover:scale-110 transition-transform">
            <PackageCheck className="w-6 h-6 text-amber-700" />
          </div>
          <h3 className="font-bold text-stone-900 text-base mt-4 group-hover:text-emerald-700 transition">
            {lang === 'kn' ? 'ಉಪಕರಣ, ಗೊಬ್ಬರ & ಬೀಜಗಳು' : 'Tools, Fertilizer & Seeds'}
          </h3>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            {lang === 'kn'
              ? 'ಪ್ರಮಾಣಿತ ಬೀಜಗಳು, ಉಪಕರಣಗಳು, ಜೈವಿಕ ಕೀಟನಾಶಕಗಳು & ರಸಗೊಬ್ಬರಗಳ ನೇರ ಖರೀದಿ.'
              : 'Certified hybrid seeds, sprayers, organic bio-fertilizers & farm tools at subsidy rates.'}
          </p>
          <div className="mt-3 text-xs font-bold text-emerald-700 flex items-center gap-1">
            <span>{lang === 'kn' ? 'ಉಪಕರಣ, ಗೊಬ್ಬರ & ಬೀಜಗಳನ್ನು ವೀಕ್ಷಿಸಿ' : 'Shop Tools, Fertilizer & Seeds'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Pillar #3: AI Crop Doctor */}
        <div
          onClick={() => onTabChange('cropDoctor')}
          className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-900 text-base mt-4 group-hover:text-emerald-700 transition">
            {t('cropDoctor', lang)}
          </h3>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            {t('cropDoctor', lang)}: instant remedies & dosage advice.
          </p>
          <div className="mt-3 text-xs font-bold text-emerald-700 flex items-center gap-1">
            <span>{t('diagnoseNow', lang)}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Pillar #4: Weather Forecast & Smart Spray Advisory (Dedicated Feature) */}
        <div
          onClick={() => onTabChange('weather')}
          className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-lg transition cursor-pointer group relative"
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CloudSun className="w-6 h-6 text-sky-700" />
          </div>
          <h3 className="font-bold text-stone-900 text-base mt-4 group-hover:text-emerald-700 transition">
            {lang === 'kn' ? 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ & ಸಲಹೆ' : 'Weather Forecast & Agro-Advisory'}
          </h3>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            {lang === 'kn'
              ? '7 ದಿನಗಳ ನಿಖರ ಮಳೆ ಮುನ್ಸೂಚನೆ, ಔಷಧ ಸಿಂಪರಣಾ ಹದ & ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿ.'
              : 'Hyper-local 7-day rainfall outlook, spraying windows & reservoir telemetry.'}
          </p>
          <div className="mt-3 text-xs font-bold text-emerald-700 flex items-center gap-1">
            <span>{lang === 'kn' ? 'ಹವಾಮಾನ ವೀಕ್ಷಿಸಿ' : 'View Forecast'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Pillar #5: APMC Mandi Rates & Price Alerts */}
        <div
          onClick={() => onTabChange('mandi')}
          className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition cursor-pointer group relative"
        >
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] flex items-center gap-1">
            <BellRing className="w-3 h-3 text-amber-700" />
            <span>{lang === 'kn' ? 'ದರ ಎಚ್ಚರಿಕೆ' : 'Price Alerts'}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-900 text-base mt-4 group-hover:text-emerald-700 transition">
            {t('marketRates', lang)}
          </h3>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            {lang === 'kn'
              ? 'ಲೈವ್ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ದರಗಳು, ದಿನನಿತ್ಯದ ಆವಕ ಮತ್ತು ಎಸ್ಎಂಎಸ್ ದರ ಎಚ್ಚರಿಕೆಗಳು.'
              : 'Live APMC market prices, daily arrivals & SMS target price alerts.'}
          </p>
          <div className="mt-3 text-xs font-bold text-emerald-700 flex items-center gap-1">
            <span>{t('checkRates', lang)}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Pillar #6: Soil Health Advice (New Feature) */}
        <div
          onClick={() => onTabChange('soilHealth')}
          className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-lg transition cursor-pointer group relative"
        >
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px]">
            {lang === 'kn' ? 'ಮಣ್ಣು ಕಾರ್ಡ್' : 'Soil Card'}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FlaskConical className="w-6 h-6 text-emerald-700" />
          </div>
          <h3 className="font-bold text-stone-900 text-base mt-4 group-hover:text-emerald-700 transition">
            {lang === 'kn' ? 'ಮಣ್ಣು ಆರೋಗ್ಯ ಸಲಹೆ & ಪರೀಕ್ಷೆ' : 'Soil Health Advice & Testing'}
          </h3>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            {lang === 'kn'
              ? 'ಎನ್‌ಪಿಕೆ ವಿಶ್ಲೇಷಣೆ, ಸಾವಯವ ಇಂಗಾಲ ಸುಧಾರಣೆ, ಮತ್ತು ಕರ್ನಾಟಕದ ಅಧಿಕೃತ ಲ್ಯಾಬ್‌ಗಳ ಮಾಹಿತಿ.'
              : 'NPK test analyzer, fertilizer prescriptions, pH balancing & accredited lab directory.'}
          </p>
          <div className="mt-3 text-xs font-bold text-emerald-700 flex items-center gap-1">
            <span>{lang === 'kn' ? 'ಮಣ್ಣು ಆರೋಗ್ಯ ವೀಕ್ಷಿಸಿ' : 'Analyze Soil'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Pillar #7: Crop Calendar Alerts (New Feature) */}
        <div
          onClick={() => onTabChange('cropCalendar')}
          className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-lg transition cursor-pointer group relative"
        >
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 font-bold text-[10px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-ping" />
            <span>{lang === 'kn' ? 'ದಿನದರ್ಶಿ' : 'Schedules'}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CalendarDays className="w-6 h-6 text-teal-700" />
          </div>
          <h3 className="font-bold text-stone-900 text-base mt-4 group-hover:text-emerald-700 transition">
            {lang === 'kn' ? 'ಬೆಳೆ ದಿನದರ್ಶಿ ಎಚ್ಚರಿಕೆಗಳು' : 'Crop Calendar Alerts'}
          </h3>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            {lang === 'kn'
              ? 'ಬಿತ್ತನೆಯಿಂದ ಕೊಯ್ಲಿನವರೆಗೆ ಹಂತ-ಹಂತದ ಕೃಷಿ ನಿರ್ವಹಣೆ & ವಾಟ್ಸಾಪ್/ಎಸ್ಎಂಎಸ್ ಎಚ್ಚರಿಕೆಗಳು.'
              : 'Stage-by-stage crop timelines, sowing schedules, irrigation & pest spray alerts.'}
          </p>
          <div className="mt-3 text-xs font-bold text-emerald-700 flex items-center gap-1">
            <span>{lang === 'kn' ? 'ಕ್ಯಾಲೆಂಡರ್ ವೀಕ್ಷಿಸಿ' : 'View Calendar'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Pillar #8: Pre-Harvest Contracts */}
        <div
          onClick={() => onTabChange('contract')}
          className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Handshake className="w-6 h-6 text-indigo-700" />
          </div>
          <h3 className="font-bold text-stone-900 text-base mt-4 group-hover:text-emerald-700 transition">
            {t('contracts', lang)}
          </h3>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            {t('contractFarmingTitle', lang)}
          </p>
          <div className="mt-3 text-xs font-bold text-emerald-700 flex items-center gap-1">
            <span>{t('viewContracts', lang)}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Pillar #9: Government Schemes & Kisan Subsidies (Completes 3x3 Grid) */}
        <div
          onClick={() => onTabChange('agriInputs')}
          className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-lg transition cursor-pointer group relative"
        >
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] flex items-center gap-1">
            <Award className="w-3 h-3 text-amber-700" />
            <span>{lang === 'kn' ? 'ಸರ್ಕಾರಿ ಯೋಜನೆ' : 'Govt Subsidy'}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Landmark className="w-6 h-6 text-amber-700" />
          </div>
          <h3 className="font-bold text-stone-900 text-base mt-4 group-hover:text-emerald-700 transition">
            {lang === 'kn' ? 'ಕೃಷಿ ಯೋಜನೆಗಳು & ಸಹಾಯಧನ' : 'Govt Schemes & Subsidies'}
          </h3>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            {lang === 'kn'
              ? 'ಪಿಎಂ ಕಿಸಾನ್, ರಾಗಿ-ಸಿರಿ ಧಾನ್ಯ ಪ್ರೋತ್ಸಾಹ ಧನ, ಡ್ರಿಪ್ ಸಬ್ಸಿಡಿ & ಯಂತ್ರೋಪಕರಣಗಳ ಡಿಬಿಟಿ ಮಾಹಿತಿ.'
              : 'PM-Kisan, Raitha Siri, 40-50% SMAM mechanization subsidies & DBT seed assistance.'}
          </p>
          <div className="mt-3 text-xs font-bold text-emerald-700 flex items-center gap-1">
            <span>{lang === 'kn' ? 'ಯೋಜನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ' : 'Explore Subsidies'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>

      {/* Featured Marketplace Picks */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-heading">
              {t('featuredHeading', lang)}
            </h2>
            <p className="text-xs text-stone-500">
              {t('featuredSubtitle', lang)}
            </p>
          </div>
          <button
            onClick={() => onTabChange('marketplace')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>{t('viewAll', lang)}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredProducts
            .filter((p) => !['seeds', 'fertilizers', 'tools', 'machinery', 'irrigation', 'pesticides'].includes(p.category))
            .slice(0, 8)
            .map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="relative h-44 w-full bg-stone-100">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                {p.organic && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-700 text-white text-[10px] font-bold">
                    🌿 {t('organic', lang)}
                  </span>
                )}
                <button
                  onClick={() => onEditProduct(p)}
                  className="absolute top-2 right-2 px-2 py-1 rounded bg-stone-900/80 hover:bg-emerald-700 text-white text-[10px] font-semibold backdrop-blur"
                  title="Edit item directly (no login)"
                >
                  {t('edit', lang)}
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm line-clamp-1">
                    {lang === 'kn' && p.nameKn ? p.nameKn : getCommodityName(p.name, lang)}
                  </h4>
                  <div className="text-xs text-stone-400 mt-0.5">{p.location}</div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="font-extrabold text-emerald-800 text-base">
                    ₹{p.price.toLocaleString('en-IN')}{' '}
                    <span className="text-[10px] text-stone-400 font-normal">/ {p.unit}</span>
                  </div>
                  <button
                    onClick={() => onAddToCart(p)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition"
                  >
                    {t('add', lang)}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
