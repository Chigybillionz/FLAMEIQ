"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Flame } from "lucide-react";


interface ContactSection {
  title: string;
  paragraphs: string[];
}

const CONTACT_SECTIONS: ContactSection[] = [
  {
    title: "Support Promise",
    paragraphs: [
      "We are here to help with orders, payments, delivery tracking, vendor issues, and account questions. Start with self-service where possible so simple issues resolve faster; escalate to a human when you need one."
    ]
  },
  {
    title: "Channels",
    paragraphs: [
      "In-app Support: open Support from the menu (recommended — we can see your order context).",
      "AI Assistant: available 24/7 for FAQs, order status explanations, and step-by-step help. Say 'speak to a human' or choose Live agent when you prefer a person.",
      "Live Agent: available Monday–Saturday, 8:00–20:00 WAT. Outside those hours, leave a message; we aim to respond within 24 hours on business days.",
      "Email: support@flameintel.example",
      "Phone / WhatsApp Business: [Insert Number] (order ID ready if calling about a delivery)",
      "Office (not walk-in support): [Registered address]"
    ]
  },
  {
    title: "What To Include So We Can Help Faster",
    paragraphs: [
      "• Registered phone number on the account",
      "• Order reference",
      "• Short description of the issue (payment failed, rider location stuck, wrong address, etc.)",
      "• Screenshots where useful"
    ]
  },
  {
    title: "AI Assistant vs Live Agent",
    paragraphs: [
      "The AI assistant answers common questions, helps you find order status, and explains features such as tracking and refill estimates. It does not replace emergency services and cannot override bank or payment-provider decisions.",
      "Choose Live agent for payment disputes, safety concerns, repeated failed deliveries, verification problems, or anything the assistant cannot resolve. Abusive messages to agents or riders may lead to account restrictions."
    ]
  },
  {
    title: "Safety and Emergencies",
    paragraphs: [
      "If you smell gas, see a leak, or face an immediate danger, leave the area if needed and contact emergency services and your gas supplier’s emergency line. FlameIntel Support is not an emergency response service."
    ]
  },
  {
    title: "Vendor Applicants",
    paragraphs: [
      "To sell on FlameIntel, use [Become a vendor] in the product or email vendors@flameintel.example with your business name, service area, and contact person."
    ]
  },
  {
    title: "Legal and Privacy Requests",
    paragraphs: [
      "Legal Notices: legal@flameintel.example",
      "Privacy / Data Requests: privacy@flameintel.example (see Privacy Policy)"
    ]
  }
];

export default function ContactPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const userRole = searchParams.get("role");

  const handleBackNavigation = () => {
    if (userRole === "customer") {
      router.push("/customer/profile");
    } else if (userRole === "vendor") {
      router.push("/vendor/profile");
    } else {
      router.push("/");
    }
  };

  const getButtonLabel = () => {
    if (userRole === "customer") return "Return to Customer Profile";
    if (userRole === "vendor") return "Return to Vendor Profile";
    return "Return to Home";
  };

  return (
    <main className="min-h-screen bg-background text-left">
      
      <header className="flex items-center justify-between bg-brand-900 px-6 py-4 md:px-12">
        <Link href="/" className="flex items-center gap-1.5 text-lg font-bold text-white">
          <Flame size={18} className="text-notify-400" fill="currentColor" />
          Flame<span className="text-notify-400">Intel</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-white/80">
          <Link href="/about" className="hover:text-white">About</Link>
          <Link 
            href={userRole === "vendor" ? "/vendor-faq" : "/customer-faq"} 
            className="hover:text-white"
          >
            FAQ
          </Link>
          <Link href="/contact" className="text-white font-medium underline underline-offset-4">Contact</Link>
        </nav>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-bold text-ink-500">
          Contact Us & Support
        </h1>

        <div className="mt-6 rounded-lg border border-dashed border-brand-300 bg-brand-50/30 p-6 space-y-6">
          <p className="text-sm leading-relaxed text-ink-500 italic">
            Need help? Open Support in the app — AI assistant 24/7, or Live agent during service hours. Email support@flameintel.example.
          </p>

          {CONTACT_SECTIONS.map((section) => (
            <div key={section.title} className="mt-6 border-t border-[#E2E4E9]/40 pt-4 first:border-0 first:pt-0">
              <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">
                {section.title}
              </h2>
              <div className="mt-2 space-y-2">
                {section.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="text-sm leading-relaxed text-ink-500 opacity-95"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-sm text-muted-500">
          <p className="font-semibold text-ink-500">FLAMEINTEL SUPPORT NETWORK</p>
          <p>Web Platform for LPG Ordering and Refill Planning</p>
          <p>Lagos, Nigeria</p>
          <p className="mt-1 text-xs">Last updated: August 2026</p>
        </div>

        <button
          onClick={handleBackNavigation}
          className="mt-6 w-full rounded-lg bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-hover transition-all"
        >
          {getButtonLabel()}
        </button>
      </div>
    </main>
  );
}
