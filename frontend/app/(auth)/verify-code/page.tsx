"use client";

import { Suspense, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import OtpInput from "@/components/ui/OtpInput";
import AuthIconBadge from "@/components/ui/AuthIconBadge";
import {
  verifySignupCode,
  sendPasswordReset,
  resendSignupCode,
} from "@/services/authService";
import SuccessModal from "@/components/modals/SuccessModal";

const OTP_LENGTH = 6;

function VerifyCodeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const purpose = searchParams.get("purpose") === "signup" ? "signup" : "reset";

  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const isComplete = code.every((digit) => digit !== "");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;
    setError("");
    setLoading(true);
    try {
      const joinedCode = code.join("");

      if (purpose === "signup") {
        await verifySignupCode({ email, otp: joinedCode });
        // Signup verification is the final step — show the success
        // confirmation, then the user logs in manually from /login.
        setVerified(true);
      } else {
        // The backend has no separate reset-code verification endpoint —
        // it's checked together with the new password in one call. So
        // here we only confirm the code is complete, then carry it
        // forward to /reset-password where the real check happens.
        router.push(
          `/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(joinedCode)}`
        );
      }
    } catch {
      setError("Invalid code. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setCode(Array(OTP_LENGTH).fill(""));
    setError("");
    try {
      if (purpose === "signup") {
        await resendSignupCode({ email });
      } else {
        await sendPasswordReset({ email });
      }   
    } catch {
      setError(
        purpose === "signup"
          ? "Resend isn't available yet — please check your inbox, or contact support if the code expired."
          : "Unable to resend code. Please try again."
      );
    }
  };

  const heading = purpose === "signup" ? "Verify Your Email" : "Enter Code";
  const subtitle =
    purpose === "signup"
      ? "We've sent a verification code to your email to confirm your account."
      : "We have sent a password reset instruction to you.";

  return (
    <div className="w-full max-w-sm">
      <div className="text-center">
        <AuthIconBadge>
          <Mail size={22} className="text-link-500" />
        </AuthIconBadge>
        <h1 className="font-heading mt-4 text-xl font-bold text-ink-500">
          {heading}
        </h1>
        <p className="mt-2 text-sm text-muted-500">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <OtpInput length={OTP_LENGTH} value={code} onChange={setCode} />

        {error && (
          <p className="text-center text-xs text-error">{error}</p>
        )}

        <button
          type="button"
          onClick={handleResend}
          className="text-sm font-medium text-notify-600 hover:text-notify-700"
        >
          Resend code
        </button>

        <button
          type="submit"
          disabled={!isComplete || loading}
          className="rounded-lg px-5 py-2.5 text-sm font-semibold bg-brand-500 text-white hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60 w-full"
        >
          {loading ? "Verifying…" : "Proceed"}
        </button>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-notify-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-notify-600"
        >
          <Mail size={16} /> Open Email App
        </button>
      </form>

      {purpose === "signup" && (
        <SuccessModal
          isOpen={verified}
          message="Your account has been verified. You're now ready to explore FlameIntel!"
          redirectTo="/login"
        />
      )}
    </div>
  );
}

export default function VerifyCodePage() {
  return (
    <Suspense fallback={null}>
      <VerifyCodeContent />
    </Suspense>
  );
}
