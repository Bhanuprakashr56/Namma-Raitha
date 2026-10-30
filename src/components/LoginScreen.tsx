import React, { useState } from 'react';
import {
  Sprout,
  Building2,
  Handshake,
  ShieldCheck,
  Zap,
  ArrowRight,
  Globe,
  CheckCircle2,
  Phone,
  Sparkles,
  Lock,
  LogIn,
  ChevronDown,
  Check,
  Award,
  Landmark
} from 'lucide-react';
import { UserRole, Language } from '../types/nammaraitha';
import { PRESET_AUTH_USERS } from '../data/mockData';
import { LANGUAGES, getAppTitle, t } from '../utils/translations';

interface LoginScreenProps {
  onSelectRole: (role: UserRole) => void;
  onContinueAsGuest: () => void;
  lang: Language;
  onOpenLanguageModal: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onSelectRole,
  onContinueAsGuest,
  lang,
  onOpenLanguageModal,
}) => {
  const [loggingInRole, setLoggingInRole] = useState<UserRole | null>(null);
  const [activeTab, setActiveTab] = useState<'oneClick' | 'custom'>('oneClick');
  const [customPhone, setCustomPhone] = useState('');
  const [customRole, setCustomRole] = useState<UserRole>('farmer');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVal, setOtpVal] = useState('');

  const currentLangInfo = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  const appTitle = getAppTitle(lang);

  const handle1Click = (role: UserRole) => {
    setLoggingInRole(role);
    setTimeout(() => {
      onSelectRole(role);
      setLoggingInRole(null);
    }, 700);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handle1Click(customRole);
  };

  const roles = [
    {
      role: 'farmer' as UserRole,
      title: 'Farmer Login',
      titleKn: 'ರೈತ ಲಾಗಿನ್',
      tagline: 'Sell Produce & Buy Subsidized Inputs',
      taglineKn: 'ಬೆಳೆ ಮಾರಾಟ & ಸಬ್ಸಿಡಿ ಪರಿಕರಗಳು',
      icon: Sprout,
      bgCard: 'bg-emerald-950/40 hover:bg-emerald-950/60 border-emerald-500/40 hover:border-emerald-400',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      btnGradient: 'from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-emerald-950',
      persona: {
        name: 'Ningappa Gowda',
        nameKn: 'ನಿಂಗಪ್ಪ ಗೌಡ',
        place: 'Pandavapura, Mandya',
        detail: '4.5 Acres • Sugarcane, Ragi & Paddy',
        id: 'KA-MND-4921'
      },
      features: [
        'Direct farm-gate pricing with 0% commission',
        'Certified seeds & fertilizers with 40-50% DBT subsidy',
        '24/7 AI Crop Doctor & daily Mandi rate alerts'
      ],
      featuresKn: [
        'ನೇರ ಬೆಲೆ ನಿಗದಿ & ಶೂನ್ಯ ಕಮಿಷನ್ ಮಾರಾಟ',
        '40-50% ಸಬ್ಸಿಡಿ ದರದಲ್ಲಿ ಪ್ರಮಾಣೀಕೃತ ಬೀಜ & ಗೊಬ್ಬರ',
        'ಉಚಿತ ಎಐ ಬೆಳೆ ವೈದ್ಯ ರೋಗ ಪತ್ತೆ & ಮಾರುಕಟ್ಟೆ ದರ'
      ]
    },
    {
      role: 'company' as UserRole,
      title: 'Company Login',
      titleKn: 'ಕಂಪನಿ ಲಾಗಿನ್',
      tagline: 'Bulk Food Processors & Exporters',
      taglineKn: 'ಸಗಟು ಬೆಳೆ ಖರೀದಿ & ರಫ್ತುದಾರರು',
      icon: Building2,
      bgCard: 'bg-blue-950/40 hover:bg-blue-950/60 border-blue-500/40 hover:border-blue-400',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      btnGradient: 'from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white',
      persona: {
        name: 'ITC Agri Business Division',
        nameKn: 'ಐಟಿಸಿ ಅಗ್ರಿ ಬ್ಯುಸಿನೆಸ್',
        place: 'Bengaluru & Yeshwantpur APMC',
        detail: 'Verified GSTIN • 150 Tons/Month Sourcing',
        id: '29AAACI1681G1ZB'
      },
      features: [
        'Direct farm-gate bulk procurement quotes',
        '100% verified Bhoomi RTC Pahani land records',
        'Automated digital GST tax invoices & logistics'
      ],
      featuresKn: [
        'ರೈತರಿಂದ ನೇರ ಸಗಟು ಬೆಳೆ ಖರೀದಿ ಕೊಟೇಶನ್‌ಗಳು',
        '100% ಪರಿಶೀಲಿಸಿದ ಪಹಣಿ & ಭೂಮಿ ದಾಖಲೆಗಳು',
        'ಡಿಜಿಟಲ್ ಜಿಎಸ್‌ಟಿ ಇನ್‌ವಾಯ್ಸ್ & ಸಾಗಾಟ ನಿರ್ವಹಣೆ'
      ]
    },
    {
      role: 'contract_farming' as UserRole,
      title: 'Contract Farming',
      titleKn: 'ಗುತ್ತಿಗೆ ಕೃಷಿ ಲಾಗಿನ್',
      tagline: 'FPO & Guaranteed MSP Buybacks',
      taglineKn: 'ಖಾತರಿ ಬೆಂಬಲ ಬೆಲೆ (MSP) & ಎಫ್‌ಪಿಒ',
      icon: Handshake,
      bgCard: 'bg-amber-950/40 hover:bg-amber-950/60 border-amber-500/40 hover:border-amber-400',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      btnGradient: 'from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-stone-950',
      persona: {
        name: 'Sahyadri Agri Contracts & FPO',
        nameKn: 'ಸಹ್ಯಾದ್ರಿ ಗುತ್ತಿಗೆ ಕೃಷಿ ಒಕ್ಕೂಟ',
        place: 'Dharwad & Belagavi Agri Cluster',
        detail: '18 Active FPO Agreements • 450+ Farmers',
        id: 'KA-AGRI-FPO-774'
      },
      features: [
        'Issue legal guaranteed Minimum Support Price agreements',
        'Pre-season input advances (seeds & bio-fertilizers)',
        'Milestone-based digital escrow payment releases'
      ],
      featuresKn: [
        'ಖಾತರಿ ಕನಿಷ್ಠ ಬೆಂಬಲ ಬೆಲೆ (MSP) ಒಪ್ಪಂದ ರಚನೆ',
        'ಬಿತ್ತನೆಗೆ ಮುನ್ನ ಮುಂಗಡ ಬೀಜ & ಗೊಬ್ಬರ ನೆರವು',
        'ಹಂತ-ಹಂತದ ಡಿಜಿಟಲ್ ಪಾವತಿ ಬಿಡುಗಡೆ'
      ]
    },
    {
      role: 'admin' as UserRole,
      title: 'Admin Login',
      titleKn: 'ಅಡ್ಮಿನ್ ಲಾಗಿನ್',
      tagline: 'State Agri Directorate Console',
      taglineKn: 'ಕೃಷಿ ಇಲಾಖೆ ನಿರ್ವಾಹಕ ನಿಯಂತ್ರಣ',
      icon: ShieldCheck,
      bgCard: 'bg-purple-950/40 hover:bg-purple-950/60 border-purple-500/40 hover:border-purple-400',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      btnGradient: 'from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white',
      persona: {
        name: 'Pooja Deshmukh, IAS',
        nameKn: 'ಪೂಜಾ ದೇಶ್‌ಮುಖ್, IAS',
        place: 'Krishi Bhavan, Bengaluru',
        detail: 'Joint Director of Agriculture (e-Governance)',
        id: 'ADM-GOVT-KA-001'
      },
      features: [
        'Approve farmer Bhoomi RTC / Pahani records',
        'Audit corporate contract farming MSP compliance',
        'Broadcast statewide emergency weather/pest SMS alerts'
      ],
      featuresKn: [
        'ರೈತರ ಭೂಮಿ ಪಹಣಿ & ದಾಖಲೆಗಳ ಪರಿಶೀಲನೆ',
        'ಕಾರ್ಪೊರೇಟ್ ಗುತ್ತಿಗೆ ಕೃಷಿ ಬೆಂಬಲ ಬೆಲೆ ಲೆಕ್ಕಪರಿಶೋಧನೆ',
        'ರಾಜ್ಯಮಟ್ಟದ ತುರ್ತು ಹವಾಮಾನ ಎಸ್‌ಎಂಎಸ್ ಪ್ರಸಾರ'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-950 to-teal-950 text-white flex flex-col justify-between selection:bg-amber-400 selection:text-emerald-950 font-sans relative overflow-x-hidden">
      {/* Decorative ambient lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar on Login Screen: Brand + Language selector */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-emerald-950 font-black shadow-lg shadow-emerald-500/20">
            <Sprout className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl font-heading text-white">
                {appTitle.main}
              </span>
              <span className="text-amber-300 font-bold text-sm">
                {appTitle.subtitle}
              </span>
            </div>
            <p className="text-[11px] text-emerald-300/80 hidden sm:block">
              {t('appSlogan', lang)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Language Selector */}
          <button
            onClick={onOpenLanguageModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs border border-white/20 shadow-sm transition backdrop-blur-md"
            title="Change Language"
          >
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-bold">{currentLangInfo.name}</span>
            <ChevronDown className="w-3 h-3 text-emerald-300 ml-0.5" />
          </button>

          {/* Quick Skip as Guest */}
          <button
            onClick={onContinueAsGuest}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 hover:text-white font-bold text-xs border border-white/10 transition"
          >
            <span>{lang === 'kn' ? 'ಅತಿಥಿ ಪ್ರವೇಶ' : 'Explore as Guest'} &rarr;</span>
          </button>
        </div>
      </header>

      {/* Main Login Gate Content */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 my-auto relative z-10 space-y-8">
        {/* Hero Title Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-900/80 border border-emerald-400/40 text-amber-300 text-xs font-black shadow-lg shadow-emerald-900/50">
            <Zap className="w-4 h-4 fill-amber-300 text-amber-300 animate-pulse" />
            <span>{lang === 'kn' ? '೧-ಕ್ಲಿಕ್ ಸುಲಭ ಅಧಿಕೃತ ಲಾಗಿನ್' : '1-Click Easy Official Login'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-white leading-tight">
            {lang === 'kn'
              ? 'ನಿಮ್ಮ ಪ್ರವೇಶ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ'
              : 'Select Your Login Portal to Enter'}
          </h1>

          <p className="text-xs sm:text-base text-emerald-200/90 max-w-2xl mx-auto leading-relaxed">
            {lang === 'kn'
              ? 'ಪಾಸ್‌ವರ್ಡ್ ಇಲ್ಲದೆ ಒಂದೇ ಕ್ಲಿಕ್‌ನಲ್ಲಿ ಸುಲಭವಾಗಿ ಲಾಗಿನ್ ಆಗಿ. ರೈತರು, ಕಂಪನಿಗಳು, ಗುತ್ತಿಗೆ ಕೃಷಿ ಸಂಸ್ಥೆಗಳು ಮತ್ತು ಅಡ್ಮಿನ್‌ಗಳಿಗೆ ತಕ್ಷಣದ ಪ್ರವೇಶ.'
              : 'Instant one-click authentication. Zero passwords, zero friction. Click any portal below to enter directly.'}
          </p>

          {/* Switch Tab between 1-Click Fast and Mobile OTP */}
          <div className="inline-flex p-1 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold pt-1">
            <button
              onClick={() => setActiveTab('oneClick')}
              className={`px-4 py-1.5 rounded-xl transition ${
                activeTab === 'oneClick'
                  ? 'bg-amber-400 text-emerald-950 font-black shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              ⚡ 1-Click Fast Login (Recommended)
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-4 py-1.5 rounded-xl transition ${
                activeTab === 'custom'
                  ? 'bg-amber-400 text-emerald-950 font-black shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              📱 Mobile OTP Login
            </button>
          </div>
        </div>

        {activeTab === 'oneClick' ? (
          /* 4 One-Click Big Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {roles.map((item) => {
              const Icon = item.icon;
              const isLoggingIn = loggingInRole === item.role;

              return (
                <div
                  key={item.role}
                  className={`rounded-3xl border p-5 backdrop-blur-md transition-all flex flex-col justify-between relative overflow-hidden group shadow-xl ${item.bgCard}`}
                >
                  <div>
                    {/* Top Pill & Icon */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-white shadow-inner group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6 stroke-[2.5]" />
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${item.badgeBg}`}>
                        Portal
                      </span>
                    </div>

                    <h2 className="text-xl font-black text-white font-heading">
                      {lang === 'kn' ? item.titleKn : item.title}
                    </h2>
                    <p className="text-xs text-stone-300 mt-0.5 font-medium">
                      {lang === 'kn' ? item.taglineKn : item.tagline}
                    </p>

                    {/* Preset Persona Details */}
                    <div className="mt-4 p-3 rounded-2xl bg-black/40 border border-white/10 text-xs space-y-1.5">
                      <div className="text-[11px] text-stone-400 flex items-center justify-between">
                        <span>Profile:</span>
                        <span className="font-mono text-amber-300 text-[10px]">{item.persona.id}</span>
                      </div>
                      <div className="font-extrabold text-white text-sm">
                        {lang === 'kn' ? item.persona.nameKn : item.persona.name}
                      </div>
                      <div className="text-[11px] text-emerald-300 font-medium">
                        {item.persona.place}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {item.persona.detail}
                      </div>
                    </div>

                    {/* Features list */}
                    <ul className="mt-4 space-y-1.5 text-xs text-stone-200">
                      {(lang === 'kn' ? item.featuresKn : item.features).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 1-Click Action Button */}
                  <div className="mt-6 pt-2">
                    <button
                      type="button"
                      onClick={() => handle1Click(item.role)}
                      disabled={isLoggingIn}
                      className={`w-full py-3 px-4 rounded-2xl font-black text-xs sm:text-sm shadow-xl transition-all flex items-center justify-center gap-2 bg-gradient-to-r ${item.btnGradient} hover:scale-[1.02] active:scale-98`}
                    >
                      {isLoggingIn ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3] animate-bounce" />
                          <span>Entering Portal...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 fill-current" />
                          <span>
                            {lang === 'kn'
                              ? `⚡ 1-ಕ್ಲಿಕ್ ${item.titleKn}`
                              : `⚡ 1-Click Login`}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Custom Phone / Mobile Form */
          <div className="max-w-md mx-auto bg-black/50 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-2xl space-y-4">
            <h2 className="text-lg font-black text-white text-center">
              {lang === 'kn' ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯೊಂದಿಗೆ ಲಾಗಿನ್' : 'Login with Mobile Number'}
            </h2>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">
                  Select Role / ಪಾತ್ರ ಆಯ್ಕೆಮಾಡಿ
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => setCustomRole(r.role)}
                      className={`p-2 rounded-xl border text-xs font-bold transition text-left ${
                        customRole === r.role
                          ? 'bg-amber-400 text-emerald-950 border-amber-400'
                          : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                      }`}
                    >
                      <div>{r.title}</div>
                      <div className="text-[10px] opacity-80">{r.titleKn}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">
                  Mobile Number / ಮೊಬೈಲ್ ಸಂಖ್ಯೆ
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-stone-400 text-xs font-bold">+91</span>
                  <input
                    type="tel"
                    required
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    placeholder="94481 22891"
                    className="w-full pl-11 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCustomPhone(PRESET_AUTH_USERS[customRole].phone.replace('+91 ', ''));
                  setOtpSent(true);
                  setOtpVal('8921');
                }}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 font-bold text-[11px] border border-white/10 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-fill Demo Credentials & OTP</span>
              </button>

              {otpSent && (
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    Enter OTP (Sent to mobile)
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={otpVal}
                    onChange={(e) => setOtpVal(e.target.value)}
                    className="w-full py-2 rounded-xl bg-white/20 border border-amber-400 text-white font-mono text-center tracking-widest text-base font-black"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-black text-sm shadow-xl flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Verify & Enter Platform</span>
              </button>
            </form>
          </div>
        )}

        {/* Bottom Guest Link */}
        <div className="text-center pt-2">
          <button
            onClick={onContinueAsGuest}
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300 hover:text-amber-300 transition group"
          >
            <span>{lang === 'kn' ? 'ಲಾಗಿನ್ ಇಲ್ಲದೆ ನೇರವಾಗಿ ಕೃಷಿ ವೇದಿಕೆಯನ್ನು ವೀಕ್ಷಿಸಿ' : 'Want to browse without logging in? Continue as Guest'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </main>

      {/* Footer Credentials & Toll-free helpline */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-400 relative z-10">
        <div className="flex items-center gap-2">
          <Landmark className="w-4 h-4 text-emerald-400" />
          <span>Department of Agriculture &bull; Government of Karnataka</span>
        </div>

        <div className="flex items-center gap-2 text-emerald-300">
          <Phone className="w-3.5 h-3.5 text-amber-400" />
          <span>Kisan Toll-Free Helpline: <strong>1800-180-1551</strong> (23 Languages)</span>
        </div>

        <div className="flex items-center gap-1.5 text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Bhoomi RTC Integrated &bull; 100% Secure</span>
        </div>
      </footer>
    </div>
  );
};
