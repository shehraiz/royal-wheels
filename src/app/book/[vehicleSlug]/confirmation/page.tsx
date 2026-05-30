import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCustomerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getBankDetails, calcAdvanceAmount } from "@/lib/payments";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const session = await getCustomerSession();
  if (!session) redirect("/account/login");

  const { bookingId } = await searchParams;
  if (!bookingId) redirect("/account/bookings");

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, customerId: session.customerId },
    include: { vehicle: true },
  });
  if (!booking) redirect("/account/bookings");

  const advance = calcAdvanceAmount(booking.totalAmount);
  const bankDetails = getBankDetails();
  const refNo = `RW-${booking.id.slice(-8).toUpperCase()}`;
  const waLink = `https://wa.me/923005245427?text=Hi%2C%20I%27ve%20made%20a%20booking%20(Ref%3A%20${refNo})%20for%20the%20${encodeURIComponent(booking.vehicle.name)}.%20Please%20confirm.`;

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Success header */}
        <div className="text-center mb-8">
          <span className="text-gold text-4xl block mb-3">♛</span>
          <h1 className="font-display text-3xl text-ink mb-2">Booking Received!</h1>
          <p className="text-ink-soft font-body text-sm">
            Thank you for choosing Royal Wheels. Our team will contact you shortly to confirm your booking.
          </p>
        </div>

        {/* Booking summary */}
        <div className="bg-white border border-border p-6 mb-5">
          <div className="flex justify-between items-start mb-5 pb-5 border-b border-border">
            <div>
              <p className="text-[10px] text-ink-soft font-body uppercase tracking-widest">Vehicle</p>
              <p className="font-display text-2xl">{booking.vehicle.name}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-ink-soft font-body uppercase tracking-widest">Reference</p>
              <p className="font-mono text-sm font-medium">{refNo}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm font-body">
            {[
              ["Start Date", new Date(booking.startDate).toLocaleDateString("en-PK", { dateStyle: "long" })],
              ["End Date", new Date(booking.endDate).toLocaleDateString("en-PK", { dateStyle: "long" })],
              ["Duration", `${booking.days} day${booking.days > 1 ? "s" : ""}`],
              ["Total Amount", `PKR ${booking.totalAmount.toLocaleString()}`],
            ].map(([label, val]) => (
              <div key={label}>
                <p className="text-[10px] text-ink-soft uppercase tracking-wider mb-0.5">{label}</p>
                <p className="font-medium">{val}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
            <span className="text-sm font-body text-ink-soft">Advance payment required</span>
            <span className="font-display text-xl text-gold">PKR {advance.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment instructions */}
        {booking.paymentMethod === "BANK" && (
          <div className="bg-white border border-gold/20 p-5 mb-5 text-sm font-body">
            <p className="font-semibold text-ink mb-2 text-[10px] uppercase tracking-widest">Bank Transfer Details</p>
            <p className="text-ink-soft whitespace-pre-line leading-relaxed">{bankDetails}</p>
            <p className="text-xs text-ink-soft mt-3 p-3 bg-cream border border-border">
              Please transfer PKR {advance.toLocaleString()} and send proof via WhatsApp with your reference <strong>{refNo}</strong>.
            </p>
          </div>
        )}

        {booking.paymentMethod === "CASH_VOUCHER" && (
          <div className="bg-white border border-gold/20 p-5 mb-5 text-sm font-body">
            <p className="font-semibold text-ink mb-1 text-[10px] uppercase tracking-widest">Cash Voucher</p>
            <p className="text-ink-soft">
              Reference: <span className="font-mono font-medium">{refNo}</span>
              <br />Pay PKR {advance.toLocaleString()} at our office to confirm your booking.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center w-full py-3.5 bg-gold text-ink font-body font-medium hover:bg-gold-dark transition-colors tracking-wide"
          >
            Confirm via WhatsApp
          </a>
          <Link
            href="/account/bookings"
            className="block text-center w-full py-3.5 border border-ink text-ink font-body hover:bg-ink hover:text-white transition-colors tracking-wide"
          >
            View My Bookings
          </Link>
        </div>

        <p className="text-center text-xs text-ink-soft font-body mt-6 italic">
          "Every Ride, A Royal Experience"
        </p>
      </div>
    </div>
  );
}
