import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Bell,
  BellRing,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Droplets,
  Sprout,
  Plus,
  Send,
  MessageSquare,
  Smartphone,
  ChevronRight,
  ShieldAlert,
  Info,
  CalendarDays,
  Filter,
  Check
} from 'lucide-react';
import { Language, FarmCalendarAlert, CropCalendarPlan } from '../types/nammaraitha';
import { CROP_CALENDAR_PLANS, INITIAL_FARM_ALERTS } from '../data/cropCalendarData';
import { t } from '../utils/translations';

interface CropCalendarProps {
  lang: Language;
}

export const CropCalendar: React.FC<CropCalendarProps> = ({ lang }) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan-ragi');
  const [sowingDate, setSowingDate] = useState<string>(() => {
    // default to 28 days ago so user sees an active middle stage
    const d = new Date();
    d.setDate(d.getDate() - 28);
    return d.toISOString().split('T')[0];
  });

  const [alerts, setAlerts] = useState<FarmCalendarAlert[]>(INITIAL_FARM_ALERTS);
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'urgent' | 'pending' | 'completed'>('all');
  const [isAddAlertOpen, setIsAddAlertOpen] = useState(false);

  // New Alert Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCrop, setNewCrop] = useState('Ragi');
  const [newDate, setNewDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [newType, setNewType] = useState<FarmCalendarAlert['type']>('fertilizer');
  const [newSeverity, setNewSeverity] = useState<FarmCalendarAlert['severity']>('urgent');
  const [newSms, setNewSms] = useState(true);
  const [newWhatsapp, setNewWhatsapp] = useState(true);

  // Toast notification for simulated alert test
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calculate current crop day count
  const currentDaysAfterSowing = useMemo(() => {
    const start = new Date(sowingDate).getTime();
    const now = new Date().getTime();
    const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }, [sowingDate]);

  const activePlan: CropCalendarPlan = useMemo(() => {
    return CROP_CALENDAR_PLANS.find((p) => p.id === selectedPlanId) || CROP_CALENDAR_PLANS[0];
  }, [selectedPlanId]);

  // Current stage matching daysAfterSowing
  const currentStage = useMemo(() => {
    return (
      activePlan.stages.find(
        (st) => currentDaysAfterSowing >= st.dayStart && currentDaysAfterSowing <= st.dayEnd
      ) || activePlan.stages[activePlan.stages.length - 1]
    );
  }, [activePlan, currentDaysAfterSowing]);

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (filterSeverity === 'urgent') return a.severity === 'urgent' && !a.completed;
      if (filterSeverity === 'pending') return !a.completed;
      if (filterSeverity === 'completed') return a.completed;
      return true;
    });
  }, [alerts, filterSeverity]);

  const toggleAlertCompleted = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const alertItem: FarmCalendarAlert = {
      id: `alert-${Date.now()}`,
      cropName: newCrop,
      cropNameKn: newCrop,
      title: newTitle,
      titleKn: newTitle,
      description: `Scheduled farmer activity for ${newCrop} on ${newDate}`,
      descriptionKn: `${newCrop} ಬೆಳೆಯ ನಿಗದಿತ ಕೃಷಿ ಕಾರ್ಯಕ್ರಮ`,
      dueDate: newDate,
      type: newType,
      severity: newSeverity,
      completed: false,
      notifySms: newSms,
      notifyWhatsapp: newWhatsapp,
    };

    setAlerts([alertItem, ...alerts]);
    setIsAddAlertOpen(false);
    setNewTitle('');

    // Trigger test feedback
    showNotificationToast(
      lang === 'kn'
        ? `ಹೊಸ ಎಚ್ಚರಿಕೆ ನಿಗದಿಯಾಗಿದೆ: "${alertItem.title}". SMS/WhatsApp ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ.`
        : `New farm alert scheduled: "${alertItem.title}". SMS/WhatsApp dispatch enabled.`
    );
  };

  const showNotificationToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const simulateSendAlert = (alert: FarmCalendarAlert) => {
    const text =
      lang === 'kn'
        ? `[ನಮ್ಮ ರೈತ ಸಂದೇಶ] ಎಚ್ಚರಿಕೆ: ${alert.titleKn || alert.title}. ನಿಗದಿತ ದಿನ: ${alert.dueDate}. ವಿವರ: ${alert.descriptionKn || alert.description}`
        : `[Namma Raitha Alert] Reminder: ${alert.title}. Due date: ${alert.dueDate}. Action: ${alert.description}`;

    showNotificationToast(text);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Toast Notification Simulation */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-stone-900 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-start gap-3 animate-slideUp">
          <div className="p-2 rounded-xl bg-emerald-700 text-white shrink-0 mt-0.5">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-1">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <span>{lang === 'kn' ? 'ಲೈವ್ SMS / WhatsApp ಸಂದೇಶ' : 'Live SMS Alert Dispatched'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-stone-300 leading-relaxed">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <CalendarDays className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur border border-emerald-400/20">
            <Calendar className="w-3.5 h-3.5" />
            <span>{lang === 'kn' ? 'ಬೆಳೆ ದಿನದರ್ಶಿ & ಸಮಯೋಚಿತ ಎಚ್ಚರಿಕೆಗಳು' : 'Stage-by-Stage Crop Calendar & Advisory Alerts'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading">
            {lang === 'kn' ? 'ಬೆಳೆ ದಿನದರ್ಶಿ ಎಚ್ಚರಿಕೆಗಳು (Crop Calendar)' : 'Crop Calendar & Stage Alerts'}
          </h1>

          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
            {lang === 'kn'
              ? 'ಬಿತ್ತನೆಯ ದಿನಾಂಕವನ್ನು ಆಧರಿಸಿ ಪ್ರತಿಯೊಂದು ಹಂತದಲ್ಲೂ ನೀರಾವರಿ, ರಸಗೊಬ್ಬರ ಮೇಲುಗೊಬ್ಬರ, ಮತ್ತು ಕೀಟ ನಿಯಂತ್ರಣದ ನಿಖರ SMS ಮತ್ತು WhatsApp ಎಚ್ಚರಿಕೆಗಳನ್ನು ಸ್ವೀಕರಿಸಿ.'
              : 'Track crop growth milestones day-by-day. Receive automated WhatsApp & SMS alerts for timely fertilization, irrigation schedules, and pest surveillance.'}
          </p>

          {/* Quick Selectors for Crop and Sowing Date */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <div className="bg-emerald-950/70 p-1.5 rounded-2xl border border-emerald-700/60 flex items-center gap-2">
              <span className="text-xs text-emerald-300 font-semibold pl-2">
                {lang === 'kn' ? 'ಬೆಳೆ:' : 'Crop:'}
              </span>
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="bg-emerald-900 text-white text-xs font-bold rounded-xl px-3 py-1.5 border border-emerald-600 outline-none"
              >
                {CROP_CALENDAR_PLANS.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {lang === 'kn' ? plan.cropNameKn : plan.cropName}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-emerald-950/70 p-1.5 rounded-2xl border border-emerald-700/60 flex items-center gap-2">
              <span className="text-xs text-emerald-300 font-semibold pl-2">
                {lang === 'kn' ? 'ಬಿತ್ತನೆ ದಿನಾಂಕ:' : 'Sowing Date:'}
              </span>
              <input
                type="date"
                value={sowingDate}
                onChange={(e) => setSowingDate(e.target.value)}
                className="bg-emerald-900 text-white text-xs font-bold rounded-xl px-3 py-1.5 border border-emerald-600 outline-none"
              />
            </div>

            <div className="px-3.5 py-1.5 rounded-2xl bg-amber-400 text-emerald-950 font-black text-xs flex items-center gap-1.5 shadow-sm">
              <Sprout className="w-3.5 h-3.5" />
              <span>{lang === 'kn' ? `ಬಿತ್ತನೆಯಾಗಿ ${currentDaysAfterSowing} ದಿನಗಳು` : `Day ${currentDaysAfterSowing} After Sowing`}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Stage Timeline & Right Active Farm Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Growth Stages Timeline (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h2 className="font-bold text-stone-900 text-lg flex items-center gap-2 font-heading">
                  <Clock className="w-5 h-5 text-emerald-700" />
                  <span>
                    {lang === 'kn' ? activePlan.cropNameKn : activePlan.cropName} - {lang === 'kn' ? 'ಬೆಳೆ ಹಂತಗಳ ಕಾಲಮಿತಿ' : 'Growth Stages Timeline'}
                  </span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Total duration: {activePlan.durationDays} days • Season: {activePlan.season}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Current Stage</span>
                <span className="text-xs font-black text-emerald-800 line-clamp-1 max-w-[140px]">
                  {currentStage.stageName.split('(')[0]}
                </span>
              </div>
            </div>

            {/* Stages Vertical Step Progression */}
            <div className="space-y-4">
              {activePlan.stages.map((stage, idx) => {
                const isCurrent = currentDaysAfterSowing >= stage.dayStart && currentDaysAfterSowing <= stage.dayEnd;
                const isPast = currentDaysAfterSowing > stage.dayEnd;

                return (
                  <div
                    key={stage.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'border-2 border-emerald-600 bg-emerald-50/60 shadow-md ring-2 ring-emerald-500/20'
                        : isPast
                        ? 'border-stone-200 bg-stone-50/70 opacity-90'
                        : 'border-stone-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isCurrent
                              ? 'bg-emerald-700 text-white shadow-sm'
                              : isPast
                              ? 'bg-stone-300 text-stone-700'
                              : 'bg-stone-100 text-stone-500'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                            <span>{lang === 'kn' ? stage.stageNameKn : stage.stageName}</span>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                                Current
                              </span>
                            )}
                          </h3>
                          <div className="text-[11px] text-stone-500 mt-0.5">
                            Day {stage.dayStart} - Day {stage.dayEnd} ({stage.dayEnd - stage.dayStart} days duration)
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[10px] text-stone-400 font-bold uppercase">Water Need</div>
                        <span
                          className={`text-xs font-bold ${
                            stage.waterNeed === 'Critical'
                              ? 'text-red-700'
                              : stage.waterNeed === 'High'
                              ? 'text-blue-700'
                              : 'text-stone-700'
                          }`}
                        >
                          {stage.waterNeed}
                        </span>
                      </div>
                    </div>

                    {/* Stage details */}
                    <div className="mt-3.5 pt-3 border-t border-stone-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-2.5 rounded-xl bg-white border border-stone-200/70">
                        <span className="font-bold text-stone-800 text-[11px] flex items-center gap-1.5 text-emerald-800 mb-1">
                          <Droplets className="w-3.5 h-3.5" />
                          <span>{lang === 'kn' ? 'ಗೊಬ್ಬರ & ಪೋಷಕಾಂಶ' : 'Fertilizer & Nutrition'}</span>
                        </span>
                        <p className="text-[11px] text-stone-600 leading-relaxed">
                          {lang === 'kn' ? stage.fertilizerActionKn : stage.fertilizerAction}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-stone-200/70">
                        <span className="font-bold text-stone-800 text-[11px] flex items-center gap-1.5 text-amber-800 mb-1">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>{lang === 'kn' ? 'ಕೀಟ & ರೋಗ ನಿಗಾ' : 'Pest & Disease Watch'}</span>
                        </span>
                        <p className="text-[11px] text-stone-600 leading-relaxed">
                          {lang === 'kn' ? stage.pestWatchKn : stage.pestWatch}
                        </p>
                      </div>
                    </div>

                    {/* Critical Advisory Banner */}
                    <div
                      className={`mt-3 p-3 rounded-xl text-xs flex items-start gap-2 ${
                        stage.isUrgent
                          ? 'bg-amber-100/90 text-amber-950 border border-amber-300 font-medium'
                          : 'bg-emerald-100/60 text-emerald-950 border border-emerald-200'
                      }`}
                    >
                      <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${stage.isUrgent ? 'text-amber-700' : 'text-emerald-700'}`} />
                      <span className="leading-snug">
                        {lang === 'kn' ? stage.advisoryAlertKn : stage.advisoryAlert}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Calendar Alerts & Reminder Manager (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h2 className="font-bold text-stone-900 text-lg flex items-center gap-2 font-heading">
                  <BellRing className="w-5 h-5 text-emerald-700" />
                  <span>{lang === 'kn' ? 'ಸಕ್ರಿಯ ಬೆಳೆ ಎಚ್ಚರಿಕೆಗಳು' : 'Active Farm Reminders'}</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  {lang === 'kn' ? 'ನಿಮ್ಮ ಮೊಬೈಲ್‌ಗೆ ಕಳುಹಿಸಲಾಗುವ SMS & WhatsApp ಸಂದೇಶಗಳು' : 'Automated SMS & WhatsApp task dispatches'}
                </p>
              </div>

              <button
                onClick={() => setIsAddAlertOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'kn' ? 'ಹೊಸ ಎಚ್ಚರಿಕೆ' : 'New Task'}</span>
              </button>
            </div>

            {/* Filter segments */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl text-xs">
              <button
                onClick={() => setFilterSeverity('all')}
                className={`flex-1 py-1 px-2 rounded-lg font-bold transition ${
                  filterSeverity === 'all' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {lang === 'kn' ? 'ಎಲ್ಲವೂ' : 'All'} ({alerts.length})
              </button>
              <button
                onClick={() => setFilterSeverity('urgent')}
                className={`flex-1 py-1 px-2 rounded-lg font-bold transition ${
                  filterSeverity === 'urgent' ? 'bg-white text-red-700 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {lang === 'kn' ? 'ತುರ್ತು' : 'Urgent'}
              </button>
              <button
                onClick={() => setFilterSeverity('pending')}
                className={`flex-1 py-1 px-2 rounded-lg font-bold transition ${
                  filterSeverity === 'pending' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {lang === 'kn' ? 'ಬಾಕಿ' : 'Pending'}
              </button>
              <button
                onClick={() => setFilterSeverity('completed')}
                className={`flex-1 py-1 px-2 rounded-lg font-bold transition ${
                  filterSeverity === 'completed' ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {lang === 'kn' ? 'ಮುಗಿದಿದೆ' : 'Done'}
              </button>
            </div>

            {/* Alerts List */}
            <div className="space-y-3">
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-xs">
                  {lang === 'kn' ? 'ಯಾವುದೇ ಎಚ್ಚರಿಕೆಗಳು ಲಭ್ಯವಿಲ್ಲ.' : 'No alerts in this category.'}
                </div>
              ) : (
                filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      alert.completed
                        ? 'border-stone-200 bg-stone-50/60 opacity-60'
                        : alert.severity === 'urgent'
                        ? 'border-red-200 bg-red-50/40'
                        : 'border-stone-200 bg-white hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <button
                          onClick={() => toggleAlertCompleted(alert.id)}
                          className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition ${
                            alert.completed
                              ? 'bg-emerald-600 text-white'
                              : 'border-2 border-stone-300 hover:border-emerald-600'
                          }`}
                          title="Mark complete"
                        >
                          {alert.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-extrabold text-stone-900 text-xs">
                              {lang === 'kn' ? alert.titleKn : alert.title}
                            </span>
                            {alert.severity === 'urgent' && (
                              <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-red-100 text-red-800">
                                Urgent
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                            {lang === 'kn' ? alert.descriptionKn : alert.description}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2 text-stone-500">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>Due: {alert.dueDate}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {alert.notifySms && (
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5" title="SMS Enabled">
                            <Smartphone className="w-3 h-3" /> SMS
                          </span>
                        )}
                        {alert.notifyWhatsapp && (
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5" title="WhatsApp Enabled">
                            <MessageSquare className="w-3 h-3" /> WA
                          </span>
                        )}
                        <button
                          onClick={() => simulateSendAlert(alert)}
                          className="px-2 py-0.5 rounded bg-stone-100 hover:bg-emerald-700 hover:text-white text-stone-700 text-[10px] font-bold transition flex items-center gap-1"
                          title="Simulate SMS dispatch"
                        >
                          <Send className="w-2.5 h-2.5" />
                          <span>Test</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add New Custom Farm Alert */}
      {isAddAlertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-base font-heading">
                {lang === 'kn' ? 'ಹೊಸ ಬೆಳೆ ಕಾರ್ಯಕ್ರಮ ನಿಗದಿಪಡಿಸಿ' : 'Schedule New Farm Alert'}
              </h3>
              <button
                onClick={() => setIsAddAlertOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAlert} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  {lang === 'kn' ? 'ಕಾರ್ಯಕ್ರಮದ ಶೀರ್ಷಿಕೆ *' : 'Alert / Task Title *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Second dose Urea application, Weeding"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 text-xs focus:ring-2 focus:ring-emerald-700 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    {lang === 'kn' ? 'ಬೆಳೆ' : 'Crop'}
                  </label>
                  <select
                    value={newCrop}
                    onChange={(e) => setNewCrop(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 text-xs bg-white outline-none"
                  >
                    <option value="Ragi">Ragi (ರಾಗಿ)</option>
                    <option value="Paddy / Rice">Paddy / Rice (ಭತ್ತ)</option>
                    <option value="Tomato">Tomato (ಟೊಮೇಟೊ)</option>
                    <option value="Cotton">Cotton (ಹತ್ತಿ)</option>
                    <option value="Maize">Maize (ಮೆಕ್ಕೆಜೋಳ)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    {lang === 'kn' ? 'ದಿನಾಂಕ' : 'Due Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    {lang === 'kn' ? 'ಪ್ರಕಾರ' : 'Activity Type'}
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 text-xs bg-white outline-none"
                  >
                    <option value="fertilizer">Fertilizer (ಗೊಬ್ಬರ)</option>
                    <option value="irrigation">Irrigation (ನೀರಾವರಿ)</option>
                    <option value="pest_spray">Pest Spray (ಸಿಂಪರಣೆ)</option>
                    <option value="weeding">Weeding (ಕಳೆ ಕೀಳುವಿಕೆ)</option>
                    <option value="harvest">Harvest (ಕೊಯ್ಲು)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    {lang === 'kn' ? 'ತುರ್ತು ಮಟ್ಟ' : 'Priority'}
                  </label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 text-xs bg-white outline-none"
                  >
                    <option value="urgent">Urgent (ತುರ್ತು)</option>
                    <option value="warning">Warning (ಎಚ್ಚರಿಕೆ)</option>
                    <option value="info">Normal (ಸಾಮಾನ್ಯ)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <span className="font-bold text-stone-800 block text-[11px]">
                  {lang === 'kn' ? 'ಸಂದೇಶ ಕಳುಹಿಸುವ ವಿಧಾನ' : 'Notification Channels'}
                </span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newSms}
                      onChange={(e) => setNewSms(e.target.checked)}
                      className="accent-emerald-700"
                    />
                    <span>SMS Alert</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newWhatsapp}
                      onChange={(e) => setNewWhatsapp(e.target.checked)}
                      className="accent-emerald-700"
                    />
                    <span>WhatsApp Alert</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddAlertOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                >
                  Schedule Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
