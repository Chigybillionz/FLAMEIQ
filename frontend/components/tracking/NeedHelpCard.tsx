import { MessageCircle, Phone } from "lucide-react";

export default function NeedHelpCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="text-sm font-semibold text-ink-500">Need Help?</h2>
      <p className="mt-1 text-xs text-muted-500">
        If you have any issues with your delivery, our support team is
        here to help.
      </p>

      <div className="mt-4 flex gap-3">
        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-ink-500 hover:bg-brand-50">
          <MessageCircle size={14} /> Chat with Us
        </button>
        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-500 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-hover">
          <Phone size={14} /> Call Support
        </button>
      </div>
    </div>
  );
}