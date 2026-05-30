"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VehicleToggle({ vehicleId, available }: { vehicleId: string; available: boolean }) {
  const router = useRouter();
  const [val, setVal] = useState(available);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/vehicles/${vehicleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !val }),
      });
      if (res.ok) {
        setVal(!val);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`text-xs px-2 py-1 border transition-colors ${
        val ? "border-green-700/40 text-green-400 hover:bg-green-900/20" : "border-red-900/40 text-red-400 hover:bg-red-900/20"
      } disabled:opacity-50`}
    >
      {val ? "Available" : "Unavailable"}
    </button>
  );
}
