import { DistrictAgroWeather, HourlyForecast, WeatherForecastDay } from '../types/nammaraitha';
import { DISTRICTS_AGRO_WEATHER } from '../data/weatherData';

// Haversine formula to compute great-circle distance in kilometers
export function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find closest known agricultural district in India
export function findNearestDistrict(lat: number, lon: number): { key: string; distanceKm: number; district: DistrictAgroWeather } {
  let closestKey = 'Mandya';
  let minDistance = Infinity;

  for (const [key, item] of Object.entries(DISTRICTS_AGRO_WEATHER)) {
    if (item.lat !== undefined && item.lng !== undefined) {
      const dist = getDistanceKm(lat, lon, item.lat, item.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closestKey = key;
      }
    }
  }

  return {
    key: closestKey,
    distanceKm: Math.round(minDistance),
    district: DISTRICTS_AGRO_WEATHER[closestKey] || DISTRICTS_AGRO_WEATHER['Mandya']
  };
}

// Interpret WMO weather codes into conditions and icons
export function interpretWmoCode(code: number): { condition: string; conditionKn: string; icon: string } {
  if (code === 0) {
    return { condition: 'Clear Sky & Bright Sun', conditionKn: 'ಸ್ವಚ್ಛ ಆಕಾಶ & ಬಿಸಿಲು', icon: 'Sun' };
  }
  if (code === 1 || code === 2) {
    return { condition: 'Mainly Clear & Partly Sunny', conditionKn: 'ಭಾಗಶಃ ಬಿಸಿಲು & ತಿಳಿ ಮೋಡ', icon: 'SunMedium' };
  }
  if (code === 3) {
    return { condition: 'Overcast & Cloudy', conditionKn: 'ದಟ್ಟ ಮೋಡ ಕವಿದ ವಾತಾವರಣ', icon: 'Cloud' };
  }
  if (code === 45 || code === 48) {
    return { condition: 'Fog & Mist', conditionKn: 'ಮುಂಜಾನೆಯ ಮಂಜು', icon: 'CloudFog' };
  }
  if (code >= 51 && code <= 55) {
    return { condition: 'Light Drizzle', conditionKn: 'ತುಂತುರು ಮಳೆ', icon: 'CloudDrizzle' };
  }
  if (code >= 61 && code <= 65) {
    return { condition: 'Moderate to Heavy Rain', conditionKn: 'ಮಳೆ / ಬಿರುಗಾಳಿ', icon: 'CloudRain' };
  }
  if (code >= 80 && code <= 82) {
    return { condition: 'Scattered Rain Showers', conditionKn: 'ಚದುರಿದ ಮಳೆ', icon: 'CloudRain' };
  }
  if (code >= 95 && code <= 99) {
    return { condition: 'Thunderstorm & Gusty Winds', conditionKn: 'ಗುಡುಗು-ಮಿಂಚು ಸಹಿತ ಮಳೆ', icon: 'CloudLightning' };
  }
  return { condition: 'Partly Cloudy', conditionKn: 'ಭಾಗಶಃ ಮೋಡ', icon: 'CloudSun' };
}

// Kannada to English and English to Kannada district normalization dictionaries
export const KN_TO_EN_DISTRICTS_MAP: Record<string, string> = {
  'ಹಾಸನ': 'Hassan',
  'ಮಂಡ್ಯ': 'Mandya',
  'ಬೆಂಗಳೂರು': 'Bengaluru',
  'ಬೆಂಗಳೂರು ನಗರ': 'Bengaluru Urban',
  'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ': 'Bengaluru Rural',
  'ಮೈಸೂರು': 'Mysuru',
  'ಕೋಲಾರ': 'Kolar',
  'ಚಿಕ್ಕಬಳ್ಳಾಪುರ': 'Chikkaballapur',
  'ತುಮಕೂರು': 'Tumakuru',
  'ಶಿವಮೊಗ್ಗ': 'Shivamogga',
  'ಚಿಕ್ಕಮಗಳೂರು': 'Chikkamagaluru',
  'ಕೊಡಗು': 'Kodagu',
  'ಉಡುಪಿ': 'Udupi',
  'ದಕ್ಷಿಣ ಕನ್ನಡ': 'Dakshina Kannada',
  'ಉತ್ತರ ಕನ್ನಡ': 'Uttara Kannada',
  'ಬೆಳಗಾವಿ': 'Belagavi',
  'ಧಾರವಾಡ': 'Dharwad',
  'ಹಾವೇರಿ': 'Haveri',
  'ಗದಗ': 'Gadag',
  'ವಿಜಯಪುರ': 'Vijayapura',
  'ಬಾಗಲಕೋಟೆ': 'Bagalkot',
  'ಕಲಬುರಗಿ': 'Kalaburagi',
  'ಬೀದರ್': 'Bidar',
  'ರಾಯಚೂರು': 'Raichur',
  'ಕೊಪ್ಪಳ': 'Koppal',
  'ಬಳ್ಳಾರಿ': 'Ballari',
  'ವಿಜಯನಗರ': 'Vijayanagara',
  'ದಾವಣಗೆರೆ': 'Davanagere',
  'ಚಿತ್ರದುರ್ಗ': 'Chitradurga',
  'ಚಾಮರಾಜನಗರ': 'Chamarajanagar',
  'ಯಾದಗಿರಿ': 'Yadgir',
  'ರಾಮನಗರ': 'Ramanagara',
  'ಲುಧಿಯಾನ': 'Ludhiana',
  'ಅಮೃತಸರ': 'Amritsar',
  'ಕರ್ನಾಲ್': 'Karnal',
  'ವಾರಣಾಸಿ': 'Varanasi',
  'ಲಖನೌ': 'Lucknow',
  'ಜೈಪುರ': 'Jaipur',
  'ಶ್ರೀ ಗಂಗಾನಗರ': 'Sri Ganganagar',
  'ಶಿಮ್ಲಾ': 'Shimla',
  'ಶ್ರೀನಗರ': 'Srinagar',
  'ನಾಸಿಕ್': 'Nashik',
  'ಪುಣೆ': 'Pune',
  'ನಾಗಪುರ': 'Nagpur',
  'ಅಹಮದಾಬಾದ್': 'Ahmedabad',
  'ರಾಜಕೋಟ್': 'Rajkot',
  'ಇಂದೋರ್': 'Indore',
  'ಭೋಪಾಲ್': 'Bhopal',
  'ರಾಯ್‌ಪುರ': 'Raipur',
  'ಗುಂಟೂರು': 'Guntur',
  'ಹೈದರಾಬಾದ್': 'Hyderabad',
  'ಕೊಯಮತ್ತೂರು': 'Coimbatore',
  'ತಂಜಾವೂರು': 'Thanjavur',
  'ಪಾಲಕ್ಕಾಡ್': 'Palakkad',
  'ಬರ್ಧಮಾನ್': 'Burdwan',
  'ಪಾಟ್ನಾ': 'Patna',
  'ಭುವನೇಶ್ವರ': 'Bhubaneswar',
  'ಗುವಾಹಟಿ': 'Guwahati',
  'ಹೊಸ ದೆಹಲಿ': 'New Delhi',
  'ದೆಹಲಿ': 'New Delhi',
};

export const EN_TO_KN_DISTRICTS_MAP: Record<string, string> = {
  'Hassan': 'ಹಾಸನ',
  'Mandya': 'ಮಂಡ್ಯ',
  'Bengaluru': 'ಬೆಂಗಳೂರು',
  'Bengaluru Rural': 'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ',
  'Mysuru': 'ಮೈಸೂರು',
  'Mysore': 'ಮೈಸೂರು',
  'Kolar': 'ಕೋಲಾರ',
  'Chikkaballapur': 'ಚಿಕ್ಕಬಳ್ಳಾಪುರ',
  'Tumkur': 'ತುಮಕೂರು',
  'Tumakuru': 'ತುಮಕೂರು',
  'Shivamogga': 'ಶಿವಮೊಗ್ಗ',
  'Shimoga': 'ಶಿವಮೊಗ್ಗ',
  'Chikkamagaluru': 'ಚಿಕ್ಕಮಗಳೂರು',
  'Kodagu': 'ಕೊಡಗು',
  'Udupi': 'ಉಡುಪಿ',
  'Dakshina Kannada': 'ದಕ್ಷಿಣ ಕನ್ನಡ',
  'Uttara Kannada': 'ಉತ್ತರ ಕನ್ನಡ',
  'Belagavi': 'ಬೆಳಗಾವಿ',
  'Belgaum': 'ಬೆಳಗಾವಿ',
  'Dharwad': 'ಧಾರವಾಡ',
  'Haveri': 'ಹಾವೇರಿ',
  'Gadag': 'ಗದಗ',
  'Vijayapura': 'ವಿಜಯಪುರ',
  'Bijapur': 'ವಿಜಯಪುರ',
  'Bagalkot': 'ಬಾಗಲಕೋಟೆ',
  'Kalaburagi': 'ಕಲಬುರಗಿ',
  'Gulbarga': 'ಕಲಬುರಗಿ',
  'Bidar': 'ಬೀದರ್',
  'Raichur': 'ರಾಯಚೂರು',
  'Koppal': 'ಕೊಪ್ಪಳ',
  'Ballari': 'ಬಳ್ಳಾರಿ',
  'Bellary': 'ಬಳ್ಳಾರಿ',
  'Vijayanagara': 'ವಿಜಯನಗರ',
  'Davanagere': 'ದಾವಣಗೆರೆ',
  'Chitradurga': 'ಚಿತ್ರದುರ್ಗ',
  'Chamarajanagar': 'ಚಾಮರಾಜನಗರ',
  'Yadgir': 'ಯಾದಗಿರಿ',
  'Ramanagara': 'ರಾಮನಗರ',
  'Ludhiana': 'ಲುಧಿಯಾನ',
  'Amritsar': 'ಅಮೃತಸರ',
  'Karnal': 'ಕರ್ನಾಲ್',
  'Varanasi': 'ವಾರಣಾಸಿ',
  'Lucknow': 'ಲಖನೌ',
  'Jaipur': 'ಜೈಪುರ',
  'Sri Ganganagar': 'ಶ್ರೀ ಗಂಗಾನಗರ',
  'Shimla': 'ಶಿಮ್ಲಾ',
  'Srinagar': 'ಶ್ರೀನಗರ',
  'Nashik': 'ನಾಸಿಕ್',
  'Pune': 'ಪುಣೆ',
  'Nagpur': 'ನಾಗಪುರ',
  'Ahmedabad': 'ಅಹಮದಾಬಾದ್',
  'Rajkot': 'ರಾಜಕೋಟ್',
  'Indore': 'ಇಂದೋರ್',
  'Bhopal': 'ಭೋಪಾಲ್',
  'Raipur': 'ರಾಯ್‌ಪುರ',
  'Guntur': 'ಗುಂಟೂರು',
  'Hyderabad': 'ಹೈದರಾಬಾದ್',
  'Coimbatore': 'ಕೊಯಮತ್ತೂರು',
  'Thanjavur': 'ತಂಜಾವೂರು',
  'Palakkad': 'ಪಾಲಕ್ಕಾಡ್',
  'Burdwan': 'ಬರ್ಧಮಾನ್',
  'Patna': 'ಪಾಟ್ನಾ',
  'Bhubaneswar': 'ಭುವನೇಶ್ವರ',
  'Guwahati': 'ಗುವಾಹಟಿ',
  'New Delhi': 'ಹೊಸ ದೆಹಲಿ',
};

// Normalize district name based on active UI language
export function getLocalizedDistrictName(district: string, lang: string): string {
  if (!district) return '';
  const cleaned = district
    .replace(/ ಜಿಲ್ಲೆ/g, '')
    .replace(/ ತಾಲ್ಲೂಕು/g, '')
    .replace(/ ತಾಲೂಕು/g, '')
    .replace(/ District/gi, '')
    .replace(/ taluk/gi, '')
    .trim();

  if (lang === 'kn') {
    return EN_TO_KN_DISTRICTS_MAP[cleaned] || cleaned;
  }

  // English: guarantee NO Kannada script appears in English mode
  if (/[\u0C80-\u0CFF]/.test(cleaned)) {
    // If it has Latin characters alongside Kannada (e.g. 'Mandya (ಮಂಡ್ಯ)'), strip Kannada
    const englishOnly = cleaned.replace(/[\u0C80-\u0CFF]/g, '').replace(/[()]/g, '').replace(/,/g, '').trim();
    if (englishOnly.length >= 2) {
      return englishOnly;
    }
    // Pure Kannada: look up in reverse dictionary
    const strippedKn = cleaned.replace(/[()]/g, '').replace(/ಕರ್ನಾಟಕ/g, '').replace(/ಲೈವ್ ಜಿಪಿಎಸ್/g, '').trim();
    return KN_TO_EN_DISTRICTS_MAP[strippedKn] || KN_TO_EN_DISTRICTS_MAP[cleaned] || 'Mandya';
  }
  return cleaned;
}

// Reverse geocode to find village, taluk, district, and state using backend proxy and fallback
export async function reverseGeocode(
  lat: number,
  lon: number,
  lang: string = 'en'
): Promise<{
  city: string;
  district: string;
  districtKn?: string;
  taluk?: string;
  village?: string;
  state: string;
  stateKn?: string;
  label: string;
  formattedAddress?: string;
}> {
  // 1. Try our backend proxy first (handles headers, language negotiation, and avoids CORS)
  try {
    const res = await fetch(`/api/location/reverse-geocode?lat=${lat}&lng=${lon}&lang=${lang}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        const enDistrict = data.district || 'Hassan';
        const knDistrict = data.districtKn || EN_TO_KN_DISTRICTS_MAP[enDistrict] || 'ಹಾಸನ';
        const enState = data.state || 'Karnataka';
        const knState = data.stateKn || 'ಕರ್ನಾಟಕ';

        return {
          city: lang === 'kn' ? (data.city || knDistrict) : (data.city || enDistrict),
          district: enDistrict,
          districtKn: knDistrict,
          taluk: data.taluk || '',
          village: data.village || '',
          state: enState,
          stateKn: knState,
          label: lang === 'kn' ? `${knDistrict}, ${knState}` : `${enDistrict}, ${enState}`,
          formattedAddress: data.formattedAddress,
        };
      }
    }
  } catch (err) {
    console.warn('Backend reverse-geocode proxy error, falling back:', err);
  }

  // 2. Direct browser fallback using Nominatim with explicit language
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1&accept-language=${lang === 'kn' ? 'kn,en' : 'en'}`,
      { headers: { 'Accept-Language': lang === 'kn' ? 'kn,en' : 'en-US,en' } }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const village = addr.village || addr.hamlet || addr.suburb || '';
      const taluk = addr.county || addr.subdistrict || addr.tehsil || '';
      const rawCity = addr.city || addr.town || addr.district || addr.state_district || 'Hassan';
      const rawDistrict = (addr.state_district || addr.district || rawCity).replace(/ District/i, '').replace(/ ಜಿಲ್ಲೆ/g, '');
      const state = addr.state || 'Karnataka';

      const enDistrict = getLocalizedDistrictName(rawDistrict, 'en');
      const knDistrict = EN_TO_KN_DISTRICTS_MAP[enDistrict] || rawDistrict;

      return {
        city: lang === 'kn' ? knDistrict : enDistrict,
        district: enDistrict,
        districtKn: knDistrict,
        taluk,
        village,
        state,
        label: lang === 'kn' ? `${knDistrict}, ${state}` : `${enDistrict}, ${state}`,
        formattedAddress: data.display_name,
      };
    }
  } catch (err) {
    console.warn('Direct reverse geocode error:', err);
  }

  // 3. Fallback to nearest district in our database
  const nearest = findNearestDistrict(lat, lon);
  return {
    city: nearest.district.district,
    district: nearest.district.district,
    districtKn: nearest.district.districtKn,
    state: nearest.district.state,
    label: lang === 'kn' ? `${nearest.district.districtKn}, ${nearest.district.state}` : `${nearest.district.district}, ${nearest.district.state}`,
    formattedAddress: `${nearest.district.district}, ${nearest.district.state}, India`,
  };
}

// IP-based Geolocation fallback if browser GPS is blocked
export async function getIpLocation(): Promise<{
  lat: number;
  lng: number;
  city: string;
  district: string;
  state: string;
  formattedAddress: string;
} | null> {
  // 1. Try our server endpoint
  try {
    const res = await fetch('/api/location/ip');
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        return {
          lat: data.lat,
          lng: data.lng,
          city: data.city || 'Mandya',
          district: data.district || 'Mandya',
          state: data.state || 'Karnataka',
          formattedAddress: data.formattedAddress || 'Mandya, Karnataka, India',
        };
      }
    }
  } catch (err) {
    console.warn('Backend IP location failed:', err);
  }

  // 2. Direct browser fallback
  try {
    const res = await fetch('https://ipwho.is/');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.latitude && data.longitude) {
        return {
          lat: data.latitude,
          lng: data.longitude,
          city: data.city || 'Mandya',
          district: data.region || 'Karnataka',
          state: data.region || 'Karnataka',
          formattedAddress: `${data.city || 'Mandya'}, ${data.region || 'Karnataka'}, India`,
        };
      }
    }
  } catch (err) {
    console.warn('Client IP geolocation failed:', err);
  }

  // Default to Mandya (Agricultural core of Karnataka)
  return {
    lat: 12.5218,
    lng: 76.8951,
    city: 'Mandya',
    district: 'Mandya',
    state: 'Karnataka',
    formattedAddress: 'Mandya, Karnataka, India',
  };
}

// High-Accuracy GPS Position Reader with zero cache and extended timeout
export function getAccurateGpsPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation is not supported by your browser or environment.'));
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos),
      (err) => reject(err),
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0, // Force fresh satellite/hardware GPS reading
      }
    );
  });
}


// Fetch live telemetry from Open-Meteo for exact GPS coordinates
export async function fetchLiveOpenMeteoWeather(
  lat: number,
  lng: number,
  cityName: string,
  stateName: string,
  closestFallback?: DistrictAgroWeather
): Promise<DistrictAgroWeather> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,uv_index_max&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Open-Meteo failed with status ${res.status}`);
  }

  const data = await res.json();
  const current = data.current || {};
  const daily = data.daily || {};
  const hourly = data.hourly || {};

  const temp = Math.round(current.temperature_2m ?? 28);
  const feelsLike = Math.round(current.apparent_temperature ?? temp);
  const humidity = Math.round(current.relative_humidity_2m ?? 60);
  const wind = Math.round(current.wind_speed_10m ?? 12);
  const rain24h = Number((current.precipitation ?? 0).toFixed(1));
  const wmo = interpretWmoCode(current.weather_code ?? 0);
  const uv = Math.round(daily.uv_index_max?.[0] ?? 7);

  // Day names helper
  const dayNamesEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayNamesKn = ['ಭಾನುವಾರ', 'ಸೋಮವಾರ', 'ಮಂಗಳವಾರ', 'ಬುಧವಾರ', 'ಗುರುವಾರ', 'ಶುಕ್ರವಾರ', 'ಶನಿವಾರ'];

  // Construct 7-day forecast
  const forecast7Day: WeatherForecastDay[] = [];
  const times = daily.time || [];
  for (let i = 0; i < Math.min(times.length, 7); i++) {
    const d = new Date(times[i]);
    const dayOfWeek = d.getDay();
    const isToday = i === 0;
    const isTomorrow = i === 1;

    const dayName = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : dayNamesEn[dayOfWeek];
    const dayNameKn = isToday ? 'ಇಂದು' : isTomorrow ? 'ನಾಳೆ' : dayNamesKn[dayOfWeek];
    const code = daily.weather_code?.[i] ?? 0;
    const dayWmo = interpretWmoCode(code);
    const rainChance = Math.round(daily.precipitation_probability_max?.[i] ?? (code >= 51 ? 65 : 10));
    const rainfallMm = Number((daily.precipitation_sum?.[i] ?? 0).toFixed(1));
    const tempMax = Math.round(daily.temperature_2m_max?.[i] ?? temp + 2);
    const tempMin = Math.round(daily.temperature_2m_min?.[i] ?? temp - 8);

    const sprayWindow = rainChance > 45 || wind > 18 ? 'caution' : 'safe';
    const irrigationNeed = rainfallMm > 5 ? 'low' : rainChance > 60 ? 'moderate' : 'high';

    const advisory =
      rainChance > 45
        ? 'Possibility of rain showers. Postpone spraying and avoid standing water.'
        : 'Optimal weather for field spraying, weeding, and scheduled drip irrigation.';
    const advisoryKn =
      rainChance > 45
        ? 'ಮಳೆಯ ಸಂಭವವಿದೆ. ಔಷಧ ಸಿಂಪಡಣೆ ಮುಂದೂಡಿ, ಹೊಲದಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ನೋಡಿಕೊಳ್ಳಿ.'
        : 'ಔಷಧ ಸಿಂಪಡಣೆ, ಕಳೆ ಕೀಳಲು ಮತ್ತು ಹನಿ ನೀರಾವರಿಗೆ ಉತ್ತಮ ವಾತಾವರಣ.';

    forecast7Day.push({
      date: times[i],
      dayName,
      dayNameKn,
      tempMax,
      tempMin,
      condition: dayWmo.condition,
      conditionKn: dayWmo.conditionKn,
      icon: dayWmo.icon,
      rainChance,
      rainfallMm,
      humidity: Math.min(95, Math.max(40, humidity + (i % 2 === 0 ? 5 : -4))),
      windSpeed: wind,
      windDirection: 'SW',
      advisory,
      advisoryKn,
      sprayWindow,
      irrigationNeed
    });
  }

  // Construct Hourly Forecast (next 7 slots)
  const hourlyList: HourlyForecast[] = [];
  const hourlyTimes = hourly.time || [];
  const now = new Date();
  let added = 0;
  for (let i = 0; i < hourlyTimes.length && added < 7; i += 3) {
    const timeStr = hourlyTimes[i];
    const d = new Date(timeStr);
    if (d >= now || added === 0) {
      const hours = d.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedTime = `${hours % 12 || 12}:00 ${ampm}`;
      const code = hourly.weather_code?.[i] ?? 0;
      const hWmo = interpretWmoCode(code);

      hourlyList.push({
        time: formattedTime,
        temp: Math.round(hourly.temperature_2m?.[i] ?? temp),
        condition: hWmo.condition,
        conditionKn: hWmo.conditionKn,
        icon: hWmo.icon,
        rainChance: Math.round(hourly.precipitation_probability?.[i] ?? 10),
        humidity: Math.round(hourly.relative_humidity_2m?.[i] ?? humidity),
        windSpeed: Math.round(hourly.wind_speed_10m?.[i] ?? wind)
      });
      added++;
    }
  }

  // Determine smart agro advisories based on live telemetry
  const isHighRain = (forecast7Day[0]?.rainChance || 0) > 40 || rain24h > 5;
  const isHighWind = wind > 18;
  const sprayStatus = isHighRain || isHighWind ? 'caution' : 'safe';
  const sprayWindow = sprayStatus === 'safe' ? '07:00 AM - 11:30 AM' : 'Hold / Caution Today';
  const sprayWindowKn = sprayStatus === 'safe' ? 'ಬೆಳಗ್ಗೆ 07:00 ರಿಂದ 11:30' : 'ಇಂದು ಸಿಂಪರಣೆ ಮುಂದೂಡಿ';
  const sprayReason =
    sprayStatus === 'safe'
      ? `Wind speed is calm (${wind} km/h) and rain probability is low. Safe window for foliar fertilizers and bio-pesticides.`
      : `Elevated wind (${wind} km/h) or precipitation risk. Postpone pesticide spraying to prevent drift and wash-off.`;
  const sprayReasonKn =
    sprayStatus === 'safe'
      ? `ಗಾಳಿಯ ವೇಗ ಕಡಿಮೆಯಿದೆ (${wind} ಕಿ.ಮೀ/ಗಂ) ಮತ್ತು ಮಳೆಯ ಸಾಧ್ಯತೆ ಕಡಿಮೆ. ಪೋಷಕಾಂಶ ಮತ್ತು ಜೈವಿಕ ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸಲು ಸೂಕ್ತ.`
      : `ಬಿರುಗಾಳಿ ಅಥವಾ ಮಳೆಯ ಸಾಧ್ಯತೆಯಿರುವುದರಿಂದ ಔಷಧ ಸಿಂಪಡಣೆ ಮುಂದೂಡಿ.`;

  const irrigationRec =
    isHighRain
      ? 'Rain expected in next 24-48h. Postpone canal and furrow irrigation to prevent waterlogging.'
      : 'Maintain scheduled drip or furrow irrigation cycles. Ensure morning or evening watering.';
  const irrigationRecKn =
    isHighRain
      ? 'ಮುಂದಿನ ೨೪-೪೮ ಗಂಟೆಗಳಲ್ಲಿ ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ; ನೀರಾವರಿ ನಿಲ್ಲಿಸಿ.'
      : 'ಹನಿ ಅಥವಾ ಕಾಲುವೆ ನೀರಾವರಿ ಮುಂದುವರಿಸಿ; ಬೆಳಗ್ಗೆ ಅಥವಾ ಸಂಜೆ ನೀರು ನೀಡಿ.';

  // Fallback crops from nearest district or generic Pan-India staples
  const primaryCrops = closestFallback?.primaryCrops || ['Paddy (Rice)', 'Wheat', 'Vegetables', 'Pulses'];
  const primaryCropsKn = closestFallback?.primaryCropsKn || ['ಭತ್ತ', 'ಗೋಧಿ', 'ತರಕಾರಿಗಳು', 'ಬೇಳೆಕಾಳುಗಳು'];

  // Normalize city/district and state names for bilingual consistency
  const enDistrict = getLocalizedDistrictName(cityName, 'en');
  const knDistrict = EN_TO_KN_DISTRICTS_MAP[enDistrict] || getLocalizedDistrictName(cityName, 'kn');
  const enState = stateName.replace(/ ರಾಜ್ಯ/g, '').trim();

  return {
    district: enDistrict,
    districtKn: `${knDistrict} (ಲೈವ್ ಜಿಪಿಎಸ್)`,
    state: enState,
    stateKn: enState === 'Karnataka' ? 'ಕರ್ನಾಟಕ' : enState,
    lat,
    lng,
    zone: closestFallback?.zone || 'south',
    region: 'national',
    primaryCrops,
    primaryCropsKn,
    temp,
    feelsLike,
    condition: wmo.condition,
    conditionKn: wmo.conditionKn,
    icon: wmo.icon,
    rainChance: forecast7Day[0]?.rainChance || 15,
    rainfall24hMm: rain24h,
    humidity,
    wind,
    windDirection: current.wind_direction_10m ? `${Math.round(current.wind_direction_10m)}°` : 'SW',
    uvIndex: uv,
    soilMoisturePercent: Math.min(85, Math.max(40, Math.round(humidity * 0.8))),
    dewPoint: Math.round(temp - (100 - humidity) / 5),
    pressureHpa: Math.round(current.surface_pressure ?? 1012),
    sunrise: '06:15 AM',
    sunset: '06:10 PM',
    aqi: 45,
    agroAdvisory: {
      spraying: {
        status: sprayStatus,
        window: sprayWindow,
        windowKn: sprayWindowKn,
        reason: sprayReason,
        reasonKn: sprayReasonKn
      },
      irrigation: {
        recommendation: irrigationRec,
        recommendationKn: irrigationRecKn,
        waterSaveTip: 'Drip fertigation conserves 35-40% water and delivers direct root nutrition.',
        waterSaveTipKn: 'ಹನಿ ನೀರಾವರಿ ಪದ್ಧತಿ 35-40% ನೀರನ್ನು ಉಳಿಸುತ್ತದೆ.'
      },
      harvesting: {
        status: isHighRain ? 'hurry' : 'optimal',
        desc: isHighRain
          ? 'Secure harvested produce under waterproof tarpaulins due to expected showers.'
          : 'Dry sunny hours are ideal for harvesting, bagging, and threshing produce.',
        descKn: isHighRain
          ? 'ಮಳೆ ಬರುವ ಮುನ್ನ ಕೊಯ್ಲು ಮಾಡಿದ ಫಸಲನ್ನು ಟಾರ್ಪಲ್‌ನಿಂದ ರಕ್ಷಿಸಿ.'
          : 'ಕೊಯ್ಲು ಮತ್ತು ಒಕ್ಕಣೆಗೆ ಉತ್ತಮ ಹವಾಮಾನ.'
      },
      pestRisk: {
        level: humidity > 75 ? 'moderate' : 'low',
        alert: humidity > 75
          ? 'Elevated humidity promotes fungal leaf spot and blast. Inspect lower foliage.'
          : 'Normal pest pressure under current ambient temperature.',
        alertKn: humidity > 75
          ? 'ಹೆಚ್ಚಿನ ತೇವಾಂಶದಿಂದ ಶಿಲೀಂಧ್ರ ರೋಗಗಳ ಬಾಧೆ ಬರಬಹುದು; ಎಲೆಗಳ ಕೆಳಭಾಗ ಪರಿಶೀಲಿಸಿ.'
          : 'ಪ್ರಸ್ತುತ ತಾಪಮಾನದಲ್ಲಿ ಕೀಟಗಳ ಬಾಧೆ ಸಾಮಾನ್ಯ ಮಟ್ಟದಲ್ಲಿದೆ.',
        vulnerableCrops: primaryCrops.slice(0, 2).join(' & '),
        vulnerableCropsKn: primaryCropsKn.slice(0, 2).join(' & ')
      }
    },
    hourly: hourlyList.length > 0 ? hourlyList : (closestFallback?.hourly || []),
    forecast7Day: forecast7Day.length > 0 ? forecast7Day : (closestFallback?.forecast7Day || [])
  };
}

// Search any city, town, or district in India using Open-Meteo Geocoding API
export async function searchIndianCities(query: string): Promise<Array<{ name: string; state: string; lat: number; lng: number }>> {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&country=IN&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const results = data.results || [];

    return results.map((r: any) => ({
      name: r.name,
      state: r.admin1 || r.country || 'India',
      lat: r.latitude,
      lng: r.longitude
    }));
  } catch (err) {
    console.warn('City search failed:', err);
    return [];
  }
}
