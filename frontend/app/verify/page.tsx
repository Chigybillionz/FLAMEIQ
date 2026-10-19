"use client";
import { Suspense,useState} from "react";
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
  const [email, setEmail] = useState('');
  const purpose = searchParams.get("purpose") === "signup" ? "signup" : "reset";

  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const isComplete = code.every((digit) => digit !== "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;
    setError("");
    setLoading(true);
    try {
      const joinedCode = code.join("");
        await verifySignupCode({ email, otp: joinedCode });
        // Signup verification is the final step — show the success
        // confirmation, then the user logs in manually from /login.
        setVerified(true);
    } catch (err) {
      setError(
          "Invalid code. Please check and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  
   

  const handleResend = async () => {
    setCode(Array(OTP_LENGTH).fill(""));
    setError("");
     setLoading(true);
    try {
      
        await resendSignupCode({ email });
     setLoading(false);
    } catch {
      setError(
        purpose === "signup"
          ? "Resend isn't available yet — please check your inbox, or contact support if the code expired."
          : "Unable to resend code. Please try again."
      );
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="text-center">
        <AuthIconBadge>
          <Mail size={22} className="text-brand-500" />
        </AuthIconBadge>
        <h1 className="font-heading mt-4 text-xl font-bold text-ink-500">
          
             Verify Your Email
            
        </h1>
        <p className="mt-2 text-sm text-muted-500">
          Enter the code we sent to your email address to proceed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
        <div className="grid gap-2">
          <label className="sr-only">email  </label>
          <input className="rounded-lg border border-muted-300 px-4 py-2 text-sm  placeholder:text-muted-400 "  type="email" placeholder="youremail@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <p className="text-lg font-medium text-shadow-blue-200 mt-2.5" > Input code</p>
          <label className="sr-only">Verification Code</label>
          <OtpInput
            value={code}
            onChange={setCode}
            length={OTP_LENGTH}
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleResend}
            disabled={!isComplete|| loading}
          className="text-sm font-medium text-notify-600 hover:text-notify-800 cursor-pointer"
        >
          {loading ? "Verifying…" : "Resend Code"}
        </button>

        {error && <p className="text-sm text-notify-600">{error}</p>}
        </div>
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
