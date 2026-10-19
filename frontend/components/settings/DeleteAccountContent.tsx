"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { deleteAccount } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import type { Portal } from "@/types/portal";

export default function DeleteAccountContent({ portal }: { portal: Portal }) {
  const router = useRouter();
  const { logout } = useAuth();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await deleteAccount();
      logout();
      router.push("/login");
    } catch {
      setError("Unable to delete your account right now. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-500">
        <Link href={`/${portal}/settings`} className="hover:text-ink-500">
          Settings
        </Link>
        <ChevronRight size={12} />
        <span className="text-ink-500">Delete Account</span>
      </nav>

      <div className="mx-auto max-w-md rounded-2xl border border-error/30 bg-error/5 p-6 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error/10">
          <AlertTriangle size={22} className="text-error" />
        </span>
        <h1 className="mt-4 text-lg font-bold text-ink-500">Delete Your Account</h1>
        <p className="mt-2 text-sm text-muted-500">
          This permanently deletes your FlameIntel account and cannot be undone. You&apos;ll
          lose access to your order history, wallet, and saved details.
        </p>

        {error && <p className="mt-3 text-sm text-error">{error}</p>}

        {!confirming ? (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="mt-5 w-full rounded-lg border border-error px-5 py-2.5 text-sm font-semibold text-error hover:bg-error/10"
          >
            Delete Account
          </button>
        ) : (
          <div className="mt-5 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="w-full rounded-lg bg-error px-5 py-2.5 text-sm font-semibold text-white hover:bg-error/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Deleting…" : "Yes, permanently delete my account"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={loading}
              className="w-full rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-ink-500 hover:bg-muted-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
