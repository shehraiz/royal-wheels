import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCustomerSession } from "@/lib/auth";
import BookingForm from "./BookingForm";

export async function generateMetadata({ params }: { params: Promise<{ vehicleSlug: string }> }) {
  const { vehicleSlug } = await params;
  const v = await prisma.vehicle.findUnique({ where: { slug: vehicleSlug } });
  if (!v) return {};
  return { title: `Book ${v.name} — Kch Khaas` };
}

export default async function BookPage({ params }: { params: Promise<{ vehicleSlug: string }> }) {
  const { vehicleSlug } = await params;
  const session = await getCustomerSession();
  if (!session) redirect(`/account/login?next=/book/${vehicleSlug}`);

  const vehicle = await prisma.vehicle.findUnique({ where: { slug: vehicleSlug } });
  if (!vehicle || !vehicle.available) notFound();

  const advancePercent = parseInt(process.env.ADVANCE_PERCENT ?? "40");

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-3xl mb-1">Book Your Vehicle</h1>
      <p className="text-muted font-body text-sm mb-8">
        Completing booking for <strong>{vehicle.name}</strong> · PKR {vehicle.pricePerDay.toLocaleString()}/day
      </p>
      <BookingForm
        vehicle={{
          id: vehicle.id,
          name: vehicle.name,
          slug: vehicle.slug,
          pricePerDay: vehicle.pricePerDay,
        }}
        advancePercent={advancePercent}
      />
    </div>
  );
}
