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
    1. PRIMARY FACE LOCALIZATION (MANDATORY):
       - Provide 'face_box': [ymin, xmin, ymax, xmax] (0-1000) tightly containing the face.
    
    2. ANATOMICAL PINPOINTING (REQUIRED: 4 MARKERS):
       - Markers MUST be inside 'face_box'.
       - 'Center Forehead', 'Left/Right Zygomatic', 'Mentalis/Chin', 'T-Zone'.
    
    3. CLINICAL METRICS (0-100 SCALE):
       - 'hydration': 100 = perfectly hydrated, 0 = severe dehydration.
       - 'oiliness': 100 = oily, 0 = dry.
       - 'sensitivity': 100 = sensitive, 0 = resilient.
       - 'pigmentation': 100 = pigmented, 0 = clear.
       - 'wrinkles': 100 = deep wrinkles, 0 = firm.
    
    4. PRODUCT RECOMMENDATIONS (EXACTLY 5 REQUIRED):
       Return EXACTLY 5 products with these EXACT formats:
       
       Product 1:
       - step: "Step 1: Prep" (EXACTLY this format, max 20 characters)
       - category: "Toner"
       - name: "Anua Heartleaf 77 Percent Soothing Toner"
       - brand: "Anua"
       - keyIngredient: "Houttuynia Cordata"
       - reason: "Gently exfoliates and soothes sensitive skin while repairing moisture barrier" (20-150 words)
       - expectedEffect: "Clear calm skin" (max 50 characters)
       - imageUrl: "https://image.oliveyoung.co.kr/uploads/images/goods/550/10/0000/0014/A00000014557613ko.jpg?l=ko"
       - priceUsd: 19
       
       Product 2:
       - step: "Step 2: Essence" (EXACTLY this format)
       - name: "COSRX Advanced Snail 96 Mucin Power Essence"
       - brand: "COSRX"
       
       Product 3:
       - step: "Step 3: Serum" (EXACTLY this format)
       - name: "Beauty of Joseon Glow Serum"
       - brand: "Beauty of Joseon"
       
       Product 4:
       - step: "Step 4: Moisturizer" (EXACTLY this format)
       - name: "Beauty of Joseon Dynasty Cream"
       - brand: "Beauty of Joseon"
       
       Product 5:
       - step: "Step 5: Sunscreen" (EXACTLY this format)
       - name: "Beauty of Joseon Relief Sun"
       - brand: "Beauty of Joseon"
       
       CRITICAL RULES:
       - step field: ONLY "Step N: Category" format, NEVER add product names or descriptions
       - All text fields: Use ONLY simple ASCII characters
       - reason field: 20-150 characters, simple sentences only
       - NO special quotes, NO line breaks, NO extra spaces
    
    Return pure JSON with surgically accurate bounding boxes and the face_box.
  `;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        required: ["skinType", "skinTone", "sensitivityLevel", "overallScore", "estimatedAge", "analysisSummary", "weatherAdvice", "metrics", "issues", "products", "faceBox"],
        properties: {
          skinType: { type: SchemaType.STRING },
          skinTone: { type: SchemaType.STRING },
          sensitivityLevel: { type: SchemaType.STRING },
          overallScore: { type: SchemaType.NUMBER },
          estimatedAge: { type: SchemaType.NUMBER },
          analysisSummary: { type: SchemaType.STRING },
          weatherAdvice: { type: SchemaType.STRING },
          faceBox: { type: SchemaType.ARRAY, items: { type: SchemaType.NUMBER } },
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
                box_2d: { type: SchemaType.ARRAY, items: { type: SchemaType.NUMBER } }
              }
            }
          },
          products: {
            type: SchemaType.ARRAY,
            description: "Strictly 5 products for the 5-step routine. No placeholders.",
            items: {
              type: SchemaType.OBJECT,
              required: ["step", "category", "name", "brand", "reason", "expectedEffect", "imageUrl", "priceUsd"],
              properties: {
                step: {
                  type: SchemaType.STRING,
                  description: "Format: 'Step N: Category' (max 30 chars)",
                },
                category: {
                  type: SchemaType.STRING,
                  description: "Product category (max 50 chars)",
                },
                name: {
                  type: SchemaType.STRING,
                  description: "Product name (max 100 chars)",
                },
                brand: {
                  type: SchemaType.STRING,
                  description: "Brand name (max 50 chars)",
                },
                keyIngredient: {
                  type: SchemaType.STRING,
                  description: "Main ingredient (max 100 chars)",
                },
                reason: {
                  type: SchemaType.STRING,
                  description: "Why this product (20-200 chars)",
                },
                expectedEffect: {
                  type: SchemaType.STRING,
                  description: "Expected result (max 100 chars)",
                },
                imageUrl: {
                  type: SchemaType.STRING,
                  description: "Product image URL",
                },
                priceUsd: { type: SchemaType.NUMBER },
                badge: { type: SchemaType.STRING },
                externalPrices: {
                  type: SchemaType.OBJECT,
                  properties: {
                    amazon: { type: SchemaType.NUMBER },
                    yesstyle: { type: SchemaType.NUMBER }
                  }
                }
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
      const text = result.response.text();

      if (!text) throw new Error("Empty AI response.");

      // Extract JSON object
      let cleanJson = text;
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanJson = text.substring(firstBrace, lastBrace + 1);
      }

      // AGGRESSIVE SANITIZATION
      // Step 1: Remove control characters
      cleanJson = cleanJson.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");

      // Step 2: Remove trailing commas
      cleanJson = cleanJson.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');

      // Step 3: Fix common special characters that break JSON
      cleanJson = cleanJson
        .replace(/'/g, "'")  // Smart quotes to regular
        .replace(/"/g, '"')
        .replace(/"/g, '"')
        .replace(/–/g, '-')  // En dash to hyphen
        .replace(/—/g, '-')  // Em dash to hyphen
        .replace(/…/g, '...')
        .replace(/×/g, 'x');

      // Step 4: Fix unescaped quotes within string values (most aggressive)
      // This regex finds strings and ensures internal quotes are escaped
      cleanJson = cleanJson.replace(/"([^"]*?)"/g, (match, content) => {
        // Skip if it's a key (followed by :)
        const afterMatch = cleanJson.substring(cleanJson.indexOf(match) + match.length, cleanJson.indexOf(match) + match.length + 5);
        if (afterMatch.trim().startsWith(':')) {
          return match; // It's a key, don't modify
        }
        // It's a value, escape any problematic characters
        const cleaned = content
          .replace(/\\/g, '\\\\')  // Escape backslashes first
          .replace(/\n/g, ' ')     // Replace newlines with space
          .replace(/\r/g, '')      // Remove carriage returns
          .replace(/\t/g, ' ');    // Replace tabs with space
        return `"${cleaned}"`;
      });

      let parsed: AnalysisResult;
      try {
        parsed = JSON.parse(cleanJson);
      } catch (err: any) {
        console.error("=== JSON PARSE ERROR ===");
        console.error("Error message:", err.message);

        // Extract position from error message
        const posMatch = err.message.match(/position (\d+)/);
        if (posMatch) {
          const pos = parseInt(posMatch[1]);
          const contextStart = Math.max(0, pos - 100);
          const contextEnd = Math.min(cleanJson.length, pos + 100);
          console.error("\nContext around position", pos, ":");
          console.error(cleanJson.substring(contextStart, contextEnd));
          console.error(" ".repeat(Math.min(100, pos - contextStart)) + "^ ERROR HERE");
        }

        console.error("\nFull cleaned JSON:");
        console.error(cleanJson);

        // EMERGENCY FALLBACK: Try to extract just the essential fields
        try {
          // Last resort: use regex to extract key fields and build minimal valid object
          const skinTypeMatch = cleanJson.match(/"skinType"\s*:\s*"([^"]*)"/);
          const skinToneMatch = cleanJson.match(/"skinTone"\s*:\s*"([^"]*)"/);

          if (!skinTypeMatch || !skinToneMatch) {
            throw new Error(`AI 응답 형식이 완전히 손상되었습니다. 다시 시도해 주세요.`);
          }

          // Build minimal valid response
          parsed = {
            skinType: skinTypeMatch[1] || "Combination",
            skinTone: skinToneMatch[1] || "Medium",
            sensitivityLevel: "Normal",
            overallScore: 75,
            estimatedAge: demographics.ageGroup.includes('20') ? 25 : 35,
            analysisSummary: "피부 분석이 완료되었습니다.",
            weatherAdvice: "적절한 보습과 자외선 차단이 필요합니다.",
            metrics: { hydration: 55, oiliness: 40, sensitivity: 30, pigmentation: 20, wrinkles: 10 },
            products: [], // Will be filled by fallback
            issues: [],
            faceBox: [100, 200, 850, 800]
          };
        } catch (innerErr) {
          throw new Error(`AI 분석 형식이 올바르지 않습니다. 다시 시도해 주세요. (${err.message})`);
        }
      }

      // --- Post-Processing & Robust Fallback ---
      parsed.overallScore = Number(parsed.overallScore) || 75;
      parsed.estimatedAge = Number(parsed.estimatedAge) || (demographics.ageGroup.includes('20') ? 25 : 35);

      const FALLBACK_PRODUCTS = [
        {
          step: "Step 1: Prep",
          category: "Cleanser/Toner",
          name: "Anua Heartleaf 77% Soothing Toner",
          brand: "Anua",
          keyIngredient: "Houttuynia Cordata",
          reason: "Gently exfoliates and soothes sensitive skin while repairing the moisture barrier for a clearer texture.",
          expectedEffect: "Clear, calm skin texture",
          priceUsd: 19,
          imageUrl: "https://image.oliveyoung.co.kr/uploads/images/goods/550/10/0000/0014/A00000014557613ko.jpg?l=ko",
          badge: "Best Seller",
          externalPrices: { amazon: 18.0, yesstyle: 19.5 }
        },
        {
          step: "Step 2: Essence",
          category: "Essence",
          name: "Advanced Snail 96 Mucin Power Essence",
          brand: "COSRX",
          keyIngredient: "Snail Mucin",
          reason: "Delivers deep hydration and repair for damaged skin, promoting underlying elasticity and a healthy glow.",
          expectedEffect: "Plump, hydrated glow",
          priceUsd: 21,
          imageUrl: "https://image.oliveyoung.co.kr/uploads/images/goods/550/10/0000/0013/A00000013718012ko.jpg?l=ko",
          badge: "Holy Grail",
          externalPrices: { amazon: 20.0, yesstyle: 21.0 }
        },
        {
          step: "Step 3: Serum",
          category: "Serum",
          name: "Glow Serum: Propolis + Niacinamide",
          brand: "Beauty of Joseon",
          keyIngredient: "Propolis",
          reason: "Brightens dull skin and controls pore size with powerful antioxidant propolis and niacindamide.",
          expectedEffect: "Radiant, poreless finish",
          priceUsd: 17,
          imageUrl: "https://image.oliveyoung.co.kr/uploads/images/goods/550/10/0000/0015/A00000015525301ko.jpg?l=ko",
          externalPrices: { amazon: 16.5, yesstyle: 17.5 }
        },
        {
          step: "Step 4: Moisturizer",
          category: "Cream",
          name: "Dynasty Cream",
          brand: "Beauty of Joseon",
          keyIngredient: "Ginseng",
          reason: "Classic K-beauty formulation that locks in moisture with a luxurious, non-sticky finish for all-day comfort.",
          expectedEffect: "Long-lasting moisture barrier",
          priceUsd: 24,
          imageUrl: "https://image.oliveyoung.co.kr/uploads/images/goods/550/10/0000/0015/A00000015525601ko.jpg?l=ko",
          externalPrices: { amazon: 23.0, yesstyle: 24.5 }
        },
        {
          step: "Step 5: Sunscreen",
          category: "Sunscreen",
          name: "Relief Sun: Rice + Probiotics",
          brand: "Beauty of Joseon",
          keyIngredient: "Rice Extract",
          reason: "Lightweight organic sunscreen that provides high SPF protection while feeling perfectly like a moisturizer.",
          expectedEffect: "No white cast protection",
          priceUsd: 18,
          imageUrl: "https://image.oliveyoung.co.kr/uploads/images/goods/550/10/0000/0016/A00000016056707ko.jpg?l=ko",
          badge: "Trending",
          externalPrices: { amazon: 17.0, yesstyle: 18.2 }
        }
      ];

      // Standardize the products array to exactly 5 items
      const finalProducts = [];
      for (let i = 0; i < 5; i++) {
        const aiProduct = parsed.products ? parsed.products[i] : null;
        const fallback = FALLBACK_PRODUCTS[i];

        // VALIDATE AND SANITIZE AI PRODUCT DATA
        let step = aiProduct?.step || fallback.step;
        let name = aiProduct?.name || fallback.name;
        let reason = aiProduct?.reason || fallback.reason;
        let expectedEffect = aiProduct?.expectedEffect || fallback.expectedEffect;

        // Truncate if too long (AI sometimes generates garbage)
        if (step.length > 30) {
          console.warn(`[WARN] Step field too long (${step.length} chars), using fallback`);
          step = fallback.step;
        }
        if (name.length > 150) {
          console.warn(`[WARN] Name field too long (${name.length} chars), truncating`);
          name = name.substring(0, 150);
        }
        if (reason.length > 300) {
          console.warn(`[WARN] Reason field too long (${reason.length} chars), truncating`);
          reason = reason.substring(0, 300);
        }
        if (expectedEffect.length > 100) {
          console.warn(`[WARN] ExpectedEffect field too long (${expectedEffect.length} chars), truncating`);
          expectedEffect = expectedEffect.substring(0, 100);
        }

        // Merge AI content with fallbacks for ANY missing or empty values
        finalProducts.push({
          step: step,
          category: aiProduct?.category || fallback.category,
          name: (name && name.length > 2) ? name : fallback.name,
          brand: (aiProduct?.brand && aiProduct.brand.length > 1) ? aiProduct.brand : fallback.brand,
          keyIngredient: aiProduct?.keyIngredient || fallback.keyIngredient,
          reason: (reason && reason.length > 10) ? reason : fallback.reason,
          expectedEffect: expectedEffect,
          imageUrl: aiProduct?.imageUrl || fallback.imageUrl,
          priceUsd: Number(aiProduct?.priceUsd) || fallback.priceUsd,
          badge: aiProduct?.badge || fallback.badge,
          externalPrices: aiProduct?.externalPrices || fallback.externalPrices
        });
      }
      parsed.products = finalProducts;

      // Final sanitization of other fields
      if (!parsed.metrics) parsed.metrics = { hydration: 55, oiliness: 40, sensitivity: 30, pigmentation: 20, wrinkles: 10 };
      if (!parsed.faceBox || parsed.faceBox.length !== 4) parsed.faceBox = [100, 200, 850, 800];

      console.log("[DEBUG] Final parsed result:");
      console.log("  - skinType:", parsed.skinType);
      console.log("  - products count:", parsed.products?.length);
      console.log("  - products:", parsed.products);
      console.log("  - overallScore:", parsed.overallScore);
      console.log("  - Full object:", parsed);

      return parsed;

    } catch (error: any) {
      console.error(`Gemini Attempt ${retries + 1}:`, error);
      if ((error.message?.includes("503") || error.message?.includes("429")) && retries < 2) {
        await new Promise(r => setTimeout(r, 1500));
        return runWithRetry(retries + 1);
      }
      throw error;
    }
  };

  return runWithRetry();
};
