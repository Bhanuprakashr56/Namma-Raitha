import React, { useState } from 'react';
import {
  Handshake,
  CheckCircle2,
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  FileCheck,
  Send,
  AlertCircle
} from 'lucide-react';
import { ContractItem, Language } from '../types/nammaraitha';
import { CONTRACT_FARMING_ITEMS } from '../data/mockData';
import { t, getCommodityName } from '../utils/translations';

interface ContractFarmingProps {
  lang: Language;
}

export const ContractFarming: React.FC<ContractFarmingProps> = ({ lang }) => {
  const [contracts] = useState<ContractItem[]>(CONTRACT_FARMING_ITEMS);
  const [selectedContract, setSelectedContract] = useState<ContractItem | null>(null);
  const [farmerAcreage, setFarmerAcreage] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerAcreage || !farmerPhone) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedContract(null);
      setFarmerAcreage('');
      setFarmerPhone('');
      alert('Contract Application Registered! The buyer coordinator will contact you directly within 24 hours.');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-500/40 text-amber-300 text-xs font-semibold mb-3">
            <Handshake className="w-3.5 h-3.5" />
            <span>Guaranteed Minimum Support Price & Assured Buyback</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
            {t('contractFarmingTitle', lang)}
          </h2>
          <p className="mt-2 text-emerald-100 text-sm leading-relaxed">
            {t('heroSubtitle', lang)}
          </p>
        </div>
      </div>

      {/* Contracts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contracts.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {c.buyerType}
                </span>
                <span className="text-xs font-semibold text-emerald-700">
                  {c.durationMonths} Mos. Term
                </span>
              </div>

              <h3 className="font-extrabold text-lg text-stone-900 mt-3 leading-snug">
                {lang === 'kn' && c.cropKn ? c.cropKn : getCommodityName(c.crop, lang)}
              </h3>
              <div className="text-xs text-stone-500 font-medium">{c.buyerName}</div>

              <div className="mt-4 p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Offered Guaranteed Rate</span>
                  <span className="font-extrabold text-emerald-800 text-sm">
                    ₹{c.offeredPricePerQuintal.toLocaleString()} / Quintal
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Advance Signing Pay</span>
                  <span className="font-bold text-amber-600">{c.advancePaymentPercent}% Advance</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Target Procurement</span>
                  <span className="font-semibold text-stone-800">{c.requiredQuantityTons} Tons</span>
                </div>
              </div>

              {/* Requirements */}
              <div className="mt-4 space-y-1.5">
                <div className="text-[11px] font-bold text-stone-500 uppercase">Quality Criteria</div>
                {c.requirements.slice(0, 2).map((req, idx) => (
                  <div key={idx} className="text-xs text-stone-600 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-400 flex items-center gap-1 truncate max-w-[150px]">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{c.location}</span>
              </span>
              <button
                onClick={() => setSelectedContract(c)}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
              >
                {t('applyAgreement', lang)}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Contract Application Modal */}
      {selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900">
              Apply for Contract Farming: {selectedContract.crop}
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Buyer: {selectedContract.buyerName} &bull; Offered: ₹{selectedContract.offeredPricePerQuintal}/Quintal
            </p>

            <form onSubmit={handleApply} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Available Farm Land for this Crop (in Acres) *
                </label>
                <input
                  type="number"
                  required
                  step="0.5"
                  min="0.5"
                  value={farmerAcreage}
                  onChange={(e) => setFarmerAcreage(e.target.value)}
                  placeholder="e.g. 3.5 Acres"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Contact Mobile Phone (WhatsApp enabled) *
                </label>
                <input
                  type="tel"
                  required
                  value={farmerPhone}
                  onChange={(e) => setFarmerPhone(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>No Brokerage or Registration Fees</span>
                </div>
                <p className="mt-1 text-[11px] text-emerald-700">
                  You are entering a legally protected tripartite framework governed under the Karnataka Agricultural Produce Marketing regulation.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedContract(null)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitted}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitted ? 'Submitting Application...' : 'Confirm & Send to Buyer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
