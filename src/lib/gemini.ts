import { GoogleGenAI, Type } from '@google/genai';
import { CropDiagnosis } from '../types/nammaraitha';

/**
 * Shared Gemini client utility initialized on the server side.
 * User-Agent header is set to 'aistudio-build' as required.
 */
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface GeminiDiagnosisRequest {
  image: string; // base64 or data URL
  mimeType?: string;
  cropTypeHint?: string;
  symptomsHint?: string;
  lang?: string;
}

export interface GeminiDiagnosisResponse {
  success: boolean;
  diagnosis?: CropDiagnosis;
  error?: string;
  isPlantOrCrop?: boolean;
}

/**
 * Analyzes an uploaded crop/leaf image using Gemini 3.8 Flash multimodal vision.
 * Accurately detects crop species, visible lesions, diseases/pests, severity,
 * and provides safe organic & chemical prescriptions.
 */
export async function diagnoseCropWithGemini(
  req: GeminiDiagnosisRequest
): Promise<GeminiDiagnosisResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      error:
        'Gemini API key is not configured. Please ensure GEMINI_API_KEY is set in your environment.',
    };
  }

  try {
    let base64Data = req.image;
    let mimeType = req.mimeType || 'image/jpeg';

    // Parse data URL if passed (e.g. "data:image/png;base64,...")
    if (base64Data.startsWith('data:')) {
      const commaIndex = base64Data.indexOf(',');
      if (commaIndex !== -1) {
        const meta = base64Data.substring(0, commaIndex);
        const match = meta.match(/data:([^;]+);base64/);
        if (match && match[1]) {
          mimeType = match[1];
        }
        base64Data = base64Data.substring(commaIndex + 1);
      }
    }

    // Clean whitespace/newlines from base64 string
    base64Data = base64Data.replace(/\s+/g, '');

    const cropHintText = req.cropTypeHint ? `Farmer indicated crop type: "${req.cropTypeHint}".` : '';
    const symptomHintText = req.symptomsHint ? `Farmer described symptoms: "${req.symptomsHint}".` : '';
    const targetLang = req.lang || 'en';

    const promptText = `
You are an expert plant pathologist and agronomist at the Indian Council of Agricultural Research (ICAR / UAS).
Carefully inspect this image of a plant/leaf/crop specimen.

Context:
${cropHintText}
${symptomHintText}
Requested UI language: "${targetLang}" (Please provide Kannada translations for cropNameKn and diseaseNameKn).

INSTRUCTIONS:
1. Verify if this image depicts a plant leaf, crop, fruit, stem, or agricultural produce. If it is NOT a plant/crop (e.g., human face, object, animal, car, cartoon, random object), set "isPlantOrCrop": false.
2. Accurately identify the actual crop or plant species in the photo. Do NOT hallucinate or guess Tomato unless the photo actually shows Tomato foliage/fruit.
3. Inspect all visible pathology: foliar spots, yellow chlorosis, concentric rings, pustules, blight necrosis, powdery coating, viral mosaic patterns, insect borers/frass, or nutrient deficiency.
4. If the plant foliage appears healthy without active pathogens or significant damage, mark "isHealthy": true, "diseaseName": "Healthy Foliage - No Active Pathogen Detected", "severity": "None".
5. For identified diseases or pests, specify the exact scientific pathogen name (e.g., Alternaria solani, Xanthomonas axonopodis, Spodoptera litura, etc.).
6. Calculate a genuine confidence score (1 to 100) based strictly on image sharpness, lesion distinctiveness, and diagnostic certainty. Do NOT use a hardcoded default.
7. Provide safe, verified organic/biological remedies (e.g., Trichoderma viride, Neem kernel extract NSKE, Panchagavya, Cow urine fermented spray).
8. Provide standard CIBRC-approved chemical fungicide/insecticide sprays with exact, safe dosage in ml/L or g/L of water. If plant is healthy, chemicalTreatments should say "No chemical spray required".
9. Include practical preventive cultural practices (field sanitation, crop rotation, soil drainage, seed treatment).
10. Include a safety notice warning the farmer to wear protective equipment and not to spray in high wind or heat.
`;

    let responseText: string | undefined;
    let lastError: any = null;

    // Retry loop for transient 503 spikes
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: base64Data,
                  },
                },
                {
                  text: promptText,
                },
              ],
            },
          ],
          config: {
            systemInstruction:
              'You are an authoritative agricultural plant pathologist and agronomist. Provide precise scientific diagnoses for Indian crops and safe, practical prescriptions for farmers.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                isPlantOrCrop: {
                  type: Type.BOOLEAN,
                  description: 'Whether the image contains a plant, crop leaf, stem, fruit, or agricultural produce',
                },
                cropName: {
                  type: Type.STRING,
                  description: 'Identified crop name in English (e.g. Tomato, Paddy / Rice, Cotton, Chilli, Arecanut, Maize, etc.)',
                },
                cropNameKn: {
                  type: Type.STRING,
                  description: 'Crop name in Kannada (e.g. ಟೊಮೆಟೊ, ಭತ್ತ, ಹತ್ತಿ, ಮೆಣಸಿನಕಾಯಿ, ಅಡಿಕೆ)',
                },
                diseaseName: {
                  type: Type.STRING,
                  description: 'Pathological diagnosis with scientific pathogen name, or Healthy Foliage if no disease',
                },
                diseaseNameKn: {
                  type: Type.STRING,
                  description: 'Disease name in Kannada script',
                },
                isHealthy: {
                  type: Type.BOOLEAN,
                  description: 'True if crop shows no disease or pest infestation',
                },
                severity: {
                  type: Type.STRING,
                  enum: ['None', 'Low', 'Moderate', 'High', 'Severe'],
                  description: 'Disease severity level',
                },
                confidence: {
                  type: Type.INTEGER,
                  description: 'Realistic diagnosis confidence score between 1 and 100 based on visible symptoms',
                },
                pathogenType: {
                  type: Type.STRING,
                  description: 'Category: Fungal, Bacterial, Viral, Insect/Pest, Nutrient Deficiency, or Physiological',
                },
                symptoms: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Observed visible symptoms on the leaf/crop surface in the image',
                },
                organicRemedies: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Organic and bio-control remedies with preparation and dosage',
                },
                chemicalTreatments: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Chemical sprays with approved CIBRC dosages (or No chemical spray required)',
                },
                preventiveMeasures: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Preventive farm practices and crop management measures',
                },
                farmerSafetyNotice: {
                  type: Type.STRING,
                  description: 'Safety precautions for the farmer before handling chemical sprays',
                },
              },
              required: [
                'isPlantOrCrop',
                'cropName',
                'cropNameKn',
                'diseaseName',
                'diseaseNameKn',
                'isHealthy',
                'severity',
                'confidence',
                'symptoms',
                'organicRemedies',
                'chemicalTreatments',
                'preventiveMeasures',
              ],
            },
          },
        });

        responseText = response.text;
        if (responseText) break;
      } catch (err: any) {
        lastError = err;
        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
      }
    }

    if (!responseText) {
      let friendlyError = 'Failed to analyze crop image with Gemini Vision.';
      if (lastError?.message) {
        try {
          const parsedErr = JSON.parse(lastError.message);
          if (parsedErr?.error?.code === 503) {
            friendlyError =
              'Gemini AI is experiencing high demand right now. Please click "Scan & Detect Disease Now" again in a few seconds.';
          } else if (parsedErr?.error?.message) {
            friendlyError = parsedErr.error.message;
          }
        } catch {
          if (lastError.message.includes('503')) {
            friendlyError =
              'Gemini AI is experiencing high demand right now. Please click "Scan & Detect Disease Now" again in a few seconds.';
          } else {
            friendlyError = lastError.message;
          }
        }
      }
      return {
        success: false,
        error: friendlyError,
      };
    }

    const parsed = JSON.parse(responseText);

    if (parsed.isPlantOrCrop === false) {
      return {
        success: false,
        isPlantOrCrop: false,
        error:
          'The uploaded image does not appear to be a plant leaf, crop, or agricultural specimen. Please upload a clear photo of the affected plant foliage, leaf, or fruit for accurate diagnosis.',
      };
    }

    const diagnosis: CropDiagnosis = {
      id: `gemini-diag-${Date.now()}`,
      cropName: parsed.cropName || req.cropTypeHint || 'Crop Specimen',
      cropNameKn: parsed.cropNameKn || parsed.cropName || 'ಬೆಳೆ',
      diseaseName: parsed.diseaseName || 'Disease Detected',
      diseaseNameKn: parsed.diseaseNameKn || parsed.diseaseName || 'ರೋಗ ಪತ್ತೆ',
      severity: (parsed.severity as any) || 'Moderate',
      confidence: Math.max(1, Math.min(100, Number(parsed.confidence) || 85)),
      symptoms: Array.isArray(parsed.symptoms) && parsed.symptoms.length > 0
        ? parsed.symptoms
        : ['Visible discoloration or spots on foliage'],
      organicRemedies: Array.isArray(parsed.organicRemedies) && parsed.organicRemedies.length > 0
        ? parsed.organicRemedies
        : ['Apply fermented neem seed kernel extract (NSKE 5%)', 'Spray Panchagavya solution (3%)'],
      chemicalTreatments: Array.isArray(parsed.chemicalTreatments) && parsed.chemicalTreatments.length > 0
        ? parsed.chemicalTreatments
        : ['Consult local KVK agronomist before spraying'],
      preventiveMeasures: Array.isArray(parsed.preventiveMeasures) && parsed.preventiveMeasures.length > 0
        ? parsed.preventiveMeasures
        : ['Avoid overhead irrigation', 'Remove infected debris from field'],
      timestamp: `Gemini 3.8 Flash Vision Diagnostic &bull; ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      image: req.image.startsWith('data:') ? req.image : undefined,
      isHealthy: Boolean(parsed.isHealthy),
      isPlantOrCrop: true,
      pathogenType: parsed.pathogenType || 'Pathology',
      farmerSafetyNotice: parsed.farmerSafetyNotice || 'Always wear gloves and mask when preparing or spraying agricultural formulations.',
    };

    return {
      success: true,
      diagnosis,
      isPlantOrCrop: true,
    };
  } catch (err: any) {
    console.error('Gemini Crop Doctor error:', err);
    return {
      success: false,
      error: err?.message || 'Failed to analyze crop image with Gemini Vision.',
    };
  }
}
