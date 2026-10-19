"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bell,
  ChevronRight,
  Flame,
  Fuel,
  Info,
  Minus,
  Plus,
  RotateCcw,
  ShoppingCart,
  Sparkles,
  Users,
} from "lucide-react";
import Select from "@/components/ui/Select";
import LastRefillDatePicker from "@/components/refill/LastRefillDatePicker";
import { getRefillPrediction } from "@/services/gasSenseService";
import {
  CAPACITY_OPTIONS,
  REFILL_FREQUENCY_OPTIONS,
  initialRefillInput,
  type CookingPatternChange,
  type RefillPredictionInput,
  type RefillPredictionResult,
} from "@/types/smartRefill";

type View = "form" | "result";

export default function SmartRefillPage() {
  const [view, setView] = useState<View>("form");
  const [input, setInput] = useState<RefillPredictionInput>(initialRefillInput);
  const [result, setResult] = useState<RefillPredictionResult | null>(null);
  const [generating, setGenerating] = useState(false);

  const isReady =
    Boolean(input.cylinderSize) &&
    Boolean(input.lastRefillDate) &&
    input.cookingFrequencyPerDay > 0 &&
    input.cookingDaysPerWeek > 0 &&
    input.householdSize > 0;

  const handleGenerate = async () => {
    if (!isReady) return;
    setGenerating(true);
    const prediction = await getRefillPrediction(input);
    setResult(prediction);
    setGenerating(false);
    setView("result");
  };

  return (
    <div>
      <div className="mb-6">
        <nav className="flex items-center gap-1.5 text-xs text-muted-500">
          <Link href="/customer/dashboard" className="hover:text-ink-500">
            Dashboard
          </Link>
          <ChevronRight size={12} />
          <span className="text-ink-500">Smart Refill</span>
        </nav>
      </div>

      {view === "form" ? (
        <RefillForm
          input={input}
          setInput={setInput}
          isReady={isReady}
          generating={generating}
          onGenerate={handleGenerate}
        />
      ) : (
        result && (
          <RefillResult
            input={input}
            result={result}
            onUpdateInputs={() => setView("form")}
          />
        )
      )}
    </div>
  );
}

function StepHeader() {
  return (
    <div className="mx-auto mb-8 flex w-full max-w-md items-center">
      <div className="flex flex-col items-center">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white">
          1
        </span>
        <span className="mt-1.5 text-xs font-medium text-brand-500">
          Your Details
        </span>
      </div>
      <span className="mx-2 h-px flex-1 bg-border" />
      <div className="flex flex-col items-center">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-sm font-medium text-muted-400">
          2
        </span>
        <span className="mt-1.5 text-xs font-medium text-muted-400">
          Get Estimate
        </span>
      </div>
    </div>
  );
}

function NumberStepper({
  value,
  onChange,
  min = 0,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink-500 hover:bg-muted-50"
        aria-label="Decrease"
      >
        <Minus size={14} />
      </button>
      <span className="w-6 text-center text-sm font-semibold text-ink-500">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink-500 hover:bg-muted-50"
        aria-label="Increase"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

function FieldLabel({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <div className="mb-1.5">
      <p className="text-sm font-medium text-ink-500">{title}</p>
      {hint && <p className="text-xs text-muted-400">{hint}</p>}
    </div>
  );
}

function RefillForm({
  input,
  setInput,
  isReady,
  generating,
  onGenerate,
}: {
  input: RefillPredictionInput;
  setInput: React.Dispatch<React.SetStateAction<RefillPredictionInput>>;
  isReady: boolean;
  generating: boolean;
  onGenerate: () => void;
}) {
  const update = <K extends keyof RefillPredictionInput>(
    key: K,
    value: RefillPredictionInput[K]
  ) => setInput((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <h1 className="text-xl font-bold text-ink-500">
          Smart Refill Prediction
        </h1>
        <p className="mt-1 flex items-center justify-center gap-1.5 text-sm font-medium text-brand-500">
          <Sparkles size={13} /> Powered by Flamy Ai
        </p>
      </div>

      <StepHeader />

      <div className="text-center">
        <h2 className="text-lg font-bold text-ink-500">
          Set Up Your Refill Prediction Form
        </h2>
        <p className="mt-1 text-sm text-muted-500">
          The more accurate your inputs, the better our prediction.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {/* Cylinder & Refill details */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-500">
            <Fuel size={15} className="text-brand-500" />
            Cylinder & Refill details
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel title="Cylinder Size" />
              <Select
                value={input.cylinderSize}
                onChange={(value) => update("cylinderSize", value)}
                options={CAPACITY_OPTIONS}
                placeholder="Select Size (kg)"
              />
            </div>
            <div>
              <FieldLabel title="Last Refill Date" />
              <LastRefillDatePicker
                value={input.lastRefillDate}
                onChange={(value) => update("lastRefillDate", value)}
              />
            </div>
          </div>
        </section>

        {/* Refill Type */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-ink-500">Refill Type</h3>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <FieldLabel title="Full Refill" />
              <input
                type="text"
                value="Auto"
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-border bg-muted-50/60 px-3.5 py-2.5 text-sm text-muted-500"
              />
            </div>
            <div>
              <FieldLabel title="Partial Refill" />
              <input
                type="number"
                min={0}
                value={input.partialRefillQuantityKg ?? ""}
                onChange={(e) =>
                  update(
                    "partialRefillQuantityKg",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                placeholder="Enter Quantity Refilled"
                className="w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink-500 outline-none placeholder:text-muted-400 focus:border-brand-500"
              />
            </div>
            <div>
              <FieldLabel title="Cylinder Capacity" />
              <Select
                value={input.cylinderCapacity}
                onChange={(value) => update("cylinderCapacity", value)}
                options={CAPACITY_OPTIONS}
                placeholder="Select Size (kg)"
              />
            </div>
          </div>
        </section>

        {/* Usage Pattern */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-500">
            <Users size={15} className="text-brand-500" />
            Usage Pattern
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <FieldLabel
                title="Cooking Frequency Per Day"
                hint="Number of times you cook with gas per day"
              />
              <NumberStepper
                value={input.cookingFrequencyPerDay}
                onChange={(value) => update("cookingFrequencyPerDay", value)}
              />
            </div>
            <div>
              <FieldLabel
                title="Cooking Days Per Week"
                hint="Number of days you cook with gas per week"
              />
              <NumberStepper
                value={input.cookingDaysPerWeek}
                onChange={(value) =>
                  update("cookingDaysPerWeek", Math.min(value, 7))
                }
              />
            </div>
            <div>
              <FieldLabel
                title="Household Size"
                hint="Number of people regularly using the gas"
              />
              <NumberStepper
                value={input.householdSize}
                onChange={(value) => update("householdSize", value)}
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel title="Is gas your primary cooking fuel?" />
              <div className="flex gap-3">
                {(["Yes", "No"] as const).map((label) => {
                  const boolValue = label === "Yes";
                  const isSelected = input.isGasPrimaryFuel === boolValue;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => update("isGasPrimaryFuel", boolValue)}
                      className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                        isSelected
                          ? "border-brand-500 bg-brand-50 text-brand-500"
                          : "border-border text-ink-500 hover:bg-muted-50"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <FieldLabel title="Typical Refill Frequency" />
              <Select
                value={input.typicalRefillFrequency}
                onChange={(value) => update("typicalRefillFrequency", value)}
                options={REFILL_FREQUENCY_OPTIONS}
                placeholder="Select Typical Frequency(Optional)"
              />
            </div>
          </div>
        </section>

        {/* Recent Changes in Cooking Pattern */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-ink-500">
            Recent Changes in Cooking Pattern
          </h3>
          <p className="mt-3 text-sm text-ink-500">I&apos;ve been cooking;</p>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {(
              [
                { value: "SAME", label: "Same as before" },
                { value: "MORE", label: "More than usual" },
                { value: "LESS", label: "less than usual" },
              ] as { value: CookingPatternChange; label: string }[]
            ).map((option) => {
              const isSelected = input.cookingPatternChange === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => update("cookingPatternChange", option.value)}
                  className={`flex items-center gap-2.5 rounded-lg border px-4 py-2.5 text-left text-sm transition-colors ${
                    isSelected
                      ? "border-brand-500 bg-brand-50/60"
                      : "border-border hover:bg-muted-50"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                      isSelected ? "border-brand-500" : "border-muted-200"
                    }`}
                  >
                    {isSelected && (
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                    )}
                  </span>
                  <span className="text-ink-500">{option.label}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={!isReady || generating}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-muted-200 disabled:text-muted-400"
      >
        {generating ? "Generating…" : "Generate My Refill Estimate"}
        {!generating && <ArrowRight size={16} />}
      </button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-500">
        <Sparkles size={12} />
        Your information helps us provide a more personalised refill
        estimate.
      </p>
    </div>
  );
}

const CONFIDENCE_STAGES = ["Estimated", "Building", "Reliable", "High Confidence"];

function getConfidenceStageIndex(percent: number): number {
  if (percent < 25) return 0;
  if (percent < 50) return 1;
  if (percent < 75) return 2;
  return 3;
}

function formatShortDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatWindowRange(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const startDay = start.getDate();
  const endDay = end.getDate();
  const endMonth = end.toLocaleDateString("en-US", { month: "long" });
  const year = end.getFullYear();
  return `${startDay} - ${endDay} ${endMonth} ${year}`;
}

const STATUS_LABEL: Record<RefillPredictionResult["status"], string> = {
  REFILL_SOON: "REFILL SOON",
  HEALTHY: "HEALTHY",
  CRITICAL: "CRITICAL",
};

const STATUS_STYLE: Record<RefillPredictionResult["status"], string> = {
  REFILL_SOON: "bg-notify-50 text-notify-700",
  HEALTHY: "bg-success/10 text-success",
  CRITICAL: "bg-error/10 text-error",
};

function RefillResult({
  input,
  result,
  onUpdateInputs,
}: {
  input: RefillPredictionInput;
  result: RefillPredictionResult;
  onUpdateInputs: () => void;
}) {
  const router = useRouter();
  const stageIndex = getConfidenceStageIndex(result.confidencePercent);

  const nearbyVendor = useMemo(
    () => ({
      name: "Sunrise Gas Hub",
      distanceKm: 0.8,
      price: 16000,
      eta: "30-45 min",
    }),
    []
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[result.status]}`}
        >
          • {STATUS_LABEL[result.status]}
        </span>
        <button
          type="button"
          onClick={onUpdateInputs}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-ink-500 hover:bg-muted-50"
        >
          <RotateCcw size={14} /> Update Inputs
        </button>
      </div>

      <h1 className="mt-4 text-2xl font-bold text-ink-500">
        Your Smart Refill Prediction
      </h1>
      <p className="mt-1 text-sm text-muted-500">
        Based on your {result.cylinderCapacity} cylinder · {result.householdSize}-person
        household · {result.cookingFrequencyPerDay}x daily cooking
      </p>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex-1 space-y-5">
          {/* Prediction hero card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-base font-semibold">
                  <Sparkles size={15} className="text-notify-400" />
                  Smart Refill Prediction
                </h2>
                <p className="mt-1 text-sm text-white/70">
                  {result.cylinderCapacity} cylinder · Household of{" "}
                  {result.householdSize}
                </p>
              </div>
              <span className="rounded-full bg-notify-500 px-3 py-1 text-xs font-semibold text-ink-500">
                • {STATUS_LABEL[result.status]}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
              <div className="flex flex-wrap gap-8">
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/60">
                    Estimated Time Remaining
                  </p>
                  <p className="mt-1 text-3xl font-bold">
                    {result.estimatedDaysMin} - {result.estimatedDaysMax}{" "}
                    <span className="text-lg font-medium">days</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/60">
                    Estimated Refill Window
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    {formatWindowRange(
                      result.refillWindowStart,
                      result.refillWindowEnd
                    )}
                  </p>
                </div>
              </div>

              <div className="relative hidden h-24 w-16 shrink-0 sm:block">
                <Image
                  src="/images/load-cylinder.png"
                  alt="Gas cylinder"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Building confidence */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink-500">
                Building Confidence{" "}
                <span className="ml-1 font-normal text-muted-400">
                  More data improves accuracy
                </span>
              </p>
              <span className="text-sm font-bold text-ink-500">
                {result.confidencePercent}%
              </span>
            </div>

            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted-100">
              <div
                className="h-full rounded-full bg-brand-500 transition-all"
                style={{ width: `${result.confidencePercent}%` }}
              />
            </div>

            <div className="mt-2 flex justify-between text-xs">
              {CONFIDENCE_STAGES.map((stage, index) => (
                <span
                  key={stage}
                  className={
                    index === stageIndex
                      ? "font-semibold text-brand-500"
                      : "text-muted-400"
                  }
                >
                  {stage}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-muted-50/70 p-3.5 text-sm text-ink-500">
              <Info size={16} className="mt-0.5 shrink-0 text-muted-500" />
              <p>
                This estimate is based on your{" "}
                <span className="font-semibold">
                  {result.cylinderCapacity} cylinder
                </span>
                , household size, cooking frequency, and previous refill
                history. As more refill data becomes available, your
                predictions become more accurate.
              </p>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-400">
                Refill Timeline
              </p>
              <div className="relative mt-3 h-1.5 w-full rounded-full bg-muted-100">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-error/70"
                  style={{
                    width: `${Math.min(
                      (result.estimatedDaysMin / 14) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-500">
                <span>
                  Today
                  <span className="ml-1 font-medium text-ink-500">
                    {formatShortDate(new Date().toISOString())}
                  </span>
                </span>
                <span className="rounded-full bg-notify-50 px-2.5 py-1 font-semibold text-notify-700">
                  Refill Window {result.estimatedDaysMin} - {result.estimatedDaysMax} days
                </span>
                <span>
                  <span className="font-medium text-ink-500">
                    {formatWindowRange(
                      result.refillWindowStart,
                      result.refillWindowEnd
                    )}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-semibold text-ink-500">
              Quick Actions
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <button
                type="button"
                className="flex flex-col items-start gap-2 rounded-xl bg-brand-500 p-4 text-left text-white"
              >
                <Bell size={16} />
                <span>
                  <span className="block text-sm font-semibold">
                    Set Reminder
                  </span>
                  <span className="block text-xs text-white/70">
                    Get notified before you run out
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => router.push("/customer/orders/quantity")}
                className="flex flex-col items-start gap-2 rounded-xl border border-border p-4 text-left hover:bg-muted-50"
              >
                <ShoppingCart size={16} className="text-brand-500" />
                <span>
                  <span className="block text-sm font-semibold text-ink-500">
                    Order Gas
                  </span>
                  <span className="block text-xs text-muted-500">
                    Place a refill order now
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={onUpdateInputs}
                className="flex flex-col items-start gap-2 rounded-xl border border-border p-4 text-left hover:bg-muted-50"
              >
                <RotateCcw size={16} className="text-brand-500" />
                <span>
                  <span className="block text-sm font-semibold text-ink-500">
                    Data Usage
                  </span>
                  <span className="block text-xs text-muted-500">
                    Adjust your consumption data
                  </span>
                </span>
              </button>

              <button
                type="button"
                className="flex flex-col items-start gap-2 rounded-xl border border-border p-4 text-left hover:bg-muted-50"
              >
                <Bell size={16} className="text-brand-500" />
                <span>
                  <span className="block text-sm font-semibold text-ink-500">
                    Snooze
                  </span>
                  <span className="block text-xs text-muted-500">
                    Remind me in 2 days
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex w-full flex-col gap-4 lg:w-72 lg:shrink-0">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-400">
              <Flame size={12} /> Daily Consumption
            </p>
            <p className="mt-1.5 text-xl font-bold text-ink-500">
              {result.dailyConsumptionKg} kg
            </p>
            <p className="text-xs text-muted-400">
              Average per day based on your inputs
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-400">
              <Fuel size={12} /> Cylinder
            </p>
            <p className="mt-1.5 text-xl font-bold text-ink-500">
              {result.cylinderCapacity}
            </p>
            <p className="text-xs text-muted-400">
              Full refill · Last filled{" "}
              {result.lastFilled ? formatShortDate(result.lastFilled) : "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-400">
              <Users size={12} /> Household
            </p>
            <p className="mt-1.5 text-xl font-bold text-ink-500">
              {result.householdSize} People
            </p>
            <p className="text-xs text-muted-400">
              Cooking {input.cookingFrequencyPerDay}x daily
            </p>
          </div>

          <div className="rounded-2xl border border-notify-200 bg-notify-50/60 p-4">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-notify-700">
              <Info size={14} /> Limited History
            </p>
            <p className="mt-1.5 text-xs text-notify-700/80">
              Based on 1 refill entry. Add more refill records to increase
              your confidence level
            </p>
            <button
              type="button"
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-notify-300 bg-white py-2 text-xs font-semibold text-notify-700 hover:bg-notify-50"
            >
              <Plus size={13} /> Add Refill History
            </button>
          </div>

          <div className="rounded-2xl bg-brand-500 p-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
              Nearby
            </p>
            <p className="mt-1 text-base font-bold">{nearbyVendor.name}</p>
            <p className="mt-0.5 text-xs text-white/70">
              {nearbyVendor.distanceKm}km · ₦
              {nearbyVendor.price.toLocaleString()}.00 · In stock · {nearbyVendor.eta}
            </p>
            <button
              type="button"
              onClick={() => router.push("/customer/orders/vendor-selection")}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-white py-2 text-sm font-semibold text-brand-500 hover:bg-white/90"
            >
              Order Now <ArrowRight size={14} />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
