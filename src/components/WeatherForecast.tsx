import React, { useState, useMemo } from 'react';
import {
  Cloud,
  CloudRain,
  CloudSun,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  Sun,
  SunMedium,
  Wind,
  Droplets,
  MapPin,
  Search,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  ShieldAlert,
  Sparkles,
  Phone,
  Waves,
  Thermometer,
  Eye,
  Check,
  Share2,
  Play,
  Pause,
  Layers,
  Info,
  Navigation,
  Compass,
  Sprout,
  AlertCircle
} from 'lucide-react';
import { Language, DistrictAgroWeather, HourlyForecast, WeatherForecastDay, UserLiveLocation } from '../types/nammaraitha';
import {
  DISTRICTS_AGRO_WEATHER,
  MAJOR_RESERVOIRS,
  SEASONAL_RAINFALL,
  ReservoirData
} from '../data/weatherData';
import {
  findNearestDistrict,
  reverseGeocode,
  getIpLocation,
  fetchLiveOpenMeteoWeather,
  searchIndianCities,
  getAccurateGpsPosition,
  getLocalizedDistrictName
} from '../utils/weatherService';
import { t } from '../utils/translations';
import { ExtremeWeatherAlerts } from './ExtremeWeatherAlerts';

interface WeatherForecastProps {
  lang: Language;
  currentLocation?: UserLiveLocation;
  onOpenLocationModal?: () => void;
  onLocationChange?: (loc: UserLiveLocation) => void;
}

export type RegionZone = 'all' | 'north' | 'south' | 'west_central' | 'east_northeast' | 'karnataka';

export const WeatherForecast: React.FC<WeatherForecastProps> = ({
  lang,
  currentLocation,
  onOpenLocationModal,
  onLocationChange,
}) => {
  // Default to Karnataka's Mandya or current location's district instead of New Delhi
  const [selectedDistrict, setSelectedDistrict] = useState<string>(() => {
    return currentLocation?.district ? getLocalizedDistrictName(currentLocation.district, 'en') : 'Mandya';
  });
  // Default to All Over India as requested
  const [regionFilter, setRegionFilter] = useState<RegionZone>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState('Just now (Live)');
  const [isGpsLocating, setIsGpsLocating] = useState(false);
  const [gpsStatusMessage, setGpsStatusMessage] = useState<string | null>(null);
  const [gpsStatusType, setGpsStatusType] = useState<'info' | 'success' | 'warning'>('info');
  const [customLocationWeather, setCustomLocationWeather] = useState<DistrictAgroWeather | null>(null);
  const [isGpsActive, setIsGpsActive] = useState(Boolean(currentLocation?.source === 'gps'));
  const [citySuggestions, setCitySuggestions] = useState<Array<{ name: string; state: string; lat: number; lng: number }>>([]);
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const [radarLayer, setRadarLayer] = useState<'clouds' | 'wind' | 'temp'>('clouds');
  const [isRadarPlaying, setIsRadarPlaying] = useState(true);

  // SMS Alert subscription state
  const [smsPhone, setSmsPhone] = useState('');
  const [smsSubscribed, setSmsSubscribed] = useState(false);
  const [selectedDayDetailIndex, setSelectedDayDetailIndex] = useState<number | null>(0);

  // Sync with currentLocation when it changes from outside
  React.useEffect(() => {
    if (currentLocation) {
      setSelectedDistrict(currentLocation.district);
      if (currentLocation.lat && currentLocation.lng) {
        setIsGpsActive(currentLocation.source === 'gps');
        const nearest = findNearestDistrict(currentLocation.lat, currentLocation.lng);
        fetchLiveOpenMeteoWeather(
          currentLocation.lat,
          currentLocation.lng,
          currentLocation.district,
          currentLocation.state,
          nearest.district
        ).then((live) => {
          setCustomLocationWeather(live);
        }).catch((err) => {
          console.warn('Initial live sync error:', err);
        });
      }
    }
  }, [currentLocation]);

  // Computed current weather (custom GPS live or selected district)
  const currentWeather: DistrictAgroWeather = useMemo(() => {
    if (customLocationWeather && selectedDistrict === customLocationWeather.district) {
      return customLocationWeather;
    }
    return (
      DISTRICTS_AGRO_WEATHER[selectedDistrict] ||
      DISTRICTS_AGRO_WEATHER['New Delhi'] ||
      DISTRICTS_AGRO_WEATHER['Mandya'] ||
      Object.values(DISTRICTS_AGRO_WEATHER)[0]
    );
  }, [selectedDistrict, customLocationWeather]);

  // District list with Pan-India zone filters
  const districtKeys = useMemo(() => {
    return Object.keys(DISTRICTS_AGRO_WEATHER).filter((key) => {
      const data = DISTRICTS_AGRO_WEATHER[key];
      const matchRegion =
        regionFilter === 'all' ||
        (regionFilter === 'karnataka' && (data.region === 'karnataka' || data.state.includes('Karnataka'))) ||
        (regionFilter === 'north' && data.zone === 'north') ||
        (regionFilter === 'south' && data.zone === 'south') ||
        (regionFilter === 'west_central' && (data.zone === 'west' || data.zone === 'central')) ||
        (regionFilter === 'east_northeast' && (data.zone === 'east' || data.zone === 'northeast'));

      const matchSearch =
        data.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        data.districtKn.includes(searchQuery) ||
        data.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        data.primaryCrops.some((c: string) => c.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchRegion && matchSearch;
    });
  }, [regionFilter, searchQuery]);

  // Convert temp based on unit
  const formatTemp = (celsius: number) => {
    if (tempUnit === 'F') {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${celsius}°C`;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (currentWeather.lat && currentWeather.lng) {
        const live = await fetchLiveOpenMeteoWeather(
          currentWeather.lat,
          currentWeather.lng,
          currentWeather.district,
          currentWeather.state,
          currentWeather
        );
        setCustomLocationWeather(live);
      }
    } catch (e) {
      console.warn('Sync live error:', e);
    }
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed(
        new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      );
    }, 600);
  };

  // Real Real-Time High-Accuracy GPS Geolocation with Fallbacks
  const handleUseGps = async () => {
    setIsGpsLocating(true);
    setGpsStatusMessage(lang === 'kn' ? 'ನಿಮ್ಮ ನಿಖರ ಉಪಗ್ರಹ ಜಿಪಿಎಸ್ ಸ್ಥಳ ಹುಡುಕಲಾಗುತ್ತಿದೆ...' : 'Accessing your high-precision satellite GPS location...');
    setGpsStatusType('info');

    const handleSuccessCoordinates = async (lat: number, lng: number, sourceLabel: string, accuracy?: number) => {
      try {
        setGpsStatusMessage(
          lang === 'kn'
            ? `ಸ್ಥಳ ಪತ್ತೆಯಾಗಿದೆ (${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E${accuracy ? `, ±${Math.round(accuracy)}m` : ''}). ಲೈವ್ ಹವಾಮಾನ ತರಲಾಗುತ್ತಿದೆ...`
            : `Coordinates locked (${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E${accuracy ? `, ±${Math.round(accuracy)}m` : ''}). Loading live telemetry...`
        );
        const geo = await reverseGeocode(lat, lng);
        const nearest = findNearestDistrict(lat, lng);
        const cityName = geo.city || nearest.district.district;
        const stateName = geo.state || nearest.district.state;

        const live = await fetchLiveOpenMeteoWeather(lat, lng, cityName, stateName, nearest.district);
        setCustomLocationWeather(live);
        setSelectedDistrict(live.district);
        setIsGpsActive(true);
        setGpsStatusType('success');
        setGpsStatusMessage(
          lang === 'kn'
            ? `📍 ${sourceLabel}: ${geo.village || geo.taluk || live.district}, ${live.state} (${live.temp}°C, ${live.conditionKn})`
            : `📍 ${sourceLabel}: ${geo.village || geo.taluk || live.district}, ${live.state} (${live.temp}°C, ${live.condition})`
        );
        setLastRefreshed('Just now (GPS Live)');

        // Propagate to global state so other tabs have accurate location
        onLocationChange?.({
          lat,
          lng,
          accuracyMeters: accuracy || 15,
          district: live.district,
          districtKn: nearest.district.districtKn,
          state: live.state,
          formattedAddress: geo.formattedAddress || `${geo.village ? geo.village + ', ' : ''}${live.district}, ${live.state}`,
          source: 'gps',
          updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        });
      } catch (err) {
        console.warn('Live fetch error, falling back to nearest district:', err);
        const nearest = findNearestDistrict(lat, lng);
        setSelectedDistrict(nearest.key);
        setIsGpsActive(true);
        setGpsStatusType('success');
        setGpsStatusMessage(
          lang === 'kn'
            ? `📍 ಹತ್ತಿರದ ಕೃಷಿ ನಿಲ್ದಾಣ: ${nearest.district.districtKn} (${nearest.distanceKm} ಕಿ.ಮೀ ದೂರ)`
            : `📍 Nearest Agricultural Station: ${nearest.district.district}, ${nearest.district.state} (${nearest.distanceKm} km away)`
        );
      } finally {
        setIsGpsLocating(false);
        setTimeout(() => setGpsStatusMessage(null), 7000);
      }
    };

    try {
      const pos = await getAccurateGpsPosition();
      await handleSuccessCoordinates(pos.coords.latitude, pos.coords.longitude, 'GPS Satellite Fix', pos.coords.accuracy);
    } catch (error: any) {
      console.warn('Hardware GPS unavailable, trying IP geolocation:', error.message);
      setGpsStatusMessage(
        lang === 'kn'
          ? 'ಜಿಪಿಎಸ್ ಅನುಮತಿ ಸಿಗಲಿಲ್ಲ. ನೆಟ್‌ವರ್ಕ್ ಸ್ಥಳ ಹುಡುಕಲಾಗುತ್ತಿದೆ...'
          : 'Satellite GPS blocked. Trying network IP geolocation...'
      );
      try {
        const ipData = await getIpLocation();
        if (ipData && ipData.lat && ipData.lng) {
          await handleSuccessCoordinates(ipData.lat, ipData.lng, 'Network Location', 200);
        } else {
          setGpsStatusType('warning');
          setGpsStatusMessage(
            lang === 'kn'
              ? '⚠️ ಸ್ಥಳ ಪತ್ತೆ ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಜಿಲ್ಲೆಯನ್ನು ಆರಿಸಿ.'
              : '⚠️ Location permission denied. Please select your district from the list.'
          );
          setIsGpsLocating(false);
          setTimeout(() => setGpsStatusMessage(null), 6000);
        }
      } catch {
        setGpsStatusType('warning');
        setGpsStatusMessage(
          lang === 'kn'
            ? '⚠️ ಸ್ಥಳ ಪತ್ತೆ ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಜಿಲ್ಲೆಯನ್ನು ಆರಿಸಿ.'
            : '⚠️ Could not access location. Please pick your district.'
        );
        setIsGpsLocating(false);
        setTimeout(() => setGpsStatusMessage(null), 6000);
      }
    }
  };

  // Search Indian cities dynamically
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim().length >= 2) {
      setIsSearchingCity(true);
      searchIndianCities(val).then((res) => {
        setCitySuggestions(res);
        setIsSearchingCity(false);
      });
    } else {
      setCitySuggestions([]);
      setIsSearchingCity(false);
    }
  };

  // Select a dynamically searched Indian city
  const handleSelectSearchedCity = async (city: { name: string; state: string; lat: number; lng: number }) => {
    setCitySuggestions([]);
    setSearchQuery('');
    setIsGpsLocating(true);
    setGpsStatusMessage(`Loading live telemetry for ${city.name}, ${city.state}...`);
    setGpsStatusType('info');

    try {
      const nearest = findNearestDistrict(city.lat, city.lng);
      const live = await fetchLiveOpenMeteoWeather(city.lat, city.lng, city.name, city.state, nearest.district);
      setCustomLocationWeather(live);
      setSelectedDistrict(live.district);
      setIsGpsActive(false);
      setGpsStatusType('success');
      setGpsStatusMessage(
        lang === 'kn'
          ? `📍 ಲೈವ್ ವರದಿ: ${live.district}, ${live.state} (${live.temp}°C, ${live.conditionKn})`
          : `📍 Live Telemetry: ${live.district}, ${live.state} (${live.temp}°C, ${live.condition})`
      );
    } catch (e) {
      console.warn('City live weather fetch failed:', e);
    } finally {
      setIsGpsLocating(false);
      setTimeout(() => setGpsStatusMessage(null), 6000);
    }
  };

  // Weather condition icon helper
  const renderConditionIcon = (iconName: string, className = 'w-6 h-6') => {
    switch (iconName) {
      case 'Sun':
        return <Sun className={`${className} text-amber-400`} />;
      case 'SunMedium':
        return <SunMedium className={`${className} text-amber-400`} />;
      case 'CloudSun':
        return <CloudSun className={`${className} text-amber-300`} />;
      case 'CloudRain':
        return <CloudRain className={`${className} text-sky-400`} />;
      case 'CloudLightning':
        return <CloudLightning className={`${className} text-yellow-300`} />;
      case 'CloudDrizzle':
        return <CloudDrizzle className={`${className} text-sky-300`} />;
      case 'CloudFog':
        return <CloudFog className={`${className} text-stone-300`} />;
      default:
        return <Cloud className={`${className} text-stone-300`} />;
    }
  };

  const handleSmsSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (smsPhone.trim().length >= 10) {
      setSmsSubscribed(true);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Header Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-700/60">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-emerald-700/50">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/60 text-amber-300 text-xs font-bold tracking-wide mb-2 shadow-inner">
              <CloudSun className="w-4 h-4 text-amber-300" />
              <span>Real-Time Agro-Meteorology & Advisory</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading text-white">
              {lang === 'kn' ? 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ & ಕೃಷಿ ಸಲಹೆ' : 'Agricultural Weather Forecast'}
            </h1>
            <p className="text-emerald-200/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              {lang === 'kn'
                ? 'ಕರ್ನಾಟಕದ ಜಿಲ್ಲೆಗಳು ಮತ್ತು ರಾಷ್ಟ್ರೀಯ ಕೃಷಿ ವಲಯಗಳ ನಿಖರ ಹವಾಮಾನ, 7 ದಿನಗಳ ಮುನ್ಸೂಚನೆ, ಔಷಧ ಸಿಂಪಡಣೆ ಮತ್ತು ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿ.'
                : 'Hyper-local weather telemetry, 7-day predictive rain charts, spraying suitability windows, and soil moisture alerts for farmers.'}
            </p>
          </div>

          {/* Quick controls: Location, District Selector, 7-Day Link & Unit Toggle */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
            {onOpenLocationModal && (
              <button
                onClick={onOpenLocationModal}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs shadow-md transition hover:scale-105 active:scale-95"
                title="Open accurate live location radar and district picker"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-950" />
                <span>
                  {lang === 'kn'
                    ? (currentLocation?.districtKn || selectedDistrict)
                    : getLocalizedDistrictName(currentLocation?.district || selectedDistrict, 'en')}
                  {currentLocation?.source === 'gps' && (lang === 'kn' ? ' (ಲೈವ್)' : ' (Live)')}
                </span>
              </button>
            )}

            <div className="flex items-center gap-1.5 bg-emerald-950/90 px-2.5 py-1.5 rounded-xl border border-emerald-600/70 shadow-inner">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setIsGpsActive(false);
                }}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-1 max-w-36 sm:max-w-48 truncate"
              >
                {districtKeys.map((key) => {
                  const item = DISTRICTS_AGRO_WEATHER[key];
                  const cleanDistrictEn = getLocalizedDistrictName(item.district, 'en');
                  const cleanDistrict = lang === 'kn' ? item.districtKn : cleanDistrictEn;
                  const cleanState = lang === 'kn' ? (item.stateKn || item.state) : item.state;
                  return (
                    <option key={key} value={key} className="bg-emerald-950 text-white font-medium">
                      {cleanDistrict}, {cleanState}
                    </option>
                  );
                })}
              </select>
            </div>

            <button
              onClick={() => {
                document.getElementById('seven-day-forecast')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-md transition hover:scale-105 active:scale-95 flex items-center gap-1 shrink-0"
              title="Jump to 7-Day Forecast & Radar"
            >
              <span>{lang === 'kn' ? '7 ದಿನಗಳ ಮುನ್ಸೂಚನೆ & ರೇಡಾರ್' : '7-Day Forecast & Radar'}</span>
              <span>→</span>
            </button>

            {/* Extreme Weather Real-Time Push Notification Engine */}
            <ExtremeWeatherAlerts weather={currentWeather} lang={lang} />

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-emerald-800/90 hover:bg-emerald-700 border border-emerald-600/70 text-xs font-bold text-white shadow-sm transition"
              title="Refresh telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-300 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <div className="flex items-center bg-emerald-950/80 rounded-xl p-0.5 border border-emerald-700/60 shadow-inner">
              <button
                onClick={() => setTempUnit('C')}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition ${
                  tempUnit === 'C' ? 'bg-amber-400 text-emerald-950 shadow-sm' : 'text-emerald-300 hover:text-white'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => setTempUnit('F')}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition ${
                  tempUnit === 'F' ? 'bg-amber-400 text-emerald-950 shadow-sm' : 'text-emerald-300 hover:text-white'
                }`}
              >
                °F
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Agro-Meteorology Snapshot Row */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 mt-6 items-center">
          <div className="md:col-span-4 flex items-center gap-4">
            <div className="text-5xl font-extrabold font-heading text-white">
              {formatTemp(currentWeather.temp)}
            </div>
            <div>
              <div className="font-bold text-sm text-emerald-100">
                {lang === 'kn' ? currentWeather.conditionKn : currentWeather.condition}
              </div>
              <div className="text-xs text-emerald-300 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>Live Satellite Feed</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 grid grid-cols-3 gap-3">
            <div className="bg-emerald-900/60 p-3 rounded-2xl border border-emerald-700/50 shadow-inner">
              <div className="text-emerald-300 text-xs flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
                <span>{lang === 'kn' ? 'ಮಳೆ ಸಾಧ್ಯತೆ' : 'Rain Chance'}</span>
              </div>
              <div className="text-lg font-bold text-white mt-1">{currentWeather.rainChance}%</div>
            </div>
            <div className="bg-emerald-900/60 p-3 rounded-2xl border border-emerald-700/50 shadow-inner">
              <div className="text-emerald-300 text-xs flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'kn' ? 'ತೇವಾಂಶ' : 'Humidity'}</span>
              </div>
              <div className="text-lg font-bold text-white mt-1">{currentWeather.humidity}%</div>
            </div>
            <div className="bg-emerald-900/60 p-3 rounded-2xl border border-emerald-700/50 shadow-inner">
              <div className="text-emerald-300 text-xs flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-amber-300" />
                <span>{lang === 'kn' ? 'ಗಾಳಿ ವೇಗ' : 'Wind Speed'}</span>
              </div>
              <div className="text-lg font-bold text-white mt-1">{currentWeather.wind} km/h</div>
            </div>
          </div>
        </div>

        {/* Agri Specialist Advisory Row */}
        <div className="relative z-10 mt-5 p-3.5 rounded-2xl bg-emerald-900/60 border border-emerald-600/40 flex items-start gap-3 text-xs text-emerald-100">
          <AlertCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300 mr-1.5 font-bold">
              {lang === 'kn' ? 'ಕೃಷಿ ತಜ್ಞರ ಸಲಹೆ:' : 'Agri Specialist Advisory:'}
            </strong>
            {lang === 'kn'
              ? (currentWeather.agroAdvisory?.spraying?.reasonKn || 'ಆಲೂಗೆಡ್ಡೆ ಮತ್ತು ಕಾಫಿ ಬೆಳೆಗಳಿಗೆ ತಜ್ಞರ ಸಿಂಪಡಣಾ ಮಾರ್ಗಸೂಚಿ ಅನುಸರಿಸಿ.')
              : (currentWeather.agroAdvisory?.spraying?.reason || 'Optimal window for Late Blight prophylactic spray in potato and copper spray in coffee.')}
          </div>
        </div>

        {/* GPS Live Notification Banner */}
        {gpsStatusMessage && (
          <div
            className={`mt-4 px-4 py-2.5 rounded-2xl flex items-center justify-between gap-3 text-xs font-bold transition-all shadow-md animate-fadeIn ${
              gpsStatusType === 'success'
                ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/50'
                : gpsStatusType === 'warning'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-400/50'
                : 'bg-sky-500/20 text-sky-200 border border-sky-400/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 shrink-0 text-amber-300 animate-pulse" />
              <span>{gpsStatusMessage}</span>
            </div>
            <button
              onClick={() => setGpsStatusMessage(null)}
              className="text-stone-300 hover:text-white text-xs px-1.5 py-0.5 rounded"
            >
              ✕
            </button>
          </div>
        )}

        {/* District Selector & Pan-India Zone Filter Bar */}
        <div className="mt-5 pt-2 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Pan-India Zone Tabs */}
            <div className="flex flex-wrap bg-emerald-950/90 p-1 rounded-2xl border border-emerald-700/60 shadow-inner">
              <button
                onClick={() => setRegionFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  regionFilter === 'all'
                    ? 'bg-amber-400 text-emerald-950 shadow-sm'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                {lang === 'kn' ? '🇮🇳 ಅಖಿಲ ಭಾರತ' : '🇮🇳 All-India'}
              </button>
              <button
                onClick={() => setRegionFilter('north')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  regionFilter === 'north'
                    ? 'bg-emerald-700 text-amber-300 shadow-sm'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                {lang === 'kn' ? 'ಉತ್ತರ ಭಾರತ' : 'North India'}
              </button>
              <button
                onClick={() => setRegionFilter('south')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  regionFilter === 'south'
                    ? 'bg-emerald-700 text-amber-300 shadow-sm'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                {lang === 'kn' ? 'ದಕ್ಷಿಣ ಭಾರತ' : 'South India'}
              </button>
              <button
                onClick={() => setRegionFilter('west_central')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  regionFilter === 'west_central'
                    ? 'bg-emerald-700 text-amber-300 shadow-sm'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                {lang === 'kn' ? 'ಪಶ್ಚಿಮ & ಮಧ್ಯ ಭಾರತ' : 'West & Central'}
              </button>
              <button
                onClick={() => setRegionFilter('east_northeast')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  regionFilter === 'east_northeast'
                    ? 'bg-emerald-700 text-amber-300 shadow-sm'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                {lang === 'kn' ? 'ಪೂರ್ವ & ಈಶಾನ್ಯ' : 'East & NE'}
              </button>
              <button
                onClick={() => setRegionFilter('karnataka')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  regionFilter === 'karnataka'
                    ? 'bg-emerald-700 text-amber-300 shadow-sm'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                {lang === 'kn' ? 'ಕರ್ನಾಟಕ' : 'Karnataka'}
              </button>
            </div>

            {/* Search Input with Autocomplete Dropdown */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-emerald-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={lang === 'kn' ? 'ಯಾವುದೇ ನಗರ ಅಥವಾ ಬೆಳೆ ಹುಡುಕಿ...' : 'Search any city, district or crop...'}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-8 pr-7 py-1.5 text-xs rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-white placeholder-emerald-400 focus:outline-none focus:ring-1 focus:ring-amber-300 w-48 sm:w-64"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}

              {/* Dynamic Indian City Suggestions */}
              {citySuggestions.length > 0 && (
                <div className="absolute top-full left-0 mt-1.5 w-72 bg-emerald-950 border border-emerald-600 rounded-2xl shadow-2xl z-50 overflow-hidden text-xs">
                  <div className="px-3 py-1.5 bg-emerald-900/90 text-amber-300 font-bold text-[10px] uppercase tracking-wider border-b border-emerald-800">
                    {lang === 'kn' ? 'ಲೈವ್ ನಗರಗಳು & ಸ್ಥಳಗಳು' : 'Live Indian Cities (Click to Load)'}
                  </div>
                  {citySuggestions.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectSearchedCity(c)}
                      className="w-full text-left px-3.5 py-2 hover:bg-emerald-800 text-white flex items-center justify-between border-b border-emerald-900/60 last:border-b-0 transition"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <div>
                          <span className="font-bold">{c.name}</span>
                          <span className="text-emerald-300 ml-1.5 text-[11px]">({c.state})</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-amber-300 bg-emerald-900 px-1.5 py-0.5 rounded font-bold">
                        Live Weather
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* District Dropdown Selector - All Over India & Live GPS */}
          <div className="flex items-center gap-2 bg-emerald-950/90 px-3 py-1.5 rounded-2xl border border-emerald-600/70 shadow-sm shrink-0">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs text-emerald-300 font-medium whitespace-nowrap">
              {lang === 'kn' ? 'ಆಯ್ಕೆಯಾದ ಜಿಲ್ಲೆ:' : 'Selected District:'}
            </span>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setIsGpsActive(false);
              }}
              className="bg-transparent text-white font-bold text-xs sm:text-sm focus:outline-none cursor-pointer pr-2 max-w-48 sm:max-w-72 truncate"
            >
              {customLocationWeather && (
                <option value={customLocationWeather.district} className="bg-emerald-950 text-amber-300 font-bold py-1">
                  📍 {lang === 'kn'
                      ? (customLocationWeather.districtKn || customLocationWeather.district)
                      : getLocalizedDistrictName(customLocationWeather.district, 'en')
                    }, {lang === 'kn' ? (customLocationWeather.stateKn || customLocationWeather.state) : customLocationWeather.state} ({lang === 'kn' ? 'ಲೈವ್ ಜಿಪಿಎಸ್' : 'Live GPS'})
                </option>
              )}
              {districtKeys.map((key) => {
                const item = DISTRICTS_AGRO_WEATHER[key];
                const cleanDistrictEn = getLocalizedDistrictName(item.district, 'en');
                const cleanDistrict = lang === 'kn' ? item.districtKn : cleanDistrictEn;
                const cleanState = lang === 'kn' ? (item.stateKn || item.state) : item.state;
                return (
                  <option key={key} value={key} className="bg-emerald-950 text-white font-medium py-1">
                    {cleanDistrict}, {cleanState}
                  </option>
                );
              })}
            </select>
            {isGpsActive && (
              <span className="px-2 py-0.5 bg-amber-400 text-emerald-950 text-[10px] font-black rounded-full uppercase tracking-wider animate-pulse shrink-0">
                GPS
              </span>
            )}
          </div>
        </div>

        {/* Selected District Primary Crops Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 text-[11px] text-emerald-200">
          <span className="font-bold text-amber-300 flex items-center gap-1">
            <Sprout className="w-3.5 h-3.5 text-amber-300" />
            {lang === 'kn' ? 'ಪ್ರಮುಖ ಬೆಳೆಗಳು:' : 'Primary District Crops:'}
          </span>
          {(lang === 'kn' ? currentWeather.primaryCropsKn : currentWeather.primaryCrops).map((crop: string) => (
            <span
              key={crop}
              className="px-2 py-0.5 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-white font-medium"
            >
              {crop}
            </span>
          ))}
          <span className="text-emerald-400 ml-auto hidden md:inline text-[10px]">
            {lang === 'kn' ? 'ನವೀಕರಿಸಲಾಗಿದೆ:' : 'Telemetry Sync:'} {lastRefreshed} • Pan-India IMD / AWS Telemetry
          </span>
        </div>
      </div>

      {/* Active IMD Weather Alert Banner (If Any for selected district) */}
      {currentWeather.alertBanner && (
        <div
          className={`rounded-3xl p-4 sm:p-5 border shadow-md flex items-start gap-3.5 transition-all ${
            currentWeather.alertBanner.severity === 'orange'
              ? 'bg-amber-500/10 border-amber-500/50 text-amber-950'
              : 'bg-yellow-500/10 border-yellow-500/40 text-yellow-950'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
              currentWeather.alertBanner.severity === 'orange'
                ? 'bg-amber-500 text-white'
                : 'bg-yellow-500 text-stone-900'
            }`}
          >
            <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-extrabold text-sm sm:text-base text-stone-900 flex items-center gap-2">
                <span>
                  {lang === 'kn'
                    ? currentWeather.alertBanner.headlineKn
                    : currentWeather.alertBanner.headline}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-500 text-white uppercase tracking-wider">
                  {currentWeather.alertBanner.severity.toUpperCase()} ALERT
                </span>
              </h2>
              <span className="text-[11px] font-bold text-stone-500">
                Valid: {currentWeather.alertBanner.validTill}
              </span>
            </div>
            <p className="text-xs text-stone-700 mt-1 leading-relaxed">
              {lang === 'kn'
                ? currentWeather.alertBanner.detailsKn
                : currentWeather.alertBanner.details}
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Left Column Hero Weather Card & Advisories, Right Column Quick Vitals & Hourly */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column (8 cols): Primary Telemetry Board + Smart Farm Advisories */}
        <div className="lg:col-span-8 space-y-6">
          {/* Current Conditions Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-emerald-100 via-teal-50 to-amber-100 flex items-center justify-center shadow-inner shrink-0">
                  {renderConditionIcon(currentWeather.icon, 'w-10 h-10 sm:w-12 sm:h-12')}
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black font-heading text-stone-900">
                      {formatTemp(currentWeather.temp)}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-stone-500">
                      {lang === 'kn' ? 'ಅನುಭವ:' : 'Feels like:'} {formatTemp(currentWeather.feelsLike)}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-emerald-900 mt-0.5">
                    {lang === 'kn' ? currentWeather.conditionKn : currentWeather.condition}
                  </h2>
                  <div className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {lang === 'kn'
                        ? `${currentWeather.districtKn}, ${currentWeather.state}`
                        : `${currentWeather.district}, ${currentWeather.state}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rain Chance Quick Badge */}
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-center sm:text-right shrink-0">
                <div className="text-xs font-bold text-emerald-800 flex items-center sm:justify-end gap-1.5">
                  <CloudRain className="w-4 h-4 text-sky-600" />
                  <span>{lang === 'kn' ? 'ಮಳೆ ಸಂಭವನೀಯತೆ' : 'Rain Probability'}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-900 mt-0.5">
                  {currentWeather.rainChance}%
                </div>
                <div className="text-[11px] text-stone-500 font-medium">
                  {lang === 'kn' ? '24 ಗಂಟೆ ಮಳೆ:' : '24h Rainfall:'} {currentWeather.rainfall24hMm} mm
                </div>
              </div>
            </div>

            {/* 6 Key Agri-Vitals Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-5">
              <div className="bg-stone-50 hover:bg-emerald-50/50 transition p-3 rounded-2xl border border-stone-200/80">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                  <Droplets className="w-3.5 h-3.5 text-sky-500" />
                  <span>{lang === 'kn' ? 'ತೇವಾಂಶ' : 'Humidity'}</span>
                </div>
                <div className="text-base font-extrabold text-stone-900 mt-1">
                  {currentWeather.humidity}%
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">
                  {currentWeather.humidity > 75 ? (lang === 'kn' ? 'ಹೆಚ್ಚು' : 'High') : (lang === 'kn' ? 'ಸಾಧಾರಣ' : 'Moderate')}
                </div>
              </div>

              <div className="bg-stone-50 hover:bg-emerald-50/50 transition p-3 rounded-2xl border border-stone-200/80">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                  <Wind className="w-3.5 h-3.5 text-amber-500" />
                  <span>{lang === 'kn' ? 'ಗಾಳಿ' : 'Wind'}</span>
                </div>
                <div className="text-base font-extrabold text-stone-900 mt-1">
                  {currentWeather.wind} <span className="text-[10px] font-normal">km/h</span>
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5 truncate" title={currentWeather.windDirection}>
                  {currentWeather.windDirection}
                </div>
              </div>

              <div className="bg-stone-50 hover:bg-emerald-50/50 transition p-3 rounded-2xl border border-stone-200/80">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                  <Waves className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'kn' ? 'ಮಣ್ಣಿನ ತೇವಾಂಶ' : 'Soil Moisture'}</span>
                </div>
                <div className="text-base font-extrabold text-emerald-800 mt-1">
                  {currentWeather.soilMoisturePercent}%
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                  {currentWeather.soilMoisturePercent > 65
                    ? (lang === 'kn' ? 'ಸಾಕಷ್ಟು' : 'Adequate')
                    : (lang === 'kn' ? 'ಕಡಿಮೆ' : 'Needs Water')}
                </div>
              </div>

              <div className="bg-stone-50 hover:bg-emerald-50/50 transition p-3 rounded-2xl border border-stone-200/80">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                  <SunMedium className="w-3.5 h-3.5 text-orange-500" />
                  <span>{lang === 'kn' ? 'ಯುವಿ ಕಿರಣ' : 'UV Index'}</span>
                </div>
                <div className="text-base font-extrabold text-stone-900 mt-1">
                  {currentWeather.uvIndex} <span className="text-[10px] text-stone-400 font-normal">/ 11</span>
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">
                  {currentWeather.uvIndex > 7 ? (lang === 'kn' ? 'ತೀವ್ರ' : 'High') : (lang === 'kn' ? 'ಸಾಧಾರಣ' : 'Moderate')}
                </div>
              </div>

              <div className="bg-stone-50 hover:bg-emerald-50/50 transition p-3 rounded-2xl border border-stone-200/80">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                  <Thermometer className="w-3.5 h-3.5 text-teal-600" />
                  <span>{lang === 'kn' ? 'ಇಬ್ಬನಿ ಬಿಂದು' : 'Dew Point'}</span>
                </div>
                <div className="text-base font-extrabold text-stone-900 mt-1">
                  {formatTemp(currentWeather.dewPoint)}
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">
                  {currentWeather.pressureHpa} hPa
                </div>
              </div>

              <div className="bg-stone-50 hover:bg-emerald-50/50 transition p-3 rounded-2xl border border-stone-200/80">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{lang === 'kn' ? 'ಸೂರ್ಯ' : 'Sun Hours'}</span>
                </div>
                <div className="text-xs font-bold text-stone-900 mt-1 flex flex-col">
                  <span>🌅 {currentWeather.sunrise}</span>
                  <span className="text-stone-500">🌇 {currentWeather.sunset}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Agricultural Advisory Grid */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-extrabold text-stone-900 text-base sm:text-lg font-heading">
                    {lang === 'kn' ? 'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸಲಹಾ ಫಲಕ (Agro-Advisory)' : 'Smart Agricultural Action Advisory'}
                  </h2>
                  <p className="text-xs text-stone-500">
                    {lang === 'kn'
                      ? 'ಇಂದಿನ ಹವಾಮಾನಕ್ಕೆ ಅನುಗುಣವಾಗಿ ತಕ್ಷಣದ ಶಿಫಾರಸುಗಳು'
                      : 'Real-time agronomic recommendations grounded in current telemetry'}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 hidden sm:inline">
                ICAR Certified Logic
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-2xl border transition ${
                  currentWeather.agroAdvisory.spraying.status === 'safe'
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : currentWeather.agroAdvisory.spraying.status === 'caution'
                    ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                    : 'bg-red-50/80 border-red-200 text-red-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
                    <Droplets className="w-4 h-4" />
                    <span>{lang === 'kn' ? 'ಔಷಧ ಸಿಂಪರಣಾ ಸಮಯ' : 'Spraying Window'}</span>
                  </div>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                      currentWeather.agroAdvisory.spraying.status === 'safe'
                        ? 'bg-emerald-600 text-white'
                        : currentWeather.agroAdvisory.spraying.status === 'caution'
                        ? 'bg-amber-500 text-white'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {currentWeather.agroAdvisory.spraying.status}
                  </span>
                </div>
                <div className="mt-2 text-sm font-extrabold">
                  {lang === 'kn'
                    ? currentWeather.agroAdvisory.spraying.windowKn
                    : currentWeather.agroAdvisory.spraying.window}
                </div>
                <p className="mt-1 text-xs opacity-90 leading-relaxed">
                  {lang === 'kn'
                    ? currentWeather.agroAdvisory.spraying.reasonKn
                    : currentWeather.agroAdvisory.spraying.reason}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 text-sky-950">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-sky-900">
                    <Waves className="w-4 h-4 text-sky-700" />
                    <span>{lang === 'kn' ? 'ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿ' : 'Irrigation Scheduling'}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-600 text-white">
                    Smart Water
                  </span>
                </div>
                <p className="mt-2 text-xs text-sky-900 font-medium leading-relaxed">
                  {lang === 'kn'
                    ? currentWeather.agroAdvisory.irrigation.recommendationKn
                    : currentWeather.agroAdvisory.irrigation.recommendation}
                </p>
                <div className="mt-2 text-[11px] font-bold text-sky-800 bg-sky-100/80 px-2 py-1 rounded-lg">
                  💡 {lang === 'kn'
                    ? currentWeather.agroAdvisory.irrigation.waterSaveTipKn
                    : currentWeather.agroAdvisory.irrigation.waterSaveTip}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-stone-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-stone-700">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    <span>{lang === 'kn' ? 'ಕೊಯ್ಲು & ಒಣಗಿಸುವಿಕೆ' : 'Harvesting & Drying'}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-800 capitalize">
                    {currentWeather.agroAdvisory.harvesting.status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-stone-700 leading-relaxed font-medium">
                  {lang === 'kn'
                    ? currentWeather.agroAdvisory.harvesting.descKn
                    : currentWeather.agroAdvisory.harvesting.desc}
                </p>
              </div>

              <div
                className={`p-4 rounded-2xl border ${
                  currentWeather.agroAdvisory.pestRisk.level === 'high'
                    ? 'bg-rose-50 border-rose-200 text-rose-950'
                    : currentWeather.agroAdvisory.pestRisk.level === 'moderate'
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{lang === 'kn' ? 'ಕೀಟ & ಶಿಲೀಂಧ್ರ ರೋಗ ಭೀತಿ' : 'Pest & Fungal Risk Index'}</span>
                  </div>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                      currentWeather.agroAdvisory.pestRisk.level === 'high'
                        ? 'bg-rose-600 text-white'
                        : currentWeather.agroAdvisory.pestRisk.level === 'moderate'
                        ? 'bg-amber-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {currentWeather.agroAdvisory.pestRisk.level} Risk
                  </span>
                </div>
                <p className="mt-2 text-xs font-medium leading-relaxed">
                  {lang === 'kn'
                    ? currentWeather.agroAdvisory.pestRisk.alertKn
                    : currentWeather.agroAdvisory.pestRisk.alert}
                </p>
                <div className="mt-2 text-[10px] font-semibold opacity-80">
                  {lang === 'kn' ? 'ಬಾಧಿತ ಬೆಳೆಗಳು:' : 'Vulnerable crops:'}{' '}
                  {lang === 'kn'
                    ? currentWeather.agroAdvisory.pestRisk.vulnerableCropsKn
                    : currentWeather.agroAdvisory.pestRisk.vulnerableCrops}
                </div>
              </div>
            </div>
          </div>

          {/* 24-Hour Hourly Agricultural Weather Strip */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-700" />
                <h2 className="font-extrabold text-stone-900 text-base font-heading">
                  {lang === 'kn' ? '24 ಗಂಟೆಗಳ ಗಂಟಾವಾರು ಹವಾಮಾನ' : '24-Hour Hourly Agricultural Timeline'}
                </h2>
              </div>
              <span className="text-xs text-stone-500 font-medium">
                {lang === 'kn' ? 'ಇಂದಿನ ಮುನ್ಸೂಚನೆ' : 'Today\'s Hourly Trajectory'}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-4 no-scrollbar">
              {currentWeather.hourly.map((hour: HourlyForecast, idx: number) => (
                <div
                  key={idx}
                  className={`min-w-28 sm:min-w-32 p-3 sm:p-3.5 rounded-2xl border text-center transition flex flex-col items-center shrink-0 ${
                    idx === 2
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-md ring-2 ring-amber-400'
                      : 'bg-stone-50 hover:bg-stone-100 border-stone-200/80 text-stone-800'
                  }`}
                >
                  <span className={`text-[11px] font-bold ${idx === 2 ? 'text-amber-300' : 'text-stone-500'}`}>
                    {hour.time}
                  </span>
                  <div className="my-2">
                    {renderConditionIcon(hour.icon, 'w-6 h-6')}
                  </div>
                  <span className="text-lg font-black font-heading">
                    {formatTemp(hour.temp)}
                  </span>
                  <span className={`text-[10px] font-medium truncate max-w-full mt-0.5 ${idx === 2 ? 'text-emerald-100' : 'text-stone-600'}`}>
                    {lang === 'kn' ? hour.conditionKn : hour.condition}
                  </span>

                  <div className="w-full mt-2 pt-2 border-t border-current/20 flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="flex items-center gap-0.5">
                        <Droplets className="w-2.5 h-2.5 text-sky-400" />
                        {hour.rainChance}%
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Wind className="w-2.5 h-2.5 text-amber-400" />
                        {hour.windSpeed}k
                      </span>
                    </div>
                    <div className="w-full bg-black/10 rounded-full h-1 overflow-hidden">
                      <div
                        className="bg-sky-400 h-1 rounded-full transition-all"
                        style={{ width: `${hour.rainChance}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Agricultural Forecast Cards */}
          <div id="seven-day-forecast" className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-4 scroll-mt-24">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-700" />
                <h2 className="font-extrabold text-stone-900 text-base font-heading">
                  {lang === 'kn' ? '7 ದಿನಗಳ ಕೃಷಿ ಮುನ್ಸೂಚನೆ & ಸಲಹೆ' : '7-Day Agricultural Weather Outlook'}
                </h2>
              </div>
              <span className="text-xs text-stone-500 font-medium hidden sm:inline">
                {lang === 'kn' ? 'ದಿನವಾರು ಸಿಂಪರಣೆ & ನೀರಾವರಿ' : 'Daily Spray & Irrigation Status'}
              </span>
            </div>

            <div className="space-y-2.5">
              {currentWeather.forecast7Day.map((day, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedDayDetailIndex(selectedDayDetailIndex === idx ? null : idx)}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedDayDetailIndex === idx
                      ? 'bg-emerald-50/70 border-emerald-300 shadow-sm ring-1 ring-emerald-300'
                      : 'bg-stone-50/60 hover:bg-stone-50 border-stone-200/80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-44">
                      <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center shrink-0 shadow-xs">
                        {renderConditionIcon(day.icon, 'w-5 h-5')}
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-extrabold text-stone-900">
                          {lang === 'kn' ? day.dayNameKn : day.dayName}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {lang === 'kn' ? day.conditionKn : day.condition}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-1.5 text-xs text-sky-800 bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-100 shrink-0">
                        <Droplets className="w-3.5 h-3.5 text-sky-500" />
                        <span className="font-bold">{day.rainChance}%</span>
                        <span className="text-[10px] text-stone-400">({day.rainfallMm}mm)</span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                          day.sprayWindow === 'safe'
                            ? 'bg-emerald-100 text-emerald-800'
                            : day.sprayWindow === 'caution'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {day.sprayWindow === 'safe'
                          ? (lang === 'kn' ? 'ಸಿಂಪರಣೆ ಸೂಕ್ತ' : 'Spray Safe')
                          : day.sprayWindow === 'caution'
                          ? (lang === 'kn' ? 'ಎಚ್ಚರ ಸಿಂಪರಣೆ' : 'Caution')
                          : (lang === 'kn' ? 'ಸಿಂಪಡಿಸಬೇಡಿ' : 'No Spray')}
                      </span>

                      <div className="text-right min-w-24">
                        <span className="font-extrabold text-stone-900 text-sm">
                          {formatTemp(day.tempMax)}
                        </span>
                        <span className="text-stone-400 text-xs ml-1.5">
                          / {formatTemp(day.tempMin)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedDayDetailIndex === idx && (
                    <div className="mt-3 pt-3 border-t border-emerald-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-700 animate-fadeIn">
                      <div className="flex items-start gap-1.5">
                        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-emerald-950 font-semibold mr-1">
                            {lang === 'kn' ? 'ಕೃಷಿ ಸಲಹೆ:' : 'Farmer Tip:'}
                          </strong>
                          {lang === 'kn' ? day.advisoryKn : day.advisory}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 shrink-0">
                        <span>Wind: {day.windSpeed} km/h ({day.windDirection})</span>
                        <span>• Humidity: {day.humidity}%</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Satellite Doppler Radar Simulation + Seasonal Monsoon Tracker + SMS Alerts */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-stone-900 text-white rounded-3xl p-5 border border-stone-800 shadow-xl overflow-hidden relative">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="font-bold text-sm font-heading">
                  {lang === 'kn' ? 'ಡಾಪ್ಲರ್ ರೇಡಾರ್ & ಮೋಡ ನಕ್ಷೆ' : 'Doppler Radar & Satellite Simulation'}
                </h3>
              </div>
              <button
                onClick={() => setIsRadarPlaying(!isRadarPlaying)}
                className="p-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
                title={isRadarPlaying ? 'Pause Radar' : 'Play Radar'}
              >
                {isRadarPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="mt-4 relative aspect-4/3 rounded-2xl bg-stone-950 border border-stone-800 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

              <div className="relative w-full h-full p-4 flex flex-col justify-between z-10">
                <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                  <span>IMD AWS-RADAR: SOUTH PENINSULA</span>
                  <span className="text-amber-400">LIVE FEED</span>
                </div>

                <div className="relative w-full h-32 flex items-center justify-center">
                  <div className={`absolute w-36 h-36 rounded-full bg-teal-500/20 blur-xl ${isRadarPlaying ? 'animate-pulse' : ''}`} />
                  <div className="absolute w-28 h-24 rounded-full bg-emerald-500/30 blur-md transform translate-x-2 -translate-y-1" />
                  <div className="absolute w-14 h-14 rounded-full bg-amber-500/40 blur-xs" />
                  <div className="absolute w-6 h-6 rounded-full bg-rose-500/60" />

                  <div className="absolute z-20 flex flex-col items-center">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border border-white"></span>
                    </span>
                    <span className="text-[10px] font-black bg-stone-900/90 text-amber-300 px-1.5 py-0.5 rounded shadow mt-1 border border-stone-700">
                      {currentWeather.district} ({currentWeather.temp}°C)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] bg-stone-900/80 p-1.5 rounded-lg border border-stone-800">
                  <span className="text-stone-400">Intensity:</span>
                  <div className="flex items-center gap-1 font-mono text-[9px]">
                    <span className="px-1 bg-sky-900 text-sky-200 rounded">Light</span>
                    <span className="px-1 bg-emerald-800 text-emerald-200 rounded">Moderate</span>
                    <span className="px-1 bg-amber-700 text-amber-100 rounded">Heavy</span>
                    <span className="px-1 bg-rose-800 text-rose-100 rounded">Extreme</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-1 text-[11px]">
              <span className="text-stone-400 text-xs flex items-center gap-1">
                <Layers className="w-3 h-3 text-emerald-400" />
                Layer:
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setRadarLayer('clouds')}
                  className={`px-2 py-0.5 rounded-md font-semibold ${
                    radarLayer === 'clouds' ? 'bg-emerald-700 text-white' : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  Precipitation
                </button>
                <button
                  onClick={() => setRadarLayer('wind')}
                  className={`px-2 py-0.5 rounded-md font-semibold ${
                    radarLayer === 'wind' ? 'bg-emerald-700 text-white' : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  Wind Vectors
                </button>
                <button
                  onClick={() => setRadarLayer('temp')}
                  className={`px-2 py-0.5 rounded-md font-semibold ${
                    radarLayer === 'temp' ? 'bg-emerald-700 text-white' : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  Thermal
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Waves className="w-5 h-5 text-teal-700" />
                <h3 className="font-extrabold text-stone-900 text-sm sm:text-base font-heading">
                  {lang === 'kn' ? 'ಋತುವಿನ ಮಳೆ & ಜಲಾಶಯಗಳ ಮಟ್ಟ' : 'Monsoon & Dam Water Storage'}
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-900">
                KSNDMC Feed
              </span>
            </div>

            <div className="bg-teal-50/70 p-3.5 rounded-2xl border border-teal-200/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-teal-950">
                  {lang === 'kn' ? SEASONAL_RAINFALL.seasonNameKn : SEASONAL_RAINFALL.seasonName}
                </span>
                <span className="font-black text-teal-800 bg-teal-200/70 px-1.5 py-0.5 rounded text-[10px]">
                  +{SEASONAL_RAINFALL.departurePercent}%
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between text-xs">
                <span className="text-stone-600">
                  {lang === 'kn' ? 'ನೈಜ ಮಳೆ:' : 'Actual Rainfall:'} <strong>{SEASONAL_RAINFALL.actualMm} mm</strong>
                </span>
                <span className="text-stone-500">
                  {lang === 'kn' ? 'ಸಾಮಾನ್ಯ:' : 'Normal:'} {SEASONAL_RAINFALL.normalMm} mm
                </span>
              </div>
              <div className="w-full bg-teal-200/60 rounded-full h-2 mt-2 overflow-hidden">
                <div
                  className="bg-teal-600 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (SEASONAL_RAINFALL.actualMm / SEASONAL_RAINFALL.normalMm) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-teal-800 font-medium mt-1.5">
                Status: {lang === 'kn' ? SEASONAL_RAINFALL.statusLabelKn : SEASONAL_RAINFALL.statusLabel}
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="text-xs font-bold text-stone-700 flex items-center justify-between">
                <span>{lang === 'kn' ? 'ಪ್ರಮುಖ ಅಣೆಕಟ್ಟುಗಳ ನೀರಿನ ಮಟ್ಟ' : 'Major Agricultural Reservoirs'}</span>
                <span className="text-[10px] text-stone-400">Live Telemetry</span>
              </div>

              {MAJOR_RESERVOIRS.map((dam: ReservoirData, idx: number) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs hover:border-teal-300 transition"
                >
                  <div className="flex items-center justify-between font-bold text-stone-900">
                    <span>{lang === 'kn' ? dam.nameKn : dam.name}</span>
                    <span className="text-teal-700 font-extrabold">{dam.percentageFull}% Full</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1">
                    <span>
                      {dam.currentLevelFeet} ft / {dam.maxLevelFeet} ft
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium">
                      Inflow: {dam.inflowCusecs.toLocaleString()} cusecs
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
                    <div
                      className="bg-teal-500 h-1.5 rounded-full"
                      style={{ width: `${dam.percentageFull}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-emerald-800 rounded-3xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-amber-200" />
                <h3 className="font-extrabold text-sm sm:text-base font-heading">
                  {lang === 'kn' ? 'ಉಚಿತ ದೈನಂದಿನ ಹವಾಮಾನ SMS ಸಂದೇಶ' : 'Free Daily 6:00 AM Weather SMS Alert'}
                </h3>
              </div>
              <p className="text-xs text-amber-100 mt-1 leading-relaxed">
                {lang === 'kn'
                  ? 'ನಿಮ್ಮ ತಾಲೂಕಿನ ಮಳೆ, ಸಿಂಪರಣಾ ಸಮಯ ಮತ್ತು ಕೃಷಿ ಸಲಹೆಗಳನ್ನು ಪ್ರತಿದಿನ ಬೆಳಗ್ಗೆ ಉಚಿತವಾಗಿ ಮೊಬೈಲ್‌ಗೆ ಪಡೆಯಿರಿ.'
                  : 'Receive daily dawn weather telemetry, spraying suitability, and rain alerts directly on your mobile in your local language.'}
              </p>

              {smsSubscribed ? (
                <div className="mt-3 p-3 rounded-2xl bg-emerald-950/80 border border-emerald-400 flex items-center gap-2 text-xs text-amber-200 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {lang === 'kn'
                      ? 'ನೋಂದಣಿ ಯಶಸ್ವಿ! ನಾಳೆ ಮುಂಜಾನೆ 6:00 ರಿಂದ SMS ಆರಂಭವಾಗಲಿದೆ.'
                      : 'Subscribed successfully! Daily crop weather alerts active.'}
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSmsSubscribe} className="mt-3 flex gap-2">
                  <input
                    type="tel"
                    required
                    placeholder="+91 Mobile Number"
                    value={smsPhone}
                    onChange={(e) => setSmsPhone(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white/95 text-stone-900 text-xs font-semibold placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-amber-300 font-extrabold text-xs shadow-md transition hover:scale-105 active:scale-95 shrink-0"
                  >
                    {lang === 'kn' ? 'ನೋಂದಾಯಿಸಿ' : 'Subscribe'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
