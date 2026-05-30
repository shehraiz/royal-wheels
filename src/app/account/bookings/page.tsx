import { redirect } from "next/navigation";
import Link from "next/link";
import { getCustomerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending Review", color: "text-amber-700 bg-amber-50 border-amber-200" },
  CNIC_VERIFIED: { label: "CNIC Verified", color: "text-blue-700 bg-blue-50 border-blue-200" },
  ADVANCE_PAID: { label: "Advance Paid", color: "text-indigo-700 bg-indigo-50 border-indigo-200" },
  CONFIRMED: { label: "Confirmed", color: "text-green-700 bg-green-50 border-green-200" },
  OUT: { label: "Vehicle Out", color: "text-purple-700 bg-purple-50 border-purple-200" },
  RETURNED: { label: "Returned", color: "text-teal-700 bg-teal-50 border-teal-200" },
  CLOSED: { label: "Closed", color: "text-ink-soft bg-cream border-border" },
  CANCELLED: { label: "Cancelled", color: "text-red-700 bg-red-50 border-red-200" },
};

export default async function MyBookingsPage() {
  const session = await getCustomerSession();
  if (!session) redirect("/account/login");

  const bookings = await prisma.booking.findMany({
    where: { customerId: session.customerId },
    include: { vehicle: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-ink py-12 px-4 sm:px-6 text-center relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gold" />
        <span className="text-gold text-xl block mb-2">♛</span>
        <h1 className="font-display text-3xl text-white">My Bookings</h1>
        <p className="text-white/40 font-body text-sm mt-1">{session.phone}</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex justify-end mb-6">
          <form action="/api/auth/logout" method="POST">
            <button className="text-sm font-body text-ink-soft hover:text-ink transition-colors">
              Sign out
            </button>
          </form>
        </div>

        {bookings.length === 0 ? (
          <div className="py-20 text-center bg-white border border-border">
            <p className="text-ink-soft font-body mb-6">You have no bookings yet.</p>
            <Link href="/fleet" className="inline-block px-8 py-3 bg-gold text-ink font-body hover:bg-gold-dark transition-colors tracking-wide">
              Browse Fleet
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((b) => {
              const statusInfo = STATUS_LABELS[b.status] ?? { label: b.status, color: "text-ink-soft" };
              const start = new Date(b.startDate).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
              const end = new Date(b.endDate).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
              return (
                <div key={b.id} className="bg-white border border-border p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-display text-xl">{b.vehicle.name}</h3>
                      <span className={`text-xs font-body px-2 py-0.5 border ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-sm font-body text-ink-soft">
                      {start} → {end} · {b.days} day{b.days > 1 ? "s" : ""}
                    </p>
                    <p className="text-xs font-body text-ink-soft mt-1">
                      Ref: <span className="font-mono">RW-{b.id.slice(-8).toUpperCase()}</span>
                      {" · "}Payment: <span className="capitalize">{b.paymentStatus.toLowerCase()}</span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-ink-soft font-body uppercase tracking-wider">Total</p>
                    <p className="font-display text-2xl">PKR {b.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
