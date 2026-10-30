import React, { useState, useMemo, useEffect } from 'react';
import {
  Sprout,
  BookOpen,
  Calendar,
  CalendarDays,
  Droplets,
  FlaskConical,
  Bug,
  CheckCircle2,
  AlertTriangle,
  Award,
  Clock,
  Printer,
  Calculator,
  Search,
  Filter,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Wheat,
  Share2,
  Sparkles,
  Volume2,
  VolumeX,
  Smartphone,
  ExternalLink,
  Store,
  Stethoscope,
  TrendingUp,
  IndianRupee,
  Layers,
  ListChecks,
  ThermometerSun,
  CloudRain,
  RotateCcw,
  Check,
  CheckSquare,
  Square,
  Info
} from 'lucide-react';
import { Language } from '../types/nammaraitha';
import { ActiveTab } from './Navbar';

export interface CropGuidanceProps {
  lang: Language;
  onNavigateTab: (tab: ActiveTab) => void;
}

export type CropCategory = 'Cereal' | 'Millet' | 'Vegetable' | 'Commercial' | 'Pulse' | 'Oilseed' | 'Plantation';

export interface CropVariety {
  name: string;
  duration: string;
  yield: string;
  specialty: string;
}

export interface GrowthStage {
  stageNumber: number;
  stage: string;
  stageKn: string;
  days: string;
  startDay: number;
  endDay: number;
  water: string;
  waterKn: string;
  waterLitersPerDay: number; // Liters / acre / day
  nutrition: string;
  nutritionKn: string;
  protection: string;
  protectionKn: string;
  expertTip: string;
  expertTipKn: string;
  checklist: string[];
  checklistKn: string[];
}

export interface PestDisease {
  id: string;
  name: string;
  nameKn: string;
  type: 'pest' | 'disease' | 'deficiency';
  severity: 'low' | 'moderate' | 'high';
  symptoms: string;
  symptomsKn: string;
  organicControl: string;
  organicControlKn: string;
  chemicalControl: string;
  chemicalControlKn: string;
}

export interface CropDetailGuide {
  id: string;
  name: string;
  nameKn: string;
  category: CropCategory;
  categoryKn: string;
  season: string;
  seasonKn: string;
  duration: string;
  durationKn: string;
  totalDays: number;
  soil: string;
  soilKn: string;
  idealPh: string;
  tempRange: string;
  waterNeed: 'Low' | 'Medium' | 'High' | 'Critical';
  avgYield: string;
  avgYieldKn: string;
  seedRatePerAcre: string;
  seedRatePerAcreKn: string;
  spacing: string;
  npkRatio: { N: number; P: number; K: number };
  mspPerQuintal: number; // Minimum Support Price or Benchmark
  avgMandiPricePerQ: number; // Current APMC Average Price
  costBreakdown: {
    seeds: number;
    landPrep: number;
    fertilizers: number;
    pesticides: number;
    laborHarvest: number;
    expectedYieldQ: number;
  };
  varieties: CropVariety[];
  stages: GrowthStage[];
  pestsAndDiseases: PestDisease[];
  organicRemedies: {
    remedy: string;
    recipe: string;
    target: string;
  }[];
}

export const CROP_GUIDANCE_DATABASE: CropDetailGuide[] = [
  {
    id: 'paddy',
    name: 'Paddy / Rice',
    nameKn: 'ಭತ್ತ',
    category: 'Cereal',
    categoryKn: 'ಏಕದಳ ಧಾನ್ಯ',
    season: 'Kharif (June-Nov) & Rabi/Summer (Dec-May)',
    seasonKn: 'ಖಾರೀಫ್ ಮತ್ತು ಹಿಂಗಾರು',
    duration: '120 - 145 Days',
    durationKn: '೧೨೦ - ೧೪೫ ದಿನಗಳು',
    totalDays: 135,
    soil: 'Clay loam or heavy clay soils with good water-holding capacity',
    soilKn: 'ನೀರು ಹಿಡಿದಿಟ್ಟುಕೊಳ್ಳುವ ಜೇಡಿ ಮಣ್ಣು ಅಥವಾ ಕೆಂಪು ಗೋಡು ಮಣ್ಣು',
    idealPh: '5.5 - 7.0',
    tempRange: '22°C - 34°C',
    waterNeed: 'High',
    avgYield: '28 - 35 Quintals / Acre',
    avgYieldKn: '೨೮ - ೩೫ ಕ್ವಿಂಟಾಲ್ / ಎಕರೆ',
    seedRatePerAcre: '15 - 20 kg (Transplanting) / 25-30 kg (DSR)',
    seedRatePerAcreKn: '೧೫ - ೨೦ ಕೆಜಿ (ನಾಟಿ ಪದ್ಧತಿ)',
    spacing: '20 cm x 10 cm or 20 cm x 15 cm',
    npkRatio: { N: 100, P: 50, K: 50 },
    mspPerQuintal: 2300,
    avgMandiPricePerQ: 2650,
    costBreakdown: {
      seeds: 1800,
      landPrep: 4500,
      fertilizers: 4200,
      pesticides: 2500,
      laborHarvest: 9000,
      expectedYieldQ: 32,
    },
    varieties: [
      { name: 'Gangavathi Sona (BPT-5204)', duration: '145 Days', yield: '30-35 Q/Acre', specialty: 'Fine grain, premium market price, excellent cooking quality' },
      { name: 'IR-64', duration: '120 Days', yield: '25-28 Q/Acre', specialty: 'Short duration, blast resistant, ideal for late Kharif' },
      { name: 'MTU-1010', duration: '115 Days', yield: '28-32 Q/Acre', specialty: 'Early maturing, non-lodging, high grain weight' },
      { name: 'Jaya', duration: '135 Days', yield: '32-38 Q/Acre', specialty: 'Coarse grain, high tiller count, suitable for processing' }
    ],
    stages: [
      {
        stageNumber: 1,
        stage: 'Stage 1: Land Preparation & Nursery Raising',
        stageKn: 'ಹಂತ ೧: ಜಮೀನು ಸಿದ್ಧತೆ ಮತ್ತು ಸಸಿಮಡಿ',
        days: 'Day 0 - 25',
        startDay: 0,
        endDay: 25,
        water: 'Maintain 2 cm water level in nursery beds',
        waterKn: 'ಸಸಿಮಡಿಯಲ್ಲಿ ೨ ಸೆಂ.ಮೀ ನೀರು ನಿಲ್ಲಿಸಿ',
        waterLitersPerDay: 12000,
        nutrition: 'Apply 5 tons FYM/acre + 1 kg Urea, 1 kg DAP per cent of nursery',
        nutritionKn: 'ಪ್ರತಿ ಗುಂಟೆ ಸಸಿಮಡಿಗೆ ೧ ಕೆಜಿ ಯೂರಿಯಾ, ೧ ಕೆಜಿ ಡಿಎಪಿ ನೀಡಿ',
        protection: 'Seed treatment with Carbendazim @ 2g/kg or Trichoderma @ 5g/kg',
        protectionKn: 'ಟ್ರೈಕೋಡರ್ಮಾ ೫ ಗ್ರಾಂ/ಕೆಜಿ ಬೀಜೋಪಚಾರ ಮಾಡಿ',
        expertTip: 'Clip the top 2 cm of seedling leaves before transplanting to destroy stem borer egg masses.',
        expertTipKn: 'ನಾಟಿ ಮಾಡುವ ಮುನ್ನ ಸಸಿಗಳ ತುದಿಯನ್ನು ೨ ಸೆಂ.ಮೀ ಚಿವುಟಿ ನೆಟ್ಟರೆ ಕಾಂಡ ಕೊರೆಯುವ ಹುಳು ಹರಡುವುದಿಲ್ಲ.',
        checklist: [
          'Summer deep ploughing to expose hibernating pupae',
          'Soak seeds in 1% brine solution and remove floating hollow seeds',
          'Treat seeds with Trichoderma viride @ 5g/kg',
          'Puddle the main field twice and level uniformly'
        ],
        checklistKn: [
          'ಮಣ್ಣನ್ನು ತಿರುವಿ ಬೇಸಿಗೆ ಆಳ ಉಳುಮೆ ಮಾಡಿ',
          'ಉಪ್ಪು ನೀರಿನಲ್ಲಿ ಬೀಜೋಪಚಾರ ಮಾಡಿ ಜೊಳ್ಳು ಬೀಜಗಳನ್ನು ಬೇರ್ಪಡಿಸಿ',
          'ಟ್ರೈಕೋಡರ್ಮಾ ಜೈವಿಕ ಶಿಲೀಂಧ್ರನಾಶಕದಿಂದ ಬೀಜೋಪಚಾರ',
          'ಜಮೀನನ್ನು ಹಸನು ಮಾಡಿ ಸಮತಟ್ಟುಗೊಳಿಸಿ'
        ]
      },
      {
        stageNumber: 2,
        stage: 'Stage 2: Main Field Transplanting & Tillering',
        stageKn: 'ಹಂತ ೨: ನಾಟಿ ಮತ್ತು ಕವಲೊಡೆಯುವ ಹಂತ',
        days: 'Day 26 - 55',
        startDay: 26,
        endDay: 55,
        water: 'Shallow submergence (2-3 cm) for first 10 days, then Alternate Wetting & Drying (AWD)',
        waterKn: 'ಮೊದಲ ೧೦ ದಿನ ೨-೩ ಸೆಂ.ಮೀ ನೀರು, ನಂತರ ಆವರ್ತಕ ತೇವಾಂಶ',
        waterLitersPerDay: 18000,
        nutrition: 'Basal dose: 50% N + 100% P + 50% K + 10 kg Zinc Sulfate/acre',
        nutritionKn: 'ಮೂಲಗೊಬ್ಬರ: ೫೦% ಯೂರಿಯಾ + ಪೂರ್ಣ ಡಿಎಪಿ + ೫೦% ಪೊಟ್ಯಾಷ್ + ಸತು',
        protection: 'Spray Pretilachlor 50 EC @ 500ml/acre within 3 days for weed control',
        protectionKn: 'ನಾಟಿ ಮಾಡಿದ ೩ ದಿನಗಳಲ್ಲಿ ಪ್ರಿಟಿಲಾಕ್ಲೋರ್ ಕಳೆನಾಶಕ ಸಿಂಪಡಿಸಿ',
        expertTip: 'Adopt Alternate Wetting and Drying (AWD) to save 25% water and improve root depth.',
        expertTipKn: 'ಆವರ್ತಕ ನೀರು ನಿರ್ವಹಣೆ ಪದ್ಧತಿಯಿಂದ ಶೇ. ೨೫ ರಷ್ಟು ನೀರು ಉಳಿತಾಯವಾಗುತ್ತದೆ.',
        checklist: [
          'Transplant 2-3 seedlings per hill at 2-3 cm depth',
          'Broadcast Basal fertilizer mix before final puddling',
          'Apply pre-emergence weedicide within 3 days of planting',
          'Top dress first split of Urea (25kg/acre) on Day 40'
        ],
        checklistKn: [
          'ಪ್ರತಿ ಗುಂಡಿಗೆ ೨-೩ ಸಸಿಗಳನ್ನು ೨-೩ ಸೆಂ.ಮೀ ಆಳದಲ್ಲಿ ನೆಡಿ',
          'ಕಡೆಯ ಹಸನು ಮಾಡುವಾಗ ಮೂಲ ಗೊಬ್ಬರ ನೀಡಿಕೆ',
          'ನಾಟಿ ಮಾಡಿದ ೩ ದಿನಗಳಲ್ಲಿ ಕಳೆನಾಶಕ ಬಳಕೆ',
          '೪೦ನೇ ದಿನಕ್ಕೆ ಮೊದಲ ಕಂತಿನ ಯೂರಿಯಾ ಮೇಲುಗೊಬ್ಬರ'
        ]
      },
      {
        stageNumber: 3,
        stage: 'Stage 3: Panicle Initiation to Flowering (Critical Stage)',
        stageKn: 'ಹಂತ ೩: ತೆನೆ ಕಟ್ಟುವಿಕೆ ಮತ್ತು ಹೂವಾಡುವ ಹಂತ',
        days: 'Day 56 - 90',
        startDay: 56,
        endDay: 90,
        water: 'Maintain continuous 3-5 cm standing water. Do not allow soil to dry!',
        waterKn: 'ನಿರಂತರ ೩-೫ ಸೆಂ.ಮೀ ನೀರು ಕಡ್ಡಾಯ. ಮಣ್ಣು ಒಣಗಲು ಬಿಡಬೇಡಿ!',
        waterLitersPerDay: 25000,
        nutrition: 'Top dressing: 25% Urea + 25% MOP. Foliar Boron (1g/L) at 5% flowering',
        nutritionKn: 'ಮೇಲುಗೊಬ್ಬರವಾಗಿ ಯೂರಿಯಾ ಮತ್ತು ಪೊಟ್ಯಾಷ್; ಹೂವಾಡುವಾಗ ಬೋರಾನ್ ಸಿಂಪಡಣೆ',
        protection: 'Watch for Brown Planthopper (BPH) at tiller base and Sheath Blight',
        protectionKn: 'ಬುಡದಲ್ಲಿ ಕಂದು ಜಿಗಿಹುಳು ಮತ್ತು ಬೆಂಕಿ ರೋಗ ಪರೀಕ್ಷಿಸಿ',
        expertTip: 'Moisture stress at flowering causes chaffy/empty grains. Keep field consistently submerged.',
        expertTipKn: 'ಈ ಹಂತದಲ್ಲಿ ನೀರಿನ ಕೊರತೆಯಾದರೆ ಕಾಳು ಜೊಳ್ಳಾಗುತ್ತದೆ. ನಿರಂತರ ತೇವಾಂಶ ಕಾಪಾಡಿ.',
        checklist: [
          'Inspect tiller base weekly by parting plants for BPH nymphs',
          'Broadcast 2nd split of Urea + MOP Potash',
          'Spray 1% Potassium Nitrate (13-0-45) at booting stage',
          'Maintain 3-5 cm continuous ponding water'
        ],
        checklistKn: [
          'ಬುಡದಲ್ಲಿ ಕಂದು ಜಿಗಿಹುಳು ಇದೆಯೇ ಎಂದು ವಾರಕ್ಕೊಮ್ಮೆ ಪರಿಶೀಲಿಸಿ',
          'ಎರಡನೇ ಕಂತಿನ ಯೂರಿಯಾ ಮತ್ತು ಪೊಟ್ಯಾಷ್ ಗೊಬ್ಬರ',
          'ತೆನೆ ಮೂಡುವ ಮುನ್ನ ೧% ಪೊಟ್ಯಾಷಿಯಂ ನೈಟ್ರೇಟ್ ಸಿಂಪಡಣೆ',
          'ನಿರಂತರ ನೀರಿನ ಮಟ್ಟ ಕಾಪಾಡಿಕೊಳ್ಳಿ'
        ]
      },
      {
        stageNumber: 4,
        stage: 'Stage 4: Grain Filling & Harvesting',
        stageKn: 'ಹಂತ ೪: ಕಾಳು ಬಲಿಯುವಿಕೆ ಮತ್ತು ಕೊಯ್ಲು',
        days: 'Day 91 - 135',
        startDay: 91,
        endDay: 135,
        water: 'Drain field water completely 10-14 days before harvest',
        waterKn: 'ಕೊಯ್ಲಿಗೆ ೧೦-೧೪ ದಿನ ಮುಂಚಿತವಾಗಿ ನೀರನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ಬಸಿದುಬಿಡಿ',
        waterLitersPerDay: 8000,
        nutrition: 'Foliar spray of 0:0:50 (Potassium sulfate) @ 5g/L for bold heavy grain weight',
        nutritionKn: 'ಕಾಳು ಗಟ್ಟಿಯಾಗಲು ೦:೦:೫೦ ಪೊಟ್ಯಾಷಿಯಂ ಸಲ್ಫೇಟ್ ಸಿಂಪಡಿಸಿ',
        protection: 'Deter bird flocks with shiny reflective ribbons or drum beats',
        protectionKn: 'ಪಕ್ಷಿ ಮತ್ತು ಇಲಿ ಹಾವಳಿ ತಡೆಗಟ್ಟಿ',
        expertTip: 'Harvest when 85% panicles turn golden yellow. Dry grain to below 12% moisture before bagging.',
        expertTipKn: 'ಶೇ. ೮೫ ರಷ್ಟು ತೆನೆಗಳು ಬಂಗಾರದ ಬಣ್ಣಕ್ಕೆ ಬಂದಾಗ ಕೊಯ್ಲು ಮಾಡಿ. ಶೇ. ೧೨ ಕ್ಕಿಂತ ಕಡಿಮೆ ತೇವಾಂಶಕ್ಕೆ ಒಣಗಿಸಿ.',
        checklist: [
          'Stop irrigation 10-14 days before intended harvest date',
          'Check panicle color (85% golden yellow is optimal)',
          'Clean harvester cutter bar to prevent shatter losses',
          'Sun dry harvested paddy on clean tarpaulins to 12% moisture'
        ],
        checklistKn: [
          'ಕೊಯ್ಲಿಗೆ ೧೨ ದಿನ ಮುನ್ನ ನೀರು ಪೂರ್ಣ ಬಸಿದುಬಿಡಿ',
          'ತೆನೆಗಳ ಶೇ. ೮೫ ಬಂಗಾರದ ಬಣ್ಣಕ್ಕೆ ಬಂದಿರುವುದನ್ನು ದೃಢೀಕರಿಸಿ',
          'ಕೊಯ್ಲು ಯಂತ್ರದಿಂದ ಜೊಳ್ಳಾಗದಂತೆ ಸಮರ್ಪಕ ಕಟಾವು',
          'ಧಾನ್ಯವನ್ನು ಶೇ. ೧೨ ತೇವಾಂಶಕ್ಕೆ ಬಿಸಿಲಿನಲ್ಲಿ ಒಣಗಿಸಿ'
        ]
      }
    ],
    pestsAndDiseases: [
      {
        id: 'stem-borer',
        name: 'Yellow Stem Borer',
        nameKn: 'ಕಾಂಡ ಕೊರೆಯುವ ಹುಳು',
        type: 'pest',
        severity: 'high',
        symptoms: 'Dead hearts in vegetative stage and White heads (empty white panicles) at flowering.',
        symptomsKn: 'ಸಸಿ ಹಂತದಲ್ಲಿ ಒಣಗಿದ ತುದಿ ಮೊಗ್ಗು ಮತ್ತು ತೆನೆ ಹಂತದಲ್ಲಿ ಬಿಳಿ ಜೊಳ್ಳು ತೆನೆ.',
        organicControl: 'Install pheromone traps @ 8/acre. Release Trichogramma japonicum egg parasitoid @ 1 lakh/ha.',
        organicControlKn: 'ಎಕರೆಗೆ ೮ ಮೋಹಕ ಬಲೆ ಅಳವಡಿಸಿ. ಟ್ರೈಕೋಕಾರ್ಡ್ ಜೈವಿಕ ಪರಾವಲಂಬಿ ಬಳಸಿ.',
        chemicalControl: 'Apply Chlorantraniliprole 0.4% GR @ 4 kg/acre or spray Cartap Hydrochloride 50 SP @ 2g/L.',
        chemicalControlKn: 'ಕ್ಲೋರಾಂಟ್ರಾನಿಲಿಪ್ರೋಲ್ ೦.೪% ಹರಳು ಗೊಬ್ಬರದೊಂದಿಗೆ ಬೆರೆಸಿ ಅಥವಾ ಕಾರ್ಟಾಪ್ ಹೈಡ್ರೋಕ್ಲೋರೈಡ್ ಸಿಂಪಡಿಸಿ.'
      },
      {
        id: 'bph',
        name: 'Brown Plant Hopper',
        nameKn: 'ಕಂದು ಜಿಗಿಹುಳು',
        type: 'pest',
        severity: 'high',
        symptoms: 'Hopper burn: Circular patches of dried golden-yellow plants that look burnt.',
        symptomsKn: 'ಗಿಡಗಳ ಬುಡದಲ್ಲಿ ಗುಂಪುಗುಂಪಾಗಿ ರಸ ಹೀರಿ ಬೆಂಕಿ ಹೊತ್ತಿದಂತೆ ಗಿಡಗಳು ಒಣಗುತ್ತವೆ.',
        organicControl: 'Drain water from field for 3-4 days. Spray Neem Seed Kernel Extract (NSKE 5%).',
        organicControlKn: 'ಗದ್ದೆಯ ನೀರನ್ನು ೩-೪ ದಿನ ಬಸಿದುಬಿಡಿ. ಬೇವಿನ ಕಷಾಯ ಸಿಂಪಡಿಸಿ.',
        chemicalControl: 'Spray Pymetrozine 50 WDG @ 0.6g/L or Triflumezopyrim 10 SC @ 0.5ml/L directed strictly at the base of plants.',
        chemicalControlKn: 'ಪೈಮೆಟ್ರೋಜೈನ್ ೫೦ ಡಬ್ಲ್ಯೂಡಿಜಿ ಅಥವಾ ಟ್ರಿಫ್ಲುಮೆಜೋಪೈರಿಮ್ ಅನ್ನು ಗಿಡಗಳ ಬುಡಕ್ಕೆ ತಾಗುವಂತೆ ಸಿಂಪಡಿಸಿ.'
      },
      {
        id: 'blast',
        name: 'Blast Disease',
        nameKn: 'ಬೆಂಕಿ ರೋಗ (ಬ್ಲಾಸ್ಟ್)',
        type: 'disease',
        severity: 'high',
        symptoms: 'Spindle-shaped spots with ash-colored centers on leaves; black rot at panicle neck.',
        symptomsKn: 'ಎಲೆಗಳ ಮೇಲೆ ಕಣ್ಣಿನ ಆಕಾರದ ಬೂದು ಚುಕ್ಕೆಗಳು ಮತ್ತು ಕುತ್ತಿಗೆ ಕೊಳೆತ ರೋಗ.',
        organicControl: 'Spray Cow urine (10%) mixed with asafoetida (hing 1g/L). Avoid excessive nitrogen fertilizers.',
        organicControlKn: 'ಹಸುವಿನ ಗಂಜಳ ಮತ್ತು ಇಂಗು ದ್ರಾವಣ ಸಿಂಪಡಿಸಿ. ಅತಿಯಾದ ಯೂರಿಯಾ ತಪ್ಪಿಸಿ.',
        chemicalControl: 'Spray Tricyclazole 75 WP @ 0.6g/L or Isoprothiolane 40 EC @ 1.5ml/L at first appearance of spots.',
        chemicalControlKn: 'ಟ್ರೈಸೈಕ್ಲಾಜೋಲ್ ೭೫ ಡಬ್ಲ್ಯೂಪಿ ೦.೬ ಗ್ರಾಂ/ಲೀ ಅಥವಾ ಐಸೋಪ್ರೊಥಿಯೋಲೇನ್ ಸಿಂಪಡಿಸಿ.'
      }
    ],
    organicRemedies: [
      { remedy: 'Jeevamrutha Soil Drench', recipe: 'Mix 10kg desi cow dung + 10L cow urine + 2kg jaggery + 2kg pulse flour + handful virgin soil in 200L water. Ferment 48h.', target: 'Enhances native microbial soil life and speeds vegetative tillering' },
      { remedy: 'Neem Seed Kernel Extract (NSKE 5%)', recipe: 'Crush 5kg neem seed kernel, soak overnight in 100L water with 200g soap nut. Filter and spray.', target: 'Effective against Stem Borer and Leaf Folder' },
      { remedy: 'Agniastra Pest Repellent', recipe: 'Boil cow urine with neem, tobacco, green chilli and garlic paste. Dilute 2-3L per 100L water.', target: 'Controls aggressive sucking pests and grasshoppers' }
    ]
  },
  {
    id: 'ragi',
    name: 'Ragi / Finger Millet',
    nameKn: 'ರಾಗಿ',
    category: 'Millet',
    categoryKn: 'ಸಿರಿಧಾನ್ಯ',
    season: 'Kharif (July - Nov)',
    seasonKn: 'ಮುಂಗಾರು (ಜುಲೈ - ನವೆಂಬರ್)',
    duration: '105 - 120 Days',
    durationKn: '೧೦೫ - ೧೨೦ ದಿನಗಳು',
    totalDays: 115,
    soil: 'Red sandy loam, gravelly and alluvial soils with fair drainage',
    soilKn: 'ಕೆಂಪು ಮರಳು ಗೋಡು ಮಣ್ಣು ಮತ್ತು ಬಸಿದುಹೋಗುವ ಮಣ್ಣು',
    idealPh: '6.0 - 7.5',
    tempRange: '25°C - 32°C',
    waterNeed: 'Medium',
    avgYield: '14 - 18 Quintals / Acre',
    avgYieldKn: '೧೪ - ೧೮ ಕ್ವಿಂಟಾಲ್ / ಎಕರೆ',
    seedRatePerAcre: '2 kg (Transplanting) / 4 kg (Drilling)',
    seedRatePerAcreKn: '೨ ಕೆಜಿ (ನಾಟಿ) / ೪ ಕೆಜಿ (ಕೂರಿಗೆ ಬಿತ್ತನೆ)',
    spacing: '22.5 cm x 10 cm or 30 cm x 10 cm',
    npkRatio: { N: 40, P: 20, K: 20 },
    mspPerQuintal: 4290,
    avgMandiPricePerQ: 4600,
    costBreakdown: {
      seeds: 600,
      landPrep: 3200,
      fertilizers: 2400,
      pesticides: 1000,
      laborHarvest: 5500,
      expectedYieldQ: 16,
    },
    varieties: [
      { name: 'GPU-28', duration: '110-115 Days', yield: '16-18 Q/Acre', specialty: 'Highly popular in South Karnataka, blast disease tolerant, bold grains' },
      { name: 'ML-365', duration: '105-110 Days', yield: '15-17 Q/Acre', specialty: 'Drought hardy, high fodder value, responsive to organic manure' },
      { name: 'KMR-301', duration: '120 Days', yield: '18-20 Q/Acre', specialty: 'Long earhead, high calcium and iron content, lodging resistant' },
      { name: 'Indaf-9', duration: '100-105 Days', yield: '14-16 Q/Acre', specialty: 'Short duration, best for delayed monsoon sowings in August' }
    ],
    stages: [
      {
        stageNumber: 1,
        stage: 'Stage 1: Sowing & Seedling Establishment',
        stageKn: 'ಹಂತ ೧: ಬಿತ್ತನೆ ಮತ್ತು ಸಸಿ ಹಂತ',
        days: 'Day 0 - 21',
        startDay: 0,
        endDay: 21,
        water: 'Light irrigation or monsoon showers at sowing',
        waterKn: 'ಬಿತ್ತನೆಯ ವೇಳೆ ಹಗುರ ನೀರಾವರಿ ಅಥವಾ ಮಳೆ',
        waterLitersPerDay: 6000,
        nutrition: '4-5 tons FYM + Basal dose: 50% Urea + 100% DAP + 100% MOP',
        nutritionKn: 'ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರ + ಬಿತ್ತನೆ ಗೊಬ್ಬರವಾಗಿ ಡಿಎಪಿ ಮತ್ತು ಪೊಟ್ಯಾಷ್ ಪೂರ್ಣ ನೀಡಿ',
        protection: 'Treat seeds with Trichoderma @ 5g/kg + Azospirillum @ 25g/kg',
        protectionKn: 'ಟ್ರೈಕೋಡರ್ಮಾ ಮತ್ತು ಅಜೋಸ್ಪೈರಿಲಂ ಜೈವಿಕ ಬೀಜೋಪಚಾರ',
        expertTip: 'Hardening seeds in 1% calcium chloride solution for 6 hours increases drought resistance by 35%.',
        expertTipKn: 'ಬೀಜಗಳನ್ನು ಕ್ಯಾಲ್ಸಿಯಂ ಕ್ಲೋರೈಡ್ ದ್ರಾವಣದಲ್ಲಿ ನೆನೆಸಿ ಬಿತ್ತಿದರೆ ಬರ ನಿರೋಧಕ ಶಕ್ತಿ ಹೆಚ್ಚುತ್ತದೆ.',
        checklist: [
          'Apply 4-5 carts well decomposed FYM during ploughing',
          'Perform seed treatment with bio-fertilizers',
          'Open conservation furrows every 3.3m to harvest rainwater',
          'Sow in rows with seed drill or nursery transplanting'
        ],
        checklistKn: [
          'ಉಳುಮೆಯ ವೇಳೆ ೪-೫ ಗಾಡಿ ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರ ಸೇರಿಸಿ',
          'ಜೈವಿಕ ಗೊಬ್ಬರಗಳಿಂದ ಬೀಜೋಪಚಾರ ಮಾಡಿ',
          'ಮಳೆ ನೀರು ಸಂರಕ್ಷಣೆಗೆ ಬೋದುಗಳನ್ನು ನಿರ್ಮಿಸಿ',
          'ಸಾಲು ಪದ್ಧತಿಯಲ್ಲಿ ಬಿತ್ತನೆ ಮಾಡಿ'
        ]
      },
      {
        stageNumber: 2,
        stage: 'Stage 2: Tillering & Inter-cultivation',
        stageKn: 'ಹಂತ ೨: ಕವಲೊಡೆಯುವಿಕೆ ಮತ್ತು ಎಡೆಕುಂಟೆ',
        days: 'Day 22 - 45',
        startDay: 22,
        endDay: 45,
        water: 'Moisture needed every 10-12 days if rains fail',
        waterKn: 'ಮಳೆ ಬಾರದಿದ್ದರೆ ೧೦-೧೨ ದಿನಕ್ಕೊಮ್ಮೆ ನೀರು',
        waterLitersPerDay: 9000,
        nutrition: 'First top dressing: 25% Urea (approx 20 kg/acre) during second weeding',
        nutritionKn: 'ಎಡೆಕುಂಟೆ ಹೊಡೆದ ನಂತರ ಮೊದಲ ಕಂತಿನ ಯೂರಿಯಾ ನೀಡಿ',
        protection: 'Control early weeds with mechanical cultivator blade',
        protectionKn: 'ಎಡೆಕುಂಟೆಯಿಂದ ಕಳೆ ನಿಯಂತ್ರಿಸಿ ಮತ್ತು ಮಣ್ಣು ಸಡಿಲಗೊಳಿಸಿ',
        expertTip: 'Passing cultivator twice (Day 25 and Day 35) conserves subsoil moisture and doubles productive tillers.',
        expertTipKn: '೨೫ ಮತ್ತು ೩೫ನೇ ದಿನಕ್ಕೆ ಎಡೆಕುಂಟೆ ಹೊಡೆದರೆ ಮಣ್ಣಿನಲ್ಲಿ ತೇವಾಂಶ ಉಳಿದು ತೆನೆಗಳ ಸಂಖ್ಯೆ ದ್ವಿಗುಣವಾಗುತ್ತದೆ.',
        checklist: [
          'Run inter-cultivation blade at Day 25 to mulch topsoil',
          'Thin out excess seedlings to maintain 10cm spacing',
          'Apply top dressing Urea when soil has moist condition',
          'Check for early grasshopper feeding'
        ],
        checklistKn: [
          '೨೫ನೇ ದಿನಕ್ಕೆ ಎಡೆಕುಂಟೆ ಹೊಡೆದು ಮಣ್ಣು ಸಡಿಲಗೊಳಿಸಿ',
          'ಸಸಿಗಳ ನಡುವೆ ೧೦ ಸೆಂ.ಮೀ ಅಂತರ ಇರುವಂತೆ ಹೆಚ್ಚುವರಿ ಗಿಡಗಳನ್ನು ತೆಗೆಯಿರಿ',
          'ತೇವಾಂಶವಿದ್ದಾಗ ಯೂರಿಯಾ ಮೇಲುಗೊಬ್ಬರ ನೀಡಿ',
          'ಮಿಡತೆ ಹಾವಳಿ ಪರೀಕ್ಷಿಸಿ'
        ]
      },
      {
        stageNumber: 3,
        stage: 'Stage 3: Earhead Emergence & Grain Filling',
        stageKn: 'ಹಂತ ೩: ತೆನೆ ಮೂಡುವಿಕೆ ಮತ್ತು ಕಾಳು ಕಟ್ಟುವ ಹಂತ',
        days: 'Day 46 - 85',
        startDay: 46,
        endDay: 85,
        water: 'Critical moisture required. Provide life-saving irrigation!',
        waterKn: 'ಅತ್ಯಂತ ಸೂಕ್ಷ್ಮ ಹಂತ: ರಕ್ಷಣಾತ್ಮಕ ನೀರಾವರಿ ಕಡ್ಡಾಯ',
        waterLitersPerDay: 12000,
        nutrition: 'Second top dressing: Remaining 25% Urea + 19:19:19 spray @ 10g/L',
        nutritionKn: 'ಎರಡನೇ ಕಂತಿನ ಯೂರಿಯಾ ಹಾಗೂ ೧೯:೧೯:೧೯ ಸಿಂಪಡಿಸಿ',
        protection: 'Watch for neck blast and finger blast if foggy weather occurs',
        protectionKn: 'ಮೋಡ ಕವಿದ ವಾತಾವರಣದಲ್ಲಿ ಬೆಂಕಿ ರೋಗದ ಎಚ್ಚರಿಕೆ ವಹಿಸಿ',
        expertTip: 'Do not allow soil to crack during grain dough stage to prevent small shriveled grains.',
        expertTipKn: 'ಕಾಳು ಕಟ್ಟುವಾಗ ಮಣ್ಣು ಬಿರುಕು ಬಿಡದಂತೆ ನೋಡಿಕೊಳ್ಳಿ.',
        checklist: [
          'Provide life-saving irrigation during drought spell',
          'Foliar spray of 19-19-19 water soluble fertilizer',
          'Prevent neck blast by spraying if cloudy weather persists',
          'Erect bird scaring ribbons'
        ],
        checklistKn: [
          'ಬರ ಪರಿಸ್ಥಿತಿಯಿದ್ದರೆ ಜೀವ ರಕ್ಷಕ ನೀರಾವರಿ ನೀಡಿ',
          '೧೯-೧೯-೧೯ ನೀರಿನಲ್ಲಿ ಕರಗುವ ಗೊಬ್ಬರ ಸಿಂಪಡಣೆ',
          'ಮೋಡ ಕವಿದಿದ್ದರೆ ಬೆಂಕಿ ರೋಗಕ್ಕೆ ಮುನ್ನೆಚ್ಚರಿಕೆ ಔಷಧಿ',
          'ಹಕ್ಕಿಗಳನ್ನು ಓಡಿಸಲು ರಿಬ್ಬನ್ ಕಟ್ಟಿ'
        ]
      },
      {
        stageNumber: 4,
        stage: 'Stage 4: Ripening & Harvest',
        stageKn: 'ಹಂತ ೪: ಮಾಗುವಿಕೆ ಮತ್ತು ಕೊಯ್ಲು',
        days: 'Day 86 - 115',
        startDay: 86,
        endDay: 115,
        water: 'Stop irrigation 10 days before harvesting',
        waterKn: 'ಕೊಯ್ಲಿಗೆ ೧೦ ದಿನ ಮುನ್ನ ನೀರು ನಿಲ್ಲಿಸಿ',
        waterLitersPerDay: 4000,
        nutrition: 'No chemical fertilizers needed',
        nutritionKn: 'ಯಾವುದೇ ಗೊಬ್ಬರ ನೀಡಬೇಕಾಗಿಲ್ಲ',
        protection: 'Store in dry bins treated with neem leaf bedding',
        protectionKn: 'ಬೇವಿನ ಸೊಪ್ಪಿನೊಂದಿಗೆ ಒಣಗಿದ ಕಣಜದಲ್ಲಿ ಧಾನ್ಯ ಶೇಖರಿಸಿ',
        expertTip: 'Harvest when 80% earheads turn chocolate brown. Stack in field for 4 days before threshing.',
        expertTipKn: 'ಶೇ. ೮೦ ರಷ್ಟು ತೆನೆಗಳು ಕಂದು ಬಣ್ಣಕ್ಕೆ ಬಂದಾಗ ಕೊಯ್ಲು ಮಾಡಿ ೪ ದಿನ ಬಣವೆ ಹಾಕಿ ಒಕ್ಕಣೆ ಮಾಡಿ.',
        checklist: [
          'Inspect earheads for chocolate brown color',
          'Cut earheads with sickle and stack in a heap (ಬಣವೆ)',
          'Sun dry on thrashing floor to under 10% moisture',
          'Harvest quality dry ragi straw for cattle fodder'
        ],
        checklistKn: [
          'ತೆನೆಗಳು ಕಂದು ಬಣ್ಣಕ್ಕೆ ತಿರುಗಿರುವುದನ್ನು ದೃಢೀಕರಿಸಿ',
          'ಕೊಯ್ಲು ಮಾಡಿ ೪ ದಿನ ಬಣವೆ ಹಾಕಿ ಮಾಗಲು ಬಿಡಿ',
          'ಒಕ್ಕಣೆ ಮಾಡಿ ಕಣದಲ್ಲಿ ಒಣಗಿಸಿ',
          'ರಾಗಿ ಹುಲ್ಲನ್ನು ದನಕರುಗಳ ಮೇವಿಗಾಗಿ ಸಂರಕ್ಷಿಸಿ'
        ]
      }
    ],
    pestsAndDiseases: [
      {
        id: 'ragi-blast',
        name: 'Finger & Neck Blast',
        nameKn: 'ಬೆಂಕಿ ರೋಗ',
        type: 'disease',
        severity: 'high',
        symptoms: 'Brown spindle lesions on leaves, blackened neck of the earhead resulting in chaffy grain.',
        symptomsKn: 'ಎಲೆಗಳ ಮೇಲೆ ಕಂದು ಚುಕ್ಕೆ ಹಾಗೂ ತೆನೆಯ ಕುತ್ತಿಗೆ ಕಪ್ಪಾಗಿ ಕಾಳು ಜೊಳ್ಳಾಗುವುದು.',
        organicControl: 'Soak seeds in cow urine solution. Spray Panchagavya 3% at booting stage.',
        organicControlKn: 'ಹಸುವಿನ ಗಂಜಳದಲ್ಲಿ ಬೀಜೋಪಚಾರ. ಪಂಚಗವ್ಯ ಸಿಂಪಡಣೆ.',
        chemicalControl: 'Spray Kitazin 48 EC @ 2ml/L or Carbendazim 50 WP @ 1g/L at flowering.',
        chemicalControlKn: 'ಕಿಟಾಜಿನ್ ೪೮ ಇಸಿ ೨ ಮಿ.ಲೀ/ಲೀ ಅಥವಾ ಕಾರ್ಬೆಂಡಾಜಿಮ್ ಸಿಂಪಡಿಸಿ.'
      },
      {
        id: 'army-worm',
        name: 'Armyworm / Cutworm',
        nameKn: 'ಲದ್ದಿ ಹುಳು',
        type: 'pest',
        severity: 'moderate',
        symptoms: 'Caterpillars feed on tender leaves at night and hide in the soil cracks during the day.',
        symptomsKn: 'ರಾತ್ರಿ ವೇಳೆ ಎಲೆಗಳನ್ನು ಕಡಿದು ತಿನ್ನುವ ಮರಿಹುಳುಗಳು, ಹಗಲು ಮಣ್ಣಿನ ಬಿರುಕುಗಳಲ್ಲಿ ಅಡಗುತ್ತವೆ.',
        organicControl: 'Dust wood ash with dry neem leaf powder around plant base.',
        organicControlKn: 'ಗಿಡಗಳ ಬುಡಕ್ಕೆ ಬೂದಿ ಮತ್ತು ಬೇವಿನ ಪುಡಿ ಧೂಳೀಕರಿಸಿ.',
        chemicalControl: 'Spray Chlorpyrifos 20 EC @ 2.5ml/L in the evening hours.',
        chemicalControlKn: 'ಸಂಜೆ ವೇಳೆ ಕ್ಲೋರ್‌ಪೈರಿಫಾಸ್ ೨.೫ ಮಿ.ಲೀ/ಲೀ ಸಿಂಪಡಿಸಿ.'
      }
    ],
    organicRemedies: [
      { remedy: 'Cow Urine & Asafoetida Spray', recipe: '5L desi cow urine + 100g hing (asafoetida) in 100L water. Spray at tillering.', target: 'Prevents fungal neck blast and strengthens earheads' },
      { remedy: 'Panchagavya Foliar Spray (3%)', recipe: '3L organic Panchagavya in 100L water. Spray at 30 and 60 days.', target: 'Enhances grain boldness and plant vigor' },
      { remedy: 'Neem Cake Soil Application', recipe: 'Apply 150 kg neem cake per acre with basal compost.', target: 'Suppresses root grubs and white ants' }
    ]
  },
  {
    id: 'tomato',
    name: 'Tomato',
    nameKn: 'ಟೊಮೇಟೊ',
    category: 'Vegetable',
    categoryKn: 'ತರಕಾರಿ ಬೆಳೆ',
    season: 'Year-Round (Best: Kharif June-July, Rabi Oct-Nov)',
    seasonKn: 'ವರ್ಷಪೂರ್ತಿ (ಮುಂಗಾರು & ಹಿಂಗಾರು)',
    duration: '115 - 130 Days',
    durationKn: '೧೧೫ - ೧೩೦ ದಿನಗಳು',
    totalDays: 125,
    soil: 'Well-drained sandy loam or clay loam with rich organic matter',
    soilKn: 'ಉತ್ತಮ ಸಾವಯವ ಅಂಶವುಳ್ಳ ಗೋಡು ಮಣ್ಣು',
    idealPh: '6.0 - 6.8',
    tempRange: '18°C - 30°C',
    waterNeed: 'Critical',
    avgYield: '18 - 25 Tons / Acre (Hybrid)',
    avgYieldKn: '೧೮ - ೨೫ ಟನ್ / ಎಕರೆ',
    seedRatePerAcre: '50 - 60 grams (Hybrid) in pro-trays',
    seedRatePerAcreKn: '೫೦ - ೬೦ ಗ್ರಾಂ (ಹೈಬ್ರಿಡ್ ಸಸಿಮಡಿ)',
    spacing: '90 cm x 45 cm or 120 cm x 60 cm (Trellis)',
    npkRatio: { N: 75, P: 50, K: 50 },
    mspPerQuintal: 1800,
    avgMandiPricePerQ: 2200,
    costBreakdown: {
      seeds: 3500,
      landPrep: 5000,
      fertilizers: 7500,
      pesticides: 6500,
      laborHarvest: 12000,
      expectedYieldQ: 200, // in quintals (20 tons)
    },
    varieties: [
      { name: 'Arka Rakshak (IIHR)', duration: '130 Days', yield: '30-35 Tons/Acre', specialty: 'Triple disease resistant (ToLCV, Early Blight, Bacterial Wilt), firm fruit' },
      { name: 'Shivam Hybrid', duration: '120 Days', yield: '25-28 Tons/Acre', specialty: 'Uniform round fruits, deep red color, preferred for Mandi transport' },
      { name: 'Arka Samrat', duration: '135 Days', yield: '32-36 Tons/Acre', specialty: 'High heat tolerance, thick pericarp for 15-day shelf life' },
      { name: 'Abhinav (Syngenta)', duration: '125 Days', yield: '28-30 Tons/Acre', specialty: 'Square-round heavy fruits, high disease tolerance' }
    ],
    stages: [
      {
        stageNumber: 1,
        stage: 'Stage 1: Pro-Tray Nursery & Staking Preparation',
        stageKn: 'ಹಂತ ೧: ಪ್ರೋಟ್ರೆ ಸಸಿಮಡಿ ಮತ್ತು ಆಸರೆ ಕಂಬ',
        days: 'Day 0 - 25',
        startDay: 0,
        endDay: 25,
        water: 'Fine rose can watering twice daily in shade net',
        waterKn: 'ನೆರಳು ಪರದೆಯಲ್ಲಿ ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ ಹಗುರ ನೀರು',
        waterLitersPerDay: 5000,
        nutrition: 'Grow in sterilized coco peat enriched with Trichoderma. 19:19:19 drench @ Day 15',
        nutritionKn: 'ಕೊಕೊಪೀಟ್‌ನಲ್ಲಿ ೧೯:೧೯:೧೯ ಲಘು ದ್ರಾವಣ',
        protection: 'Dip seedling roots in Imidacloprid (0.5ml/L) for 15 mins before planting',
        protectionKn: 'ಎಲೆ ಮುದುರು ರೋಗ ತಡೆಯಲು ಬೇರುಗಳನ್ನು ಕೀಟನಾಶಕದಲ್ಲಿ ಅದ್ದಿ ನೆಡಿ',
        expertTip: 'Hardening seedlings under open sunlight for 4 days before transplanting prevents seedling shock.',
        expertTipKn: 'ನಾಟಿ ಮಾಡುವ ಮುನ್ನ ೪ ದಿನ ಸಸಿಗಳನ್ನು ಬಿಸಿಲಿಗೆ ಒಡ್ಡಿ ಗಟ್ಟಿಗೊಳಿಸಿ.',
        checklist: [
          'Raise hybrid seedlings in 98-cavity pro-trays with sterile coco peat',
          'Spray 19-19-19 (3g/L) at Day 12 for strong root vigor',
          'Harden seedlings 4 days before transplanting',
          'Lay drip lines and 25-micron silver-black plastic mulch in field'
        ],
        checklistKn: [
          'ಪ್ರೋಟ್ರೆಗಳಲ್ಲಿ ಕೊಕೊಪೀಟ್ ತುಂಬಿ ಸಸಿ ಬೆಳೆಸಿ',
          '೧೨ನೇ ದಿನಕ್ಕೆ ಲಘು ಗೊಬ್ಬರ ಸಿಂಪಡಿಸಿ ಬೇರು ಬಲಪಡಿಸಿ',
          'ನಾಟಿ ಮುನ್ನ ಸಸಿಗಳನ್ನು ಬಿಸಿಲಿನಲ್ಲಿ ಗಟ್ಟಿಗೊಳಿಸಿ',
          'ಜಮೀನಿನಲ್ಲಿ ಹನಿ ನೀರಾವರಿ ಪೈಪ್ ಹಾಗೂ ಮಲ್ಚಿಂಗ್ ಶೀಟ್ ಅಳವಡಿಸಿ'
        ]
      },
      {
        stageNumber: 2,
        stage: 'Stage 2: Vegetative Growth & Trellising / Staking',
        stageKn: 'ಹಂತ ೨: ಗಿಡ ಬೆಳೆವಣಿಗೆ ಮತ್ತು ಆಸರೆ ಕಟ್ಟುವುದು',
        days: 'Day 26 - 55',
        startDay: 26,
        endDay: 55,
        water: 'Daily drip irrigation: 2-3 hours depending on soil type',
        waterKn: 'ಹನಿ ನೀರಾವರಿ ಮೂಲಕ ನಿತ್ಯ ೨-೩ ಗಂಟೆ ನೀರು',
        waterLitersPerDay: 14000,
        nutrition: 'Fertigation: 12:61:00 (MAP) 3 kg/acre + Micronutrient mixture (Zinc+Boron)',
        nutritionKn: 'ಡ್ರಿಪ್ ಮೂಲಕ ೧೨:೬೧:೦೦ ರಂಜಕ ಗೊಬ್ಬರ ಮತ್ತು ಲಘು ಪೋಷಕಾಂಶ ನೀಡಿ',
        protection: 'Monitor for Tuta absoluta (Tomato pinworm) and Early Blight leaf spot',
        protectionKn: 'ಟುಟಾ ಕೀಟ ಮತ್ತು ಎಲೆ ಚುಕ್ಕೆ ರೋಗ ಪರೀಕ್ಷಿಸಿ',
        expertTip: 'Staking plants with bamboo poles and wire keeps leaves dry, reducing fungal diseases by 60%.',
        expertTipKn: 'ಗಿಡಗಳಿಗೆ ಆಸರೆ ಕಂಬ ಕಟ್ಟಿ ನೆಲಕ್ಕೆ ತಾಗದಂತೆ ನೋಡಿಕೊಂಡರೆ ರೋಗಗಳು ಶೇ. ೬೦ ಕಡಿಮೆಯಾಗುತ್ತವೆ.',
        checklist: [
          'Erect strong bamboo stakes every 3 meters and string GI wire',
          'Prune side suckers up to 20 cm from ground level',
          'Inject 12-61-00 (MAP) via drip fertigation twice weekly',
          'Install yellow sticky traps (25/acre) for whiteflies'
        ],
        checklistKn: [
          'ಬಿದಿರಿನ ಕಂಬ ಮತ್ತು ತಂತಿ ಕಟ್ಟಿ ಗಿಡಗಳಿಗೆ ಆಸರೆ ನೀಡಿ',
          'ಬುಡದಿಂದ ೨೦ ಸೆಂ.ಮೀ ವರೆಗಿನ ಕಂಕುಳು ಕವಲುಗಳನ್ನು ತೆಗೆಯಿರಿ',
          'ಡ್ರಿಪ್ ಮೂಲಕ ವಾರಕ್ಕೆರಡು ಬಾರಿ ೧೨-೬೧-೦೦ ಗೊಬ್ಬರ ನೀಡಿ',
          'ಬಿಳಿ ನೊಣ ನಿಯಂತ್ರಣಕ್ಕೆ ಹಳದಿ ಜಿಗುಟು ಬಲೆ ಅಳವಡಿಸಿ'
        ]
      },
      {
        stageNumber: 3,
        stage: 'Stage 3: Flowering & Fruit Setting (Calcium Critical)',
        stageKn: 'ಹಂತ ೩: ಹೂವು ಮತ್ತು ಕಾಯಿ ಕಟ್ಟುವ ಹಂತ',
        days: 'Day 56 - 85',
        startDay: 56,
        endDay: 85,
        water: 'Regular consistent moisture. NEVER allow soil moisture to fluctuate!',
        waterKn: 'ನಿಯಮಿತ ನೀರು ಕಡ್ಡಾಯ. ನೀರಿನ ಏರಿಳಿತವಾದರೆ ಕಾಯಿಗಳು ಸೀಳುತ್ತವೆ!',
        waterLitersPerDay: 20000,
        nutrition: 'Apply Calcium Nitrate (5 kg/acre) + Boron (500g) via drip to prevent Blossom End Rot',
        nutritionKn: 'ಕಾಯಿ ತಳ ಕೊಳೆ ರೋಗ ತಡೆಯಲು ಕ್ಯಾಲ್ಸಿಯಂ ನೈಟ್ರೇಟ್ ಮತ್ತು ಬೋರಾನ್ ನೀಡಿ',
        protection: 'Install Helilure pheromone traps @ 5 per acre for fruit borer control',
        protectionKn: 'ಕಾಯಿ ಕೊರೆಯುವ ಹುಳುವಿಗೆ ಮೋಹಕ ಬಲೆ ಅಳವಡಿಸಿ',
        expertTip: 'Calcium deficiency causes black rotten fruit bottoms (Blossom End Rot). Spray calcium chelate weekly.',
        expertTipKn: 'ಕ್ಯಾಲ್ಸಿಯಂ ಕೊರತೆಯಿಂದ ಕಾಯಿ ತಳ ಕೊಳೆಯುತ್ತದೆ. ವಾರಕ್ಕೊಮ್ಮೆ ಸಿಂಪಡಿಸಿ.',
        checklist: [
          'Fertigate Calcium Nitrate (5 kg/acre) every 5 days',
          'Foliar spray of Boron (1.5g/L) for 95% fruit setting',
          'Tie growing branches to upper trellis wires',
          'Monitor fruit tips for black blossom-end rot spots'
        ],
        checklistKn: [
          'ಕ್ಯಾಲ್ಸಿಯಂ ನೈಟ್ರೇಟ್ ಅನ್ನು ಪ್ರತಿ ೫ ದಿನಕ್ಕೊಮ್ಮೆ ಡ್ರಿಪ್‌ನಲ್ಲಿ ನೀಡಿ',
          'ಹೂವು ಚೆನ್ನಾಗಿ ಕಾಯಿ ಕಟ್ಟಲು ಬೋರಾನ್ ಸಿಂಪಡಿಸಿ',
          'ಬೆಳೆದ ರೆಂಬೆಗಳನ್ನು ತಂತಿಗೆ ಕಟ್ಟಿ ನೆಲಕ್ಕೆ ತಾಗದಂತೆ ಮಾಡಿ',
          'ಕಾಯಿ ತಳ ಕೊಳೆಯುತ್ತಿದೆಯೇ ಪರೀಕ್ಷಿಸಿ'
        ]
      },
      {
        stageNumber: 4,
        stage: 'Stage 4: Fruit Ripening & Staggered Harvests',
        stageKn: 'ಹಂತ ೪: ಕಾಯಿ ಕಟಾವು ಮತ್ತು ಮಾರುಕಟ್ಟೆ',
        days: 'Day 86 - 130',
        startDay: 86,
        endDay: 130,
        water: 'Moderate drip irrigation; avoid excessive water before picking',
        waterKn: 'ಕೊಯ್ಲಿನ ಮುನ್ನ ಅತಿಯಾದ ನೀರು ನೀಡಬೇಡಿ',
        waterLitersPerDay: 16000,
        nutrition: 'Fertigation: 13:00:45 (Potassium Nitrate) 4 kg/acre to enhance bright red color',
        nutritionKn: 'ಉತ್ತಮ ಗಾಢ ಕೆಂಪು ಬಣ್ಣಕ್ಕೆ ೧೩:೦೦:೪೫ ಪೊಟ್ಯಾಷಿಯಂ ಗೊಬ್ಬರ ನೀಡಿ',
        protection: 'Pick affected fruits immediately and bury away from field',
        protectionKn: 'ರೋಗಗ್ರಸ್ತ ಕಾಯಿಗಳನ್ನು ತಕ್ಷಣ ಕಿತ್ತು ನಾಶಪಡಿಸಿ',
        expertTip: 'Harvest at pink/breaker stage for long distance Bangalore APMC transport to maximize shelf life.',
        expertTipKn: 'ದೂರದ ಮಾರುಕಟ್ಟೆಗೆ ಸಾಗಿಸಲು ಕಾಯಿಗಳು ಹೊಂಬಣ್ಣಕ್ಕೆ ತಿರುಗಿದಾಗ ಕೊಯ್ಲು ಮಾಡಿ.',
        checklist: [
          'Harvest fruit at breaker stage (green with slight pink tinge)',
          'Sort and grade fruits into plastic crates (avoid gunny bags)',
          'Inject Potassium Nitrate (13-0-45) to maximize fruit gloss',
          'Check local Mandi auction prices before dispatching trucks'
        ],
        checklistKn: [
          'ದೂರದ ಮಾರುಕಟ್ಟೆಗೆ ಸಾಗಿಸಲು ಹೊಂಬಣ್ಣಕ್ಕೆ ತಿರುಗಿದಾಗ ಕೊಯ್ಲು ಮಾಡಿ',
          'ಪ್ಲಾಸ್ಟಿಕ್ ಕ್ರೇಟ್‌ಗಳಲ್ಲಿ ಗ್ರೇಡಿಂಗ್ ಮಾಡಿ',
          'ಕಾಯಿಗಳು ಹೊಳಪು ಪಡೆಯಲು ಪೊಟ್ಯಾಷಿಯಂ ನೈಟ್ರೇಟ್ ನೀಡಿ',
          'ಲೋಡ್ ಕಳುಹಿಸುವ ಮುನ್ನ ಮಂಡಿ ಧಾರಣೆ ಪರಿಶೀಲಿಸಿ'
        ]
      }
    ],
    pestsAndDiseases: [
      {
        id: 'fruit-borer',
        name: 'Fruit Borer',
        nameKn: 'ಕಾಯಿ ಕೊರೆಯುವ ಹುಳು',
        type: 'pest',
        severity: 'high',
        symptoms: 'Circular entrance holes on green and ripe fruits with caterpillar head thrust inside feeding.',
        symptomsKn: 'ಕಾಯಿಗಳಿಗೆ ದುಂಡಗಿನ ರಂಧ್ರಗಳನ್ನು ಕೊರೆದು ಒಳಗೆ ತಿನ್ನುವ ಮರಿಹುಳು.',
        organicControl: 'Install 5 Helilure pheromone traps/acre. Spray HaNPV virus @ 250 LE/acre in late evenings.',
        organicControlKn: 'ಎಕರೆಗೆ ೫ ಮೋಹಕ ಬಲೆ ಅಳವಡಿಸಿ. ಎಚ್‌ಎನ್‌ಪಿವಿ ಜೈವಿಕ ವೈರಾಣು ಸಿಂಪಡಿಸಿ.',
        chemicalControl: 'Spray Flubendiamide 39.35% SC @ 0.3ml/L or Emamectin Benzoate 5% SG @ 0.4g/L.',
        chemicalControlKn: 'ಫ್ಲೂಬೆಂಡಿಯಮೈಡ್ ೦.೩ ಮಿ.ಲೀ/ಲೀ ಅಥವಾ ಎಮಾಮೆಕ್ಟಿನ್ ಬೆಂಜೋಯೇಟ್ ೦.೪ ಗ್ರಾಂ/ಲೀ ಸಿಂಪಡಿಸಿ.'
      },
      {
        id: 'leaf-curl',
        name: 'Tomato Leaf Curl Virus',
        nameKn: 'ಎಲೆ ಮುದುರು ರೋಗ',
        type: 'disease',
        severity: 'high',
        symptoms: 'Upward curling and puckering of leaves, stunted bushy growth with no fruit setting.',
        symptomsKn: 'ಎಲೆಗಳು ಮೇಲ್ಮುಖವಾಗಿ ಮುದುರಿಕೊಳ್ಳುವುದು, ಗಿಡ ಗಿಡ್ಡವಾಗಿ ಕಾಯಿ ಕಟ್ಟುವುದಿಲ್ಲ.',
        organicControl: 'Spray fermented sour buttermilk (5L in 100L water) weekly. Control whitefly vector with yellow sticky traps.',
        organicControlKn: 'ಹುಳಿ ಮಜ್ಜಿಗೆ ಸಿಂಪಡಿಸಿ. ಹಳದಿ ಅಂಟು ಬಲೆಗಳಿಂದ ಬಿಳಿ ನೊಣ ಹತೋಟಿ ಮಾಡಿ.',
        chemicalControl: 'Spray Diafenthiuron 50 WP @ 1.2g/L or Spiromesifen 22.9 SC @ 1ml/L to control whiteflies.',
        chemicalControlKn: 'ಬಿಳಿ ನೊಣ ನಿಯಂತ್ರಣಕ್ಕೆ ಡಯಾಫೆಂಥಿಯುರಾನ್ ಅಥವಾ ಸ್ಪೈರೋಮೆಸಿಫೆನ್ ಸಿಂಪಡಿಸಿ.'
      },
      {
        id: 'early-blight',
        name: 'Early Blight',
        nameKn: 'ಆರಂಭಿಕ ಎಲೆ ಚುಕ್ಕೆ ರೋಗ',
        type: 'disease',
        severity: 'moderate',
        symptoms: 'Concentric target-board rings on lower leaves, turning yellow and defoliating rapidly.',
        symptomsKn: 'ಕೆಳಗಿನ ಎಲೆಗಳ ಮೇಲೆ ಗುರಿ ಹಲಗೆಯಂತಹ ಕಂದು ವೃತ್ತಾಕಾರದ ಚುಕ್ಕೆಗಳು, ಎಲೆ ಉದುರುವಿಕೆ.',
        organicControl: 'Spray Trichoderma harzianum @ 5g/L + Pseudomonas fluorescens @ 5g/L preventive.',
        organicControlKn: 'ಟ್ರೈಕೋಡರ್ಮಾ ಮತ್ತು ಸೂಡೋಮೊನಾಸ್ ಜೈವಿಕ ದ್ರಾವಣ ಸಿಂಪಡಿಸಿ.',
        chemicalControl: 'Spray Mancozeb 75 WP @ 2.5g/L or Azoxystrobin + Difenoconazole @ 1ml/L.',
        chemicalControlKn: 'ಮ್ಯಾಂಕೋಜೆಬ್ ೨.೫ ಗ್ರಾಂ/ಲೀ ಅಥವಾ ಅಜಾಕ್ಸಿಸ್ಟ್ರೋಬಿನ್ + ಡೈಫೆನೊಕೊನಜೋಲ್ ಸಿಂಪಡಿಸಿ.'
      }
    ],
    organicRemedies: [
      { remedy: 'Fermented Butter Milk (ಹುಳಿ ಮಜ್ಜಿಗೆ)', recipe: '5L sour butter milk diluted in 100L water. Spray weekly.', target: 'Suppresses viral leaf curl and boosts fruit shine' },
      { remedy: 'Yellow Sticky Traps', recipe: 'Install 15-20 yellow and blue sticky sheets per acre at canopy height.', target: 'Captures whiteflies, thrips, and aphids without chemicals' },
      { remedy: 'Trichoderma Viride Drenching', recipe: 'Mix 2 kg Trichoderma in 200L water and drench around plant base.', target: 'Guards against root rot and bacterial wilt' }
    ]
  },
  {
    id: 'maize',
    name: 'Maize / Corn',
    nameKn: 'ಮೆಕ್ಕೆಜೋಳ',
    category: 'Cereal',
    categoryKn: 'ಏಕದಳ ಧಾನ್ಯ',
    season: 'Kharif (June-July) & Rabi (Oct-Nov)',
    seasonKn: 'ಮುಂಗಾರು ಮತ್ತು ಹಿಂಗಾರು',
    duration: '110 - 125 Days',
    durationKn: '೧೧೦ - ೧೨೫ ದಿನಗಳು',
    totalDays: 115,
    soil: 'Deep well-drained loams, silt loams and alluvial soils with high fertility',
    soilKn: 'ಉತ್ತಮ ನೀರು ಬಸಿದುಹೋಗುವ ಫಲವತ್ತಾದ ಕಪ್ಪು ಅಥವಾ ಕೆಂಪು ಗೋಡು ಮಣ್ಣು',
    idealPh: '6.5 - 7.5',
    tempRange: '20°C - 35°C',
    waterNeed: 'Medium',
    avgYield: '30 - 38 Quintals / Acre (Hybrid)',
    avgYieldKn: '೩೦ - ೩೮ ಕ್ವಿಂಟಾಲ್ / ಎಕರೆ',
    seedRatePerAcre: '7 - 8 kg (Hybrid)',
    seedRatePerAcreKn: '೭ - ೮ ಕೆಜಿ (ಹೈಬ್ರಿಡ್)',
    spacing: '60 cm x 20 cm',
    npkRatio: { N: 150, P: 75, K: 40 },
    mspPerQuintal: 2225,
    avgMandiPricePerQ: 2450,
    costBreakdown: {
      seeds: 2400,
      landPrep: 3800,
      fertilizers: 4800,
      pesticides: 2800,
      laborHarvest: 6500,
      expectedYieldQ: 34,
    },
    varieties: [
      { name: 'CP-818', duration: '115 Days', yield: '32-36 Q/Acre', specialty: 'Orange-yellow flint grains, excellent drought tolerance, high cob weight' },
      { name: 'Pioneer P3502', duration: '120 Days', yield: '35-40 Q/Acre', specialty: 'High stay-green trait, heavy grain weight, preferred for starch mills' },
      { name: 'NK-6240 (Syngenta)', duration: '110 Days', yield: '32-35 Q/Acre', specialty: 'Resistant to turcicum leaf blight, thick cob with 16 rows' }
    ],
    stages: [
      {
        stageNumber: 1,
        stage: 'Stage 1: Sowing & Seedling Establishment',
        stageKn: 'ಹಂತ ೧: ಬಿತ್ತನೆ ಮತ್ತು ಮೊಳಕೆ ಹಂತ',
        days: 'Day 0 - 20',
        startDay: 0,
        endDay: 20,
        water: 'Sow in optimum soil moisture; irrigate on Day 4 if rain fails',
        waterKn: 'ಹದವಾದ ತೇವಾಂಶದಲ್ಲಿ ಬಿತ್ತನೆ; ಮಳೆಯಿಲ್ಲದಿದ್ದರೆ ೪ನೇ ದಿನಕ್ಕೆ ನೀರು',
        waterLitersPerDay: 8000,
        nutrition: 'Basal dose: 25% Nitrogen + 100% Phosphorus + 100% Potash + 10kg Zinc Sulfate',
        nutritionKn: 'ಮೂಲಗೊಬ್ಬರ: ಕಾಲು ಭಾಗ ಯೂರಿಯಾ + ಪೂರ್ಣ ಡಿಎಪಿ ಮತ್ತು ಪೊಟ್ಯಾಷ್ + ಸತು',
        protection: 'Treat seeds with Fortenza Duo or Cyantraniliprole for Fall Armyworm protection',
        protectionKn: 'ಲದ್ದಿ ಹುಳು ತಡೆಗಟ್ಟಲು ಕಡ್ಡಾಯ ಜೈವಿಕ ಬೀಜೋಪಚಾರ',
        expertTip: 'Zinc deficiency causes "White Bud" symptom. Applying 10kg Zinc Sulfate basal prevents this completely.',
        expertTipKn: 'ಸತುವಿನ ಕೊರತೆಯಿಂದ ಸುಳಿ ಬಿಳಿಯಾಗುತ್ತದೆ. ಮೂಲಗೊಬ್ಬರದಲ್ಲಿ ೧೦ ಕೆಜಿ ಜಿಂಕ್ ಸಲ್ಫೇಟ್ ನೀಡಿ.',
        checklist: [
          'Plough land twice and form ridges and furrows 60 cm apart',
          'Dibble single seed at 4 cm depth with 20 cm spacing',
          'Apply Atrazine 50 WP (1 kg/acre) within 48 hours to control weeds',
          'Scout daily for Fall Armyworm pinhole leaf damage'
        ],
        checklistKn: [
          '೬೦ ಸೆಂ.ಮೀ ಅಂತರದಲ್ಲಿ ಬೋದು ನಿರ್ಮಿಸಿ',
          '೨೦ ಸೆಂ.ಮೀ ಅಂತರದಲ್ಲಿ ೪ ಸೆಂ.ಮೀ ಆಳಕ್ಕೆ ಒಂದು ಬೀಜ ಊರಿ',
          '೪೮ ಗಂಟೆಗಳಲ್ಲಿ ಅಟ್ರಾಜಿನ್ ಕಳೆನಾಶಕ ಸಿಂಪಡಿಸಿ',
          'ಲದ್ದಿ ಹುಳು ಬಾಧೆಗೆ ಗಿಡಗಳ ಸುಳಿ ಪರೀಕ್ಷಿಸಿ'
        ]
      },
      {
        stageNumber: 2,
        stage: 'Stage 2: Knee-High Stage & Fall Armyworm Defense',
        stageKn: 'ಹಂತ ೨: ಮೊಣಕಾಲು ಮಟ್ಟದ ಹಂತ & ಲದ್ದಿ ಹುಳು ರಕ್ಷಣೆ',
        days: 'Day 21 - 45',
        startDay: 21,
        endDay: 45,
        water: 'Irrigate every 8-10 days depending on weather',
        waterKn: '೮-೧೦ ದಿನಗಳಿಗೊಮ್ಮೆ ನಿಯಮಿತ ನೀರಾವರಿ',
        waterLitersPerDay: 14000,
        nutrition: 'Top dressing: 50% Nitrogen (Urea 50 kg/acre) placed 5 cm away from stems',
        nutritionKn: 'ಗಿಡದ ಬುಡದಿಂದ ೫ ಸೆಂ.ಮೀ ದೂರದಲ್ಲಿ ಯೂರಿಯಾ ಮೇಲುಗೊಬ್ಬರ ನೀಡಿ',
        protection: 'Whorl application of Sand + Lime (9:1) or Emamectin Benzoate for Fall Armyworm',
        protectionKn: 'ಸುಳಿಯೊಳಗೆ ಮರಳು ಮಿಶ್ರಣ ಅಥವಾ ಎಮಾಮೆಕ್ಟಿನ್ ಬೆಂಜೋಯೇಟ್ ದ್ರಾವಣ ಹಾಕಿ',
        expertTip: 'Drop a pinch of dry sieved river sand mixed with lime into whorls; this lacerates armyworm gut mechanically.',
        expertTipKn: 'ಸುಳಿಗೆ ಒಣ ಮರಳು ಮತ್ತು ಸುಣ್ಣದ ಪುಡಿ ಹಾಕಿದರೆ ಹುಳುವಿನ ಹೊಟ್ಟೆ ಸೀಳಿ ನೈಸರ್ಗಿಕವಾಗಿ ಸಾಯುತ್ತದೆ.',
        checklist: [
          'Pass inter-cultivator and earth up soil around stem bases',
          'Apply first heavy split of Urea before earthing up',
          'Inspect corn whorls for sawtooth caterpillar frass',
          'Spray Metarhizium anisopliae bio-insecticide in whorl'
        ],
        checklistKn: [
          'ಎಡೆಕುಂಟೆ ಹೊಡೆದು ಗಿಡದ ಬುಡಕ್ಕೆ ಮಣ್ಣು ಏರಿಸಿ',
          'ಬುಡಕ್ಕೆ ಮಣ್ಣು ಏರಿಸುವ ಮುನ್ನ ಯೂರಿಯಾ ಗೊಬ್ಬರ ನೀಡಿ',
          'ಸುಳಿಯಲ್ಲಿ ಮಲದ ಕಣಗಳಿವೆಯೇ ಎಂದು ಪರೀಕ್ಷಿಸಿ',
          'ಜೈವಿಕ ಕೀಟನಾಶಕವನ್ನು ಸುಳಿಗೆ ಸಿಂಪಡಿಸಿ'
        ]
      },
      {
        stageNumber: 3,
        stage: 'Stage 3: Tasseling & Silking (Extremely Critical)',
        stageKn: 'ಹಂತ ೩: ತೆನೆ ಮೂಡುವಿಕೆ ಮತ್ತು ಜೊಂಡು ಬಿಡುವ ಹಂತ',
        days: 'Day 46 - 75',
        startDay: 46,
        endDay: 75,
        water: 'Water stress at silking drops grain setting by up to 50%! Keep field well irrigated.',
        waterKn: 'ಈ ಹಂತದಲ್ಲಿ ನೀರಿನ ಕೊರತೆಯಾದರೆ ತೆನೆಯಲ್ಲಿ ಅರ್ಧ ಕಾಳು ಕಟ್ಟುವುದಿಲ್ಲ! ನೀರು ಕಡ್ಡಾಯ.',
        waterLitersPerDay: 22000,
        nutrition: 'Final top dressing: Remaining 25% Nitrogen (Urea 25 kg/acre) + 1% Boron foliar spray',
        nutritionKn: 'ಕೊನೆಯ ಕಂತಿನ ಯೂರಿಯಾ ಹಾಗೂ ತೆನೆಯಲ್ಲಿ ಕಾಳು ತುಂಬಲು ಬೋರಾನ್ ಸಿಂಪಡಣೆ',
        protection: 'Monitor for cob borer entering from silk tip',
        protectionKn: 'ಜೊಂಡಿನ ತುದಿಯಿಂದ ಒಳಹೋಗುವ ಹುಳುಗಳನ್ನು ಗಮನಿಸಿ',
        expertTip: 'Adequate moisture during the 15-day silking window guarantees tight, fully-filled cobs right up to the tip.',
        expertTipKn: 'ಜೊಂಡು ಬಿಡುವ ೧೫ ದಿನಗಳಲ್ಲಿ ಉತ್ತಮ ತೇವಾಂಶವಿದ್ದರೆ ತೆನೆಯ ತುದಿಯವರೆಗೂ ಕಾಳು ಗಟ್ಟಿಯಾಗಿ ತುಂಬುತ್ತದೆ.',
        checklist: [
          'Ensure continuous irrigation without moisture stress',
          'Apply final split of Urea before tassel pollen shed',
          'Spray 13-0-45 (Potassium Nitrate 10g/L) for cob size',
          'Inspect silk tassels for borer caterpillars'
        ],
        checklistKn: [
          'ಯಾವುದೇ ಕಾರಣಕ್ಕೂ ನೀರಿಗೆ ತೊಂದರೆಯಾಗದಂತೆ ನೋಡಿಕೊಳ್ಳಿ',
          'ಹೂಧೂಳಿ ಉದುರುವ ಮುನ್ನ ಕಡೆಯ ಕಂತಿನ ಯೂರಿಯಾ ನೀಡಿ',
          'ತೆನೆ ದಪ್ಪಗಾಗಲು ೧೩-೦-೪೫ ಸಿಂಪಡಿಸಿ',
          'ತೆನೆಯ ಜೊಂಡಿನಲ್ಲಿ ಹುಳು ಇದೆಯೇ ನೋಡಿ'
        ]
      },
      {
        stageNumber: 4,
        stage: 'Stage 4: Grain Hardening & Cob Harvesting',
        stageKn: 'ಹಂತ ೪: ಕಾಳು ಗಟ್ಟಿಯಾಗುವಿಕೆ ಮತ್ತು ತೆನೆ ಕಟಾವು',
        days: 'Day 76 - 115',
        startDay: 76,
        endDay: 115,
        water: 'Stop irrigation when black layer forms at grain attachment point (Day 100)',
        waterKn: 'ಕಾಳಿನ ಬುಡದಲ್ಲಿ ಕಪ್ಪು ಗೆರೆ ಮೂಡಿದಾಗ ನೀರು ನಿಲ್ಲಿಸಿ',
        waterLitersPerDay: 6000,
        nutrition: 'No chemical inputs',
        nutritionKn: 'ಯಾವುದೇ ಗೊಬ್ಬರ ನೀಡಬೇಡಿ',
        protection: 'Protect mature cobs from wild boars and parrots',
        protectionKn: 'ಕಾಡುಹಂದಿ ಮತ್ತು ಗಿಳಿಗಳಿಂದ ತೆನೆ ರಕ್ಷಿಸಿ',
        expertTip: 'Check the "Black Layer" at base of kernel. When black dot appears, physiological maturity is reached.',
        expertTipKn: 'ಕಾಳಿನ ಬುಡದಲ್ಲಿ ಕಪ್ಪು ಚುಕ್ಕೆ ಕಂಡಾಗ ಬೆಳೆ ಸಂಪೂರ್ಣ ಮಾಗಿರುತ್ತದೆ. ತಕ್ಷಣ ಕಟಾವು ಮಾಡಬಹುದು.',
        checklist: [
          'Check husk cover turning straw yellow and dry',
          'Harvest cobs with tractor cob picker or manual picking',
          'Sun dry unshelled cobs for 3 days before mechanical shelling',
          'Store shelled grain below 13% moisture'
        ],
        checklistKn: [
          'ತೆನೆಯ ಮೇಲಿನ ಸಿಪ್ಪೆ ಒಣಗಿ ಬಿಳಿಯಾದಾಗ ಕಟಾವು ಮಾಡಿ',
          'ತೆನೆಗಳನ್ನು ಬಿಡಿಸಿ ೩ ದಿನ ಬಿಸಿಲಿನಲ್ಲಿ ಒಣಗಿಸಿ',
          'ಒಕ್ಕಣೆ ಯಂತ್ರದ ಮೂಲಕ ಕಾಳು ಬೇರ್ಪಡಿಸಿ',
          'ಶೇ. ೧೩ಕ್ಕಿಂತ ಕಡಿಮೆ ತೇವಾಂಶದಲ್ಲಿ ಧಾನ್ಯ ಶೇಖರಿಸಿ'
        ]
      }
    ],
    pestsAndDiseases: [
      {
        id: 'fall-armyworm',
        name: 'Fall Armyworm',
        nameKn: 'ಲದ್ದಿ ಹುಳು (ಫಾಲ್ ಆರ್ಮಿವರ್ಮ್)',
        type: 'pest',
        severity: 'high',
        symptoms: 'Ragged window pane holes on leaves, whorls filled with brown powdery sawdust-like fecal pellets.',
        symptomsKn: 'ಎಲೆಗಳಲ್ಲಿ ರಂಧ್ರಗಳು ಮತ್ತು ಗಿಡದ ಸುಳಿಯಲ್ಲಿ ಮರದ ಪುಡಿಯಂತಹ ಮಲದ ರಾಶಿ.',
        organicControl: 'Apply dry sand + lime (9:1) directly into whorls. Spray Nomuraea rileyi fungal formulation @ 5g/L.',
        organicControlKn: 'ಸುಳಿಗೆ ಮರಳು ಮತ್ತು ಸುಣ್ಣದ ಪುಡಿ ಹಾಕಿ. ನೊಮುರಿಯಾ ಜೈವಿಕ ಶಿಲೀಂಧ್ರ ಸಿಂಪಡಿಸಿ.',
        chemicalControl: 'Spray Chlorantraniliprole 18.5 SC @ 0.4ml/L or Spinetoram 11.7 SC @ 0.5ml/L directed into the whorls.',
        chemicalControlKn: 'ಕ್ಲೋರಾಂಟ್ರಾನಿಲಿಪ್ರೋಲ್ ೦.೪ ಮಿ.ಲೀ/ಲೀ ಅಥವಾ ಸ್ಪಿನೆಟೋರಮ್ ಅನ್ನು ಕಡ್ಡಾಯವಾಗಿ ಸುಳಿಯೊಳಗೆ ಬೀಳುವಂತೆ ಸಿಂಪಡಿಸಿ.'
      },
      {
        id: 'turcicum-blight',
        name: 'Turcicum Leaf Blight',
        nameKn: 'ಟರ್ಸಿಕಂ ಎಲೆ ಕರಕಲು ರೋಗ',
        type: 'disease',
        severity: 'moderate',
        symptoms: 'Long boat-shaped greyish-green lesions on leaves that coalesce to scorch entire leaf.',
        symptomsKn: 'ಎಲೆಗಳ ಮೇಲೆ ದೋಣಿಯಾಕಾರದ ಬೂದುಬಣ್ಣದ ಉದ್ದನೆಯ ಕಲೆಗಳು, ಎಲೆ ಪೂರ್ತಿ ಒಣಗುವುದು.',
        organicControl: 'Spray 5% Neem extract + cow urine early morning.',
        organicControlKn: 'ಬೇವಿನ ಕಷಾಯ ಮತ್ತು ಗಂಜಳ ಸಿಂಪಡಿಸಿ.',
        chemicalControl: 'Spray Mancozeb 75 WP @ 2.5g/L or Propiconazole 25 EC @ 1ml/L at first symptom.',
        chemicalControlKn: 'ಮ್ಯಾಂಕೋಜೆಬ್ ೨.೫ ಗ್ರಾಂ ಅಥವಾ ಪ್ರೊಪಿಕೊನಜೋಲ್ ೧ ಮಿ.ಲೀ/ಲೀ ಸಿಂಪಡಿಸಿ.'
      }
    ],
    organicRemedies: [
      { remedy: 'Sand + Wood Ash Whorl Treatment', recipe: 'Mix 9 parts fine dry river sand + 1 part fresh wood ash. Pour 1 teaspoon into each central plant whorl.', target: 'Mechanically shreds Fall Armyworm larvae within 24 hours without toxic chemicals' },
      { remedy: 'Jeevamrutha Canal Run', recipe: 'Let 200L Jeevamrutha flow along with flood/furrow irrigation on Day 30 and Day 60.', target: 'Speeds vegetative root biomass and mycorrhizal phosphorus uptake' },
      { remedy: 'Neem Cake Furrow Application', recipe: 'Band place 100 kg crushed neem cake with basal fertilizers in furrows.', target: 'Repels subterranean root grubs, wireworms, and early cutworms' }
    ]
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    nameKn: 'ಕಬ್ಬು',
    category: 'Commercial',
    categoryKn: 'ವಾಣಿಜ್ಯ ಬೆಳೆ',
    season: 'Eksali (Jan-Feb), Adsali (July-Aug), Pre-seasonal (Oct-Nov)',
    seasonKn: 'ಏಕಸಾಲಿ & ಅಡ್ಸಾಲಿ ಹಂಗಾಮು',
    duration: '10 - 12 Months',
    durationKn: '೧೦ - ೧೨ ತಿಂಗಳು',
    totalDays: 360,
    soil: 'Deep well-drained loam or clay loam with high fertility',
    soilKn: 'ಉತ್ತಮ ಫಲವತ್ತತೆಯುಳ್ಳ ಆಳವಾದ ಗೋಡು ಅಥವಾ ಜೇಡಿ ಮಣ್ಣು',
    idealPh: '6.5 - 7.8',
    tempRange: '20°C - 38°C',
    waterNeed: 'High',
    avgYield: '55 - 70 Tons / Acre',
    avgYieldKn: '೫೫ - ೭೦ ಟನ್ / ಎಕರೆ',
    seedRatePerAcre: '25,000 - 30,000 two-budded setts / Acre (or 5,000 single bud seedlings)',
    seedRatePerAcreKn: '೨೫,೦೦೦ - ೩೦,೦೦೦ ಎರಡು ಕಣ್ಣಿನ ತುಂಡುಗಳು',
    spacing: '120 cm - 150 cm wide row spacing for drip irrigation',
    npkRatio: { N: 150, P: 60, K: 60 },
    mspPerQuintal: 340, // FRP per Quintal
    avgMandiPricePerQ: 355,
    costBreakdown: {
      seeds: 8000,
      landPrep: 6000,
      fertilizers: 11000,
      pesticides: 3500,
      laborHarvest: 18000,
      expectedYieldQ: 600, // in quintals (60 tons)
    },
    varieties: [
      { name: 'Co-86032 (Nayana)', duration: '12 Months', yield: '60-70 Tons/Acre', specialty: 'High sugar recovery (11.5%), drought tolerant, excellent ratoonability' },
      { name: 'Co-0238 (Karan-4)', duration: '11 Months', yield: '65-75 Tons/Acre', specialty: 'Very high cane weight, heavy tillering, high sucrose content' },
      { name: 'Co-62175', duration: '12 Months', yield: '50-60 Tons/Acre', specialty: 'Non-lodging, thick cane, high juice yield for jaggery production' }
    ],
    stages: [
      {
        stageNumber: 1,
        stage: 'Stage 1: Sett Treatment & Germination',
        stageKn: 'ಹಂತ ೧: ಕಬ್ಬಿನ ತುಂಡುಗಳ ಉಪಚಾರ ಮತ್ತು ಮೊಳಕೆ',
        days: 'Day 0 - 35',
        startDay: 0,
        endDay: 35,
        water: 'Immediate planting irrigation followed by light water at Day 5',
        waterKn: 'ನಾಟಿ ಮಾಡಿದ ತಕ್ಷಣ ಮತ್ತು ೫ನೇ ದಿನಕ್ಕೆ ನೀರು',
        waterLitersPerDay: 15000,
        nutrition: '10 tons FYM/acre + 25% Nitrogen + 100% Phosphorus',
        nutritionKn: 'ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರ + ೨೫% ಸಾರಜನಕ + ಪೂರ್ಣ ರಂಜಕ',
        protection: 'Treat setts with Carbendazim (1g/L) + Chlorpyrifos for termites',
        protectionKn: 'ಗೆದ್ದಲು ಮತ್ತು ಕೊಳೆ ರೋಗ ನಿಯಂತ್ರಣಕ್ಕೆ ತುಂಡುಗಳನ್ನು ಅದ್ದಿ ನೆಡಿ',
        expertTip: 'Single-bud chip technology saves 80% seed material and gives uniform 98% germination.',
        expertTipKn: 'ಒಂದು ಕಣ್ಣಿನ ಸಸಿ ಪದ್ಧತಿಯಿಂದ ಶೇ. ೮೦ ರಷ್ಟು ಬೀಜ ಕಬ್ಬು ಉಳಿತಾಯವಾಗುತ್ತದೆ.',
        checklist: [
          'Select healthy disease-free seed cane (8-10 months old)',
          'Treat setts in fungicide + insecticide tank for 15 mins',
          'Lay drip laterals along 4-5 feet wide paired furrows',
          'Cover setts with only 2-3 cm fine loose soil'
        ],
        checklistKn: [
          '೮-೧೦ ತಿಂಗಳ ರೋಗರಹಿತ ಆರೋಗ್ಯವಂತ ಬೀಜ ಕಬ್ಬು ಆಯ್ಕೆ',
          'ಶಿಲೀಂಧ್ರನಾಶಕ ದ್ರಾವಣದಲ್ಲಿ ಕಬ್ಬಿನ ತುಂಡುಗಳ ಉಪಚಾರ',
          '೪-೫ ಅಡಿ ಸಾಲಿನ ಅಂತರದಲ್ಲಿ ಹನಿ ನೀರಾವರಿ ಪೈಪ್ ಅಳವಡಿಕೆ',
          'ತುಂಡುಗಳ ಮೇಲೆ ಕೇವಲ ೨-೩ ಸೆಂ.ಮೀ ಮಣ್ಣು ಮುಚ್ಚಿ'
        ]
      },
      {
        stageNumber: 2,
        stage: 'Stage 2: Tillering & Earthing Up',
        stageKn: 'ಹಂತ ೨: ಕವಲೊಡೆಯುವಿಕೆ ಮತ್ತು ಮಣ್ಣು ಏರಿಸುವುದು',
        days: 'Day 36 - 120',
        startDay: 36,
        endDay: 120,
        water: 'Irrigate every 8-10 days depending on weather',
        waterKn: '೮-೧೦ ದಿನಗಳಿಗೊಮ್ಮೆ ನೀರು',
        waterLitersPerDay: 22000,
        nutrition: 'Split doses of Urea + 50% Potash + Ferrous Sulfate 10kg/acre',
        nutritionKn: 'ಯೂರಿಯಾ ಮತ್ತು ಅರ್ಧ ಪೊಟ್ಯಾಷ್ ಗೊಬ್ಬರ',
        protection: 'Early shoot borer watch. Apply Trichocards (Trichogramma chilonis) @ 2 cards/acre',
        protectionKn: 'ಮುಂಗಡೆ ಕೊರೆಯುವ ಹುಳುವಿಗೆ ಟ್ರೈಕೋಕಾರ್ಡ್ ಜೈವಿಕ ಪರಾವಲಂಬಿ ಬಳಸಿ',
        expertTip: 'Earthing up at 90-100 days prevents cane lodging and suffocates emerging weed roots.',
        expertTipKn: '೯೦-೧೦೦ ದಿನಕ್ಕೆ ಬುಡಕ್ಕೆ ಮಣ್ಣು ಏರಿಸಿದರೆ ಕಬ್ಬು ನೆಲಕ್ಕುರುಳುವುದು ತಪ್ಪುತ್ತದೆ.',
        checklist: [
          'Eradicate weeds before tillers form dense canopy',
          'Staple Trichocards on leaf undersides for shoot borer',
          'Apply 2nd & 3rd split doses of Nitrogen via fertigation',
          'Perform deep earthing up (ಮಣ್ಣು ಏರಿಸುವುದು) at Day 90'
        ],
        checklistKn: [
          'ಕವಲೊಡೆಯುವ ಮುನ್ನ ಕಳೆಗಳನ್ನು ಸಂಪೂರ್ಣ ನಿಯಂತ್ರಿಸಿ',
          'ಮುಂಗಡೆ ಕೊರೆಯುವ ಹುಳುವಿಗೆ ಎಲೆ ಕೆಳಗೆ ಟ್ರೈಕೋಕಾರ್ಡ್ ಕಟ್ಟಿ',
          'ಡ್ರಿಪ್ ಮೂಲಕ ಹಂತ ಹಂತವಾಗಿ ಸಾರಜನಕ ಗೊಬ್ಬರ ನೀಡಿ',
          '೯೦ನೇ ದಿನಕ್ಕೆ ಬುಡಕ್ಕೆ ಭದ್ರವಾಗಿ ಮಣ್ಣು ಏರಿಸಿ'
        ]
      },
      {
        stageNumber: 3,
        stage: 'Stage 3: Grand Growth & Cane Elongation',
        stageKn: 'ಹಂತ ೩: ತ್ವರಿತ ಬೆಳವಣಿಗೆ ಮತ್ತು ಕಾಂಡ ದಪ್ಪಗಾಗುವಿಕೆ',
        days: 'Day 121 - 270',
        startDay: 121,
        endDay: 270,
        water: 'Peak water requirement stage. Ensure unhindered drip irrigation',
        waterKn: 'ಅತಿ ಹೆಚ್ಚು ನೀರಿನ ಅಗತ್ಯವಿರುವ ಹಂತ',
        waterLitersPerDay: 32000,
        nutrition: 'Remaining 25% Nitrogen + 50% Potash + Foliar Potassium Nitrate (10g/L)',
        nutritionKn: 'ಉಳಿದ ಸಾರಜನಕ ಮತ್ತು ಪೊಟ್ಯಾಷ್ ಪೂರ್ಣಗೊಳಿಸಿ',
        protection: 'De-trashing: Strip lower dry leaves at 150 and 210 days to improve air circulation',
        protectionKn: 'ಕಬ್ಬಿನ ಒಣ ಎಲೆಗಳನ್ನು ಸುಲಿದು ಸ್ವಚ್ಛಗೊಳಿಸಿ; ಗಾಳಿಯಾಡಲು ಅನುಕೂಲವಾಗುತ್ತದೆ',
        expertTip: 'Trash mulching between rows saves 30% irrigation water and suppresses 85% weeds.',
        expertTipKn: 'ಕಬ್ಬಿನ ಸಾಲುಗಳ ನಡುವೆ ಒಣ ಎಲೆಗಳನ್ನು ಹರಡಿದರೆ ತೇವಾಂಶ ಉಳಿದು ಕಳೆ ನಾಶವಾಗುತ್ತದೆ.',
        checklist: [
          'Strip dry bottom leaves (de-trashing) at 5th and 7th month',
          'Spread stripped trash as moisture-saving mulch in furrows',
          'Tie adjacent cane clumps together (propping) to avoid lodging',
          'Spray 0-0-50 Potassium Sulfate for stem thickness'
        ],
        checklistKn: [
          '೫ ಮತ್ತು ೭ನೇ ತಿಂಗಳಲ್ಲಿ ಒಣ ಎಲೆಗಳನ್ನು ಸುಲಿಯಿರಿ',
          'ಸುಲಿದ ಒಣ ಎಲೆಗಳನ್ನು ಸಾಲುಗಳ ನಡುವೆ ಹೊದಿಕೆಯಾಗಿ ಹರಡಿ',
          'ಕಬ್ಬು ನೆಲಕ್ಕುರುಳದಂತೆ ಕಬ್ಬಿನ ಗಿಡಗಳನ್ನು ಜೋಡಿಸಿ ಕಟ್ಟಿ',
          'ಕಾಂಡ ದಪ್ಪಗಾಗಲು ಪೊಟ್ಯಾಷಿಯಂ ಸಲ್ಫೇಟ್ ಸಿಂಪಡಿಸಿ'
        ]
      },
      {
        stageNumber: 4,
        stage: 'Stage 4: Sucrose Accumulation & Harvest',
        stageKn: 'ಹಂತ ೪: ಸಕ್ಕರೆ ಅಂಶ ಹೆಚ್ಚಳ ಮತ್ತು ಕಟಾವು',
        days: 'Day 271 - 365',
        startDay: 271,
        endDay: 365,
        water: 'Withhold irrigation 15 days before harvest to concentrate sucrose',
        waterKn: 'ಕಟಾವಿಗೆ ೧೫ ದಿನ ಮುಂಚೆ ನೀರು ನಿಲ್ಲಿಸಿದರೆ ಸಕ್ಕರೆ ಅಂಶ ಹೆಚ್ಚುತ್ತದೆ',
        waterLitersPerDay: 10000,
        nutrition: 'Stop all nitrogen fertilizers 3 months prior to harvest',
        nutritionKn: 'ಕೊಯ್ಲಿಗೆ ೩ ತಿಂಗಳು ಮುಂಚೆ ಸಾರಜನಕ ನಿಲ್ಲಿಸಿ',
        protection: 'Watch for wild boars and rodents',
        protectionKn: 'ಕಾಡುಹಂದಿ ಮತ್ತು ಇಲಿಗಳಿಂದ ರಕ್ಷಿಸಿ',
        expertTip: 'Harvest flush to ground level with sharp cane knife; maximum sugar is in bottom 3 internodes.',
        expertTipKn: 'ಕಬ್ಬನ್ನು ನೆಲಮಟ್ಟಕ್ಕೆ ತಾಗಿಸಿ ಕಡಿಯಿರಿ; ಬುಡದ ಗಿಣ್ಣುಗಳಲ್ಲಿ ಅತಿ ಹೆಚ್ಚು ಸಕ್ಕರೆ ಇರುತ್ತದೆ.',
        checklist: [
          'Stop applying irrigation 15 days before sugar factory cutting',
          'Check Brix reading with hand refractometer (19-21% is ideal)',
          'Cut canes level with ground surface (avoid leaving stubbles)',
          'Transport cut canes to sugar mill within 24 hours to prevent weight and sugar loss'
        ],
        checklistKn: [
          'ಸಕ್ಕರೆ ಕಾರ್ಖಾನೆಯ ಕಟಾವಿಗೆ ೧೫ ದಿನ ಮುನ್ನ ನೀರು ನಿಲ್ಲಿಸಿ',
          'ಕಬ್ಬಿನಲ್ಲಿ ಸಕ್ಕರೆ ಅಂಶ ಪರೀಕ್ಷಿಸಿ',
          'ನೆಲಮಟ್ಟಕ್ಕೆ ಸಮನಾಗಿ ಕಬ್ಬು ಕಡಿಯಿರಿ',
          'ತೂಕ ಕಡಿಮೆಯಾಗದಂತೆ ೨೪ ಗಂಟೆಗಳಲ್ಲಿ ಕಾರ್ಖಾನೆಗೆ ಸಾಗಿಸಿ'
        ]
      }
    ],
    pestsAndDiseases: [
      {
        id: 'early-shoot-borer',
        name: 'Early Shoot Borer',
        nameKn: 'ಮುಂಗಡೆ ಕೊರೆಯುವ ಹುಳು',
        type: 'pest',
        severity: 'high',
        symptoms: 'Dead heart in shoots 1-3 months old that emits foul offensive odor when pulled out.',
        symptomsKn: 'ಎಳೆ ಕಬ್ಬಿನ ಸುಳಿ ಒಣಗುವುದು; ಅದನ್ನು ಎಳೆದಾಗ ದುರ್ವಾಸನೆ ಬರುತ್ತದೆ.',
        organicControl: 'Staple Trichogramma chilonis egg cards @ 2 cards/acre. Mulch trash to block moth oviposition.',
        organicControlKn: 'ಟ್ರೈಕೋಕಾರ್ಡ್ ಅಳವಡಿಸಿ. ಒಣ ಕಬ್ಬಿನ ಎಲೆ ಹೊದಿಕೆ ಹಾಕಿ.',
        chemicalControl: 'Apply Chlorantraniliprole 18.5 SC @ 0.4ml/L along the cane sett furrows or Fipronil 0.3% G @ 10 kg/acre.',
        chemicalControlKn: 'ಕ್ಲೋರಾಂಟ್ರಾನಿಲಿಪ್ರೋಲ್ ಅನ್ನು ಸಾಲುಗಳಲ್ಲಿ ಸಿಂಪಡಿಸಿ ಅಥವಾ ಫಿಪ್ರೋನಿಲ್ ಹರಳು ಗೊಬ್ಬರ ನೀಡಿ.'
      },
      {
        id: 'red-rot',
        name: 'Red Rot Disease',
        nameKn: 'ಕೆಂಪು ಕೊಳೆ ರೋಗ',
        type: 'disease',
        severity: 'high',
        symptoms: 'Third or fourth leaf from top yellows and withers; internal cane pith turns blood red with white cross patches.',
        symptomsKn: 'ಮೇಲಿನ ಎಲೆಗಳು ಹಳದಿಯಾಗಿ ಒಣಗುತ್ತವೆ; ಕಬ್ಬಿನ ಒಳಭಾಗ ರಕ್ತದಂತೆ ಕೆಂಪಾಗಿ ಮದ್ಯದ ವಾಸನೆ ಬರುತ್ತದೆ.',
        organicControl: 'Crop rotation with paddy/green manure. Dip setts in Trichoderma viride @ 10g/L before planting.',
        organicControlKn: 'ಭತ್ತದೊಂದಿಗೆ ಬೆಳೆ ಪರಿವರ್ತನೆ. ಟ್ರೈಕೋಡರ್ಮಾ ದ್ರಾವಣದಲ್ಲಿ ಬೀಜ ಕಬ್ಬು ಅದ್ದಿ ನೆಡಿ.',
        chemicalControl: 'Remove and burn affected clumps immediately. Soak setts in Carbendazim 50 WP (1g/L) for 30 minutes.',
        chemicalControlKn: 'ರೋಗಪೀಡಿತ ಬುಡಗಳನ್ನು ಕಿತ್ತು ಸುಟ್ಟುಹಾಕಿ. ಕಾರ್ಬೆಂಡಾಜಿಮ್ ದ್ರಾವಣದಲ್ಲಿ ಕಬ್ಬಿನ ತುಂಡುಗಳ ಉಪಚಾರ.'
      }
    ],
    organicRemedies: [
      { remedy: 'Trichogramma Biological Control', recipe: 'Staple Trichogramma egg cards on underside of cane leaves @ 2 cards/acre every 10 days.', target: 'Controls Internode Borer and Top Shoot Borer biologically' },
      { remedy: 'Trash Mulching with Bio-Decomposer', recipe: 'Spread dry cane trash in furrows and spray Waste Decomposer solution (200L/acre).', target: 'Converts trash into 3 tons organic carbon and retains soil moisture' },
      { remedy: 'Vermiwash & Cow Urine Spray', recipe: '10L vermiwash + 5L cow urine in 100L water. Foliar spray at Day 60 and 120.', target: 'Increases leaf chlorophyll and cane girth' }
    ]
  },
  {
    id: 'cotton',
    name: 'Cotton',
    nameKn: 'ಹತ್ತಿ',
    category: 'Commercial',
    categoryKn: 'ವಾಣಿಜ್ಯ ಬೆಳೆ',
    season: 'Kharif (June - July Sowing)',
    seasonKn: 'ಮುಂಗಾರು ಹಂಗಾಮು',
    duration: '150 - 170 Days',
    durationKn: '೧೫೦ - ೧೭೦ ದಿನಗಳು',
    totalDays: 160,
    soil: 'Deep black cotton soil (Regur) or deep alluvial loam with good moisture retention',
    soilKn: 'ಕಪ್ಪು ಹತ್ತಿ ಮಣ್ಣು ಅಥವಾ ಆಳವಾದ ಗೋಡು ಮಣ್ಣು',
    idealPh: '6.5 - 8.0',
    tempRange: '21°C - 35°C',
    waterNeed: 'Medium',
    avgYield: '10 - 14 Quintals / Acre (Seed Cotton)',
    avgYieldKn: '೧೦ - ೧೪ ಕ್ವಿಂಟಾಲ್ / ಎಕರೆ',
    seedRatePerAcre: '1.5 - 2.0 kg (Hybrid Bt Cotton)',
    seedRatePerAcreKn: '೧.೫ - ೨.೦ ಕೆಜಿ (ಬಿಟಿ ಹತ್ತಿ)',
    spacing: '90 cm x 60 cm or 120 cm x 45 cm',
    npkRatio: { N: 60, P: 30, K: 30 },
    mspPerQuintal: 7521,
    avgMandiPricePerQ: 7800,
    costBreakdown: {
      seeds: 2200,
      landPrep: 3500,
      fertilizers: 4000,
      pesticides: 4500,
      laborHarvest: 7000,
      expectedYieldQ: 12,
    },
    varieties: [
      { name: 'DHH-11 (UAS Dharwad)', duration: '160 Days', yield: '12-14 Q/Acre', specialty: 'Superior staple length (28mm), tolerant to jassids and leafhoppers' },
      { name: 'RCH-2 Bt', duration: '155 Days', yield: '11-13 Q/Acre', specialty: 'High boll retention, medium staple, wide adaptation in North Karnataka' },
      { name: 'Bunny Bt', duration: '165 Days', yield: '12-15 Q/Acre', specialty: 'Big boll size (4.5g), good ginning outturn (36%)' }
    ],
    stages: [
      {
        stageNumber: 1,
        stage: 'Stage 1: Sowing & Seedling Establishment',
        stageKn: 'ಹಂತ ೧: ಬಿತ್ತನೆ ಮತ್ತು ಸಸಿ ಸ್ಥಾಪನೆ',
        days: 'Day 0 - 30',
        startDay: 0,
        endDay: 30,
        water: 'Sow after receiving soaking monsoon rain (at least 50mm)',
        waterKn: 'ಉತ್ತಮ ಮಳೆಯಾದ ನಂತರ ಬಿತ್ತನೆ ಮಾಡಿ',
        waterLitersPerDay: 7000,
        nutrition: '5 tons compost + Basal: 25% Nitrogen + 100% Phosphorus + 50% Potash',
        nutritionKn: 'ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರ + ಬಿತ್ತನೆ ಗೊಬ್ಬರ',
        protection: 'Seed treatment with Imidacloprid (7g/kg) to protect against sucking pests for 35 days',
        protectionKn: 'ಹೀರುವ ಕೀಟಗಳ ನಿಯಂತ್ರಣಕ್ಕೆ ಕಡ್ಡಾಯ ಬೀಜೋಪಚಾರ',
        expertTip: 'Dibbling 1 seed per hill at 3 cm depth ensures uniform plant population without gap filling.',
        expertTipKn: 'ಪ್ರತಿ ಗುಂಡಿಗೆ ೧ ಬೀಜ ೩ ಸೆಂ.ಮೀ ಆಳದಲ್ಲಿ ಬಿತ್ತಿದರೆ ಸಮತೋಲಿತ ಗಿಡಗಳ ಸಂಖ್ಯೆ ದೊರೆಯುತ್ತದೆ.',
        checklist: [
          'Check certified packet stamp with refuge non-Bt seeds included',
          'Sow non-Bt border rows (5 rows around the boundary)',
          'Thin out to 1 seedling per hill at Day 15',
          'Intercultivate with bullock blade to suppress young weeds'
        ],
        checklistKn: [
          'ಪ್ರಮಾಣೀಕೃತ ಬಿಟಿ ಹತ್ತಿ ಬೀಜದ ಪ್ಯಾಕೆಟ್ ಪರಿಶೀಲಿಸಿ',
          'ಹೊಲದ ಸುತ್ತಲೂ ೫ ಸಾಲು ಆಶ್ರಯ ಬೆಳೆ (ನಾನ್-ಬಿಟಿ) ಬಿತ್ತಿ',
          '೧೫ನೇ ದಿನಕ್ಕೆ ಪ್ರತಿ ಗುಂಡಿಗೆ ಒಂದೇ ಗಿಡ ಇರುವಂತೆ ಕಳೆ ತೆಗೆಯಿರಿ',
          'ಎಡೆಕುಂಟೆ ಹೊಡೆದು ಕಳೆ ನಿಯಂತ್ರಿಸಿ'
        ]
      },
      {
        stageNumber: 2,
        stage: 'Stage 2: Square Initiation & Vegetative Branching',
        stageKn: 'ಹಂತ ೨: ಮೊಗ್ಗು ಕಟ್ಟುವಿಕೆ ಮತ್ತು ಕವಲುಗಳು',
        days: 'Day 31 - 70',
        startDay: 31,
        endDay: 70,
        water: 'Protect from water stagnation; cotton roots are extremely sensitive to waterlogging',
        waterKn: 'ನೀರು ನಿಲ್ಲದಂತೆ ಬಸಿಗಾಲುವೆ ಮಾಡಿ',
        waterLitersPerDay: 12000,
        nutrition: 'Top dressing: 50% Nitrogen split in two equal intervals (Day 45 and 65)',
        nutritionKn: 'ಯೂರಿಯಾ ಮೇಲುಗೊಬ್ಬರವನ್ನು ಎರಡು ಕಂತುಗಳಲ್ಲಿ ನೀಡಿ',
        protection: 'Install yellow sticky traps for whitefly and pheromone traps for Pink Bollworm (PBW)',
        protectionKn: 'ಗುಲಾಬಿ ಕಾಯಿ ಕೊರೆಯುವ ಹುಳುವಿಗೆ ಮೋಹಕ ಬಲೆ ಅಳವಡಿಸಿ',
        expertTip: 'Nipping/detopping the terminal shoot at 75-80 days directs energy into productive sympodial bolls.',
        expertTipKn: '೭೫-೮೦ ದಿನಕ್ಕೆ ಗಿಡದ ತುದಿ ಚಿವುಟಿದರೆ ಅಡ್ಡ ಕವಲುಗಳಲ್ಲಿ ಕಾಯಿಗಳು ಹೆಚ್ಚುತ್ತವೆ.',
        checklist: [
          'Install PBW pheromone traps @ 5 per acre',
          'Nip the terminal tip of plant at 80 days',
          'Apply first split of Urea top dressing',
          'Scout leaf undersides for jassids / leafhopper burning'
        ],
        checklistKn: [
          'ಗುಲಾಬಿ ಕಾಯಿ ಕೊರೆಯುವ ಹುಳುವಿಗೆ ಮೋಹಕ ಬಲೆ ಅಳವಡಿಸಿ',
          '೮೦ನೇ ದಿನಕ್ಕೆ ಗಿಡದ ಮುಖ್ಯ ತುದಿ ಚಿವುಟಿ',
          'ಮೊದಲ ಕಂತಿನ ಯೂರಿಯಾ ಮೇಲುಗೊಬ್ಬರ ನೀಡಿ',
          'ಎಲೆ ಜಿಗಿಹುಳು ಬಾಧೆ ಪರಿಶೀಲಿಸಿ'
        ]
      },
      {
        stageNumber: 3,
        stage: 'Stage 3: Flowering & Boll Development (Critical Stage)',
        stageKn: 'ಹಂತ ೩: ಹೂವು ಮತ್ತು ಕಾಯಿ ಬೆಳೆಯುವ ಹಂತ',
        days: 'Day 71 - 120',
        startDay: 71,
        endDay: 120,
        water: 'Moisture stress during boll formation causes severe shedding of squares and flowers',
        waterKn: 'ಹೂವು ಉದುರದಂತೆ ನಿಯಮಿತ ತೇವಾಂಶ ಕಾಪಾಡಿ',
        waterLitersPerDay: 18000,
        nutrition: 'Foliar spray of 1% Magnesium Sulfate + 1% 19:19:19 to prevent red leaf disease',
        nutritionKn: 'ಕೆಂಪು ಎಲೆ ರೋಗ ತಡೆಯಲು ಮೆಗ್ನೀಷಿಯಂ ಸಲ್ಫೇಟ್ ಸಿಂಪಡಣೆ',
        protection: 'Inspect 20 green bolls per acre weekly for internal Pink Bollworm rosette flowers',
        protectionKn: 'ಹೂವುಗಳಲ್ಲಿ ಗುಲಾಬಿ ಹುಳುವಿನ ಲಕ್ಷಣಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ',
        expertTip: 'Spray Planofix (NAA) @ 4ml per 15L water at peak flowering to arrest boll dropping by 40%.',
        expertTipKn: 'ಹೂವು ಮತ್ತು ಸಣ್ಣ ಕಾಯಿ ಉದುರುವುದನ್ನು ತಡೆಯಲು ಪ್ಲಾನೋಫಿಕ್ಸ್ ಸಿಂಪಡಿಸಿ.',
        checklist: [
          'Spray NAA plant growth regulator (Planofix) to prevent flower shedding',
          'Spray Magnesium Sulfate (10g/L) to prevent red leaf disease',
          'Destruct rosette flowers to disrupt Pink Bollworm lifecycle',
          'Ensure uniform soil moisture during boll bulking'
        ],
        checklistKn: [
          'ಹೂವು ಉದುರದಂತೆ ಪ್ಲಾನೋಫಿಕ್ಸ್ ಸಿಂಪಡಿಸಿ',
          'ಕೆಂಪು ಎಲೆ ರೋಗ ತಡೆಯಲು ಮೆಗ್ನೀಷಿಯಂ ಸಲ್ಫೇಟ್ ಸಿಂಪಡಣೆ',
          'ರೋಸೆಟ್ ಹೂವುಗಳನ್ನು ಕಿತ್ತು ಗುಲಾಬಿ ಹುಳು ನಾಶಪಡಿಸಿ',
          'ಕಾಯಿ ಬೆಳೆಯುವಾಗ ತೇವಾಂಶ ಕಾಪಾಡಿಕೊಳ್ಳಿ'
        ]
      },
      {
        stageNumber: 4,
        stage: 'Stage 4: Boll Bursting & Clean Cotton Picking',
        stageKn: 'ಹಂತ ೪: ಹತ್ತಿ ಕಾಯಿ ಬಿರಿಯುವಿಕೆ ಮತ್ತು ಬಿಡಿಸುವಿಕೆ',
        days: 'Day 121 - 165',
        startDay: 121,
        endDay: 165,
        water: 'Stop all irrigation once 30% bolls burst open',
        waterKn: 'ಶೇ. ೩೦ ರಷ್ಟು ಕಾಯಿ ಬಿರಿದಾಗ ನೀರು ನಿಲ್ಲಿಸಿ',
        waterLitersPerDay: 4000,
        nutrition: 'No chemical inputs',
        nutritionKn: 'ಯಾವುದೇ ಗೊಬ್ಬರ ನೀಡಬೇಡಿ',
        protection: 'Pick only fully burst bolls in bright morning sunlight',
        protectionKn: 'ಬೆಳಗಿನ ಬಿಸಿಲಿನಲ್ಲಿ ಒಣ ಹತ್ತಿಯನ್ನು ಮಾತ್ರ ಬಿಡಿಸಿ',
        expertTip: 'Never pick cotton with dry bracts or leaves; trash-free cotton fetches ₹400-600 extra per quintal in APMC.',
        expertTipKn: 'ಕಸ, ಒಣ ಎಲೆಗಳಿಲ್ಲದೆ ಶುದ್ಧವಾಗಿ ಬಿಡಿಸಿದ ಹತ್ತಿಗೆ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಗರಿಷ್ಠ ಬೆಲೆ ಸಿಗುತ್ತದೆ.',
        checklist: [
          'Stop irrigations when first flush of bolls open',
          'Pick clean dry cotton after morning dew evaporates',
          'Store picked cotton in cotton fabric bags (never plastic)',
          'Segregate stained / yellow bollworm damaged cotton separately'
        ],
        checklistKn: [
          'ಕಾಯಿ ಬಿರಿಯಲು ಪ್ರಾರಂಭಿಸಿದಾಗ ನೀರು ನಿಲ್ಲಿಸಿ',
          'ಇಬ್ಬನಿ ಆವಿಯಾದ ನಂತರ ಮಧ್ಯಾಹ್ನದ ವೇಳೆ ಹತ್ತಿ ಬಿಡಿಸಿ',
          'ಹತ್ತಿ ಬಿಡಿಸಲು ಹತ್ತಿಯ ಬಟ್ಟೆ ಚೀಲ ಬಳಸಿ (ಪ್ಲಾಸ್ಟಿಕ್ ಬಳಸಬೇಡಿ)',
          'ಕಲೆ ರಹಿತ ಉತ್ತಮ ಹತ್ತಿಯನ್ನು ಪ್ರತ್ಯೇಕವಾಗಿ ಸಂಗ್ರಹಿಸಿ'
        ]
      }
    ],
    pestsAndDiseases: [
      {
        id: 'pink-bollworm',
        name: 'Pink Bollworm',
        nameKn: 'ಗುಲಾಬಿ ಕಾಯಿ ಕೊರೆಯುವ ಹುಳು',
        type: 'pest',
        severity: 'high',
        symptoms: 'Rosette flowers (petals twisted like a rosebud), stained unburst bolls with small exit holes.',
        symptomsKn: 'ಗುಲಾಬಿ ಮೊಗ್ಗು ಆಕಾರದ ಹೂವುಗಳು, ಕಾಯಿ ಒಳಗೆ ಹತ್ತಿ ಬೀಜಗಳನ್ನು ತಿಂದು ನೂಲು ಹಾಳುಮಾಡುವ ಹುಳು.',
        organicControl: 'Install 5 Pectilure pheromone traps per acre. Mass trapping with light traps.',
        organicControlKn: 'ಎಕರೆಗೆ ೫ ಮೋಹಕ ಬಲೆ ಅಳವಡಿಸಿ. ಬೆಳಕಿನ ಬಲೆಗಳಿಂದ ಚಿಟ್ಟೆ ನಾಶಪಡಿಸಿ.',
        chemicalControl: 'Spray Chlorpyrifos 20 EC @ 2ml/L or Profenofos 50 EC @ 2ml/L during peak moth catches.',
        chemicalControlKn: 'ಪ್ರೊಫೆನೋಫಾಸ್ ೨ ಮಿ.ಲೀ/ಲೀ ಅಥವಾ ಕ್ಲೋರ್‌ಪೈರಿಫಾಸ್ ಸಿಂಪಡಿಸಿ.'
      },
      {
        id: 'red-leaf',
        name: 'Red Leaf Disease / Blight',
        nameKn: 'ಕೆಂಪು ಎಲೆ ರೋಗ',
        type: 'deficiency',
        severity: 'moderate',
        symptoms: 'Leaves turn reddened/purplish from leaf margins inward due to Magnesium deficiency under cold nights.',
        symptomsKn: 'ಮೆಗ್ನೀಷಿಯಂ ಕೊರತೆಯಿಂದ ಎಲೆಗಳು ಅಂಚಿನಿಂದ ಕೆಂಪಾಗಿ ಬಣ್ಣ ಬದಲಾಗುವುದು.',
        organicControl: 'Apply compost and wood ash at sowing to balance soil minerals.',
        organicControlKn: 'ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರ ಮತ್ತು ಬೂದಿ ಬಳಕೆ.',
        chemicalControl: 'Foliar spray of Magnesium Sulfate (10g/L) + Urea (10g/L) twice at 15-day intervals.',
        chemicalControlKn: 'ಮೆಗ್ನೀಷಿಯಂ ಸಲ್ಫೇಟ್ ೧೦ ಗ್ರಾಂ/ಲೀ ಹಾಗೂ ಯೂರಿಯಾ ೧೦ ಗ್ರಾಂ/ಲೀ ಸಿಂಪಡಿಸಿ.'
      }
    ],
    organicRemedies: [
      { remedy: 'Neem Oil & Soap Solution', recipe: '5ml cold-pressed neem oil (10,000 ppm) + 1g washing detergent per liter water.', target: 'Controls early season thrips, jassids, and whitefly nymphs' },
      { remedy: 'Biological Beauveria Bassiana', recipe: 'Spray Beauveria bassiana liquid formulation @ 5ml/liter water during evening hours.', target: 'Attacks and kills bollworm caterpillars naturally' },
      { remedy: 'Cow Dung Ash Dusting', recipe: 'Dust fine sieved wood ash mixed with cow dung powder on damp foliage early morning.', target: 'Prevents aphids and leaf beetles' }
    ]
  },
  {
    id: 'onion',
    name: 'Onion',
    nameKn: 'ಈರುಳ್ಳಿ',
    category: 'Vegetable',
    categoryKn: 'ತರಕಾರಿ ಬೆಳೆ',
    season: 'Kharif (June-Oct), Late Kharif (Aug-Jan) & Rabi (Oct-March)',
    seasonKn: 'ಮುಂಗಾರು ಮತ್ತು ಹಿಂಗಾರು',
    duration: '110 - 130 Days',
    durationKn: '೧೧೦ - ೧೩೦ ದಿನಗಳು',
    totalDays: 120,
    soil: 'Well-drained friable sandy loam rich in organic matter without hardpan',
    soilKn: 'ಉತ್ತಮ ನೀರು ಬಸಿದುಹೋಗುವ ಮರಳು ಗೋಡು ಅಥವಾ ಕೆಂಪು ಮಣ್ಣು',
    idealPh: '6.5 - 7.5',
    tempRange: '13°C - 30°C',
    waterNeed: 'Medium',
    avgYield: '80 - 120 Quintals / Acre (8-12 Tons)',
    avgYieldKn: '೮೦ - ೧೨೦ ಕ್ವಿಂಟಾಲ್ / ಎಕರೆ',
    seedRatePerAcre: '4 - 5 kg (Nursery) / 8-10 kg (Direct broadcasting)',
    seedRatePerAcreKn: '೪ - ೫ ಕೆಜಿ (ಸಸಿಮಡಿ)',
    spacing: '15 cm x 10 cm',
    npkRatio: { N: 50, P: 25, K: 40 },
    mspPerQuintal: 1500,
    avgMandiPricePerQ: 1950,
    costBreakdown: {
      seeds: 4000,
      landPrep: 4200,
      fertilizers: 4500,
      pesticides: 3000,
      laborHarvest: 8500,
      expectedYieldQ: 95,
    },
    varieties: [
      { name: 'Bhima Super (DOGR)', duration: '110 Days', yield: '100-110 Q/Acre', specialty: 'Bright red, high single bulb percentage, best for Kharif season' },
      { name: 'Arka Kalyan (IIHR)', duration: '125 Days', yield: '110-120 Q/Acre', specialty: 'Deep pinkish-red globe bulbs, highly pungent, excellent storage quality' },
      { name: 'Bellary Red', duration: '130 Days', yield: '85-95 Q/Acre', specialty: 'Traditional popular market variety, strong pungent flavor, thin neck' }
    ],
    stages: [
      {
        stageNumber: 1,
        stage: 'Stage 1: Raised Nursery Bed & Transplanting',
        stageKn: 'ಹಂತ ೧: ಎತ್ತರಿಸಿದ ಸಸಿಮಡಿ ಮತ್ತು ನಾಟಿ',
        days: 'Day 0 - 45',
        startDay: 0,
        endDay: 45,
        water: 'Sprinkler or rose can watering in nursery; light irrigation at transplanting',
        waterKn: 'ಸಸಿಮಡಿಯಲ್ಲಿ ಹಗುರ ನೀರು; ನಾಟಿ ವೇಳೆ ತೇವ ಕಾಪಾಡಿ',
        waterLitersPerDay: 7000,
        nutrition: 'Basal dose: 50% N + 100% P + 50% K + 15 kg Sulfur/acre',
        nutritionKn: 'ಮೂಲಗೊಬ್ಬರ: ೫೦% ಯೂರಿಯಾ + ಪೂರ್ಣ ಡಿಎಪಿ + ಪೊಟ್ಯಾಷ್ + ಗಂಧಕ (ಸಲ್ಫರ್)',
        protection: 'Dip seedling roots in Carbendazim (1g/L) for 15 mins to prevent damping-off',
        protectionKn: 'ಬುಡ ಕೊಳೆ ರೋಗ ತಡೆಯಲು ಸಸಿಗಳ ಬೇರನ್ನು ಶಿಲೀಂಧ್ರನಾಶಕದಲ್ಲಿ ಅದ್ದಿ ನೆಡಿ',
        expertTip: 'Applying 15kg Bentonite Sulfur per acre increases bulb pungency, skin tightness, and adds 3 months shelf life.',
        expertTipKn: 'ಎಕರೆಗೆ ೧೫ ಕೆಜಿ ಗಂಧಕ (ಸಲ್ಫರ್) ನೀಡಿದರೆ ಈರುಳ್ಳಿ ಗಟ್ಟಿಯಾಗಿ ಹೊಳಪು ಬರುತ್ತದೆ ಹಾಗೂ ೩ ತಿಂಗಳು ಕೆಡುವುದಿಲ್ಲ.',
        checklist: [
          'Prepare 15 cm high raised beds for nursery',
          'Transplant 45-day-old stocky pencil-thick seedlings',
          'Apply Sulfur with basal fertilizers',
          'Maintain 15 cm x 10 cm strict plant spacing'
        ],
        checklistKn: [
          '೧೫ ಸೆಂ.ಮೀ ಎತ್ತರದ ಸಸಿಮಡಿ ನಿರ್ಮಿಸಿ',
          '೪೫ ದಿನಗಳ ದೃಢವಾದ ಸಸಿಗಳನ್ನು ನಾಟಿ ಮಾಡಿ',
          'ಮೂಲಗೊಬ್ಬರದ ಜೊತೆ ಸಲ್ಫರ್ ಸೇರಿಸಿ',
          '೧೫ x ೧೦ ಸೆಂ.ಮೀ ಅಂತರದಲ್ಲಿ ನೆಡಿ'
        ]
      },
      {
        stageNumber: 2,
        stage: 'Stage 2: Vegetative Growth & Thrips Vigilance',
        stageKn: 'ಹಂತ ೨: ಎಲೆ ಬೆಳವಣಿಗೆ & ನುಸಿ ಕೀಟ ನಿಗ್ರಹ',
        days: 'Day 46 - 75',
        startDay: 46,
        endDay: 75,
        water: 'Irrigate every 5-7 days; avoid water stagnation which induces purple blotch',
        waterKn: '೫-೭ ದಿನಗಳಿಗೊಮ್ಮೆ ಹಗುರ ನೀರಾವರಿ; ನೀರು ನಿಲ್ಲದಂತೆ ನೋಡಿಕೊಳ್ಳಿ',
        waterLitersPerDay: 12000,
        nutrition: 'Top dressing: Remaining 50% Nitrogen (Urea 25 kg/acre) split in 2 doses',
        nutritionKn: 'ಉಳಿದ ೫೦% ಯೂರಿಯಾವನ್ನು ಎರಡು ಕಂತುಗಳಲ್ಲಿ ನೀಡಿ',
        protection: 'Install blue sticky traps (20/acre) for onion thrips',
        protectionKn: 'ನುಸಿ ಹುಳುಗಳ ಹತೋಟಿಗೆ ನೀಲಿ ಅಂಟು ಬಲೆಗಳನ್ನು ಅಳವಡಿಸಿ',
        expertTip: 'Onion thrips hide in the inner central leaf axils. Add a wetting agent (sticker) to spray liquid.',
        expertTipKn: 'ನುಸಿ ಹುಳುಗಳು ಎಲೆಗಳ ಕವಲುಗಳಲ್ಲಿ ಅಡಗುತ್ತವೆ. ಔಷಧಿ ಸಿಂಪಡಿಸುವಾಗ ಕಡ್ಡಾಯವಾಗಿ ಗಮ್ (ಸ್ಟಿಕ್ಕರ್) ಬಳಸಿ.',
        checklist: [
          'Hand weed field twice before bulbs begin swelling',
          'Install blue sticky traps across field',
          'Spray Fipronil or spinetoram with sticker if thrips exceed ETL',
          'Apply 1st top dressing of Urea on Day 55'
        ],
        checklistKn: [
          'ಗೆಡ್ಡೆ ದಪ್ಪಗಾಗುವ ಮುನ್ನ ಕಳೆ ತೆಗೆಯಿರಿ',
          'ನೀಲಿ ಬಣ್ಣದ ಅಂಟು ಬಲೆಗಳನ್ನು ಅಳವಡಿಸಿ',
          'ನುಸಿ ಹುಳು ನಿಯಂತ್ರಣಕ್ಕೆ ಕೀಟನಾಶಕದೊಂದಿಗೆ ಅಂಟು ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ',
          '೫೫ನೇ ದಿನಕ್ಕೆ ಮೊದಲ ಕಂತಿನ ಯೂರಿಯಾ ನೀಡಿ'
        ]
      },
      {
        stageNumber: 3,
        stage: 'Stage 3: Bulb Development & Swelling',
        stageKn: 'ಹಂತ ೩: ಗೆಡ್ಡೆ ಬೆಳೆಯುವಿಕೆ ಮತ್ತು ದಪ್ಪಗಾಗುವ ಹಂತ',
        days: 'Day 76 - 105',
        startDay: 76,
        endDay: 105,
        water: 'Maintain uniform soil moisture; uneven moisture causes split/double bulbs',
        waterKn: 'ಏಕರೂಪದ ತೇವಾಂಶ ಕಾಪಾಡಿ; ನೀರಿನ ಏರಿಳಿತವಾದರೆ ಜೋಡಿ ಈರುಳ್ಳಿ ಉಂಟಾಗುತ್ತದೆ',
        waterLitersPerDay: 16000,
        nutrition: 'Foliar spray of 0:0:50 (Potassium Sulfate) @ 5g/L + Micronutrient Boron (1g/L)',
        nutritionKn: 'ಗೆಡ್ಡೆ ದಪ್ಪ ಮತ್ತು ಗಟ್ಟಿಯಾಗಲು ೦:೦:೫೦ ಪೊಟ್ಯಾಷಿಯಂ ಮತ್ತು ಬೋರಾನ್ ಸಿಂಪಡಣೆ',
        protection: 'Inspect for Purple Blotch (Alternaria porri) during humid overcast mornings',
        protectionKn: 'ಮೋಡ ಕವಿದ ವಾತಾವರಣದಲ್ಲಿ ನೇರಳೆ ಮಚ್ಚೆ ರೋಗ ಪರೀಕ್ಷಿಸಿ',
        expertTip: 'Stop all nitrogen fertilizers by Day 75. Excess nitrogen at this stage creates thick-necked rotting bulbs.',
        expertTipKn: '೭೫ನೇ ದಿನದ ನಂತರ ಯಾವುದೇ ಕಾರಣಕ್ಕೂ ಯೂರಿಯಾ ನೀಡಬೇಡಿ; ಯೂರಿಯಾ ನೀಡಿದರೆ ಕುತ್ತಿಗೆ ದಪ್ಪವಾಗಿ ಬೇಗ ಕೊಳೆಯುತ್ತದೆ.',
        checklist: [
          'Discontinue Nitrogen fertilizer completely',
          'Foliar spray 0-0-50 for dense bulb skin color',
          'Check for split or double bulbs in sampling rows',
          'Maintain clean drainage paths between beds'
        ],
        checklistKn: [
          'ಯೂರಿಯಾ ಗೊಬ್ಬರ ನೀಡುವುದನ್ನು ಸಂಪೂರ್ಣ ನಿಲ್ಲಿಸಿ',
          'ಉತ್ತಮ ಸಿಪ್ಪೆಯ ಬಣ್ಣಕ್ಕೆ ೦-೦-೫೦ ಸಿಂಪಡಿಸಿ',
          'ಜೋಡಿ ಗೆಡ್ಡೆಗಳು ಉಂಟಾಗದಂತೆ ತೇವಾಂಶ ಕಾಪಾಡಿ',
          'ಬಸಿಗಾಲುವೆಗಳನ್ನು ಸ್ವಚ್ಛವಾಗಿಡಿ'
        ]
      },
      {
        stageNumber: 4,
        stage: 'Stage 4: Neck Fall, Curing & Storage',
        stageKn: 'ಹಂತ ೪: ಕುತ್ತಿಗೆ ಬಾಗುವುದು, ಹದಗೊಳಿಸುವಿಕೆ & ಕೊಯ್ಲು',
        days: 'Day 106 - 125',
        startDay: 106,
        endDay: 125,
        water: 'Stop irrigation completely 10-15 days before harvest when 25% tops fall',
        waterKn: 'ಶೇ. ೨೫ ರಷ್ಟು ಸೊಪ್ಪು ನೆಲಕ್ಕೆ ಬಾಗಿದಾಗ ನೀರು ಪೂರ್ಣ ನಿಲ್ಲಿಸಿ',
        waterLitersPerDay: 3000,
        nutrition: 'No chemical inputs',
        nutritionKn: 'ಯಾವುದೇ ಗೊಬ್ಬರ ನೀಡಬೇಡಿ',
        protection: 'Field curing in shade for 4-5 days to seal bulb necks',
        protectionKn: 'ಗೆಡ್ಡೆಯ ಕುತ್ತಿಗೆ ಮುಚ್ಚಿಕೊಳ್ಳಲು ೪-೫ ದಿನ ನೆರಳಿನಲ್ಲಿ ಹದಗೊಳಿಸಿ',
        expertTip: 'Harvest when 50-70% of tops naturally bend and fall over (Neck Fall). Never harvest when tops are upright.',
        expertTipKn: 'ಶೇ. ೫೦-೭೦ ರಷ್ಟು ಸೊಪ್ಪು ತಾನಾಗಿಯೇ ನೆಲಕ್ಕೆ ಬಾಗಿದಾಗ ಮಾತ್ರ ಕೊಯ್ಲು ಮಾಡಿ. ನೆಟ್ಟಗಿರುವಾಗ ಕೀಳಬೇಡಿ.',
        checklist: [
          'Confirm 50% natural neck fall across field',
          'Pull bulbs manually on a dry sunny morning',
          'Field cure in rows covered with foliage for 3-5 days',
          'Trim neck leaving 2.5 cm stalk above bulb before storing in ventilated sheds'
        ],
        checklistKn: [
          'ಶೇ. ೫೦ ಕುತ್ತಿಗೆ ಬಾಗಿರುವುದನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ',
          'ಒಣ ಬಿಸಿಲಿನ ದಿನದಂದು ಈರುಳ್ಳಿ ಕೀಳಿ',
          '೩-೫ ದಿನ ಸೊಪ್ಪಿನಿಂದ ಮುಚ್ಚಿ ನೆರಳಿನಲ್ಲಿ ಹದಗೊಳಿಸಿ',
          'ಗೆಡ್ಡೆಯಿಂದ ೨.೫ ಸೆಂ.ಮೀ ಸೊಪ್ಪು ಬಿಟ್ಟು ಕತ್ತರಿಸಿ ಶೇಖರಿಸಿ'
        ]
      }
    ],
    pestsAndDiseases: [
      {
        id: 'onion-thrips',
        name: 'Onion Thrips',
        nameKn: 'ನುಸಿ ಹುಳು',
        type: 'pest',
        severity: 'high',
        symptoms: 'Silvery white patches and streaks on leaves with distorted curled tips.',
        symptomsKn: 'ಎಲೆಗಳ ಮೇಲೆ ಬೆಳ್ಳಿಯಂತಹ ಬಿಳಿ ಗೆರೆಗಳು ಹಾಗೂ ಎಲೆಗಳು ಮುದುರಿಕೊಳ್ಳುವುದು.',
        organicControl: 'Spray Neem oil 10,000 ppm @ 3ml/L with soap nut. Install blue sticky traps.',
        organicControlKn: 'ಬೇವಿನ ಎಣ್ಣೆ ಸಿಂಪಡಿಸಿ. ನೀಲಿ ಅಂಟು ಬಲೆಗಳನ್ನು ಅಳವಡಿಸಿ.',
        chemicalControl: 'Spray Spinetoram 11.7 SC @ 0.8ml/L or Fipronil 5 SC @ 2ml/L with sticker.',
        chemicalControlKn: 'ಸ್ಪಿನೆಟೋರಮ್ ೦.೮ ಮಿ.ಲೀ ಅಥವಾ ಫಿಪ್ರೋನಿಲ್ ೨ ಮಿ.ಲೀ ಜೊತೆ ಗಮ್ ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ.'
      },
      {
        id: 'purple-blotch',
        name: 'Purple Blotch',
        nameKn: 'ನೇರಳೆ ಮಚ್ಚೆ ರೋಗ',
        type: 'disease',
        severity: 'high',
        symptoms: 'Small sunken water-soaked spots with dark purple centers on leaves and seed stalks.',
        symptomsKn: 'ಎಲೆಗಳ ಮೇಲೆ ಮಧ್ಯದಲ್ಲಿ ನೇರಳೆ ಬಣ್ಣವಿರುವ ನೀರಿನಿಂದ ಕೂಡಿದ ಮಚ್ಚೆಗಳು.',
        organicControl: 'Spray Pseudomonas fluorescens @ 5g/L preventive before monsoon fog.',
        organicControlKn: 'ಸೂಡೋಮೊನಾಸ್ ಜೈವಿಕ ದ್ರಾವಣ ಸಿಂಪಡಿಸಿ.',
        chemicalControl: 'Spray Tebuconazole + Trifloxystrobin (Nativo) @ 0.7g/L or Mancozeb 75 WP @ 2.5g/L.',
        chemicalControlKn: 'ಟೆಬುಕೊನಜೋಲ್ + ಟ್ರೈಫ್ಲಾಕ್ಸಿಸ್ಟ್ರೋಬಿನ್ (ನೇಟಿವೋ) ೦.೭ ಗ್ರಾಂ/ಲೀ ಸಿಂಪಡಿಸಿ.'
      }
    ],
    organicRemedies: [
      { remedy: 'Sulfur & Wood Ash Dusting', recipe: 'Mix 1 part elemental wettable sulfur with 5 parts fine sieved wood ash. Dust over morning dew.', target: 'Prevents thrips feeding and eradicates powdery mildew' },
      { remedy: 'Fermented Garlic-Chilli Extract', recipe: 'Crush 500g garlic + 500g spicy green chillies + 100g hing in 10L cow urine. Dilute in 100L water.', target: 'Natural pungent deterrent against sap-sucking onion thrips' }
    ]
  }
];

export const CropGuidance: React.FC<CropGuidanceProps> = ({ lang, onNavigateTab }) => {
  const [selectedCropId, setSelectedCropId] = useState<string>('paddy');
  const [activeSubTab, setActiveSubTab] = useState<'tracker' | 'stages' | 'pests' | 'irrigation' | 'calculator' | 'varieties' | 'organic' | 'economics'>('tracker');

  // Interactive Live Sowing Date Tracker State
  const [sowingDate, setSowingDate] = useState<string>(() => {
    // Default to 28 days ago
    const d = new Date();
    d.setDate(d.getDate() - 28);
    return d.toISOString().split('T')[0];
  });

  // Checklist items marked completed by the farmer
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('nammaraitha_crop_tasks');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  // Fertilizer calculator state
  const [landArea, setLandArea] = useState<number>(2); // 2 acres default
  const [landUnit, setLandUnit] = useState<'acre' | 'gunta'>('acre');
  const [soilFertility, setSoilFertility] = useState<'low' | 'medium' | 'high'>('medium');

  // Economics custom mandi price
  const [customPrice, setCustomPrice] = useState<number>(0);

  // Audio speech synthesis
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [smsPhone, setSmsPhone] = useState('');
  const [smsSuccess, setSmsSuccess] = useState(false);

  // Sync completed tasks to localStorage
  const toggleTask = (taskKey: string) => {
    setCompletedTasks((prev) => {
      const next = { ...prev, [taskKey]: !prev[taskKey] };
      try {
        localStorage.setItem('nammaraitha_crop_tasks', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const currentCrop = useMemo(() => {
    return CROP_GUIDANCE_DATABASE.find((c) => c.id === selectedCropId) || CROP_GUIDANCE_DATABASE[0];
  }, [selectedCropId]);

  // Set default mandi price whenever crop changes
  useEffect(() => {
    setCustomPrice(currentCrop.avgMandiPricePerQ);
  }, [currentCrop]);

  // Calculate live days after sowing (DAS)
  const daysAfterSowing = useMemo(() => {
    if (!sowingDate) return 0;
    const sow = new Date(sowingDate);
    const today = new Date();
    const diffTime = today.getTime() - sow.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, Math.min(diffDays, currentCrop.totalDays));
  }, [sowingDate, currentCrop.totalDays]);

  // Find active stage based on days after sowing
  const activeStage = useMemo(() => {
    return (
      currentCrop.stages.find(
        (st) => daysAfterSowing >= st.startDay && daysAfterSowing <= st.endDay
      ) || currentCrop.stages[currentCrop.stages.length - 1]
    );
  }, [currentCrop.stages, daysAfterSowing]);

  // Percent growth progress
  const growthProgressPct = useMemo(() => {
    return Math.min(100, Math.round((daysAfterSowing / currentCrop.totalDays) * 100));
  }, [daysAfterSowing, currentCrop.totalDays]);

  // Fertilizer computation
  const calculatedBags = useMemo(() => {
    const acres = landUnit === 'acre' ? landArea : landArea / 40;
    // Multipliers for soil fertility
    const fertilityMultiplier = soilFertility === 'low' ? 1.2 : soilFertility === 'high' ? 0.85 : 1.0;

    const reqN = currentCrop.npkRatio.N * acres * fertilityMultiplier;
    const reqP = currentCrop.npkRatio.P * acres * fertilityMultiplier;
    const reqK = currentCrop.npkRatio.K * acres * fertilityMultiplier;

    // DAP provides 18% N and 46% P
    const dapBags = Math.ceil((reqP / 0.46) / 50);
    const nFromDap = dapBags * 50 * 0.18;
    const remainingN = Math.max(0, reqN - nFromDap);
    const ureaBags = Math.ceil((remainingN / 0.46) / 45);
    const mopBags = Math.ceil((reqK / 0.60) / 50);
    const fymTons = Math.max(1, Math.round(acres * 4));
    const zincKg = Math.round(acres * 10);
    const boronKg = Math.round(acres * 1.5);

    const totalCost = dapBags * 1350 + ureaBags * 266 + mopBags * 1700 + zincKg * 65 + boronKg * 350;

    return {
      acres,
      dapBags,
      ureaBags,
      mopBags,
      fymTons,
      zincKg,
      boronKg,
      totalCost
    };
  }, [landArea, landUnit, soilFertility, currentCrop.npkRatio]);

  // Economics computation
  const economicsData = useMemo(() => {
    const acres = landUnit === 'acre' ? landArea : landArea / 40;
    const b = currentCrop.costBreakdown;
    const totalCost =
      (b.seeds + b.landPrep + b.fertilizers + b.pesticides + b.laborHarvest) * acres;
    const totalProductionQ = b.expectedYieldQ * acres;
    const grossIncome = totalProductionQ * (customPrice || currentCrop.avgMandiPricePerQ);
    const netProfit = grossIncome - totalCost;
    const roi = totalCost > 0 ? Math.round((netProfit / totalCost) * 100) : 0;

    return {
      totalCost,
      totalProductionQ,
      grossIncome,
      netProfit,
      roi
    };
  }, [landArea, landUnit, currentCrop, customPrice]);

  // Speech narration
  const handleAudioToggle = () => {
    if (!audioPlaying) {
      setAudioPlaying(true);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const text =
          lang === 'kn'
            ? `${currentCrop.nameKn} ಬೆಳೆ ಬೆಳೆಯುವ ಸಮಗ್ರ ಮಾರ್ಗದರ್ಶಿ. ಬೆಳೆಯ ಅವಧಿ ${currentCrop.durationKn}. ನಿರೀಕ್ಷಿತ ಇಳುವರಿ ${currentCrop.avgYieldKn}. ಪ್ರಸ್ತುತ ಹಂತ ${activeStage.stageKn}. ಕೃಷಿ ತಜ್ಞರ ಸಲಹೆ: ${activeStage.expertTipKn}`
            : `Comprehensive crop growing guidance for ${currentCrop.name}. Duration is ${currentCrop.duration}. Expected yield is ${currentCrop.avgYield}. Current active stage is ${activeStage.stage}. Agronomist tip: ${activeStage.expertTip}`;
        const utt = new SpeechSynthesisUtterance(text);
        utt.rate = 0.95;
        utt.onend = () => setAudioPlaying(false);
        utt.onerror = () => setAudioPlaying(false);
        window.speechSynthesis.speak(utt);
      } else {
        setTimeout(() => setAudioPlaying(false), 3000);
      }
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setAudioPlaying(false);
    }
  };

  const handleShareWhatsApp = () => {
    const message =
      `🌱 *${currentCrop.name} Growing Guidance (Namma Raitha / AgriAI)*\n` +
      `📅 Growth Stage: ${activeStage.stage} (${daysAfterSowing} DAS)\n` +
      `💧 Irrigation: ${activeStage.water}\n` +
      `🧪 Nutrition: ${activeStage.nutrition}\n` +
      `💡 KVK Expert Tip: ${activeStage.expertTip}\n` +
      `🔗 Free Agronomy Portal: https://ais-pre-icnpel57hljgz5hqcp4qkd-168762398560.asia-east1.run.app`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSubscribeSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (smsPhone.trim().length >= 10) {
      setSmsSuccess(true);
      setTimeout(() => setSmsSuccess(false), 5000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6">
      
      {/* Top Banner Header with Agrarian Palette */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-5 sm:p-7 text-white shadow-lg relative overflow-hidden border border-emerald-700/60">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/80 border border-emerald-500/50 text-amber-300 text-xs font-black shadow-xs">
              <Sprout className="w-3.5 h-3.5" />
              <span>{lang === 'kn' ? 'ಸ್ಮಾರ್ಟ್ ಬೆಳೆ ಬೆಳೆಯುವ ಮಾರ್ಗದರ್ಶಿ & ವಿಜ್ಞಾನ' : 'Comprehensive Crop Growing Guidance & Agronomy'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight text-white leading-tight">
              {lang === 'kn' ? 'ವೈಜ್ಞಾನಿಕ ಬೆಳೆ ಬೆಳೆಯುವ ಮಾರ್ಗದರ್ಶಿ' : 'Crop Growth & Agronomy Guidance'}
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {lang === 'kn'
                ? 'ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಬೆಳೆಗಳಿಗೆ ಹಂತವಾರು ನೀರಾವರಿ, ರಸಗೊಬ್ಬರ ಪ್ರಮಾಣ, ಕೀಟ ರಕ್ಷಣೆ ಹಾಗೂ ಮಾರುಕಟ್ಟೆ ವೆಚ್ಚ-ಲಾಭ ಲೆಕ್ಕಾಚಾರ.'
                : 'Stage-by-stage crop management from sowing to harvest: dynamic live growth tracking, NPK fertigation calculator, pest diagnostics, and APMC profit economics.'}
            </p>
          </div>

          {/* Quick Actions (Crop Selector, Audio Narration, WhatsApp Share, Print) */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Crop Selector */}
            <div className="flex items-center gap-2 bg-emerald-950/90 px-3.5 py-1.5 rounded-2xl border border-emerald-500/70 shadow-sm">
              <Sprout className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="text-xs text-amber-300 font-bold whitespace-nowrap">
                {lang === 'kn' ? 'ಬೆಳೆ:' : 'Crop:'}
              </span>
              <select
                value={selectedCropId}
                onChange={(e) => setSelectedCropId(e.target.value)}
                className="bg-emerald-900 text-white text-xs font-bold rounded-xl px-2.5 py-1 border border-emerald-500 outline-none cursor-pointer focus:ring-2 focus:ring-amber-400"
              >
                {CROP_GUIDANCE_DATABASE.map((c) => (
                  <option key={c.id} value={c.id}>
                    {lang === 'kn' ? c.nameKn : c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAudioToggle}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs shadow-sm transition border ${
                audioPlaying
                  ? 'bg-amber-400 text-emerald-950 border-amber-300 animate-pulse'
                  : 'bg-emerald-950/80 hover:bg-emerald-900 text-white border-emerald-700'
              }`}
              title="Listen to audio crop guidance"
            >
              {audioPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
              <span>{audioPlaying ? (lang === 'kn' ? 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ' : 'Stop Audio') : (lang === 'kn' ? 'ಧ್ವನಿ ಕೇಳಿ' : 'Listen Guide')}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm border border-emerald-500/80 transition"
              title="Share guidance on WhatsApp"
            >
              <Share2 className="w-4 h-4 text-emerald-200" />
              <span>{lang === 'kn' ? 'ವಾಟ್ಸಾಪ್ ಹಂಚಿಕೊಳ್ಳಿ' : 'Share'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 hover:text-white font-bold text-xs shadow-sm border border-emerald-700 transition"
              title="Print package of practices"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'kn' ? 'ಮುದ್ರಿಸಿ' : 'Print'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Full-Width Content Area */}
      <div className="w-full space-y-5">
        <main className="w-full space-y-5">
          
          {/* Header Card for Selected Crop */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                    {currentCrop.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                    {currentCrop.season}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                  <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-heading">
                    {lang === 'kn' ? currentCrop.nameKn : currentCrop.name}
                  </h2>
                  <select
                    value={selectedCropId}
                    onChange={(e) => setSelectedCropId(e.target.value)}
                    className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl px-2.5 py-1 outline-none cursor-pointer transition"
                    title="Switch Crop"
                  >
                    {CROP_GUIDANCE_DATABASE.map((c) => (
                      <option key={c.id} value={c.id}>
                        {lang === 'kn' ? c.nameKn : c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Water Requirement Badge */}
              <div className="flex items-center gap-2 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-100 w-fit">
                <Droplets className="w-4 h-4 text-sky-600" />
                <div className="text-xs">
                  <div className="text-[10px] text-stone-500 font-bold uppercase">Water Requirement</div>
                  <div className="font-extrabold text-sky-950">{currentCrop.waterNeed}</div>
                </div>
              </div>
            </div>

            {/* Crop Vital Stats Quick Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                <div className="text-[10px] text-stone-400 uppercase font-bold">Growth Duration</div>
                <div className="font-extrabold text-stone-900 mt-0.5">{currentCrop.duration}</div>
              </div>

              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                <div className="text-[10px] text-stone-400 uppercase font-bold">Expected Yield</div>
                <div className="font-extrabold text-emerald-800 mt-0.5">{currentCrop.avgYield}</div>
              </div>

              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                <div className="text-[10px] text-stone-400 uppercase font-bold">Soil & pH Range</div>
                <div className="font-extrabold text-stone-900 mt-0.5">pH {currentCrop.idealPh}</div>
              </div>

              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                <div className="text-[10px] text-stone-400 uppercase font-bold">Seed Rate / Acre</div>
                <div className="font-extrabold text-stone-900 mt-0.5">{currentCrop.seedRatePerAcre}</div>
              </div>
            </div>

            {/* Sub-Tabs Switcher for Growing Guidance Features */}
            <div className="flex items-center gap-1.5 pt-3 border-t border-stone-100 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveSubTab('tracker')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeSubTab === 'tracker'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{lang === 'kn' ? '೧. ನನ್ನ ಬೆಳೆಯ ಹಂತ & ಕಾರ್ಯಪಟ್ಟಿ' : '1. My Crop Live Tracker'}</span>
              </button>

              <button
                onClick={() => setActiveSubTab('stages')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeSubTab === 'stages'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{lang === 'kn' ? '೨. ಹಂತವಾರು ವೇಳಾಪಟ್ಟಿ' : '2. Growth Stages'}</span>
              </button>

              <button
                onClick={() => setActiveSubTab('pests')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeSubTab === 'pests'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Bug className="w-3.5 h-3.5 text-amber-500" />
                <span>{lang === 'kn' ? '೩. ಕೀಟ & ರೋಗ ಮಾರ್ಗದರ್ಶಿ' : '3. Pest & Disease Guide'}</span>
              </button>

              <button
                onClick={() => setActiveSubTab('irrigation')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeSubTab === 'irrigation'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Droplets className="w-3.5 h-3.5 text-sky-500" />
                <span>{lang === 'kn' ? '೪. ಹನಿ ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿ' : '4. Drip & Water Schedule'}</span>
              </button>

              <button
                onClick={() => setActiveSubTab('calculator')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeSubTab === 'calculator'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'kn' ? '೫. ಗೊಬ್ಬರ ಕ್ಯಾಲ್ಕುಲೇಟರ್' : '5. NPK Calculator'}</span>
              </button>

              <button
                onClick={() => setActiveSubTab('economics')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeSubTab === 'economics'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                <span>{lang === 'kn' ? '೬. ವೆಚ್ಚ & ಲಾಭ ಲೆಕ್ಕಾಚಾರ' : '6. Cost & Profit'}</span>
              </button>

              <button
                onClick={() => setActiveSubTab('varieties')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeSubTab === 'varieties'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>{lang === 'kn' ? '೭. ಬೀಜ ಪ್ರಭೇದಗಳು' : '7. Varieties'}</span>
              </button>

              <button
                onClick={() => setActiveSubTab('organic')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeSubTab === 'organic'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'kn' ? '೮. ಸಾವಯವ ZBNF' : '8. Organic Remedies'}</span>
              </button>
            </div>
          </div>

          {/* ================= 1. LIVE SOWING TRACKER & CHECKLIST ================= */}
          {activeSubTab === 'tracker' && (
            <div className="space-y-4">
              
              {/* Sowing Date Configurator & Real-Time Age Bar */}
              <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl p-5 shadow-sm border border-emerald-800/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-base text-amber-300 font-heading">
                      {lang === 'kn' ? 'ನನ್ನ ಬೆಳೆಯ ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ' : 'My Live Crop Stage & Growth Monitor'}
                    </h3>
                    <p className="text-xs text-emerald-200/80 mt-0.5">
                      Select your sowing / transplanting date to automatically calculate your exact crop age and next action.
                    </p>
                  </div>

                  {/* Sowing Date Picker */}
                  <div className="bg-emerald-900/90 border border-emerald-700/80 px-3 py-1.5 rounded-xl flex items-center gap-2">
                    <span className="text-[11px] font-bold text-emerald-300">Sown on:</span>
                    <input
                      type="date"
                      value={sowingDate}
                      onChange={(e) => setSowingDate(e.target.value)}
                      className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Progress Gauge */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-amber-300">
                      Current Age: <strong className="font-mono text-white text-sm">{daysAfterSowing} Days After Sowing (DAS)</strong>
                    </span>
                    <span className="text-emerald-300 font-mono">
                      {currentCrop.totalDays - daysAfterSowing} days until expected harvest ({growthProgressPct}%)
                    </span>
                  </div>

                  <div className="w-full bg-emerald-950 rounded-full h-3.5 p-0.5 border border-emerald-700/80 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-400 via-amber-400 to-emerald-300 h-full rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${growthProgressPct}%` }}
                    />
                  </div>
                </div>

                {/* Active Stage Callout Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 font-black flex items-center justify-center shrink-0 text-base shadow-sm">
                      {activeStage.stageNumber}
                    </div>
                    <div>
                      <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                        ACTIVE STAGE RIGHT NOW
                      </div>
                      <div className="font-extrabold text-white text-sm sm:text-base">
                        {lang === 'kn' ? activeStage.stageKn : activeStage.stage}
                      </div>
                      <div className="text-xs text-emerald-200 mt-0.5">
                        {activeStage.days} &bull; Water: {activeStage.waterLitersPerDay.toLocaleString()} L/acre/day
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-950/70 border border-emerald-600/60 rounded-xl p-2.5 text-xs text-emerald-100 max-w-xs">
                    <div className="flex items-center gap-1 font-bold text-amber-300 text-[11px] mb-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{lang === 'kn' ? 'ತಕ್ಷಣದ ಸಲಹೆ' : 'Top Agronomist Action:'}</span>
                    </div>
                    <div className="text-[11px] leading-tight">
                      {lang === 'kn' ? activeStage.expertTipKn : activeStage.expertTip}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actionable Stage Checklist with Interactive Checkboxes */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ListChecks className="w-5 h-5 text-emerald-700" />
                    <h4 className="font-extrabold text-stone-900 text-sm sm:text-base font-heading">
                      {lang === 'kn' ? 'ಈ ಹಂತದಲ್ಲಿ ಕೈಗೊಳ್ಳಬೇಕಾದ ಕೃಷಿ ಕಾರ್ಯಗಳ ಪಟ್ಟಿ' : 'Critical Tasks & Agronomy Checklist for This Stage'}
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                    Stage {activeStage.stageNumber} Checklist
                  </span>
                </div>

                <div className="space-y-2.5">
                  {activeStage.checklist.map((task, idx) => {
                    const taskKey = `${currentCrop.id}_s${activeStage.stageNumber}_t${idx}`;
                    const isDone = !!completedTasks[taskKey];
                    const taskKn = activeStage.checklistKn[idx] || task;

                    return (
                      <div
                        key={idx}
                        onClick={() => toggleTask(taskKey)}
                        className={`p-3 rounded-xl border transition flex items-start gap-3 cursor-pointer ${
                          isDone
                            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                            : 'bg-stone-50 hover:bg-stone-100/70 border-stone-200 text-stone-800'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isDone ? (
                            <CheckSquare className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
                          ) : (
                            <Square className="w-4 h-4 text-stone-400 stroke-[2]" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-semibold leading-relaxed ${isDone ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                            {lang === 'kn' ? taskKn : task}
                          </p>
                        </div>

                        {isDone && (
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                            Done ✓
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Weather & Climate Synchronization Alert */}
                <div className="bg-sky-50 rounded-xl p-3.5 border border-sky-200/80 flex items-start gap-3 text-xs text-sky-950">
                  <CloudRain className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-bold text-sky-900">
                      {lang === 'kn' ? 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ & ಸಿಂಪಡಣೆ ಸಲಹೆ:' : 'Agro-Meteorological Advisory for this Week:'}
                    </div>
                    <p className="text-[11px] text-stone-700 leading-relaxed">
                      Maintain proper drainage in fields if heavy showers occur. Avoid foliar fertilizer broadcast during high midday temperatures (12 PM - 3 PM); spray only during calm morning or late evening hours.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= 2. FULL LIFECYCLE GROWTH STAGES ================= */}
          {activeSubTab === 'stages' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-stone-900 text-base font-heading">
                  {lang === 'kn' ? 'ಸಂಪೂರ್ಣ ಬೆಳೆ ಜೀವನ ಚಕ್ರ & ಹಂತವಾರು ನಿರ್ವಹಣೆ' : 'Complete Crop Life-Cycle Progression & Daily Care'}
                </h3>
                <span className="text-xs text-stone-500">
                  {currentCrop.stages.length} Stages &bull; Sowing to Harvest
                </span>
              </div>

              <div className="space-y-3.5">
                {currentCrop.stages.map((st, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs hover:border-emerald-300 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-emerald-800 text-white text-xs font-black flex items-center justify-center shrink-0">
                          {st.stageNumber}
                        </span>
                        <h4 className="font-extrabold text-stone-900 text-sm sm:text-base">
                          {lang === 'kn' ? st.stageKn : st.stage}
                        </h4>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold w-fit">
                        {st.days}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 text-xs">
                      {/* Water/Irrigation */}
                      <div className="bg-sky-50/70 p-3 rounded-xl border border-sky-100 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-sky-900">
                          <Droplets className="w-3.5 h-3.5 text-sky-600" />
                          <span>{lang === 'kn' ? 'ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿ' : 'Irrigation & Water'}</span>
                        </div>
                        <p className="text-[11px] text-stone-700 leading-relaxed">
                          {lang === 'kn' ? st.waterKn : st.water}
                        </p>
                        <div className="text-[10px] text-sky-800 font-bold pt-1">
                          Req: {st.waterLitersPerDay.toLocaleString()} L/acre/day
                        </div>
                      </div>

                      {/* Nutrition / Fertilizer */}
                      <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                          <FlaskConical className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{lang === 'kn' ? 'ರಸಗೊಬ್ಬರ & ಪೋಷಕಾಂಶ' : 'Fertilizer & Nutrition'}</span>
                        </div>
                        <p className="text-[11px] text-stone-700 leading-relaxed">
                          {lang === 'kn' ? st.nutritionKn : st.nutrition}
                        </p>
                      </div>

                      {/* Pest Protection */}
                      <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-100 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-amber-950">
                          <Bug className="w-3.5 h-3.5 text-amber-700" />
                          <span>{lang === 'kn' ? 'ಕೀಟ & ರೋಗ ನಿಯಂತ್ರಣ' : 'Pest Watch & Disease'}</span>
                        </div>
                        <p className="text-[11px] text-stone-700 leading-relaxed">
                          {lang === 'kn' ? st.protectionKn : st.protection}
                        </p>
                      </div>
                    </div>

                    {/* Agronomist Expert Tip Box */}
                    <div className="mt-3 bg-stone-50 p-2.5 rounded-xl border border-stone-200/80 flex items-start gap-2 text-xs">
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div className="text-stone-700 text-[11px] leading-relaxed">
                        <span className="font-bold text-stone-900 mr-1">
                          {lang === 'kn' ? 'ಕೃಷಿ ತಜ್ಞರ ವಿಶೇಷ ಸಲಹೆ:' : 'KVK Agronomist Tip:'}
                        </span>
                        <span>{lang === 'kn' ? st.expertTipKn : st.expertTip}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 3. PEST & DISEASE DIAGNOSTICS ================= */}
          {activeSubTab === 'pests' && (
            <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-stone-900 text-lg font-heading">
                    {lang === 'kn' ? 'ಕೀಟ ಮತ್ತು ರೋಗ ನಿಯಂತ್ರಣ ಮಾರ್ಗದರ್ಶಿ' : `Pest & Disease Identification for ${currentCrop.name}`}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Recognize symptoms early, prevent yield loss, and adopt university-tested IPM controls.
                  </p>
                </div>

                <button
                  onClick={() => onNavigateTab('cropDoctor')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition shrink-0"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'kn' ? 'ಎಲೆ ತಪಾಸಣೆ ಮಾಡಿ ರೋಗ ಪತ್ತೆ ಹಚ್ಚಿ' : 'AI Crop Doctor'}</span>
                </button>
              </div>

              <div className="space-y-4">
                {currentCrop.pestsAndDiseases.map((pd) => (
                  <div
                    key={pd.id}
                    className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-3 hover:border-emerald-300 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                          <Bug className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-stone-900 text-sm">
                            {lang === 'kn' ? pd.nameKn : pd.name}
                          </h4>
                          <span className="text-[10px] text-stone-500 capitalize">
                            Type: {pd.type}
                          </span>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider w-fit ${
                        pd.severity === 'high'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {pd.severity} Severity
                      </span>
                    </div>

                    {/* Symptoms description */}
                    <div className="text-xs bg-white p-3 rounded-xl border border-stone-200/80">
                      <div className="font-bold text-stone-900 mb-0.5 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>{lang === 'kn' ? 'ರೋಗ ಲಕ್ಷಣಗಳು (Symptoms):' : 'Key Visual Symptoms:'}</span>
                      </div>
                      <p className="text-[11px] text-stone-700 leading-relaxed">
                        {lang === 'kn' ? pd.symptomsKn : pd.symptoms}
                      </p>
                    </div>

                    {/* 2-Column Controls: Organic vs Chemical */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {/* Organic IPM */}
                      <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 space-y-1">
                        <div className="font-bold text-emerald-950 flex items-center gap-1">
                          <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{lang === 'kn' ? 'ಜೈವಿಕ & ನೈಸರ್ಗಿಕ ಹತೋಟಿ:' : 'Organic & Biological IPM:'}</span>
                        </div>
                        <p className="text-[11px] text-stone-700 leading-relaxed">
                          {lang === 'kn' ? pd.organicControlKn : pd.organicControl}
                        </p>
                      </div>

                      {/* Chemical Rescue */}
                      <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 space-y-1">
                        <div className="font-bold text-amber-950 flex items-center gap-1">
                          <FlaskConical className="w-3.5 h-3.5 text-amber-700" />
                          <span>{lang === 'kn' ? 'ಶಿಫಾರಸು ಮಾಡಿದ ಔಷಧಿ ಪ್ರಮಾಣ:' : 'Recommended Chemical Rescue & Dosage:'}</span>
                        </div>
                        <p className="text-[11px] text-stone-700 leading-relaxed font-mono">
                          {lang === 'kn' ? pd.chemicalControlKn : pd.chemicalControl}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 4. IRRIGATION & WATER MANAGEMENT ================= */}
          {activeSubTab === 'irrigation' && (
            <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-5">
              <div>
                <h3 className="font-extrabold text-stone-900 text-lg font-heading">
                  {lang === 'kn' ? 'ಹನಿ ನೀರಾವರಿ & ಜಲ ನಿರ್ವಹಣೆ ವೇಳಾಪಟ್ಟಿ' : `Precision Irrigation & Drip Schedule for ${currentCrop.name}`}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Optimize crop yield and save up to 45% water by following stage-wise irrigation water budgets.
                </p>
              </div>

              {/* Water Need Stats Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-sky-50 p-4 rounded-xl border border-sky-200 text-sky-950">
                  <div className="text-[10px] text-sky-800 uppercase font-bold">Overall Water Need</div>
                  <div className="text-xl font-black mt-1 font-heading">{currentCrop.waterNeed} Demand</div>
                  <div className="text-[10px] text-stone-600 mt-0.5">Sensitive to dry spells at flowering</div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-emerald-950">
                  <div className="text-[10px] text-emerald-800 uppercase font-bold">Drip Water Savings</div>
                  <div className="text-xl font-black mt-1 font-heading">35% - 50%</div>
                  <div className="text-[10px] text-stone-600 mt-0.5">Compared to flood irrigation</div>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-stone-900">
                  <div className="text-[10px] text-stone-500 uppercase font-bold">Critical Sensitivity Stage</div>
                  <div className="text-base font-extrabold mt-1 text-amber-700">Flowering & Fruit Setting</div>
                  <div className="text-[10px] text-stone-600 mt-0.5">Moisture stress causes flower drop</div>
                </div>
              </div>

              {/* Stage-wise water requirement chart */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-stone-900 text-sm">
                  {lang === 'kn' ? 'ಹಂತವಾರು ದೈನಂದಿನ ನೀರಿನ ಪ್ರಮಾಣ (ಎಕರೆಗೆ ಲೀಟರ್‌ಗಳಲ್ಲಿ)' : 'Daily Water Requirement per Acre by Stage'}
                </h4>

                <div className="space-y-2">
                  {currentCrop.stages.map((st) => (
                    <div key={st.stageNumber} className="p-3 rounded-xl border border-stone-200 bg-stone-50/70 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-stone-900">
                          Stage {st.stageNumber}: {lang === 'kn' ? st.stageKn : st.stage} ({st.days})
                        </span>
                        <span className="text-sky-700 font-mono">
                          {st.waterLitersPerDay.toLocaleString()} Liters / Day
                        </span>
                      </div>

                      <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-sky-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, (st.waterLitersPerDay / 32000) * 100)}%` }}
                        />
                      </div>

                      <p className="text-[11px] text-stone-600 leading-snug">
                        {lang === 'kn' ? st.waterKn : st.water}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rain Calibration Advice */}
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold">Monsoon & Rainfall Adjustment:</div>
                  <p className="text-[11px] text-stone-700 leading-relaxed">
                    If rainfall exceeds 25mm in 24 hours, postpone drip irrigation for 48 hours. Ensure field drainage channels (ಬಸಿಗಾಲುವೆ) are kept unclogged to avoid root asphyxiation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= 5. NPK FERTILIZER DOSAGE CALCULATOR ================= */}
          {activeSubTab === 'calculator' && (
            <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-5">
              <div>
                <h3 className="font-extrabold text-stone-900 text-lg font-heading">
                  {lang === 'kn' ? 'ಸ್ಮಾರ್ಟ್ ರಸಗೊಬ್ಬರ ಪ್ರಮಾಣ ಕ್ಯಾಲ್ಕುಲೇಟರ್' : `Smart NPK Fertilizer Dosage Calculator for ${currentCrop.name}`}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Enter your farm land size to calculate the exact bags of Urea, DAP, MOP and compost needed.
                </p>
              </div>

              {/* Land Inputs Controls */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex flex-wrap items-center gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    {lang === 'kn' ? 'ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ (Land Area)' : 'Enter Land Area:'}
                  </label>
                  <input
                    type="number"
                    min={0.25}
                    step={0.25}
                    value={landArea}
                    onChange={(e) => setLandArea(Math.max(0.1, parseFloat(e.target.value) || 0))}
                    className="px-3 py-2 text-sm font-black rounded-xl border border-stone-300 bg-white w-28 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    {lang === 'kn' ? 'ಪ್ರಮಾಣ ಘಟಕ (Unit):' : 'Land Unit:'}
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setLandUnit('acre')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition border ${
                        landUnit === 'acre'
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-300'
                      }`}
                    >
                      Acres (ಎಕರೆ)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLandUnit('gunta')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition border ${
                        landUnit === 'gunta'
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-300'
                      }`}
                    >
                      Guntas (ಗುಂಟೆ)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Soil Fertility Level:
                  </label>
                  <select
                    value={soilFertility}
                    onChange={(e) => setSoilFertility(e.target.value as any)}
                    className="px-3 py-2 text-xs font-bold rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                  >
                    <option value="low">Low Fertility (+20% dosage)</option>
                    <option value="medium">Medium Fertility (Standard)</option>
                    <option value="high">High Fertility (-15% dosage)</option>
                  </select>
                </div>

                <div className="ml-auto bg-white px-3 py-2 rounded-xl border border-emerald-200 text-xs">
                  <span className="text-stone-500 font-medium">Standard N:P:K:</span>
                  <span className="font-black text-emerald-800 ml-1.5 font-mono">
                    {currentCrop.npkRatio.N} : {currentCrop.npkRatio.P} : {currentCrop.npkRatio.K} kg/acre
                  </span>
                </div>
              </div>

              {/* Calculated Bag Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200 text-center">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">Urea (45kg Bags)</div>
                  <div className="text-2xl font-black text-emerald-950 my-1 font-mono">{calculatedBags.ureaBags}</div>
                  <div className="text-[10px] text-stone-500">Nitrogen Top Dressing</div>
                </div>

                <div className="bg-blue-50 rounded-xl p-3.5 border border-blue-200 text-center">
                  <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wide">DAP (50kg Bags)</div>
                  <div className="text-2xl font-black text-blue-950 my-1 font-mono">{calculatedBags.dapBags}</div>
                  <div className="text-[10px] text-stone-500">Phosphorus Basal Dose</div>
                </div>

                <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-200 text-center">
                  <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">MOP Potash (50kg)</div>
                  <div className="text-2xl font-black text-amber-950 my-1 font-mono">{calculatedBags.mopBags}</div>
                  <div className="text-[10px] text-stone-500">Potassium & Grain Weight</div>
                </div>

                <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200 text-center">
                  <div className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">Compost / FYM</div>
                  <div className="text-2xl font-black text-stone-900 my-1 font-mono">{calculatedBags.fymTons} <span className="text-sm font-normal">Tons</span></div>
                  <div className="text-[10px] text-stone-500">Soil Organic Matter</div>
                </div>
              </div>

              {/* Micronutrients requirement */}
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-stone-900">Recommended Micronutrients:</span>
                </div>
                <div className="flex items-center gap-4 text-stone-700 font-mono">
                  <span>Zinc Sulfate: <strong>{calculatedBags.zincKg} kg</strong></span>
                  <span>Borax / Solubor: <strong>{calculatedBags.boronKg} kg</strong></span>
                </div>
                <div className="text-stone-500">
                  Est. Fertilizer Cost: <strong className="text-emerald-800 font-mono">₹{calculatedBags.totalCost.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Order certified fertilizer link */}
              <div className="bg-emerald-900 text-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <div className="font-extrabold text-sm text-amber-300">
                    {lang === 'kn' ? 'ಸಬ್ಸಿಡಿ ದರದಲ್ಲಿ ಗೊಬ್ಬರ ಮತ್ತು ಪರಿಕರಗಳನ್ನು ಖರೀದಿಸಿ' : 'Get DBT Subsidized Fertilizers & Sprayers'}
                  </div>
                  <div className="text-xs text-emerald-200 mt-0.5">
                    Order certified NPK bags and micronutrients with 40-50% government subsidy directly to your village.
                  </div>
                </div>
                <button
                  onClick={() => onNavigateTab('agriInputs')}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-md transition whitespace-nowrap"
                >
                  {lang === 'kn' ? 'ಮಳಿಗೆ ತೆರೆಯಿರಿ →' : 'Open Agri Store →'}
                </button>
              </div>
            </div>
          )}

          {/* ================= 6. CROP ECONOMICS & PROFITABILITY ================= */}
          {activeSubTab === 'economics' && (
            <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-5">
              <div>
                <h3 className="font-extrabold text-stone-900 text-lg font-heading">
                  {lang === 'kn' ? 'ಬೆಳೆ ಆಯವ್ಯಯ ಮತ್ತು ಲಾಭ ಲೆಕ್ಕಾಚಾರ' : `Cost of Cultivation & APMC Profitability for ${currentCrop.name}`}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Analyze your production cost per acre against prevailing Mandi market rates and Minimum Support Price (MSP).
                </p>
              </div>

              {/* Price Slider Control */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-700">Estimated Market Selling Price:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-stone-500">Govt MSP: ₹{currentCrop.mspPerQuintal}/Q</span>
                    <span className="text-base font-black text-emerald-800 font-mono">
                      ₹{customPrice.toLocaleString('en-IN')} / Quintal
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  min={Math.round(currentCrop.mspPerQuintal * 0.7)}
                  max={Math.round(currentCrop.avgMandiPricePerQ * 1.8)}
                  step={50}
                  value={customPrice}
                  onChange={(e) => setCustomPrice(parseInt(e.target.value) || currentCrop.avgMandiPricePerQ)}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
              </div>

              {/* Summary Results 4 Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <div className="text-[10px] text-stone-500 uppercase font-bold">Total Cost of Cultivation</div>
                  <div className="text-xl font-black text-stone-900 mt-1 font-mono">
                    ₹{economicsData.totalCost.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <div className="text-[10px] text-stone-500 uppercase font-bold">Expected Total Yield</div>
                  <div className="text-xl font-black text-stone-900 mt-1 font-mono">
                    {economicsData.totalProductionQ.toFixed(1)} Q
                  </div>
                </div>

                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <div className="text-[10px] text-emerald-800 uppercase font-bold">Gross Mandi Revenue</div>
                  <div className="text-xl font-black text-emerald-950 mt-1 font-mono">
                    ₹{economicsData.grossIncome.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className={`p-3 rounded-xl border ${
                  economicsData.netProfit >= 0 ? 'bg-amber-50 border-amber-300' : 'bg-rose-50 border-rose-300'
                }`}>
                  <div className="text-[10px] uppercase font-bold text-amber-900">
                    Net Estimated Profit ({economicsData.roi}%)
                  </div>
                  <div className={`text-xl font-black mt-1 font-mono ${
                    economicsData.netProfit >= 0 ? 'text-emerald-900' : 'text-rose-700'
                  }`}>
                    ₹{economicsData.netProfit.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Cost of Cultivation Breakdown Table */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-stone-900 text-sm">
                  {lang === 'kn' ? 'ವೆಚ್ಚದ ವರ್ಗೀಕರಣ (ಪ್ರತಿ ಎಕರೆಗೆ)' : 'Cost Breakdown per Acre:'}
                </h4>

                <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-stone-200/60">
                    <span className="text-stone-600">Certified Seed / Seedling Material:</span>
                    <span className="font-mono font-bold text-stone-900">₹{currentCrop.costBreakdown.seeds.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-200/60">
                    <span className="text-stone-600">Land Ploughing, Harrowing & Bed Preparation:</span>
                    <span className="font-mono font-bold text-stone-900">₹{currentCrop.costBreakdown.landPrep.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-200/60">
                    <span className="text-stone-600">NPK Fertilizers, FYM Compost & Micronutrients:</span>
                    <span className="font-mono font-bold text-stone-900">₹{currentCrop.costBreakdown.fertilizers.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-200/60">
                    <span className="text-stone-600">Plant Protection, Weedicides & Biocides:</span>
                    <span className="font-mono font-bold text-stone-900">₹{currentCrop.costBreakdown.pesticides.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-600">Intercultivation, Harvesting, Thrashing & Transport:</span>
                    <span className="font-mono font-bold text-stone-900">₹{currentCrop.costBreakdown.laborHarvest.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Direct Mandi Price check button */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-stone-500">
                  Want to sell your harvest directly to APMC buyers?
                </span>
                <button
                  onClick={() => onNavigateTab('mandi')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                >
                  View Live Mandi Prices →
                </button>
              </div>
            </div>
          )}

          {/* ================= 7. CERTIFIED SEED VARIETIES ================= */}
          {activeSubTab === 'varieties' && (
            <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
              <div>
                <h3 className="font-extrabold text-stone-900 text-lg font-heading">
                  {lang === 'kn' ? 'ಶಿಫಾರಸು ಮಾಡಿದ ಪ್ರಮಾಣೀಕೃತ ಪ್ರಭೇದಗಳು' : `Recommended Certified Varieties for ${currentCrop.name}`}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  High-yielding, university-tested seeds suited for Karnataka&apos;s climate conditions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {currentCrop.varieties.map((v, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2 hover:border-emerald-300 transition"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-stone-900 text-sm font-heading">
                        {v.name}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {v.duration}
                      </span>
                    </div>

                    <div className="text-xs text-stone-600">
                      <span className="font-semibold text-stone-800">Yield Potential: </span>
                      <span className="text-emerald-800 font-bold">{v.yield}</span>
                    </div>

                    <p className="text-[11px] text-stone-500 leading-relaxed bg-white p-2 rounded-lg border border-stone-200/80">
                      {v.specialty}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 8. ORGANIC & ZBNF REMEDIES ================= */}
          {activeSubTab === 'organic' && (
            <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
              <div>
                <h3 className="font-extrabold text-stone-900 text-lg font-heading">
                  {lang === 'kn' ? 'ಜೈವಿಕ & ನೈಸರ್ಗಿಕ ಕೃಷಿ ಪದ್ಧತಿಗಳು (ZBNF)' : 'Zero-Budget Natural & Organic Farming Formulations'}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Cost-effective organic pest controllers and bio-fertilizers you can prepare on your own farm.
                </p>
              </div>

              <div className="space-y-3">
                {currentCrop.organicRemedies.map((rem, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sprout className="w-4 h-4 text-emerald-700" />
                        <h4 className="font-bold text-stone-900 text-sm">
                          {rem.remedy}
                        </h4>
                      </div>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                        Organic IPM
                      </span>
                    </div>

                    <div className="text-xs text-stone-700 bg-white p-2.5 rounded-lg border border-emerald-100 leading-relaxed">
                      <span className="font-bold text-stone-900">How to Prepare & Apply: </span>
                      <span>{rem.recipe}</span>
                    </div>

                    <div className="text-[11px] text-emerald-800 font-medium">
                      🎯 <strong>Target Benefit: </strong> {rem.target}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Footer Utility Cards: Free SMS Alerts & AI Crop Doctor Scan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Quick SMS / WhatsApp Alerts Box */}
        <div className="bg-emerald-950 text-white rounded-2xl p-5 shadow-xs space-y-3 border border-emerald-900">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
            <Smartphone className="w-4 h-4" />
            <span>{lang === 'kn' ? 'ಉಚಿತ ಕೃಷಿ ಸಲಹೆ ಎಸ್ಎಂಎಸ್' : 'Free Stage-by-Stage SMS Alerts'}</span>
          </div>
          <p className="text-xs text-emerald-200/80 leading-relaxed">
            {lang === 'kn'
              ? 'ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ, ಗೊಬ್ಬರ ನೀಡಿಕೆ ಹಾಗೂ ಕೀಟ ಬಾಧೆಯ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಸರಿಯಾದ ದಿನಕ್ಕೆ ಪಡೆಯಿರಿ.'
              : 'Get critical fertigation and pest alerts sent to your phone on the exact day.'}
          </p>

          <form onSubmit={handleSubscribeSms} className="flex gap-2">
            <input
              type="tel"
              placeholder={lang === 'kn' ? '೧೦ ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' : 'Enter 10-digit phone number'}
              value={smsPhone}
              onChange={(e) => setSmsPhone(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-emerald-900/90 border border-emerald-700 text-white placeholder-emerald-400 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs transition shadow-sm shrink-0"
            >
              {smsSuccess
                ? (lang === 'kn' ? '✓ ನೋಂದಾಯಿಸಲಾಗಿದೆ!' : '✓ Subscribed!')
                : (lang === 'kn' ? 'ಚಂದಾದಾರರಾಗಿ' : 'Subscribe')}
            </button>
          </form>
        </div>

        {/* Link to AI Crop Doctor Camera Scan */}
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200/80 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs">
              <Stethoscope className="w-4 h-4 text-emerald-700" />
              <span>{lang === 'kn' ? 'ಬೆಳೆ ರೋಗ ತಪಾಸಣೆ ಬೇಕೇ?' : 'Spot an unknown leaf spot?'}</span>
            </div>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Upload a photo of your leaf or stem to AI Crop Doctor for instant diagnosis in Kannada and English.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('cropDoctor')}
            className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>{lang === 'kn' ? 'ಎಐ ಬೆಳೆ ವೈದ್ಯರೊಂದಿಗೆ ಪರೀಕ್ಷಿಸಿ →' : 'Scan with AI Crop Doctor →'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
