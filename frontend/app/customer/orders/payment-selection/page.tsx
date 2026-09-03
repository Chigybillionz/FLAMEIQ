import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import PaymentMethod from "@/components/orders/PaymentMethod";

export default function PaymentSelectionPage() {
  return (
    <div className="w-full">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1.5 text-xs text-muted-500">
        <Link href="/customer/dashboard" className="hover:text-ink-500">
          Dashboard
        </Link>
        <ChevronRight size={12} />
        <span className="text-ink-500">Order Gas</span>
      </div>

      {/* Main Title Heading */}
      <h1 className="font-heading mt-1 text-xl font-bold text-ink-500">
        Order Gas
      </h1>

      {/* Back Button leading to Order Summary layout */}
      <Link
        href="/customer/orders/summary"
        className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-ink-500 hover:bg-brand-50 transition-colors"
      >
        <ArrowLeft size={14} /> Back
      </Link>

      {/* Interactive Payment Methods List Renderer */}
      <div className="mt-6">
        <PaymentMethod />
      </div>
    </div>
  );
}
