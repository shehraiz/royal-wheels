import { redirect, notFound } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import BookingActions from "./BookingActions";

const LIFECYCLE = ["PENDING", "CNIC_VERIFIED", "ADVANCE_PAID", "CONFIRMED", "OUT", "RETURNED", "CLOSED"];

export default async function AdminBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      vehicle: true,
      customer: true,
    },
  });
  if (!booking) notFound();

  const currentIdx = LIFECYCLE.indexOf(booking.status);
  const nextStatus = currentIdx < LIFECYCLE.length - 1 ? LIFECYCLE[currentIdx + 1] : null;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <a href="/admin/bookings" className="text-cream/40 hover:text-cream text-sm transition-colors">← Bookings</a>
        <h1 className="font-display text-2xl text-cream">
          Booking #{booking.id.slice(-8).toUpperCase()}
        </h1>
      </div>

      {/* Status timeline */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {LIFECYCLE.map((s, i) => {
          const done = i <= currentIdx;
          const current = i === currentIdx;
          return (
            <div key={s} className="flex items-center">
              <div className={`px-2 py-1 text-xs whitespace-nowrap ${current ? "bg-gold text-ink font-medium" : done ? "text-gold/70" : "text-cream/20"}`}>
                {s.replace("_", " ")}
              </div>
              {i < LIFECYCLE.length - 1 && (
                <div className={`w-4 h-px mx-0.5 ${done ? "bg-gold/50" : "bg-cream/10"}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Booking info */}
        <div className="border border-cream/10 p-5">
          <h2 className="text-xs text-cream/40 uppercase tracking-wider mb-4">Booking Details</h2>
          <div className="flex flex-col gap-2 text-sm">
            {[
              ["Vehicle", booking.vehicle.name],
              ["Customer", booking.customer.phone],
              ["Start", new Date(booking.startDate).toLocaleDateString("en-PK", { dateStyle: "long" })],
              ["End", new Date(booking.endDate).toLocaleDateString("en-PK", { dateStyle: "long" })],
              ["Days", booking.days],
              ["Total Amount", `PKR ${booking.totalAmount.toLocaleString()}`],
              ["Payment Method", booking.paymentMethod ?? "—"],
              ["Payment Status", booking.paymentStatus],
              ["Pickup", booking.pickupLocation ?? "—"],
              ["Notes", booking.notes ?? "—"],
            ].map(([label, val]) => (
              <div key={String(label)} className="flex justify-between">
                <span className="text-cream/40">{label}</span>
                <span className="text-cream">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="border border-cream/10 p-5">
          <h2 className="text-xs text-cream/40 uppercase tracking-wider mb-4">Actions</h2>
          <BookingActions
            bookingId={booking.id}
            currentStatus={booking.status}
            nextStatus={nextStatus}
            hasCnic={!!booking.cnicImagePath}
          />
        </div>
      </div>

      {/* CNIC viewer link */}
      {booking.cnicImagePath && (
        <div className="border border-gold/20 p-4 text-sm">
          <p className="text-cream/60 mb-2">CNIC document uploaded by customer.</p>
          <a
            href={`/api/uploads/cnic/${booking.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline"
          >
            View CNIC Image →
          </a>
        </div>
      )}
    </div>
  );
}
