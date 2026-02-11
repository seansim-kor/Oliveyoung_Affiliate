/// <reference types="vite/client" />
import { GoogleGenerativeAI, SchemaType, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { AnalysisResult, Language, UserDemographics } from "../types";

// Helper to convert File to Generative Part (Base64)
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
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
    throw new Error("API Key is missing. Please set VITE_GEMINI_API_KEY in Cloudflare Pages settings.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const imagePart = await fileToGenerativePart(imageFile);

  const langInstruction = language === 'ko' ? "Respond entirely in Korean." : "Respond in English.";

  const prompt = `
    Analyze this photo with 'Geometric Precision'. Act as a Senior Aesthetic Surgeon. ${langInstruction}
    USER: ${demographics.gender}, ${demographics.ageGroup}, Location: ${locationName}.
    
    SPATIAL REASONING PROTOCOL:
    1. PRIMARY FACE LOCALIZATION:
       - First, identify the BOUNDING BOX of the face: [ymin, xmin, ymax, xmax] (0-1000).
       - All subsequent skin markers MUST be mathematically centered within this face box.
    
    2. ANATOMICAL PINPOINTING (REQUIRED: 4 MARKERS):
       - 'Center Forehead': Target the glabella/frontal area. (Avoid the hairline!)
       - 'Left/Right Zygomatic': Target the peak of each cheekbone on the actual skin.
       - 'Mentalis/Chin': Target the center of the chin.
       - 'T-Zone': Target the nasal bridge and immediate surrounding area.
    
    3. CLINICAL COORDINATES: 
       - For EACH marker, provide a tiny, precise [ymin, xmin, ymax, xmax] box (e.g., a 40x40 unit square).
       - Coordinates must be relative to the 0-1000 scale of the ORIGINAL IMAGE.
    
    4. STRICT FILTER: Zero tolerance for markers on hair, ears, eyes, or background.
    
    5. PROFESSIONAL SUMMARY: 4+ sentences of objective clinical findings.
    
    Return pure JSON with surgically accurate bounding boxes.
  `;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        required: ["skinType", "skinTone", "sensitivityLevel", "overallScore", "estimatedAge", "analysisSummary", "weatherAdvice", "metrics", "issues", "products"],
        properties: {
          skinType: { type: SchemaType.STRING },
          skinTone: { type: SchemaType.STRING },
          sensitivityLevel: { type: SchemaType.STRING },
          overallScore: { type: SchemaType.NUMBER },
          estimatedAge: { type: SchemaType.NUMBER },
          analysisSummary: { type: SchemaType.STRING },
          weatherAdvice: { type: SchemaType.STRING },
          metrics: {
            type: SchemaType.OBJECT,
            properties: {
              hydration: { type: SchemaType.NUMBER },
              oiliness: { type: SchemaType.NUMBER },
              sensitivity: { type: SchemaType.NUMBER },
              pigmentation: { type: SchemaType.NUMBER },
              wrinkles: { type: SchemaType.NUMBER },
            }
          },
          issues: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                label: { type: SchemaType.STRING },
                description: { type: SchemaType.STRING },
                box_2d: {
                  type: SchemaType.ARRAY,
                  items: { type: SchemaType.NUMBER }
                }
              }
            }
          },
          products: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                step: { type: SchemaType.STRING },
                category: { type: SchemaType.STRING },
                name: { type: SchemaType.STRING },
                brand: { type: SchemaType.STRING },
                keyIngredient: { type: SchemaType.STRING },
                reason: { type: SchemaType.STRING },
                priceUsd: { type: SchemaType.NUMBER }
              }
            }
          }
        }
      }
    },
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE }
    ]
  });

  const runWithRetry = async (retries = 0): Promise<AnalysisResult> => {
    try {
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        if (response.candidates?.[0]?.finishReason === "SAFETY") throw new Error("SAFETY_BLOCK");
        throw new Error("Empty AI response.");
      }

      try {
        // More robust JSON extraction: find the first '{' and last '}'
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');

        if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
          throw new Error("No JSON object found in response");
        }

        const cleanJson = text.substring(firstBrace, lastBrace + 1);
        const parsed = JSON.parse(cleanJson) as AnalysisResult;

        // Post-processing to ensure no NaNs and healthy data
        let finalScore = Number(parsed.overallScore) || 75;
        // Safety: If AI returns 0-10 scale despite instruction, convert to 0-100
        if (finalScore > 0 && finalScore <= 10) finalScore = finalScore * 10;
        parsed.overallScore = finalScore;

        parsed.estimatedAge = Number(parsed.estimatedAge) || (demographics.ageGroup.includes('20') ? 25 : 35);

        if (parsed.products) {
          parsed.products = parsed.products.map((p: any) => ({
            ...p,
            name: p.name || "K-Beauty Secret",
            brand: p.brand || "Olive Young Best",
            priceUsd: typeof p.priceUsd === 'string'
              ? parseFloat(p.priceUsd.replace(/[^0-9.]/g, ''))
              : (Number(p.priceUsd) || 15)
          }));
        } else {
          parsed.products = [];
        }

        if (!parsed.issues || parsed.issues.length === 0) {
          parsed.issues = [
            { label: "T-Zone", description: "Analysis concentrated on sebum and pore uniformity.", box_2d: [150, 400, 350, 600] },
            { label: "Cheek Area", description: "Texture and hydration levels scanned in Malar region.", box_2d: [400, 250, 600, 450] },
            { label: "Lower Face", description: "Elasticity and barrier health assessment.", box_2d: [650, 350, 850, 650] }
          ];
        } else {
          // Safety: Fill missing box_2d for any AI-generated issues
          parsed.issues = parsed.issues.map((issue: any, idx: number) => {
            if (!issue.box_2d || !Array.isArray(issue.box_2d) || issue.box_2d.length !== 4) {
              const fallbacks = [
                [150, 400, 300, 600], [400, 250, 550, 450], [400, 550, 550, 750], [650, 350, 800, 650]
              ];
              return { ...issue, box_2d: fallbacks[idx % fallbacks.length] };
            }
            return issue;
          });
        }

        if (!parsed.metrics) {
          parsed.metrics = { hydration: 50, oiliness: 50, sensitivity: 50, pigmentation: 50, wrinkles: 50 };
        }

        return parsed;
      } catch (parseError: any) {
        console.error("JSON Parse Error. Raw Text:", text);
        console.error("Parse Error Details:", parseError.message);
        throw new Error(`AI 분석 형식이 올바르지 않습니다. 다시 시도해 주세요. (${parseError.message})`);
      }
    } catch (error: any) {
      console.error(`Gemini Attempt ${retries + 1}:`, error);

      const isRetryable = error.message?.includes("503") || error.message?.includes("429");
      if (isRetryable && retries < 2) {
        await new Promise(r => setTimeout(r, Math.pow(2, retries) * 1000));
        return runWithRetry(retries + 1);
      }

      if (error.message === "SAFETY_BLOCK") {
        throw new Error(language === 'ko' ? "AI가 피부를 찾지 못했습니다. 더 밝은 곳에서 찍어주세요." : "AI couldn't detect skin. Try a brighter photo.");
      }

      if (error.message?.includes("429")) {
        throw new Error(language === 'ko' ? "사용량이 많습니다. 1분 후 시도해주세요." : "Quota exceeded. Try in 1 minute.");
      }

      throw error;
    }
  };

  return runWithRetry();
};
