"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function normalizePhone(raw: string): string {
    const digits = raw.replace(/\D/g, "");
    if (digits.startsWith("0") && digits.length === 11) return "+92" + digits.slice(1);
    if (digits.startsWith("92") && digits.length === 12) return "+" + digits;
    if (digits.length === 10) return "+92" + digits;
    return raw;
  }

  async function requestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const normalized = normalizePhone(phone);
    try {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setPhone(normalized);
      setStep("otp");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      router.push("/account/bookings");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-10">
          <span className="text-gold text-2xl">♛</span>
          <span className="font-display text-2xl tracking-widest uppercase">
            <span className="text-ink">Royal</span>{" "}
            <span className="text-gold">Wheels</span>
          </span>
        </Link>

        <div className="bg-white border border-border p-8">
          <h1 className="font-display text-2xl mb-1">
            {step === "phone" ? "Sign In" : "Enter Your Code"}
          </h1>
          <p className="text-ink-soft font-body text-sm mb-6">
            {step === "phone"
              ? "Enter your Pakistani mobile number to receive a one-time verification code."
              : `A 6-digit code has been sent to ${phone}. Check your SMS or WhatsApp.`}
          </p>

          {error && (
            <div className="mb-4 text-sm font-body text-red-700 bg-red-50 border border-red-200 px-4 py-3">
              {error}
            </div>
          )}

          {step === "phone" ? (
            <form onSubmit={requestOtp} className="flex flex-col gap-4">
              <div>
                <label className="block text-[10px] font-body text-ink-soft uppercase tracking-widest mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="03XX-XXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-border bg-cream px-4 py-3 font-body text-ink focus:outline-none focus:border-gold text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gold text-ink font-body font-medium hover:bg-gold-dark transition-colors disabled:opacity-60 tracking-wide"
              >
                {loading ? "Sending…" : "Send Verification Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="flex flex-col gap-4">
              <div>
                <label className="block text-[10px] font-body text-ink-soft uppercase tracking-widest mb-1.5">
                  6-Digit Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full border border-border bg-cream px-4 py-3 font-body text-ink text-center text-2xl tracking-[0.4em] focus:outline-none focus:border-gold"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gold text-ink font-body font-medium hover:bg-gold-dark transition-colors disabled:opacity-60 tracking-wide"
              >
                {loading ? "Verifying…" : "Verify & Sign In"}
              </button>
              <button
                type="button"
                className="text-sm text-ink-soft font-body hover:text-ink transition-colors"
                onClick={() => { setStep("phone"); setCode(""); setError(""); }}
              >
                ← Change number
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-ink-soft font-body mt-6">
          By signing in you agree to our{" "}
          <Link href="/fleet" className="text-gold hover:underline">Terms & Conditions</Link>.
        </p>
      </div>
    </div>
  );
}
