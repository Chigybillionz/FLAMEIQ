import { Check, ShieldCheck } from "lucide-react";

const STEPS = [
  { title: "Order Summary", description: "Review your order details" },
  { title: "Select Payment method", description: "Review your order details" },
  { title: "Payment Details", description: "Review your order details" },
  { title: "Confirmation", description: "Review your order details" },
];

export default function PaymentStepsTracker({
  completedSteps,
}: {
  completedSteps: number;
}) {
  return (
    <aside className="flex w-full flex-col gap-4 lg:w-72 lg:shrink-0">
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-ink-500">Payment Steps</h3>

        <div className="mt-4 flex flex-col">
          {STEPS.map((step, index) => {
            const stepNumber = index + 1;
            const isDone = stepNumber <= completedSteps;
            const isLast = index === STEPS.length - 1;

            return (
              <div key={step.title} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      isDone
                        ? "bg-brand-500 text-white"
                        : "bg-muted-100 text-muted-400"
                    }`}
                  >
                    {isDone && <Check size={13} />}
                  </span>
                  {!isLast && (
                    <span
                      className={`w-px flex-1 ${
                        isDone ? "bg-brand-500" : "bg-muted-100"
                      }`}
                      style={{ minHeight: "26px" }}
                    />
                  )}
                </div>

                <div className={isLast ? "pb-0.5" : "pb-6"}>
                  <p
                    className={`text-sm font-medium ${
                      isDone ? "text-ink-500" : "text-muted-400"
                    }`}
                  >
                    {stepNumber}. {step.title}
                  </p>
                  <p className="text-xs text-muted-400">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl bg-brand-50/60 p-4">
        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-brand-500" />
        <div>
          <p className="text-xs font-semibold text-ink-500">
            Secure & Verified
          </p>
          <p className="mt-0.5 text-xs text-muted-500">
            All payments are secured and encrypted
          </p>
        </div>
      </div>
    </aside>
  );
}
