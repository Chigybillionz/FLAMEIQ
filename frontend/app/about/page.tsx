"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Flame } from "lucide-react";


interface AboutParagraphSection {
  title?: string;
  paragraphs: string[];
}

const ABOUT_CONTENT: AboutParagraphSection[] = [
  {
    paragraphs: [
      "FlameIntel is a digital platform for liquefied petroleum gas (LPG) ordering and refill planning. We connect customers with verified gas vendors, show clear prices before you pay, and let you follow your delivery on the map until it reaches your door.",
      "Many people only discover their cylinder is empty when cooking stops. FlameIntel uses your refill history and household usage patterns to estimate when you may need gas again, and can remind you before you run out. Estimates improve as you log more refills. They are not based on a physical sensor on the cylinder, and they are not a guarantee of the exact moment gas will finish.",
      "Our focus is Lagos, starting with dense corridors where fast, reliable delivery is realistic. We work with verified vendors, support transparent pricing (gas plus delivery shown before payment), and provide order tracking that includes the delivery person’s live location while your order is on the way — subject to device and network availability.",
      "FlameIntel is built for everyday households first. Businesses may use the platform where multi-cylinder or higher-volume features are available, subject to the same terms of service."
    ]
  },
  {
    title: "What We Believe",
    paragraphs: [
      "You should see the full price before you pay.",
      "You should know who is bringing your gas and where they are on the way.",
      "You should not need special hardware to plan your next refill.",
      "Vendors and customers both deserve clear rules, fair fees, and a way to resolve problems."
    ]
  }
];

export default function AboutPage() {
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
          <Link href="/about" className="text-white font-medium underline underline-offset-4">About</Link>
          <Link 
            href={userRole === "vendor" ? "/vendor-faq" : "/customer-faq"} 
            className="hover:text-white"
          >
            FAQ
          </Link>
          <Link href="/#contact" className="hover:text-white">Contact</Link>
        </nav>
      </header>

      
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-bold text-ink-500">
          About FlameIntel
        </h1>

        <div className="mt-6 rounded-lg border border-dashed border-brand-300 bg-brand-50/30 p-6 space-y-6">
          {ABOUT_CONTENT.map((section, sectionIdx) => (
            <div key={sectionIdx} className="space-y-3">
              {section.title && (
                <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500 mt-6 first:mt-0">
                  {section.title}
                </h2>
              )}
              {section.paragraphs.map((p, pIdx) => (
                <p 
                  key={pIdx} 
                  className="text-sm leading-relaxed text-ink-500 opacity-90"
                >
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Corporate Legal & Compliance Section Footer Block */}
        <div className="mt-8 text-sm text-muted-500 space-y-1">
          <p className="font-semibold text-ink-500">FLAMEINTEL CORPORATION</p>
          <p>Operated by [Company legal name], registered in Nigeria [RC number].</p>
          <p>Registered address: [Address].</p>
          <p>Contact: [support email] / [phone].</p>
          <p className="mt-2 text-xs italic">Last updated: August 2026</p>
        </div>

        {/* Brand System Standard Dynamic Navigation Action Button */}
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
