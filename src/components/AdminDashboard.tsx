import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Users,
  Building2,
  Handshake,
  TrendingUp,
  FileCheck,
  AlertTriangle,
  Send,
  CheckCircle2,
  XCircle,
  Award,
  Search,
  Filter,
  PackageCheck,
  BadgeCheck,
  Landmark,
  DollarSign,
  Radio,
  FileText,
  Sprout,
  Smartphone,
  Laptop,
  Clock,
  MapPin,
  Phone,
  Mail,
  UserCheck,
  Download,
  Plus,
  Activity,
  X,
  ExternalLink,
  RefreshCw,
  Zap,
  Globe,
  ChevronRight
} from 'lucide-react';
import { AuthUser, Language } from '../types/nammaraitha';
import { AdminCompanyDirectory } from './AdminCompanyDirectory';

export interface StakeholderLoginRecord {
  id: string;
  name: string;
  nameKn?: string;
  role: 'farmer' | 'company' | 'contract_farming';
  phoneOrContact: string;
  officialIdentifier: string; // RTC/KCC for farmers, GSTIN for company, FPO License for contract
  location: string;
  locationKn?: string;
  district: string;
  scaleOrAcreage: string;
  cropsOrFocus: string;
  loginTime: string;
  lastActiveMinutes: number; // for sorting/filtering
  device: 'Android App' | 'iOS Mobile' | 'Web Desktop' | 'Mobile PWA';
  ipAddress: string;
  status: 'online' | 'active_today' | 'idle';
  verified: boolean;
  representative?: string;
}

interface AdminDashboardProps {
  currentUser: AuthUser | null;
  lang: Language;
  onOpenOneClickLogin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  lang,
  onOpenOneClickLogin,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'logins' | 'companies' | 'kyc' | 'contracts' | 'subsidies' | 'broadcast'>('companies');

  // Stakeholder Logins State
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'all' | 'farmer' | 'company' | 'contract_farming'>('all');
  const [loginSearchQuery, setLoginSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'online' | 'today'>('all');
  const [selectedLoginModal, setSelectedLoginModal] = useState<StakeholderLoginRecord | null>(null);
  const [liveToast, setLiveToast] = useState<string | null>(null);

  // Initial Comprehensive Stakeholder Logins Data
  const [stakeholderLogins, setStakeholderLogins] = useState<StakeholderLoginRecord[]>([
    // --- FARMER LOGINS ---
    {
      id: 'log-f-01',
      name: 'Ningappa Gowda',
      nameKn: 'ನಿಂಗಪ್ಪ ಗೌಡ',
      role: 'farmer',
      phoneOrContact: '+91 94481 22891',
      officialIdentifier: 'RTC-MND-4921 (KCC: SBIN-88912)',
      location: 'Pandavapura, Mandya',
      locationKn: 'ಪಾಂಡವಪುರ, ಮಂಡ್ಯ',
      district: 'Mandya',
      scaleOrAcreage: '4.5 Acres',
      cropsOrFocus: 'Sugarcane (Co 86032) & Paddy (BPT-5204)',
      loginTime: 'Just now (Online)',
      lastActiveMinutes: 1,
      device: 'Android App',
      ipAddress: '49.37.112.4 (BSNL Broadband Mandya)',
      status: 'online',
      verified: true,
    },
    {
      id: 'log-f-02',
      name: 'Malleshappa Badiger',
      nameKn: 'ಮಲ್ಲೇಶಪ್ಪ ಬಡಿಗೇರ',
      role: 'farmer',
      phoneOrContact: '+91 98452 77102',
      officialIdentifier: 'RTC-HVR-8812 (Bhoomi Pahani)',
      location: 'Hirekerur, Haveri',
      locationKn: 'ಹಿರೇಕೆರೂರು, ಹಾವೇರಿ',
      district: 'Haveri',
      scaleOrAcreage: '5.2 Acres',
      cropsOrFocus: 'Byadgi Chilli & Hybrid Maize',
      loginTime: '8 mins ago',
      lastActiveMinutes: 8,
      device: 'Web Desktop',
      ipAddress: '103.21.144.12 (Airtel Haveri)',
      status: 'online',
      verified: true,
    },
    {
      id: 'log-f-03',
      name: 'Savithramma Gowda',
      nameKn: 'ಸಾವಿತ್ರಮ್ಮ ಗೌಡ',
      role: 'farmer',
      phoneOrContact: '+91 97410 88219',
      officialIdentifier: 'RTC-NGM-9914 (Land Registry)',
      location: 'Nagamangala, Mandya',
      locationKn: 'ನಾಗಮಂಗಲ, ಮಂಡ್ಯ',
      district: 'Mandya',
      scaleOrAcreage: '3.8 Acres',
      cropsOrFocus: 'Ragi ML-365 & Sugarcane',
      loginTime: '24 mins ago',
      lastActiveMinutes: 24,
      device: 'Mobile PWA',
      ipAddress: '49.37.108.91 (Jio 5G)',
      status: 'online',
      verified: true,
    },
    {
      id: 'log-f-04',
      name: 'Basavaraj Patil',
      nameKn: 'ಬಸವರಾಜ ಪಾಟೀಲ',
      role: 'farmer',
      phoneOrContact: '+91 94490 33412',
      officialIdentifier: 'RTC-CTA-7711 (KCC: Canara Bank)',
      location: 'Challakere, Chitradurga',
      locationKn: 'ಚಳ್ಳಕೆರೆ, ಚಿತ್ರದುರ್ಗ',
      district: 'Chitradurga',
      scaleOrAcreage: '7.0 Acres',
      cropsOrFocus: 'Pomegranate & Bellary Red Onion',
      loginTime: '1 hour ago',
      lastActiveMinutes: 60,
      device: 'Android App',
      ipAddress: '117.211.89.5 (Jio Telecom)',
      status: 'active_today',
      verified: true,
    },
    {
      id: 'log-f-05',
      name: 'Shivakumar Swamy',
      nameKn: 'ಶಿವಕುಮಾರ ಸ್ವಾಮಿ',
      role: 'farmer',
      phoneOrContact: '+91 98801 44521',
      officialIdentifier: 'RTC-TPT-4109 (Bhoomi RTC)',
      location: 'Tiptur, Tumakuru',
      locationKn: 'ತಿಪಟೂರು, ತುಮಕೂರು',
      district: 'Tumakuru',
      scaleOrAcreage: '6.4 Acres',
      cropsOrFocus: 'Copra Coconut & Arecanut',
      loginTime: '2 hours ago',
      lastActiveMinutes: 120,
      device: 'Mobile PWA',
      ipAddress: '49.206.18.23 (Vi Cellular)',
      status: 'active_today',
      verified: true,
    },
    {
      id: 'log-f-06',
      name: 'Manjunatha Reddy',
      nameKn: 'ಮಂಜುನಾಥ ರೆಡ್ಡಿ',
      role: 'farmer',
      phoneOrContact: '+91 94488 99120',
      officialIdentifier: 'RTC-KLR-3318 (APMC Passbook)',
      location: 'Srinivasapura, Kolar',
      locationKn: 'ಶ್ರೀನಿವಾಸಪುರ, ಕೋಲಾರ',
      district: 'Kolar',
      scaleOrAcreage: '4.0 Acres',
      cropsOrFocus: 'Tomato & Yellow Capsicum',
      loginTime: '3 hours ago',
      lastActiveMinutes: 180,
      device: 'Android App',
      ipAddress: '106.51.82.19 (Airtel Broadband)',
      status: 'active_today',
      verified: true,
    },
    {
      id: 'log-f-07',
      name: 'Devendrappa Chaluvadi',
      nameKn: 'ದೇವೇಂದ್ರಪ್ಪ ಚಲುವಾದಿ',
      role: 'farmer',
      phoneOrContact: '+91 99012 33451',
      officialIdentifier: 'RTC-BGK-6612 (Bhoomi RTC)',
      location: 'Mudhol, Bagalkote',
      locationKn: 'ಮುಧೋಳ, ಬಾಗಲಕೋಟೆ',
      district: 'Bagalkote',
      scaleOrAcreage: '8.5 Acres',
      cropsOrFocus: 'Sugarcane & Sunflower',
      loginTime: '4 hours ago',
      lastActiveMinutes: 240,
      device: 'Web Desktop',
      ipAddress: '117.195.40.12 (BSNL Fiber)',
      status: 'active_today',
      verified: true,
    },

    // --- COMPANY / CORPORATE BUYER LOGINS ---
    {
      id: 'log-c-01',
      name: 'ITC Agri Business Division',
      nameKn: 'ಐಟಿಸಿ ಅಗ್ರಿ ಬ್ಯುಸಿನೆಸ್ ಡಿವಿಷನ್',
      role: 'company',
      phoneOrContact: '+91 80 2298 4400',
      officialIdentifier: 'GSTIN: 29AAACI1681G1ZB',
      location: 'Yeshwantpur APMC & Whitefield, Bengaluru',
      locationKn: 'ಯಶವಂತಪುರ ಎಪಿಎಂಸಿ, ಬೆಂಗಳೂರು',
      district: 'Bengaluru Urban',
      scaleOrAcreage: '150 Tons / Month Volume',
      cropsOrFocus: 'Byadgi Chilli, Sona Masoori Rice, Turmeric',
      loginTime: 'Just now (Online)',
      lastActiveMinutes: 2,
      device: 'Web Desktop',
      ipAddress: '14.143.12.89 (ITC Corporate Gateway)',
      status: 'online',
      verified: true,
      representative: 'Rajesh Varma (VP Agri Procurement)',
    },
    {
      id: 'log-c-02',
      name: 'BigBasket / Supermarket Grocery Supplies',
      nameKn: 'ಬಿಗ್‌ಬಾಸ್ಕೆಟ್ ಸೂಪರ್‌ಮಾರ್ಕೆಟ್ ಗ್ರೋಸರಿ',
      role: 'company',
      phoneOrContact: '+91 80 4321 8800',
      officialIdentifier: 'GSTIN: 29AABCS1429B1ZU',
      location: 'Whitefield Central Distribution Center, Bengaluru',
      locationKn: 'ವೈಟ್‌ಫೀಲ್ಡ್ ಸಿಡಿಸಿ, ಬೆಂಗಳೂರು',
      district: 'Bengaluru Urban',
      scaleOrAcreage: '45 Tons / Day Influx',
      cropsOrFocus: 'Farm Fresh Vegetables, Fruits & Organic Greens',
      loginTime: '15 mins ago',
      lastActiveMinutes: 15,
      device: 'Web Desktop',
      ipAddress: '182.73.19.44 (Tata Tele Enterprise)',
      status: 'online',
      verified: true,
      representative: 'Priya Menon (Director - Farm Sourcing)',
    },
    {
      id: 'log-c-03',
      name: 'Reliance Retail Agro Sourcing Hub',
      nameKn: 'ರಿಲಯನ್ಸ್ ರಿಟೇಲ್ ಅಗ್ರೋ ಸೋರ್ಸಿಂಗ್ ಹಬ್',
      role: 'company',
      phoneOrContact: '+91 836 220 9911',
      officialIdentifier: 'GSTIN: 29AABCR2311K1Z1',
      location: 'Hubballi Central APMC Market Yard',
      locationKn: 'ಹುಬ್ಬಳ್ಳಿ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ, ಧಾರವಾಡ',
      district: 'Dharwad',
      scaleOrAcreage: '220 Tons / Month Procurement',
      cropsOrFocus: 'Pulses, Toor Dal, Wheat & Maize',
      loginTime: '45 mins ago',
      lastActiveMinutes: 45,
      device: 'Web Desktop',
      ipAddress: '115.112.88.19 (Reliance Jio Corporate)',
      status: 'active_today',
      verified: true,
      representative: 'Anand Kulkarni (Regional Sourcing Lead)',
    },
    {
      id: 'log-c-04',
      name: 'Olam Agri India Pvt Ltd',
      nameKn: 'ಓಲಂ ಅಗ್ರಿ ಇಂಡಿಯಾ ಪ್ರೈ. ಲಿ.',
      role: 'company',
      phoneOrContact: '+91 8192 231 400',
      officialIdentifier: 'GSTIN: 29AAAC09823M1Z5',
      location: 'Davanagere Industrial Processing Zone',
      locationKn: 'ದಾವಣಗೆರೆ ಕೈಗಾರಿಕಾ ವಲಯ',
      district: 'Davanagere',
      scaleOrAcreage: '80 Tons / Month',
      cropsOrFocus: 'Industrial Maize, Soya & Spice Blends',
      loginTime: '1 hour ago',
      lastActiveMinutes: 60,
      device: 'Web Desktop',
      ipAddress: '103.44.20.12 (Vodafone Enterprise)',
      status: 'active_today',
      verified: true,
      representative: 'Ramesh Hegde (Factory Manager)',
    },
    {
      id: 'log-c-05',
      name: 'Ninjacart Hyperlocal Sourcing Network',
      nameKn: 'ನಿಂಜಾಕಾರ್ಟ್ ಹೈಪರ್‌ಲೋಕಲ್ ಸೋರ್ಸಿಂಗ್',
      role: 'company',
      phoneOrContact: '+91 80 6711 2200',
      officialIdentifier: 'GSTIN: 29AAGCN4412Q1ZX',
      location: 'Kolar & Hosakote Aggregation Hub',
      locationKn: 'ಕೋಲಾರ & ಹೊಸಕೋಟೆ ಹಬ್',
      district: 'Kolar',
      scaleOrAcreage: '35 Tons / Day High Speed',
      cropsOrFocus: 'Tomato, Potato, Onion & Seasonal Veg',
      loginTime: '2 hours ago',
      lastActiveMinutes: 120,
      device: 'Web Desktop',
      ipAddress: '14.139.155.6 (Ninjacart Tech Gateway)',
      status: 'active_today',
      verified: true,
      representative: 'Karthik Somayaji (Operations Head)',
    },
    {
      id: 'log-c-06',
      name: 'Adani Wilmar Agro Sourcing',
      nameKn: 'ಅದಾನಿ ವಿಲ್ಮಾರ್ ಅಗ್ರಿ ಸೋರ್ಸಿಂಗ್',
      role: 'company',
      phoneOrContact: '+91 8352 240 100',
      officialIdentifier: 'GSTIN: 29AAACA2201P1Z9',
      location: 'Vijayapura & Bagalkote Oilseed APMC',
      locationKn: 'ವಿಜಯಪುರ & ಬಾಗಲಕೋಟೆ ಎಪಿಎಂಸಿ',
      district: 'Vijayapura',
      scaleOrAcreage: '180 Tons / Month',
      cropsOrFocus: 'Mustard, Sunflower & Groundnut Oilseeds',
      loginTime: '3 hours ago',
      lastActiveMinutes: 180,
      device: 'Web Desktop',
      ipAddress: '122.166.19.88 (Adani Enterprise)',
      status: 'active_today',
      verified: true,
      representative: 'Sunil Rao (Procurement Officer)',
    },

    // --- CONTRACT FARMING LOGINS ---
    {
      id: 'log-cf-01',
      name: 'Sahyadri Agri Contracts & FPO Federation',
      nameKn: 'ಸಹ್ಯಾದ್ರಿ ಗುತ್ತಿಗೆ ಕೃಷಿ & ಎಫ್‌ಪಿಒ ಒಕ್ಕೂಟ',
      role: 'contract_farming',
      phoneOrContact: '+91 836 244 8911',
      officialIdentifier: 'FPO Lic: KA-AGRI-FPO-2023-774',
      location: 'Dharwad & Belagavi Agri Corridor',
      locationKn: 'ಧಾರವಾಡ & ಬೆಳಗಾವಿ ಕಾರಿಡಾರ್',
      district: 'Dharwad',
      scaleOrAcreage: '18 Contracts • 450+ Farmers (1,480 Ac)',
      cropsOrFocus: 'Certified Seed Production, Soybean & Gherkins',
      loginTime: 'Just now (Online)',
      lastActiveMinutes: 3,
      device: 'Web Desktop',
      ipAddress: '117.195.82.3 (FPO Central Fiber)',
      status: 'online',
      verified: true,
      representative: 'Dr. Praveen Patil (Chairman, FPO Federation)',
    },
    {
      id: 'log-cf-02',
      name: 'McCain Foods Processing Potato Division',
      nameKn: 'ಮೆಕ್‌ಕೇನ್ ಫುಡ್ಸ್ ಆಲೂಗೆಡ್ಡೆ ಗುತ್ತಿಗೆ ವಿಭಾಗ',
      role: 'contract_farming',
      phoneOrContact: '+91 8172 268 900',
      officialIdentifier: 'Lic: KA-AGRI-FPO-2022-310',
      location: 'Hassan & Kolar Potato Network',
      locationKn: 'ಹಾಸನ & ಕೋಲಾರ ಜಾಲ',
      district: 'Hassan',
      scaleOrAcreage: '12 Contracts • 380 Farmers (1,200 Ac)',
      cropsOrFocus: 'Processing Potato (Kufri Chipsona-1, Lady Rosetta)',
      loginTime: '18 mins ago',
      lastActiveMinutes: 18,
      device: 'Web Desktop',
      ipAddress: '122.166.44.2 (McCain Agri Server)',
      status: 'online',
      verified: true,
      representative: 'Vikram Joshi (Senior Agronomist)',
    },
    {
      id: 'log-cf-03',
      name: 'Marico Safflower & Agro Alliance',
      nameKn: 'ಮಾರಿಕೋ ಕುಸುಬೆ ಮತ್ತು ಅಗ್ರಿ ಒಪ್ಪಂದ',
      role: 'contract_farming',
      phoneOrContact: '+91 8354 220 500',
      officialIdentifier: 'Lic: KA-AGRI-FPO-2024-512',
      location: 'Vijayapura & Kalaburagi Safflower Belt',
      locationKn: 'ವಿಜಯಪುರ & ಕಲಬುರಗಿ ಬೆಲ್ಟ್',
      district: 'Kalaburagi',
      scaleOrAcreage: '8 Contracts • 850 Farmers (2,100 Ac)',
      cropsOrFocus: 'Cold-Pressed Safflower & High-Oleic Sunflower',
      loginTime: '1 hour ago',
      lastActiveMinutes: 60,
      device: 'Web Desktop',
      ipAddress: '103.248.112.5 (Marico Regional Office)',
      status: 'active_today',
      verified: true,
      representative: 'Sharanappa Biradar (Field Coordinator)',
    },
    {
      id: 'log-cf-04',
      name: 'PepsiCo India Agro Contract Network',
      nameKn: 'ಪೆಪ್ಸಿಕೋ ಇಂಡಿಯಾ ಕೃಷಿ ಗುತ್ತಿಗೆ ನೆಟ್‌ವರ್ಕ್',
      role: 'contract_farming',
      phoneOrContact: '+91 821 240 3311',
      officialIdentifier: 'Lic: KA-AGRI-FPO-2021-198',
      location: 'Mysuru & Chamarajanagar Agri Belt',
      locationKn: 'ಮೈಸೂರು & ಚಾಮರಾಜನಗರ ಬೆಲ್ಟ್',
      district: 'Mysuru',
      scaleOrAcreage: '14 Contracts • 320 Farmers (950 Ac)',
      cropsOrFocus: 'Specialty Chip Potato & Industrial Sweet Corn',
      loginTime: '3 hours ago',
      lastActiveMinutes: 180,
      device: 'Web Desktop',
      ipAddress: '14.98.71.18 (PepsiCo India Intranet)',
      status: 'active_today',
      verified: true,
      representative: 'Kavitha Swaminathan (Supply Chain Head)',
    },
    {
      id: 'log-cf-05',
      name: 'Organic Mandya Farmer Producer Co.',
      nameKn: 'ಆರ್ಗ್ಯಾನಿಕ್ ಮಂಡ್ಯ ರೈತ ಉತ್ಪಾದಕ ಕಂಪನಿ',
      role: 'contract_farming',
      phoneOrContact: '+91 8232 277 400',
      officialIdentifier: 'Lic: KA-AGRI-FPO-2020-044',
      location: 'Mandya Sugarcane & Jaggery Corridor',
      locationKn: 'ಮಂಡ್ಯ ಕಬ್ಬು & ಬೆಲ್ಲ ಕಾರಿಡಾರ್',
      district: 'Mandya',
      scaleOrAcreage: '22 Contracts • 620 Farmers (1,800 Ac)',
      cropsOrFocus: 'Chemical-Free Jaggery Sugarcane, Traditional Ragi',
      loginTime: '4 hours ago',
      lastActiveMinutes: 240,
      device: 'Mobile PWA',
      ipAddress: '49.37.119.8 (FPO Office Mandya)',
      status: 'active_today',
      verified: true,
      representative: 'Madhu Chandan (Founder & Managing Trustee)',
    },
  ]);

  // State for Farmer KYC Approvals
  const [kycRequests, setKycRequests] = useState([
    {
      id: 'KYC-8812',
      farmerName: 'Malleshappa Badiger',
      village: 'Hirekerur, Haveri',
      surveyNo: 'Sy. No. 142/2A',
      acreage: '5.2 Acres',
      crop: 'Byadgi Chilli & Maize',
      kccStatus: 'Linked (Canara Bank)',
      status: 'Pending',
      submissionDate: 'Today, 08:30 AM',
      docType: 'Digital RTC Pahani (Bhoomi)'
    },
    {
      id: 'KYC-8813',
      farmerName: 'Savithramma Gowda',
      village: 'Nagamangala, Mandya',
      surveyNo: 'Sy. No. 89/1',
      acreage: '3.8 Acres',
      crop: 'Sugarcane & Ragi',
      kccStatus: 'Linked (State Bank of India)',
      status: 'Pending',
      submissionDate: 'Today, 09:15 AM',
      docType: 'Land Registry & Aadhaar'
    },
    {
      id: 'KYC-8809',
      farmerName: 'Ningappa Gowda',
      village: 'Pandavapura, Mandya',
      surveyNo: 'Sy. No. 56/4',
      acreage: '4.5 Acres',
      crop: 'Paddy & Sugarcane',
      kccStatus: 'Verified',
      status: 'Approved',
      submissionDate: 'Yesterday',
      docType: 'Bhoomi RTC Verified'
    }
  ]);

  // State for Subsidy Policies
  const [subsidies, setSubsidies] = useState([
    { id: 'sub-1', scheme: 'SMAM Battery Knapsack Sprayer', category: 'Tools', rate: '50% DBT', quotaUsed: '78%', active: true },
    { id: 'sub-2', scheme: 'NFSM Certified Foundation Paddy Seeds', category: 'Seeds', rate: '₹20/kg Flat Discount', quotaUsed: '92%', active: true },
    { id: 'sub-3', scheme: 'Micro-Irrigation Drip Kit (PMKSY)', category: 'Irrigation', rate: '90% for SC/ST, 75% Gen', quotaUsed: '64%', active: true },
    { id: 'sub-4', scheme: 'Bio-Fertilizer (Trichoderma & PSB)', category: 'Fertilizers', rate: '40% Subsidy', quotaUsed: '51%', active: true },
  ]);

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('Urgent: Yellow Stem Borer Alert for Paddy in Mandya/Mysuru');
  const [broadcastMessage, setBroadcastMessage] = useState('Paddy growers are advised to monitor pheromone traps. Release Trichogramma japonicum @ 20,000 egg cards/acre or spray Chlorantraniliprole 18.5% SC @ 0.3ml/L.');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const handleApproveKyc = (id: string) => {
    setKycRequests(prev => prev.map(k => k.id === id ? { ...k, status: 'Approved' } : k));
  };

  const handleRejectKyc = (id: string) => {
    setKycRequests(prev => prev.map(k => k.id === id ? { ...k, status: 'Rejected' } : k));
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  // Filtered Stakeholder Logins
  const filteredLogins = useMemo(() => {
    return stakeholderLogins.filter((item) => {
      // Role filter
      if (selectedRoleFilter !== 'all' && item.role !== selectedRoleFilter) {
        return false;
      }
      // Status filter
      if (selectedStatusFilter === 'online' && item.status !== 'online') {
        return false;
      }
      if (selectedStatusFilter === 'today' && item.status === 'idle') {
        return false;
      }
      // Search query filter
      if (loginSearchQuery.trim()) {
        const q = loginSearchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q) || (item.nameKn && item.nameKn.includes(q));
        const matchesLocation = item.location.toLowerCase().includes(q) || item.district.toLowerCase().includes(q);
        const matchesDetails = item.cropsOrFocus.toLowerCase().includes(q) || item.officialIdentifier.toLowerCase().includes(q);
        const matchesRep = item.representative && item.representative.toLowerCase().includes(q);
        return Boolean(matchesName || matchesLocation || matchesDetails || matchesRep);
      }
      return true;
    });
  }, [stakeholderLogins, selectedRoleFilter, selectedStatusFilter, loginSearchQuery]);

  // Role Counts for Badges
  const farmerCount = stakeholderLogins.filter((s) => s.role === 'farmer').length;
  const companyCount = stakeholderLogins.filter((s) => s.role === 'company').length;
  const contractCount = stakeholderLogins.filter((s) => s.role === 'contract_farming').length;
  const onlineCount = stakeholderLogins.filter((s) => s.status === 'online').length;

  // Simulate a live login event
  const handleSimulateNewLogin = (roleToSimulate: 'farmer' | 'company' | 'contract_farming') => {
    const timestamp = 'Just now (Online)';
    let newEntry: StakeholderLoginRecord;

    if (roleToSimulate === 'farmer') {
      newEntry = {
        id: `log-f-sim-${Date.now()}`,
        name: 'Gowdappa Patil (New Login)',
        nameKn: 'ಗೌಡಪ್ಪ ಪಾಟೀಲ (ಹೊಸ ಲಾಗಿನ್)',
        role: 'farmer',
        phoneOrContact: '+91 94480 ' + Math.floor(10000 + Math.random() * 90000),
        officialIdentifier: `RTC-BLR-${Math.floor(1000 + Math.random() * 9000)}`,
        location: 'Belagavi Rural',
        locationKn: 'ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ',
        district: 'Belagavi',
        scaleOrAcreage: '5.5 Acres',
        cropsOrFocus: 'Sugarcane & Green Gram',
        loginTime: timestamp,
        lastActiveMinutes: 0,
        device: 'Android App',
        ipAddress: '117.195.91.44 (Jio Belagavi)',
        status: 'online',
        verified: true,
      };
    } else if (roleToSimulate === 'company') {
      newEntry = {
        id: `log-c-sim-${Date.now()}`,
        name: 'Heritage Foods Sourcing Team',
        nameKn: 'ಹೆರಿಟೇಜ್ ಫುಡ್ಸ್ ಸೋರ್ಸಿಂಗ್',
        role: 'company',
        phoneOrContact: '+91 80 4112 ' + Math.floor(1000 + Math.random() * 9000),
        officialIdentifier: `GSTIN: 29AABCH${Math.floor(1000 + Math.random() * 9000)}K1Z5`,
        location: 'Kolar & Chittoor Border Hub',
        locationKn: 'ಕೋಲಾರ ಹಬ್',
        district: 'Kolar',
        scaleOrAcreage: '50 Tons / Month Dairy & Feed',
        cropsOrFocus: 'Silage Corn, Fodder & Cattle Feed',
        loginTime: timestamp,
        lastActiveMinutes: 0,
        device: 'Web Desktop',
        ipAddress: '14.143.88.21 (Heritage Enterprise)',
        status: 'online',
        verified: true,
        representative: 'Suresh Babu (Dairy Operations Manager)',
      };
    } else {
      newEntry = {
        id: `log-cf-sim-${Date.now()}`,
        name: 'Cauvery Bio-Agri Contract Consortium',
        nameKn: 'ಕಾವೇರಿ ಬಯೋ-ಅಗ್ರಿ ಗುತ್ತಿಗೆ ಒಕ್ಕೂಟ',
        role: 'contract_farming',
        phoneOrContact: '+91 821 255 ' + Math.floor(1000 + Math.random() * 9000),
        officialIdentifier: `FPO Lic: KA-AGRI-FPO-2025-${Math.floor(100 + Math.random() * 900)}`,
        location: 'Mandya & Mysuru Sugar Belt',
        locationKn: 'ಮಂಡ್ಯ & ಮೈಸೂರು ಬೆಲ್ಟ್',
        district: 'Mandya',
        scaleOrAcreage: '9 Contracts • 280 Farmers (750 Ac)',
        cropsOrFocus: 'Organic Jaggery Sugarcane & Red Banana',
        loginTime: timestamp,
        lastActiveMinutes: 0,
        device: 'Web Desktop',
        ipAddress: '103.248.90.14 (Cauvery FPO Central)',
        status: 'online',
        verified: true,
        representative: 'Chandrashekar (Chief Coordinator)',
      };
    }

    setStakeholderLogins((prev) => [newEntry, ...prev]);
    setLiveToast(`New live session registered: ${newEntry.name} (${newEntry.role.toUpperCase()})`);
    setTimeout(() => setLiveToast(null), 4000);
  };

  // Export Logins Audit to CSV
  const handleExportCsv = () => {
    const headers = ['ID', 'Role', 'Name', 'Phone/Contact', 'Identifier', 'District', 'Location', 'Scale/Acreage', 'Crops/Procurement', 'Login Device', 'IP Address', 'Status'];
    const rows = filteredLogins.map((s) => [
      s.id,
      s.role.toUpperCase(),
      `"${s.name}"`,
      `"${s.phoneOrContact}"`,
      `"${s.officialIdentifier}"`,
      s.district,
      `"${s.location}"`,
      `"${s.scaleOrAcreage}"`,
      `"${s.cropsOrFocus}"`,
      s.device,
      s.ipAddress,
      s.status.toUpperCase(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `namma_raitha_stakeholder_logins_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Restrict to Admin Interface only
  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-purple-100 text-purple-900 border border-purple-200 flex items-center justify-center mx-auto shadow-md">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-heading">
            {lang === 'kn' ? 'ಅಡ್ಮಿನ್ ಲಾಗಿನ್ ಅಗತ್ಯವಿದೆ' : 'Administrator Interface Restricted'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
            {lang === 'kn'
              ? 'ಈ ವಿಭಾಗವು ಕೇವಲ ರಾಜ್ಯ ಕೃಷಿ ನಿರ್ದೇಶನಾಲಯದ ಅಧಿಕೃತ ಅಡ್ಮಿನ್‌ಗಳಿಗೆ ಮಾತ್ರ ಲಭ್ಯವಿದೆ. ದಯವಿಟ್ಟು ಅಡ್ಮಿನ್ ಖಾತೆಯೊಂದಿಗೆ ಲಾಗಿನ್ ಆಗಿ.'
              : 'This interface is restricted to authorized State Agriculture Directorate administrators. Please authenticate with administrator privileges.'}
          </p>
        </div>
        <button
          onClick={onOpenOneClickLogin}
          className="px-6 py-3 rounded-2xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs shadow-lg transition flex items-center gap-2 mx-auto"
        >
          <ShieldCheck className="w-4 h-4 text-amber-300" />
          <span>{lang === 'kn' ? 'ಅಡ್ಮಿನ್ ಆಗಿ ಲಾಗಿನ್ ಆಗಿ' : 'Authenticate as Administrator'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Live Toast for Login Events */}
      {liveToast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-950 text-white border-2 border-emerald-400 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-bounce-short">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{liveToast}</span>
        </div>
      )}

      {/* Top Directorate Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-950 via-slate-950 to-emerald-950 text-white p-6 sm:p-8 shadow-2xl border border-purple-800/60">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/90 border border-purple-400/40 text-purple-200 text-xs font-bold shadow-xs">
              <ShieldCheck className="w-4 h-4 text-purple-300" />
              <span>Government of Karnataka &bull; Department of Agriculture</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading leading-tight">
              {lang === 'kn' ? 'ರಾಜ್ಯ ಕೃಷಿ ನಿರ್ದೇಶನಾಲಯ ಅಡ್ಮಿನ್ ಕನ್ಸೋಲ್' : 'State Agri Directorate Admin Console'}
            </h1>

            <p className="text-purple-100/90 text-xs sm:text-sm leading-relaxed">
              {lang === 'kn'
                ? 'ಕರ್ನಾಟಕದ ರೈತರು, ಕಂಪನಿಗಳು, ಗುತ್ತಿಗೆ ಕೃಷಿ ಒಪ್ಪಂದಗಳು ಮತ್ತು ಸಬ್ಸಿಡಿ ಬಿಡುಗಡೆಗಳ ಕೇಂದ್ರೀಕೃತ ನಿರ್ವಹಣಾ ಫಲಕ.'
                : 'Centralized state administration portal for stakeholder session monitoring, farmer KYC approvals, corporate contracts, and subsidy allocations.'}
            </p>

            <div className="flex items-center gap-2 text-xs pt-1">
              <span className="font-bold text-amber-300">
                Super Admin: {currentUser?.name || 'Pooja Deshmukh, IAS'}
              </span>
              <span className="text-purple-300">&bull; Joint Director of Agriculture</span>
            </div>
          </div>

          {/* Quick Role Switcher Button */}
          <div className="shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center space-y-2">
            <div className="text-[11px] text-purple-200 font-semibold">Testing Different Roles?</div>
            <button
              onClick={onOpenOneClickLogin}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs shadow transition flex items-center gap-1.5 mx-auto"
            >
              <span>⚡ Switch Role (1-Click)</span>
            </button>
            <div className="text-[10px] text-purple-300">Farmer &bull; Company &bull; Contract &bull; Admin</div>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-purple-500/10 via-emerald-500/10 to-transparent pointer-events-none" />
      </section>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold">Active Logins Today</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900">{stakeholderLogins.length}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{onlineCount} Online Right Now</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold">Farmer Sessions</span>
            <Sprout className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900">{farmerCount}</div>
          <div className="text-[11px] text-stone-500 mt-1">Bhoomi RTC Linked</div>
        </div>

        <div
          onClick={() => setActiveAdminTab('companies')}
          className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs cursor-pointer hover:border-blue-400 hover:shadow-md transition group"
          title="Click to view full registered companies list"
        >
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold group-hover:text-blue-900 transition">Corporate Buyers</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900">12 Verified</div>
          <div className="text-[11px] text-blue-600 font-bold mt-1 flex items-center gap-1">
            <span>View Companies List &rarr;</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold">Contract Sponsors</span>
            <Handshake className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900">{contractCount}</div>
          <div className="text-[11px] text-amber-700 font-bold mt-1">MSP Guaranteed FPOs</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold">Subsidies Disbursed</span>
            <Landmark className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900">₹3.42 Cr</div>
          <div className="text-[11px] text-purple-600 font-bold mt-1">Direct Bank Transfer</div>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-stone-200 pb-2">
        {/* NEW: Primary List of Companies requested by user */}
        <button
          onClick={() => setActiveAdminTab('companies')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeAdminTab === 'companies'
              ? 'bg-blue-900 text-white shadow-md ring-2 ring-blue-400/50'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Building2 className="w-4 h-4 text-blue-400" />
          <span>{lang === 'kn' ? '🏢 ಕಂಪನಿಗಳ ಪಟ್ಟಿ (ಖರೀದಿದಾರರು)' : '🏢 List of Companies (Corporate Buyers)'}</span>
          <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black">
            12 Registered
          </span>
        </button>

        {/* Stakeholder Logins Tab */}
        <button
          onClick={() => setActiveAdminTab('logins')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeAdminTab === 'logins'
              ? 'bg-purple-900 text-white shadow-md ring-2 ring-purple-400/50'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Users className="w-4 h-4 text-amber-300" />
          <span>{lang === 'kn' ? '👥 ಲಾಗಿನ್ ಪಟ್ಟಿ (ರೈತರು, ಕಂಪನಿ, ಗುತ್ತಿಗೆ)' : '👥 Stakeholder Logins (Farmer, Company, Contract)'}</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black">
            {stakeholderLogins.length} Active
          </span>
        </button>

        <button
          onClick={() => setActiveAdminTab('kyc')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeAdminTab === 'kyc'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Farmer KYC & Pahani ({kycRequests.filter(k => k.status === 'Pending').length} Pending)</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('contracts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeAdminTab === 'contracts'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Handshake className="w-3.5 h-3.5" />
          <span>Contract Farming Oversight</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('subsidies')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeAdminTab === 'subsidies'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>Govt Subsidies & DBT Policies</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('broadcast')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeAdminTab === 'broadcast'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Statewide Emergency SMS Broadcast</span>
        </button>
      </div>

      {/* =========================================================================
          TAB: REGISTERED COMPANIES DIRECTORY (REQUESTED BY USER)
         ========================================================================= */}
      {activeAdminTab === 'companies' && (
        <AdminCompanyDirectory lang={lang} />
      )}

      {/* =========================================================================
          TAB 1: STAKEHOLDER LOGINS DIRECTORY (FARMER, COMPANY, CONTRACT FARMING)
         ========================================================================= */}
      {activeAdminTab === 'logins' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-7 shadow-sm space-y-6">
          {/* Header & Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-extrabold text-stone-900 text-lg font-heading">
                  {lang === 'kn' ? 'ನೈಜ-ಸಮಯದ ಲಾಗಿನ್ ಪಟ್ಟಿ ಮತ್ತು ಸಕ್ರಿಯ ಬಳಕೆದಾರರು' : 'Real-Time Stakeholder Logins & Active Sessions Directory'}
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-1 max-w-3xl">
                {lang === 'kn'
                  ? 'ರೈತರು, ಕಂಪನಿಗಳು ಹಾಗೂ ಗುತ್ತಿಗೆ ಕೃಷಿ ಪ್ರವರ್ತಕರ ಸಕ್ರಿಯ ಲಾಗಿನ್ ಅವಧಿಗಳು, ಸಾಧನ ಮಾಹಿತಿ, ಭೂಮಿ ಪರಿಶೀಲನೆ ಮತ್ತು ಐಪಿ ದಾಖಲೆಗಳು.'
                  : 'Live directory tracking all authenticated sessions across Farmers, Corporate Buyer Companies, and Contract Farming Sponsors in Karnataka.'}
              </p>
            </div>

            {/* Top Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportCsv}
                className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-purple-100 text-stone-800 hover:text-purple-900 border border-stone-300 font-bold text-xs transition flex items-center gap-1.5 shadow-2xs"
                title="Download complete session audit report"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit (.CSV)</span>
              </button>

              <div className="relative group">
                <button
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs shadow-md transition flex items-center gap-1.5"
                  title="Simulate new live login for testing"
                >
                  <Zap className="w-3.5 h-3.5 fill-emerald-950" />
                  <span>+ Simulate Live Login ▾</span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-2xl shadow-xl border border-stone-200 p-1.5 z-40 hidden group-hover:block space-y-1">
                  <button
                    onClick={() => handleSimulateNewLogin('farmer')}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-emerald-950 hover:bg-emerald-50 rounded-xl transition flex items-center gap-2"
                  >
                    <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Simulate Farmer Login</span>
                  </button>
                  <button
                    onClick={() => handleSimulateNewLogin('company')}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-blue-950 hover:bg-blue-50 rounded-xl transition flex items-center gap-2"
                  >
                    <Building2 className="w-3.5 h-3.5 text-blue-700" />
                    <span>Simulate Company Login</span>
                  </button>
                  <button
                    onClick={() => handleSimulateNewLogin('contract_farming')}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-amber-950 hover:bg-amber-50 rounded-xl transition flex items-center gap-2"
                  >
                    <Handshake className="w-3.5 h-3.5 text-amber-700" />
                    <span>Simulate Contract Login</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-stone-50/80 rounded-2xl p-3 sm:p-4 border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Role Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSelectedRoleFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedRoleFilter === 'all'
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                All Logins ({stakeholderLogins.length})
              </button>

              <button
                onClick={() => setSelectedRoleFilter('farmer')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedRoleFilter === 'farmer'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Sprout className="w-3.5 h-3.5 text-emerald-500" />
                <span>{lang === 'kn' ? 'ರೈತರು' : 'Farmers'}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
                  {farmerCount}
                </span>
              </button>

              <button
                onClick={() => setSelectedRoleFilter('company')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedRoleFilter === 'company'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-blue-500" />
                <span>{lang === 'kn' ? 'ಕಂಪನಿಗಳು' : 'Companies'}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px]">
                  {companyCount}
                </span>
              </button>

              <button
                onClick={() => setSelectedRoleFilter('contract_farming')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedRoleFilter === 'contract_farming'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Handshake className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'kn' ? 'ಗುತ್ತಿಗೆ ಕೃಷಿ' : 'Contract Farming'}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 text-[10px]">
                  {contractCount}
                </span>
              </button>
            </div>

            {/* Status Filter & Search */}
            <div className="flex items-center gap-2">
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold bg-white text-stone-700 focus:outline-none"
              >
                <option value="all">All Session Status</option>
                <option value="online">🟢 Online Now</option>
                <option value="today">Active Today</option>
              </select>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search name, district, GSTIN, crop..."
                  value={loginSearchQuery}
                  onChange={(e) => setLoginSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-stone-300 text-xs bg-white text-stone-900 w-48 sm:w-64 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Quick jump to Company Directory */}
          <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-purple-50/90 rounded-2xl p-3.5 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <span className="font-extrabold text-blue-950 text-xs block">
                  {lang === 'kn' ? 'ನೊಂದಾಯಿತ ಕಂಪನಿಗಳ ಅಧಿಕೃತ ನಿರ್ದೇಶನಾಲಯ ಪಟ್ಟಿ (೧೨ ಸಂಸ್ಥೆಗಳು)' : 'Official Directorate Certified Companies Register (12 Agri Enterprises)'}
                </span>
                <span className="text-[11px] text-blue-800">
                  {lang === 'kn' ? 'ಎಲ್ಲಾ ಕಂಪನಿಗಳ ಜಿಎಸ್‌ಟಿಐಎನ್, ಎಪಿಎಂಸಿ ಪರವಾನಗಿ, ಮಾಸಿಕ ಬೇಡಿಕೆ ಮತ್ತು ಕಾಂಟ್ಯಾಕ್ಟ್ ವಿವರಗಳು.' : 'View complete corporate dossiers, APMC licenses, monthly MT off-take, and direct sourcing contacts.'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setActiveAdminTab('companies')}
              className="px-3.5 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition shadow-2xs flex items-center gap-1.5 self-start sm:self-auto shrink-0"
            >
              <span>{lang === 'kn' ? 'ಕಂಪನಿಗಳ ಪಟ್ಟಿ ತೆರೆಯಿರಿ' : 'Open List of Companies'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Stakeholder Logins Table */}
          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-100 text-stone-600 uppercase text-[10px] font-bold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-3.5">Stakeholder / Role</th>
                  <th className="py-3 px-3">Official ID / Registry</th>
                  <th className="py-3 px-3">Location & District</th>
                  <th className="py-3 px-3">Operational Scope / Focus</th>
                  <th className="py-3 px-3">Session & Device</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredLogins.map((item) => {
                  const isFarmer = item.role === 'farmer';
                  const isCompany = item.role === 'company';
                  const isContract = item.role === 'contract_farming';

                  return (
                    <tr key={item.id} className="hover:bg-purple-50/40 transition">
                      {/* Name & Role */}
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black shrink-0 relative ${
                              isFarmer
                                ? 'bg-emerald-100 text-emerald-800'
                                : isCompany
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isFarmer && <Sprout className="w-4 h-4" />}
                            {isCompany && <Building2 className="w-4 h-4" />}
                            {isContract && <Handshake className="w-4 h-4" />}

                            {item.status === 'online' && (
                              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
                            )}
                          </div>

                          <div>
                            <div className="font-extrabold text-stone-900 text-xs flex items-center gap-1.5">
                              <span>{item.name}</span>
                              {item.verified && (
                                <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 inline shrink-0" />
                              )}
                            </div>
                            <div className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5">
                              <Phone className="w-2.5 h-2.5 text-stone-400" />
                              <span>{item.phoneOrContact}</span>
                            </div>
                            {item.representative && (
                              <div className="text-[10px] text-purple-700 font-medium">
                                Rep: {item.representative}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Official Identifier */}
                      <td className="py-3 px-3 font-mono text-[11px] font-semibold text-stone-800">
                        <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">
                          {item.officialIdentifier}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1 text-stone-800 font-semibold">
                          <MapPin className="w-3 h-3 text-purple-600 shrink-0" />
                          <span>{item.location}</span>
                        </div>
                        <div className="text-[10px] text-stone-400 pl-4">{item.district} District</div>
                      </td>

                      {/* Scope & Focus */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-stone-900 text-[11px]">
                          {item.scaleOrAcreage}
                        </div>
                        <div className="text-[10px] text-stone-500 truncate max-w-xs" title={item.cropsOrFocus}>
                          {item.cropsOrFocus}
                        </div>
                      </td>

                      {/* Device & Session IP */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1 text-stone-800 font-medium">
                          {item.device.includes('Android') || item.device.includes('Mobile') ? (
                            <Smartphone className="w-3 h-3 text-stone-500 shrink-0" />
                          ) : (
                            <Laptop className="w-3 h-3 text-stone-500 shrink-0" />
                          )}
                          <span className="text-[11px]">{item.device}</span>
                        </div>
                        <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                          {item.loginTime}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        {item.status === 'online' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                            ONLINE NOW
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                            <Clock className="w-3 h-3 text-stone-400" />
                            ACTIVE TODAY
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setSelectedLoginModal(item)}
                          className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold text-[11px] transition"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredLogins.length === 0 && (
            <div className="text-center py-10 bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs">
              No matching stakeholder login records found for your filter.
            </div>
          )}

          {/* Quick Category Summary Footer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-950 block">Farmers Active</span>
                <span className="text-sm font-extrabold text-emerald-800">{farmerCount} Logged-in accounts</span>
              </div>
              <Sprout className="w-6 h-6 text-emerald-600 opacity-60" />
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-950 block">Companies Active</span>
                <span className="text-sm font-extrabold text-blue-800">{companyCount} Procurement divisions</span>
              </div>
              <Building2 className="w-6 h-6 text-blue-600 opacity-60" />
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-950 block">Contract Sponsors</span>
                <span className="text-sm font-extrabold text-amber-800">{contractCount} FPOs & Corporate alliances</span>
              </div>
              <Handshake className="w-6 h-6 text-amber-600 opacity-60" />
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: FARMER KYC & PAHANI APPROVAL QUEUE
         ========================================================================= */}
      {activeAdminTab === 'kyc' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-stone-900 text-base">
                Farmer Verification & Digital Pahani Approval Queue
              </h3>
              <p className="text-xs text-stone-500">
                Validate Bhoomi RTC records to grant farmers certified seller status and priority DBT subsidy credentials.
              </p>
            </div>
            <span className="text-xs font-bold text-purple-900 bg-purple-100 px-3 py-1 rounded-full self-start sm:self-auto">
              Automated Bhoomi Integration: Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-600 uppercase text-[10px] font-bold border-y border-stone-200">
                <tr>
                  <th className="py-3 px-3">Req ID</th>
                  <th className="py-3 px-3">Farmer Name</th>
                  <th className="py-3 px-3">Location & Survey No</th>
                  <th className="py-3 px-3">Acreage & Crop</th>
                  <th className="py-3 px-3">KCC & Pahani</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {kycRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-stone-50/80">
                    <td className="py-3 px-3 font-mono text-purple-900 font-bold">{req.id}</td>
                    <td className="py-3 px-3 font-semibold text-stone-900">{req.farmerName}</td>
                    <td className="py-3 px-3">
                      <div>{req.village}</div>
                      <div className="text-[10px] text-stone-400 font-mono">{req.surveyNo}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-emerald-800">{req.acreage}</div>
                      <div className="text-[10px] text-stone-500">{req.crop}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-block bg-purple-50 text-purple-900 border border-purple-200 px-2 py-0.5 rounded text-[10px] font-medium">
                        {req.kccStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                        req.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1.5">
                      {req.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => handleApproveKyc(req.id)}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition shadow-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectKyc(req.id)}
                            className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg text-xs font-bold transition"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-stone-400 text-xs italic">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: CONTRACT FARMING OVERSIGHT
         ========================================================================= */}
      {activeAdminTab === 'contracts' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="font-extrabold text-stone-900 text-base">
              Statewide Institutional Contract Farming Registry
            </h3>
            <p className="text-xs text-stone-500">
              Legally binding tripartite agreements between registered FPOs, food processors, and smallholder farmers with state price guarantees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-purple-950">
                <span>ITC Sona Masoori Rice Contract</span>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px]">Active</span>
              </div>
              <div className="text-xs text-stone-600">
                <strong>Sponsor:</strong> ITC Agri Business Division<br />
                <strong>Farmers Enrolled:</strong> 420 smallholders in Gangavathi & Sindhanur<br />
                <strong>Guaranteed Price:</strong> ₹2,850/Quintal + 10% APMC Premium<br />
                <strong>Escrow Deposit:</strong> ₹1.2 Cr deposited in SBI Krishi Bhavan
              </div>
            </div>

            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-blue-950">
                <span>McCain Foods Potato Processing Contract</span>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px]">Active</span>
              </div>
              <div className="text-xs text-stone-600">
                <strong>Sponsor:</strong> McCain Foods India<br />
                <strong>Farmers Enrolled:</strong> 180 farmers in Hassan & Kolar<br />
                <strong>Guaranteed Price:</strong> ₹1,600/Quintal fixed floor<br />
                <strong>Input Support:</strong> Certified disease-free seed tubers supplied
              </div>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                <span>Marico Safflower Oilseed Alliance</span>
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px]">Review</span>
              </div>
              <div className="text-xs text-stone-600">
                <strong>Sponsor:</strong> Marico Ltd (Saffola)<br />
                <strong>Farmers Enrolled:</strong> 310 dryland farmers in Kalaburagi<br />
                <strong>Guaranteed Price:</strong> ₹5,800/Quintal MSP guarantee<br />
                <strong>Insurance:</strong> AIC Kharif Weather Index Protection
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: GOVT SUBSIDIES & DBT ALLOCATION
         ========================================================================= */}
      {activeAdminTab === 'subsidies' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-stone-900 text-base">
                Direct Benefit Transfer (DBT) Krishi Subsidy Schemes
              </h3>
              <p className="text-xs text-stone-500">
                Active state & central subsidy allocations for farm machinery, micro-irrigation, and certified seeds.
              </p>
            </div>
            <button className="px-3.5 py-1.5 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-xs">
              + Launch New Scheme Policy
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subsidies.map((sub) => (
              <div key={sub.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex items-start justify-between">
                <div className="space-y-1">
                  <div className="font-bold text-sm text-stone-900">{sub.scheme}</div>
                  <div className="text-xs text-purple-900 font-semibold">{sub.rate} &bull; Category: {sub.category}</div>
                  <div className="text-xs text-stone-500">Quota Disbursed: <span className="font-bold text-emerald-700">{sub.quotaUsed}</span></div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Active DBT</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: STATEWIDE EMERGENCY SMS BROADCAST
         ========================================================================= */}
      {activeAdminTab === 'broadcast' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-600 animate-pulse" />
            <div>
              <h3 className="font-extrabold text-stone-900 text-base">
                Statewide Krishi Emergency Alert Broadcast
              </h3>
              <p className="text-xs text-stone-500">
                Sends instant SMS advisories and banner warnings to all 42,850+ farmers and FPOs in Karnataka.
              </p>
            </div>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4 max-w-2xl pt-2">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Alert Title / ವಿಷಯ</label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Advisory Content / ಸಂದೇಶ</label>
              <textarea
                required
                rows={3}
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-stone-500">
                Channels: SMS Gateway, WhatsApp Alerts & Home Banner Ticker
              </span>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs shadow flex items-center gap-1.5 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Broadcast Alert</span>
              </button>
            </div>

            {broadcastSent && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Broadcast dispatched successfully to 42,850 farmer mobile numbers!</span>
              </div>
            )}
          </form>
        </div>
      )}

      {/* =========================================================================
          MODAL: DETAILED STAKEHOLDER SESSION AUDIT
         ========================================================================= */}
      {selectedLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-stone-200 shadow-2xl overflow-hidden my-6 animate-scale-up">
            {/* Header */}
            <div className={`p-6 text-white flex items-center justify-between ${
              selectedLoginModal.role === 'farmer'
                ? 'bg-gradient-to-r from-emerald-900 to-teal-950'
                : selectedLoginModal.role === 'company'
                ? 'bg-gradient-to-r from-blue-900 to-slate-950'
                : 'bg-gradient-to-r from-amber-900 to-stone-950'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white font-black shadow-inner">
                  {selectedLoginModal.role === 'farmer' && <Sprout className="w-5 h-5 text-amber-300" />}
                  {selectedLoginModal.role === 'company' && <Building2 className="w-5 h-5 text-sky-300" />}
                  {selectedLoginModal.role === 'contract_farming' && <Handshake className="w-5 h-5 text-amber-300" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white flex items-center gap-1.5">
                    <span>{selectedLoginModal.name}</span>
                    <BadgeCheck className="w-4 h-4 text-amber-300" />
                  </h3>
                  <p className="text-xs text-white/80 uppercase font-mono tracking-wider">
                    ROLE: {selectedLoginModal.role.toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLoginModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold">Official Identifier</span>
                  <span className="font-mono font-bold text-stone-900">{selectedLoginModal.officialIdentifier}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold">Phone / Contact</span>
                  <span className="font-semibold text-stone-900">{selectedLoginModal.phoneOrContact}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold">District & Hub</span>
                  <span className="font-semibold text-stone-900">{selectedLoginModal.location}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold">Scope / Capacity</span>
                  <span className="font-bold text-emerald-800">{selectedLoginModal.scaleOrAcreage}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-stone-200 space-y-2">
                <span className="text-[10px] text-stone-400 block font-semibold">Crops / Procurement Specialty</span>
                <p className="text-stone-800 font-medium leading-relaxed">{selectedLoginModal.cropsOrFocus}</p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-1.5">
                <span className="text-[10px] text-purple-900 block font-bold uppercase tracking-wider">Session & Security Audit</span>
                <div className="grid grid-cols-2 gap-2 text-stone-700">
                  <div><strong>Login Device:</strong> {selectedLoginModal.device}</div>
                  <div><strong>Session Status:</strong> {selectedLoginModal.status.toUpperCase()}</div>
                  <div className="col-span-2 font-mono text-[11px]">
                    <strong>Client IP:</strong> {selectedLoginModal.ipAddress}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                <span>State Directorate Verified Session</span>
              </span>
              <button
                onClick={() => setSelectedLoginModal(null)}
                className="px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold transition shadow-xs"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
