"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Flame } from "lucide-react";

interface PolicySection {
  title: string;
  paragraphs: string[];
}

const PRIVACY_SECTIONS: PolicySection[] = [
  {
    title: "1. Who we are and how to contact us",
    paragraphs: [
      "FlameIntel is operated by [Company legal name], registered in Nigeria under RC No. [RC number], with registered address at [Address].",
      "Privacy and data-protection enquiries: [privacy@flameintel.example]",
      "Security incident reports: [security@flameintel.example]",
      "General support: channels listed under Contact Us on the Service.",
      "Where required under the Nigeria Data Protection Act 2023 (NDPA) and applicable regulations, we act as a data controller for personal data processed in connection with the Service. Payment providers and other processors act on documented instructions or under their own notices where they are independent controllers."
    ]
  },
  {
    title: "2. Scope of this Policy",
    paragraphs: [
      "This Policy applies to personal data processed through:",
      "• Customer accounts, ordering, payment confirmation, delivery tracking, ratings, and support",
      "• Vendor registration, verification, order fulfilment tools, and settlement records",
      "• Refill estimates and reminders based on information you provide and order history",
      "• Website logs, device information, and security monitoring reasonably necessary to operate and protect the Service.",
      "This Policy does not cover third-party websites or applications that we do not control, even if linked from the Service."
    ]
  },
  {
    title: "3. Personal data we collect",
    paragraphs: [
      "Data you provide: full name or business name, mobile number, email address (if provided), account credentials (OTP tokens; we do not store raw card PINs), delivery address details, landmarks, and cylinder order sizing requirements (e.g. 6kg, 12.5kg). For vendors, we collect onboarding business specs, price lists, and compliance documents.",
      "Data generated through use: order status history, approximate live location of the delivery person while active tracking is on, device diagnostic logs, and security signals like failed login attempts.",
      "Data from payment providers: confirmation of payment status, transaction references, and amount. We do not store full card PAN or CVV numbers on FlameIntel databases.",
      "Data we do not collect by design: hardware sensor readings from cylinders (we use pure software estimates) and continuous background client location data."
    ]
  },
  {
    title: "4. Purposes and legal bases",
    paragraphs: [
      "We process personal data to manage profiles, match customers with verified vendors, map live delivery routes, securely handle transactional reconciliation with banks, and run the automated logistics calculation logic.",
      "Where Nigerian law requires consent for processing activities (such as specific advertising metrics), we will explicitly request it, and you retain the right to withdraw it at any point through your dashboard configurations."
    ]
  },
  {
    title: "5. Live tracking and location",
    paragraphs: [
      "When an order is out for delivery, the Service may show the approximate location of the delivery person on a map using data from their device. Location accuracy depends on GPS, device permissions, and network conditions.",
      "Customers and other users must not harass, threaten, or misuse location or contact information relating to delivery personnel. Abuse may lead to account restriction under the Terms."
    ]
  },
  {
    title: "6. Refill estimates and related data",
    paragraphs: [
      "Refill estimates use information you supply (such as cylinder size and household context) and your order or refill history. They are software estimates, not measurements from a sensor on your cylinder. You remain responsible for monitoring your gas supply for safety.",
      "We may use de-identified or aggregated usage patterns to improve estimate quality. We do not sell personal refill profiles as a standalone consumer data product."
    ]
  },
  {
    title: "7. Information security (cybersecurity controls)",
    paragraphs: [
      "FlameIntel applies administrative, technical, and organisational measures designed to protect confidentiality, integrity, and availability.",
      "This includes role-based access management, encrypted transmission for data in transit (SSL/TLS), dependency hygiene, server-side confirmation for transaction records, and formal processes for responding to suspected data breach incidents under Nigerian compliance rules."
    ]
  },
  {
    title: "8. Your rights",
    paragraphs: [
      "Subject to the Nigeria Data Protection Act 2023 (NDPA), you may have the right to request access to the personal data we hold about you, request corrections to incomplete entries, or ask for deletion where it does not overwrite legal record retention duties.",
      "To exercise these data protection rights, please contact [privacy@flameintel.example] with sufficient detail for us to verify your identity."
    ]
  }
];

export default function PrivacyPolicyPage() {
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
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </nav>
      </header>

     
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-bold text-ink-500">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-muted-500">
          Including Data Protection and Information Security Practices
        </p>

    
        <div className="mt-6 rounded-lg border border-dashed border-brand-300 bg-brand-50/30 p-6 space-y-6">
          <p className="text-sm leading-relaxed text-ink-500">
            This Privacy Policy explains how [Company legal name] (“FlameIntel”, “we”, “us”) collects, uses, stores, shares, and protects personal data when you use the FlameIntel website and related services (the “Service”). It is written for customers, vendors, and visitors, and reflects our product design, operational needs, and information-security controls.
          </p>

          {PRIVACY_SECTIONS.map((section) => (
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
          <p className="font-semibold text-ink-500">FLAMEINTEL COMPLIANCE CORE</p>
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
