import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import QuoteStatusUpdater from "./QuoteStatusUpdater";

const SERVICE_LABELS: Record<string, string> = {
  ESCORT: "Vehicle Escort",
  PROTOCOL: "Protocol / VIP",
  CONVOY: "Full Convoy",
};

const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-gold/10 text-gold",
  CONTACTED: "bg-blue-50 text-blue-700",
  QUOTED: "bg-green-50 text-green-700",
  CLOSED: "bg-cream-dark text-muted",
};

export default async function AdminQuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { status } = await searchParams;

  const quotes = await prisma.quoteRequest.findMany({
    where: status ? { status } : {},
    orderBy: { createdAt: "desc" },
  });

  const ALL_STATUSES = ["NEW", "CONTACTED", "QUOTED", "CLOSED"];

  return (
    <div>
      <h1 className="font-display text-2xl text-cream mb-6">Escort / Protocol Quotes</h1>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6 text-xs">
        <a href="/admin/quotes" className={`px-3 py-1.5 border transition-colors ${!status ? "border-gold text-gold" : "border-cream/20 text-cream/50 hover:border-cream/40"}`}>
          All ({quotes.length})
        </a>
        {ALL_STATUSES.map((s) => (
          <a
            key={s}
            href={`/admin/quotes?status=${s}`}
            className={`px-3 py-1.5 border transition-colors ${status === s ? "border-gold text-gold" : "border-cream/20 text-cream/50 hover:border-cream/40"}`}
          >
            {s}
          </a>
        ))}
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-4">
        {quotes.map((q) => (
          <div key={q.id} className="border border-cream/10 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-cream font-semibold">{q.name}</p>
                <p className="text-cream/50 text-xs mt-0.5">{q.phone}{q.email ? ` · ${q.email}` : ""}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[q.status] ?? "text-cream/50"}`}>
                  {q.status}
                </span>
                <span className="font-mono text-xs text-cream/30">RWQ-{q.id.slice(-8).toUpperCase()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
              <div>
                <p className="text-cream/40 mb-0.5">Service</p>
                <p className="text-cream">{SERVICE_LABELS[q.serviceType] ?? q.serviceType}</p>
              </div>
              <div>
                <p className="text-cream/40 mb-0.5">Date</p>
                <p className="text-cream">{new Date(q.date).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
              <div>
                <p className="text-cream/40 mb-0.5">From</p>
                <p className="text-cream">{q.pickupLocation}</p>
              </div>
              <div>
                <p className="text-cream/40 mb-0.5">To</p>
                <p className="text-cream">{q.destination}</p>
              </div>
              {q.vehicleCount && (
                <div>
                  <p className="text-cream/40 mb-0.5">Vehicles needed</p>
                  <p className="text-cream">{q.vehicleCount}</p>
                </div>
              )}
              {q.notes && (
                <div className="col-span-2 sm:col-span-4">
                  <p className="text-cream/40 mb-0.5">Notes</p>
                  <p className="text-cream/70">{q.notes}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-cream/10">
              <a
                href={`https://wa.me/${q.phone.replace(/[^0-9]/g, "").replace(/^0/, "92")}?text=Hi%20${encodeURIComponent(q.name)}%2C%20this%20is%20Royal%20Wheels%20regarding%20your%20escort%20service%20quote%20(Ref%3A%20RWQ-${q.id.slice(-8).toUpperCase()}).`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gold/70 hover:text-gold transition-colors"
              >
                WhatsApp →
              </a>
              <QuoteStatusUpdater quoteId={q.id} currentStatus={q.status} />
            </div>
          </div>
        ))}

        {quotes.length === 0 && (
          <div className="border border-cream/10 px-4 py-12 text-center text-cream/30">
            No quote requests yet
          </div>
        )}
      </div>
    </div>
  );
}
