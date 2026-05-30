"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TERMS = [
  "All rentals include a professional driver. Self-drive is not offered.",
  "A valid CNIC is required to confirm any booking.",
  "An advance payment (40%) is required to confirm the booking; balance and security deposit due at handover.",
  "Daily mileage limits apply per vehicle; extra km and out-of-city travel charged separately.",
  "Customer is responsible for fuel, tolls, and parking unless otherwise agreed.",
  "Cancellations less than 24 hours before pickup may forfeit the advance payment.",
  "The renter must comply with all traffic laws; fines are the renter's responsibility.",
  "Royal Wheels reserves the right to refuse or cancel a booking. CNIC images are used for verification only, then deleted.",
  "Smoking and illegal activities in vehicles are prohibited.",
  "By booking, you agree to these terms.",
];

interface Props {
  vehicle: { id: string; name: string; slug: string; pricePerDay: number };
  advancePercent: number;
}

export default function BookingForm({ vehicle, advancePercent }: Props) {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [cnicFile, setCnicFile] = useState<File | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"BANK" | "CARD" | "CASH_VOUCHER">("BANK");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const days = startDate && endDate
    ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000))
    : 0;
  const total = days * vehicle.pricePerDay;
  const advance = Math.ceil((total * advancePercent) / 100);
  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!termsAccepted) { setError("Please accept the Terms & Conditions to continue."); return; }
    if (!cnicFile) { setError("Please upload your CNIC image."); return; }
    setError("");
    setLoading(true);
    try {
      const form = new FormData();
      form.append("vehicleId", vehicle.id);
      form.append("startDate", startDate);
      form.append("endDate", endDate);
      form.append("pickupLocation", pickupLocation);
      form.append("notes", notes);
      form.append("paymentMethod", paymentMethod);
      form.append("cnic", cnicFile);
      const res = await fetch("/api/bookings", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Booking failed."); return; }
      router.push(`/book/${vehicle.slug}/confirmation?bookingId=${data.bookingId}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Dates */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-bold text-ink mb-4">Trip Dates</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">Pick-up Date</label>
            <input
              type="date" min={today} value={startDate}
              onChange={(e) => { setStartDate(e.target.value); if (endDate && e.target.value > endDate) setEndDate(""); }}
              className="w-full border border-border bg-cream-dark rounded-xl px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-gold"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">Return Date</label>
            <input
              type="date" min={startDate || today} value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-border bg-cream-dark rounded-xl px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-gold"
              required
            />
          </div>
        </div>

        {/* Price breakdown */}
        {days > 0 && (
          <div className="mt-4 bg-cream-dark rounded-xl p-4 text-sm">
            <div className="flex justify-between mb-1.5 text-ink-soft">
              <span>{days} day{days > 1 ? "s" : ""} × PKR {vehicle.pricePerDay.toLocaleString()}</span>
              <span className="font-medium text-ink">PKR {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold text-gold pt-1.5 border-t border-border">
              <span>Advance required ({advancePercent}%)</span>
              <span>PKR {advance.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Location & notes */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-bold text-ink mb-4">Trip Details</h3>
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">Pickup Location</label>
            <input
              type="text" placeholder="e.g. Islamabad Airport, Gulberg Lahore"
              value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full border border-border bg-cream-dark rounded-xl px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">Notes (optional)</label>
            <textarea
              placeholder="Special requirements, number of luggage bags, child seat…"
              value={notes} onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border border-border bg-cream-dark rounded-xl px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-gold resize-none"
            />
          </div>
        </div>
      </div>

      {/* CNIC upload */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-bold text-ink mb-1">CNIC Verification</h3>
        <p className="text-xs text-ink-soft mb-4">Required by law. Stored securely, deleted after rental.</p>
        <label className="flex items-center gap-3 border-2 border-dashed border-border rounded-xl p-4 cursor-pointer hover:border-gold/50 transition-colors">
          <span className="text-2xl">📄</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-ink">{cnicFile ? cnicFile.name : "Upload CNIC photo or scan"}</p>
            <p className="text-xs text-muted">JPG, PNG or PDF · Max 5MB</p>
          </div>
          <input
            type="file" accept="image/jpeg,image/png,application/pdf"
            onChange={(e) => setCnicFile(e.target.files?.[0] ?? null)}
            className="hidden" required
          />
          <span className="text-xs font-semibold text-gold border border-gold px-3 py-1.5 rounded-full hover:bg-gold hover:text-white transition-colors">
            Choose
          </span>
        </label>
      </div>

      {/* Payment method */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-bold text-ink mb-4">Payment Method</h3>
        <div className="flex flex-col gap-2.5">
          {([
            ["BANK", "Bank Transfer", "Most common · Transfer advance to our account"],
            ["CARD", "Credit / Debit Card", "Online card payment · Redirected to payment gateway"],
            ["CASH_VOUCHER", "Cash Voucher", "Pay at our office · Voucher generated on booking"],
          ] as const).map(([val, label, desc]) => (
            <label
              key={val}
              className={`flex items-center gap-4 border-2 rounded-xl p-4 cursor-pointer transition-colors ${
                paymentMethod === val ? "border-gold bg-gold/5" : "border-border hover:border-gold/40"
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === val ? "border-gold" : "border-muted"}`}>
                {paymentMethod === val && <div className="w-2 h-2 rounded-full bg-gold" />}
              </div>
              <input type="radio" name="paymentMethod" value={val} checked={paymentMethod === val}
                onChange={() => setPaymentMethod(val)} className="hidden" />
              <div>
                <p className="text-sm font-semibold text-ink">{label}</p>
                <p className="text-xs text-ink-soft">{desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Terms */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-bold text-ink mb-3">Terms & Conditions</h3>
        <div className="max-h-40 overflow-y-auto bg-cream-dark rounded-xl p-4 mb-4 text-xs text-ink-soft leading-relaxed">
          <ol className="list-decimal list-inside space-y-1.5">
            {TERMS.map((t, i) => <li key={i}>{t}</li>)}
          </ol>
        </div>
        <label className="flex items-start gap-3 cursor-pointer">
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${termsAccepted ? "bg-gold border-gold" : "border-border"}`}
            onClick={() => setTermsAccepted(!termsAccepted)}>
            {termsAccepted && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="hidden" />
          <span className="text-sm text-ink-soft">I have read and agree to the Terms & Conditions</span>
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading || days === 0 || !termsAccepted}
        className="w-full py-4 bg-gold hover:bg-gold-dark text-white font-bold rounded-xl transition-colors disabled:opacity-50 text-base"
      >
        {loading ? "Submitting booking…" : days > 0 ? `Confirm Booking · PKR ${total.toLocaleString()}` : "Select dates to continue"}
      </button>
    </form>
  );
}
