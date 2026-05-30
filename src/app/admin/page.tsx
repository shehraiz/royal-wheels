import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [
    pendingCount,
    confirmedCount,
    todayPickups,
    todayReturns,
    pendingPhotoRequests,
    recentBookings,
    totalRevenue,
  ] = await Promise.all([
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({ where: { status: { in: ["CONFIRMED", "OUT"] } } }),
    prisma.booking.count({ where: { startDate: { gte: today, lt: tomorrow }, status: "CONFIRMED" } }),
    prisma.booking.count({ where: { endDate: { gte: today, lt: tomorrow }, status: "OUT" } }),
    prisma.photoRequest.count({ where: { status: "PENDING" } }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { vehicle: { select: { name: true } }, customer: { select: { phone: true } } },
    }),
    prisma.booking.aggregate({
      where: { status: { in: ["CONFIRMED", "OUT", "RETURNED", "CLOSED"] } },
      _sum: { totalAmount: true },
    }),
  ]);

  const stats = [
    { label: "Pending Bookings", value: pendingCount, href: "/admin/bookings?status=PENDING", urgent: pendingCount > 0 },
    { label: "Active Bookings", value: confirmedCount, href: "/admin/bookings?status=CONFIRMED" },
    { label: "Today's Pickups", value: todayPickups, href: "/admin/bookings" },
    { label: "Today's Returns", value: todayReturns, href: "/admin/bookings" },
    { label: "Pending Photo Req.", value: pendingPhotoRequests, href: "/admin/photo-requests", urgent: pendingPhotoRequests > 0 },
    { label: "Total Revenue", value: `PKR ${(totalRevenue._sum.totalAmount ?? 0).toLocaleString()}`, href: "/admin/bookings" },
  ];

  const STATUS_LABELS: Record<string, string> = {
    PENDING: "Pending",
    CNIC_VERIFIED: "CNIC Verified",
    ADVANCE_PAID: "Advance Paid",
    CONFIRMED: "Confirmed",
    OUT: "Out",
    RETURNED: "Returned",
    CLOSED: "Closed",
    CANCELLED: "Cancelled",
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-cream mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`p-5 border transition-colors ${
              s.urgent ? "border-gold/40 bg-gold/5 hover:border-gold/70" : "border-cream/10 hover:border-cream/20"
            }`}
          >
            <p className="text-xs text-cream/40 uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`font-display text-2xl ${s.urgent ? "text-gold" : "text-cream"}`}>{s.value}</p>
          </Link>
        ))}
      </div>

      {/* Recent bookings */}
      <h2 className="font-display text-lg text-cream mb-4">Recent Bookings</h2>
      <div className="border border-cream/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream/10">
              <th className="text-left px-4 py-3 text-cream/40 font-body text-xs uppercase tracking-wider">Customer</th>
              <th className="text-left px-4 py-3 text-cream/40 font-body text-xs uppercase tracking-wider">Vehicle</th>
              <th className="text-left px-4 py-3 text-cream/40 font-body text-xs uppercase tracking-wider">Status</th>
              <th className="text-right px-4 py-3 text-cream/40 font-body text-xs uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.map((b) => (
              <tr key={b.id} className="border-b border-cream/5 hover:bg-cream/5">
                <td className="px-4 py-3 text-cream/70">{b.customer.phone}</td>
                <td className="px-4 py-3 text-cream">{b.vehicle.name}</td>
                <td className="px-4 py-3">
                  <span className="text-xs text-gold">{STATUS_LABELS[b.status] ?? b.status}</span>
                </td>
                <td className="px-4 py-3 text-right text-cream">PKR {b.totalAmount.toLocaleString()}</td>
              </tr>
            ))}
            {recentBookings.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-cream/30">No bookings yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
