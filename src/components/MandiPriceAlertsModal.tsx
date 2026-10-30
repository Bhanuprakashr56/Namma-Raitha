import React, { useState } from 'react';
import {
  Bell,
  BellRing,
  Smartphone,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Send,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Language, MandiPriceAlert, MandiPrice } from '../types/nammaraitha';
import { t } from '../utils/translations';

interface MandiPriceAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  alerts: MandiPriceAlert[];
  onAddAlert: (newAlert: Omit<MandiPriceAlert, 'id' | 'createdAt'>) => void;
  onDeleteAlert: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onSimulatePriceSpike: (alertId: string) => void;
  availableCommodities?: MandiPrice[];
  prefilledCommodity?: MandiPrice | null;
}

export const MandiPriceAlertsModal: React.FC<MandiPriceAlertsModalProps> = ({
  isOpen,
  onClose,
  lang,
  alerts,
  onAddAlert,
  onDeleteAlert,
  onToggleStatus,
  onSimulatePriceSpike,
  availableCommodities = [],
  prefilledCommodity = null,
}) => {
  const [commodity, setCommodity] = useState<string>(prefilledCommodity ? prefilledCommodity.commodity : 'Onion (ಈರುಳ್ಳಿ)');
  const [mandi, setMandi] = useState<string>(prefilledCommodity ? prefilledCommodity.market : 'Yeshwanthpur (Bangalore)');
  const [targetPrice, setTargetPrice] = useState<number>(prefilledCommodity ? Math.round(prefilledCommodity.modalPrice * 1.15) : 3200);
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [phone, setPhone] = useState<string>('9845012345');
  const [channel, setChannel] = useState<'sms' | 'whatsapp' | 'both'>('both');
  const [isCreating, setIsCreating] = useState(false);

  // Sync when prefilledCommodity changes
  React.useEffect(() => {
    if (prefilledCommodity) {
      setCommodity(prefilledCommodity.commodity);
      setMandi(prefilledCommodity.market);
      setTargetPrice(Math.round(prefilledCommodity.modalPrice * 1.15));
      setIsCreating(true);
    }
  }, [prefilledCommodity]);

  if (!isOpen) return null;

  const currentPriceForSelection = prefilledCommodity?.modalPrice || 2600;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAlert({
      commodity,
      mandi,
      targetPrice,
      currentPrice: currentPriceForSelection,
      condition,
      status: 'active',
      phone,
      channel,
      note: `Target ${condition} ₹${targetPrice}/qtl in ${mandi}`,
    });
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 my-8 animate-fadeIn">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <BellRing className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-lg sm:text-xl font-heading">
                {lang === 'kn' ? 'ಮಂಡಿ ಬೆಲೆ ಎಚ್ಚರಿಕೆಗಳು (Price Alerts)' : 'Mandi Price Alerts & Watchlist'}
              </h3>
              <p className="text-xs text-stone-500">
                {lang === 'kn'
                  ? 'ಬೆಳೆಗಳ ಬೆಲೆ ನೀವು ನಿಗದಿಪಡಿಸಿದ ದರ ತಲುಪಿದಾಗ ಮೊಬೈಲ್‌ಗೆ ತಕ್ಷಣ SMS/WhatsApp ಸಂದೇಶ ಪಡೆಯಿರಿ'
                  : 'Get instant SMS & WhatsApp notifications when APMC prices reach your target'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-stone-700">
            {alerts.length} {lang === 'kn' ? 'ಸಕ್ರಿಯ ಎಚ್ಚರಿಕೆಗಳು' : 'Price Alerts Configured'}
          </div>
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'kn' ? 'ಹೊಸ ದರ ಎಚ್ಚರಿಕೆ ರಚಿಸಿ' : 'Set New Price Alert'}</span>
            </button>
          )}
        </div>

        {/* Create Alert Form */}
        {isCreating && (
          <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4 text-xs animate-fadeIn">
            <div className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-700" />
              <span>{lang === 'kn' ? 'ಹೊಸ ಮಂಡಿ ದರ ಎಚ್ಚರಿಕೆ ನಮೂನೆ' : 'Create Custom Price Trigger'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  {lang === 'kn' ? 'ಬೆಳೆ / ಪದಾರ್ಥ (Commodity)' : 'Commodity'}
                </label>
                <input
                  type="text"
                  required
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 text-xs bg-white outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  {lang === 'kn' ? 'ಮಂಡಿ / ಮಾರುಕಟ್ಟೆ (APMC Mandi)' : 'APMC Mandi / Market'}
                </label>
                <input
                  type="text"
                  required
                  value={mandi}
                  onChange={(e) => setMandi(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 text-xs bg-white outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  {lang === 'kn' ? 'ಷರತ್ತು (Condition)' : 'Trigger Condition'}
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 text-xs bg-white outline-none"
                >
                  <option value="above">Price rises ABOVE target (ದರ ಹೆಚ್ಚಾದಾಗ - ಮಾರಾಟಕ್ಕೆ ಸೂಕ್ತ)</option>
                  <option value="below">Price drops BELOW target (ದರ ಕುಸಿದಾಗ - ಖರೀದಿಗೆ ಸೂಕ್ತ)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  {lang === 'kn' ? 'ಗುರಿ ದರ (Target Price ₹/Quintal) *' : 'Target Price (₹ per Quintal) *'}
                </label>
                <input
                  type="number"
                  required
                  min="100"
                  max="100000"
                  step="50"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 font-mono font-bold text-xs bg-white outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  {lang === 'kn' ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ *' : 'Farmer Mobile Number *'}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 text-xs bg-white outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  {lang === 'kn' ? 'ಸಂದೇಶ ವಿಧಾನ' : 'Delivery Channel'}
                </label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 text-xs bg-white outline-none"
                >
                  <option value="both">Both SMS & WhatsApp</option>
                  <option value="whatsapp">WhatsApp Only</option>
                  <option value="sms">SMS Only</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-1.5 rounded-xl bg-stone-200 text-stone-700 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
              >
                Save Price Alert
              </button>
            </div>
          </form>
        )}

        {/* Existing Alerts List */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {alerts.length === 0 ? (
            <div className="text-center py-10 text-stone-400 text-xs">
              {lang === 'kn' ? 'ಯಾವುದೇ ದರ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಹೊಂದಿಸಲಾಗಿಲ್ಲ.' : 'No mandi price alerts configured yet. Set an alert above!'}
            </div>
          ) : (
            alerts.map((item) => {
              const isTriggered = item.status === 'triggered';
              const priceDiff = item.currentPrice - item.targetPrice;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isTriggered
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-sm'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-stone-900 text-sm">
                          {item.commodity}
                        </span>
                        <span className="text-xs text-stone-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          <span>{item.mandi}</span>
                        </span>

                        {isTriggered ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 animate-pulse">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>TRIGGERED!</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                            Monitoring
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex items-center gap-4 text-xs font-mono">
                        <div>
                          <span className="text-stone-400 text-[10px] block">Current Modal</span>
                          <span className="font-extrabold text-stone-900">₹{item.currentPrice.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 text-[10px] block">Target ({item.condition})</span>
                          <span className="font-extrabold text-emerald-800">₹{item.targetPrice.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 text-[10px] block">Channels</span>
                          <span className="font-bold text-stone-700 capitalize text-[11px]">{item.channel}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onSimulatePriceSpike(item.id)}
                        className="px-2.5 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-black flex items-center gap-1 transition"
                        title="Simulate market price crossing target"
                      >
                        <Zap className="w-3 h-3 text-amber-700" />
                        <span>Simulate Trigger</span>
                      </button>

                      <button
                        onClick={() => onDeleteAlert(item.id)}
                        className="w-7 h-7 rounded-xl bg-stone-100 hover:bg-rose-100 text-stone-400 hover:text-rose-700 flex items-center justify-center transition"
                        title="Delete alert"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {isTriggered && (
                    <div className="mt-3 p-2.5 rounded-xl bg-emerald-100/80 text-emerald-950 text-xs flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                        <span>
                          SMS Dispatched to <strong>{item.phone}</strong>: Market rate hit ₹{item.currentPrice}/qtl.
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 shrink-0">
                        Sell recommendation active
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Supported by Karnataka APMC Agmarknet price feeds</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
