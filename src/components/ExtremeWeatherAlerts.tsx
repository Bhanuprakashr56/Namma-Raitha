import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  BellOff,
  AlertTriangle,
  ShieldAlert,
  Volume2,
  VolumeX,
  X,
  CheckCircle2,
  MapPin,
  Wind,
  CloudRain,
  Flame,
  Zap,
  Snowflake,
  PlayCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Language, DistrictAgroWeather } from '../types/nammaraitha';

export interface ExtremeWeatherEvent {
  id: string;
  type: 'cyclone' | 'storm' | 'heavy_rain' | 'heatwave' | 'frost' | 'high_wind' | 'imd_alert';
  severity: 'critical' | 'severe' | 'warning';
  title: string;
  titleKn: string;
  description: string;
  descriptionKn: string;
  advisory: string;
  advisoryKn: string;
  district: string;
  districtKn?: string;
  state: string;
  metricValue: string;
  timestamp: string;
  source: string;
}

// Request Browser Push Notification Permission
export const requestBrowserPushPermission = async (): Promise<NotificationPermission> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  try {
    const res = await Notification.requestPermission();
    return res;
  } catch (err) {
    console.warn('Browser notification permission error:', err);
    return 'denied';
  }
};

// Fire native browser Push Notification
export const sendBrowserPushNotification = (
  title: string,
  options?: NotificationOptions
): boolean => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
      return true;
    } catch (err) {
      console.warn('Browser push notification delivery error:', err);
      return false;
    }
  }
  return false;
};

// Synthesize pleasant emergency alert chime using Web Audio API (zero latency, no external audio files required)
export const playEmergencyChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Dual-tone urgent alert chime (F5 -> A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(698.46, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.28);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.16);
    gain2.gain.setValueAtTime(0.25, now + 0.16);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.16);
    osc2.stop(now + 0.55);
  } catch (e) {
    // Autoplay policy or unsupported audio
  }
};

// Weather anomaly detection engine based on location telemetry
export function detectExtremeWeather(
  weather: DistrictAgroWeather
): ExtremeWeatherEvent | null {
  if (!weather) return null;

  // 1. IMD Alert Banner if orange or red
  if (weather.alertBanner && (weather.alertBanner.severity === 'red' || weather.alertBanner.severity === 'orange')) {
    return {
      id: `imd-${weather.district}-${Date.now()}`,
      type: 'imd_alert',
      severity: weather.alertBanner.severity === 'red' ? 'critical' : 'severe',
      title: weather.alertBanner.headline,
      titleKn: weather.alertBanner.headlineKn,
      description: weather.alertBanner.details,
      descriptionKn: weather.alertBanner.detailsKn,
      advisory: 'Adhere to official IMD agricultural advisory. Keep livestock in sheltered barns.',
      advisoryKn: 'ಅಧಿಕೃತ ಹವಾಮಾನ ಇಲಾಖೆಯ ಮಾರ್ಗಸೂಚಿಗಳನ್ನು ಪಾಲಿಸಿ. ಜಾನುವಾರುಗಳನ್ನು ಸುರಕ್ಷಿತ ಸ್ಥಳಗಳಲ್ಲಿ ರಕ್ಷಿಸಿ.',
      district: weather.district,
      districtKn: weather.districtKn,
      state: weather.state,
      metricValue: `${weather.alertBanner.severity.toUpperCase()} ALERT`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'India Meteorological Department (IMD)',
    };
  }

  // 2. High Wind / Gale Warning (>= 38 km/h)
  if (weather.wind >= 38) {
    const isCritical = weather.wind >= 50;
    return {
      id: `wind-${weather.district}-${Math.floor(weather.wind / 5)}`,
      type: 'high_wind',
      severity: isCritical ? 'critical' : 'severe',
      title: isCritical ? 'Squall & Gale Wind Emergency' : 'High Wind Hazard Alert for Standing Crops',
      titleKn: isCritical ? 'ತೀವ್ರ ಬಿರುಗಾಳಿ ಮತ್ತು ವೇಗದ ಗಾಳಿ ತುರ್ತು ಎಚ್ಚರಿಕೆ' : 'ಬೆಳೆಗಳಿಗೆ ಹೆಚ್ಚಿನ ಗಾಳಿ ವೇಗದ ಎಚ್ಚರಿಕೆ',
      description: `Sustained winds of ${weather.wind} km/h detected in ${weather.district}. Severe risk of lodging in banana, sugarcane, maize, and areca palms.`,
      descriptionKn: `${weather.districtKn || weather.district} ನಲ್ಲಿ ${weather.wind} km/h ವೇಗದ ಗಾಳಿ ಪತ್ತೆಯಾಗಿದೆ. ಬಾಳೆ, ಕಬ್ಬು ಮತ್ತು ಅಡಿಕೆ ತೋಟಗಳಲ್ಲಿ ಹಾನಿಯ ಸಾಧ್ಯತೆ.`,
      advisory: 'Immediately halt high-pressure foliar spraying. Provide prop supports to fruit bunches.',
      advisoryKn: 'ಔಷಧ ಸಿಂಪಡಣೆ ತಕ್ಷಣ ನಿಲ್ಲಿಸಿ. ಬಾಳೆ ಮರಗಳಿಗೆ ಮತ್ತು ಹಣ್ಣಿನ ಗೊನೆಗಳಿಗೆ ಮುಟ್ಟು ಕೊಟ್ಟು ಆಸರೆ ನೀಡಿ.',
      district: weather.district,
      districtKn: weather.districtKn,
      state: weather.state,
      metricValue: `${weather.wind} km/h Wind`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'Agro-Anemometer Real-Time Telemetry',
    };
  }

  // 3. Heavy Downpour / Flooding (Rainfall >= 40mm or rainChance >= 85% with rain)
  if (weather.rainfall24hMm >= 40 || (weather.rainChance >= 85 && weather.condition.toLowerCase().includes('rain'))) {
    const isCritical = weather.rainfall24hMm >= 70;
    return {
      id: `rain-${weather.district}-${weather.rainfall24hMm}`,
      type: 'heavy_rain',
      severity: isCritical ? 'critical' : 'severe',
      title: isCritical ? 'Torrential Downpour & Flash Flood Warning' : 'Heavy Rainfall & Waterlogging Alert',
      titleKn: isCritical ? 'ಭಾರಿ ಕುಂಭದ್ರೋಣ ಮಳೆ ಮತ್ತು ಪ್ರವಾಹ ಎಚ್ಚರಿಕೆ' : 'ಭಾರಿ ಮಳೆ ಮತ್ತು ಜಲಾವೃತ ಎಚ್ಚರಿಕೆ',
      description: `Intense precipitation detected (${weather.rainfall24hMm > 0 ? weather.rainfall24hMm + ' mm 24h' : weather.rainChance + '% probability'}). Soil saturation threshold exceeded.`,
      descriptionKn: `ತೀವ್ರ ಮಳೆಯ ಸಂಭವ (${weather.rainfall24hMm > 0 ? weather.rainfall24hMm + ' mm ಮಳೆ' : weather.rainChance + '% ಸಂಭವನೀಯತೆ'}). ಹೊಲಗಳಲ್ಲಿ ನೀರು ನಿಲ್ಲುವ ಆತಂಕ.`,
      advisory: 'Clear field drainage channels immediately. Stop broadcasting urea to prevent massive nitrogen runoff.',
      advisoryKn: 'ಹೊಲದ ಬಸಿಗಾಲುವೆಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ. ಯೂರಿಯಾ ಮತ್ತು ರಸಗೊಬ್ಬರ ಉದುರಿಸುವುದನ್ನು ಮುಂದೂಡಿ.',
      district: weather.district,
      districtKn: weather.districtKn,
      state: weather.state,
      metricValue: weather.rainfall24hMm > 0 ? `${weather.rainfall24hMm} mm` : `${weather.rainChance}% Rain`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'Doppler Weather Radar & AWS Telemetry',
    };
  }

  // 4. Thunderstorm & Lightning Hazard
  if (
    weather.condition.toLowerCase().includes('thunder') ||
    weather.condition.toLowerCase().includes('lightning') ||
    weather.condition.toLowerCase().includes('storm')
  ) {
    return {
      id: `storm-${weather.district}`,
      type: 'storm',
      severity: 'severe',
      title: 'Active Thunderstorm & Lightning Warning',
      titleKn: 'ಗುಡುಗು ಸಹಿತ ಮಿಂಚು ಮತ್ತು ಬಿರುಗಾಳಿ ಎಚ್ಚರಿಕೆ',
      description: `Atmospheric convective instability causing lightning strikes and sudden gusts in ${weather.district}.`,
      descriptionKn: `${weather.districtKn || weather.district} ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ಗುಡುಗು ಮಿಂಚಿನ ಅಪಾಯ ಎದುರಾಗಿದೆ.`,
      advisory: 'Suspend open-field harvesting and tractor operations immediately. Do not take shelter under solitary trees.',
      advisoryKn: 'ರೈತರು ಹೊಲದ ಕೆಲಸಗಳನ್ನು ತಕ್ಷಣ ನಿಲ್ಲಿಸಿ ಸುರಕ್ಷಿತ ಕಟ್ಟಡಗಳಲ್ಲಿ ಆಶ್ರಯ ಪಡೆಯಿರಿ. ಮರಗಳ ಕೆಳಗೆ ನಿಲ್ಲಬೇಡಿ.',
      district: weather.district,
      districtKn: weather.districtKn,
      state: weather.state,
      metricValue: 'Thunderstorm',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'Lightning Detection Sensor Network',
    };
  }

  // 5. Extreme Heatwave (>= 38°C)
  if (weather.temp >= 38) {
    const isCritical = weather.temp >= 42;
    return {
      id: `heat-${weather.district}-${Math.floor(weather.temp)}`,
      type: 'heatwave',
      severity: isCritical ? 'critical' : 'severe',
      title: isCritical ? 'Extreme Heatwave Emergency Warning' : 'Agro-Meteorological Heat Stress Alert',
      titleKn: isCritical ? 'ತೀವ್ರ ಬಿಸಿಗಾಳಿ ತುರ್ತು ಎಚ್ಚರಿಕೆ' : 'ಬೆಳೆಗಳಿಗೆ ಶಾಖದ ಒತ್ತಡ ಎಚ್ಚರಿಕೆ',
      description: `Ambient temperature reached ${weather.temp}°C in ${weather.district}. High danger of blossom drop and leaf scorching.`,
      descriptionKn: `${weather.districtKn || weather.district} ನಲ್ಲಿ ತಾಪಮಾನ ${weather.temp}°C ತಲುಪಿದೆ. ಹೂವು ಉದುರುವ ಮತ್ತು ತೇವಾಂಶ ಕೊರತೆ ಅಪಾಯ.`,
      advisory: 'Run micro-sprinklers in early morning. Mulch vegetable ridges with straw to shield root systems.',
      advisoryKn: 'ಮುಂಜಾನೆ ಲಘು ನೀರಾವರಿ ಒದಗಿಸಿ. ತೇವಾಂಶ ಉಳಿಸಲು ಬೆಳೆಗಳ ಬುಡಕ್ಕೆ ಸಾವಯವ ಹೊದಿಕೆ ಹಾಕಿ.',
      district: weather.district,
      districtKn: weather.districtKn,
      state: weather.state,
      metricValue: `${weather.temp}°C Heat`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'Thermal Land Surface Radiometer',
    };
  }

  // 6. Frost / Extreme Cold (<= 5°C)
  if (weather.temp <= 5) {
    return {
      id: `frost-${weather.district}`,
      type: 'frost',
      severity: 'severe',
      title: 'Ground Frost & Chilling Injury Alert',
      titleKn: 'ನೆಲ ಹಿಮ ಮತ್ತು ತೀವ್ರ ಚಳಿ ಎಚ್ಚರಿಕೆ',
      description: `Near-freezing temperature of ${weather.temp}°C in ${weather.district}. Young shoots and vegetable nursery beds vulnerable.`,
      descriptionKn: `${weather.districtKn || weather.district} ನಲ್ಲಿ ${weather.temp}°C ತೀವ್ರ ಚಳಿ ದಾಖಲಾಗಿದೆ. ತರಕಾರಿ ನರ್ಸರಿಗಳಿಗೆ ಹಾನಿ ಸಾಧ್ಯತೆ.`,
      advisory: 'Irrigate field boundaries in late evening to moderate soil temperature. Cover sensitive seedlings with thatch.',
      advisoryKn: 'ಮಣ್ಣಿನ ಉಷ್ಣತೆ ಕಾಪಾಡಲು ಸಂಜೆ ನೀರು ಹಾಯಿಸಿ. ಸಸಿ ಮಡಿಗಳನ್ನು ಪ್ಲಾಸ್ಟಿಕ್ ಶೀಟ್‌ನಿಂದ ಮುಚ್ಚಿ.',
      district: weather.district,
      districtKn: weather.districtKn,
      state: weather.state,
      metricValue: `${weather.temp}°C Cold`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'Micro-Climate Agro-AWS',
    };
  }

  return null;
}

interface ExtremeWeatherProps {
  weather: DistrictAgroWeather;
  lang: Language;
}

export const ExtremeWeatherAlerts: React.FC<ExtremeWeatherProps> = ({ weather, lang }) => {
  // Push notification state
  const [isPushEnabled, setIsPushEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('nammaraitha_extreme_push_enabled');
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('nammaraitha_extreme_sound_enabled');
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const [activeAlert, setActiveAlert] = useState<ExtremeWeatherEvent | null>(null);
  const [alertHistory, setAlertHistory] = useState<ExtremeWeatherEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dismissedAlertIds, setDismissedAlertIds] = useState<Set<string>>(new Set());
  const [lastNotifiedDistrict, setLastNotifiedDistrict] = useState<string>('');

  // Evaluate extreme conditions whenever weather or location updates
  useEffect(() => {
    if (!weather) return;

    const detected = detectExtremeWeather(weather);

    if (detected && !dismissedAlertIds.has(detected.id)) {
      setActiveAlert(detected);
      setAlertHistory((prev) => {
        if (!prev.some((a) => a.id === detected.id)) {
          return [detected, ...prev.slice(0, 9)];
        }
        return prev;
      });

      // Send push notification if enabled and not already sent for this district in this cycle
      if (isPushEnabled && lastNotifiedDistrict !== weather.district) {
        setLastNotifiedDistrict(weather.district);

        if (isSoundEnabled) {
          playEmergencyChime();
        }

        const pushTitle = `🚨 ${lang === 'kn' ? detected.titleKn : detected.title} (${weather.district})`;
        const pushBody = `${lang === 'kn' ? detected.descriptionKn : detected.description}\n👉 ${lang === 'kn' ? detected.advisoryKn : detected.advisory}`;

        sendBrowserPushNotification(pushTitle, {
          body: pushBody,
          tag: `extreme-${weather.district}`,
          requireInteraction: true,
        });
      }
    } else if (!detected) {
      // Clear active alert if conditions normalized
      setActiveAlert(null);
    }
  }, [weather, isPushEnabled, isSoundEnabled, dismissedAlertIds, lastNotifiedDistrict, lang]);

  // Request browser permission
  const handleTogglePush = async () => {
    if (!isPushEnabled) {
      const perm = await requestBrowserPushPermission();
      setBrowserPermission(perm);
      setIsPushEnabled(true);
      try {
        localStorage.setItem('nammaraitha_extreme_push_enabled', 'true');
      } catch {}

      if (perm === 'granted') {
        sendBrowserPushNotification('🔔 Extreme Weather Push Notifications Active', {
          body: `Real-time agricultural storm, heatwave and high-wind alerts armed for ${weather.district}, ${weather.state}.`,
          tag: 'welcome-push',
        });
        if (isSoundEnabled) playEmergencyChime();
      }
    } else {
      setIsPushEnabled(false);
      try {
        localStorage.setItem('nammaraitha_extreme_push_enabled', 'false');
      } catch {}
    }
  };

  const handleToggleSound = () => {
    const next = !isSoundEnabled;
    setIsSoundEnabled(next);
    try {
      localStorage.setItem('nammaraitha_extreme_sound_enabled', JSON.stringify(next));
    } catch {}
    if (next) playEmergencyChime();
  };

  const handleDismissCurrentAlert = () => {
    if (activeAlert) {
      setDismissedAlertIds((prev) => new Set([...prev, activeAlert.id]));
      setActiveAlert(null);
    }
  };

  // Immediate Simulation for demonstration / farmer drills
  const handleSimulateAlert = (type: 'wind' | 'rain' | 'storm' | 'heat') => {
    let mockAlert: ExtremeWeatherEvent;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (type === 'wind') {
      mockAlert = {
        id: `sim-wind-${Date.now()}`,
        type: 'high_wind',
        severity: 'critical',
        title: 'Squall & High-Velocity Gale Alert (Simulated)',
        titleKn: 'ತೀವ್ರ ಬಿರುಗಾಳಿ ಮತ್ತು ವೇಗದ ಗಾಳಿ ಎಚ್ಚರಿಕೆ (ಪರೀಕ್ಷಾರ್ಥ)',
        description: `Severe gale of 54 km/h detected near ${weather.district}. Extreme lodging hazard for banana and areca crops.`,
        descriptionKn: `${weather.districtKn || weather.district} ಬಳಿ 54 km/h ವೇಗದ ಬಿರುಗಾಳಿ ಪತ್ತೆಯಾಗಿದೆ. ಬಾಳೆ ಮತ್ತು ಅಡಿಕೆ ತೋಟಗಳಿಗೆ ಹೆಚ್ಚಿನ ಅಪಾಯ.`,
        advisory: 'Halt all tractor and spraying activities immediately. Tie banana plant props.',
        advisoryKn: 'ಸಿಂಪಡಣೆ ತಕ್ಷಣ ನಿಲ್ಲಿಸಿ. ಬಾಳೆ ಮರಗಳಿಗೆ ಮತ್ತು ಗೊನೆಗಳಿಗೆ ಬಿದಿರಿನ ಮುಟ್ಟು ಕೊಡಿ.',
        district: weather.district,
        districtKn: weather.districtKn,
        state: weather.state,
        metricValue: '54 km/h Gale',
        timestamp: nowTime,
        source: 'Live Push Notification Engine (Drill)',
      };
    } else if (type === 'rain') {
      mockAlert = {
        id: `sim-rain-${Date.now()}`,
        type: 'heavy_rain',
        severity: 'critical',
        title: 'Flash Flood & Torrential Rain Alert (Simulated)',
        titleKn: 'ಭಾರಿ ಕುಂಭದ್ರೋಣ ಮಳೆ ಮತ್ತು ಪ್ರವಾಹ ಎಚ್ಚರಿಕೆ (ಪರೀಕ್ಷಾರ್ಥ)',
        description: `Cloudburst and intense rainfall (78 mm / 24h) radar tracking over ${weather.district}. Field inundation critical.`,
        descriptionKn: `${weather.districtKn || weather.district} ವ್ಯಾಪ್ತಿಯಲ್ಲಿ 78 mm ಭಾರಿ ಮಳೆಯಾಗುವ ಮುನ್ಸೂಚನೆ. ಕೃಷಿ ಭೂಮಿಯಲ್ಲಿ ನೀರು ನಿಲ್ಲುವ ಭೀತಿ.`,
        advisory: 'Open flood release bunds. Protect harvested pulses and grains in high-elevation storage.',
        advisoryKn: 'ಹೊಲದ ಬದುಗಳಲ್ಲಿ ನೀರು ಹರಿದುಹೋಗಲು ದಾರಿ ಮಾಡಿ. ಕಟಾವು ಮಾಡಿದ ಧಾನ್ಯಗಳನ್ನು ಎತ್ತರದ ಪ್ರದೇಶದಲ್ಲಿ ರಕ್ಷಿಸಿ.',
        district: weather.district,
        districtKn: weather.districtKn,
        state: weather.state,
        metricValue: '78 mm / 24h',
        timestamp: nowTime,
        source: 'Live Push Notification Engine (Drill)',
      };
    } else if (type === 'heat') {
      mockAlert = {
        id: `sim-heat-${Date.now()}`,
        type: 'heatwave',
        severity: 'severe',
        title: 'Severe Heatwave Stress Warning (Simulated)',
        titleKn: 'ತೀವ್ರ ಬಿಸಿಗಾಳಿ ತುರ್ತು ಎಚ್ಚರಿಕೆ (ಪರೀಕ್ಷಾರ್ಥ)',
        description: `Scorching temperature (41.5°C) detected over ${weather.district}. High risk of terminal heat stress in vegetables and pulses.`,
        descriptionKn: `${weather.districtKn || weather.district} ನಲ್ಲಿ 41.5°C ತೀವ್ರ ಬಿಸಿಲು ದಾಖಲಾಗಿದೆ. ತರಕಾರಿ ಮತ್ತು ಹೂವಿನ ಬೆಳೆಗಳಿಗೆ ಹಾನಿ.`,
        advisory: 'Schedule night micro-irrigation. Apply protective straw mulching immediately.',
        advisoryKn: 'ರಾತ್ರಿ ಅಥವಾ ಮುಂಜಾನೆ ಹನಿ ನೀರಾವರಿ ಒದಗಿಸಿ. ಬುಡಕ್ಕೆ ಕಳೆ ಒಣಗಿದ ಕಡ್ಡಿಗಳ ಹೊದಿಕೆ ಹಾಕಿ.',
        district: weather.district,
        districtKn: weather.districtKn,
        state: weather.state,
        metricValue: '41.5°C Heatwave',
        timestamp: nowTime,
        source: 'Live Push Notification Engine (Drill)',
      };
    } else {
      mockAlert = {
        id: `sim-storm-${Date.now()}`,
        type: 'storm',
        severity: 'critical',
        title: 'Severe Thunderstorm & Lightning Warning (Simulated)',
        titleKn: 'ಗುಡುಗು ಸಹಿತ ಮಿಂಚು ಮತ್ತು ಬಿರುಗಾಳಿ ತುರ್ತು ಎಚ್ಚರಿಕೆ (ಪರೀಕ್ಷಾರ್ಥ)',
        description: `Rapidly developing cumulonimbus storm cell over ${weather.district} with frequent lightning discharges.`,
        descriptionKn: `${weather.districtKn || weather.district} ಸುತ್ತಮುತ್ತ ಭಾರಿ ಗುಡುಗು ಮಿಂಚಿನ ಬಿರುಗಾಳಿ ಪ್ರಾರಂಭವಾಗಿದೆ.`,
        advisory: 'Immediate shelter protocol: Vacate open fields, disconnect electrical pumps, keep cattle in shed.',
        advisoryKn: 'ರೈತರು ತಕ್ಷಣ ಬಯಲು ಪ್ರದೇಶದಿಂದ ಹೊರಬನ್ನಿ. ನೀರಾವರಿ ಪಂಪ್‌ಸೆಟ್ ಆಫ್ ಮಾಡಿ, ಜಾನುವಾರುಗಳನ್ನು ರಕ್ಷಿಸಿ.',
        district: weather.district,
        districtKn: weather.districtKn,
        state: weather.state,
        metricValue: 'Lightning Storm',
        timestamp: nowTime,
        source: 'Live Push Notification Engine (Drill)',
      };
    }

    setActiveAlert(mockAlert);
    setAlertHistory((prev) => [mockAlert, ...prev.slice(0, 9)]);

    if (isSoundEnabled) {
      playEmergencyChime();
    }

    sendBrowserPushNotification(`🚨 ${lang === 'kn' ? mockAlert.titleKn : mockAlert.title}`, {
      body: `${lang === 'kn' ? mockAlert.descriptionKn : mockAlert.description}\n👉 ${lang === 'kn' ? mockAlert.advisoryKn : mockAlert.advisory}`,
      tag: `sim-${Date.now()}`,
      requireInteraction: true,
    });
  };

  return (
    <>
      {/* 1. Header Trigger Pill / Status Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm border ${
          activeAlert
            ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-400 animate-pulse ring-2 ring-rose-400/50'
            : isPushEnabled
            ? 'bg-emerald-900/90 hover:bg-emerald-800 text-emerald-200 border-emerald-600/60'
            : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300 border-stone-600'
        }`}
        title="Extreme Weather Push Notification Center"
      >
        {activeAlert ? (
          <BellRing className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
        ) : isPushEnabled ? (
          <Bell className="w-3.5 h-3.5 text-amber-300" />
        ) : (
          <BellOff className="w-3.5 h-3.5 text-stone-400" />
        )}
        <span>
          {activeAlert
            ? lang === 'kn'
              ? 'ತುರ್ತು ಎಚ್ಚರಿಕೆ ಸಕ್ರಿಯ!'
              : 'Extreme Alert Active!'
            : isPushEnabled
            ? lang === 'kn'
              ? 'ಪುಶ್ ಎಚ್ಚರಿಕೆಗಳು: ಆನ್'
              : 'Push Alerts: ON'
            : lang === 'kn'
              ? 'ಪುಶ್ ಎಚ್ಚರಿಕೆ ಸಕ್ರಿಯಗೊಳಿಸಿ'
              : 'Enable Push Alerts'}
        </span>
        {activeAlert && (
          <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping ml-0.5" />
        )}
      </button>

      {/* 2. Floating High-Impact In-App Real-Time Alert Banner (When an extreme event is detected) */}
      {activeAlert && (
        <div className="relative z-30 my-4 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-rose-950 via-red-900 to-amber-950 border-2 border-rose-500 text-white shadow-2xl animate-bounce-short">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-600/90 border border-rose-400 text-white flex items-center justify-center shrink-0 shadow-lg animate-pulse">
                {activeAlert.type === 'high_wind' && <Wind className="w-6 h-6" />}
                {activeAlert.type === 'heavy_rain' && <CloudRain className="w-6 h-6" />}
                {activeAlert.type === 'storm' && <Zap className="w-6 h-6 text-amber-300" />}
                {activeAlert.type === 'heatwave' && <Flame className="w-6 h-6 text-amber-300" />}
                {activeAlert.type === 'frost' && <Snowflake className="w-6 h-6 text-sky-200" />}
                {activeAlert.type === 'imd_alert' && <ShieldAlert className="w-6 h-6 text-amber-300" />}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px] tracking-wider uppercase">
                    {activeAlert.severity.toUpperCase()} REAL-TIME WARNING
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded-full border border-amber-400/40">
                    <MapPin className="w-3 h-3" />
                    {lang === 'kn' ? (activeAlert.districtKn || activeAlert.district) : activeAlert.district}, {activeAlert.state}
                  </span>
                  <span className="text-[11px] text-stone-300 font-mono">
                    {activeAlert.timestamp}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black font-heading text-white">
                  {lang === 'kn' ? activeAlert.titleKn : activeAlert.title}
                </h3>

                <p className="text-xs text-rose-100/90 leading-relaxed max-w-3xl">
                  {lang === 'kn' ? activeAlert.descriptionKn : activeAlert.description}
                </p>

                <div className="mt-2.5 p-2.5 rounded-xl bg-black/40 border border-rose-500/40 text-xs text-amber-200 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-300 mr-1.5">
                      {lang === 'kn' ? 'ರೈತರ ತುರ್ತು ರಕ್ಷಣೆ:' : 'Protective Farm Action:'}
                    </strong>
                    {lang === 'kn' ? activeAlert.advisoryKn : activeAlert.advisory}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-center gap-2 shrink-0 self-end sm:self-start">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white text-rose-950 font-black text-xs hover:bg-rose-50 transition shadow-md whitespace-nowrap"
              >
                {lang === 'kn' ? 'ಎಚ್ಚರಿಕೆ ವಿವರಗಳು' : 'Alert Details'}
              </button>
              <button
                onClick={handleDismissCurrentAlert}
                className="px-3 py-1.5 rounded-xl bg-rose-900/80 hover:bg-rose-800 text-rose-200 text-xs font-semibold transition border border-rose-700 whitespace-nowrap"
              >
                {lang === 'kn' ? 'ಮುಚ್ಚಿ' : 'Dismiss'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Extreme Weather Notification Center Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden my-6">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black shadow-md">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg">
                    {lang === 'kn'
                      ? 'ನೈಜ-ಸಮಯದ ಹವಾಮಾನ ತುರ್ತು ಎಚ್ಚರಿಕೆ ಕೇಂದ್ರ'
                      : 'Extreme Weather Real-Time Alert System'}
                  </h3>
                  <p className="text-xs text-emerald-300">
                    Location: {lang === 'kn' ? (weather.districtKn || weather.district) : weather.district}, {weather.state}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Toggles & Permissions */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-stone-900 text-xs sm:text-sm flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-700" />
                      <span>{lang === 'kn' ? 'ಬ್ರೌಸರ್ ಪುಶ್ ಅಧಿಸೂಚನೆಗಳು' : 'Browser Push Notifications'}</span>
                    </span>
                    <p className="text-[11px] text-stone-500">
                      {lang === 'kn'
                        ? 'ತೀವ್ರ ಗಾಳಿ, ಭಾರಿ ಮಳೆ, ಗುಡುಗು ಮತ್ತು ಬಿಸಿಗಾಳಿಯ ಸಂದರ್ಭದಲ್ಲಿ ತಕ್ಷಣವೇ ಪುಶ್ ಸಂದೇಶ ಬರುತ್ತದೆ.'
                        : 'Receive immediate device push alerts if extreme weather is detected in your district.'}
                    </p>
                    <div className="text-[10px] font-mono text-stone-400 mt-1">
                      Browser Status: <strong className={browserPermission === 'granted' ? 'text-emerald-700' : 'text-amber-700'}>{browserPermission.toUpperCase()}</strong>
                    </div>
                  </div>

                  <button
                    onClick={handleTogglePush}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isPushEnabled ? 'bg-emerald-600' : 'bg-stone-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        isPushEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-stone-900 text-xs sm:text-sm flex items-center gap-2">
                      {isSoundEnabled ? <Volume2 className="w-4 h-4 text-emerald-700" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
                      <span>{lang === 'kn' ? 'ತುರ್ತು ಎಚ್ಚರಿಕೆ ಧ್ವನಿ (ಚೈಮ್)' : 'Emergency Audio Alert Chime'}</span>
                    </span>
                    <p className="text-[11px] text-stone-500">
                      Plays a synthesized emergency sound tone when an extreme warning is triggered.
                    </p>
                  </div>

                  <button
                    onClick={handleToggleSound}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isSoundEnabled ? 'bg-emerald-600' : 'bg-stone-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        isSoundEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Current Risk Status for Location */}
              <div className="border border-stone-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                    Current Location Threat Level
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                    activeAlert
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {activeAlert ? activeAlert.severity.toUpperCase() : 'NORMAL / SAFE'}
                  </span>
                </div>
                <div className="text-xs text-stone-700">
                  Telemetry monitoring in <strong>{weather.district}</strong>: Wind: {weather.wind} km/h • Temp: {weather.temp}°C • 24h Rain: {weather.rainfall24hMm} mm • Humidity: {weather.humidity}%.
                </div>
              </div>

              {/* Simulation Testing Tool (Allows the user to test real-time push notification immediately!) */}
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs">
                  <PlayCircle className="w-4 h-4 text-amber-600" />
                  <span>{lang === 'kn' ? 'ನೈಜ-ಸಮಯದ ಪುಶ್ ಎಚ್ಚರಿಕೆ ಪರೀಕ್ಷಿಸಿ (ಸಿಮ್ಯುಲೇಶನ್):' : 'Test Real-Time Push Notification Engine (Instant Drill):'}</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Click any extreme weather condition below to trigger an immediate browser push notification and in-app emergency alert for {weather.district}:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleSimulateAlert('wind')}
                    className="p-2.5 rounded-xl bg-white hover:bg-stone-100 border border-amber-300 text-stone-800 text-xs font-bold transition flex flex-col items-center gap-1 shadow-2xs hover:scale-102"
                  >
                    <Wind className="w-4 h-4 text-amber-600" />
                    <span>Squall 54 km/h</span>
                  </button>

                  <button
                    onClick={() => handleSimulateAlert('rain')}
                    className="p-2.5 rounded-xl bg-white hover:bg-stone-100 border border-amber-300 text-stone-800 text-xs font-bold transition flex flex-col items-center gap-1 shadow-2xs hover:scale-102"
                  >
                    <CloudRain className="w-4 h-4 text-sky-600" />
                    <span>Downpour 78mm</span>
                  </button>

                  <button
                    onClick={() => handleSimulateAlert('storm')}
                    className="p-2.5 rounded-xl bg-white hover:bg-stone-100 border border-amber-300 text-stone-800 text-xs font-bold transition flex flex-col items-center gap-1 shadow-2xs hover:scale-102"
                  >
                    <Zap className="w-4 h-4 text-yellow-600" />
                    <span>Thunderstorm</span>
                  </button>

                  <button
                    onClick={() => handleSimulateAlert('heat')}
                    className="p-2.5 rounded-xl bg-white hover:bg-stone-100 border border-amber-300 text-stone-800 text-xs font-bold transition flex flex-col items-center gap-1 shadow-2xs hover:scale-102"
                  >
                    <Flame className="w-4 h-4 text-rose-600" />
                    <span>Heatwave 41°C</span>
                  </button>
                </div>
              </div>

              {/* Alert History Log */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center justify-between">
                  <span>Recent Extreme Alert Log</span>
                  <span className="text-stone-400 font-normal text-[11px]">{alertHistory.length} Recorded</span>
                </h4>

                {alertHistory.length === 0 ? (
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-center text-xs text-stone-500">
                    No extreme weather events detected for {weather.district} in this session.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {alertHistory.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl border border-stone-200 bg-white hover:border-emerald-300 transition text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-900 flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${item.severity === 'critical' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                            {item.title}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">{item.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-stone-600">{item.description}</p>
                        <div className="text-[10px] text-emerald-800 font-medium">
                          Advisory: {item.advisory}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs">
              <span className="text-stone-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Protected by Namma Raitha Agro-Met Engine</span>
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
