
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

const VENDOR_FAQ_SECTIONS: FAQCategory[] = [
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
    category: "GETTING STARTED",
    items: [
      {
        question: "What is FlameIntel for vendors?",
        answer: "FlameIntel is a web platform that connects households in selected Lagos corridors with verified cooking-gas vendors. Customers place orders on the platform; you accept and fulfil delivery using your own staff or riders. FlameIntel does not operate the delivery fleet."
      },
      {
        question: "How do I register as a vendor?",
        answer: "Use “Become a vendor” on the FlameIntel website or contact vendors@flameintel.example. You will submit business details, service area, cylinder sizes and prices you offer, and documents required for verification. Registration is not complete until verification is approved."
      },
      {
        question: "What documents do I need?",
        answer: "Typical requirements include a valid means of identification, proof of business address or operating location, and any local permits you already hold for LPG retail. Exact requirements are listed during onboarding and may be updated for safety and compliance."
      },
      {
        question: "Is there a fee to join?",
        answer: "There is no heavy monthly subscription required simply to appear as a vendor at launch. FlameIntel charges a small success fee on completed (delivered) orders only. Details are set out in your vendor agreement. [Launch commission: e.g. 2–3% of gas value on delivered orders — confirm before publish.]"
      },
      {
        question: "Which areas can I serve?",
        answer: "You set your service area during setup. Orders are offered to vendors who cover the customer’s delivery location. Coverage expands corridor by corridor as more verified vendors join."
      }
    ]
  },
  {
    category: "ORDERS & FULFILMENT",
    items: [
      {
        question: "How do I receive orders?",
        answer: "When a customer near your service area places an order, you receive a notification in the vendor view. You can accept or reject the order within the time window shown. If you reject, please select a reason so the customer can be helped quickly."
      },
      {
        question: "What if I do not have stock?",
        answer: "Reject the order and choose the out-of-stock (or equivalent) reason, or mark availability as offline before peak hours if you cannot take jobs. Keeping availability accurate protects your rating and reduces cancelled trips."
      },
      {
        question: "Who delivers the gas?",
        answer: "You do. FlameIntel is not the carrier. You or your rider complete delivery to the address on the order. You are responsible for safe handling and transport under applicable rules."
      },
      {
        question: "Can the customer see my rider on a map?",
        answer: "Yes, while the order is out for delivery, the customer may see the approximate live location of the delivery person. That depends on the phone’s GPS, permissions, and network. Ask your rider to keep location enabled for that trip so tracking works."
      },
      {
        question: "What proof of delivery do I need?",
        answer: "You should complete delivery confirmation in the vendor view as instructed (for example photo proof and/or confirmation code). This closes the order and supports payout and dispute handling."
      },
      {
        question: "What if the customer is not available?",
        answer: "Follow the failed-delivery steps in the app or contact Support. Do not leave cylinders in unsafe places. Re-attempt or return rules are described in the vendor guidelines."
      }
    ]
  },
  {
    category: "PRICING & MONEY",
    items: [
      {
        question: "Who sets the gas price and delivery charge?",
        answer: "You set your gas prices by cylinder size and your delivery charge for the areas you cover. The customer sees gas and delivery as separate lines (or a clear total) before they pay. Keep prices accurate; misleading prices can lead to suspension."
      },
      {
        question: "How does FlameIntel get paid?",
        answer: "On completed deliveries, FlameIntel deducts the agreed success fee (commission) under your vendor agreement. There is no charge for rejected or unfulfilled orders that were never completed."
      },
      {
        question: "When do I receive my money?",
        answer: "Settlement follows the schedule in your vendor agreement [e.g. next business day / twice weekly — confirm with Finance]. Cash-on-delivery orders may settle on a different timetable because cash is collected at the door. Always check the earnings section in the vendor view."
      },
      {
        question: "What about bank or card payment fees?",
        answer: "Card and transfer payments are processed by a licensed payment provider. How those provider fees are shared is stated in your commercial terms. The customer pays the total shown at checkout."
      },
      {
        question: "Can I still sell on WhatsApp?",
        answer: "No. FlameIntel does not sales through other platforms outside the app."
      }
    ]
  },
  {
    category: "RATINGS, PERFORMANCE, & RULES",
    items: [
      {
        question: "How do ratings work?",
        answer: "After delivery, customers may rate the experience. Consistent acceptance, on-time delivery, and accurate pricing support stronger ratings. Serious complaints may be reviewed by Support."
      },
      {
        question: "Can FlameIntel suspend my account?",
        answer: "Yes. Accounts may be suspended for safety issues, repeated false availability, abuse of customers or staff, fraud, or material breach of the vendor agreement or Terms of Service."
      },
      {
        question: "What behaviour is not allowed?",
        answer: "Harassment of customers, deliberate short measure, bait pricing, requesting off-platform payment to avoid platform rules after accepting an in-app order, or misuse of customer data. Report problems through Support rather than taking them onto the street."
      }
    ]
  },
  {
    category: "APP USE & SUPPORT",
    items: [
      {
        question: "Do I need a special phone?",
        answer: "A smartphone with a modern mobile browser and internet access is enough. FlameIntel is a web platform. Keep your browser updated and allow notifications if you want order alerts."
      },
      {
        question: "What if the app is slow or an order is stuck?",
        answer: "Note the order reference, take a screenshot if useful, and contact Vendor Support. Do not deliver without a clear accepted order status when payment has already been taken online."
      },
      {
        question: "How do I get help?",
        answer: "Use in-app Support (vendor section), email [vendors@flameintel.example], or the vendor support line published in your onboarding pack. For emergencies involving gas leaks or injury, contact emergency services first."
      },
      {
        question: "How do I update prices or go offline?",
        answer: "Use the vendor settings to update prices, service area, and availability (online/offline). Update stock and hours before busy periods so customers are not offered jobs you cannot take."
      }
    ]
  },
  {
    category: "SAFETY",
    items: [
      {
        question: "Who is responsible for gas safety?",
        answer: "You remain responsible for lawful storage, filling or exchange practices, and safe transport of LPG. FlameIntel is a technology platform, not a safety inspector or emergency service. Follow NMDPRA and other applicable guidance and your local obligations."
      },
      {
        question: "What if there is a serious incident on a delivery?",
        answer: "Ensure people are safe and contact emergency services if required. Then notify FlameIntel Support with the order reference so the order record can be secured and next steps coordinated."
      }
    ]
  },
  {
    category: "SHORT ANSWERS",
    items: [
      {
        question: "Does FlameIntel supply the gas?",
        answer: "No. You supply the gas."
      },
      {
        question: "Does FlameIntel employ my riders?",
        answer: "No. Riders are engaged by you unless a separate written arrangement says otherwise."
      },
      {
        question: "Is there a sensor on the customer’s cylinder?",
        answer: "No. Refill reminders on the customer side are software estimates, not hardware readings."
      },
      {
        question: "Can I reject an order?",
        answer: "Yes, before or as allowed in the acceptance window. Prefer honest stock and capacity status over repeated late rejects."
      }
    ]
  }
];

   
export default function VendorFAQPage() {
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
          <Link href="/vendor-faq" className="hover:text-white text-white font-medium">FAQ</Link>
          <Link href="/#contact" className="hover:text-white">Contact</Link>
        </nav>
      </header>
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-bold text-ink-500">Vendor FAQ Portal</h1>

        <div className="mt-6 rounded-lg border border-dashed border-brand-300 bg-brand-50/30 p-6 space-y-6">
          {VENDOR_FAQ_SECTIONS.map((section) => (
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
          onClick={() => router.push("/vendor/profile")}
          className="mt-6 w-full rounded-lg bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-hover transition-all"
        >
          Return to Vendor Profile
        </button>
      </div>
    </main>
  );
}
