import React, { useState, useMemo } from 'react';
import {
  CloudSun,
  TrendingUp,
  TrendingDown,
  Minus,
  Droplets,
  Wind,
  Compass,
  AlertCircle,
  Calendar,
  MapPin,
  RefreshCw,
  Search,
  Filter,
  Layers,
  ArrowUpDown,
  Building,
  Info,
  Bell,
  BellRing,
  Smartphone,
  Zap
} from 'lucide-react';
import { MandiPrice, CommodityCategory, Language, MandiPriceAlert, UserLiveLocation } from '../types/nammaraitha';
import { MANDI_PRICES } from '../data/mockData';
import { DISTRICTS_AGRO_WEATHER } from '../data/weatherData';
import { t, getCommodityName } from '../utils/translations';
import { getLocalizedDistrictName } from '../utils/weatherService';
import { MandiPriceAlertsModal } from './MandiPriceAlertsModal';

interface WeatherMandiProps {
  lang: Language;
  onOpenWeather?: () => void;
  currentLocation?: UserLiveLocation;
  onOpenLocationModal?: () => void;
}

export const WeatherMandi: React.FC<WeatherMandiProps> = ({
  lang,
  onOpenWeather,
  currentLocation,
  onOpenLocationModal,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState(() => currentLocation?.district || 'Mandya');
  const [mandiPrices, setMandiPrices] = useState<MandiPrice[]>(MANDI_PRICES);

  // Sync when currentLocation changes
  React.useEffect(() => {
    if (currentLocation?.district) {
      setSelectedDistrict(currentLocation.district);
    }
  }, [currentLocation?.district]);
  const [selectedCategory, setSelectedCategory] = useState<CommodityCategory | 'all'>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mandi Price Alerts State
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [prefilledCommodityForAlert, setPrefilledCommodityForAlert] = useState<MandiPrice | null>(null);
  const [priceAlerts, setPriceAlerts] = useState<MandiPriceAlert[]>([
    {
      id: 'alert-m1',
      commodity: 'Tomato',
      commodityKn: 'ಟೊಮೇಟೊ',
      mandi: 'Kolar APMC',
      targetPrice: 2000,
      currentPrice: 2200,
      condition: 'above',
      status: 'triggered',
      createdAt: '2026-10-06',
      triggeredAt: '2026-10-08 09:30 AM',
      phone: '9845112345',
      channel: 'both',
      note: 'Selling trigger hit! ₹2,200/qtl reached',
    },
    {
      id: 'alert-m2',
      commodity: 'Onion',
      commodityKn: 'ಈರುಳ್ಳಿ',
      mandi: 'Yeshwanthpur APMC',
      targetPrice: 3000,
      currentPrice: 2650,
      condition: 'above',
      status: 'active',
      createdAt: '2026-10-07',
      phone: '9845112345',
      channel: 'sms',
      note: 'Notify when crosses ₹3,000/qtl',
    },
    {
      id: 'alert-m3',
      commodity: 'Arecanut',
      commodityKn: 'ಅಡಿಕೆ',
      mandi: 'Shivamogga APMC',
      targetPrice: 52000,
      currentPrice: 54500,
      condition: 'above',
      status: 'triggered',
      createdAt: '2026-10-05',
      triggeredAt: '2026-10-08 11:15 AM',
      phone: '9845112345',
      channel: 'both',
      note: 'High demand peak',
    },
  ]);
  const [alertToast, setAlertToast] = useState<string | null>(null);

  const handleAddPriceAlert = (newAlert: Omit<MandiPriceAlert, 'id' | 'createdAt'>) => {
    const alert: MandiPriceAlert = {
      ...newAlert,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPriceAlerts([alert, ...priceAlerts]);
    setAlertToast(
      lang === 'kn'
        ? `ಮಂಡಿ ಬೆಲೆ ಎಚ್ಚರಿಕೆ ನಿಗದಿಯಾಗಿದೆ: ${alert.commodity} @ ₹${alert.targetPrice}/qtl`
        : `Price alert activated for ${alert.commodity} @ ₹${alert.targetPrice}/qtl. Tracking live!`
    );
    setTimeout(() => setAlertToast(null), 4000);
  };

  const handleDeletePriceAlert = (id: string) => {
    setPriceAlerts(priceAlerts.filter((a) => a.id !== id));
  };

  const handleToggleAlertStatus = (id: string) => {
    setPriceAlerts(
      priceAlerts.map((a) =>
        a.id === id ? { ...a, status: a.status === 'active' ? 'triggered' : 'active' } : a
      )
    );
  };

  const handleSimulatePriceSpike = (alertId: string) => {
    const target = priceAlerts.find((a) => a.id === alertId);
    if (!target) return;
    const newPrice = Math.round(target.targetPrice * 1.08);
    setPriceAlerts(
      priceAlerts.map((a) =>
        a.id === alertId
          ? {
              ...a,
              currentPrice: newPrice,
              status: 'triggered',
              triggeredAt: 'Just now',
            }
          : a
      )
    );
    setAlertToast(
      `🚨 [PRICE ALERT TRIGGERED] ${target.commodity} in ${target.mandi} surged to ₹${newPrice}/qtl (Target was ₹${target.targetPrice}). SMS & WhatsApp dispatched!`
    );
    setTimeout(() => setAlertToast(null), 5000);
  };

  const handleOpenAlertForCommodity = (m: MandiPrice) => {
    setPrefilledCommodityForAlert(m);
    setIsAlertsModalOpen(true);
  };

  // Dynamic Pan-India agricultural weather
  const weather = useMemo(() => {
    const d =
      DISTRICTS_AGRO_WEATHER[selectedDistrict] ||
      DISTRICTS_AGRO_WEATHER['New Delhi'] ||
      DISTRICTS_AGRO_WEATHER['Mandya'] ||
      Object.values(DISTRICTS_AGRO_WEATHER)[0];

    return {
      temp: d.temp,
      condition: lang === 'kn' ? d.conditionKn : d.condition,
      rainChance: d.rainChance,
      humidity: d.humidity,
      wind: d.wind,
      advisory: lang === 'kn' ? d.agroAdvisory.spraying.reasonKn : d.agroAdvisory.spraying.reason,
      state: d.state,
      district: d.district,
      districtKn: d.districtKn
    };
  }, [selectedDistrict, lang]);

  // Categories list
  const categories: { id: CommodityCategory | 'all'; label: string; labelKn: string; icon: string }[] = [
    { id: 'all', label: 'All Commodities', labelKn: 'ಎಲ್ಲಾ ಸರಕುಗಳು', icon: '🌟' },
    { id: 'vegetable', label: 'Vegetables', labelKn: 'ತರಕಾರಿಗಳು', icon: '🥕' },
    { id: 'fruit', label: 'Fruits', labelKn: 'ಹಣ್ಣುಗಳು', icon: '🍎' },
    { id: 'pulse', label: 'Pulses & Dals', labelKn: 'ಬೇಳೆಕಾಳುಗಳು', icon: '🫘' },
    { id: 'grain', label: 'Grains & Cash Crops', labelKn: 'ಧಾನ್ಯ & ವಾಣಿಜ್ಯ', icon: '🌾' },
  ];

  // States / Regions list in India
  const statesList = [
    { id: 'all', label: 'All India Mandis', labelKn: 'ಅಖಿಲ ಭಾರತ ಮಂಡಿಗಳು' },
    { id: 'Karnataka', label: 'Karnataka', labelKn: 'ಕರ್ನಾಟಕ' },
    { id: 'Maharashtra', label: 'Maharashtra', labelKn: 'ಮಹಾರಾಷ್ಟ್ರ' },
    { id: 'Delhi', label: 'Delhi NCR', labelKn: 'ದೆಹಲಿ NCR' },
    { id: 'Andhra Pradesh', label: 'Andhra Pradesh', labelKn: 'ಆಂಧ್ರಪ್ರದೇಶ' },
    { id: 'Madhya Pradesh', label: 'Madhya Pradesh', labelKn: 'ಮಧ್ಯಪ್ರದೇಶ' },
    { id: 'Rajasthan', label: 'Rajasthan', labelKn: 'ರಾಜಸ್ಥಾನ' },
    { id: 'Himachal Pradesh', label: 'Himachal Pradesh', labelKn: 'ಹಿಮಾಚಲ ಪ್ರದೇಶ' },
    { id: 'Jammu & Kashmir', label: 'Jammu & Kashmir', labelKn: 'ಜಮ್ಮು & ಕಾಶ್ಮೀರ' },
    { id: 'Uttar Pradesh', label: 'Uttar Pradesh', labelKn: 'ಉತ್ತರ ಪ್ರದೇಶ' },
    { id: 'Gujarat', label: 'Gujarat', labelKn: 'ಗುಜರಾತ್' },
    { id: 'Haryana', label: 'Haryana', labelKn: 'ಹರಿಯಾಣ' },
    { id: 'Punjab', label: 'Punjab', labelKn: 'ಪಂಜಾಬ್' },
    { id: 'Tamil Nadu', label: 'Tamil Nadu', labelKn: 'ತಮಿಳುನಾಡು' },
    { id: 'West Bengal', label: 'West Bengal', labelKn: 'ಪಶ್ಚಿಮ ಬಂಗಾಳ' },
  ];

  // Filtered market prices
  const filteredPrices = useMemo(() => {
    return mandiPrices.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchState = selectedState === 'all' || item.state === selectedState;
      const matchSearch =
        item.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.commodityKn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.state.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchState && matchSearch;
    });
  }, [mandiPrices, selectedCategory, selectedState, searchQuery]);

  const handleRefreshPrices = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setMandiPrices((prev) =>
        prev.map((item) => {
          const delta = (Math.random() - 0.48) * (item.modalPrice * 0.04);
          const newModal = Math.max(100, Math.round(item.modalPrice + delta));
          return {
            ...item,
            modalPrice: newModal,
            minPrice: Math.round(newModal * 0.92),
            maxPrice: Math.round(newModal * 1.08),
            trend: delta > 15 ? 'up' : delta < -15 ? 'down' : 'stable',
            changePercent: Number(((delta / item.modalPrice) * 100).toFixed(1))
          };
        })
      );
      setIsRefreshing(false);
    }, 600);
  };

  const getCategoryBadge = (cat: CommodityCategory) => {
    switch (cat) {
      case 'vegetable':
        return { label: 'Vegetable', labelKn: 'ತರಕಾರಿ', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'fruit':
        return { label: 'Fruit', labelKn: 'ಹಣ್ಣು', color: 'bg-amber-100 text-amber-900 border-amber-200' };
      case 'pulse':
        return { label: 'Pulse / Dal', labelKn: 'ಬೇಳೆಕಾಳು', color: 'bg-orange-100 text-orange-900 border-orange-200' };
      case 'grain':
        return { label: 'Grain / Cash', labelKn: 'ಧಾನ್ಯ/ವಾಣಿಜ್ಯ', color: 'bg-teal-100 text-teal-900 border-teal-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Mandi Market Rates Header Banner */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-700/60">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>{lang === 'kn' ? 'ಲೈವ್ ಎಪಿಎಂಸಿ ದರಗಳು & ಮಾರುಕಟ್ಟೆ ವರದಿ' : 'Live APMC Market Rates & Mandi Intelligence'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1 font-heading">
              {lang === 'kn' ? 'ಮಾರುಕಟ್ಟೆ ದರಗಳು & ಎಪಿಎಂಸಿ ಮಂಡಿ ಬೆಲೆಗಳು' : 'Live Mandi Prices & APMC Market Rates'}
            </h2>
            <p className="text-xs text-emerald-200/90 mt-1 max-w-2xl leading-relaxed">
              {lang === 'kn'
                ? 'ಕರ್ನಾಟಕ ಮತ್ತು ಭಾರತದಾದ್ಯಂತ ಎಪಿಎಂಸಿ ಮಂಡಿ ಸರಕು ದರಗಳು, ದೈನಂದಿನ ಬೆಲೆ ಬದಲಾವಣೆಗಳು ಮತ್ತು ರೈತರಿಗೆ ಬೆಲೆ ಎಚ್ಚರಿಕೆಗಳು.'
                : 'Real-time commodity modal rates, daily APMC fluctuations, arrivals volume, and instant price alerts across Karnataka and All-India.'}
            </p>
          </div>

          {/* Quick Location & Weather Link */}
          <div className="flex flex-wrap items-center gap-2">
            {onOpenLocationModal && (
              <button
                onClick={onOpenLocationModal}
                className="px-3.5 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-md transition hover:scale-105 active:scale-95 flex items-center gap-1.5 shrink-0"
                title="Change or detect live location"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-950" />
                <span>
                  {lang === 'kn'
                    ? (currentLocation?.districtKn || selectedDistrict)
                    : getLocalizedDistrictName(currentLocation?.district || selectedDistrict, 'en')}
                </span>
                {currentLocation?.source === 'gps' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-950 animate-ping" />
                )}
              </button>
            )}

            {onOpenWeather && (
              <button
                onClick={onOpenWeather}
                className="px-3.5 py-2 rounded-2xl bg-emerald-900/90 hover:bg-emerald-800 border border-emerald-600/60 text-white font-bold text-xs shadow-sm transition hover:scale-105 active:scale-95 flex items-center gap-1.5 shrink-0"
                title="Go to Weather Forecast Section"
              >
                <CloudSun className="w-3.5 h-3.5 text-amber-300" />
                <span>{lang === 'kn' ? 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ' : 'Weather Forecast'}</span>
                <span className="text-amber-300">→</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Market Overview Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-emerald-900/60 p-3 rounded-2xl border border-emerald-700/50">
            <span className="text-[11px] text-emerald-300 block font-medium">
              {lang === 'kn' ? 'ಒಟ್ಟು ಸರಕುಗಳು' : 'Tracked Commodities'}
            </span>
            <span className="text-xl font-black text-white mt-0.5 block">
              {mandiPrices.length} Items
            </span>
          </div>

          <div className="bg-emerald-900/60 p-3 rounded-2xl border border-emerald-700/50">
            <span className="text-[11px] text-emerald-300 block font-medium">
              {lang === 'kn' ? 'ದರ ನವೀಕರಣ' : 'Market Updates'}
            </span>
            <span className="text-xl font-black text-amber-300 mt-0.5 block">
              Live APMC
            </span>
          </div>

          <div className="bg-emerald-900/60 p-3 rounded-2xl border border-emerald-700/50">
            <span className="text-[11px] text-emerald-300 block font-medium">
              {lang === 'kn' ? 'ಬೆಲೆ ಎಚ್ಚರಿಕೆಗಳು' : 'Active Price Alerts'}
            </span>
            <span className="text-xl font-black text-white mt-0.5 block">
              {priceAlerts.length} Alerts
            </span>
          </div>

          <div className="bg-emerald-900/60 p-3 rounded-2xl border border-emerald-700/50">
            <span className="text-[11px] text-emerald-300 block font-medium">
              {lang === 'kn' ? 'ಮಂಡಿ ವ್ಯಾಪ್ತಿ' : 'Coverage'}
            </span>
            <span className="text-xl font-black text-white mt-0.5 block">
              All-India Mandis
            </span>
          </div>
        </div>
      </div>

      {/* APMC Market Rates Board with Vegetables, Fruits & Pulses Regional Adjustment */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        {/* Board Header */}
        <div className="p-6 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-extrabold text-stone-900 text-lg font-heading">
                {t('mandiBoardTitle', lang)}
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-1 max-w-2xl">
              {t('mandiTitle', lang)}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setPrefilledCommodityForAlert(null);
                setIsAlertsModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-bold transition shadow-sm border border-amber-300 active:scale-95"
              title="Set and manage Mandi Price Alerts"
            >
              <BellRing className="w-3.5 h-3.5 text-emerald-950" />
              <span>{lang === 'kn' ? 'ದರ ಎಚ್ಚರಿಕೆಗಳು' : 'Price Alerts'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 text-amber-300 text-[10px] font-black">
                {priceAlerts.filter((a) => a.status === 'triggered').length > 0
                  ? `${priceAlerts.filter((a) => a.status === 'triggered').length} Triggered`
                  : priceAlerts.length}
              </span>
            </button>

            <button
              onClick={handleRefreshPrices}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-900 text-xs font-bold transition border border-stone-200"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{t('syncRates', lang)}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 sm:p-5 bg-stone-50/70 border-b border-stone-200 space-y-4">
          {/* Commodity Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition shadow-sm ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-800 text-white ring-2 ring-emerald-800/20'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{t(cat.id === 'all' ? 'allCommodities' : cat.id === 'vegetable' ? 'vegetables' : cat.id === 'fruit' ? 'fruits' : cat.id === 'pulse' ? 'pulses' : 'grains', lang)}</span>
              </button>
            ))}
          </div>

          {/* Location / State Filter & Search */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input (5 cols) */}
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchCommodityPlaceholder', lang)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-sm"
              />
            </div>

            {/* Place / State Selector (5 cols) */}
            <div className="sm:col-span-5 relative">
              <div className="flex items-center bg-white border border-stone-300 rounded-xl px-3 py-1 shadow-sm">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mr-2" />
                <div className="flex-1">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block leading-none">
                    {t('selectStatePlaceholder', lang)}
                  </span>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full bg-transparent text-stone-800 text-xs sm:text-sm font-semibold focus:outline-none cursor-pointer py-1"
                  >
                    {statesList.map((st) => (
                      <option key={st.id} value={st.id}>
                        {lang === 'kn' ? st.labelKn : st.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Active Count Badge (2 cols) */}
            <div className="sm:col-span-2 flex items-center justify-end">
              <span className="px-3 py-2 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 w-full text-center">
                {filteredPrices.length} {t('itemsListedCount', lang)}
              </span>
            </div>
          </div>
        </div>

        {/* Rates Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">{t('thCommodity', lang)}</th>
                <th className="py-3.5 px-4">{t('thCategory', lang)}</th>
                <th className="py-3.5 px-4">{t('thMarketState', lang)}</th>
                <th className="py-3.5 px-4">{t('thModalPrice', lang)}</th>
                <th className="py-3.5 px-4">{t('thAuctionRange', lang)}</th>
                <th className="py-3.5 px-4">{t('thDailyTrend', lang)}</th>
                <th className="py-3.5 px-4 text-right">{t('thArrivals', lang)}</th>
                <th className="py-3.5 px-4 text-center">{lang === 'kn' ? 'ದರ ಎಚ್ಚರಿಕೆ' : 'Price Alert'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredPrices.map((m) => {
                const badge = getCategoryBadge(m.category);
                const pricePerKg = (m.modalPrice / 100).toFixed(1);

                return (
                  <tr key={m.id} className="hover:bg-emerald-50/40 transition">
                    {/* Commodity Name */}
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      <div className="text-sm">
                        {lang === 'kn' && m.commodityKn ? m.commodityKn : getCommodityName(m.commodity, lang)}
                      </div>
                      <div className="text-[11px] text-stone-400 font-normal mt-0.5">
                        {m.unit}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.color}`}
                      >
                        {lang === 'kn' ? badge.labelKn : badge.label}
                      </span>
                    </td>

                    {/* Market & State */}
                    <td className="py-3.5 px-4 text-xs font-medium text-stone-700">
                      <div className="flex items-center gap-1 font-semibold text-stone-900">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{m.market}</span>
                      </div>
                      {m.tradeNote && (
                        <div className="text-[11px] text-stone-400 italic mt-0.5 flex items-center gap-1">
                          <Info className="w-3 h-3 text-stone-400 shrink-0" />
                          <span>{m.tradeNote}</span>
                        </div>
                      )}
                    </td>

                    {/* Modal Price */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-extrabold text-emerald-800 text-base">
                        ₹{m.modalPrice.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-emerald-600 font-semibold">
                        ≈ ₹{pricePerKg} / kg
                      </div>
                    </td>

                    {/* Min - Max Range */}
                    <td className="py-3.5 px-4 text-xs text-stone-500 font-mono">
                      <span className="font-medium text-stone-700">₹{m.minPrice.toLocaleString()}</span>
                      <span className="text-stone-300 mx-1.5">-</span>
                      <span className="font-medium text-stone-700">₹{m.maxPrice.toLocaleString()}</span>
                    </td>

                    {/* Trend */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          m.trend === 'up'
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.trend === 'down'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {m.trend === 'up' ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : m.trend === 'down' ? (
                          <TrendingDown className="w-3.5 h-3.5" />
                        ) : (
                          <Minus className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {m.changePercent > 0 ? `+${m.changePercent}%` : `${m.changePercent}%`}
                        </span>
                      </span>
                    </td>

                    {/* Daily Arrivals */}
                    <td className="py-3.5 px-4 text-right font-mono text-xs text-stone-600">
                      {m.arrivalTons ? (
                        <>
                          <strong className="text-stone-900 font-bold">{m.arrivalTons}</strong> Tons
                        </>
                      ) : (
                        'N/A'
                      )}
                    </td>

                    {/* Set Price Alert Action */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleOpenAlertForCommodity(m)}
                        className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold inline-flex items-center gap-1 transition shadow-xs active:scale-95"
                        title="Set Target Price Trigger & SMS Alert"
                      >
                        <Bell className="w-3 h-3 text-amber-600" />
                        <span>{lang === 'kn' ? 'ಎಚ್ಚರಿಕೆ' : 'Alert'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredPrices.length === 0 && (
          <div className="p-12 text-center text-stone-500 space-y-3">
            <Filter className="w-8 h-8 text-stone-300 mx-auto" />
            <h4 className="font-bold text-stone-700">No market rates found for this filter</h4>
            <p className="text-xs text-stone-400">
              Try selecting &ldquo;All India Mandis&rdquo; or clearing the search query.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedState('all');
                setSearchQuery('');
              }}
              className="px-4 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Regional Note Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              Prices dynamically reflect regional harvesting seasons, interstate freight, and mandi arrivals across India.
            </span>
          </div>
          <span className="font-semibold text-emerald-800">
            Official Agmarknet / APMC Auction Benchmark
          </span>
        </div>
      </div>

      {/* Mandi Price Alerts Modal */}
      <MandiPriceAlertsModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        lang={lang}
        alerts={priceAlerts}
        onAddAlert={handleAddPriceAlert}
        onDeleteAlert={handleDeletePriceAlert}
        onToggleStatus={handleToggleAlertStatus}
        onSimulatePriceSpike={handleSimulatePriceSpike}
        availableCommodities={mandiPrices}
        prefilledCommodity={prefilledCommodityForAlert}
      />

      {/* Floating Alert Toast Notification */}
      {alertToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-stone-900 text-white p-4 rounded-2xl shadow-2xl border border-amber-400/60 flex items-start gap-3 animate-slideUp">
          <div className="p-2 rounded-xl bg-amber-400 text-emerald-950 font-bold shrink-0 mt-0.5">
            <BellRing className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-1">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <span>{lang === 'kn' ? 'ಮಂಡಿ ಬೆಲೆ ಎಚ್ಚರಿಕೆ ರವಾನೆಯಾಗಿದೆ' : 'Mandi Price Alert Update'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-stone-300 leading-relaxed">{alertToast}</p>
          </div>
        </div>
      )}
    </div>
  );
};
