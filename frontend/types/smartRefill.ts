export const CAPACITY_OPTIONS = [
  "3 kg",
  "6 kg",
  "12 kg",
  "12.5 kg",
  "25 kg",
  "50 kg",
] as const;

export const REFILL_FREQUENCY_OPTIONS = [
  "Every 1 - 2 weeks",
  "Every 3 - 4 weeks",
  "Every 1 - 2 months",
  "Longer than 2 months",
  "Not sure",
] as const;

export type CookingPatternChange = "SAME" | "MORE" | "LESS";

export interface RefillPredictionInput {
  cylinderSize: string | null;
  lastRefillDate: string | null; // ISO date
  partialRefillQuantityKg: number | null;
  cylinderCapacity: string | null;
  cookingFrequencyPerDay: number;
  cookingDaysPerWeek: number;
  householdSize: number;
  isGasPrimaryFuel: boolean | null;
  typicalRefillFrequency: string | null;
  cookingPatternChange: CookingPatternChange | null;
}

export const initialRefillInput: RefillPredictionInput = {
  cylinderSize: null,
  lastRefillDate: null,
  partialRefillQuantityKg: null,
  cylinderCapacity: null,
  cookingFrequencyPerDay: 0,
  cookingDaysPerWeek: 0,
  householdSize: 0,
  isGasPrimaryFuel: null,
  typicalRefillFrequency: null,
  cookingPatternChange: null,
};

// Mirrors the backend GasPrediction model shape (backend/prisma/schema.prisma:
// estimatedEmptyDate, confidence) — flattened into a display-ready result.
export interface RefillPredictionResult {
  cylinderCapacity: string;
  householdSize: number;
  cookingFrequencyPerDay: number;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  refillWindowStart: string; // ISO date
  refillWindowEnd: string; // ISO date
  confidencePercent: number;
  dailyConsumptionKg: number;
  lastFilled: string | null;
  status: "REFILL_SOON" | "HEALTHY" | "CRITICAL";
}
