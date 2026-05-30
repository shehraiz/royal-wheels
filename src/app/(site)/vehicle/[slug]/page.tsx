import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const v = await prisma.vehicle.findUnique({ where: { slug } });
  if (!v) return {};
  return { title: `${v.name} — Royal Wheels` };
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = await prisma.vehicle.findUnique({ where: { slug } });
  if (!vehicle) notFound();

  const images: string[] = JSON.parse(vehicle.images || "[]");
  const waLink = `https://wa.me/923005245427?text=Hi%2C%20I%27d%20like%20to%20book%20the%20${encodeURIComponent(vehicle.name)}%20with%20Royal%20Wheels.%20Please%20confirm%20availability.`;

  const specs = [
    { label: "Passengers", value: `${vehicle.seats - 1} passengers`, icon: "👤" },
    { label: "Transmission", value: vehicle.transmission, icon: "⚙️" },
    { label: "Fuel Type", value: vehicle.fuelType, icon: "⛽" },
    { label: "Daily Mileage", value: vehicle.mileageLimitKmPerDay ? `${vehicle.mileageLimitKmPerDay} km` : "Unlimited", icon: "🛣️" },
    { label: "Extra KM Charge", value: vehicle.extraKmCharge ? `PKR ${vehicle.extraKmCharge}/km` : "—", icon: "📍" },
    { label: "Out-of-City Fee", value: vehicle.outOfCitySurcharge ? `PKR ${vehicle.outOfCitySurcharge.toLocaleString()}` : "—", icon: "🗺️" },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-cream-dark px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs text-ink-soft">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <span>›</span>
          <Link href="/fleet" className="hover:text-gold transition-colors">Fleet</Link>
          <span>›</span>
          <span className="text-ink font-medium">{vehicle.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* ── Left: Gallery ── */}
          <div className="lg:col-span-3">
            {/* Main image */}
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-cream-dark border border-border relative mb-3">
              {images[0] ? (
                <Image src={images[0]} alt={vehicle.name} fill className="object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-muted">
                  <span className="text-6xl">🚗</span>
                  <span className="text-sm">No photos yet</span>
                </div>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="text-xs font-semibold bg-white/90 backdrop-blur-sm text-ink-soft px-3 py-1 rounded-full">
                  {vehicle.category}
                </span>
                <span className="text-xs font-semibold bg-gold text-white px-3 py-1 rounded-full">
                  With Driver
                </span>
              </div>
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(1, 5).map((img, i) => (
                  <div key={i} className="rounded-xl overflow-hidden aspect-video relative border border-border">
                    <Image src={img} alt={`${vehicle.name} ${i + 2}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Request actual photos */}
            <a
              href={`https://wa.me/923005245427?text=Hi%2C%20please%20share%20actual%20photos%20of%20your%20${encodeURIComponent(vehicle.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-3 border border-border rounded-xl px-4 py-3.5 hover:border-gold/50 transition-colors bg-cream-dark"
            >
              <span className="text-xl">📸</span>
              <div>
                <p className="text-sm font-semibold text-ink">Request actual car photos</p>
                <p className="text-xs text-ink-soft">We'll send real photos of this vehicle via WhatsApp</p>
              </div>
              <svg className="w-4 h-4 text-ink-soft ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>

            {/* Specs grid */}
            <div className="mt-6">
              <h3 className="font-bold text-ink mb-4">Vehicle Specifications</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {specs.map((s) => (
                  <div key={s.label} className="bg-cream-dark border border-border rounded-xl px-4 py-3">
                    <p className="text-xs text-ink-soft mb-0.5">{s.label}</p>
                    <p className="font-semibold text-ink text-sm">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 bg-cream-dark border border-border rounded-xl p-5">
              <h3 className="font-bold text-ink mb-2">About This Vehicle</h3>
              <p className="text-sm text-ink-soft leading-relaxed">{vehicle.description}</p>
            </div>
          </div>

          {/* ── Right: Booking card (sticky) ── */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 rounded-2xl border border-border shadow-xl p-6 bg-white">
              {/* Price */}
              <div className="mb-5 pb-5 border-b border-border">
                <p className="text-xs text-ink-soft mb-1">Starting from</p>
                <p className="text-3xl font-extrabold text-ink">
                  PKR {vehicle.pricePerDay.toLocaleString()}
                  <span className="text-base font-normal text-muted"> / day</span>
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-semibold text-gold bg-gold/10 px-2.5 py-1 rounded-full">Driver Included</span>
                  <div className="flex items-center gap-1 text-xs text-ink-soft">
                    <svg className="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    4.8 rating
                  </div>
                </div>
              </div>

              {vehicle.available ? (
                <>
                  {/* Quick WhatsApp booking */}
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-gold hover:bg-gold-dark text-white font-semibold rounded-xl transition-colors mb-3"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Book on WhatsApp
                  </a>

                  {/* Online booking */}
                  <Link
                    href={`/book/${vehicle.slug}`}
                    className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-ink text-ink font-semibold rounded-xl hover:bg-ink hover:text-white transition-colors"
                  >
                    Book Online
                  </Link>

                  <p className="text-center text-xs text-muted mt-4">
                    Free cancellation · No credit card required to inquire
                  </p>
                </>
              ) : (
                <div className="w-full py-4 bg-cream-dark rounded-xl text-center text-ink-soft font-medium text-sm">
                  Currently Unavailable
                </div>
              )}

              {/* Divider + contact */}
              <div className="mt-5 pt-5 border-t border-border">
                <p className="text-xs text-ink-soft text-center mb-3">Have questions? We respond instantly</p>
                <a
                  href="https://wa.me/923005245427"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 text-sm font-semibold text-gold hover:text-gold-dark transition-colors"
                >
                  Chat on WhatsApp →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
