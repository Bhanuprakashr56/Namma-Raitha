export type Language =
  | 'en' // English (Top Most)
  | 'as' // Assamese
  | 'bn' // Bengali
  | 'brx' // Bodo
  | 'doi' // Dogri
  | 'gu' // Gujarati
  | 'hi' // Hindi
  | 'kn' // Kannada
  | 'ks' // Kashmiri
  | 'kok' // Konkani
  | 'mai' // Maithili
  | 'ml' // Malayalam
  | 'mni' // Manipuri (Meitei)
  | 'mr' // Marathi
  | 'ne' // Nepali
  | 'or' // Odia
  | 'pa' // Punjabi
  | 'sa' // Sanskrit
  | 'sat' // Santali
  | 'sd' // Sindhi
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'ur'; // Urdu

export interface Product {
  id: string;
  name: string;
  nameKn: string;
  category: 'produce' | 'vegetable' | 'fruit' | 'grain' | 'pulse' | 'spices' | 'seeds' | 'fertilizers' | 'pesticides' | 'tools' | 'machinery' | 'irrigation';
  price: number;
  originalPrice?: number;
  unit: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  sellerName: string;
  sellerPhone: string;
  location: string;
  description: string;
  descriptionKn: string;
  image: string;
  organic?: boolean;
  featured?: boolean;
  subsidyPercentage?: number;
  brand?: string;
  dosageOrSpec?: string;
  deliveryDays?: number;
}

export interface CropDiagnosis {
  id: string;
  cropName: string;
  cropNameKn: string;
  diseaseName: string;
  diseaseNameKn: string;
  severity: 'None' | 'Low' | 'Moderate' | 'High' | 'Severe';
  confidence: number;
  symptoms: string[];
  organicRemedies: string[];
  chemicalTreatments: string[];
  preventiveMeasures: string[];
  timestamp: string;
  image?: string;
  isHealthy?: boolean;
  isPlantOrCrop?: boolean;
  pathogenType?: string;
  farmerSafetyNotice?: string;
}

export type CommodityCategory = 'vegetable' | 'fruit' | 'pulse' | 'grain';

export interface MandiPrice {
  id: string;
  commodity: string;
  commodityKn: string;
  category: CommodityCategory;
  state: string;
  market: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  unit: string;
  arrivalTons?: number;
  tradeNote?: string;
}

export interface ContractItem {
  id: string;
  buyerName: string;
  buyerType: 'Corporate Food Processor' | 'Agri Exporter' | 'Supermarket Chain' | 'Sugar/Rice Mill';
  crop: string;
  cropKn: string;
  requiredQuantityTons: number;
  offeredPricePerQuintal: number;
  durationMonths: number;
  advancePaymentPercent: number;
  location: string;
  requirements: string[];
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: 'Farmer' | 'Agri Specialist' | 'Progressive Grower' | 'Agronomist';
  senderLocation: string;
  channelId: string;
  text: string;
  image?: string;
  timestamp: string;
  likes: number;
  isQuery?: boolean;
  queryCrop?: string;
  queryStatus?: 'open' | 'answered' | 'resolved';
  replyToId?: string;
  replyToAuthor?: string;
  replyToText?: string;
}

export interface FarmerExperience {
  id: string;
  farmerName: string;
  village: string;
  district: string;
  phone?: string;
  crop: string;
  landAcreage: string;
  technique: string;
  title: string;
  story: string;
  costSaved: string;
  yieldGained: string;
  keyAdvice: string;
  image?: string;
  likes: number;
  commentsCount: number;
  date: string;
  category: 'organic' | 'water' | 'pest' | 'yield' | 'cost';
}

export interface ForumPost {
  id: string;
  author: string;
  authorRole: 'Farmer' | 'Agri Specialist' | 'Agronomist';
  location: string;
  title: string;
  content: string;
  cropTag: string;
  likes: number;
  replies: Array<{
    id: string;
    author: string;
    authorRole?: string;
    content: string;
    date: string;
  }>;
  date: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  status: 'Pending' | 'Confirmed' | 'Dispatched' | 'Delivered';
  orderDate: string;
}

export interface WeatherForecastDay {
  date: string;
  dayName: string;
  dayNameKn: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  conditionKn: string;
  icon: string;
  rainChance: number;
  rainfallMm: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  advisory: string;
  advisoryKn: string;
  sprayWindow: 'safe' | 'caution' | 'unsafe';
  irrigationNeed: 'low' | 'moderate' | 'high';
}

export interface HourlyForecast {
  time: string;
  temp: number;
  condition: string;
  conditionKn: string;
  icon: string;
  rainChance: number;
  humidity: number;
  windSpeed: number;
}

export interface DistrictAgroWeather {
  district: string;
  districtKn: string;
  state: string;
  stateKn?: string;
  lat?: number;
  lng?: number;
  zone?: 'north' | 'south' | 'west' | 'east' | 'central' | 'northeast';
  region: 'karnataka' | 'national';
  primaryCrops: string[];
  primaryCropsKn: string[];
  temp: number;
  feelsLike: number;
  condition: string;
  conditionKn: string;
  icon: string;
  rainChance: number;
  rainfall24hMm: number;
  humidity: number;
  wind: number;
  windDirection: string;
  uvIndex: number;
  soilMoisturePercent: number;
  dewPoint: number;
  pressureHpa: number;
  sunrise: string;
  sunset: string;
  aqi: number;
  agroAdvisory: {
    spraying: {
      status: 'safe' | 'caution' | 'unsafe';
      window: string;
      windowKn: string;
      reason: string;
      reasonKn: string;
    };
    irrigation: {
      recommendation: string;
      recommendationKn: string;
      waterSaveTip: string;
      waterSaveTipKn: string;
    };
    harvesting: {
      status: 'optimal' | 'hurry' | 'delay';
      desc: string;
      descKn: string;
    };
    pestRisk: {
      level: 'low' | 'moderate' | 'high';
      alert: string;
      alertKn: string;
      vulnerableCrops: string;
      vulnerableCropsKn: string;
    };
  };
  hourly: HourlyForecast[];
  forecast7Day: WeatherForecastDay[];
  alertBanner?: {
    severity: 'yellow' | 'orange' | 'red';
    headline: string;
    headlineKn: string;
    details: string;
    detailsKn: string;
    validTill: string;
  };
}

// Soil Health Advice Types
export type SoilType =
  | 'red_sandy_loam'
  | 'black_cotton'
  | 'laterite'
  | 'coastal_alluvial'
  | 'clay_loam';

export interface SoilHealthReport {
  id: string;
  farmerName: string;
  surveyNumber?: string;
  village: string;
  district: string;
  soilType: SoilType;
  targetCrop: string;
  ph: number;
  nitrogenKgHa: number;
  phosphorusKgHa: number;
  potassiumKgHa: number;
  organicCarbonPercent: number;
  electricalConductivity: number;
  zincPpm: number;
  boronPpm: number;
  overallScore: number;
  healthGrade: 'A (Optimal)' | 'B (Good)' | 'C (Deficient)' | 'D (Critical)';
  amendments: string[];
  fertilizerPrescription: {
    fertilizer: string;
    quantityPerAcre: string;
    timing: string;
  }[];
  organicRemedies: string[];
  testedDate: string;
}

// Crop Calendar Alert Types
export interface CropStageActivity {
  id: string;
  stageName: string;
  stageNameKn: string;
  dayStart: number;
  dayEnd: number;
  waterNeed: 'Low' | 'Medium' | 'High' | 'Critical';
  fertilizerAction: string;
  fertilizerActionKn: string;
  pestWatch: string;
  pestWatchKn: string;
  advisoryAlert: string;
  advisoryAlertKn: string;
  isUrgent?: boolean;
}

export interface CropCalendarPlan {
  id: string;
  cropName: string;
  cropNameKn: string;
  season: 'Kharif' | 'Rabi' | 'Summer';
  durationDays: number;
  stages: CropStageActivity[];
}

export interface FarmCalendarAlert {
  id: string;
  cropName: string;
  cropNameKn: string;
  title: string;
  titleKn: string;
  description: string;
  descriptionKn: string;
  dueDate: string;
  type: 'fertilizer' | 'irrigation' | 'pest_spray' | 'weeding' | 'harvest';
  severity: 'info' | 'warning' | 'urgent';
  completed: boolean;
  notifySms: boolean;
  notifyWhatsapp: boolean;
}

// Mandi Price Alert Types
export interface MandiPriceAlert {
  id: string;
  commodity: string;
  commodityKn?: string;
  mandi: string;
  targetPrice: number;
  currentPrice: number;
  condition: 'above' | 'below';
  status: 'active' | 'triggered';
  createdAt: string;
  triggeredAt?: string;
  phone: string;
  channel: 'sms' | 'whatsapp' | 'both';
  note?: string;
}

// User Roles & Authentication Types
export type UserRole = 'farmer' | 'consumer' | 'company' | 'contract_farming' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  nameKn?: string;
  role: UserRole;
  phone: string;
  email?: string;
  location: string;
  avatar?: string;
  organization?: string;
  farmDetails?: {
    acreage: number;
    primaryCrops: string[];
    kisanCreditCardNo?: string;
    pahaniId?: string;
  };
  companyDetails?: {
    companyName: string;
    gstin: string;
    procurementVolume: string;
    procurementFocus: string[];
  };
  contractDetails?: {
    entityName: string;
    fpoLicenseNo: string;
    activeContractsCount: number;
    coverageDistricts: string[];
  };
  adminDetails?: {
    designation: string;
    department: string;
    clearanceLevel: string;
  };
  joinedDate: string;
  isVerified: boolean;
}

export interface UserLiveLocation {
  lat: number;
  lng: number;
  accuracyMeters?: number;
  altitude?: number | null;
  heading?: number | null;
  speed?: number | null;
  village?: string;
  taluk?: string;
  city?: string;
  district: string;
  districtKn?: string;
  state: string;
  stateKn?: string;
  formattedAddress: string;
  source: 'gps' | 'network' | 'manual';
  updatedAt: string;
}
