"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Flame } from "lucide-react";


interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  category: string;
  items: FAQItem[];
}

const FAQ_SECTIONS: FAQCategory[] = [
  {
    category: "GENERAL",
    items: [
      {
        question: "What is FlameIntel?",
        answer: "FlameIntel is a web platform to order cooking gas from verified vendors in Lagos, track your delivery on a map, and get smart reminders for when you may need a refill — without installing a sensor on your cylinder."
      },
      {
        question: "Do I need to download an app?",
        answer: "FlameIntel is built as a mobile-friendly website. You can use it from a phone browser. Native store apps may come later."
      },
      {
        question: "Where do you operate?",
        answer: "We start in selected Lagos corridors so delivery can be fast and reliable. Coverage grows only when we have enough verified vendors."
      }
    ]
  },
  {
    category: "ORDERING & PAYMENT",
    items: [
      {
        question: "How do I pay?",
        answer: "You pay during the payment step of checkout using the methods we show (for example card, bank transfer, USSD, or others we enable). Cash on delivery may be available for some orders. We do not require a separate wallet balance to order."
      },
      {
        question: "Will I see the full price before I pay?",
        answer: "Yes. Gas and delivery charges are shown before you confirm. The total at confirmation should match what you are charged for that order."
      },
      {
        question: "Can I cancel an order?",
        answer: "You can cancel while the order is still pending vendor acceptance. After acceptance, cancellation may not be available; contact Support if you have a problem."
      }
    ]
  },
  {
    category: "DELIVERY & TRACKING",
    items: [
      {
        question: "Can I see the delivery person on a map?",
        answer: "When your order is out for delivery, the app can show their live location so you can follow the trip. Location quality depends on GPS and network; occasional gaps are normal."
      },
      {
        question: "How long does delivery take?",
        answer: "Times are estimates. In our launch corridors we aim for fast fulfilment when gas runs out, but traffic and vendor workload can change arrival time."
      },
      {
        question: "What if I miss the delivery?",
        answer: "Follow the instructions in the app or contact Support. A reattempt or other resolution may apply depending on the situation."
      }
    ]
  },
  {
    category: "SMART REFILL",
    items: [
      {
        question: "How does the refill estimate work?",
        answer: "We estimate from your cylinder size, household usage details, and past refill or order history. It is software-based, not a weight sensor on the cylinder."
      },
      {
        question: "Is the estimate always accurate?",
        answer: "No. Treat it as guidance. Accuracy usually improves after more refills are recorded. You can adjust or snooze reminders."
      },
      {
        question: "Do I need special hardware?",
        answer: "No."
      }
    ]
  },
  {
    category: "VENDORS & SAFETY",
    items: [
      {
        question: "Who are the vendors?",
        answer: "Independent gas sellers who pass our verification checks. Ratings and order history help you choose."
      },
      {
        question: "Is LPG handling safe on FlameIntel?",
        answer: "Vendors are responsible for safe supply and transport under applicable rules. You should still follow basic cylinder safety at home. In an emergency, contact emergency services first."
      }
    ]
  }
];

export default function CustomerFAQPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-background">
      <header className="flex items-center justify-between bg-brand-900 px-6 py-4 md:px-12">
        <Link href="/" className="flex items-center gap-1.5 text-lg font-bold text-white">
          <Flame size={18} className="text-notify-400" fill="currentColor" />
          Flame<span className="text-notify-400">Intel</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-white/80">
          <Link href="/#about" className="hover:text-white">About</Link>
          <Link href="/customer-faq" className="hover:text-white text-white font-medium">FAQ</Link>
          <Link href="/#contact" className="hover:text-white">Contact</Link>
        </nav>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-bold text-ink-500">Customer FAQ</h1>

        <div className="mt-6 rounded-lg border border-dashed border-brand-300 bg-brand-50/30 p-6 space-y-6">
          {FAQ_SECTIONS.map((section) => (
            <div key={section.category} className="mt-6 first:mt-0">
              <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">
                {section.category}
              </h2>
              <div className="mt-4 space-y-4">
                {section.items.map((item, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-sm font-bold text-ink-500">{item.question}</p>
                    <p className="text-sm leading-relaxed text-ink-500 opacity-90">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push("/customer/profile")}
          className="mt-6 w-full rounded-lg bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-hover transition-all"
        >
          Return to Customer Profile
        </button>
      </div>
    </main>
  );
}
