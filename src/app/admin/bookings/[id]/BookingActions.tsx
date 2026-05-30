"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BookingActions({
  bookingId,
  currentStatus,
  nextStatus,
  hasCnic,
}: {
  bookingId: string;
  currentStatus: string;
  nextStatus: string | null;
  hasCnic: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function advanceStatus() {
    if (!nextStatus) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function cancelBooking() {
    if (!confirm("Cancel this booking?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      if (res.ok) router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const canCancel = !["OUT", "RETURNED", "CLOSED", "CANCELLED"].includes(currentStatus);

  return (
    <div className="flex flex-col gap-3">
      {nextStatus && (
        <button
          onClick={advanceStatus}
          disabled={loading}
          className="w-full py-2.5 bg-gold text-ink text-sm font-medium hover:bg-gold-light transition-colors disabled:opacity-50"
        >
          {loading ? "Updating…" : `Advance to ${nextStatus.replace("_", " ")}`}
        </button>
      )}
      {canCancel && (
        <button
          onClick={cancelBooking}
          disabled={loading}
          className="w-full py-2.5 border border-red-900/30 text-red-400 text-sm hover:bg-red-900/20 transition-colors disabled:opacity-50"
        >
          Cancel Booking
        </button>
      )}
      {currentStatus === "CLOSED" || currentStatus === "CANCELLED" ? (
        <p className="text-xs text-cream/30 text-center">This booking is {currentStatus.toLowerCase()}.</p>
      ) : null}
    </div>
  );
}
