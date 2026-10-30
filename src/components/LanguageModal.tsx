import React from 'react';
import { X, Check, Globe, Sparkles } from 'lucide-react';
import { Language } from '../types/nammaraitha';
import { LANGUAGES, t } from '../utils/translations';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onSelectLang,
}) => {
  if (!isOpen) return null;

  const englishLang = LANGUAGES[0]; // Top most is English
  const regionalLanguages = LANGUAGES.slice(1); // 22 official Eighth Schedule languages (1 to 22)

  const handleSelect = (code: Language) => {
    onSelectLang(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-700/60 border border-emerald-500/30 text-amber-300">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold flex items-center gap-2 font-heading">
                <span>{t('selectLanguage', currentLang)}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-700/80 font-normal text-emerald-200 border border-emerald-600/40">
                  23 Languages
                </span>
              </h2>
              <p className="text-xs text-emerald-200">
                English &bull; 22 Constitutional Scheduled Languages of India
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-emerald-300 hover:text-white hover:bg-emerald-700/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Grid */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Top Most: English */}
          <div>
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Default / Primary Language</span>
            </div>
            <button
              onClick={() => handleSelect(englishLang.code)}
              className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between ${
                currentLang === englishLang.code
                  ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                  : 'bg-stone-50 hover:bg-emerald-50/50 border-stone-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  EN
                </div>
                <div>
                  <div className="font-extrabold text-sm text-stone-900 flex items-center gap-2">
                    <span>{englishLang.name}</span>
                    <span className="text-xs px-2 py-0.2 rounded bg-amber-100 text-amber-900 font-semibold border border-amber-200">
                      Top Most
                    </span>
                  </div>
                  <div className="text-xs text-stone-500">{englishLang.nativeName}</div>
                </div>
              </div>

              {currentLang === englishLang.code && (
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </button>
          </div>

          {/* 22 Scheduled Indian Languages */}
          <div>
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
              22 Official Eighth Schedule Languages (1 to 22)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {regionalLanguages.map((langItem, index) => {
                const isSelected = currentLang === langItem.code;
                const originalIndex = index + 1;

                return (
                  <button
                    key={langItem.code}
                    onClick={() => handleSelect(langItem.code)}
                    className={`p-3 rounded-2xl border text-left transition flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                        : 'bg-white hover:bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xs font-mono font-bold text-stone-400 w-5 shrink-0">
                        {originalIndex}.
                      </span>
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-stone-900 truncate flex items-center gap-1.5">
                          <span className="truncate">{langItem.nativeName}</span>
                        </div>
                        <div className="text-xs text-stone-500 truncate">
                          {langItem.name}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <span>Active: <strong>{LANGUAGES.find(l => l.code === currentLang)?.name}</strong> ({LANGUAGES.find(l => l.code === currentLang)?.nativeName})</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
