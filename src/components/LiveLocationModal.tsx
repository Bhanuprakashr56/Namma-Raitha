import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Navigation,
  Crosshair,
  CheckCircle2,
  AlertCircle,
  Search,
  X,
  Compass,
  Building,
  Radio,
  Sparkles,
  RefreshCw,
  Layers,
  ChevronRight,
  Globe
} from 'lucide-react';
import { Language, UserLiveLocation } from '../types/nammaraitha';
import {
  getAccurateGpsPosition,
  reverseGeocode,
  getIpLocation,
  findNearestDistrict,
  searchIndianCities,
  getLocalizedDistrictName,
  EN_TO_KN_DISTRICTS_MAP
} from '../utils/weatherService';
import { DISTRICTS_AGRO_WEATHER } from '../data/weatherData';

interface LiveLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  currentLocation: UserLiveLocation;
  onLocationSelect: (location: UserLiveLocation) => void;
}

export type RegionKey = 'all' | 'north' | 'south' | 'west_central' | 'east_ne' | 'karnataka';

interface DistrictItem {
  name: string;
  nameKn: string;
  state: string;
  stateKn: string;
  lat: number;
  lng: number;
  highlight: string;
  highlightKn: string;
}

interface RegionZone {
  id: RegionKey;
  regionName: string;
  regionNameKn: string;
  badge: string;
  districts: DistrictItem[];
}

// Comprehensive All-India Agricultural Districts & Hubs
const ALL_INDIA_REGIONS: RegionZone[] = [
  {
    id: 'all',
    regionName: 'All India Major Agri Hubs',
    regionNameKn: 'ಅಖಿಲ ಭಾರತ ಪ್ರಮುಖ ಕೃಷಿ ಮಂಡಿಗಳು',
    badge: '🇮🇳 National Hubs',
    districts: [
      { name: 'New Delhi', nameKn: 'ಹೊಸ ದೆಹಲಿ', state: 'Delhi (NCR)', stateKn: 'ದೆಹಲಿ', lat: 28.6139, lng: 77.2090, highlight: 'Azadpur National Mandi', highlightKn: 'ಆಜಾದ್‌ಪುರ ರಾಷ್ಟ್ರೀಯ ಮಂಡಿ' },
      { name: 'Ludhiana', nameKn: 'ಲುಧಿಯಾನ', state: 'Punjab', stateKn: 'ಪಂಜಾಬ್', lat: 30.9010, lng: 75.8573, highlight: 'Wheat & Rice Granary', highlightKn: 'ಗೋಧಿ & ಭತ್ತದ ಕಣಜ' },
      { name: 'Karnal', nameKn: 'ಕರ್ನಾಲ್', state: 'Haryana', stateKn: 'ಹರಿಯಾಣ', lat: 29.6857, lng: 76.9905, highlight: 'Basmati Rice Hub', highlightKn: 'ಬಾಸ್ಮತಿ ಅಕ್ಕಿ ಮಾರುಕಟ್ಟೆ' },
      { name: 'Varanasi', nameKn: 'ವಾರಣಾಸಿ', state: 'Uttar Pradesh', stateKn: 'ಉತ್ತರ ಪ್ರದೇಶ', lat: 25.3176, lng: 82.9739, highlight: 'Gangetic Plains Agri', highlightKn: 'ಗಂಗಾ ಬಯಲು ಕೃಷಿ' },
      { name: 'Jaipur', nameKn: 'ಜೈಪುರ', state: 'Rajasthan', stateKn: 'ರಾಜಸ್ಥಾನ', lat: 26.9124, lng: 75.7873, highlight: 'Mustard & Millets', highlightKn: 'ಸಾಸಿವೆ & ಸಿರಿಧಾನ್ಯಗಳು' },
      { name: 'Nashik', nameKn: 'ನಾಸಿಕ್', state: 'Maharashtra', stateKn: 'ಮಹಾರಾಷ್ಟ್ರ', lat: 19.9975, lng: 73.7898, highlight: 'Onion & Grape Capital', highlightKn: 'ಈರುಳ್ಳಿ & ದ್ರಾಕ್ಷಿ ಕಣಜ' },
      { name: 'Pune', nameKn: 'ಪುಣೆ', state: 'Maharashtra', stateKn: 'ಮಹಾರಾಷ್ಟ್ರ', lat: 18.5204, lng: 73.8567, highlight: 'Vegetables & Flowers', highlightKn: 'ತರಕಾರಿ & ಹೂವಿನ ಮಂಡಿ' },
      { name: 'Ahmedabad', nameKn: 'ಅಹಮದಾಬಾದ್', state: 'Gujarat', stateKn: 'ಗುಜರಾತ್', lat: 23.0225, lng: 72.5714, highlight: 'Cotton & Groundnut', highlightKn: 'ಹತ್ತಿ & ಕಡಲೆಕಾಯಿ' },
      { name: 'Indore', nameKn: 'ಇಂದೋರ್', state: 'Madhya Pradesh', stateKn: 'ಮಧ್ಯಪ್ರದೇಶ', lat: 22.7196, lng: 75.8577, highlight: 'Soybean & Wheat Capital', highlightKn: 'ಸೋಯಾಬೀನ್ & ಗೋಧಿ' },
      { name: 'Mandya', nameKn: 'ಮಂಡ್ಯ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 12.5218, lng: 76.8951, highlight: 'Sugar & Paddy Hub', highlightKn: 'ಸಕ್ಕರೆ & ಭತ್ತದ ನಾಡು' },
      { name: 'Bengaluru', nameKn: 'ಬೆಂಗಳೂರು', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 12.9716, lng: 77.5946, highlight: 'Horticulture & Vegetables', highlightKn: 'ತೋಟಗಾರಿಕೆ & ತರಕಾರಿಗಳು' },
      { name: 'Hyderabad', nameKn: 'ಹೈದರಾಬಾದ್', state: 'Telangana', stateKn: 'ತೆಲಂಗಾಣ', lat: 17.3850, lng: 78.4867, highlight: 'Cotton, Rice & Maize', highlightKn: 'ಹತ್ತಿ, ಭತ್ತ & ಮೆಕ್ಕೆಜೋಳ' },
      { name: 'Guntur', nameKn: 'ಗುಂಟೂರು', state: 'Andhra Pradesh', stateKn: 'ಆಂಧ್ರಪ್ರದೇಶ', lat: 16.3067, lng: 80.4365, highlight: 'Mirchi & Chilli Yard', highlightKn: 'ಮೆಣಸಿನಕಾಯಿ ಏಷ್ಯಾ ಮಾರುಕಟ್ಟೆ' },
      { name: 'Coimbatore', nameKn: 'ಕೊಯಮತ್ತೂರು', state: 'Tamil Nadu', stateKn: 'ತಮಿಳುನಾಡು', lat: 11.0168, lng: 76.9558, highlight: 'Cotton & Coconut Hub', highlightKn: 'ಹತ್ತಿ & ತೆಂಗು ಮಂಡಿ' },
      { name: 'Palakkad', nameKn: 'ಪಾಲಕ್ಕಾಡ್', state: 'Kerala', stateKn: 'ಕೇರಳ', lat: 10.7867, lng: 76.6548, highlight: 'Granary of Kerala', highlightKn: 'ಕೇರಳದ ಭತ್ತದ ಕಣಜ' },
      { name: 'Burdwan', nameKn: 'ಬರ್ಧಮಾನ್', state: 'West Bengal', stateKn: 'ಪಶ್ಚಿಮ ಬಂಗಾಳ', lat: 23.2324, lng: 87.8615, highlight: 'Rice Bowl of Bengal', highlightKn: 'ಬಂಗಾಳದ ಭತ್ತದ ಕಣಜ' },
      { name: 'Patna', nameKn: 'ಪಾಟ್ನಾ', state: 'Bihar', stateKn: 'ಬಿಹಾರ', lat: 25.5941, lng: 85.1376, highlight: 'Maize, Pulses & Litchi', highlightKn: 'ಮೆಕ್ಕೆಜೋಳ & ಲೀಚಿ' },
      { name: 'Bhubaneswar', nameKn: 'ಭುವನೇಶ್ವರ', state: 'Odisha', stateKn: 'ಒಡಿಶಾ', lat: 20.2961, lng: 85.8245, highlight: 'Coastal Paddy & Cashew', highlightKn: 'ಭತ್ತ & ಗೋಡಂಬಿ' },
      { name: 'Guwahati', nameKn: 'ಗುವಾಹಟಿ', state: 'Assam', stateKn: 'ಅಸ್ಸಾಂ', lat: 26.1445, lng: 91.7362, highlight: 'Assam Tea & Rice', highlightKn: 'ಚಹಾ & ಭತ್ತ' },
    ]
  },
  {
    id: 'north',
    regionName: 'Northern India',
    regionNameKn: 'ಉತ್ತರ ಭಾರತ',
    badge: '🌾 North India',
    districts: [
      { name: 'Ludhiana', nameKn: 'ಲುಧಿಯಾನ', state: 'Punjab', stateKn: 'ಪಂಜಾಬ್', lat: 30.9010, lng: 75.8573, highlight: 'Wheat, Rice & Cotton', highlightKn: 'ಗೋಧಿ & ಭತ್ತದ ಕಣಜ' },
      { name: 'Amritsar', nameKn: 'ಅಮೃತಸರ', state: 'Punjab', stateKn: 'ಪಂಜಾಬ್', lat: 31.6340, lng: 74.8723, highlight: 'Basmati Rice Delta', highlightKn: 'ಬಾಸ್ಮತಿ ಅಕ್ಕಿ ಮಾರುಕಟ್ಟೆ' },
      { name: 'Karnal', nameKn: 'ಕರ್ನಾಲ್', state: 'Haryana', stateKn: 'ಹರಿಯಾಣ', lat: 29.6857, lng: 76.9905, highlight: 'Basmati Rice & Dairying', highlightKn: 'ಬಾಸ್ಮತಿ & ಡೈರಿ ಕೃಷಿ' },
      { name: 'New Delhi', nameKn: 'ಹೊಸ ದೆಹಲಿ', state: 'Delhi (NCR)', stateKn: 'ದೆಹಲಿ', lat: 28.6139, lng: 77.2090, highlight: 'Azadpur Terminal Mandi', highlightKn: 'ಆಜಾದ್‌ಪುರ ಟರ್ಮಿನಲ್ ಮಂಡಿ' },
      { name: 'Lucknow', nameKn: 'ಲಖನೌ', state: 'Uttar Pradesh', stateKn: 'ಉತ್ತರ ಪ್ರದೇಶ', lat: 26.8467, lng: 80.9462, highlight: 'Mangoes & Sugarcane', highlightKn: 'ಮಾವು & ಕಬ್ಬು' },
      { name: 'Varanasi', nameKn: 'ವಾರಣಾಸಿ', state: 'Uttar Pradesh', stateKn: 'ಉತ್ತರ ಪ್ರದೇಶ', lat: 25.3176, lng: 82.9739, highlight: 'Vegetables & Cereals', highlightKn: 'ತರಕಾರಿ & ಧಾನ್ಯಗಳು' },
      { name: 'Jaipur', nameKn: 'ಜೈಪುರ', state: 'Rajasthan', stateKn: 'ರಾಜಸ್ಥಾನ', lat: 26.9124, lng: 75.7873, highlight: 'Mustard & Pearl Millet', highlightKn: 'ಸಾಸಿವೆ & ಸಜ್ಜೆ' },
      { name: 'Sri Ganganagar', nameKn: 'ಶ್ರೀ ಗಂಗಾನಗರ', state: 'Rajasthan', stateKn: 'ರಾಜಸ್ಥಾನ', lat: 29.9038, lng: 73.8772, highlight: 'Canal Cotton & Kinnow', highlightKn: 'ಹತ್ತಿ & ಕಿನ್ನೋ ಕಿತ್ತಳೆ' },
      { name: 'Shimla', nameKn: 'ಶಿಮ್ಲಾ', state: 'Himachal Pradesh', stateKn: 'ಹಿಮಾಚಲ ಪ್ರದೇಶ', lat: 31.1048, lng: 77.1734, highlight: 'Apple Orchards & Off-Season Veg', highlightKn: 'ಸೇಬು ತೋಟ & ತರಕಾರಿ' },
      { name: 'Srinagar', nameKn: 'ಶ್ರೀನಗರ', state: 'Jammu & Kashmir', stateKn: 'ಜಮ್ಮು & ಕಾಶ್ಮೀರ', lat: 34.0837, lng: 74.7973, highlight: 'Kashmir Saffron & Almonds', highlightKn: 'ಕಾಶ್ಮೀರಿ ಕೇಸರಿ & ಬಾದಾಮಿ' },
    ]
  },
  {
    id: 'south',
    regionName: 'Southern India',
    regionNameKn: 'ದಕ್ಷಿಣ ಭಾರತ',
    badge: '🌿 South India',
    districts: [
      { name: 'Mandya', nameKn: 'ಮಂಡ್ಯ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 12.5218, lng: 76.8951, highlight: 'Sugar, Jaggery & Paddy', highlightKn: 'ಸಕ್ಕರೆ, ಬೆಲ್ಲ & ಭತ್ತ' },
      { name: 'Bengaluru', nameKn: 'ಬೆಂಗಳೂರು', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 12.9716, lng: 77.5946, highlight: 'Exotic Veg & Floriculture', highlightKn: 'ತರಕಾರಿಗಳು & ಹೂವುಗಳು' },
      { name: 'Mysuru', nameKn: 'ಮೈಸೂರು', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 12.2958, lng: 76.6394, highlight: 'Paddy, Cotton & Banana', highlightKn: 'ಭತ್ತ, ಹತ್ತಿ & ಬಾಳೆ' },
      { name: 'Hassan', nameKn: 'ಹಾಸನ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 13.0033, lng: 76.1004, highlight: 'Coffee, Potato & Maize', highlightKn: 'ಕಾಫಿ, ಆಲೂಗಡ್ಡೆ & ಮೆಕ್ಕೆಜೋಳ' },
      { name: 'Kolar', nameKn: 'ಕೋಲಾರ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 13.1367, lng: 78.1291, highlight: 'Tomato APMC Capital', highlightKn: 'ಟೊಮೇಟೊ ಮಂಡಿ ರಾಜಧಾನಿ' },
      { name: 'Belagavi', nameKn: 'ಬೆಳಗಾವಿ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 15.8497, lng: 74.4977, highlight: 'Sugarcane & Vegetables', highlightKn: 'ಕಬ್ಬು & ತರಕಾರಿಗಳು' },
      { name: 'Dharwad', nameKn: 'ಧಾರವಾಡ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 15.4589, lng: 75.0078, highlight: 'Soybean & Onion', highlightKn: 'ಸೋಯಾಬೀನ್ & ಈರುಳ್ಳಿ' },
      { name: 'Shivamogga', nameKn: 'ಶಿವಮೊಗ್ಗ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 13.9299, lng: 75.5681, highlight: 'Arecanut & Paddy', highlightKn: 'ಅಡಿಕೆ & ಭತ್ತ' },
      { name: 'Kalaburagi', nameKn: 'ಕಲಬುರಗಿ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 17.3297, lng: 76.8343, highlight: 'Tur Dal / Red Gram Bowl', highlightKn: 'ತೊಗರಿ ಬೇಳೆ ಕಣಜ' },
      { name: 'Guntur', nameKn: 'ಗುಂಟೂರು', state: 'Andhra Pradesh', stateKn: 'ಆಂಧ್ರಪ್ರದೇಶ', lat: 16.3067, lng: 80.4365, highlight: 'Asia Largest Chilli Market', highlightKn: 'ಏಷ್ಯಾದ ಅತಿ ದೊಡ್ಡ ಮೆಣಸಿನ ಮಾರುಕಟ್ಟೆ' },
      { name: 'Hyderabad', nameKn: 'ಹೈದರಾಬಾದ್', state: 'Telangana', stateKn: 'ತೆಲಂಗಾಣ', lat: 17.3850, lng: 78.4867, highlight: 'Cotton, Paddy & Maize', highlightKn: 'ಹತ್ತಿ, ಭತ್ತ & ಮೆಕ್ಕೆಜೋಳ' },
      { name: 'Coimbatore', nameKn: 'ಕೊಯಮತ್ತೂರು', state: 'Tamil Nadu', stateKn: 'ತಮಿಳುನಾಡು', lat: 11.0168, lng: 76.9558, highlight: 'Cotton & Coconut', highlightKn: 'ಹತ್ತಿ & ತೆಂಗಿನ ಮಂಡಿ' },
      { name: 'Thanjavur', nameKn: 'ತಂಜಾವೂರು', state: 'Tamil Nadu', stateKn: 'ತಮಿಳುನಾಡು', lat: 10.7870, lng: 79.1378, highlight: 'Cauvery Delta Rice Bowl', highlightKn: 'ಕಾವೇರಿ ಡೆಲ್ಟಾ ಭತ್ತದ ಕಣಜ' },
      { name: 'Palakkad', nameKn: 'ಪಾಲಕ್ಕಾಡ್', state: 'Kerala', stateKn: 'ಕೇರಳ', lat: 10.7867, lng: 76.6548, highlight: 'Paddy & Spices Hub', highlightKn: 'ಭತ್ತ & ಸಂಬಾರ ಬೆಳೆಗಳು' },
    ]
  },
  {
    id: 'west_central',
    regionName: 'Western & Central India',
    regionNameKn: 'ಪಶ್ಚಿಮ & ಮಧ್ಯ ಭಾರತ',
    badge: '🍇 West & Central',
    districts: [
      { name: 'Nashik', nameKn: 'ನಾಸಿಕ್', state: 'Maharashtra', stateKn: 'ಮಹಾರಾಷ್ಟ್ರ', lat: 19.9975, lng: 73.7898, highlight: 'Onion & Table Grapes', highlightKn: 'ಈರುಳ್ಳಿ & ದ್ರಾಕ್ಷಿ ರಫ್ತು' },
      { name: 'Pune', nameKn: 'ಪುಣೆ', state: 'Maharashtra', stateKn: 'ಮಹಾರಾಷ್ಟ್ರ', lat: 18.5204, lng: 73.8567, highlight: 'Sugarcane & Vegetables', highlightKn: 'ಕಬ್ಬು & ತರಕಾರಿಗಳು' },
      { name: 'Nagpur', nameKn: 'ನಾಗಪುರ', state: 'Maharashtra', stateKn: 'ಮಹಾರಾಷ್ಟ್ರ', lat: 21.1458, lng: 79.0882, highlight: 'Orange City & Cotton', highlightKn: 'ಕಿತ್ತಳೆ ಹಣ್ಣು & ಹತ್ತಿ' },
      { name: 'Ahmedabad', nameKn: 'ಅಹಮದಾಬಾದ್', state: 'Gujarat', stateKn: 'ಗುಜರಾತ್', lat: 23.0225, lng: 72.5714, highlight: 'Cotton & Groundnut Trading', highlightKn: 'ಹತ್ತಿ & ಕಡಲೆಕಾಯಿ ವಹಿವಾಟು' },
      { name: 'Rajkot', nameKn: 'ರಾಜಕೋಟ್', state: 'Gujarat', stateKn: 'ಗುಜರಾತ್', lat: 22.3039, lng: 70.8022, highlight: 'Groundnut Oil & Cumin', highlightKn: 'ಕಡಲೆಕಾಯಿ ಎಣ್ಣೆ & ಜೀರಿಗೆ' },
      { name: 'Indore', nameKn: 'ಇಂದೋರ್', state: 'Madhya Pradesh', stateKn: 'ಮಧ್ಯಪ್ರದೇಶ', lat: 22.7196, lng: 75.8577, highlight: 'Sharbati Wheat & Soybean', highlightKn: 'ಶರ್ಬತಿ ಗೋಧಿ & ಸೋಯಾಬೀನ್' },
      { name: 'Bhopal', nameKn: 'ಭೋಪಾಲ್', state: 'Madhya Pradesh', stateKn: 'ಮಧ್ಯಪ್ರದೇಶ', lat: 23.2599, lng: 77.4126, highlight: 'Pulses, Gram & Wheat', highlightKn: 'ಬೇಳೆಕಾಳು & ಗೋಧಿ' },
      { name: 'Raipur', nameKn: 'ರಾಯ್‌ಪುರ', state: 'Chhattisgarh', stateKn: 'ಛತ್ತೀಸ್‌ಗಢ', lat: 21.2514, lng: 81.6296, highlight: 'Central India Rice Bowl', highlightKn: 'ಮಧ್ಯ ಭಾರತದ ಭತ್ತದ ಕಣಜ' },
    ]
  },
  {
    id: 'east_ne',
    regionName: 'Eastern & North-Eastern India',
    regionNameKn: 'ಪೂರ್ವ & ಈಶಾನ್ಯ ಭಾರತ',
    badge: '🍃 East & North-East',
    districts: [
      { name: 'Burdwan', nameKn: 'ಬರ್ಧಮಾನ್', state: 'West Bengal', stateKn: 'ಪಶ್ಚಿಮ ಬಂಗಾಳ', lat: 23.2324, lng: 87.8615, highlight: 'Paddy & Mustard Granary', highlightKn: 'ಭತ್ತ & ಸಾಸಿವೆ ಕಣಜ' },
      { name: 'Patna', nameKn: 'ಪಾಟ್ನಾ', state: 'Bihar', stateKn: 'ಬಿಹಾರ', lat: 25.5941, lng: 85.1376, highlight: 'Maize, Pulses & Litchi', highlightKn: 'ಮೆಕ್ಕೆಜೋಳ & ಲೀಚಿ' },
      { name: 'Bhubaneswar', nameKn: 'ಭುವನೇಶ್ವರ', state: 'Odisha', stateKn: 'ಒಡಿಶಾ', lat: 20.2961, lng: 85.8245, highlight: 'Coastal Paddy & Cashew', highlightKn: 'ಕರಾವಳಿ ಭತ್ತ & ಗೋಡಂಬಿ' },
      { name: 'Guwahati', nameKn: 'ಗುವಾಹಟಿ', state: 'Assam', stateKn: 'ಅಸ್ಸಾಂ', lat: 26.1445, lng: 91.7362, highlight: 'Assam Tea, Ginger & Rice', highlightKn: 'ಅಸ್ಸಾಂ ಚಹಾ & ಶುಂಠಿ' },
    ]
  },
  {
    id: 'karnataka',
    regionName: 'Karnataka (All 31 Districts)',
    regionNameKn: 'ಕರ್ನಾಟಕದ ಎಲ್ಲಾ 31 ಜಿಲ್ಲೆಗಳು',
    badge: '🏛️ Karnataka (31)',
    districts: [
      { name: 'Mandya', nameKn: 'ಮಂಡ್ಯ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 12.5218, lng: 76.8951, highlight: 'Sugar & Paddy Hub', highlightKn: 'ಸಕ್ಕರೆ & ಭತ್ತದ ನಾಡು' },
      { name: 'Bengaluru', nameKn: 'ಬೆಂಗಳೂರು', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 12.9716, lng: 77.5946, highlight: 'Horticulture & Vegetables', highlightKn: 'ತೋಟಗಾರಿಕೆ & ತರಕಾರಿಗಳು' },
      { name: 'Mysuru', nameKn: 'ಮೈಸೂರು', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 12.2958, lng: 76.6394, highlight: 'Paddy, Cotton & Banana', highlightKn: 'ಭತ್ತ & ಹತ್ತಿ' },
      { name: 'Hassan', nameKn: 'ಹಾಸನ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 13.0033, lng: 76.1004, highlight: 'Coffee, Potato & Maize', highlightKn: 'ಕಾಫಿ & ಆಲೂಗಡ್ಡೆ' },
      { name: 'Kolar', nameKn: 'ಕೋಲಾರ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 13.1367, lng: 78.1291, highlight: 'Tomato APMC Capital', highlightKn: 'ಟೊಮೇಟೊ ಮಂಡಿ' },
      { name: 'Chikkaballapur', nameKn: 'ಚಿಕ್ಕಬಳ್ಳಾಪುರ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 13.4355, lng: 77.7315, highlight: 'Grapes & Vegetables', highlightKn: 'ದ್ರಾಕ್ಷಿ & ತರಕಾರಿ' },
      { name: 'Tumakuru', nameKn: 'ತುಮಕೂರು', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 13.3379, lng: 77.1017, highlight: 'Coconut & Groundnut', highlightKn: 'ತೆಂಗು & ಕಡಲೆಕಾಯಿ' },
      { name: 'Ramanagara', nameKn: 'ರಾಮನಗರ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 12.7159, lng: 77.2814, highlight: 'Silk & Mangoes', highlightKn: 'ರೇಷ್ಮೆ & ಮಾವು' },
      { name: 'Chamarajanagar', nameKn: 'ಚಾಮರಾಜನಗರ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 11.9261, lng: 76.9437, highlight: 'Turmeric & Pulses', highlightKn: 'ಅರಿಶಿನ & ಬೇಳೆಕಾಳು' },
      { name: 'Shivamogga', nameKn: 'ಶಿವಮೊಗ್ಗ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 13.9299, lng: 75.5681, highlight: 'Arecanut & Paddy', highlightKn: 'ಅಡಿಕೆ & ಭತ್ತ' },
      { name: 'Chikkamagaluru', nameKn: 'ಚಿಕ್ಕಮಗಳೂರು', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 13.3161, lng: 75.7720, highlight: 'Coffee & Spices', highlightKn: 'ಕಾಫಿ & ಸಾಂಬಾರ ಬೆಳೆ' },
      { name: 'Kodagu', nameKn: 'ಕೊಡಗು', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 12.4244, lng: 75.7382, highlight: 'Coffee & Pepper', highlightKn: 'ಕಾಫಿ & ಕಾಳುಮೆಣಸು' },
      { name: 'Udupi', nameKn: 'ಉಡುಪಿ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 13.3409, lng: 74.7421, highlight: 'Paddy & Cashew', highlightKn: 'ಭತ್ತ & ಗೋಡಂಬಿ' },
      { name: 'Dakshina Kannada', nameKn: 'ದಕ್ಷಿಣ ಕನ್ನಡ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 12.8703, lng: 74.8806, highlight: 'Arecanut & Rubber', highlightKn: 'ಅಡಿಕೆ & ರಬ್ಬರ್' },
      { name: 'Uttara Kannada', nameKn: 'ಉತ್ತರ ಕನ್ನಡ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 14.8185, lng: 74.1332, highlight: 'Spices & Arecanut', highlightKn: 'ಸಾಂಬಾರ ಪದಾರ್ಥಗಳು' },
      { name: 'Dharwad', nameKn: 'ಧಾರವಾಡ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 15.4589, lng: 75.0078, highlight: 'Soybean & Onion', highlightKn: 'ಸೋಯಾಬೀನ್ & ಈರುಳ್ಳಿ' },
      { name: 'Belagavi', nameKn: 'ಬೆಳಗಾವಿ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 15.8497, lng: 74.4977, highlight: 'Sugarcane & Vegetables', highlightKn: 'ಕಬ್ಬು & ತರಕಾರಿಗಳು' },
      { name: 'Haveri', nameKn: 'ಹಾವೇರಿ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 14.7954, lng: 75.4026, highlight: 'Byadgi Chilli Capital', highlightKn: 'ಬ್ಯಾಡಗಿ ಮೆಣಸಿನಕಾಯಿ' },
      { name: 'Davanagere', nameKn: 'ದಾವಣಗೆರೆ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 14.4644, lng: 75.9218, highlight: 'Maize & Cotton', highlightKn: 'ಮೆಕ್ಕೆಜೋಳ & ಹತ್ತಿ' },
      { name: 'Chitradurga', nameKn: 'ಚಿತ್ರದುರ್ಗ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 14.2251, lng: 76.3980, highlight: 'Onion, Pomegranate & Ragi', highlightKn: 'ಈರುಳ್ಳಿ & ದಾಳಿಂಬೆ' },
      { name: 'Ballari', nameKn: 'ಬಳ್ಳಾರಿ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 15.1394, lng: 76.9214, highlight: 'Paddy, Cotton & Fig', highlightKn: 'ಭತ್ತ & ಅಂಜೂರ' },
      { name: 'Vijayanagara', nameKn: 'ವಿಜಯನಗರ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 15.2793, lng: 76.3904, highlight: 'Sugarcane & Banana', highlightKn: 'ಕಬ್ಬು & ಬಾಳೆ' },
      { name: 'Bagalkot', nameKn: 'ಬಾಗಲಕೋಟೆ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 16.1691, lng: 75.6615, highlight: 'Sugarcane & Pomegranate', highlightKn: 'ಕಬ್ಬು & ದಾಳಿಂಬೆ' },
      { name: 'Vijayapura', nameKn: 'ವಿಜಯಪುರ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 16.8302, lng: 75.7100, highlight: 'Grapes, Lemon & Millets', highlightKn: 'ದ್ರಾಕ್ಷಿ & ನಿಂಬೆ' },
      { name: 'Kalaburagi', nameKn: 'ಕಲಬುರಗಿ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 17.3297, lng: 76.8343, highlight: 'Red Gram / Tur Dal Bowl', highlightKn: 'ತೊಗರಿ ಬೇಳೆ ನಾಡು' },
      { name: 'Raichur', nameKn: 'ರಾಯಚೂರು', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 16.2120, lng: 77.3439, highlight: 'Sona Masoori Rice & Cotton', highlightKn: 'ಸೋನಾ ಮಸೂರಿ ಅಕ್ಕಿ' },
      { name: 'Koppal', nameKn: 'ಕೊಪ್ಪಳ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 15.3467, lng: 76.1557, highlight: 'Paddy & Guava', highlightKn: 'ಭತ್ತ & ಸೀಬೆಹಣ್ಣು' },
      { name: 'Gadag', nameKn: 'ಗದಗ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 15.4167, lng: 75.6167, highlight: 'Chilli, Onion & Bengal Gram', highlightKn: 'ಕಡಲೆ & ಈರುಳ್ಳಿ' },
      { name: 'Yadgir', nameKn: 'ಯಾದಗಿರಿ', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 16.7700, lng: 77.1400, highlight: 'Red Gram & Groundnut', highlightKn: 'ತೊಗರಿ & ಕಡಲೆಕಾಯಿ' },
      { name: 'Bidar', nameKn: 'ಬೀದರ್', state: 'Karnataka', stateKn: 'ಕರ್ನಾಟಕ', lat: 17.9104, lng: 77.5199, highlight: 'Soybean & Black Gram', highlightKn: 'ಸೋಯಾಬೀನ್ & ಉದ್ದು' },
    ]
  }
];

export const LiveLocationModal: React.FC<LiveLocationModalProps> = ({
  isOpen,
  onClose,
  lang,
  currentLocation,
  onLocationSelect,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>('all');
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'info' | 'success' | 'warning'>('info');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ name: string; state: string; lat: number; lng: number }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  // Handle Precise GPS Acquisition
  const handleAcquirePreciseGps = async () => {
    setIsLocatingGps(true);
    setStatusType('info');
    setStatusMessage(
      lang === 'kn'
        ? 'ಉಪಗ್ರಹ ಜಿಪಿಎಸ್ ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ... ನಿಖರ ಅಕ್ಷಾಂಶ ಮತ್ತು ರೇಖಾಂಶ ಪಡೆಯಲಾಗುತ್ತಿದೆ...'
        : 'Connecting to GPS satellites... Acquiring accurate latitude & longitude...'
    );

    try {
      const position = await getAccurateGpsPosition();
      const { latitude, longitude, accuracy, altitude, speed, heading } = position.coords;

      setStatusMessage(
        lang === 'kn'
          ? `ಜಿಪಿಎಸ್ ಅಕ್ಷಾಂಶ ಪತ್ತೆಯಾಗಿದೆ (${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E, ±${Math.round(accuracy)}m). ಊರು/ತಾಲೂಕು ಗುರುತಿಸಲಾಗುತ್ತಿದೆ...`
          : `Coordinates pinpointed (${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E, ±${Math.round(accuracy)}m). Reverse-geocoding village & taluk...`
      );

      const geo = await reverseGeocode(latitude, longitude, lang);
      const nearest = findNearestDistrict(latitude, longitude);

      const resolvedDistrict = geo.district || nearest.district.district;
      const resolvedState = geo.state || nearest.district.state;
      const cleanDistrictEn = getLocalizedDistrictName(resolvedDistrict, 'en');

      const liveLoc: UserLiveLocation = {
        lat: latitude,
        lng: longitude,
        accuracyMeters: accuracy,
        altitude: altitude ?? null,
        heading: heading ?? null,
        speed: speed ?? null,
        village: geo.village,
        taluk: geo.taluk,
        city: geo.city || resolvedDistrict,
        district: cleanDistrictEn,
        districtKn: nearest.district.districtKn,
        state: resolvedState,
        stateKn: geo.stateKn || nearest.district.stateKn,
        formattedAddress: geo.formattedAddress || `${geo.village ? geo.village + ', ' : ''}${resolvedDistrict}, ${resolvedState}`,
        source: 'gps',
        updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };

      onLocationSelect(liveLoc);
      setStatusType('success');
      setStatusMessage(
        lang === 'kn'
          ? `✅ ನಿಖರ ಜಿಪಿಎಸ್ ದೃಢೀಕರಿಸಲಾಗಿದೆ: ${geo.village ? geo.village + ', ' : ''}${resolvedDistrict} (ದೋಷ ಮಿತಿ: ±${Math.round(accuracy)} ಮೀಟರ್)`
          : `✅ Accurate GPS Locked: ${geo.village ? geo.village + ', ' : ''}${cleanDistrictEn}, ${resolvedState} (Margin: ±${Math.round(accuracy)}m)`
      );
    } catch (err: any) {
      console.warn('Accurate GPS acquisition failed, attempting IP/network detection:', err);
      setStatusType('warning');
      setStatusMessage(
        lang === 'kn'
          ? 'ಜಿಪಿಎಸ್ ಸಂಪರ್ಕ ಲಭ್ಯವಿಲ್ಲ. ಇಂಟರ್ನೆಟ್ ಜಾಲದಿಂದ ಅಂದಾಜು ಸ್ಥಳವನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ...'
          : 'Direct GPS satellite unreachable in browser iframe. Resolving network tower location...'
      );

      try {
        const ipLoc = await getIpLocation();
        if (!ipLoc) {
          throw new Error('IP location unavailable');
        }
        const nearest = findNearestDistrict(ipLoc.lat, ipLoc.lng);
        const resolvedDistrict = ipLoc.city || nearest.district.district;
        const cleanDistrictEn = getLocalizedDistrictName(resolvedDistrict, 'en');

        const netLoc: UserLiveLocation = {
          lat: ipLoc.lat,
          lng: ipLoc.lng,
          accuracyMeters: 500,
          city: cleanDistrictEn,
          district: cleanDistrictEn,
          districtKn: nearest.district.districtKn,
          state: ipLoc.state || nearest.district.state,
          formattedAddress: ipLoc.formattedAddress || `${cleanDistrictEn}, ${ipLoc.state || nearest.district.state}, India`,
          source: 'network',
          updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        };

        onLocationSelect(netLoc);
        setStatusType('success');
        setStatusMessage(
          lang === 'kn'
            ? `✅ ನೆಟ್‌ವರ್ಕ್ ಸ್ಥಳ ಪಡೆಯಲಾಗಿದೆ: ${cleanDistrictEn}, ${ipLoc.state}`
            : `✅ Network Location Detected: ${cleanDistrictEn}, ${ipLoc.state}`
        );
      } catch (fallbackErr) {
        setStatusType('warning');
        setStatusMessage(
          lang === 'kn'
            ? '⚠️ ಸ್ವಯಂಚಾಲಿತ ಸ್ಥಳ ಪತ್ತೆ ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಕೆಳಗಿನ ಪಟ್ಟಿಯಿಂದ ನಿಮ್ಮ ಜಿಲ್ಲೆಯನ್ನು ಆರಿಸಿ.'
            : '⚠️ Could not access GPS. Please tap your district below or search any town.'
        );
      }
    } finally {
      setIsLocatingGps(false);
    }
  };

  // Search input change
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim().length >= 2) {
      setIsSearching(true);
      searchIndianCities(val).then((results) => {
        setSearchResults(results);
        setIsSearching(false);
      });
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  // Select a preset district
  const handleSelectDistrict = (dist: DistrictItem) => {
    const cleanDistrictEn = getLocalizedDistrictName(dist.name, 'en');
    const newLoc: UserLiveLocation = {
      lat: dist.lat,
      lng: dist.lng,
      accuracyMeters: 25,
      district: cleanDistrictEn,
      districtKn: dist.nameKn,
      state: dist.state,
      stateKn: dist.stateKn,
      formattedAddress: `${cleanDistrictEn}, ${dist.state}, India`,
      source: 'manual',
      updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    onLocationSelect(newLoc);
    onClose();
  };

  // Select a searched city from All-India search
  const handleSelectSearchedCity = (city: { name: string; state: string; lat: number; lng: number }) => {
    const nearest = findNearestDistrict(city.lat, city.lng);
    const cleanCityEn = getLocalizedDistrictName(city.name, 'en');
    const newLoc: UserLiveLocation = {
      lat: city.lat,
      lng: city.lng,
      accuracyMeters: 30,
      city: cleanCityEn,
      district: cleanCityEn,
      districtKn: EN_TO_KN_DISTRICTS_MAP[cleanCityEn] || nearest.district.districtKn,
      state: city.state,
      formattedAddress: `${cleanCityEn}, ${city.state}, India`,
      source: 'manual',
      updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    onLocationSelect(newLoc);
    onClose();
  };

  const activeZone = ALL_INDIA_REGIONS.find((r) => r.id === selectedRegion) || ALL_INDIA_REGIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 text-white p-5 sm:p-6 flex items-start justify-between relative overflow-hidden shrink-0">
          <div className="relative z-10 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-amber-300 text-[11px] font-bold border border-emerald-400/30">
              <Crosshair className="w-3 h-3 text-amber-300" />
              <span>{lang === 'kn' ? 'ನಿಖರ ಲೈವ್ ಜಿಪಿಎಸ್ ಸ್ಥಳ' : 'Precise Live GPS Location'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight">
              {lang === 'kn' ? 'ಅಖಿಲ ಭಾರತ ಕೃಷಿ ವಲಯ & ಲೈವ್ ಸ್ಥಳ' : 'All-India Live Location & Agricultural Hubs'}
            </h2>
            <p className="text-emerald-200/90 text-xs max-w-md leading-relaxed">
              {lang === 'kn'
                ? 'ನಿಮ್ಮ ನಿಖರ ಲೈವ್ ಜಿಪಿಎಸ್ ಸ್ಥಳವನ್ನು ಪತ್ತೆಮಾಡಿ ಅಥವಾ ಭಾರತದ ಯಾವುದೇ ಕೃಷಿ ಜಿಲ್ಲೆಯನ್ನು ಆರಿಸಿ ಹವಾಮಾನ ಮತ್ತು ಮಂಡಿ ದರಗಳನ್ನು ಪಡೆಯಿರಿ.'
                : 'Acquire high-precision satellite GPS coordinates or select any agricultural hub across India to synchronize rainfall forecasts and mandi APMC prices.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition shrink-0 z-10"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Active Location Telemetry Card */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-stone-50 border-2 border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                    {lang === 'kn' ? 'ಪ್ರಸ್ತುತ ಸಕ್ರಿಯ ಸ್ಥಳ' : 'Current Active Location'}
                  </div>
                  <div className="font-extrabold text-stone-900 text-base sm:text-lg flex items-center gap-1.5">
                    <span>
                      {lang === 'kn'
                        ? (currentLocation.districtKn || currentLocation.district)
                        : getLocalizedDistrictName(currentLocation.district, 'en')}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">({currentLocation.state})</span>
                    {currentLocation.source === 'gps' && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-black uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        Live GPS
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {currentLocation.accuracyMeters && (
                <div className="text-right">
                  <span className="text-[10px] text-stone-500 font-bold uppercase block">
                    {lang === 'kn' ? 'ನಿಖರತೆ' : 'Accuracy'}
                  </span>
                  <span className="text-xs font-black text-emerald-800">
                    ±{Math.round(currentLocation.accuracyMeters)}m
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
              <div className="bg-white/80 p-2 rounded-xl border border-stone-200">
                <div className="text-[10px] text-stone-400 font-semibold uppercase">Latitude</div>
                <div className="font-bold text-stone-800 font-mono text-[11px] mt-0.5">
                  {currentLocation.lat.toFixed(4)}° N
                </div>
              </div>
              <div className="bg-white/80 p-2 rounded-xl border border-stone-200">
                <div className="text-[10px] text-stone-400 font-semibold uppercase">Longitude</div>
                <div className="font-bold text-stone-800 font-mono text-[11px] mt-0.5">
                  {currentLocation.lng.toFixed(4)}° E
                </div>
              </div>
              <div className="bg-white/80 p-2 rounded-xl border border-stone-200">
                <div className="text-[10px] text-stone-400 font-semibold uppercase">Source</div>
                <div className="font-bold text-emerald-800 uppercase text-[11px] mt-0.5">
                  {currentLocation.source === 'gps'
                    ? (lang === 'kn' ? 'ಉಪಗ್ರಹ ಜಿಪಿಎಸ್' : 'Satellite GPS')
                    : (lang === 'kn' ? 'ಆಯ್ಕೆ ಮಾಡಿದ ಸ್ಥಳ' : 'Station Select')}
                </div>
              </div>
              <div className="bg-white/80 p-2 rounded-xl border border-stone-200">
                <div className="text-[10px] text-stone-400 font-semibold uppercase">Last Synced</div>
                <div className="font-bold text-stone-800 text-[11px] mt-0.5">
                  {currentLocation.updatedAt || 'Just now'}
                </div>
              </div>
            </div>

            {currentLocation.formattedAddress && (
              <p className="text-xs text-stone-600 leading-snug font-medium pt-1">
                📍 <span className="font-semibold text-stone-800">{currentLocation.formattedAddress}</span>
              </p>
            )}
          </div>

          {/* Primary Action: Big GPS Detection Button */}
          <button
            onClick={handleAcquirePreciseGps}
            disabled={isLocatingGps}
            className={`w-full py-4 px-5 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-3 transition-all shadow-md active:scale-[0.99] ${
              isLocatingGps
                ? 'bg-stone-200 text-stone-500 cursor-wait'
                : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-emerald-700/20 hover:shadow-lg hover:scale-[1.01]'
            }`}
          >
            <Navigation className={`w-5 h-5 text-amber-300 ${isLocatingGps ? 'animate-spin' : ''}`} />
            <span>
              {isLocatingGps
                ? (lang === 'kn' ? 'ನಿಖರ ಜಿಪಿಎಸ್ ಸ್ಥಳ ಹುಡುಕಲಾಗುತ್ತಿದೆ...' : 'Acquiring Accurate Satellite GPS Fix...')
                : (lang === 'kn' ? 'ನನ್ನ ನಿಖರ ಲೈವ್ ಜಿಪಿಎಸ್ ಸ್ಥಳವನ್ನು ಪತ್ತೆಮಾಡಿ' : 'Detect Accurate Live GPS Location (Real-Time)')}
            </span>
          </button>

          {/* Real-time Status message feedback */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-bold flex items-start gap-2.5 transition-all animate-fadeIn ${
                statusType === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                  : statusType === 'warning'
                  ? 'bg-amber-50 text-amber-900 border border-amber-300'
                  : 'bg-sky-50 text-sky-900 border border-sky-300'
              }`}
            >
              {statusType === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              ) : (
                <Radio className="w-4 h-4 text-sky-700 shrink-0 mt-0.5 animate-pulse" />
              )}
              <div className="flex-1 leading-relaxed">{statusMessage}</div>
            </div>
          )}

          {/* Search Indian Cities & Towns Bar (All-India coverage) */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={
                  lang === 'kn'
                    ? 'ಭಾರತದ ಯಾವುದೇ ಗ್ರಾಮ, ತಾಲೂಕು, ನಗರ ಅಥವಾ ಪಿನ್‌ಕೋಡ್ ಹುಡುಕಿ...'
                    : 'Search any village, town, district, or pin code in India...'
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
              />
              {isSearching && (
                <RefreshCw className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 animate-spin" />
              )}
            </div>

            {/* Search Suggestions Dropdown */}
            {searchResults.length > 0 && (
              <div className="bg-white border border-stone-200 rounded-2xl shadow-lg max-h-48 overflow-y-auto divide-y divide-stone-100">
                {searchResults.map((city, idx) => (
                  <button
                    key={`${city.name}-${city.state}-${idx}`}
                    onClick={() => handleSelectSearchedCity(city)}
                    className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 flex items-center justify-between text-xs transition"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      <div>
                        <span className="font-bold text-stone-900">{city.name}</span>
                        <span className="text-stone-500 ml-1.5">({city.state})</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* All-India Region Tabs & Quick District Selector */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-700" />
                <span>
                  {lang === 'kn'
                    ? 'ಅಖಿಲ ಭಾರತ ಕೃಷಿ ವಲಯಗಳು & ಮಂಡಿಗಳು'
                    : 'All-India Agricultural Zones & Districts'}
                </span>
              </h3>
              <span className="text-[11px] text-stone-400 font-bold">
                {activeZone.districts.length} {lang === 'kn' ? 'ಜಿಲ್ಲೆಗಳು' : 'Hubs'}
              </span>
            </div>

            {/* Region Selector Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {ALL_INDIA_REGIONS.map((region) => {
                const isSelected = selectedRegion === region.id;
                return (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegion(region.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      isSelected
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {lang === 'kn' ? region.regionNameKn : region.badge}
                  </button>
                );
              })}
            </div>

            {/* Active Region Header Title */}
            <div className="text-[11px] font-bold text-emerald-900 bg-emerald-50/80 px-3 py-1.5 rounded-xl border border-emerald-100 flex items-center justify-between">
              <span>{lang === 'kn' ? activeZone.regionNameKn : activeZone.regionName}</span>
              <span className="text-[10px] text-emerald-700 font-semibold">
                {lang === 'kn' ? 'ನೇರ ಹವಾಮಾನ & ಮಂಡಿ ಸಿಂಕ್' : 'Live Weather & APMC Sync'}
              </span>
            </div>

            {/* Grid of Districts */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1">
              {activeZone.districts.map((dist) => {
                const isCurrent =
                  currentLocation.district.toLowerCase() === dist.name.toLowerCase() ||
                  currentLocation.district.toLowerCase() === dist.nameKn.toLowerCase();
                return (
                  <button
                    key={`${dist.name}-${dist.state}`}
                    onClick={() => handleSelectDistrict(dist)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isCurrent
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm font-black'
                        : 'bg-stone-50 hover:bg-emerald-50 text-stone-800 border-stone-200 hover:border-emerald-300 font-bold'
                    }`}
                  >
                    <div className="text-xs flex items-center justify-between">
                      <span className="truncate">{lang === 'kn' ? dist.nameKn : dist.name}</span>
                      {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-amber-300 shrink-0 ml-1" />}
                    </div>
                    <div
                      className={`text-[9px] truncate ${
                        isCurrent ? 'text-emerald-200' : 'text-stone-500 font-semibold'
                      }`}
                    >
                      {lang === 'kn' ? dist.stateKn : dist.state}
                    </div>
                    <div
                      className={`text-[9px] mt-0.5 truncate ${
                        isCurrent ? 'text-amber-200' : 'text-stone-400 font-normal'
                      }`}
                    >
                      {lang === 'kn' ? dist.highlightKn : dist.highlight}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-emerald-700" />
            <span>
              {lang === 'kn'
                ? 'ಸ್ಥಳವು ಹವಾಮಾನ ಮತ್ತು ಮಂಡಿ ಬೆಲೆಗಳನ್ನು ನವೀಕರಿಸುತ್ತದೆ'
                : 'Auto-syncs Real-Time Weather, Rain Radar & APMC Mandi prices'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs transition"
          >
            {lang === 'kn' ? 'ಮುಚ್ಚಿ' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
