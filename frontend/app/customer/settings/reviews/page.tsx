"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Star, X } from "lucide-react";
import SettingsNav from "@/components/settings/SettingsNav";

interface AwaitingReview {
  id: string;
  vendorContact: string;
  businessName: string;
  location: string;
}

// No backend endpoint exists yet to list "vendors awaiting review" for a
// customer — mocked here, matching the Figma, until one does.
const AWAITING_REVIEWS: AwaitingReview[] = [
  { id: "r1", vendorContact: "Emeka Johnson", businessName: "Emily's Gas Ltd.", location: "Aja, Lagos." },
  { id: "r2", vendorContact: "Emeka Johnson", businessName: "Plattinum Gas Ltd.", location: "Aja, Lagos." },
];

const REVIEWED_COUNT = 10;

const RATING_LABELS: Record<number, string> = {
  1: "Very Bad",
  2: "Bad",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

export default function ReviewsAndRatingsPage() {
  const [activeTab, setActiveTab] = useState<"awaiting" | "reviewed">("awaiting");
  const [activeVendor, setActiveVendor] = useState<AwaitingReview | null>(null);

  return (
    <div>
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-500">
        <Link href="/customer/settings" className="hover:text-ink-500">
          Settings
        </Link>
        <ChevronRight size={12} />
        <span className="text-ink-500">Reviews &amp; Ratings</span>
      </nav>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="w-full rounded-2xl border border-border bg-card p-5 lg:w-72 lg:shrink-0">
          <SettingsNav portal="customer" />
        </aside>

        <div className="flex-1 rounded-2xl border border-border bg-card p-6">
          <h1 className="text-lg font-bold text-brand-500">Reviews &amp; Ratings</h1>

          <div className="mt-4 flex items-center gap-6 overflow-x-auto border-b border-border text-sm">
            <button
              type="button"
              onClick={() => setActiveTab("awaiting")}
              className={`shrink-0 border-b-2 pb-2 font-medium ${
                activeTab === "awaiting" ? "border-brand-500 text-ink-500" : "border-transparent text-muted-500"
              }`}
            >
              Vendors Awaiting Reviews ({AWAITING_REVIEWS.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reviewed")}
              className={`shrink-0 border-b-2 pb-2 font-medium ${
                activeTab === "reviewed" ? "border-brand-500 text-ink-500" : "border-transparent text-muted-500"
              }`}
            >
              Reviewed ({REVIEWED_COUNT})
            </button>
          </div>

          {activeTab === "awaiting" ? (
            <div className="mt-4 flex flex-col gap-3">
              {AWAITING_REVIEWS.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white">
                      {getInitials(entry.vendorContact)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink-500">{entry.vendorContact}</p>
                      <p className="text-xs text-brand-500">{entry.businessName}</p>
                      <p className="text-xs text-muted-500">{entry.location}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveVendor(entry)}
                    className="shrink-0 rounded-lg bg-brand-500 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-hover"
                  >
                    Leave a Review
                  </button>
                </div>
              ))}

              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-500">
                <span>100+ users are waiting for your reviews</span>
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="text-muted-200" />
                  ))}
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-border p-6 text-center text-sm text-muted-500">
              Vendors you&apos;ve already reviewed will show up here.
            </div>
          )}
        </div>
      </div>

      {activeVendor && <ReviewModal vendor={activeVendor} onClose={() => setActiveVendor(null)} />}
    </div>
  );
}

function ReviewModal({ vendor, onClose }: { vendor: AwaitingReview; onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const displayedRating = hoveredRating || rating;

  const handleSubmit = async () => {
    if (!rating) return;
    setSubmitting(true);
    // No real orderId is available from the mocked "awaiting review" list,
    // so this simulates success rather than calling POST /api/reviews
    // with fabricated data. See services/reviewService.ts for the real
    // call, ready once a genuine order/vendor pairing is available here.
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(onClose, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-500/60 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="flex w-full max-w-3xl flex-col gap-4 sm:flex-row">
        <div className="relative w-full max-w-md rounded-2xl bg-white p-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 text-muted-400 hover:text-ink-500"
          >
            <X size={18} />
          </button>

          <h2 className="text-base font-bold text-brand-500">Review Vendor</h2>

          <div className="mt-4 flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white">
              {getInitials(vendor.vendorContact)}
            </span>
            <div>
              <p className="text-sm font-semibold text-ink-500">{vendor.businessName}</p>
              <p className="text-xs text-muted-500">{vendor.location}</p>
            </div>
          </div>

          <div className="relative mt-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 3000))}
              placeholder="Share your experience with this vendor"
              rows={4}
              className="w-full resize-none rounded-lg border border-border bg-white p-3 text-sm text-ink-500 outline-none placeholder:text-muted-400 focus:border-brand-500"
            />
            <span className="absolute bottom-2 right-3 text-xs text-muted-400">{comment.length}/3000</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-ink-500">Rating</span>
            {Array.from({ length: 5 }).map((_, i) => {
              const starValue = i + 1;
              return (
                <button
                  key={starValue}
                  type="button"
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoveredRating(starValue)}
                  onMouseLeave={() => setHoveredRating(0)}
                  aria-label={`Rate ${starValue} star`}
                >
                  <Star
                    size={20}
                    className={starValue <= displayedRating ? "fill-notify-500 text-notify-500" : "text-muted-200"}
                  />
                </button>
              );
            })}
            {displayedRating > 0 && (
              <span className="text-xs font-medium text-muted-500">{RATING_LABELS[displayedRating]}</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!rating || submitting}
            className="mt-5 w-full rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitted ? "Thank you!" : submitting ? "Submitting…" : "Submit"}
          </button>
        </div>

        <div className="hidden w-48 shrink-0 rounded-2xl bg-white p-4 sm:block">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-400">Rating Indicators</p>
          <div className="mt-3 flex flex-col gap-2 text-xs">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center justify-between">
                <span className="text-ink-500">{RATING_LABELS[stars]}:</span>
                <span className="text-muted-500">
                  {stars} Star{stars > 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
