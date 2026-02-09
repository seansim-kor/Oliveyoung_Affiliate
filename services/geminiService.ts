import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Language, UserDemographics } from "../types";

// Helper to convert File to Base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeSkin = async (
  imageFile: File,
  locationName: string,
  language: Language,
  demographics: UserDemographics
): Promise<AnalysisResult> => {
  const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) ||
    (typeof import.meta.env !== 'undefined' && import.meta.env.VITE_GEMINI_API_KEY);

  if (!apiKey) {
    throw new Error("API Key is missing. Please set VITE_GEMINI_API_KEY in Cloudflare Pages settings (Production & Preview).");
  }

  const ai = new GoogleGenAI({ apiKey });
  const base64Data = await fileToGenerativePart(imageFile);

  const langInstruction = language === 'ko' ? "Respond entirely in Korean." : "Respond in English.";

  const prompt = `
    You are a professional K-Beauty consultant and dermatologist. 
    Analyze the selfie image provided. ${langInstruction}

    USER PROFILE:
    - Gender: ${demographics.gender}
    - Age Group: ${demographics.ageGroup}
    - Location/Climate: ${locationName}

    Your analysis must be WEIGHTED by this profile. 
    (e.g., Wrinkles in 20s is a high concern, wrinkles in 60s is normal. A score of 80/100 for a 60-year-old is different than for a 20-year-old.)

    Focus on:
    1. Skin Type (Oily, Dry, Combination, Normal)
    2. Skin Tone (Cool, Warm, Neutral, Fitzpatrick scale)
    3. Estimated Skin Age (Compare visually estimated age vs actual age group).
    
    Calculate an 'overallScore' (0-100) representing the overall health.
    Calculate 'estimatedAge' (integer) based on skin condition.

    Recommend a **Complete 5-Step Korean Skincare Routine** tailored to the user's specific skin issues (e.g., dark circles, pores, wrinkles) and environment.
    
    CRITICAL: Only recommend products from highly popular, widely available K-Beauty brands that are easily searchable on Olive Young (Global/Korea). 
    Preferred brands: Anua, Round Lab, COSRX, Beauty of Joseon, Torriden, Manyo Factory, Mediheal, Skin1004, Isntree, Aestura, Laneige.

    The 5 Steps MUST be:
    1. **Prep**: Toner or Pad (Refine texture)
    2. **Target**: Ampoule or Serum (High-concentration treatment)
    3. **Seal**: Moisturizer or Cream (Lock moisture)
    4. **Protect**: Sunscreen (UV Protection)
    5. **Enhance**: Eye Cream, Special Care, or Tone-up (Specific concern focus)

    For EACH product in the 5 steps:
    - Provide specific Product Name and Brand. 
    - IMPORTANT: keep the 'name' concise (remove extra fluff like 'special edition', 'renewed', or long descriptions) to ensure high search hit rate.
    - Identify the 'keyIngredient' (e.g., Centella Asiatica, Retinol, Hyaluronic Acid).
    - Explain 'reason' tailored to the user's age/gender.
    - Provide an estimated 'priceUsd' (integer).

    IMPORTANT - VISUAL ISSUES & BOUNDING BOXES:
    Identify up to 4 specific visible skin issues.
    - Bounding boxes must be TIGHT and PRECISE.
    - Dark Circles: Enclose ONLY the under-eye area.
    - Acne/Redness: Box specific spots.
    
    Return pure JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: imageFile.type,
              data: base64Data
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            skinType: { type: Type.STRING },
            skinTone: { type: Type.STRING },
            sensitivityLevel: { type: Type.STRING },
            overallScore: { type: Type.INTEGER },
            estimatedAge: { type: Type.INTEGER },
            analysisSummary: { type: Type.STRING },
            weatherAdvice: { type: Type.STRING },
            metrics: {
              type: Type.OBJECT,
              properties: {
                hydration: { type: Type.INTEGER },
                oiliness: { type: Type.INTEGER },
                sensitivity: { type: Type.INTEGER },
                pigmentation: { type: Type.INTEGER },
                wrinkles: { type: Type.INTEGER },
              }
            },
            issues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  description: { type: Type.STRING },
                  box_2d: {
                    type: Type.ARRAY,
                    items: { type: Type.INTEGER },
                    description: "Bounding box [ymin, xmin, ymax, xmax] 0-1000"
                  }
                }
              }
            },
            products: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.STRING },
                  category: { type: Type.STRING },
                  name: { type: Type.STRING },
                  brand: { type: Type.STRING },
                  keyIngredient: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  priceUsd: { type: Type.INTEGER },
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    } else {
      throw new Error("No response text received from Gemini.");
    }
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};