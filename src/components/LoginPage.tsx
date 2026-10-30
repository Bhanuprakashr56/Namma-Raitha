import React, { useState } from 'react';
import {
  Sprout,
  Building2,
  ShoppingCart,
  UserCheck,
  Check,
  ArrowRight,
  Mail,
  Info,
  Store,
  MessageSquare,
  FlaskConical,
  Bug,
  BookOpen,
  Wheat,
  Activity,
  Zap,
  Settings,
  Handshake
} from 'lucide-react';
import { AuthUser, UserRole, Language } from '../types/nammaraitha';
import { ActiveTab } from './Navbar';

interface LoginPageProps {
  currentUser: AuthUser | null;
  onSelectRole: (role: UserRole) => void;
  onLogout: () => void;
  lang: Language;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenLanguageModal?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  currentUser,
  onSelectRole,
  onLogout,
  lang,
  onNavigateTab,
  onOpenLanguageModal,
}) => {
  // Selected role among the 4 in the design: 'farmer' | 'contract_farming' | 'company' | 'admin'
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser?.role || 'farmer');
  const [showEmailPhoneForm, setShowEmailPhoneForm] = useState(false);
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [loggingInRole, setLoggingInRole] = useState<UserRole | null>(null);

  // 1-Click Instant Login Handler
  const handleExecuteLogin = (roleToLogin: UserRole = selectedRole) => {
    setSelectedRole(roleToLogin);
    setLoggingInRole(roleToLogin);
    onSelectRole(roleToLogin);
    setTimeout(() => {
      setLoggingInRole(null);
    }, 600);
  };

  // Uniform role cards with matching structure and equal text lengths
  const roleCards = [
    {
      id: 'farmer' as UserRole,
      title: 'Farmer',
      titleKn: 'ರೈತರು',
      desc: 'Get crop guidance, market produce & use AI tools',
      icon: (
        <svg className="w-5 h-5 text-emerald-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12c3-1.5 7-2 10-2s7 .5 10 2" />
          <path d="M6 10.5V7a6 6 0 0 1 12 0v3.5" />
          <circle cx="12" cy="14" r="3.5" />
          <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
        </svg>
      ),
    },
    {
      id: 'contract_farming' as UserRole,
      title: 'Contract Farming',
      titleKn: 'ಗುತ್ತಿಗೆ ಕೃಷಿ',
      desc: 'Assured buyback, legal MOUs & advance prices',
      icon: <Handshake className="w-5 h-5 text-emerald-800" strokeWidth={2.2} />,
    },
    {
      id: 'company' as UserRole,
      title: 'Company',
      titleKn: 'ಕಂಪನಿ',
      desc: 'Corporate procurement, bulk mandi buy & supply',
      icon: <Building2 className="w-5 h-5 text-emerald-800" strokeWidth={2.2} />,
    },
    {
      id: 'admin' as UserRole,
      title: 'Admin',
      titleKn: 'ಅಡ್ಮಿನ್',
      desc: 'Directorate console, subsidies & verification',
      icon: (
        <div className="relative">
          <UserCheck className="w-5 h-5 text-emerald-800" strokeWidth={2.2} />
          <Settings className="w-2.5 h-2.5 text-emerald-800 absolute -bottom-0.5 -right-0.5 stroke-[2.5]" />
        </div>
      ),
    },
  ];

  const platformFeatures = [
    {
      title: 'Marketplace',
      desc: 'Buy & sell farm produce, seeds, equipment',
      icon: <Store className="w-4 h-4 text-emerald-800" />,
      tab: 'marketplace' as ActiveTab,
    },
    {
      title: 'Community Chat',
      desc: 'Connect with farmers, experts & consumers',
      icon: <MessageSquare className="w-4 h-4 text-emerald-800" />,
      tab: 'forum' as ActiveTab,
    },
    {
      title: 'AI Crop Doctor',
      desc: 'Identify crop diseases with instant photo diagnosis',
      icon: <Activity className="w-4 h-4 text-emerald-800" />,
      tab: 'cropDoctor' as ActiveTab,
    },
    {
      title: 'Soil Health Advice',
      desc: 'Soil analysis & fertilizer prescriptions',
      icon: <FlaskConical className="w-4 h-4 text-emerald-800" />,
      tab: 'soilHealth' as ActiveTab,
    },
    {
      title: 'Growing Guidance',
      desc: 'Stage-by-stage guide, NPK & pest matrix',
      icon: <Sprout className="w-4 h-4 text-emerald-800" />,
      tab: 'cropGuidance' as ActiveTab,
    },
    {
      title: 'Pest / Disease Detection',
      desc: 'Detect and prevent crop diseases early',
      icon: <Bug className="w-4 h-4 text-emerald-800" />,
      tab: 'cropDoctor' as ActiveTab,
    },
    {
      title: 'Crop Calendar & Alerts',
      desc: 'Sowing to harvest SMS reminders',
      icon: <BookOpen className="w-4 h-4 text-emerald-800" />,
      tab: 'cropCalendar' as ActiveTab,
    },
    {
      title: 'Mandi Market Rates',
      desc: 'Live APMC rates & price trends',
      icon: <Wheat className="w-4 h-4 text-emerald-800" />,
      tab: 'mandi' as ActiveTab,
    },
    {
      title: 'Contract Farming',
      desc: 'Assured buyback & advance price agreements',
      icon: <Building2 className="w-4 h-4 text-emerald-800" />,
      tab: 'contract' as ActiveTab,
    },
  ];

  return (
    <div className="h-screen max-h-screen w-full overflow-hidden bg-emerald-50/50 flex flex-col justify-between px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 font-sans select-none relative">
      {/* Decorative botanical watermark accents in unified emerald tint */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top Utility Bar (Compact, fits on 1 page) */}
      <header className="flex-none max-w-7xl w-full mx-auto flex items-center justify-between text-xs text-stone-500 gap-2 mb-1 px-1">
        {currentUser ? (
          <div className="flex items-center gap-2 bg-white/95 border border-emerald-300 px-2.5 py-0.5 rounded-full shadow-2xs text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse" />
            <span className="text-stone-600 font-medium">Logged in:</span>
            <span className="font-extrabold text-stone-900">{currentUser.name}</span>
            <span className="uppercase text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
              {currentUser.role}
            </span>
            <button
              onClick={onLogout}
              className="ml-1 text-rose-600 hover:text-rose-700 font-bold underline"
            >
              Logout
            </button>
            <button
              onClick={() => onNavigateTab('home')}
              className="ml-1 text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-0.5"
            >
              <span>App</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </button>
          </div>
        ) : (
          <div className="text-emerald-900 font-bold text-[11px] bg-white/80 border border-emerald-200 px-2.5 py-0.5 rounded-full hidden sm:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-800 animate-pulse" />
            <span>AgriAI Smart Agriculture Gateway &bull; 1-Click Access</span>
          </div>
        )}

        <div className="flex items-center gap-2.5 ml-auto">
          {onOpenLanguageModal && (
            <button
              type="button"
              onClick={onOpenLanguageModal}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white hover:bg-stone-50 border border-emerald-200 text-emerald-900 font-bold text-[11px] shadow-2xs transition"
            >
              <span>{lang === 'kn' ? '🇮🇳 ಕನ್ನಡ' : '🌐 English'}</span>
            </button>
          )}

          <div className="flex items-center gap-1 text-stone-500 text-[11px]">
            <span>Your data is safe with us</span>
            <Info className="w-3 h-3 text-stone-400" />
          </div>
        </div>
      </header>

      {/* Main 2-Column Split Content - strictly fits within viewport without scrolling */}
      <div className="flex-1 min-h-0 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-6 items-stretch">
        
        {/* ================= LEFT COLUMN: HERO & OUR PLATFORM FEATURES ================= */}
        <div className="lg:col-span-6 flex flex-col justify-between min-h-0 h-full py-0.5">
          <div className="flex flex-col justify-between h-full space-y-2">
            
            {/* Top Brand Bar with Unified Emerald Leaf Logo */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 18C6 14 9 7 17 4C17 12 12 18 6 18Z"
                      fill="#065f46"
                      stroke="#064e3b"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M10 20C10 16 13 11 19 8C19 14 15 20 10 20Z"
                      fill="#047857"
                      stroke="#065f46"
                      strokeWidth="1.5"
                    />
                    <path d="M6 18L11 13" stroke="#f0fdf4" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-black tracking-tight text-emerald-950 font-heading leading-none">
                    AgriAI
                  </div>
                  <p className="text-[10px] font-bold text-stone-500 tracking-wide mt-0.5">
                    Smart Farming &bull; Better Tomorrow
                  </p>
                </div>
              </div>

              {/* Script Callout: Healthy Farms Healthy Future */}
              <div className="flex items-center gap-1 text-emerald-800 italic font-serif text-xs font-bold bg-white/80 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                <span>Healthy Farms, Healthy Future</span>
                <span className="text-emerald-800">🌱</span>
              </div>
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-stone-900 tracking-tight font-heading leading-tight">
                Smarter Agriculture <span className="text-emerald-800">with AI</span>
              </h1>

              {/* Sub-tagline */}
              <div className="flex items-center gap-1.5 text-stone-800 font-extrabold text-xs tracking-wide my-0.5">
                <span>Connect</span>
                <span className="text-emerald-800 font-black">&bull;</span>
                <span>Learn</span>
                <span className="text-emerald-800 font-black">&bull;</span>
                <span>Grow</span>
              </div>

              {/* Paragraph Description */}
              <p className="text-stone-600 text-[11px] leading-snug line-clamp-2 max-w-xl">
                From soil to market, get AI-powered insights, expert crop growing guidance and a trusted marketplace for a healthier and more sustainable future.
              </p>
            </div>

            {/* Hero Visual Image Card with AI Connected Network Overlay */}
            <div className="relative rounded-xl overflow-hidden shadow-xs border border-emerald-800/30 h-28 sm:h-32 lg:h-36 shrink-0 group">
              <img
                src="https://images.unsplash.com/photo-1592417817098-8f3d69104a49?auto=format&fit=crop&w=900&q=80"
                alt="Farmer in lush agricultural field"
                className="w-full h-full object-cover object-center group-hover:scale-102 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/40 to-transparent" />

              {/* Connected Holographic AI Overlay Badges */}
              <div className="absolute inset-0 p-2.5 flex flex-col justify-between pointer-events-none">
                <div className="flex justify-end">
                  <div className="px-2 py-0.5 rounded-full bg-emerald-900/90 backdrop-blur-md border border-emerald-400/40 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Real-time Vision</span>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-700 backdrop-blur-md border border-white/50 text-white flex items-center justify-center font-black text-[11px] shadow-sm">
                      AI
                    </div>
                    <div className="text-white text-[11px] leading-tight">
                      <div className="font-extrabold">Autonomous Farm Engine</div>
                      <div className="text-emerald-200 text-[9px]">Pest &bull; Soil &bull; Mandi Modeling</div>
                    </div>
                  </div>

                  <div className="px-2 py-0.5 rounded bg-black/50 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono">
                    99.4% Accuracy
                  </div>
                </div>
              </div>
            </div>

            {/* "Our Platform Features" Container in Unified Emerald Palette (Compact 3x3 Grid) */}
            <div className="bg-emerald-50/70 rounded-xl border border-emerald-200 p-2 sm:p-2.5 shadow-2xs flex-1 min-h-0 flex flex-col justify-between">
              <h2 className="text-xs font-black text-emerald-950 font-heading mb-1.5 flex items-center justify-between">
                <span>Our Platform Features</span>
                <span className="text-[10px] text-emerald-800 font-bold font-sans">9 Integrated Services</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {platformFeatures.map((feat, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onNavigateTab(feat.tab)}
                    className="bg-white hover:bg-emerald-50/60 rounded-lg p-1.5 border border-emerald-100 flex items-center gap-1.5 transition shadow-2xs text-left cursor-pointer group"
                    title={`Open ${feat.title}`}
                  >
                    <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                      {feat.icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-[10px] text-stone-900 leading-none truncate group-hover:text-emerald-950">
                        {feat.title}
                      </h3>
                      <p className="text-[8.5px] text-stone-500 leading-none truncate mt-0.5">
                        {feat.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Left Footer - Minimal 1-line in Unified Emerald */}
            <div className="text-[10px] text-stone-500 flex items-center gap-1.5 pt-0.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
              <span>Sustainable Farming | Stronger Communities | A Healthier Planet</span>
            </div>

          </div>
        </div>


        {/* ================= RIGHT COLUMN: CLEAN FLOATING WHITE CARD (1-CLICK DIRECT ACCESS) ================= */}
        <div className="lg:col-span-6 flex flex-col justify-center min-h-0 h-full">
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-lg border border-emerald-200/90 p-4 sm:p-5 lg:p-6 flex flex-col justify-between h-full max-h-full">
            
            {/* Center Brand Header */}
            <div className="text-center pt-0.5">
              {/* AgriAI Unified Emerald Leaves Logo */}
              <div className="inline-flex items-center justify-center mb-1">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shadow-2xs">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 18C6 14 9 7 17 4C17 12 12 18 6 18Z"
                      fill="#065f46"
                      stroke="#064e3b"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M10 20C10 16 13 11 19 8C19 14 15 20 10 20Z"
                      fill="#047857"
                      stroke="#065f46"
                      strokeWidth="1.5"
                    />
                    <path d="M6 18L11 13" stroke="#f0fdf4" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <div className="text-xl sm:text-2xl font-black text-emerald-950 font-heading tracking-tight leading-none">
                AgriAI
              </div>
              <div className="text-[10px] font-bold text-stone-500 tracking-wide mt-0.5">
                Smart Farming &bull; Better Tomorrow
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-heading mt-2">
                Welcome Back!
              </h2>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 mt-0.5">
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>Click any role below to log in with 1-click</span>
              </div>
            </div>

            {/* 4 Role Selection Cards Grid with Exact Identical Dimensions (Same Size as Other) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-2 sm:my-3">
              {roleCards.map((r) => {
                const isSelected = selectedRole === r.id;
                const isLoggingIn = loggingInRole === r.id;

                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleExecuteLogin(r.id)}
                    className={`text-center rounded-xl p-2 sm:p-2.5 border-2 transition-all flex flex-col justify-between h-[142px] sm:h-[148px] relative group cursor-pointer ${
                      isSelected
                        ? 'border-emerald-800 bg-emerald-50/80 shadow-sm ring-2 ring-emerald-800/20'
                        : 'border-stone-200 hover:border-emerald-600 bg-stone-50/50 hover:bg-white hover:shadow-xs'
                    }`}
                    title={`Click to log in immediately as ${r.title}`}
                  >
                    {/* Top 1-Click Badge */}
                    <span className="absolute top-1.5 right-1.5 text-[8.5px] font-black px-1.5 py-0.2 rounded-full bg-amber-400 text-emerald-950 shadow-2xs flex items-center gap-0.5 group-hover:scale-105 transition">
                      <Zap className="w-2 h-2 fill-emerald-950" />
                      <span>1-Click</span>
                    </span>

                    <div className="pt-2 w-full flex flex-col items-center">
                      {/* Role Icon */}
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 transition ${
                        isSelected ? 'bg-emerald-200/90 text-emerald-950 scale-105' : 'bg-emerald-100 text-emerald-800 group-hover:scale-105'
                      }`}>
                        {r.icon}
                      </div>

                      {/* Title */}
                      <h3 className="font-black text-stone-900 text-xs leading-none">
                        {r.title}
                      </h3>

                      {/* Description - Fixed height for identical card size */}
                      <div className="h-8 flex items-center justify-center px-0.5">
                        <p className="text-[8.5px] text-stone-500 leading-tight text-center line-clamp-2">
                          {r.desc}
                        </p>
                      </div>
                    </div>

                    {/* Radio / Checkmark Action Indicator */}
                    <div className="mt-1 pt-1 border-t border-stone-200/60 w-full flex justify-center items-center">
                      {isLoggingIn ? (
                        <span className="text-[9.5px] font-bold text-emerald-800 animate-pulse flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Logging in...</span>
                        </span>
                      ) : isSelected ? (
                        <div className="w-4 h-4 rounded-full bg-emerald-800 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-stone-300 group-hover:border-emerald-800 flex items-center justify-center text-[8px] text-emerald-800 font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Divider: OR */}
            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-black text-stone-400">
                <span className="bg-white px-2.5">OR</span>
              </div>
            </div>

            {/* Primary Action Button: 1-Click Login in Unified Emerald */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleExecuteLogin(selectedRole)}
                className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm shadow-sm hover:shadow transition flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {/* Google G Logo in white circle */}
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-2xs shrink-0">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                    />
                  </svg>
                </div>

                <span>
                  ⚡ 1-Click Login as {roleCards.find((r) => r.id === selectedRole)?.title || 'Farmer'} →
                </span>
              </button>

              {/* Secondary Button: Login with Email or Phone */}
              <button
                type="button"
                onClick={() => setShowEmailPhoneForm(!showEmailPhoneForm)}
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-emerald-50/50 border border-emerald-300 text-emerald-950 font-bold text-[11px] sm:text-xs transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-800" />
                <span>Login with Email or Phone</span>
                <span className="text-[10px] text-stone-500 font-normal">
                  (Demo OTP simulation)
                </span>
              </button>

              {/* Expandable Form if toggled */}
              {showEmailPhoneForm && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleExecuteLogin(selectedRole);
                  }}
                  className="p-2.5 rounded-lg bg-stone-50 border border-emerald-200 space-y-1.5 text-xs animate-fade-in"
                >
                  <input
                    type="text"
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    placeholder="Enter mobile number"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white font-mono text-[11px] focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-1.5 rounded-lg bg-emerald-800 text-white font-bold text-[11px] hover:bg-emerald-900 transition"
                  >
                    Authenticate with Demo OTP (1-Click)
                  </button>
                </form>
              )}
            </div>

            {/* Direct Guest Preview Link */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => onNavigateTab('home')}
                className="text-[11px] font-semibold text-stone-500 hover:text-emerald-900 hover:underline inline-flex items-center gap-1 transition cursor-pointer"
              >
                <span>Or explore platform without signing in</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* Bottom Demo Info Note in Unified Emerald Tint */}
            <div className="pt-2 border-t border-stone-100 flex items-start gap-1.5 text-[9.5px] sm:text-[10px] text-stone-400 leading-tight">
              <Info className="w-3 h-3 text-emerald-800 shrink-0 mt-0.5" />
              <span>
                Front-end demonstration with immediate 1-click role authentication for testing and exploration.
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
