import { prisma } from "@/lib/db";
import VehicleCard from "@/components/VehicleCard";
import Link from "next/link";

export const revalidate = 60;

export const metadata = { title: "Our Fleet — Royal Wheels" };

export default async function FleetPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; pickup?: string; start?: string; end?: string }>;
}) {
  const params = await searchParams;
  const { category, pickup, start, end } = params;

  const vehicles = await prisma.vehicle.findMany({
    where: category ? { category } : {},
    orderBy: { pricePerDay: "asc" },
  });

  const categories = await prisma.vehicle.findMany({
    distinct: ["category"],
    select: { category: true },
  });

  const days = start && end
    ? Math.max(1, Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000))
    : null;

  return (
    <div className="bg-white min-h-screen">
      {/* Page header */}
      <div className="bg-ink py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-white/40 mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-white/70">Home</Link>
            <span>›</span>
            <span className="text-white/70">Fleet</span>
            {category && <><span>›</span><span className="text-white/70">{category}</span></>}
          </nav>
          <h1 className="text-3xl font-extrabold text-white">Our Fleet</h1>
          <p className="text-white/50 text-sm mt-1">
            {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} available
            {pickup ? ` · Pickup: ${pickup}` : ""}
            {days ? ` · ${days} day${days > 1 ? "s" : ""}` : ""}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Category filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          <Link
            href="/fleet"
            className={`shrink-0 px-5 py-2 rounded-full border text-sm font-medium transition-colors ${
              !category ? "bg-gold border-gold text-white" : "border-border text-ink-soft hover:border-gold hover:text-gold bg-white"
            }`}
          >
            All Vehicles
          </Link>
          {categories.map((c) => (
            <Link
              key={c.category}
              href={`/fleet?category=${encodeURIComponent(c.category)}`}
              className={`shrink-0 px-5 py-2 rounded-full border text-sm font-medium transition-colors ${
                category === c.category
                  ? "bg-gold border-gold text-white"
                  : "border-border text-ink-soft hover:border-gold hover:text-gold bg-white"
              }`}
            >
              {c.category}
            </Link>
          ))}
        </div>

        {vehicles.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-ink-soft text-sm">No vehicles found.</p>
            <Link href="/fleet" className="mt-4 inline-block text-gold text-sm font-semibold hover:underline">
              Clear filters →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {vehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
