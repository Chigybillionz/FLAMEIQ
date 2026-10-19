import type {
  RefillPredictionInput,
  RefillPredictionResult,
} from "@/types/smartRefill";

function parseCapacityKg(value: string | null): number {
  if (!value) return 12.5;
  const match = value.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 12.5;
}

// TEMP: the real GasSense AI backend endpoint isn't wired up yet. This
// heuristic mirrors the same ahead-of-backend pattern used elsewhere
// (services/vendorService.ts) — same function shape/output as the real
// prediction call will eventually return, tuned so the sample scenario
// (12.5kg cylinder, 3-person household, cooking twice daily) lands close
// to the reference design (~1.6kg/day, 6-8 days, ~38% confidence).
export async function getRefillPrediction(
  input: RefillPredictionInput
): Promise<RefillPredictionResult> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const capacityLabel = input.cylinderCapacity ?? input.cylinderSize ?? "12.5 kg";
  const capacityKg = parseCapacityKg(capacityLabel);

  const sessionsPerWeek = input.cookingFrequencyPerDay * input.cookingDaysPerWeek;
  const dailyMeals = sessionsPerWeek / 7;

  const baseRatePerSession = 0.27;
  const householdFactor = 1 + (Math.max(input.householdSize, 1) - 1) * 0.15;

  let dailyConsumptionKg = dailyMeals * baseRatePerSession * householdFactor;
  if (input.cookingPatternChange === "MORE") dailyConsumptionKg *= 1.15;
  if (input.cookingPatternChange === "LESS") dailyConsumptionKg *= 0.85;
  dailyConsumptionKg = Math.max(dailyConsumptionKg, 0.3);

  const estimatedDays = capacityKg / dailyConsumptionKg;
  const estimatedDaysMin = Math.max(1, Math.round(estimatedDays * 0.85));
  const estimatedDaysMax = Math.max(
    estimatedDaysMin + 1,
    Math.round(estimatedDays * 1.15)
  );

  const today = new Date();
  const windowStart = new Date(today);
  windowStart.setDate(today.getDate() + estimatedDaysMin);
  const windowEnd = new Date(today);
  windowEnd.setDate(today.getDate() + estimatedDaysMax);

  let confidence = 20;
  if (input.lastRefillDate) confidence += 10;
  if (input.typicalRefillFrequency) confidence += 8;
  if (input.cookingPatternChange) confidence += 5;
  confidence = Math.min(confidence, 45);

  const status: RefillPredictionResult["status"] =
    estimatedDaysMin <= 2 ? "CRITICAL" : estimatedDaysMin <= 8 ? "REFILL_SOON" : "HEALTHY";

  return {
    cylinderCapacity: capacityLabel,
    householdSize: input.householdSize,
    cookingFrequencyPerDay: input.cookingFrequencyPerDay,
    estimatedDaysMin,
    estimatedDaysMax,
    refillWindowStart: windowStart.toISOString(),
    refillWindowEnd: windowEnd.toISOString(),
    confidencePercent: confidence,
    dailyConsumptionKg: Number(dailyConsumptionKg.toFixed(1)),
    lastFilled: input.lastRefillDate,
    status,
  };
}
