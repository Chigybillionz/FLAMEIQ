import Image from "next/image";
import { Phone, Star, ShieldCheck } from "lucide-react";

export default function DeliveryPersonnelCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="text-sm font-semibold text-ink-500">
        Delivery Personnel
      </h2>

      <div className="mt-3 flex items-center gap-3">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-muted-50">
          <Image
            src="/images/delivery-rider.jpg"
            alt="Emeka Johnson"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold text-ink-500">Emeka Johnson</p>
          <p className="flex items-center gap-1 text-xs text-muted-500">
            <Star size={11} className="text-notify-500" fill="currentColor" strokeWidth={0} />
            4.8 (230 deliveries)
          </p>
        </div>

        <button
          aria-label="Call delivery personnel"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-ink-500 hover:bg-brand-50"
        >
          <Phone size={15} />
        </button>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg bg-brand-50 px-3 py-2.5">
        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-brand-500" />
        <p className="text-xs text-brand-700">
          Your delivery personnel is verified and trained to ensure safe
          delivery.
        </p>
      </div>
    </div>
  );
}