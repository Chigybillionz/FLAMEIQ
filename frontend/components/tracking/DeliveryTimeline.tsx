import { Check, Truck, MapPin, Circle } from "lucide-react";

const TIMELINE = [
  {
    label: "Order Placed",
    time: "Today, 10:15 AM",
    description: "Your order has been placed successfully.",
    status: "done" as const,
  },
  {
    label: "Order Confirmed",
    time: "Today, 10:18 AM",
    description: "Your order has been confirmed by FlameIntel.",
    status: "done" as const,
  },
  {
    label: "On the way",
    time: "Today, 10:45 AM",
    description: "Your delivery personnel is on the way to you.",
    status: "active" as const,
  },
  {
    label: "Arriving soon",
    time: "Est, 11:35 AM",
    description: "Your delivery personnel will arrive shortly.",
    status: "pending" as const,
  },
  {
    label: "Delivered",
    time: "",
    description: "Your order will be marked as delivered upon arrival.",
    status: "pending" as const,
  },
];

function StepIcon({ status, isLast }: { status: "done" | "active" | "pending"; isLast: boolean }) {
  if (status === "done") {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white">
        <Check size={13} />
      </span>
    );
  }
  if (status === "active") {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white">
        <Truck size={13} />
      </span>
    );
  }
  if (isLast) {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-muted-200 text-muted-400">
        <Circle size={9} fill="currentColor" strokeWidth={0} />
      </span>
    );
  }
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-muted-200 text-muted-400">
      <MapPin size={12} />
    </span>
  );
}

export default function DeliveryTimeline() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="text-sm font-semibold text-ink-500">Delivery Timeline</h2>

      <div className="mt-4 flex flex-col">
        {TIMELINE.map((item, i) => (
          <div key={item.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <StepIcon status={item.status} isLast={i === TIMELINE.length - 1} />
              {i < TIMELINE.length - 1 && (
                <div
                  className={`w-px flex-1 ${
                    item.status === "done" ? "bg-brand-500" : "bg-border"
                  }`}
                  style={{ minHeight: "28px" }}
                />
              )}
            </div>
            <div className="pb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-ink-500">
                  {item.label}
                </span>
                {item.time && (
                  <span className="text-[11px] text-muted-500">
                    {item.time}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-500">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}