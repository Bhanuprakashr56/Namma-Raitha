import React, { useState, useMemo } from 'react';
import {
  Layers,
  FlaskConical,
  Award,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  PhoneCall,
  MapPin,
  Search,
  RefreshCw,
  Info,
  Calendar,
  Clock,
  Printer,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Building,
  Sliders,
  HelpCircle
} from 'lucide-react';
import { Language, SoilType, SoilHealthReport } from '../types/nammaraitha';
import {
  SOIL_TYPES_INFO,
  SAMPLE_SOIL_REPORTS,
  KARNATAKA_SOIL_LABS,
  CROP_NPK_REQUIREMENTS
} from '../data/soilData';
import { t } from '../utils/translations';

interface SoilHealthProps {
  lang: Language;
  onOpenAgriInputs?: () => void;
}

export const SoilHealth: React.FC<SoilHealthProps> = ({ lang, onOpenAgriInputs }) => {
  const [activeSubTab, setActiveSubTab] = useState<'calculator' | 'savedReports' | 'labs' | 'samplingGuide'>('calculator');

  // Interactive Soil Health Analyzer State
  const [selectedSoilType, setSelectedSoilType] = useState<SoilType>('red_sandy_loam');
  const [targetCrop, setTargetCrop] = useState<string>('Ragi');
  const [farmerName, setFarmerName] = useState('Naveen Gowda');
  const [village, setVillage] = useState('Pandavapura');
  const [district, setDistrict] = useState('Mandya');
  const [ph, setPh] = useState<number>(6.5);
  const [nitrogen, setNitrogen] = useState<number>(210); // kg/ha
  const [phosphorus, setPhosphorus] = useState<number>(18); // kg/ha
  const [potassium, setPotassium] = useState<number>(240); // kg/ha
  const [organicCarbon, setOrganicCarbon] = useState<number>(0.55); // %
  const [electricalConductivity, setElectricalConductivity] = useState<number>(0.4); // dS/m
  const [zincPpm, setZincPpm] = useState<number>(0.5); // ppm
  const [boronPpm, setBoronPpm] = useState<number>(0.45); // ppm

  // Labs search filter
  const [labSearch, setLabSearch] = useState('');
  const [selectedLabDistrict, setSelectedLabDistrict] = useState<string>('all');

  // Saved reports
  const [savedReports, setSavedReports] = useState<SoilHealthReport[]>(SAMPLE_SOIL_REPORTS);
  const [activeReportModal, setActiveReportModal] = useState<SoilHealthReport | null>(null);

  // Computed Soil Health Evaluation
  const currentEvaluation = useMemo(() => {
    const cropReq = CROP_NPK_REQUIREMENTS[targetCrop] || CROP_NPK_REQUIREMENTS.Ragi;

    // Calculate score
    let score = 70;

    // pH penalty/bonus
    if (ph >= cropReq.idealPhMin && ph <= cropReq.idealPhMax) {
      score += 10;
    } else if (ph < 5.5 || ph > 8.2) {
      score -= 15;
    } else {
      score -= 5;
    }

    // Nitrogen check (normal 250-500 kg/ha)
    if (nitrogen < 200) score -= 8;
    else if (nitrogen > 350) score += 5;

    // Phosphorus check (normal 20-50 kg/ha)
    if (phosphorus < 15) score -= 8;
    else if (phosphorus >= 25) score += 5;

    // Potassium check (normal 150-300 kg/ha)
    if (potassium < 140) score -= 6;
    else if (potassium >= 200) score += 5;

    // Organic Carbon check
    if (organicCarbon < 0.5) score -= 10;
    else if (organicCarbon >= 0.75) score += 10;

    // Zinc check (critical in Karnataka soils <0.6 ppm is deficient)
    if (zincPpm < 0.6) score -= 5;

    score = Math.max(25, Math.min(96, score));

    let grade: 'A (Optimal)' | 'B (Good)' | 'C (Deficient)' | 'D (Critical)' = 'B (Good)';
    if (score >= 82) grade = 'A (Optimal)';
    else if (score >= 65) grade = 'B (Good)';
    else if (score >= 48) grade = 'C (Deficient)';
    else grade = 'D (Critical)';

    // Generated Soil Amendments
    const amendments: string[] = [];
    if (ph < 5.8) {
      amendments.push(
        lang === 'kn'
          ? `ಮಣ್ಣು ಅತಿಯಾಗಿ ಆಮ್ಲೀಯವಾಗಿದೆ (pH ${ph}). ಎಕರೆಗೆ 250-300 ಕೆಜಿ ಕೃಷಿ ಸುಣ್ಣ (Agricultural Lime) ಅಥವಾ ಡಾಲೊಮೈಟ್ ಬೆರೆಸಿ.`
          : `Soil is strongly acidic (pH ${ph}). Broadcast 250-300 kg Agricultural Lime or Dolomite per acre 3 weeks prior to planting.`
      );
    } else if (ph > 7.8) {
      amendments.push(
        lang === 'kn'
          ? `ಮಣ್ಣು ಕ್ಷಾರೀಯವಾಗಿದೆ (pH ${ph}). ಸೋಡಿಯಂ ತಟಸ್ಥಗೊಳಿಸಲು ಎಕರೆಗೆ 350 ಕೆಜಿ ಕೃಷಿ ಜಿಪ್ಸಂ (Agricultural Gypsum) ಸೇರಿಸಿ.`
          : `High soil alkalinity (pH ${ph}). Apply 350 kg Agricultural Gypsum per acre to leach excess sodium and improve water infiltration.`
      );
    }

    if (organicCarbon < 0.55) {
      amendments.push(
        lang === 'kn'
          ? `ಸಾವಯವ ಇಂಗಾಲ ತೀರಾ ಕಡಿಮೆ (ಶೇ. ${organicCarbon}%). ಎಕರೆಗೆ 4-5 ಟನ್ ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರ (FYM) ಅಥವಾ 2 ಟನ್ ಎರೆಹುಳು ಗೊಬ್ಬರ ಸೇರಿಸಿ.`
          : `Low Organic Carbon (${organicCarbon}% vs recommended >0.75%). Incorporate 4-5 tons well-cured Farm Yard Manure (FYM) or 2 tons Vermicompost.`
      );
    }

    // Fertilizer Prescription
    const prescriptions = [
      {
        fertilizer: 'Urea (46% Nitrogen)',
        quantityPerAcre: nitrogen < 200 ? '70 kg in 3 split doses' : '50 kg in 2 split doses',
        timing: 'Basal at sowing + Tillering top dress + Panicle emergence',
      },
      {
        fertilizer: ph > 7.8 ? 'Single Super Phosphate (SSP 16% P)' : 'DAP (Di-Ammonium Phosphate 18:46:0)',
        quantityPerAcre: phosphorus < 20 ? '55 kg basal application' : '40 kg basal application',
        timing: '100% applied along furrows at sowing / transplanting',
      },
      {
        fertilizer: 'Muriate of Potash (MOP 60% K)',
        quantityPerAcre: potassium < 200 ? '45 kg per acre' : '30 kg per acre',
        timing: 'Split into 2 equal splits (sowing and 45 days)',
      },
    ];

    if (zincPpm < 0.6) {
      prescriptions.push({
        fertilizer: 'Zinc Sulfate (21% Zn)',
        quantityPerAcre: '10 kg per acre soil application',
        timing: 'Basal once per year (do not mix directly with DAP)',
      });
    }

    // Organic remedies
    const organicRemedies = [
      lang === 'kn'
        ? 'ಬೀಜೋಪಚಾರಕ್ಕಾಗಿ ಪ್ರತಿ ಕೆಜಿ ಬೀಜಕ್ಕೆ 25 ಗ್ರಾಂ ಅಜೋಟೋಬ್ಯಾಕ್ಟರ್ / ರೈಜೋಬಿಯಂ ಹಾಗೂ 5 ಗ್ರಾಂ ಟ್ರೈಕೋಡರ್ಮಾ ಬಳಸಿ.'
        : 'Inoculate seed with Azospirillum / Rhizobium (25g/kg seed) + Trichoderma viride to enhance nitrogen uptake by 20%.',
      lang === 'kn'
        ? 'ರಂಜಕ ಕರಗಿಸುವ ಜೈವಿಕ ಗೊಬ್ಬರ (PSB) 2 ಕೆಜಿ ಪ್ರಮಾಣವನ್ನು ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರದೊಂದಿಗೆ ಬೆರೆಸಿ ಮಣ್ಣಿಗೆ ನೀಡಿ.'
        : 'Apply Phosphate Solubilizing Bacteria (PSB) 2 kg/acre mixed in 100 kg compost to liberate locked phosphorus.',
      lang === 'kn'
        ? 'ಪ್ರತಿ 15 ದಿನಕ್ಕೊಮ್ಮೆ 200 ಲೀಟರ್ ಜೀವಾಮೃತವನ್ನು ಹನಿ ನೀರಾವರಿ ಅಥವಾ ಕಾಲುವೆ ನೀರಿನೊಂದಿಗೆ ಹರಿಸಿ.'
        : 'Drench soil with 200 Litres Jeevamrutha per acre every 15-20 days to stimulate beneficial mycorrhizal earthworm microflora.',
    ];

    return {
      score,
      grade,
      amendments,
      prescriptions,
      organicRemedies,
      phStatus:
        ph < 6.0
          ? { text: lang === 'kn' ? 'ಆಮ್ಲೀಯ' : 'Acidic', color: 'text-amber-700 bg-amber-50' }
          : ph > 7.5
          ? { text: lang === 'kn' ? 'ಕ್ಷಾರೀಯ' : 'Alkaline', color: 'text-purple-700 bg-purple-50' }
          : { text: lang === 'kn' ? 'ಆದರ್ಶ ತಟಸ್ಥ' : 'Ideal Neutral', color: 'text-emerald-700 bg-emerald-50' },
      nitrogenStatus: nitrogen < 200 ? (lang === 'kn' ? 'ಕಡಿಮೆ' : 'Low') : nitrogen > 350 ? (lang === 'kn' ? 'ಹೆಚ್ಚು' : 'High') : (lang === 'kn' ? 'ಸಾಧಾರಣ' : 'Medium'),
      phosphorusStatus: phosphorus < 15 ? (lang === 'kn' ? 'ಕಡಿಮೆ' : 'Low') : phosphorus > 30 ? (lang === 'kn' ? 'ಹೆಚ್ಚು' : 'High') : (lang === 'kn' ? 'ಸಾಧಾರಣ' : 'Medium'),
      potassiumStatus: potassium < 150 ? (lang === 'kn' ? 'ಕಡಿಮೆ' : 'Low') : potassium > 280 ? (lang === 'kn' ? 'ಹೆಚ್ಚು' : 'High') : (lang === 'kn' ? 'ಸಾಧಾರಣ' : 'Medium'),
      carbonStatus: organicCarbon < 0.5 ? (lang === 'kn' ? 'ಕೊರತೆ' : 'Deficient') : organicCarbon > 0.75 ? (lang === 'kn' ? 'ಉತ್ತಮ' : 'Optimal') : (lang === 'kn' ? 'ಸಾಧಾರಣ' : 'Moderate'),
      zincStatus: zincPpm < 0.6 ? (lang === 'kn' ? 'ಕೊರತೆ (<0.6 ppm)' : 'Deficient (<0.6 ppm)') : (lang === 'kn' ? 'ಸಾಕಷ್ಟು (>0.6 ppm)' : 'Sufficient (>0.6 ppm)'),
    };
  }, [selectedSoilType, targetCrop, ph, nitrogen, phosphorus, potassium, organicCarbon, zincPpm, lang]);

  // Filtered labs
  const filteredLabs = useMemo(() => {
    return KARNATAKA_SOIL_LABS.filter((lab) => {
      const matchSearch =
        lab.name.toLowerCase().includes(labSearch.toLowerCase()) ||
        lab.nameKn.includes(labSearch) ||
        lab.district.toLowerCase().includes(labSearch.toLowerCase()) ||
        lab.location.toLowerCase().includes(labSearch.toLowerCase());
      const matchDistrict = selectedLabDistrict === 'all' || lab.district.toLowerCase().includes(selectedLabDistrict.toLowerCase());
      return matchSearch && matchDistrict;
    });
  }, [labSearch, selectedLabDistrict]);

  const handleSaveCurrentReport = () => {
    const newReport: SoilHealthReport = {
      id: `SHC-KA-${Date.now().toString().slice(-4)}`,
      farmerName,
      surveyNumber: 'Sy. No. 12/B',
      village,
      district,
      soilType: selectedSoilType,
      targetCrop,
      ph,
      nitrogenKgHa: nitrogen,
      phosphorusKgHa: phosphorus,
      potassiumKgHa: potassium,
      organicCarbonPercent: organicCarbon,
      electricalConductivity,
      zincPpm,
      boronPpm,
      overallScore: currentEvaluation.score,
      healthGrade: currentEvaluation.grade,
      amendments: currentEvaluation.amendments,
      fertilizerPrescription: currentEvaluation.prescriptions,
      organicRemedies: currentEvaluation.organicRemedies,
      testedDate: new Date().toISOString().split('T')[0],
    };
    setSavedReports([newReport, ...savedReports]);
    setActiveReportModal(newReport);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <FlaskConical className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur border border-emerald-400/20">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>{lang === 'kn' ? 'ಮಣ್ಣು ಆರೋಗ್ಯ ಪರೀಕ್ಷೆ & ಸಲಹಾ ಕೇಂದ್ರ' : 'Soil Health Advisory & Diagnostic Center'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading">
            {lang === 'kn' ? 'ಮಣ್ಣು ಪರೀಕ್ಷೆ ಮತ್ತು ರಸಗೊಬ್ಬರ ಶಿಫಾರಸು' : 'Soil Health Advice & Fertilizer Prescriptions'}
          </h1>

          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
            {lang === 'kn'
              ? 'ನಿಮ್ಮ ಹೊಲದ ಮಣ್ಣಿನ ಪ್ರಕಾರ, pH ಮೌಲ್ಯ, N-P-K ಪೋಷಕಾಂಶಗಳ ಮಟ್ಟವನ್ನು ಆಧರಿಸಿ ನಿಖರ ರಸಗೊಬ್ಬರ ಡೋಸೇಜ್ ಮತ್ತು ಸುಣ್ಣ/ಜಿಪ್ಸಂ ಸುಧಾರಣಾ ಕ್ರಮಗಳನ್ನು ಪಡೆಯಿರಿ.'
              : 'Assess your farm soil health, calculate customized N-P-K fertilizer schedules, identify nutrient deficiencies, and find accredited soil testing labs.'}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => setActiveSubTab('calculator')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeSubTab === 'calculator'
                  ? 'bg-amber-400 text-emerald-950 shadow-md'
                  : 'bg-emerald-950/60 hover:bg-emerald-700 text-white border border-emerald-700/50'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>{lang === 'kn' ? 'ಮಣ್ಣು ಪರೀಕ್ಷಾ ಕ್ಯಾಲ್ಕುಲೇಟರ್' : 'Soil Health Analyzer'}</span>
            </button>

            <button
              onClick={() => setActiveSubTab('savedReports')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeSubTab === 'savedReports'
                  ? 'bg-amber-400 text-emerald-950 shadow-md'
                  : 'bg-emerald-950/60 hover:bg-emerald-700 text-white border border-emerald-700/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{lang === 'kn' ? 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್‌ಗಳು' : 'Soil Health Cards'} ({savedReports.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('labs')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeSubTab === 'labs'
                  ? 'bg-amber-400 text-emerald-950 shadow-md'
                  : 'bg-emerald-950/60 hover:bg-emerald-700 text-white border border-emerald-700/50'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>{lang === 'kn' ? 'ಕರ್ನಾಟಕ ಮಣ್ಣು ಪರೀಕ್ಷಾ ಕೇಂದ್ರಗಳು' : 'Soil Testing Labs'}</span>
            </button>

            <button
              onClick={() => setActiveSubTab('samplingGuide')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeSubTab === 'samplingGuide'
                  ? 'bg-amber-400 text-emerald-950 shadow-md'
                  : 'bg-emerald-950/60 hover:bg-emerald-700 text-white border border-emerald-700/50'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>{lang === 'kn' ? 'ಮಾದರಿ ಸಂಗ್ರಹಣೆ ಹೇಗೆ?' : 'How to Sample Soil?'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: Interactive Soil Health Analyzer */}
      {activeSubTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Soil Parameters Controls */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h2 className="font-bold text-stone-900 text-lg flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-emerald-700" />
                  <span>{lang === 'kn' ? 'ಮಣ್ಣಿನ ವಿವರ ದಾಖಲಿಸಿ' : 'Input Soil Test Data'}</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  {lang === 'kn' ? 'ನಿಮ್ಮ ಮಣ್ಣು ಪರೀಕ್ಷಾ ವರದಿಯ ಅಂಕಿ-ಅಂಶಗಳನ್ನು ನಮೂದಿಸಿ' : 'Enter values from your soil test card or lab report'}
                </p>
              </div>
              <button
                onClick={() => {
                  setPh(6.5);
                  setNitrogen(210);
                  setPhosphorus(18);
                  setPotassium(240);
                  setOrganicCarbon(0.55);
                  setZincPpm(0.5);
                }}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                title="Reset to default benchmark"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{lang === 'kn' ? 'ಮರುಹೊಂದಿಸಿ' : 'Reset'}</span>
              </button>
            </div>

            {/* Farmer & Location details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  {lang === 'kn' ? 'ರೈತರ ಹೆಸರು' : 'Farmer Name'}
                </label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  {lang === 'kn' ? 'ಜಿಲ್ಲೆ / ತಾಲ್ಲೂಕು' : 'District'}
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none text-xs bg-white"
                >
                  <option value="Mandya">Mandya (ಮಂಡ್ಯ)</option>
                  <option value="Mysuru">Mysuru (ಮೈಸೂರು)</option>
                  <option value="Shivamogga">Shivamogga (ಶಿವಮೊಗ್ಗ)</option>
                  <option value="Belagavi">Belagavi (ಬೆಳಗಾವಿ)</option>
                  <option value="Dharwad">Dharwad (ಧಾರವಾಡ)</option>
                  <option value="Kolar">Kolar (ಕೋಲಾರ)</option>
                  <option value="Hassan">Hassan (ಹಾಸನ)</option>
                  <option value="Tumakuru">Tumakuru (ತುಮಕೂರು)</option>
                  <option value="Udupi">Udupi (ಉಡುಪಿ)</option>
                </select>
              </div>
            </div>

            {/* Soil Type Selection */}
            <div>
              <label className="font-semibold text-stone-800 text-xs block mb-2">
                {lang === 'kn' ? 'ಮಣ್ಣಿನ ಪ್ರಕಾರ (Soil Type)' : 'Soil Type Classification'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(Object.keys(SOIL_TYPES_INFO) as SoilType[]).map((type) => {
                  const info = SOIL_TYPES_INFO[type];
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedSoilType(type)}
                      className={`p-2.5 rounded-xl text-left border text-xs transition ${
                        selectedSoilType === type
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold shadow-sm ring-1 ring-emerald-600'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-stone-50/50'
                      }`}
                    >
                      <div className="font-bold line-clamp-1">{info.name.split('(')[0]}</div>
                      <div className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">{info.nameKn}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Crop Selection */}
            <div>
              <label className="font-semibold text-stone-800 text-xs block mb-1">
                {lang === 'kn' ? 'ಮುಖ್ಯ ಬೆಳೆ (Target Crop)' : 'Target Crop for Fertilizer Prescription'}
              </label>
              <select
                value={targetCrop}
                onChange={(e) => setTargetCrop(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 text-xs bg-white font-medium focus:ring-2 focus:ring-emerald-600 outline-none"
              >
                {Object.keys(CROP_NPK_REQUIREMENTS).map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </div>

            {/* pH Slider */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800">
                  {lang === 'kn' ? 'ಮಣ್ಣಿನ ಸಾಮರ್ಥ್ಯ (pH ಮೌಲ್ಯ)' : 'Soil Reaction (pH Value)'}
                </span>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-emerald-800 text-white">
                  pH {ph.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="4.5"
                max="9.0"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(parseFloat(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-medium">
                <span>4.5 (ಅತ್ಯಂತ ಆಮ್ಲೀಯ / Acidic)</span>
                <span>7.0 (ತಟಸ್ಥ / Neutral)</span>
                <span>9.0 (ಕ್ಷಾರೀಯ / Alkaline)</span>
              </div>
            </div>

            {/* N-P-K Nutrients */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-stone-800 block">
                {lang === 'kn' ? 'ಪ್ರಮುಖ ಪೋಷಕಾಂಶಗಳ ಮಟ್ಟ (kg/ha)' : 'Primary Nutrients (kg/hectare)'}
              </span>

              {/* Nitrogen */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-600 font-medium">{lang === 'kn' ? 'ಸಾರಜನಕ (Nitrogen - N)' : 'Available Nitrogen (N)'}</span>
                  <span className="font-bold text-stone-800">{nitrogen} kg/ha</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="450"
                  step="10"
                  value={nitrogen}
                  onChange={(e) => setNitrogen(parseInt(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
              </div>

              {/* Phosphorus */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-600 font-medium">{lang === 'kn' ? 'ರಂಜಕ (Phosphorus - P)' : 'Available Phosphorus (P)'}</span>
                  <span className="font-bold text-stone-800">{phosphorus} kg/ha</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="1"
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(parseInt(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
              </div>

              {/* Potassium */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-600 font-medium">{lang === 'kn' ? 'ಪೊಟ್ಯಾಷ್ (Potassium - K)' : 'Available Potassium (K)'}</span>
                  <span className="font-bold text-stone-800">{potassium} kg/ha</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="400"
                  step="10"
                  value={potassium}
                  onChange={(e) => setPotassium(parseInt(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
              </div>
            </div>

            {/* Organic Carbon & Zinc */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-stone-600 font-medium">{lang === 'kn' ? 'ಸಾವಯವ ಇಂಗಾಲ' : 'Organic Carbon'}</span>
                  <span className="font-bold text-stone-800">{organicCarbon}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.2"
                  step="0.05"
                  value={organicCarbon}
                  onChange={(e) => setOrganicCarbon(parseFloat(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-stone-600 font-medium">{lang === 'kn' ? 'ಸತು (Zinc - Zn)' : 'Zinc (ppm)'}</span>
                  <span className="font-bold text-stone-800">{zincPpm} ppm</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.2"
                  step="0.05"
                  value={zincPpm}
                  onChange={(e) => setZincPpm(parseFloat(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={handleSaveCurrentReport}
              className="w-full py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>{lang === 'kn' ? 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ರಚಿಸಿ & ಮುದ್ರಿಸಿ' : 'Generate Soil Health Card'}</span>
            </button>
          </div>

          {/* Right Column: Live Diagnostic Report & Prescription */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Score & Health Grade Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100">
                <div>
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span className="font-bold text-stone-800">{farmerName}</span>
                    <span>•</span>
                    <span>{village}, {district}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">{targetCrop}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-heading mt-1">
                    {lang === 'kn' ? 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ ವಿಶ್ಲೇಷಣೆ' : 'Soil Fertility Assessment'}
                  </h3>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                      {lang === 'kn' ? 'ಆರೋಗ್ಯ ಸ್ಕೋರ್' : 'Health Index'}
                    </div>
                    <div className="text-2xl font-black text-emerald-800">{currentEvaluation.score}/100</div>
                  </div>
                  <div className="px-3 py-2 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-extrabold text-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>{currentEvaluation.grade}</span>
                  </div>
                </div>
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <div className="text-stone-400 text-[10px] uppercase font-bold">{lang === 'kn' ? 'pH ಸ್ಥಿತಿ' : 'pH Status'}</div>
                  <div className="font-extrabold text-stone-800 mt-1">{ph.toFixed(1)}</div>
                  <div className="text-[10px] mt-0.5 text-emerald-700 font-semibold">{currentEvaluation.phStatus.text}</div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <div className="text-stone-400 text-[10px] uppercase font-bold">{lang === 'kn' ? 'ಸಾರಜನಕ (N)' : 'Nitrogen (N)'}</div>
                  <div className="font-extrabold text-stone-800 mt-1">{nitrogen} kg/ha</div>
                  <div className="text-[10px] mt-0.5 text-stone-600 font-semibold">{currentEvaluation.nitrogenStatus}</div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <div className="text-stone-400 text-[10px] uppercase font-bold">{lang === 'kn' ? 'ರಂಜಕ (P)' : 'Phosphorus (P)'}</div>
                  <div className="font-extrabold text-stone-800 mt-1">{phosphorus} kg/ha</div>
                  <div className="text-[10px] mt-0.5 text-stone-600 font-semibold">{currentEvaluation.phosphorusStatus}</div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <div className="text-stone-400 text-[10px] uppercase font-bold">{lang === 'kn' ? 'ಸಾವಯವ ಇಂಗಾಲ' : 'Organic Carbon'}</div>
                  <div className="font-extrabold text-stone-800 mt-1">{organicCarbon}%</div>
                  <div className="text-[10px] mt-0.5 text-stone-600 font-semibold">{currentEvaluation.carbonStatus}</div>
                </div>
              </div>

              {/* Soil Amendments Box */}
              {currentEvaluation.amendments.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>{lang === 'kn' ? 'ಮಣ್ಣು ಸುಧಾರಣಾ ಕ್ರಮಗಳು (Amendments Required)' : 'Essential Soil Amendments'}</span>
                  </div>
                  <ul className="space-y-1.5 pl-6 list-disc text-xs text-amber-900/90 leading-relaxed">
                    {currentEvaluation.amendments.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Exact Fertilizer Prescription Table */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-emerald-700" />
                    <span>
                      {lang === 'kn'
                        ? `${targetCrop} ಬೆಳೆಗೆ ನಿಖರ ರಸಗೊಬ್ಬರ ಡೋಸೇಜ್ (ಎಕರೆಗೆ)`
                        : `Fertilizer Prescription for ${targetCrop} (Per Acre)`}
                    </span>
                  </h4>
                  {onOpenAgriInputs && (
                    <button
                      onClick={onOpenAgriInputs}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                    >
                      <span>{lang === 'kn' ? 'ಗೊಬ್ಬರ ಆರ್ಡರ್ ಮಾಡಿ' : 'Order Fertilizers'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="divide-y divide-stone-100 rounded-2xl border border-stone-200 overflow-hidden text-xs">
                  {currentEvaluation.prescriptions.map((dose, idx) => (
                    <div key={idx} className="p-3 bg-white hover:bg-stone-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-stone-900">{dose.fertilizer}</div>
                        <div className="text-[11px] text-stone-500 mt-0.5">{dose.timing}</div>
                      </div>
                      <div className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200/60 self-start sm:self-auto shrink-0">
                        {dose.quantityPerAcre}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organic Remedies */}
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-stone-900 text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'kn' ? 'ಜೈವಿಕ & ಸಾವಯವ ಪೂರಕಗಳು' : 'Bio-fertilizers & Microbe Inoculants'}</span>
                </h4>
                <div className="space-y-2">
                  {currentEvaluation.organicRemedies.map((remedy, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs text-stone-700 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{remedy}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Saved Soil Health Cards */}
      {activeSubTab === 'savedReports' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-heading">
                {lang === 'kn' ? 'ಉಳಿಸಲಾದ ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್‌ಗಳು' : 'Saved Soil Health Cards'}
              </h2>
              <p className="text-xs text-stone-500">
                {lang === 'kn' ? 'ನಿಮ್ಮ ಮತ್ತು ನೆರೆಹೊರೆಯ ರೈತರ ಮಣ್ಣು ಪರೀಕ್ಷಾ ವರದಿಗಳು' : 'Official digital Soil Health Cards (SHC) with complete nutrient profiles'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedReports.map((report) => (
              <div
                key={report.id}
                onClick={() => setActiveReportModal(report)}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                      {report.id}
                    </span>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {report.healthGrade}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-stone-900 text-base group-hover:text-emerald-700 transition">
                      {report.farmerName}
                    </h3>
                    <div className="text-xs text-stone-500 mt-0.5">
                      {report.village}, {report.district} • {report.surveyNumber || 'Farm Area'}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-stone-50 text-center text-xs">
                    <div>
                      <div className="text-[10px] text-stone-400 font-medium">pH</div>
                      <div className="font-bold text-stone-800">{report.ph.toFixed(1)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-400 font-medium">Crop</div>
                      <div className="font-bold text-emerald-800 line-clamp-1">{report.targetCrop}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-400 font-medium">Score</div>
                      <div className="font-bold text-stone-800">{report.overallScore}/100</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-400 text-[11px]">{report.testedDate}</span>
                  <span className="font-bold text-emerald-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>{lang === 'kn' ? 'ಕಾರ್ಡ್ ವೀಕ್ಷಿಸಿ' : 'View Card'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Accredited Soil Testing Labs Directory */}
      {activeSubTab === 'labs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-heading">
                {lang === 'kn' ? 'ಕರ್ನಾಟಕ ಮಣ್ಣು ಪರೀಕ್ಷಾ ಕೇಂದ್ರಗಳ ಡೈರೆಕ್ಟರಿ' : 'Accredited Soil Testing Laboratories'}
              </h2>
              <p className="text-xs text-stone-500">
                {lang === 'kn'
                  ? 'ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರ (KVK) ಹಾಗೂ ಕೃಷಿ ಇಲಾಖೆಯ ಅಧಿಕೃತ ಪರೀಕ್ಷಾ ಕೇಂದ್ರಗಳು'
                  : 'Govt-recognized soil testing labs with contact numbers, testing fee (₹25-₹40), and sample pickup'}
              </p>
            </div>

            {/* Filter inputs */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder={lang === 'kn' ? 'ಕೇಂದ್ರ ಅಥವಾ ಜಿಲ್ಲೆ ಹುಡುಕಿ...' : 'Search lab or district...'}
                  value={labSearch}
                  onChange={(e) => setLabSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-700 outline-none w-48 sm:w-60 bg-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLabs.map((lab) => (
              <div
                key={lab.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      ✓ Govt. Accredited
                    </span>
                    <span className="text-xs font-extrabold text-stone-700">
                      Fee: ₹{lab.testingFee}
                    </span>
                  </div>

                  <h3 className="font-bold text-stone-900 text-sm leading-snug">
                    {lang === 'kn' ? lab.nameKn : lab.name}
                  </h3>

                  <div className="text-xs text-stone-500 space-y-1">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                      <span>{lab.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>Turnaround: {lab.sampleTurnaroundDays} days</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="text-xs">
                    <div className="text-[10px] text-stone-400 font-semibold">Contact</div>
                    <div className="font-bold text-stone-800">{lab.contactPerson}</div>
                  </div>

                  <a
                    href={`tel:${lab.phone}`}
                    className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 transition"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Call Lab</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Visual Soil Sampling Guide */}
      {activeSubTab === 'samplingGuide' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-heading">
              {lang === 'kn' ? 'ಹೊಲದಲ್ಲಿ ಮಣ್ಣಿನ ಮಾದರಿ ಸಂಗ್ರಹಿಸುವ ಸರಿಯಾದ ವಿಧಾನ' : 'How to Collect Soil Samples from Your Field'}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {lang === 'kn'
                ? 'ಸರಿಯಾದ ಮಣ್ಣು ಮಾದರಿ ಸಂಗ್ರಹಣೆ ಮಾಡಿದರೆ ಮಾತ್ರ ನಿಖರ ಪರೀಕ್ಷಾ ಫಲಿತಾಂಶ ದೊರೆಯುತ್ತದೆ. ಈ 5 ಹಂತಗಳನ್ನು ಪಾಲಿಸಿ.'
                : 'Follow these 5 scientific steps recommended by UAS Bengaluru and KVK scientists.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-black text-sm flex items-center justify-center">
                1
              </div>
              <h3 className="font-bold text-stone-900 text-xs">
                {lang === 'kn' ? 'ಜಮೀನಿನ ಆಯ್ಕೆ (Zig-Zag Pattern)' : 'Zig-Zag Sampling'}
              </h3>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {lang === 'kn'
                  ? 'ಒಂದು ಎಕರೆಯಲ್ಲಿ ಕನಿಷ್ಠ 8 ರಿಂದ 10 ಸ್ಥಳಗಳನ್ನು ಜಿಗ್-ಜಾಗ್ ಆಕಾರದಲ್ಲಿ ಗುರುತಿಸಿಕೊಳ್ಳಿ. ಮರದ ಕೆಳಗೆ ಅಥವಾ ಬದುವಿನ ಮಣ್ಣು ಬೇಡ.'
                  : 'Select 8-10 random spots in a zig-zag line across 1 acre. Avoid spots under trees, field bunds, or compost heaps.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-black text-sm flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-stone-900 text-xs">
                {lang === 'kn' ? "'V' ಆಕಾರದ ಗುಂಡಿ (V-Shaped Cut)" : 'V-Shaped Cut'}
              </h3>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {lang === 'kn'
                  ? 'ಮೇಲ್ಮೈ ಕಸ ತೆಗೆದು, ಸಲಕೆಯಿಂದ 15 ಸೆಂ.ಮೀ (6 ಇಂಚು) ಆಳದ "V" ಆಕಾರದ ಗುಂಡಿ ತೋಡಿ.'
                  : 'Clear surface weed/litter. Dig a V-shaped pit to 15 cm (6 inches) depth for field crops or 30 cm for horticulture.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-black text-sm flex items-center justify-center">
                3
              </div>
              <h3 className="font-bold text-stone-900 text-xs">
                {lang === 'kn' ? 'ಪದರದ ಮಣ್ಣು ಕೆರೆಯಿರಿ' : 'Collect Uniform Slice'}
              </h3>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {lang === 'kn'
                  ? 'ಗುಂಡಿಯ ಪಕ್ಕದ ಅಂಚಿನಿಂದ ಮೇಲಿನಿಂದ ಕೆಳವರೆಗೆ 1 ಇಂಚು ದಪ್ಪದ ಸಮಾನ ಮಣ್ಣಿನ ಪದರವನ್ನು ಕೆರೆದು ಶುದ್ಧ ಬುಟ್ಟಿಯಲ್ಲಿ ಸಂಗ್ರಹಿಸಿ.'
                  : 'Scrape a uniform 1-inch thick slice from top to bottom along the exposed V-wall into a clean plastic tray.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-black text-sm flex items-center justify-center">
                4
              </div>
              <h3 className="font-bold text-stone-900 text-xs">
                {lang === 'kn' ? 'ಮಿಶ್ರಣ & ಕಾಲು ಭಾಗ ವಿಧಾನ' : 'Quartering Method'}
              </h3>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {lang === 'kn'
                  ? 'ಎಲ್ಲಾ 10 ಸ್ಥಳಗಳ ಮಣ್ಣನ್ನು ಚೆನ್ನಾಗಿ ಬೆರೆಸಿ ವೃತ್ತಾಕಾರವಾಗಿ ಹರಡಿ. 4 ಭಾಗ ಮಾಡಿ, ಎದುರು-ಬದುರಿನ 2 ಭಾಗ ತೆಗೆದು 500 ಗ್ರಾಂ ಉಳಿಸಿಕೊಳ್ಳಿ.'
                  : 'Mix all composite soil thoroughly. Spread circular on clean paper, divide into 4 quarters, discard opposite two until 500g remains.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-black text-sm flex items-center justify-center">
                5
              </div>
              <h3 className="font-bold text-stone-900 text-xs">
                {lang === 'kn' ? 'ನೆರಳಿನಲ್ಲಿ ಒಣಗಿಸಿ ಚೀಲಕ್ಕೆ ತುಂಬಿ' : 'Dry & Label Bag'}
              </h3>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {lang === 'kn'
                  ? 'ನೆರಳಿನಲ್ಲಿ ಒಣಗಿಸಿ, ರೈತರ ಹೆಸರು, ಸರ್ವೆ ನಂ, ಹಿಂದಿನ ಬೆಳೆ ನಮೂದಿಸಿ ಬಟ್ಟೆ ಅಥವಾ ಪಾಲಿಥಿನ್ ಚೀಲದಲ್ಲಿ ಪ್ರಯೋಗಾಲಯಕ್ಕೆ ಸಲ್ಲಿಸಿ.'
                  : 'Shade dry sample. Place in clean cloth bag with farmer name, survey number, phone and intended next crop.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {activeReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Govt of Karnataka • Soil Health Card
                </span>
                <h3 className="text-xl font-bold text-stone-900 mt-1 font-heading">
                  {activeReportModal.farmerName} - {activeReportModal.targetCrop}
                </h3>
                <div className="text-xs text-stone-500">
                  {activeReportModal.village}, {activeReportModal.district} • {activeReportModal.surveyNumber}
                </div>
              </div>
              <button
                onClick={() => setActiveReportModal(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Test Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-stone-50">
                <div className="text-stone-400 text-[10px]">pH Value</div>
                <div className="font-extrabold text-stone-900 text-base">{activeReportModal.ph.toFixed(1)}</div>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50">
                <div className="text-stone-400 text-[10px]">Health Grade</div>
                <div className="font-extrabold text-emerald-800 text-base">{activeReportModal.healthGrade}</div>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50">
                <div className="text-stone-400 text-[10px]">Nitrogen (N)</div>
                <div className="font-extrabold text-stone-900 text-base">{activeReportModal.nitrogenKgHa} kg/ha</div>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50">
                <div className="text-stone-400 text-[10px]">Phosphorus (P)</div>
                <div className="font-extrabold text-stone-900 text-base">{activeReportModal.phosphorusKgHa} kg/ha</div>
              </div>
            </div>

            {/* Prescription */}
            <div className="space-y-2">
              <div className="font-bold text-stone-900 text-xs">Fertilizer Schedule (Per Acre):</div>
              <div className="space-y-2">
                {activeReportModal.fertilizerPrescription.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-stone-800">{item.fertilizer}</div>
                      <div className="text-[11px] text-stone-500">{item.timing}</div>
                    </div>
                    <div className="font-bold text-emerald-800 shrink-0">{item.quantityPerAcre}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Print Action */}
            <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>
              <button
                onClick={() => setActiveReportModal(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
