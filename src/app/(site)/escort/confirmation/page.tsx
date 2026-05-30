import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function QuoteConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  if (!id) notFound();

  const quote = await prisma.quoteRequest.findUnique({ where: { id } });
  if (!quote) notFound();

  const SERVICE_LABELS: Record<string, string> = {
    ESCORT: "Vehicle Escort",
    PROTOCOL: "Protocol / VIP",
    CONVOY: "Full Convoy",
  };

  const waLink = `https://wa.me/923005245427?text=Hi%2C%20I%20submitted%20an%20escort%20quote%20request%20(Ref%3A%20${id.slice(-8).toUpperCase()}).%20Please%20confirm.`;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-16">

        {/* Success icon */}
        <div className="w-16 h-16 rounded-full bg-gold/10 border-2 border-gold flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-extrabold text-ink text-center mb-2">Quote Request Received</h1>
        <p className="text-sm text-ink-soft text-center mb-8">
          We'll call <span className="font-semibold text-ink">{quote.phone}</span> within 2 hours to confirm details and provide pricing.
        </p>

        {/* Summary card */}
        <div className="bg-cream-dark border border-border rounded-2xl p-5 mb-6 text-sm">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-border">
            <span className="text-ink-soft text-xs uppercase tracking-wider">Reference</span>
            <span className="font-mono font-bold text-ink">RWQ-{id.slice(-8).toUpperCase()}</span>
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-soft">Service</span>
              <span className="font-medium text-ink">{SERVICE_LABELS[quote.serviceType] ?? quote.serviceType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Date</span>
              <span className="font-medium text-ink">
                {new Date(quote.date).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-ink-soft shrink-0">From</span>
              <span className="font-medium text-ink text-right">{quote.pickupLocation}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-ink-soft shrink-0">To</span>
              <span className="font-medium text-ink text-right">{quote.destination}</span>
            </div>
            {quote.vehicleCount && (
              <div className="flex justify-between">
                <span className="text-ink-soft">Escort vehicles</span>
                <span className="font-medium text-ink">{quote.vehicleCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* WhatsApp follow-up */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-gold hover:bg-gold-dark text-white font-semibold text-sm rounded-xl transition-colors mb-3"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Follow up on WhatsApp
        </a>

        <Link href="/" className="block text-center text-sm text-ink-soft hover:text-gold transition-colors">
          ← Back to Home
        </Link>

        <p className="text-center text-xs text-muted mt-8 italic">Every Ride, A Royal Experience</p>
      </div>
    </div>
  );
}
