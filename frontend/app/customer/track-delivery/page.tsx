"use client";

import { useState } from "react";
import { MapPin, Clock, Truck, Home, Plus, Minus, LocateFixed } from "lucide-react";
import OrderStatusStepper from "@/components/tracking/OrderStatusStepper";
import DeliveryTimeline from "@/components/tracking/DeliveryTimeline";
import OrderDetailsCard from "@/components/tracking/OrderDetailsCard";
import DeliveryPersonnelCard from "@/components/tracking/DeliveryPersonnelCard";
import NeedHelpCard from "@/components/tracking/NeedHelpCard";
import OrderStatusModal, {
  type OrderStatus,
} from "@/components/tracking/OrderStatusModal";

export default function TrackDeliveryPage() {
  const [previewStatus, setPreviewStatus] = useState<OrderStatus | null>(null);

  return (
    <main>
      <div className="mb-4 flex flex-wrap gap-2 rounded-lg border border-dashed border-notify-400 bg-notify-50 p-3">
        <span className="text-xs font-medium text-notify-700">
          Preview status popups:
        </span>
        <button
          onClick={() => setPreviewStatus("confirmed")}
          className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-ink-500 hover:bg-brand-50"
        >
          Confirmed
        </button>
        <button
          onClick={() => setPreviewStatus("on-the-way")}
          className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-ink-500 hover:bg-brand-50"
        >
          On the way
        </button>
        <button
          onClick={() => setPreviewStatus("arriving-soon")}
          className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-ink-500 hover:bg-brand-50"
        >
          Arriving soon
        </button>
      </div>

      <div>
        <h1 className="font-heading text-xl font-bold text-ink-500">
          Track Your Order
        </h1>
        <p className="text-sm text-muted-500">
          Real-time updates on your gas delivery.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <OrderStatusStepper />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50">
                <Clock size={16} className="text-brand-500" />
              </span>
              <div>
                <p className="text-xs text-muted-500">
                  Estimated Delivery Time
                </p>
                <p className="text-sm font-bold text-ink-500">
                  11:30 AM - 12:00 PM
                </p>
              </div>
            </div>
            <p className="max-w-[220px] text-xs text-muted-500">
              Your delivery partner is verified and trained to ensure safe
              delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50">
                <Truck size={16} className="text-brand-500" />
              </span>
              <div>
                <p className="text-xs text-muted-500">Delivery Partner</p>
                <p className="text-sm font-semibold text-ink-500">
                  2.3 Km away
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50">
                <Home size={16} className="text-brand-500" />
              </span>
              <div>
                <p className="text-xs text-muted-500">Your Location</p>
                <p className="text-sm font-semibold text-ink-500">
                  Ikeja, Lagos
                </p>
              </div>
            </div>
          </div>

          <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted-50">
            <div className="flex flex-col items-center gap-1 text-muted-400">
              <MapPin size={24} />
              <span className="text-xs">Map preview coming soon</span>
            </div>

            <div className="absolute right-3 top-3 flex flex-col overflow-hidden rounded-lg border border-border bg-white shadow-sm">
              <button
                aria-label="Zoom in"
                className="p-2 text-ink-500 hover:bg-brand-50"
              >
                <Plus size={14} />
              </button>
              <div className="h-px w-full bg-border" />
              <button
                aria-label="Zoom out"
                className="p-2 text-ink-500 hover:bg-brand-50"
              >
                <Minus size={14} />
              </button>
            </div>
            <button
              aria-label="Center on my location"
              className="absolute bottom-3 right-3 rounded-full border border-border bg-white p-2 text-brand-500 shadow-sm hover:bg-brand-50"
            >
              <LocateFixed size={16} />
            </button>
          </div>

          <DeliveryTimeline />
        </div>

        <div className="flex flex-col gap-5">
          <OrderDetailsCard />
          <DeliveryPersonnelCard />
          <NeedHelpCard />
        </div>
      </div>

      {previewStatus && (
        <OrderStatusModal
          isOpen={!!previewStatus}
          onClose={() => setPreviewStatus(null)}
          status={previewStatus}
        />
      )}
    </main>
  );
}