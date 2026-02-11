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
    Analyze this skin image. ${langInstruction}
    USER: ${demographics.gender}, ${demographics.ageGroup} at ${locationName}.
    Weighted analysis: Score 0-100, estimatedAge (integer).
    Provide a 5-Step K-Beauty routine with brands like Anua, Round Lab, COSRX, Beauty of Joseon.
    Bounding boxes for issues: [ymin, xmin, ymax, xmax] 0-1000.
    Return pure JSON matching the schema.
  `;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
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

        // Basic validation and field filling
        if (!parsed.products) parsed.products = [];
        if (!parsed.issues) parsed.issues = [];
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
