import Link from "next/link";
import Image from "next/image";

interface Vehicle {
  id: string;
  name: string;
  slug: string;
  category: string;
  seats: number;
  pricePerDay: number;
  transmission: string;
  fuelType: string;
  images: string;
  available: boolean;
}

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const images: string[] = JSON.parse(vehicle.images || "[]");
  const thumb = images[0] ?? null;

  return (
    <Link
      href={`/vehicle/${vehicle.slug}`}
      className="group bg-white border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-gold/30 transition-all duration-200 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] bg-cream-dark overflow-hidden">
        {thumb ? (
          <Image
            src={thumb}
            alt={vehicle.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-cream-dark to-border">
            <svg className="w-16 h-16 text-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 9l-7 7-7-7" />
              <rect x="1" y="3" width="15" height="13" rx="2" strokeWidth={1.2}/>
              <path strokeWidth={1.2} d="M16 8h2a2 2 0 012 2v5H1V10a2 2 0 012-2h1"/>
            </svg>
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="text-[10px] font-semibold bg-white/90 text-ink-soft px-2.5 py-1 rounded-full backdrop-blur-sm">
            {vehicle.category}
          </span>
        </div>
        {!vehicle.available && (
          <div className="absolute inset-0 bg-ink/60 flex items-center justify-center">
            <span className="text-white text-xs font-semibold tracking-wider uppercase bg-ink/80 px-3 py-1.5 rounded-full">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-ink text-sm leading-snug mb-3">{vehicle.name}</h3>

        {/* Specs row — icon + value like Horizone */}
        <div className="flex items-center gap-3 text-xs text-ink-soft mb-4 flex-wrap">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/>
            </svg>
            {vehicle.transmission}
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            {vehicle.seats - 1}
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/>
            </svg>
            {vehicle.fuelType}
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            4.8
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto flex items-end justify-between">
          <div>
            <p className="text-[10px] text-muted font-medium uppercase tracking-wider">Start from</p>
            <p className="font-bold text-ink">
              <span className="text-lg">PKR {vehicle.pricePerDay.toLocaleString()}</span>
              <span className="text-xs text-muted font-normal"> / day</span>
            </p>
          </div>
          <span className="text-[10px] font-semibold text-gold bg-gold/10 px-2.5 py-1 rounded-full">
            With Driver
          </span>
        </div>
      </div>
    </Link>
  );
}
