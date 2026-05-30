"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["NEW", "CONTACTED", "QUOTED", "CLOSED"];

export default function QuoteStatusUpdater({
  quoteId,
  currentStatus,
}: {
  quoteId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function update(status: string) {
    setLoading(true);
    await fetch(`/api/admin/quotes/${quoteId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <select
      value={currentStatus}
      onChange={(e) => update(e.target.value)}
      disabled={loading}
      className="text-xs bg-white/5 border border-cream/20 text-cream px-2 py-1 focus:outline-none focus:border-gold rounded"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} className="bg-ink">{s}</option>
      ))}
    </select>
  );
}
