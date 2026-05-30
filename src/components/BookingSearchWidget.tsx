"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BookingSearchWidget() {
  const router = useRouter();
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");

  const today = new Date().toISOString().split("T")[0];

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (pickup) params.set("pickup", pickup);
    if (startDate) params.set("start", startDate);
    router.push(`/fleet?${params.toString()}`);
  }

  return (
    <div className="bg-white rounded-t-2xl shadow-2xl p-5">
      {/* Tab row */}
      <div className="flex items-center gap-1 mb-5">
        <span className="px-4 py-1.5 rounded-full bg-gold text-white text-xs font-semibold">With Driver</span>
        <span className="px-4 py-1.5 rounded-full text-ink-soft text-xs font-medium">All Pakistan</span>
      </div>

      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

          {/* Pickup location */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-ink-soft uppercase tracking-widest">Pickup Location</label>
            <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2.5 focus-within:border-gold transition-colors bg-cream-dark">
              <svg className="w-4 h-4 text-ink-soft shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                type="text"
                placeholder="City, airport or area"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="flex-1 bg-transparent text-sm text-ink placeholder-muted focus:outline-none"
              />
            </div>
          </div>

          {/* Destination */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-ink-soft uppercase tracking-widest">Destination</label>
            <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2.5 focus-within:border-gold transition-colors bg-cream-dark">
              <svg className="w-4 h-4 text-ink-soft shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <input
                type="text"
                placeholder="Where are you going?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="flex-1 bg-transparent text-sm text-ink placeholder-muted focus:outline-none"
              />
            </div>
          </div>

          {/* Pick-up date + Search */}
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[10px] font-semibold text-ink-soft uppercase tracking-widest">Pick Up Date</label>
              <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2.5 focus-within:border-gold transition-colors bg-cream-dark">
                <svg className="w-4 h-4 text-ink-soft shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input
                  type="date"
                  min={today}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-ink focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <button
                type="submit"
                className="h-[42px] px-5 bg-gold hover:bg-gold-dark text-white font-semibold text-sm rounded-xl transition-colors flex items-center gap-2 mt-auto"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
