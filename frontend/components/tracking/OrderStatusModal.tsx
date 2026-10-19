"use client";

import Link from "next/link";
import { CheckCircle2, Truck, MapPin, ArrowRight } from "lucide-react";

export type OrderStatus = "confirmed" | "on-the-way" | "arriving-soon";

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    title: string;
    description: string[];
    eta?: string;
    highlighted: boolean;
  }
> = {
  confirmed: {
    icon: CheckCircle2,
    iconBg: "bg-success/10",
    iconColor: "text-success",
    title: "Order Confirmed",
    description: [
      "Your vendor has accepted your order.",
      "Your rider is on the way",
    ],
    highlighted: false,
  },
  "on-the-way": {
    icon: Truck,
    iconBg: "bg-brand-50",
    iconColor: "text-brand-500",
    title: "On The way",
    description: [
      "Your delivery partner is heading to you",
      "with your gas.",
    ],
    eta: "ETA: 20 - 30 mins",
    highlighted: true,
  },
  "arriving-soon": {
    icon: MapPin,
    iconBg: "bg-notify-50",
    iconColor: "text-error",
    title: "Arriving Soon",
    description: [
      "Your vendor is outside!",
      "Please, be ready to receive your order",
    ],
    highlighted: false,
  },
};

export default function OrderStatusModal({
  isOpen,
  onClose,
  status,
  orderId = "#cde-qwer912",
  estimatedDelivery = "Today, 11:13 AM",
}: {
  isOpen: boolean;
  onClose: () => void;
  status: OrderStatus;
  orderId?: string;
  estimatedDelivery?: string;
}) {
  if (!isOpen) return null;

  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-500/60 p-6">
      <div className="w-full max-w-xs rounded-2xl bg-white p-6 text-center shadow-lg">
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${config.iconBg}`}
        >
          <Icon size={28} className={config.iconColor} />
        </div>

        {config.highlighted ? (
          <div className="mt-4 rounded-lg border border-dashed border-brand-300 bg-brand-50/40 px-4 py-3">
            <h2 className="font-heading text-lg font-bold text-ink-500">
              {config.title}
            </h2>
            {config.description.map((line) => (
              <p key={line} className="mt-1 text-sm text-muted-500">
                {line}
              </p>
            ))}
            {config.eta && (
              <p className="mt-1 text-sm font-semibold text-brand-500">
                {config.eta}
              </p>
            )}
          </div>
        ) : (
          <>
            <h2 className="font-heading mt-4 text-lg font-bold text-ink-500">
              {config.title}
            </h2>
            {config.description.map((line) => (
              <p key={line} className="mt-1 text-sm text-muted-500">
                {line}
              </p>
            ))}
          </>
        )}

        <div className="mt-4 rounded-lg bg-muted-50 p-3 text-left text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-500">Order ID</span>
            <span className="font-medium text-ink-500">{orderId}</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-muted-500">Estimated Delivery</span>
            <span className="font-medium text-ink-500">
              {estimatedDelivery}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
        >
          ok
        </button>

        <Link
          href="/customer/track-delivery"
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-ink-500 hover:bg-brand-50"
        >
          Back to Home <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
