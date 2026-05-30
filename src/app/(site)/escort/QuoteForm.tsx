"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SERVICE_TYPES = [
  {
    value: "ESCORT",
    label: "Vehicle Escort",
    desc: "One or more escort vehicles accompanying your convoy or VIP",
  },
  {
    value: "PROTOCOL",
    label: "Protocol / VIP",
    desc: "Full protocol service with lead and tail vehicles for dignitaries",
  },
  {
    value: "CONVOY",
    label: "Full Convoy",
    desc: "Multi-vehicle convoy with motorcycle outriders and coordination",
  },
] as const;

export default function QuoteForm() {
  const router = useRouter();
  const [serviceType, setServiceType] = useState<"ESCORT" | "PROTOCOL" | "CONVOY">("ESCORT");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleCount, setVehicleCount] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/quote-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone, email, serviceType, date,
          pickupLocation, destination,
          vehicleCount: vehicleCount ? parseInt(vehicleCount) : undefined,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Submission failed."); return; }
      router.push(`/escort/confirmation?id=${data.quoteId}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Service type */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-bold text-ink mb-4">Service Type</h3>
        <div className="flex flex-col gap-2.5">
          {SERVICE_TYPES.map((s) => (
            <label
              key={s.value}
              className={`flex items-center gap-4 border-2 rounded-xl p-4 cursor-pointer transition-colors ${
                serviceType === s.value ? "border-gold bg-gold/5" : "border-border hover:border-gold/40"
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${serviceType === s.value ? "border-gold" : "border-muted"}`}>
                {serviceType === s.value && <div className="w-2 h-2 rounded-full bg-gold" />}
              </div>
              <input type="radio" name="serviceType" value={s.value} checked={serviceType === s.value}
                onChange={() => setServiceType(s.value)} className="hidden" />
              <div>
                <p className="text-sm font-semibold text-ink">{s.label}</p>
                <p className="text-xs text-ink-soft">{s.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-bold text-ink mb-4">Your Details</h3>
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">Full Name</label>
            <input
              type="text" required placeholder="Your name"
              value={name} onChange={(e) => setName(e.target.value)}
              className="w-full border border-border bg-cream-dark rounded-xl px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">Phone Number</label>
            <input
              type="tel" required placeholder="03XX-XXXXXXX"
              value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-border bg-cream-dark rounded-xl px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">Email (optional)</label>
            <input
              type="email" placeholder="for written quote"
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border bg-cream-dark rounded-xl px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-gold"
            />
          </div>
        </div>
      </div>

      {/* Event details */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-bold text-ink mb-4">Event Details</h3>
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">Date Required</label>
            <input
              type="date" required min={today}
              value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full border border-border bg-cream-dark rounded-xl px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">Pickup / Starting Location</label>
            <input
              type="text" required placeholder="e.g. Islamabad Airport, PM House, Hotel Serena"
              value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full border border-border bg-cream-dark rounded-xl px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">Destination</label>
            <input
              type="text" required placeholder="e.g. Lahore, GHQ, Parliament House"
              value={destination} onChange={(e) => setDestination(e.target.value)}
              className="w-full border border-border bg-cream-dark rounded-xl px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">
              Number of Escort Vehicles Needed
              <span className="text-muted font-normal ml-1">(optional)</span>
            </label>
            <input
              type="number" min="1" max="20" placeholder="e.g. 2"
              value={vehicleCount} onChange={(e) => setVehicleCount(e.target.value)}
              className="w-full border border-border bg-cream-dark rounded-xl px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">
              Additional Requirements
              <span className="text-muted font-normal ml-1">(optional)</span>
            </label>
            <textarea
              placeholder="Security level, number of principals, special routes, duration of engagement…"
              value={notes} onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border border-border bg-cream-dark rounded-xl px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-gold resize-none"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gold hover:bg-gold-dark text-white font-bold rounded-xl transition-colors disabled:opacity-50 text-base"
      >
        {loading ? "Submitting…" : "Request a Quote"}
      </button>

      <p className="text-center text-xs text-muted -mt-2">
        We'll call you back within 2 hours to confirm details and provide pricing.
      </p>
    </form>
  );
}
