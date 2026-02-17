export type Language = 'en' | 'ko';

export type Gender = 'Female' | 'Male' | 'Other';
export type AgeGroup = '10s' | '20s' | '30s' | '40s' | '50s' | '60s' | '70s+';

export interface UserDemographics {
  gender: Gender;
  ageGroup: AgeGroup;
}

export interface Product {
  step: string; // e.g., "Step 1: Prep"
  category: string; // e.g., "Toner"
  name: string;
  brand: string;
  keyIngredient: string;
  reason: string;
  expectedEffect: string; // e.g., "Reduces redness and strengthens barrier"
  imageUrl?: string; // Optional product image URL
  priceUsd: number;
  badge?: string; // e.g., "Best Seller", "Holy Grail"
  externalPrices?: {
    amazon?: number;
    yesstyle?: number;
  };
}

export interface SkinMetrics {
  hydration: number;
  oiliness: number;
  sensitivity: number;
  pigmentation: number;
  wrinkles: number;
}

export interface Issue {
  label: string;
  description: string;
  box_2d?: number[]; // [ymin, xmin, ymax, xmax] normalized 0-1000
}

export interface AnalysisResult {
  skinType: string;
  skinTone: string;
  sensitivityLevel: string;
  overallScore: number;
  estimatedAge: number;
  analysisSummary: string;
  weatherAdvice: string;
  metrics: SkinMetrics;
  products: Product[];
  issues: Issue[];
  faceBox?: number[]; // [ymin, xmin, ymax, xmax] 0-1000
  timestamp?: number; // Unix timestamp for history tracking
}

export interface User {
  email: string;
  name: string;
  isLoggedIn: boolean;
}

export enum AppView {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  DEMOGRAPHICS = 'DEMOGRAPHICS',
  CAMERA = 'CAMERA',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
}

export const LOCATIONS = [
  { id: 'seoul', name: 'Seoul, Korea (Humid Continental)', region: 'KR' },
  { id: 'ny', name: 'New York, USA (Temperate)', region: 'Global' },
  { id: 'la', name: 'Los Angeles, USA (Dry/Mediterranean)', region: 'Global' },
  { id: 'singapore', name: 'Singapore (Tropical Rainforest)', region: 'Global' },
  { id: 'london', name: 'London, UK (Oceanic)', region: 'Global' },
  { id: 'dubai', name: 'Dubai, UAE (Desert)', region: 'Global' },
];