import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const ALL_STATUSES = ["PENDING", "CNIC_VERIFIED", "ADVANCE_PAID", "CONFIRMED", "OUT", "RETURNED", "CLOSED", "CANCELLED"];

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { status } = await searchParams;

  const bookings = await prisma.booking.findMany({
    where: status ? { status } : {},
    include: {
      vehicle: { select: { name: true } },
      customer: { select: { phone: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl text-cream mb-6">Bookings</h1>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-6 text-xs">
        <Link href="/admin/bookings" className={`px-3 py-1.5 border transition-colors ${!status ? "border-gold text-gold" : "border-cream/20 text-cream/50 hover:border-cream/40"}`}>
          All
        </Link>
        {ALL_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/bookings?status=${s}`}
            className={`px-3 py-1.5 border transition-colors ${status === s ? "border-gold text-gold" : "border-cream/20 text-cream/50 hover:border-cream/40"}`}
          >
            {s.replace("_", " ")}
          </Link>
        ))}
      </div>

      <div className="border border-cream/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream/10">
              {["ID", "Customer", "Vehicle", "Dates", "Amount", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-cream/40 font-body text-xs uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-cream/5 hover:bg-cream/5">
                <td className="px-4 py-3 font-mono text-xs text-cream/50">{b.id.slice(-8).toUpperCase()}</td>
                <td className="px-4 py-3 text-cream/70">{b.customer.phone}</td>
                <td className="px-4 py-3 text-cream">{b.vehicle.name}</td>
                <td className="px-4 py-3 text-cream/60 text-xs">
                  {new Date(b.startDate).toLocaleDateString("en-PK", { day: "numeric", month: "short" })}
                  {" → "}
                  {new Date(b.endDate).toLocaleDateString("en-PK", { day: "numeric", month: "short" })}
                </td>
                <td className="px-4 py-3 text-cream">PKR {b.totalAmount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className="text-xs text-gold">{b.status.replace("_", " ")}</span>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/bookings/${b.id}`} className="text-xs text-gold/70 hover:text-gold transition-colors">
                    Manage →
                  </Link>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-cream/30">No bookings found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
