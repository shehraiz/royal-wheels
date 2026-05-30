import Link from "next/link";
import { prisma } from "@/lib/db";
import VehicleCard from "@/components/VehicleCard";
import BookingSearchWidget from "@/components/BookingSearchWidget";

export const revalidate = 60;

const CATEGORIES = ["All", "Sedan", "SUV", "Pickup/4x4"];

export default async function HomePage() {
  const vehicles = await prisma.vehicle.findMany({
    where: { available: true },
    orderBy: { pricePerDay: "asc" },
  });

  const stats = [
    { value: "7+", label: "Premium Vehicles" },
    { value: "100%", label: "With Driver" },
    { value: "24/7", label: "WhatsApp Support" },
    { value: "PKR", label: "Transparent Fares" },
  ];

  const services = [
    { icon: "✈️", label: "Airport Transfer" },
    { icon: "💼", label: "Corporate Travel" },
    { icon: "👨‍👩‍👧", label: "Family Trips" },
    { icon: "🏔️", label: "Intercity Rides" },
    { icon: "💍", label: "Wedding Cars" },
    { icon: "👑", label: "VIP & Executive" },
  ];

  return (
    <div className="bg-white">

      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[600px] flex flex-col justify-end bg-ink overflow-hidden">
        {/* Background car image placeholder — replace with real photo */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/30"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(11,11,11,0.97) 30%, rgba(11,11,11,0.55) 65%, rgba(11,11,11,0.2) 100%)`,
          }}
        />
        {/* Decorative car silhouette strip */}
        <div className="absolute inset-0 flex items-center justify-end pr-0 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-transparent via-transparent to-gold/5" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full pb-0 pt-24">
          {/* Hero text */}
          <div className="max-w-xl mb-10">
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span className="text-gold text-xs font-semibold tracking-wide">Premium Car Rentals · Pakistan</span>
            </div>
            <h1 className="text-white font-extrabold text-5xl sm:text-6xl leading-tight mb-4">
              Rent a Car for<br />
              <span className="text-gold">Every Journey</span>
            </h1>
            <p className="text-white/60 text-base leading-relaxed">
              Professional drivers, clean vehicles, transparent fares.<br />
              Airport transfers to mountain getaways — we've got you covered.
            </p>
          </div>

          {/* Booking search widget — sits at bottom of hero */}
          <BookingSearchWidget />
        </div>
      </section>

      {/* ─── Stats bar ────────────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
            {stats.map((s) => (
              <div key={s.label} className="py-5 px-6 text-center">
                <p className="text-2xl font-extrabold text-ink">{s.value}</p>
                <p className="text-xs text-ink-soft mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Service categories ───────────────────────────────────── */}
      <section className="py-12 px-4 sm:px-6 bg-cream-dark">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-ink">Our Services</h2>
              <p className="text-sm text-ink-soft mt-0.5">Every rental includes a professional driver</p>
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {services.map((s) => (
              <Link
                key={s.label}
                href={`/fleet`}
                className="flex flex-col items-center gap-2 bg-white border border-border rounded-2xl py-5 px-3 hover:border-gold/50 hover:shadow-sm transition-all group"
              >
                <span className="text-2xl">{s.icon}</span>
                <span className="text-xs font-medium text-ink-soft group-hover:text-ink text-center leading-tight">{s.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Top picks ────────────────────────────────────────────── */}
      <section className="py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-ink">Top picks this month</h2>
              <p className="text-sm text-ink-soft mt-1">Handpicked vehicles — all with professional drivers, priced per day in PKR</p>
            </div>
            <Link href="/fleet" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-gold hover:text-gold-dark transition-colors">
              See All <span>→</span>
            </Link>
          </div>

          {/* Category tabs */}
          <CategoryTabs vehicles={vehicles} />
        </div>
      </section>

      {/* ─── Why Royal Wheels ─────────────────────────────────────── */}
      <section className="py-14 px-4 sm:px-6 bg-cream-dark">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-ink">Why Royal Wheels?</h2>
              <p className="text-sm text-ink-soft mt-1">What makes us the trusted choice across Pakistan</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "🧑‍✈️", title: "Professional Drivers", desc: "Every rental comes with a vetted, courteous driver — no self-drive." },
              { icon: "🔍", title: "Transparent Pricing", desc: "Fare confirmed before you book. No hidden charges, no surprises." },
              { icon: "✅", title: "Verified Fleet", desc: "Well-maintained vehicles inspected regularly for safety and comfort." },
              { icon: "💬", title: "WhatsApp Booking", desc: "Book instantly via WhatsApp — no app needed, response in minutes." },
            ].map((f) => (
              <div key={f.title} className="bg-white border border-border rounded-2xl p-6 hover:border-gold/40 transition-colors">
                <span className="text-3xl block mb-3">{f.icon}</span>
                <h3 className="font-bold text-ink mb-1.5">{f.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA banner ───────────────────────────────────────────── */}
      <section className="bg-ink py-16 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-3">
            Ready for a <span className="text-gold">Royal Experience?</span>
          </h2>
          <p className="text-white/50 text-sm mb-8">
            Book your ride in minutes via WhatsApp or browse the full fleet online.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/923005245427?text=Hi%2C%20I%27d%20like%20to%20book%20a%20car%20with%20Royal%20Wheels"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-gold text-white font-semibold rounded-full hover:bg-gold-dark transition-colors"
            >
              Book on WhatsApp
            </a>
            <Link
              href="/fleet"
              className="px-8 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors border border-white/20"
            >
              Browse Fleet
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Server component: renders category tabs + filtered grid ──────────────────
function CategoryTabs({ vehicles }: { vehicles: { id: string; name: string; slug: string; category: string; seats: number; pricePerDay: number; transmission: string; fuelType: string; images: string; available: boolean }[] }) {
  // Group by category
  const categories = ["All", ...Array.from(new Set(vehicles.map((v) => v.category)))];

  return (
    <div>
      {/* Tab links (filter via URL) */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-8 scrollbar-hide">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={cat === "All" ? "/" : `/?cat=${encodeURIComponent(cat)}`}
            className="shrink-0 px-5 py-2 rounded-full border border-border text-sm font-medium text-ink-soft hover:border-gold hover:text-gold transition-colors bg-white"
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Vehicle grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {vehicles.slice(0, 8).map((v) => (
          <VehicleCard key={v.id} vehicle={v} />
        ))}
      </div>

      <div className="mt-8 text-center sm:hidden">
        <Link href="/fleet" className="inline-flex items-center gap-1 text-sm font-semibold text-gold hover:text-gold-dark">
          See All Vehicles →
        </Link>
      </div>
    </div>
  );
}
