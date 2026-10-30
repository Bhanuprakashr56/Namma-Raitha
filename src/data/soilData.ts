import { SoilType, SoilHealthReport } from '../types/nammaraitha';

export interface SoilTestingLab {
  id: string;
  name: string;
  nameKn: string;
  district: string;
  location: string;
  contactPerson: string;
  phone: string;
  testingFee: number;
  sampleTurnaroundDays: number;
  govtAccredited: boolean;
}

export const SOIL_TYPES_INFO: Record<
  SoilType,
  {
    name: string;
    nameKn: string;
    description: string;
    descriptionKn: string;
    idealCrops: string[];
    idealCropsKn: string[];
    drainage: 'Good' | 'Moderate' | 'Poor';
    waterHoldingCapacity: 'High' | 'Medium' | 'Low';
    commonDeficiencies: string[];
  }
> = {
  red_sandy_loam: {
    name: 'Red Sandy Loam',
    nameKn: 'ಕೆಂಪು ಮರಳು ಗೋಡು ಮಣ್ಣು',
    description: 'Well-drained porous soil prevalent in Southern Karnataka (Mandya, Mysore, Tumkur, Bangalore). Low in nitrogen and phosphorus, rich in iron.',
    descriptionKn: 'ದಕ್ಷಿಣ ಕರ್ನಾಟಕದಲ್ಲಿ ಸಾಮಾನ್ಯವಾಗಿ ಕಂಡುಬರುವ ನೀರು ಬಸಿದುಹೋಗುವ ಮಣ್ಣು. ಸಾರಜನಕ ಮತ್ತು ರಂಜಕದ ಕೊರತೆಯಿದ್ದು, ಕಬ್ಬಿಣಾಂಶ ಹೆಚ್ಚಾಗಿರುತ್ತದೆ.',
    idealCrops: ['Ragi (Finger Millet)', 'Groundnut', 'Maize', 'Pulses', 'Mango'],
    idealCropsKn: ['ರಾಗಿ', 'ಕಡಲೆಕಾಯಿ', 'ಮೆಕ್ಕೆಜೋಳ', 'ದ್ವಿದಳ ಧಾನ್ಯಗಳು', 'ಮಾವಿನ ಗಿಡ'],
    drainage: 'Good',
    waterHoldingCapacity: 'Low',
    commonDeficiencies: ['Nitrogen (N)', 'Phosphorus (P)', 'Organic Carbon', 'Zinc'],
  },
  black_cotton: {
    name: 'Black Cotton / Vertisol',
    nameKn: 'ಕಪ್ಪು ಹತ್ತಿ ಮಣ್ಣು (ರೆಗೂರ್ ಮಣ್ಣು)',
    description: 'Deep clayey soil of Northern Karnataka (Dharwad, Belagavi, Raichur, Vijayapura). High moisture retention, swells when wet and cracks when dry.',
    descriptionKn: 'ಉತ್ತರ ಕರ್ನಾಟಕದ ಆಳವಾದ ಜೇಡಿ ಮಣ್ಣು. ತೇವಾಂಶ ಧಾರಣಾ ಶಕ್ತಿ ಅತ್ಯಧಿಕವಾಗಿದ್ದು, ಹತ್ತಿ ಮತ್ತು ತೊಗರಿಗೆ ಅತ್ಯಂತ ಸೂಕ್ತ.',
    idealCrops: ['Cotton', 'Sugarcane', 'Bengal Gram (Chana)', 'Jowar', 'Sunflower'],
    idealCropsKn: ['ಹತ್ತಿ', 'ಕಬ್ಬು', 'ಕಡಲೆ', 'ಜೋಳ', 'ಸೂರ್ಯಕಾಂತಿ'],
    drainage: 'Moderate',
    waterHoldingCapacity: 'High',
    commonDeficiencies: ['Nitrogen (N)', 'Phosphorus (P)', 'Zinc', 'Iron (Chlorosis)'],
  },
  laterite: {
    name: 'Laterite Soil',
    nameKn: 'ಲ್ಯಾಟರೈಟ್ / ಕೆಂಪು ಮುರಕಲ್ಲು ಮಣ್ಣು',
    description: 'Acidic, heavily leached soil of Coastal & Malnad regions (Shivamogga, Udupi, Uttara Kannada, Chikkamagaluru). Poor in lime and silica.',
    descriptionKn: 'ಮಲೆನಾಡು ಮತ್ತು ಕರಾವಳಿಯ ಆಮ್ಲೀಯ ಮಣ್ಣು. ಅಧಿಕ ಮಳೆಯಿಂದ ಪೋಷಕಾಂಶಗಳು ತೊಳೆದುಹೋಗಿರುತ್ತವೆ. ಸುಣ್ಣ ಮತ್ತು ಸಾವಯವ ಗೊಬ್ಬರ ಅಗತ್ಯ.',
    idealCrops: ['Arecanut', 'Coffee', 'Pepper', 'Cashew', 'Paddy'],
    idealCropsKn: ['ಅಡಿಕೆ', 'ಕಾಫಿ', 'ಕಾಳುಮೆಣಸು', 'ಗೋಡಂಬಿ', 'ಭತ್ತ'],
    drainage: 'Good',
    waterHoldingCapacity: 'Medium',
    commonDeficiencies: ['Lime (High Acidity pH < 5.5)', 'Boron', 'Magnesium', 'Phosphorus Fixation'],
  },
  coastal_alluvial: {
    name: 'Coastal Alluvial / Sandy',
    nameKn: 'ಕರಾವಳಿ ಮೆಕ್ಕಲು & ಮರಳು ಮಣ್ಣು',
    description: 'Deposited by rivers along the Arabian sea coast (Dakshina Kannada, Udupi). Coarse texture with rapid percolation.',
    descriptionKn: 'ಕರಾವಳಿ ನದಿ ಬಯಲಿನ ಮೆಕ್ಕಲು ಮಣ್ಣು. ತೆಂಗು ಮತ್ತು ಭತ್ತಕ್ಕೆ ಅನುಕೂಲಕರ, ಆದರೆ ಪೋಷಕಾಂಶಗಳ ನಿರಂತರ ಪೂರೈಕೆ ಅಗತ್ಯ.',
    idealCrops: ['Coconut', 'Paddy', 'Vegetables', 'Banana', 'Spices'],
    idealCropsKn: ['ತೆಂಗು', 'ಭತ್ತ', 'ತರಕಾರಿಗಳು', 'ಬಾಳೆ', 'ಸಾಂಬಾರ ಬೆಳೆಗಳು'],
    drainage: 'Good',
    waterHoldingCapacity: 'Low',
    commonDeficiencies: ['Potassium (K)', 'Boron', 'Organic Carbon', 'Salinity in estuaries'],
  },
  clay_loam: {
    name: 'Clay Loam',
    nameKn: 'ಜೇಡಿ ಮಿಶ್ರಿತ ಗೋಡು ಮಣ್ಣು',
    description: 'Fertile river basin soils of Cauvery and Krishna valleys. High cation exchange capacity and balanced nutrient absorption.',
    descriptionKn: 'ಕಾವೇರಿ ಮತ್ತು ಕೃಷ್ಣಾ ಕಣಿವೆಯ ಫಲವತ್ತಾದ ಮಣ್ಣು. ತೇವಾಂಶ ಮತ್ತು ಗೊಬ್ಬರಗಳನ್ನು ದೀರ್ಘಕಾಲ ಹಿಡಿದಿಟ್ಟುಕೊಳ್ಳುತ್ತದೆ.',
    idealCrops: ['Paddy', 'Sugarcane', 'Tomato', 'Banana', 'Wheat'],
    idealCropsKn: ['ಭತ್ತ', 'ಕಬ್ಬು', 'ಟೊಮೇಟೊ', 'ಬಾಳೆ', 'ಗೋಧಿ'],
    drainage: 'Moderate',
    waterHoldingCapacity: 'High',
    commonDeficiencies: ['Zinc', 'Sulfur', 'Organic Matter'],
  },
};

export const SAMPLE_SOIL_REPORTS: SoilHealthReport[] = [
  {
    id: 'SHC-KA-2026-081',
    farmerName: 'Basavaraj Gowda',
    surveyNumber: 'Sy. No. 44/2',
    village: 'Gejjalagere',
    district: 'Mandya',
    soilType: 'red_sandy_loam',
    targetCrop: 'Sugarcane',
    ph: 6.4,
    nitrogenKgHa: 195, // Low
    phosphorusKgHa: 18, // Medium
    potassiumKgHa: 260, // Medium
    organicCarbonPercent: 0.42, // Low
    electricalConductivity: 0.35, // Normal
    zincPpm: 0.45, // Deficient (<0.6 ppm)
    boronPpm: 0.52, // Normal
    overallScore: 68,
    healthGrade: 'B (Good)',
    amendments: [
      'Apply 5 tons of Farm Yard Manure (FYM) or 2 tons Vermicompost per acre before furrow opening.',
      'Sow Sunn hemp as green manure crop and incorporate at 45 days.',
      'Soil pH is slightly acidic (6.4); add 200 kg Agricultural Gypsum per acre to improve calcium availability.'
    ],
    fertilizerPrescription: [
      { fertilizer: 'Urea (46% N)', quantityPerAcre: '110 kg (split in 3 doses: 25% planting, 50% tillering, 25% earthing up)', timing: 'Split at 30, 60, 90 days' },
      { fertilizer: 'DAP (18:46:0)', quantityPerAcre: '55 kg (entire dose as basal)', timing: 'At planting along the furrow' },
      { fertilizer: 'Muriate of Potash (MOP 60% K)', quantityPerAcre: '40 kg (split in 2 equal doses)', timing: 'Basal and 60 days' },
      { fertilizer: 'Zinc Sulfate (21% Zn)', quantityPerAcre: '10 kg/acre basal application', timing: 'Once a year basal' }
    ],
    organicRemedies: [
      'Mix 2 kg Azospirillum and 2 kg Phosphobacteria with 100 kg FYM and apply near root zone.',
      'Neem cake 100 kg/acre to control root grubs and slow-release nitrogen naturally.',
      'Foliar spray of 19:19:19 + Micronutrient mixture at 45 days stage.'
    ],
    testedDate: '2026-09-15',
  },
  {
    id: 'SHC-KA-2026-104',
    farmerName: 'Mallikarjun Patil',
    surveyNumber: 'Sy. No. 112/A',
    village: 'Savadatti',
    district: 'Belagavi',
    soilType: 'black_cotton',
    targetCrop: 'Cotton',
    ph: 8.1, // Alkaline
    nitrogenKgHa: 160, // Low
    phosphorusKgHa: 12, // Low
    potassiumKgHa: 340, // High
    organicCarbonPercent: 0.38, // Low
    electricalConductivity: 1.15, // Moderately saline
    zincPpm: 0.38, // Deficient
    boronPpm: 0.32, // Deficient
    overallScore: 54,
    healthGrade: 'C (Deficient)',
    amendments: [
      'High alkalinity detected (pH 8.1). Apply 400 kg Agricultural Gypsum per acre to displace sodium.',
      'Avoid flood irrigation to prevent waterlogging and salinity buildup; adopt alternate furrow irrigation.',
      'Add 3 tons enriched compost with Trichoderma viride to improve microbial life.'
    ],
    fertilizerPrescription: [
      { fertilizer: 'Urea', quantityPerAcre: '65 kg split in 4 stages', timing: 'Vegetative to boll bursting' },
      { fertilizer: 'Single Super Phosphate (SSP 16% P)', quantityPerAcre: '120 kg (SSP preferred over DAP in alkaline soil)', timing: 'Basal dose' },
      { fertilizer: 'Zinc Sulfate', quantityPerAcre: '12 kg/acre', timing: 'Soil application at sowing' },
      { fertilizer: 'Solubor / Borax (0.1% spray)', quantityPerAcre: '250 g in 200L water foliar spray', timing: 'At square formation & flowering' }
    ],
    organicRemedies: [
      'Apply Jeevamrutha (200L/acre) every 15 days via drip or irrigation water.',
      'Mulching with cotton stalks or dry leaves to reduce soil moisture evaporation and salt crusting.'
    ],
    testedDate: '2026-09-28',
  },
  {
    id: 'SHC-KA-2026-219',
    farmerName: 'Suresh Hegde',
    surveyNumber: 'Sy. No. 89/1',
    village: 'Thirthahalli',
    district: 'Shivamogga',
    soilType: 'laterite',
    targetCrop: 'Arecanut',
    ph: 5.1, // Strongly Acidic
    nitrogenKgHa: 220, // Medium
    phosphorusKgHa: 10, // Very Low (fixed by iron/aluminum)
    potassiumKgHa: 210, // Medium
    organicCarbonPercent: 0.85, // Good
    electricalConductivity: 0.22, // Low
    zincPpm: 0.75, // Normal
    boronPpm: 0.25, // Deficient
    overallScore: 62,
    healthGrade: 'B (Good)',
    amendments: [
      'Acidic soil (pH 5.1) severely locks phosphorus. Apply 300 kg Agricultural Lime or Dolomite per acre in May before monsoon.',
      'Apply Rock Phosphate (Mussoorie Rock Phosphate 20%) instead of water-soluble DAP for sustained release in acidic soil.',
      'Mulch areca basin with green leaf manure (Glyricidia / Crotalaria).'
    ],
    fertilizerPrescription: [
      { fertilizer: 'Rock Phosphate', quantityPerAcre: '150 kg per acre', timing: 'Post-monsoon basin application' },
      { fertilizer: 'Muriate of Potash', quantityPerAcre: '80 kg per acre in two splits', timing: 'September and January' },
      { fertilizer: 'Borax (Disodium Octaborate)', quantityPerAcre: '5 kg per acre or 10g per palm', timing: 'Once a year to prevent nut cracking' },
      { fertilizer: 'Magnesium Sulfate', quantityPerAcre: '20 kg per acre', timing: 'To prevent golden leaf yellowing' }
    ],
    organicRemedies: [
      'Apply 10 kg well-decomposed cattle manure + 2 kg Neem cake per bearing areca palm annually.',
      'Inoculate soil with VAM (Vesicular Arbuscular Mycorrhizae) fungi to solubilize locked phosphorus.'
    ],
    testedDate: '2026-10-02',
  }
];

export const KARNATAKA_SOIL_LABS: SoilTestingLab[] = [
  {
    id: 'lab-1',
    name: 'District Soil Testing Laboratory, Mandya',
    nameKn: 'ಜಿಲ್ಲಾ ಮಣ್ಣು ಪರೀಕ್ಷಾ ಪ್ರಯೋಗಾಲಯ, ಮಂಡ್ಯ',
    district: 'Mandya',
    location: 'Near RMC Yard, Bandigowda Badavane, Mandya 571401',
    contactPerson: 'Dr. C. Shivakumar (Joint Director Agriculture)',
    phone: '08232-224150',
    testingFee: 25,
    sampleTurnaroundDays: 5,
    govtAccredited: true,
  },
  {
    id: 'lab-2',
    name: 'ICAR - Krishi Vigyan Kendra (KVK), VC Farm, Mandya',
    nameKn: 'ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರ (ಕೆವಿಕೆ), ವಿಸಿ ಫಾರಂ, ಮಂಡ್ಯ',
    district: 'Mandya',
    location: 'Zonal Agricultural Research Station, VC Farm, Mandya',
    contactPerson: 'Dr. N. Venkatesh (Soil Scientist)',
    phone: '+91 94498 66912',
    testingFee: 30,
    sampleTurnaroundDays: 4,
    govtAccredited: true,
  },
  {
    id: 'lab-3',
    name: 'UAS Soil & Plant Health Clinic, GKVK, Bengaluru',
    nameKn: 'ಕೃಷಿ ವಿಶ್ವವಿದ್ಯಾನಿಲಯ ಮಣ್ಣು & ಸಸ್ಯ ಆರೋಗ್ಯ ಕೇಂದ್ರ, ಜಿಕೆವಿಕೆ, ಬೆಂಗಳೂರು',
    district: 'Bengaluru Urban & Rural',
    location: 'University of Agricultural Sciences, Bellary Road, Bengaluru 560065',
    contactPerson: 'Dr. M. Krishnamurthy (Chief Analyst)',
    phone: '080-23330153',
    testingFee: 40,
    sampleTurnaroundDays: 3,
    govtAccredited: true,
  },
  {
    id: 'lab-4',
    name: 'District Soil Testing Lab, Shivamogga',
    nameKn: 'ಜಿಲ್ಲಾ ಮಣ್ಣು ಪರೀಕ್ಷಾ ಕೇಂದ್ರ, ಶಿವಮೊಗ್ಗ',
    district: 'Shivamogga',
    location: 'Agricultural Complex, Durgigudi, Shivamogga 577201',
    contactPerson: 'Smt. Geetha R. (Technical Officer)',
    phone: '08182-222845',
    testingFee: 25,
    sampleTurnaroundDays: 6,
    govtAccredited: true,
  },
  {
    id: 'lab-5',
    name: 'ICAR - KVK Soil Health Lab, Dharwad (UASD)',
    nameKn: 'ಕೆವಿಕೆ ಮಣ್ಣು ಆರೋಗ್ಯ ಪ್ರಯೋಗಾಲಯ, ಕೃಷಿ ವಿವಿ ಧಾರವಾಡ',
    district: 'Dharwad & Belagavi',
    location: 'Krishi Nagar, UAS Dharwad Campus, Dharwad 580005',
    contactPerson: 'Dr. B. K. Desai (Director of Research)',
    phone: '0836-2447494',
    testingFee: 30,
    sampleTurnaroundDays: 4,
    govtAccredited: true,
  },
  {
    id: 'lab-6',
    name: 'KVK Soil Testing Facility, Kandali, Hassan',
    nameKn: 'ಕೆವಿಕೆ ಮಣ್ಣು ಪರೀಕ್ಷಾ ಘಟಕ, ಕಂದಲಿ, ಹಾಸನ',
    district: 'Hassan',
    location: 'KVK Hassan, Kandali Post, Hassan 573217',
    contactPerson: 'Dr. Ramesh B. (Extension Agronomist)',
    phone: '+91 94484 55120',
    testingFee: 25,
    sampleTurnaroundDays: 5,
    govtAccredited: true,
  },
  {
    id: 'lab-7',
    name: 'District Soil Testing Lab, Kolar',
    nameKn: 'ಜಿಲ್ಲಾ ಮಣ್ಣು ಪರೀಕ್ಷಾ ಕೇಂದ್ರ, ಕೋಲಾರ',
    district: 'Kolar & Chikkaballapura',
    location: 'APMC Market Road, Kolar 563101',
    contactPerson: 'Sri Narayanaswamy (Soil Chemist)',
    phone: '08152-223410',
    testingFee: 25,
    sampleTurnaroundDays: 4,
    govtAccredited: true,
  }
];

export const CROP_NPK_REQUIREMENTS: Record<
  string,
  {
    n: number;
    p: number;
    k: number;
    idealPhMin: number;
    idealPhMax: number;
    organicCarbonIdeal: number;
    micronutrientsPriority: string[];
  }
> = {
  Paddy: { n: 100, p: 50, k: 50, idealPhMin: 5.5, idealPhMax: 6.8, organicCarbonIdeal: 0.75, micronutrientsPriority: ['Zinc', 'Silicon', 'Sulfur'] },
  Ragi: { n: 60, p: 30, k: 30, idealPhMin: 6.0, idealPhMax: 7.5, organicCarbonIdeal: 0.6, micronutrientsPriority: ['Zinc', 'Boron'] },
  Maize: { n: 120, p: 60, k: 40, idealPhMin: 5.8, idealPhMax: 7.2, organicCarbonIdeal: 0.7, micronutrientsPriority: ['Zinc', 'Iron'] },
  Sugarcane: { n: 250, p: 100, k: 125, idealPhMin: 6.5, idealPhMax: 7.8, organicCarbonIdeal: 0.8, micronutrientsPriority: ['Iron', 'Zinc', 'Magnesium'] },
  Cotton: { n: 120, p: 60, k: 60, idealPhMin: 6.5, idealPhMax: 8.0, organicCarbonIdeal: 0.65, micronutrientsPriority: ['Boron', 'Magnesium', 'Zinc'] },
  Tomato: { n: 150, p: 100, k: 120, idealPhMin: 6.0, idealPhMax: 7.0, organicCarbonIdeal: 0.85, micronutrientsPriority: ['Calcium', 'Boron', 'Zinc'] },
  Arecanut: { n: 100, p: 40, k: 140, idealPhMin: 5.5, idealPhMax: 6.5, organicCarbonIdeal: 0.8, micronutrientsPriority: ['Boron', 'Magnesium'] },
  Banana: { n: 200, p: 50, k: 300, idealPhMin: 6.0, idealPhMax: 7.5, organicCarbonIdeal: 0.8, micronutrientsPriority: ['Potassium', 'Zinc', 'Iron'] },
  'Tur Dal (Red Gram)': { n: 25, p: 50, k: 25, idealPhMin: 6.5, idealPhMax: 7.5, organicCarbonIdeal: 0.6, micronutrientsPriority: ['Sulfur', 'Zinc'] },
  Onion: { n: 100, p: 50, k: 50, idealPhMin: 6.0, idealPhMax: 7.0, organicCarbonIdeal: 0.7, micronutrientsPriority: ['Sulfur', 'Zinc'] },
};
