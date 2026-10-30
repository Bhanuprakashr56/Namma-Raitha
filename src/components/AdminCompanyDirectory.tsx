import React, { useState, useMemo } from 'react';
import {
  Building2,
  Search,
  Filter,
  CheckCircle2,
  Download,
  Plus,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  ExternalLink,
  Award,
  BadgeCheck,
  TrendingUp,
  FileText,
  DollarSign,
  X,
  Printer,
  ChevronRight,
  Layers,
  Sparkles,
  RefreshCw,
  Landmark,
  Briefcase
} from 'lucide-react';
import { Language } from '../types/nammaraitha';

export interface RegisteredCompanyRecord {
  id: string;
  name: string;
  nameKn: string;
  category: 'FMCG Food Processing' | 'Retail & Supermarket' | 'Grain & Pulses Aggregator' | 'Edible Oils & Seeds' | 'Beverages & Plantation' | 'Organic & Certified Foods' | 'Contract Processor';
  categoryKn: string;
  gstin: string;
  cin: string;
  apmcLicense: string;
  headquarters: string;
  headquartersKn: string;
  karnatakaHubs: string[];
  procurementFocus: string[];
  monthlyVolumeMT: number;
  annualProcurementCr: number;
  partneredFarmers: number;
  activeContractsCount: number;
  escrowStatus: 'verified' | 'in_review' | 'pending';
  escrowBank: string;
  creditRating: string;
  complianceGrade: 'Grade-1 APMC' | 'Grade-2 APMC' | 'National Central';
  contactPerson: {
    name: string;
    designation: string;
    phone: string;
    email: string;
  };
  establishedYear: number;
  description: string;
  descriptionKn: string;
  status: 'active' | 'certified' | 'under_audit';
}

const INITIAL_COMPANIES: RegisteredCompanyRecord[] = [
  {
    id: 'COMP-ITC-01',
    name: 'ITC Agri Business Division',
    nameKn: 'ಐಟಿಸಿ ಅಗ್ರಿ ಬ್ಯುಸಿನೆಸ್ ಡಿವಿಷನ್',
    category: 'FMCG Food Processing',
    categoryKn: 'ಎಫ್‌ಎಂಸಿಜಿ ಆಹಾರ ಸಂಸ್ಕರಣೆ',
    gstin: '29AAACI1681G1ZB',
    cin: 'L16005WB1910PLC001985',
    apmcLicense: 'KA-APMC-BNG-8821',
    headquarters: 'Whitefield & Yeshwantpur, Bengaluru',
    headquartersKn: 'ವೈಟ್‌ಫೀಲ್ಡ್ ಮತ್ತು ಯಶವಂತಪುರ, ಬೆಂಗಳೂರು',
    karnatakaHubs: ['Yeshwantpur APMC (Bengaluru)', 'Byadgi Chilli Yard (Haveri)', 'Raichur Grain Mandi', 'Dharwad'],
    procurementFocus: ['Byadgi Chilli', 'Sona Masoori Paddy', 'Turmeric Rhizomes', 'Sharbati Wheat'],
    monthlyVolumeMT: 2500,
    annualProcurementCr: 128.5,
    partneredFarmers: 3850,
    activeContractsCount: 24,
    escrowStatus: 'verified',
    escrowBank: 'State Bank of India (Mandya & Bengaluru Agri Escrow)',
    creditRating: 'CRISIL AAA (Highest Safety)',
    complianceGrade: 'Grade-1 APMC',
    contactPerson: {
      name: 'Rajesh Varma',
      designation: 'VP - South India Agri Procurement',
      phone: '+91 80 2298 4400',
      email: 'rajesh.varma@itc.in'
    },
    establishedYear: 1910,
    description: 'Procures high-grade Byadgi chilli, spices, and premium Sona Masoori paddy with 100% direct bank transfer within 48 hours of weighment.',
    descriptionKn: 'ಬ್ಯಾಡಗಿ ಮೆಣಸಿನಕಾಯಿ, ಮಸಾಲೆಗಳು ಹಾಗೂ ಸೋನಾ ಮಸೂರಿ ಭತ್ತವನ್ನು ನೇರ ತೂಕದ 48 ಗಂಟೆಗಳೊಳಗೆ ಡಿಬಿಟಿ ಮೂಲಕ ಖರೀದಿಸುತ್ತದೆ.',
    status: 'certified'
  },
  {
    id: 'COMP-BB-02',
    name: 'BigBasket (Supermarket Grocery Supplies)',
    nameKn: 'ಬಿಗ್‌ಬಾಸ್ಕೆಟ್ ಸೂಪರ್‌ಮಾರ್ಕೆಟ್ ಗ್ರೋಸರಿ ಸಪ್ಲೈಸ್',
    category: 'Retail & Supermarket',
    categoryKn: 'ಚಿಲ್ಲರೆ ಮಾರಾಟ ಮತ್ತು ಸೂಪರ್‌ಮಾರ್ಕೆಟ್',
    gstin: '29AABCS1429B1ZU',
    cin: 'U51101KA2011PTC060747',
    apmcLicense: 'KA-APMC-BNG-9934',
    headquarters: 'Domlur & Whitefield CDC, Bengaluru',
    headquartersKn: 'ದೋಮ್ಲೂರು & ವೈಟ್‌ಫೀಲ್ಡ್ ಸಿಡಿಸಿ, ಬೆಂಗಳೂರು',
    karnatakaHubs: ['Whitefield Central CDC', 'Kolar Mandi Collection Center', 'Malur Mega Distribution', 'Mysuru Hub'],
    procurementFocus: ['Farm Fresh Vegetables', 'Exotic Greens', 'Kolar Tomatoes', 'Robusta Bananas', 'Papaya'],
    monthlyVolumeMT: 1350,
    annualProcurementCr: 72.0,
    partneredFarmers: 2850,
    activeContractsCount: 16,
    escrowStatus: 'verified',
    escrowBank: 'HDFC Corporate FastSettle Escrow',
    creditRating: 'ICRA AA+ (Stable)',
    complianceGrade: 'Grade-1 APMC',
    contactPerson: {
      name: 'Priya Menon',
      designation: 'Director - Farm Direct Sourcing',
      phone: '+91 80 4321 8800',
      email: 'priya.menon@bigbasket.com'
    },
    establishedYear: 2011,
    description: 'Largest fresh vegetables and fruits aggregator in southern Karnataka, sourcing directly from over 2,800 registered smallholder farmers.',
    descriptionKn: 'ದಕ್ಷಿಣ ಕರ್ನಾಟಕದಲ್ಲಿ ತಾಜಾ ತರಕಾರಿಗಳು ಮತ್ತು ಹಣ್ಣುಗಳ ಅತಿ ದೊಡ್ಡ ಸಂಗ್ರಹಕಾರರು; 2,800 ಕ್ಕೂ ಹೆಚ್ಚು ಸಣ್ಣ ರೈತರಿಂದ ನೇರ ಖರೀದಿ.',
    status: 'active'
  },
  {
    id: 'COMP-RIL-03',
    name: 'Reliance Retail Agro Sourcing Hub (Jio Krishi)',
    nameKn: 'ರಿಲಯನ್ಸ್ ರಿಟೇಲ್ ಅಗ್ರೋ ಸೋರ್ಸಿಂಗ್ (ಜಿಯೋ ಕೃಷಿ)',
    category: 'Retail & Supermarket',
    categoryKn: 'ಚಿಲ್ಲರೆ ಮಾರಾಟ ಮತ್ತು ಸೂಪರ್‌ಮಾರ್ಕೆಟ್',
    gstin: '29AABCR2311K1Z1',
    cin: 'U01100MH1999PLC120563',
    apmcLicense: 'KA-APMC-DHW-4410',
    headquarters: 'APMC Yard Hubballi & Bengaluru',
    headquartersKn: 'ಎಪಿಎಂಸಿ ಯಾರ್ಡ್ ಹುಬ್ಬಳ್ಳಿ & ಬೆಂಗಳೂರು',
    karnatakaHubs: ['Hubballi Central APMC Yard', 'Kalaburagi Pulse Complex', 'Belagavi Agro Siding', 'Davanagere'],
    procurementFocus: ['Kalaburagi Toor Dal', 'Chana Dal', 'Wheat', 'Maize', 'Bellary Red Onion', 'Groundnut'],
    monthlyVolumeMT: 3200,
    annualProcurementCr: 164.0,
    partneredFarmers: 4120,
    activeContractsCount: 30,
    escrowStatus: 'verified',
    escrowBank: 'ICICI Corporate Agri Clearing Escrow',
    creditRating: 'CRISIL AAA (Prime Quality)',
    complianceGrade: 'Grade-1 APMC',
    contactPerson: {
      name: 'Anand Kulkarni',
      designation: 'Regional Sourcing Head - Karnataka & Goa',
      phone: '+91 836 220 9911',
      email: 'anand.kulkarni@ril.com'
    },
    establishedYear: 1999,
    description: 'Bulk procurer of pulses, whole grains, and dry staples across North Karnataka with guaranteed APMC floor pricing and electronic weighbridges.',
    descriptionKn: 'ಉತ್ತರ ಕರ್ನಾಟಕದಾದ್ಯಂತ ಬೇಳೆಕಾಳುಗಳು ಮತ್ತು ಧಾನ್ಯಗಳ ಪ್ರಮುಖ ಖರೀದಿದಾರ; ಎಪಿಎಂಸಿ ದರ ಖಾತರಿ ಮತ್ತು ವಿದ್ಯುನ್ಮಾನ ತೂಕ ವ್ಯವಸ್ಥೆ.',
    status: 'certified'
  },
  {
    id: 'COMP-NC-04',
    name: 'Ninjacart (63Ideas Infolabs Pvt Ltd)',
    nameKn: 'ನಿಂಜಾಕಾರ್ಟ್ (೬೩ ಐಡಿಯಾಸ್ ಇನ್ಫೋಲ್ಯಾಬ್ಸ್)',
    category: 'Retail & Supermarket',
    categoryKn: 'ಬಿ2ಬಿ ಸರಬರಾಜು ಜಾಲ',
    gstin: '29AAGCN4412Q1ZX',
    cin: 'U74900KA2015PTC080789',
    apmcLicense: 'KA-APMC-KLR-7712',
    headquarters: 'HSR Layout & Hosakote Aggregation Hub',
    headquartersKn: 'ಎಚ್‌ಎಸ್‌ಆರ್ ಲೇಔಟ್ & ಹೊಸಕೋಟೆ ಹಬ್',
    karnatakaHubs: ['Kolar Mandi Hub', 'Hosakote Aggregation Yard', 'Chikkaballapur Siding', 'Chintamani'],
    procurementFocus: ['Kolar Tomato', 'Hassan Potato', 'Bellary Onion', 'Capsicum', 'Carrot & Beans'],
    monthlyVolumeMT: 1950,
    annualProcurementCr: 94.2,
    partneredFarmers: 4400,
    activeContractsCount: 18,
    escrowStatus: 'verified',
    escrowBank: 'Axis Bank FastDisburse Agri Escrow',
    creditRating: 'CRISIL A1+ (Short Term Excellence)',
    complianceGrade: 'Grade-1 APMC',
    contactPerson: {
      name: 'Karthik Somayaji',
      designation: 'Operations Head - Karnataka Perishables',
      phone: '+91 80 6711 2200',
      email: 'karthik.s@ninjacart.com'
    },
    establishedYear: 2015,
    description: 'Tech-driven B2B supply chain connecting tomato and vegetable growers directly to 12,000+ retail outlets across Karnataka.',
    descriptionKn: 'ತಂತ್ರಜ್ಞಾನ ಚಾಲಿತ ಪೂರೈಕೆ ಜಾಲ; ಟೊಮೆಟೊ ಮತ್ತು ತರಕಾರಿ ಬೆಳೆಗಾರರನ್ನು ಕರ್ನಾಟಕದ 12,000+ ಚಿಲ್ಲರೆ ಅಂಗಡಿಗಳಿಗೆ ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸುತ್ತದೆ.',
    status: 'active'
  },
  {
    id: 'COMP-ADANI-05',
    name: 'Adani Wilmar Ltd (Fortune Agro Sourcing)',
    nameKn: 'ಅದಾನಿ ವಿಲ್ಮಾರ್ ಲಿಮಿಟೆಡ್ (ಫಾರ್ಚೂನ್ ಅಗ್ರೋ)',
    category: 'Edible Oils & Seeds',
    categoryKn: 'ಖಾದ್ಯ ತೈಲ ಮತ್ತು ಎಣ್ಣೆಕಾಳುಗಳು',
    gstin: '29AAACA2201P1Z9',
    cin: 'L15146GJ1999PLC035320',
    apmcLicense: 'KA-APMC-VJP-3381',
    headquarters: 'Vijayapura & Bagalkote Industrial Zone',
    headquartersKn: 'ವಿಜಯಪುರ & ಬಾಗಲಕೋಟೆ ಕೈಗಾರಿಕಾ ವಲಯ',
    karnatakaHubs: ['Vijayapura APMC Oilseed Complex', 'Bagalkote Processing Yard', 'Sindhanur Siding'],
    procurementFocus: ['Sunflower Seeds', 'Yellow Mustard', 'Kusube (Safflower)', 'Groundnut Pods'],
    monthlyVolumeMT: 2100,
    annualProcurementCr: 110.0,
    partneredFarmers: 1650,
    activeContractsCount: 14,
    escrowStatus: 'verified',
    escrowBank: 'State Bank of India Corporate Agri Division',
    creditRating: 'CRISIL AA+ (Stable Outlook)',
    complianceGrade: 'Grade-1 APMC',
    contactPerson: {
      name: 'Sunil Rao',
      designation: 'Zonal Sourcing Manager - Oilseeds',
      phone: '+91 8352 240 100',
      email: 'sunil.rao@adaniwilmar.in'
    },
    establishedYear: 1999,
    description: 'Contract procurement and MSP buyback for sunflower and oilseed farmers with dedicated crushing facilities in northern Karnataka.',
    descriptionKn: 'ಉತ್ತರ ಕರ್ನಾಟಕದಲ್ಲಿ ಸಂಸ್ಕರಣಾ ಘಟಕ ಹೊಂದಿರುವ ಸೂರ್ಯಕಾಂತಿ ಮತ್ತು ಎಣ್ಣೆಕಾಳು ಬೆಳೆಗಾರರಿಗೆ ಎಂಎಸ್‌ಪಿ ಖಾತರಿಯ ಖರೀದಿ ಒಪ್ಪಂದ.',
    status: 'certified'
  },
  {
    id: 'COMP-OLAM-06',
    name: 'Olam Agri India Pvt Ltd',
    nameKn: 'ಓಲಂ ಅಗ್ರಿ ಇಂಡಿಯಾ ಪ್ರೈವೇಟ್ ಲಿಮಿಟೆಡ್',
    category: 'Grain & Pulses Aggregator',
    categoryKn: 'ಧಾನ್ಯ ಮತ್ತು ಬೇಳೆಕಾಳುಗಳ ಸಂಗ್ರಹಕಾರರು',
    gstin: '29AAAC09823M1Z5',
    cin: 'U01111DL1995PTC070894',
    apmcLicense: 'KA-APMC-DVG-2190',
    headquarters: 'Davanagere Industrial Processing Corridor',
    headquartersKn: 'ದಾವಣಗೆರೆ ಕೈಗಾರಿಕಾ ಸಂಸ್ಕರಣಾ ಕಾರಿಡಾರ್',
    karnatakaHubs: ['Davanagere Industrial Area', 'Ranebennur APMC Yard', 'Haveri Starch Cluster'],
    procurementFocus: ['Yellow Industrial Maize', 'Non-GMO Soya Meal', 'Birdseye Spices', 'Sorghum'],
    monthlyVolumeMT: 1800,
    annualProcurementCr: 88.6,
    partneredFarmers: 1180,
    activeContractsCount: 12,
    escrowStatus: 'verified',
    escrowBank: 'Standard Chartered Corporate Escrow',
    creditRating: 'SEDEX Certified & CRISIL AA',
    complianceGrade: 'Grade-1 APMC',
    contactPerson: {
      name: 'Ramesh Hegde',
      designation: 'Factory & Agri Procurement Lead',
      phone: '+91 8192 231 400',
      email: 'ramesh.hegde@olamagri.com'
    },
    establishedYear: 1995,
    description: 'Multinational supply chain manager sourcing high-starch maize and export-grade agricultural grains with international phytosanitary standards.',
    descriptionKn: 'ಅಂತಾರಾಷ್ಟ್ರೀಯ ಗುಣಮಟ್ಟದೊಂದಿಗೆ ಕೈಗಾರಿಕಾ ಮೆಕ್ಕೆಜೋಳ ಮತ್ತು ರಫ್ತು ದರ್ಜೆಯ ಕೃಷಿ ಧಾನ್ಯಗಳನ್ನು ಖರೀದಿಸುವ ಜಾಗತಿಕ ಸಂಸ್ಥೆ.',
    status: 'certified'
  },
  {
    id: 'COMP-MCCAIN-07',
    name: 'McCain Foods India Pvt Ltd (Agri Division)',
    nameKn: 'ಮೆಕ್‌ಕೇನ್ ಫುಡ್ಸ್ ಇಂಡಿಯಾ (ಕೃಷಿ ವಿಭಾಗ)',
    category: 'Contract Processor',
    categoryKn: 'ಗುತ್ತಿಗೆ ಆಲೂಗೆಡ್ಡೆ ಸಂಸ್ಕರಣೆ',
    gstin: '29AAACM5591R1ZZ',
    cin: 'U15139HR1997PTC033486',
    apmcLicense: 'KA-APMC-HSN-1192',
    headquarters: 'Hassan Cold Storage Complex & Kolar',
    headquartersKn: 'ಹಾಸನ ಕೋಲ್ಡ್ ಸ್ಟೋರೇಜ್ ಕಾಂಪ್ಲೆಕ್ಸ್ & ಕೋಲಾರ',
    karnatakaHubs: ['Hassan Cold Chain Cluster', 'Channarayapatna Collection Point', 'Kolar Center'],
    procurementFocus: ['Processing Potato (Kufri Chipsona-1)', 'Lady Rosetta Potato', 'Santana'],
    monthlyVolumeMT: 1100,
    annualProcurementCr: 62.4,
    partneredFarmers: 890,
    activeContractsCount: 10,
    escrowStatus: 'verified',
    escrowBank: 'Citibank Agri Escrow Account',
    creditRating: 'Global G.A.P. Certified & AAA',
    complianceGrade: 'Grade-1 APMC',
    contactPerson: {
      name: 'Vikram Joshi',
      designation: 'Lead Agronomist & Contract Farming Manager',
      phone: '+91 8172 268 900',
      email: 'vikram.joshi@mccain.com'
    },
    establishedYear: 1997,
    description: 'Provides certified disease-free seed tubers, drip irrigation subsidies, and guaranteed pre-sowing buyback contracts for processing potatoes.',
    descriptionKn: 'ರೋಗಮುಕ್ತ ಬೀಜದ ಆಲೂಗೆಡ್ಡೆ, ಹನಿ ನೀರಾವರಿ ಸಬ್ಸಿಡಿ ಹಾಗೂ ಬಿತ್ತನೆಗೂ ಮೊದಲೇ ನಿಗದಿತ ಬೆಲೆಯ ಖರೀದಿ ಒಪ್ಪಂದ ನೀಡುತ್ತದೆ.',
    status: 'certified'
  },
  {
    id: 'COMP-TATA-08',
    name: 'Tata Consumer Products Ltd (Agri Sourcing)',
    nameKn: 'ಟಾಟಾ ಕನ್ಸ್ಯೂಮರ್ ಪ್ರಾಡಕ್ಟ್ಸ್ ಲಿಮಿಟೆಡ್',
    category: 'Beverages & Plantation',
    categoryKn: 'ತೋಟಗಾರಿಕೆ ಬೆಳೆಗಳು ಮತ್ತು ಕಾಫಿ',
    gstin: '29AAACT2210D1Z7',
    cin: 'L15491WB1962PLC031425',
    apmcLicense: 'KA-APMC-CKM-5521',
    headquarters: 'Chikkamagaluru & Yeshwantpur, Bengaluru',
    headquartersKn: 'ಚಿಕ್ಕಮಗಳೂರು & ಯಶವಂತಪುರ, ಬೆಂಗಳೂರು',
    karnatakaHubs: ['Chikkamagaluru Coffee Board Corridor', 'Madikeri Estate Siding', 'Hassan Pulses Plant'],
    procurementFocus: ['Robusta Green Coffee', 'Arabica Cherry', 'Black Pepper', 'Tata Sampann Unpolished Dals'],
    monthlyVolumeMT: 950,
    annualProcurementCr: 84.0,
    partneredFarmers: 1120,
    activeContractsCount: 15,
    escrowStatus: 'verified',
    escrowBank: 'Tata Capital Agri Escrow Clearing',
    creditRating: 'CRISIL AAA (Highest Financial Integrity)',
    complianceGrade: 'Grade-1 APMC',
    contactPerson: {
      name: 'Somashekar N.',
      designation: 'Estate Procurement & FPO Liaison',
      phone: '+91 8262 230 450',
      email: 'somashekar.n@tataconsumer.com'
    },
    establishedYear: 1962,
    description: 'Direct procurement of shade-grown Robusta coffee, export black pepper, and native unpolished pulses directly from Western Ghats farmers.',
    descriptionKn: 'ಪಶ್ಚಿಮ ಘಟ್ಟದ ರೈತರಿಂದ ನೇರವಾಗಿ ಕಾಫಿ, ಕರಿಮೆಣಸು ಹಾಗೂ ಸಾಂಪ್ರದಾಯಿಕ ಪಾಲಿಶ್ ರಹಿತ ಬೇಳೆಕಾಳುಗಳ ಖರೀದಿ.',
    status: 'certified'
  },
  {
    id: 'COMP-MARICO-09',
    name: 'Marico Limited (Agri Sourcing Division)',
    nameKn: 'ಮಾರಿಕೋ ಲಿಮಿಟೆಡ್ (ಕೃಷಿ ಖರೀದಿ ವಿಭಾಗ)',
    category: 'Edible Oils & Seeds',
    categoryKn: 'ಖಾದ್ಯ ತೈಲ ಮತ್ತು ತೆಂಗು',
    gstin: '29AAACM2240E1ZW',
    cin: 'L15140MH1988PLC049208',
    apmcLicense: 'KA-APMC-KLB-8802',
    headquarters: 'Kalaburagi & Tiptur Copra Yard',
    headquartersKn: 'ಕಲಬುರಗಿ & ತಿಪಟೂರು ಕೊಬ್ಬರಿ ಯಾರ್ಡ್',
    karnatakaHubs: ['Kalaburagi Safflower Corridor', 'Tiptur Copra APMC Yard', 'Arasikere Coconut Complex'],
    procurementFocus: ['High-Oleic Kusube (Safflower)', 'Tiptur Ball Copra', 'Virgin Coconut Oil grade nuts'],
    monthlyVolumeMT: 1600,
    annualProcurementCr: 95.8,
    partneredFarmers: 1890,
    activeContractsCount: 14,
    escrowStatus: 'verified',
    escrowBank: 'Kotak Mahindra Corporate Escrow',
    creditRating: 'CRISIL AAA / India Ratings AAA',
    complianceGrade: 'Grade-1 APMC',
    contactPerson: {
      name: 'Sharanappa Biradar',
      designation: 'Field Sourcing Manager - Karnataka Belt',
      phone: '+91 8354 220 500',
      email: 'sharanappa.biradar@marico.com'
    },
    establishedYear: 1988,
    description: 'Makers of Saffola and Parachute; conducts transparent electronic auctions and off-take contracts for Ball Copra and high-grade Safflower.',
    descriptionKn: 'ಸ್ಯಾಫೋಲಾ ಮತ್ತು ಪ್ಯಾರಾಶೂಟ್ ತಯಾರಕರು; ಉಂಡೆ ಕೊಬ್ಬರಿ ಮತ್ತು ಕುಸುಬೆ ಬೆಳೆಗಾರರಿಗೆ ಪಾರದರ್ಶಕ ಇ-ಹರಾಜು ಮತ್ತು ಖರೀದಿ ಒಪ್ಪಂದ.',
    status: 'certified'
  },
  {
    id: 'COMP-OM-10',
    name: 'Organic Mandya Agro Foods Pvt Ltd',
    nameKn: 'ಆರ್ಗ್ಯಾನಿಕ್ ಮಂಡ್ಯ ಅಗ್ರೋ ಫುಡ್ಸ್ ಪ್ರೈ. ಲಿ.',
    category: 'Organic & Certified Foods',
    categoryKn: 'ಸಾವಯವ ಹಾಗೂ ನೈಸರ್ಗಿಕ ಆಹಾರ',
    gstin: '29AAJCO6619F1ZM',
    cin: 'U01403KA2015PTC079812',
    apmcLicense: 'KA-APMC-MND-0914',
    headquarters: 'Pandavapura & Mandya Sugar Belt',
    headquartersKn: 'ಪಾಂಡವಪುರ & ಮಂಡ್ಯ ಕಬ್ಬಿನ ಬೆಲ್ಟ್',
    karnatakaHubs: ['Mandya Organic Farmers Collective', 'Pandavapura Jaggery Center', 'Mysuru Organic Store'],
    procurementFocus: ['Chemical-Free Jaggery Sugarcane', 'Country Ragi ML-365', 'Navane & Foxtail Millets', 'A2 Desi Cow Ghee'],
    monthlyVolumeMT: 450,
    annualProcurementCr: 28.5,
    partneredFarmers: 780,
    activeContractsCount: 22,
    escrowStatus: 'verified',
    escrowBank: 'Canara Bank Pandavapura Agri Branch',
    creditRating: 'NPOP India Certified Organic / Grade-1',
    complianceGrade: 'Grade-1 APMC',
    contactPerson: {
      name: 'Madhu Chandan',
      designation: 'Managing Director & Founder',
      phone: '+91 8232 277 400',
      email: 'madhuchandan@organicmandya.com'
    },
    establishedYear: 2015,
    description: 'Farmer-centric organic collective guaranteeing 25% premium above regular market rates for certified chemical-free produce.',
    descriptionKn: 'ರೈತ ಕೇಂದ್ರಿತ ಸಾವಯವ ಸಂಸ್ಥೆ; ಪ್ರಮಾಣೀಕೃತ ರಾಸಾಯನಿಕ ಮುಕ್ತ ಬೆಳೆಗೆ ಮಾರುಕಟ್ಟೆ ದರಕ್ಕಿಂತ 25% ಹೆಚ್ಚಿನ ಪ್ರೀಮಿಯಂ ಖಾತರಿ ನೀಡುತ್ತದೆ.',
    status: 'certified'
  },
  {
    id: 'COMP-PEP-11',
    name: 'PepsiCo India Holdings (Agro Division)',
    nameKn: 'ಪೆಪ್ಸಿಕೋ ಇಂಡಿಯಾ ಅಗ್ರೋ ವಿಭಾಗ',
    category: 'Contract Processor',
    categoryKn: 'ಗುತ್ತಿಗೆ ಕೃಷಿ ಮತ್ತು ತಿಂಡಿ ಸಂಸ್ಕರಣೆ',
    gstin: '29AAACP0019C1Z3',
    cin: 'U15549DL1989PTC035492',
    apmcLicense: 'KA-APMC-MYS-7741',
    headquarters: 'Nanjangud Industrial Area, Mysuru',
    headquartersKn: 'ನಂಜನಗೂಡು ಕೈಗಾರಿಕಾ ಪ್ರದೇಶ, ಮೈಸೂರು',
    karnatakaHubs: ['Mysuru Agri Logistics Yard', 'Hunsur Processing Hub', 'Chamarajanagar Siding'],
    procurementFocus: ['Processing Potatoes (Atlantic, FL 1533)', 'High-Starch Sweet Corn'],
    monthlyVolumeMT: 1400,
    annualProcurementCr: 78.0,
    partneredFarmers: 950,
    activeContractsCount: 14,
    escrowStatus: 'verified',
    escrowBank: 'HSBC India Corporate Escrow',
    creditRating: 'Global Sustainable Agriculture Council AAA',
    complianceGrade: 'Grade-1 APMC',
    contactPerson: {
      name: 'Kavitha Swaminathan',
      designation: 'Head of South India Agro Supply Chain',
      phone: '+91 821 240 3311',
      email: 'kavitha.swaminathan@pepsico.com'
    },
    establishedYear: 1989,
    description: 'Procures specialized chip-grade potatoes on pre-harvest agreements with complete weather risk advisory and certified input supply.',
    descriptionKn: 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ಸಲಹೆ ಮತ್ತು ಉತ್ತಮ ಬೀಜಗಳ ಪೂರೈಕೆಯೊಂದಿಗೆ ಸಂಸ್ಕರಣಾ ಆಲೂಗೆಡ್ಡೆಯ ಪೂರ್ವ-ಖರೀದಿ ಒಪ್ಪಂದ.',
    status: 'certified'
  },
  {
    id: 'COMP-CARGILL-12',
    name: 'Cargill India Agri Sourcing & Nutrition',
    nameKn: 'ಕಾರ್ಗಿಲ್ ಇಂಡಿಯಾ ಅಗ್ರಿ ಸೋರ್ಸಿಂಗ್',
    category: 'Grain & Pulses Aggregator',
    categoryKn: 'ಧಾನ್ಯ ಹಾಗೂ ಪಶು ಆಹಾರ ಸಂಸ್ಕರಣೆ',
    gstin: '29AAACC1982L1Z4',
    cin: 'U15311DL1996PTC080649',
    apmcLicense: 'KA-APMC-BLR-6629',
    headquarters: 'Bellary Industrial Complex & Davanagere',
    headquartersKn: 'ಬಳ್ಳಾರಿ ಕೈಗಾರಿಕಾ ಪ್ರದೇಶ & ದಾವಣಗೆರೆ',
    karnatakaHubs: ['Bellary APMC Rail Siding', 'Davanagere Storage Silos', 'Koppal Grain Hub'],
    procurementFocus: ['Yellow Maize Feed Grade', 'Soya De-oiled Cake', 'Wheat Grain', 'Industrial Starch Corn'],
    monthlyVolumeMT: 2800,
    annualProcurementCr: 142.0,
    partneredFarmers: 2150,
    activeContractsCount: 19,
    escrowStatus: 'verified',
    escrowBank: 'Bank of America Corporate Agri Escrow',
    creditRating: 'CRISIL AAA (Prime Global Entity)',
    complianceGrade: 'Grade-1 APMC',
    contactPerson: {
      name: 'Gurunath Shettar',
      designation: 'Senior Procurement Manager - Karnataka Grains',
      phone: '+91 8392 271 200',
      email: 'gurunath_shettar@cargill.com'
    },
    establishedYear: 1996,
    description: 'Bulk grain procurer operating automated silos and high-capacity rail logistics for Karnataka maize and cattle feed ingredients.',
    descriptionKn: 'ಕರ್ನಾಟಕದ ಮೆಕ್ಕೆಜೋಳ ಮತ್ತು ಪಶು ಆಹಾರ ಪದಾರ್ಥಗಳಿಗಾಗಿ ಸ್ವಯಂಚಾಲಿತ ಸೈಲೋಗಳು ಹಾಗೂ ರೈಲು ಸಾರಿಗೆ ವ್ಯವಸ್ಥೆ ಹೊಂದಿರುವ ಧಾನ್ಯ ಸಂಸ್ಥೆ.',
    status: 'certified'
  }
];

interface AdminCompanyDirectoryProps {
  lang: Language;
}

export const AdminCompanyDirectory: React.FC<AdminCompanyDirectoryProps> = ({ lang }) => {
  const [companies, setCompanies] = useState<RegisteredCompanyRecord[]>(INITIAL_COMPANIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCompliance, setSelectedCompliance] = useState<'all' | 'escrow' | 'grade1'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedCompanyModal, setSelectedCompanyModal] = useState<RegisteredCompanyRecord | null>(null);
  const [liveToast, setLiveToast] = useState<string | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // New Company Registration Form State
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyCategory, setNewCompanyCategory] = useState<RegisteredCompanyRecord['category']>('FMCG Food Processing');
  const [newGstin, setNewGstin] = useState('');
  const [newApmcLicense, setNewApmcLicense] = useState('');
  const [newHub, setNewHub] = useState('');
  const [newCrops, setNewCrops] = useState('');
  const [newVolume, setNewVolume] = useState('1200');
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  // Toast Helper
  const triggerToast = (msg: string) => {
    setLiveToast(msg);
    setTimeout(() => setLiveToast(null), 4000);
  };

  // Filter Logic
  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      // Category filter
      if (selectedCategory !== 'all' && c.category !== selectedCategory) {
        return false;
      }
      // Compliance filter
      if (selectedCompliance === 'escrow' && c.escrowStatus !== 'verified') {
        return false;
      }
      if (selectedCompliance === 'grade1' && c.complianceGrade !== 'Grade-1 APMC') {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q) || c.nameKn.includes(q);
        const matchesGstin = c.gstin.toLowerCase().includes(q) || c.apmcLicense.toLowerCase().includes(q);
        const matchesLocation = c.headquarters.toLowerCase().includes(q) || c.karnatakaHubs.some((h) => h.toLowerCase().includes(q));
        const matchesCrops = c.procurementFocus.some((f) => f.toLowerCase().includes(q));
        const matchesContact = c.contactPerson.name.toLowerCase().includes(q) || c.contactPerson.email.toLowerCase().includes(q);
        return Boolean(matchesName || matchesGstin || matchesLocation || matchesCrops || matchesContact);
      }
      return true;
    });
  }, [companies, selectedCategory, selectedCompliance, searchQuery]);

  // Aggregate Stats
  const totalVolumeMT = useMemo(() => companies.reduce((acc, c) => acc + c.monthlyVolumeMT, 0), [companies]);
  const totalPartneredFarmers = useMemo(() => companies.reduce((acc, c) => acc + c.partneredFarmers, 0), [companies]);
  const totalAnnualCr = useMemo(() => companies.reduce((acc, c) => acc + c.annualProcurementCr, 0), [companies]);

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      'Company Name',
      'Category',
      'GSTIN',
      'APMC License',
      'Headquarters',
      'Procurement Focus',
      'Monthly MT',
      'Annual Procurement (Cr)',
      'Partnered Farmers',
      'Active Contracts',
      'Escrow Bank',
      'Contact Person',
      'Phone',
      'Email',
      'Compliance Grade'
    ];

    const rows = filteredCompanies.map((c) => [
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.category}"`,
      `"${c.gstin}"`,
      `"${c.apmcLicense}"`,
      `"${c.headquarters.replace(/"/g, '""')}"`,
      `"${c.procurementFocus.join(', ')}"`,
      c.monthlyVolumeMT,
      c.annualProcurementCr,
      c.partneredFarmers,
      c.activeContractsCount,
      `"${c.escrowBank.replace(/"/g, '""')}"`,
      `"${c.contactPerson.name}"`,
      `"${c.contactPerson.phone}"`,
      `"${c.contactPerson.email}"`,
      `"${c.complianceGrade}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `karnataka_registered_companies_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(`Exported ${filteredCompanies.length} companies to CSV format.`);
  };

  // Add Company
  const handleRegisterCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim() || !newGstin.trim()) {
      triggerToast('Please provide company name and valid GSTIN.');
      return;
    }

    const created: RegisteredCompanyRecord = {
      id: `COMP-NEW-${Date.now()}`,
      name: newCompanyName.trim(),
      nameKn: newCompanyName.trim(),
      category: newCompanyCategory,
      categoryKn: 'ನೊಂದಾಯಿತ ಖರೀದಿದಾರ',
      gstin: newGstin.trim().toUpperCase(),
      cin: `U${Math.floor(10000 + Math.random() * 90000)}KA2024PTC${Math.floor(100000 + Math.random() * 900000)}`,
      apmcLicense: newApmcLicense.trim() || `KA-APMC-NEW-${Math.floor(1000 + Math.random() * 9000)}`,
      headquarters: newHub.trim() || 'Bengaluru, Karnataka',
      headquartersKn: 'ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ',
      karnatakaHubs: [newHub.trim() || 'Statewide APMC Hubs'],
      procurementFocus: newCrops ? newCrops.split(',').map((c) => c.trim()) : ['Paddy', 'Pulses'],
      monthlyVolumeMT: Number(newVolume) || 1000,
      annualProcurementCr: Math.round((Number(newVolume) || 1000) * 0.05 * 10) / 10,
      partneredFarmers: Math.floor(500 + Math.random() * 1000),
      activeContractsCount: 8,
      escrowStatus: 'verified',
      escrowBank: 'State Bank of India (Mandatory Agri Escrow)',
      creditRating: 'CRISIL AA- (Verified)',
      complianceGrade: 'Grade-1 APMC',
      contactPerson: {
        name: newContactName.trim() || 'Procurement In-charge',
        designation: 'State Sourcing Lead',
        phone: newContactPhone.trim() || '+91 80 2000 1100',
        email: `procurement@${newCompanyName.toLowerCase().replace(/\s+/g, '')}.in`
      },
      establishedYear: 2022,
      description: 'Newly registered corporate agribusiness entity authorized for direct farm gate off-take and APMC electronic trade in Karnataka.',
      descriptionKn: 'ಕರ್ನಾಟಕದಲ್ಲಿ ನೇರ ಕೃಷಿ ಉತ್ಪನ್ನ ಖರೀದಿ ಮತ್ತು ಇ-ವ್ಯಾಪಾರಕ್ಕೆ ಅಧಿಕೃತವಾಗಿ ನೊಂದಾಯಿತ ಸಂಸ್ಥೆ.',
      status: 'active'
    };

    setCompanies([created, ...companies]);
    setShowRegisterModal(false);
    setNewCompanyName('');
    setNewGstin('');
    setNewApmcLicense('');
    setNewHub('');
    setNewCrops('');
    setNewContactName('');
    setNewContactPhone('');
    triggerToast(`Successfully registered ${created.name} in Karnataka Directorate.`);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-7 shadow-sm space-y-6">
      {/* Toast Notification */}
      {liveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-purple-500/40 flex items-center gap-3 animate-bounce">
          <BadgeCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{liveToast}</span>
        </div>
      )}

      {/* Header & Quick Action Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <h3 className="font-extrabold text-stone-900 text-lg font-heading flex items-center gap-2">
              <span>{lang === 'kn' ? 'ಕರ್ನಾಟಕ ನೊಂದಾಯಿತ ಕಂಪನಿಗಳು ಮತ್ತು ಕಾರ್ಪೊರೇಟ್ ಖರೀದಿದಾರರ ಪಟ್ಟಿ' : 'Karnataka Registered Agribusiness Companies & Corporate Buyers Directory'}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-black">
                {companies.length} Companies
              </span>
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-3xl">
            {lang === 'kn'
              ? 'ಕರ್ನಾಟಕ ಕೃಷಿ ಮಂಡಳಿ (APMC) ಹಾಗೂ ಕೃಷಿ ನಿರ್ದೇಶನಾಲಯದಲ್ಲಿ ಅನುಮೋದನೆ ಪಡೆದ ಎಫ್‌ಎಂಸಿಜಿ, ಚಿಲ್ಲರೆ ಸೂಪರ್‌ಮಾರ್ಕೆಟ್, ಧಾನ್ಯ ಸಂಸ್ಕರಣೆ ಮತ್ತು ರಫ್ತು ಕಂಪನಿಗಳ ವಿವರವಾದ ದಾಖಲಾತಿ.'
              : 'Official directorate registry of all certified FMCG food processors, retail supermarket aggregators, grain mills, oilseed crushers, and contract farming sponsors in Karnataka.'}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-purple-100 text-stone-800 hover:text-purple-900 border border-stone-300 font-bold text-xs transition flex items-center gap-1.5 shadow-2xs"
            title="Export companies directory to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Directory (.CSV)</span>
          </button>

          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>+ Register Corporate Buyer</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards for Companies */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4 rounded-2xl border border-blue-200">
          <div className="flex items-center justify-between text-blue-800 mb-1">
            <span className="text-xs font-semibold">Registered Enterprises</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{companies.length}</div>
          <div className="text-[11px] text-blue-700 font-medium mt-1">100% APMC & GSTIN Verified</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-4 rounded-2xl border border-emerald-200">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="text-xs font-semibold">State Monthly Demand</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-950">{totalVolumeMT.toLocaleString()} MT</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">Across 18 Karnataka Districts</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50/50 p-4 rounded-2xl border border-purple-200">
          <div className="flex items-center justify-between text-purple-800 mb-1">
            <span className="text-xs font-semibold">Partnered Farmers</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-950">{totalPartneredFarmers.toLocaleString()}+</div>
          <div className="text-[11px] text-purple-700 font-medium mt-1">Direct Procurement Beneficiaries</div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-yellow-50/50 p-4 rounded-2xl border border-amber-200">
          <div className="flex items-center justify-between text-amber-800 mb-1">
            <span className="text-xs font-semibold">Annual Off-Take Value</span>
            <Landmark className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-950">₹{totalAnnualCr.toFixed(1)} Cr</div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">Direct Bank Transfer Escrow</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'kn' ? 'ಕಂಪನಿ ಹೆಸರು, ಜಿಎಸ್‌ಟಿ ಸಂಖ್ಯೆ, ಬೆಳೆ ಅಥವಾ ಜಿಲ್ಲೆ ಹುಡುಕಿ...' : 'Search company name, GSTIN, crop, hub, or contact person...'}
              className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-stone-300 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Compliance & View Switcher */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCompliance}
              onChange={(e) => setSelectedCompliance(e.target.value as any)}
              className="px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Compliance Status</option>
              <option value="escrow">100% Escrow Active</option>
              <option value="grade1">Grade-1 APMC Certified</option>
            </select>

            <div className="flex items-center bg-white border border-stone-300 rounded-xl p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  viewMode === 'grid' ? 'bg-blue-900 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  viewMode === 'table' ? 'bg-blue-900 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Sector Quick Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-bold text-stone-500 whitespace-nowrap mr-1">Sector:</span>
          {[
            { id: 'all', label: 'All Sectors' },
            { id: 'FMCG Food Processing', label: 'FMCG Food Processing' },
            { id: 'Retail & Supermarket', label: 'Retail & Supermarkets' },
            { id: 'Edible Oils & Seeds', label: 'Edible Oils & Seeds' },
            { id: 'Grain & Pulses Aggregator', label: 'Grains & Pulses' },
            { id: 'Contract Processor', label: 'Contract Processors' },
            { id: 'Beverages & Plantation', label: 'Coffee & Spices' },
            { id: 'Organic & Certified Foods', label: 'Organic Foods' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Rendering: Grid vs Table */}
      {filteredCompanies.length === 0 ? (
        <div className="p-12 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300 space-y-3">
          <Building2 className="w-10 h-10 text-stone-400 mx-auto" />
          <h4 className="font-bold text-stone-700 text-sm">No Registered Companies Found</h4>
          <p className="text-xs text-stone-500">
            No agribusiness company matches your filter criteria. Try clearing search or selecting All Sectors.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedCompliance('all');
            }}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold transition"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCompanies.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-stone-200 hover:border-blue-400 hover:shadow-md transition p-5 flex flex-col justify-between space-y-4 relative group"
            >
              {/* Card Header */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-center font-black text-sm shrink-0 shadow-2xs">
                      <Building2 className="w-5 h-5 text-blue-700" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-stone-900 leading-snug group-hover:text-blue-900 transition flex items-center gap-1.5">
                        <span>{c.name}</span>
                        <BadgeCheck className="w-4 h-4 text-blue-600 shrink-0" />
                      </h4>
                      <span className="text-[11px] text-stone-500 font-medium block">
                        {lang === 'kn' ? c.nameKn : c.category}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase">
                    {c.complianceGrade}
                  </span>
                </div>

                {/* Identifiers Badge */}
                <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
                  <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                    GSTIN: {c.gstin}
                  </span>
                  <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                    Lic: {c.apmcLicense}
                  </span>
                </div>

                {/* Description Snippet */}
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed pt-1">
                  {lang === 'kn' ? c.descriptionKn : c.description}
                </p>
              </div>

              {/* Crop & Procurement Badges */}
              <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    Procurement Focus:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {c.procurementFocus.map((crop, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 text-[11px] font-semibold"
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-3 gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200/80 text-center">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Monthly Vol</span>
                    <span className="font-extrabold text-stone-900 text-xs">{c.monthlyVolumeMT} MT</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Farmers</span>
                    <span className="font-extrabold text-emerald-800 text-xs">{c.partneredFarmers}+</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Contracts</span>
                    <span className="font-extrabold text-blue-900 text-xs">{c.activeContractsCount} MOUs</span>
                  </div>
                </div>

                {/* Location / Hub */}
                <div className="flex items-center gap-1.5 text-[11px] text-stone-500 pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">{c.headquarters}</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Escrow Active</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      triggerToast(`Initiating direct call to ${c.contactPerson.name} (${c.contactPerson.phone})`);
                    }}
                    className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                    title={`Call ${c.contactPerson.name}: ${c.contactPerson.phone}`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setSelectedCompanyModal(c)}
                    className="px-3 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition shadow-2xs flex items-center gap-1"
                  >
                    <span>View Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="overflow-x-auto rounded-2xl border border-stone-200">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-100 text-stone-900 font-bold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Company Name & Category</th>
                <th className="py-3 px-4">Identifiers (GSTIN / APMC)</th>
                <th className="py-3 px-4">Procurement Focus</th>
                <th className="py-3 px-4 text-center">Monthly Volume</th>
                <th className="py-3 px-4 text-center">Partnered Farmers</th>
                <th className="py-3 px-4">Key Hubs & Location</th>
                <th className="py-3 px-4">Contact Executive</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 bg-white">
              {filteredCompanies.map((c) => (
                <tr key={c.id} className="hover:bg-blue-50/40 transition">
                  <td className="py-3 px-4 font-semibold text-stone-900">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <div className="font-bold flex items-center gap-1">
                          <span>{c.name}</span>
                          <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <span className="text-[10px] text-stone-500 font-normal">{c.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    <div>{c.gstin}</div>
                    <div className="text-blue-700 text-[10px]">{c.apmcLicense}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-stone-800 font-medium">
                      {c.procurementFocus.slice(0, 2).join(', ')}
                      {c.procurementFocus.length > 2 && ` +${c.procurementFocus.length - 2} more`}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-stone-900">{c.monthlyVolumeMT} MT</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-800">{c.partneredFarmers}+</td>
                  <td className="py-3 px-4 text-stone-600 text-[11px] max-w-xs truncate">{c.headquarters}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-stone-900">{c.contactPerson.name}</div>
                    <div className="text-stone-500 text-[10px]">{c.contactPerson.phone}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedCompanyModal(c)}
                      className="px-3 py-1 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition"
                    >
                      Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* =========================================================================
          DETAILED COMPANY DOSSIER MODAL
         ========================================================================= */}
      {selectedCompanyModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white font-black shadow-inner shrink-0">
                  <Building2 className="w-6 h-6 text-sky-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-blue-400/20 border border-blue-300/30 text-blue-200">
                      {selectedCompanyModal.category}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300">
                      {selectedCompanyModal.complianceGrade}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-1.5 mt-1">
                    <span>{selectedCompanyModal.name}</span>
                    <BadgeCheck className="w-5 h-5 text-sky-400" />
                  </h3>
                  <p className="text-xs text-white/80 font-medium">{selectedCompanyModal.nameKn}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCompanyModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
              {/* Official Credentials Grid */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">GSTIN</span>
                  <span className="font-mono font-bold text-stone-900">{selectedCompanyModal.gstin}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">APMC License</span>
                  <span className="font-mono font-bold text-blue-800">{selectedCompanyModal.apmcLicense}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">CIN Number</span>
                  <span className="font-mono font-bold text-stone-900 truncate block">{selectedCompanyModal.cin}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Monthly Demand</span>
                  <span className="font-extrabold text-emerald-800 text-sm">{selectedCompanyModal.monthlyVolumeMT} MT</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Annual Off-Take</span>
                  <span className="font-extrabold text-purple-900 text-sm">₹{selectedCompanyModal.annualProcurementCr} Cr</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Credit Rating</span>
                  <span className="font-bold text-stone-900">{selectedCompanyModal.creditRating}</span>
                </div>
              </div>

              {/* Company Description */}
              <div className="space-y-1">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Overview & Mandate</span>
                <p className="text-stone-700 leading-relaxed font-medium">
                  {selectedCompanyModal.description}
                </p>
                <p className="text-stone-500 leading-relaxed italic text-[11px]">
                  {selectedCompanyModal.descriptionKn}
                </p>
              </div>

              {/* Crops Focus */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Authorized Crops For Procurement</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCompanyModal.procurementFocus.map((c, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold">
                      🌾 {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Karnataka Procurement Hubs */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Karnataka Procurement Corridors & Silos</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCompanyModal.karnatakaHubs.map((hub, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="font-semibold">{hub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Escrow and Payment Security */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-emerald-900 uppercase font-black tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Farmer Payment Escrow & Direct Bank Transfer (DBT)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px]">
                    100% Guaranteed
                  </span>
                </div>
                <div className="text-stone-800 pt-1 text-[11px] space-y-1">
                  <div><strong>Registered Escrow Bank:</strong> {selectedCompanyModal.escrowBank}</div>
                  <div><strong>Payment Turnaround SLA:</strong> Within 48 hours of electronic weighment slip at APMC corridor.</div>
                </div>
              </div>

              {/* Executive Point of Contact */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Assigned Corporate Sourcing Executive</span>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-extrabold text-stone-900 text-sm">{selectedCompanyModal.contactPerson.name}</div>
                    <div className="text-stone-500 text-xs">{selectedCompanyModal.contactPerson.designation}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${selectedCompanyModal.contactPerson.phone}`}
                      className="px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold transition flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{selectedCompanyModal.contactPerson.phone}</span>
                    </a>
                    <a
                      href={`mailto:${selectedCompanyModal.contactPerson.email}`}
                      className="px-3 py-1.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold transition flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <button
                onClick={() => {
                  triggerToast(`Printed verified compliance dossier for ${selectedCompanyModal.name}.`);
                }}
                className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 font-bold text-stone-700 transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Dossier</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    triggerToast(`APMC clearance certificate re-verified for ${selectedCompanyModal.name}. Valid until Dec 2026.`);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1.5 shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verify APMC Clearance</span>
                </button>
                <button
                  onClick={() => setSelectedCompanyModal(null)}
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          REGISTER NEW CORPORATE BUYER MODAL
         ========================================================================= */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="p-5 bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-amber-300" />
                <h3 className="font-extrabold text-base text-white">Register Corporate Agri Buyer / Company</h3>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterCompany} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Godrej Agrovet Ltd / Heritage Foods"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">Category *</label>
                  <select
                    value={newCompanyCategory}
                    onChange={(e) => setNewCompanyCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="FMCG Food Processing">FMCG Food Processing</option>
                    <option value="Retail & Supermarket">Retail & Supermarket</option>
                    <option value="Edible Oils & Seeds">Edible Oils & Seeds</option>
                    <option value="Grain & Pulses Aggregator">Grain & Pulses Aggregator</option>
                    <option value="Contract Processor">Contract Processor</option>
                    <option value="Beverages & Plantation">Beverages & Plantation</option>
                    <option value="Organic & Certified Foods">Organic & Certified Foods</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">GSTIN Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="29AAAAA0000A1Z5"
                    value={newGstin}
                    onChange={(e) => setNewGstin(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono uppercase focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">APMC Trader License</label>
                  <input
                    type="text"
                    placeholder="KA-APMC-XXX-1234"
                    value={newApmcLicense}
                    onChange={(e) => setNewApmcLicense(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">Monthly Target (MT)</label>
                  <input
                    type="number"
                    placeholder="1200"
                    value={newVolume}
                    onChange={(e) => setNewVolume(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">Karnataka Hub / Yard</label>
                <input
                  type="text"
                  placeholder="e.g. Yeshwantpur APMC, Bengaluru / Hubballi"
                  value={newHub}
                  onChange={(e) => setNewHub(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">Procurement Crops (comma separated)</label>
                <input
                  type="text"
                  placeholder="Byadgi Chilli, Paddy, Sunflower"
                  value={newCrops}
                  onChange={(e) => setNewCrops(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">Contact Person Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Raghavendra Sharma"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">Contact Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98450 12345"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                <strong>Mandatory Requirement:</strong> Registered companies will be required to maintain an active APMC Escrow account guaranteeing farmer settlements within 48 hours.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold transition shadow-md"
                >
                  Confirm & Register Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
