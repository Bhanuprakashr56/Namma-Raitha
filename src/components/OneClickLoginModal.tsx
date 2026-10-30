import React, { useState } from 'react';
import {
  X,
  Check,
  ShieldCheck,
  Building2,
  Handshake,
  Sprout,
  User,
  LogIn,
  LogOut,
  ArrowRight,
  BadgeCheck,
  MapPin,
  Phone,
  Mail,
  Zap,
  CheckCircle2,
  Sparkles,
  Award
} from 'lucide-react';
import { AuthUser, UserRole, Language } from '../types/nammaraitha';
import { PRESET_AUTH_USERS } from '../data/mockData';

interface OneClickLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onSelectRole: (role: UserRole) => void;
  onLogout: () => void;
  lang: Language;
}

export const OneClickLoginModal: React.FC<OneClickLoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectRole,
  onLogout,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'oneClick' | 'custom'>('oneClick');
  const [customPhone, setCustomPhone] = useState('');
  const [customRole, setCustomRole] = useState<UserRole>('farmer');
  const [customName, setCustomName] = useState('');
  const [justSwitched, setJustSwitched] = useState<UserRole | null>(null);

  if (!isOpen) return null;

  const handle1ClickLogin = (role: UserRole) => {
    setJustSwitched(role);
    onSelectRole(role);
    setTimeout(() => {
      setJustSwitched(null);
      onClose();
    }, 700);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPhone || !customName) return;
    onSelectRole(customRole);
    onClose();
  };

  const rolesData: Array<{
    role: UserRole;
    title: string;
    titleKn: string;
    subtitle: string;
    subtitleKn: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    bgGradient: string;
    borderActive: string;
    badgeBg: string;
    badgeText: string;
    features: string[];
    featuresKn: string[];
  }> = [
    {
      role: 'farmer',
      title: 'Farmer Login',
      titleKn: 'ರೈತ ಲಾಗಿನ್',
      subtitle: 'Small & Progressive Growers',
      subtitleKn: 'ಕೃಷಿಕರು & ಬೆಳೆಗಾರರು',
      icon: Sprout,
      accentColor: 'text-emerald-700',
      bgGradient: 'from-emerald-50 to-teal-50/50',
      borderActive: 'border-emerald-500 ring-2 ring-emerald-400/40',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      features: [
        'Post Produce & Set Farm-Gate Price',
        'Buy Certified Seeds, Fertilizer & Tools',
        'Direct DBT Govt Subsidy Invoices',
        'Free AI Crop Doctor & Mandi Alerts'
      ],
      featuresKn: [
        'ಕೃಷಿ ಉತ್ಪನ್ನ ಮಾರಾಟ & ನೇರ ಬೆಲೆ ನಿಗದಿ',
        'ಪ್ರಮಾಣೀಕೃತ ಬೀಜ, ಗೊಬ್ಬರ & ಉಪಕರಣ ಖರೀದಿ',
        'ನೇರ ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ ಇನ್‌ವಾಯ್ಸ್',
        'ಉಚಿತ ಕೃಷಿ ತಜ್ಞರ ಸಲಹೆ & ಮಾರುಕಟ್ಟೆ ದರ'
      ]
    },
    {
      role: 'company',
      title: 'Company Login',
      titleKn: 'ಕಂಪನಿ ಲಾಗಿನ್',
      subtitle: 'Corporate Buyers & Exporters',
      subtitleKn: 'ಕಾರ್ಪೊರೇಟ್ ಖರೀದಿದಾರರು & ರಫ್ತುದಾರರು',
      icon: Building2,
      accentColor: 'text-blue-700',
      bgGradient: 'from-blue-50 to-indigo-50/50',
      borderActive: 'border-blue-500 ring-2 ring-blue-400/40',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-800',
      features: [
        'Wholesale Bulk Procurement Quotes',
        'Verified GSTIN & Traceable Farm KYC',
        'Direct Farm-Gate Pickup Logistics',
        'Automated Purchase Invoices & Tax Credits'
      ],
      featuresKn: [
        'ಸಗಟು ಬೆಳೆ ಖರೀದಿ & ನೇರ ಕೊಟೇಶನ್',
        'ಜಿಎಸ್‌ಟಿ ಪರಿಶೀಲನೆ & ಪಹಣಿ ತಪಾಸಣೆ',
        'ನೇರ ತೋಟದಿಂದ ಸಾಗಾಟ ನಿರ್ವಹಣೆ',
        'ತೆರಿಗೆ ರಶೀದಿ & ಡಿಜಿಟಲ್ ಇನ್‌ವಾಯ್ಸ್'
      ]
    },
    {
      role: 'contract_farming',
      title: 'Contract Farming',
      titleKn: 'ಗುತ್ತಿಗೆ ಕೃಷಿ ಲಾಗಿನ್',
      subtitle: 'FPO & Buyback Sponsors',
      subtitleKn: 'ಖಾತರಿ ಬೆಲೆ & ಎಫ್‌ಪಿಒ ಒಪ್ಪಂದಗಳು',
      icon: Handshake,
      accentColor: 'text-amber-700',
      bgGradient: 'from-amber-50 to-orange-50/50',
      borderActive: 'border-amber-500 ring-2 ring-amber-400/40',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-900',
      features: [
        'Issue Legal Assured MSP Buyback Contracts',
        'Pre-Season Seed & Fertilizer Advances',
        'Milestone-Based Farmer Payment Escrow',
        'Stage-by-Stage Field Crop Monitoring'
      ],
      featuresKn: [
        'ಖಾತರಿ ಬೆಂಬಲ ಬೆಲೆ (MSP) ಒಪ್ಪಂದ ರಚನೆ',
        'ಬಿತ್ತನೆಗೆ ಮುಂಚೆ ಮುಂಗಡ ನೆರವು',
        'ಹಂತ-ಹಂತದ ಡಿಜಿಟಲ್ ಪಾವತಿ ವ್ಯವಸ್ಥೆ',
        'ಬೆಳೆ ಪ್ರಗತಿ & ಕೊಯ್ಲು ನಿಗಾವಣೆ'
      ]
    },
    {
      role: 'admin',
      title: 'Admin Login',
      titleKn: 'ಅಡ್ಮಿನ್ ಲಾಗಿನ್',
      subtitle: 'Karnataka Krishi Directorate',
      subtitleKn: 'ಕೃಷಿ ಇಲಾಖೆ ನಿರ್ವಾಹಕ ನಿಯಂತ್ರಣ',
      icon: ShieldCheck,
      accentColor: 'text-purple-700',
      bgGradient: 'from-purple-50 to-rose-50/50',
      borderActive: 'border-purple-500 ring-2 ring-purple-400/40',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-900',
      features: [
        'Full State Directorate Admin Console',
        'Approve Farmer Pahani & KYC Records',
        'Publish Official APMC Mandi Rates',
        'Broadcast Emergency State Pest/Weather Alerts'
      ],
      featuresKn: [
        'ಕೃಷಿ ಇಲಾಖೆಯ ಪೂರ್ಣ ಅಡ್ಮಿನ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        'ರೈತರ ಪಹಣಿ & ದಾಖಲೆಗಳ ಪರಿಶೀಲನೆ',
        'ಎಪಿಎಂಸಿ ದರಗಳ ನವೀಕರಣ & ಪ್ರಕಟಣೆ',
        'ರಾಜ್ಯಮಟ್ಟದ ತುರ್ತು ಹವಾಮಾನ ಎಸ್‌ಎಂಎಸ್'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-emerald-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-emerald-900/20 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black shadow-md shrink-0">
              <Zap className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800 text-amber-300 text-[11px] font-bold mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Instant 1-Click Access &bull; ಒಂದು ಕ್ಲಿಕ್ ಲಾಗಿನ್</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white">
                {lang === 'kn' ? 'ಖಾತೆಗೆ ಲಾಗಿನ್ / ಪಾತ್ರ ಆಯ್ಕೆಮಾಡಿ' : 'Login & Switch Account'}
              </h2>
              <p className="text-xs text-emerald-200 mt-0.5">
                {lang === 'kn'
                  ? 'ಪಾಸ್‌ವರ್ಡ್ ಇಲ್ಲದೆ ಒಂದೇ ಕ್ಲಿಕ್‌ನಲ್ಲಿ ಸುಲಭವಾಗಿ ಲಾಗಿನ್ ಆಗಿ.'
                  : 'Zero hassle, no password required. Pick any role to log in instantly.'}
              </p>
            </div>
          </div>

          {/* Current User Status Banner if logged in */}
          {currentUser && (
            <div className="mt-4 p-3 rounded-2xl bg-emerald-900/80 border border-emerald-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <span className="text-emerald-300 font-medium">Currently logged in as: </span>
                  <span className="font-bold text-white ml-1">
                    {lang === 'kn' && currentUser.nameKn ? currentUser.nameKn : currentUser.name}
                  </span>
                  <span className="ml-2 uppercase text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-400 text-emerald-950">
                    {currentUser.role.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onLogout();
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-xs transition shadow-sm ml-auto"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{lang === 'kn' ? 'ಲಾಗ್‌ಔಟ್' : 'Logout'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Tab switchers: One-Click vs Custom Mobile */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-5 pt-3 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('oneClick')}
            className={`pb-2.5 px-3 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 ${
              activeTab === 'oneClick'
                ? 'border-emerald-600 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>{lang === 'kn' ? '⚡ 1-ಕ್ಲಿಕ್ ತ್ವರಿತ ಲಾಗಿನ್ (4 ಪಾತ್ರಗಳು)' : '⚡ 1-Click Instant Login (4 Roles)'}</span>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-2.5 px-3 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 ${
              activeTab === 'custom'
                ? 'border-emerald-600 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'kn' ? 'ಮೊಬೈಲ್ ನಂಬರ್ ಮೂಲಕ' : 'Custom Phone / OTP'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'oneClick' ? (
            <div>
              <div className="text-center max-w-lg mx-auto mb-5">
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {lang === 'kn' ? 'ನಿಮ್ಮ ಪ್ರವೇಶ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ' : 'Select your profile below for instant access'}
                </span>
                <p className="text-xs text-stone-500 mt-2">
                  Click any of the 4 accounts to immediately unlock full role permissions, portals, and tailored dashboards.
                </p>
              </div>

              {/* 4 Cards in responsive 2x2 grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rolesData.map((item) => {
                  const Icon = item.icon;
                  const preset = PRESET_AUTH_USERS[item.role];
                  const isCurrent = currentUser?.role === item.role;
                  const isJustSwitched = justSwitched === item.role;

                  return (
                    <div
                      key={item.role}
                      className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all relative overflow-hidden bg-gradient-to-br ${item.bgGradient} ${
                        isCurrent
                          ? `${item.borderActive} shadow-md`
                          : 'border-stone-200 hover:border-emerald-400 hover:shadow-lg'
                      }`}
                    >
                      {/* Top banner / role pill */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-xs ${item.badgeBg} ${item.accentColor}`}>
                              <Icon className="w-5 h-5 stroke-[2.5]" />
                            </div>
                            <div>
                              <h3 className="font-extrabold text-stone-900 text-base leading-snug">
                                {lang === 'kn' ? item.titleKn : item.title}
                              </h3>
                              <p className="text-[11px] text-stone-500 font-medium">
                                {lang === 'kn' ? item.subtitleKn : item.subtitle}
                              </p>
                            </div>
                          </div>

                          {isCurrent && (
                            <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Active</span>
                            </span>
                          )}
                        </div>

                        {/* Persona Profile Card */}
                        <div className="bg-white/90 backdrop-blur-xs rounded-xl p-3 border border-stone-200/80 mb-3 text-xs space-y-1.5 shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-stone-500 text-[11px]">User Name:</span>
                            <span className="font-bold text-stone-900">
                              {lang === 'kn' && preset.nameKn ? preset.nameKn : preset.name}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-stone-500 text-[11px]">Organization:</span>
                            <span className="font-medium text-stone-700 truncate max-w-[180px]">
                              {preset.organization}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-stone-500 text-[11px]">Location:</span>
                            <span className="font-medium text-stone-700 truncate max-w-[180px]">
                              {preset.location}
                            </span>
                          </div>
                        </div>

                        {/* Role Features Bullet List */}
                        <ul className="space-y-1.5 text-xs text-stone-700 mb-4">
                          {(lang === 'kn' ? item.featuresKn : item.features).map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                              <CheckCircle2 className={`w-3.5 h-3.5 ${item.accentColor} shrink-0 mt-0.5`} />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 1-Click Action Button */}
                      <button
                        type="button"
                        onClick={() => handle1ClickLogin(item.role)}
                        disabled={isJustSwitched}
                        className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition-all ${
                          isJustSwitched
                            ? 'bg-emerald-600 text-white scale-98'
                            : isCurrent
                            ? 'bg-stone-900 hover:bg-stone-800 text-white'
                            : 'bg-emerald-800 hover:bg-emerald-700 text-white hover:scale-[1.01]'
                        }`}
                      >
                        {isJustSwitched ? (
                          <>
                            <Check className="w-4 h-4 stroke-[3] animate-bounce" />
                            <span>Switching Role...</span>
                          </>
                        ) : isCurrent ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                            <span>Logged In (Click to Refresh)</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 text-amber-300" />
                            <span>
                              {lang === 'kn'
                                ? `1-ಕ್ಲಿಕ್ ${item.titleKn}`
                                : `⚡ 1-Click Login as ${item.title.replace(' Login', '')}`}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Custom Phone / Mobile OTP Tab */
            <form onSubmit={handleCustomSubmit} className="max-w-md mx-auto space-y-4 py-2">
              <div className="text-center space-y-1 mb-4">
                <h3 className="font-bold text-stone-900 text-base">
                  {lang === 'kn' ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯೊಂದಿಗೆ ಲಾಗಿನ್ ಆಗಿ' : 'Login with Mobile Number'}
                </h3>
                <p className="text-xs text-stone-500">
                  Enter your details to generate your digital farmer or merchant identity.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Name / ಹೆಸರು *
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Basavaraj Patel"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Mobile Number / ಮೊಬೈಲ್ ಸಂಖ್ಯೆ *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-stone-400 text-sm font-semibold">+91</span>
                  <input
                    type="tel"
                    required
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    placeholder="94481 00000"
                    className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Select Role / ಪ್ರವೇಶ ಪಾತ್ರ *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {rolesData.map((r) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => setCustomRole(r.role)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition ${
                        customRole === r.role
                          ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
                          : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <div>{r.title}</div>
                      <div className={`text-[10px] ${customRole === r.role ? 'text-emerald-200' : 'text-stone-400'}`}>
                        {r.titleKn}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm shadow transition flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{lang === 'kn' ? 'ಲಾಗಿನ್ ಮುಂದುವರಿಸಿ' : 'Login Instantly'}</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('oneClick')}
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  &larr; Switch back to 1-Click Fast Logins
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer info note */}
        <div className="bg-stone-100 border-t border-stone-200 px-5 py-3 text-center text-[11px] text-stone-500 shrink-0 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>
            {lang === 'kn'
              ? 'ಕರ್ನಾಟಕ ಕೃಷಿ ಇಲಾಖೆ ಭದ್ರತೆಯೊಂದಿಗೆ ಪ್ರಮಾಣೀಕೃತ ಲಾಗಿನ್ ವ್ಯವಸ್ಥೆ'
              : 'Secured for Karnataka Agriculture Ecosystem • All 4 roles are 1-click testable'}
          </span>
        </div>
      </div>
    </div>
  );
};
