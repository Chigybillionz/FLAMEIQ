"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  Clock3,
  Copy,
  Check,
  Info,
  Landmark,
  User,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { useOrder } from "@/context/OrderContext";
import PaymentStepsTracker from "@/components/orders/PaymentStepsTracker";

// --- Types ---
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface BankDetails {
  bankName: string;
  bankTag: string;
  accountName: string;
  accountNumber: string;
}

type FlowStage = "details" | "verifying" | "success";

// --- Helper Functions ---
function generateOrderId(): string {
  return `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
}

function generatePaymentReference(): string {
  return `GH-TRF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

function formatTransactionTime(): string {
  return new Date().toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatCurrency(amount: number, showSymbol: boolean = true): string {
  const formatted = new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return showSymbol ? `₦${formatted}` : formatted;
}

// --- Constants ---
const BANK_DETAILS: BankDetails = {
  bankName: "GTBank",
  bankTag: "GTCO",
  accountName: "GasHub Ltd",
  accountNumber: "0123456789",
};

export default function BankTransferPage() {
  const router = useRouter();
  const { order } = useOrder();

  const [stage, setStage] = useState<FlowStage>("details");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const amount = useMemo(
    () => (order?.pricePerUnit ?? 0) * (order?.quantity ?? 0) + (order?.deliveryFee ?? 0),
    [order?.pricePerUnit, order?.quantity, order?.deliveryFee]
  );

  const [orderId] = useState(generateOrderId);
  const [reference] = useState(() => generatePaymentReference());
  const [transactionTime] = useState(() => formatTransactionTime());

  const status: PaymentStatus =
    stage === "success" ? "SUCCESS" : stage === "verifying" ? "PENDING" : "PENDING";

  useEffect(() => {
    if (stage !== "verifying") return;
    const timer = setTimeout(() => setStage("success"), 3500);
    return () => clearTimeout(timer);
  }, [stage]);

  const handleCopy = async (field: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField((current) => (current === field ? null : current)), 1500);
    } catch {
      // Clipboard API fallback / silent handling
    }
  };

  const handleCopyAll = () => {
    const all = `Bank Name: ${BANK_DETAILS.bankName}\nAccount Name: ${BANK_DETAILS.accountName}\nAccount Number: ${BANK_DETAILS.accountNumber}\nReference: ${reference}`;
    handleCopy("all", all);
  };

  const completedSteps = stage === "success" ? 4 : 3;

  return (
    <div>
      <div className="mb-6">
        <nav className="flex items-center gap-1.5 text-xs text-muted-500">
          <Link href="/customer/dashboard" className="hover:text-ink-500">
            Dashboard
          </Link>
          <ChevronRight size={12} />
          <span className="text-ink-500">Order Gas</span>
        </nav>
        <h1 className="mt-1 text-2xl font-bold text-ink-500">Order Gas</h1>
      </div>

      <button
        type="button"
        onClick={() => router.push("/customer/orders/payment-selection")}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-500 hover:underline"
      >
        <ArrowLeft size={14} /> Back to payment method
      </button>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex-1 rounded-2xl border border-border bg-card p-6">
          {stage === "details" && (
            <>
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50">
                  <Landmark size={20} className="text-brand-500" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-ink-500">
                    Payment via Bank Transfer
                  </h2>
                  <p className="mt-1 text-sm text-muted-500">
                    Transfer the exact amount to the account details below,
                    your order will be confirmed once payment is verified.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-medium text-ink-500">
                  Order Amount
                </span>
                <span className="text-2xl font-bold text-ink-500">
                  {formatCurrency(amount, true)}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2 rounded-lg bg-muted-50/70 px-4 py-3 text-sm text-ink-500">
                <Info size={16} className="shrink-0 text-muted-500" />
                Please note the amount is fixed and can&apos;t be altered
              </div>

              <div className="mt-5 overflow-hidden rounded-xl border border-border">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <span className="text-sm font-semibold text-brand-500">
                    Bank Details
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyAll}
                    className="flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-brand-500"
                  >
                    {copiedField === "all" ? (
                      <Check size={14} className="text-success" />
                    ) : (
                      <Copy size={14} />
                    )}
                    Copy All
                  </button>
                </div>

                <div className="flex items-center justify-between px-4 py-3">
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-orange-500 text-[10px] font-bold text-white">
                      {BANK_DETAILS.bankTag}
                    </span>
                    <span>
                      <span className="block text-xs text-muted-500">
                        Bank Name
                      </span>
                      <span className="block text-sm font-semibold text-ink-500">
                        {BANK_DETAILS.bankName}
                      </span>
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy("bankName", BANK_DETAILS.bankName)}
                    className="rounded-md p-1.5 text-muted-500 hover:bg-muted-50 hover:text-ink-500"
                    aria-label="Copy bank name"
                  >
                    {copiedField === "bankName" ? (
                      <Check size={15} className="text-success" />
                    ) : (
                      <Copy size={15} />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between border-t border-border px-4 py-3">
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted-50 text-muted-500">
                      <User size={15} />
                    </span>
                    <span>
                      <span className="block text-xs text-muted-500">
                        Account Name
                      </span>
                      <span className="block text-sm font-semibold text-ink-500">
                        {BANK_DETAILS.accountName}
                      </span>
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy("accountName", BANK_DETAILS.accountName)
                    }
                    className="rounded-md p-1.5 text-muted-500 hover:bg-muted-50 hover:text-ink-500"
                    aria-label="Copy account name"
                  >
                    {copiedField === "accountName" ? (
                      <Check size={15} className="text-success" />
                    ) : (
                      <Copy size={15} />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between border-t border-border px-4 py-3">
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted-50 text-muted-500">
                      <CreditCard size={15} />
                    </span>
                    <span>
                      <span className="block text-xs text-muted-500">
                        Account Number
                      </span>
                      <span className="block text-sm font-semibold text-ink-500">
                        {BANK_DETAILS.accountNumber}
                      </span>
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy("accountNumber", BANK_DETAILS.accountNumber)
                    }
                    className="rounded-md p-1.5 text-muted-500 hover:bg-muted-50 hover:text-ink-500"
                    aria-label="Copy account number"
                  >
                    {copiedField === "accountNumber" ? (
                      <Check size={15} className="text-success" />
                    ) : (
                      <Copy size={15} />
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-muted-50/70 p-4">
                <p className="text-sm font-semibold text-brand-500">
                  Payment Reference (Important)
                </p>
                <p className="mt-1 text-sm text-muted-500">
                  Use the reference below as the payment narration.
                </p>

                <button
                  type="button"
                  onClick={() => handleCopy("reference", reference)}
                  className="mt-3 flex w-full items-center justify-between rounded-lg border border-border bg-white px-4 py-3"
                >
                  <span className="text-base font-bold tracking-wide text-brand-500">
                    {reference}
                  </span>
                  {copiedField === "reference" ? (
                    <Check size={16} className="text-success" />
                  ) : (
                    <Copy size={16} className="text-muted-500" />
                  )}
                </button>

                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-500">
                  <Info size={12} />
                  Using the correct reference helps us verify your payment
                  faster.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStage("verifying")}
                className="mt-6 w-full rounded-lg bg-brand-500 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
              >
                I&apos;ve Made This Transfer
              </button>
            </>
          )}

          {stage === "verifying" && (
            <PaymentStatusView
              icon={
                <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-muted-100">
                  <Landmark size={26} className="text-ink-500" />
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow ring-1 ring-border">
                    <Clock3 size={13} className="text-notify-500" />
                  </span>
                </span>
              }
              title="Payment Verification"
              message="We're verifying your bank transfer. This usually takes a few minutes."
              orderId={orderId}
              amount={amount}
              reference={reference}
              transactionTime={transactionTime}
              status={status}
              footer={
                <button
                  type="button"
                  onClick={() => router.push("/customer/orders/payment-selection")}
                  className="w-full rounded-lg border border-border py-3 text-sm font-semibold text-ink-500 hover:bg-muted-50"
                >
                  Cancel Payment
                </button>
              }
            />
          )}

          {stage === "success" && (
            <PaymentStatusView
              icon={
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle2 size={30} className="text-success" />
                </span>
              }
              title="Payment Successful 🎉"
              message="Your payment has been successfully verified. Thank you for your order."
              orderId={orderId}
              amount={amount}
              reference={reference}
              transactionTime={transactionTime}
              status="SUCCESS"
              footer={
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => router.push("/customer/track-delivery")}
                    className="w-full rounded-lg bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-hover"
                  >
                    Track Your Order
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/customer/dashboard")}
                    className="w-full rounded-lg border border-border py-3 text-sm font-semibold text-ink-500 hover:bg-muted-50"
                  >
                    Back to Home
                  </button>
                </div>
              }
            />
          )}
        </div>

        <PaymentStepsTracker completedSteps={completedSteps} />
      </div>
    </div>
  );
}

function PaymentStatusView({
  icon,
  title,
  message,
  orderId,
  amount,
  reference,
  transactionTime,
  status,
  footer,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  orderId: string;
  amount: number;
  reference: string;
  transactionTime: string;
  status: PaymentStatus;
  footer: React.ReactNode;
}) {
  const statusStyles: Record<PaymentStatus, string> = {
    PENDING: "bg-notify-50 text-notify-700",
    SUCCESS: "bg-success/10 text-success",
    FAILED: "bg-error/10 text-error",
  };
  const statusLabel: Record<PaymentStatus, string> = {
    PENDING: "Verifying",
    SUCCESS: "Successful",
    FAILED: "Failed",
  };

  return (
    <div>
      <div className="mx-auto flex max-w-sm flex-col items-center rounded-2xl border border-border p-8 text-center">
        {icon}
        <h2 className="mt-4 text-xl font-bold text-ink-500">{title}</h2>
        <p className="mt-2 text-sm text-muted-500">{message}</p>
      </div>

      <div
        className={`mt-5 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium ${
          status === "SUCCESS"
            ? "bg-success/10 text-success"
            : "bg-notify-50 text-notify-700"
        }`}
      >
        {status === "SUCCESS" ? (
          <CheckCircle2 size={16} className="shrink-0" />
        ) : (
          <Clock3 size={16} className="shrink-0" />
        )}
        {status === "SUCCESS"
          ? "Your order is now confirmed and being processed."
          : "Payment verification in progress. Please do not close this window."}
      </div>

      <div className="mt-5 rounded-xl border border-border p-5">
        <p className="text-sm font-semibold text-brand-500">Payment Summary</p>

        <div className="mt-3 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-500">Order ID</span>
            <span className="font-medium text-ink-500">{orderId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-500">Order Amount</span>
            <span className="font-medium text-ink-500">
              {formatCurrency(amount, true)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-500">Payment Method</span>
            <span className="font-medium text-ink-500">Bank Transfer</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-500">Payment Reference</span>
            <span className="font-medium text-ink-500">{reference}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-500">Transaction Time</span>
            <span className="font-medium text-ink-500">{transactionTime}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-500">Status</span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
            >
              {statusLabel[status]}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6">{footer}</div>
    </div>
  );
}