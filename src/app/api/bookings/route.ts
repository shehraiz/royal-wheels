import { NextRequest, NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { saveCnicFile } from "@/lib/storage";

const MAX_CNIC_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

export async function POST(req: NextRequest) {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const form = await req.formData();
    const vehicleId = form.get("vehicleId") as string;
    const startDate = form.get("startDate") as string;
    const endDate = form.get("endDate") as string;
    const pickupLocation = form.get("pickupLocation") as string;
    const notes = form.get("notes") as string;
    const paymentMethod = form.get("paymentMethod") as string;
    const cnicFile = form.get("cnic") as File | null;

    if (!vehicleId || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
    }

    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle || !vehicle.available) {
      return NextResponse.json({ error: "Vehicle not available" }, { status: 400 });
    }

    // Check for conflicts
    const conflict = await prisma.booking.findFirst({
      where: {
        vehicleId,
        status: { in: ["CONFIRMED", "OUT", "RETURNED"] },
        OR: [
          { startDate: { lte: end }, endDate: { gte: start } },
        ],
      },
    });
    if (conflict) {
      return NextResponse.json({ error: "Vehicle is already booked for selected dates" }, { status: 409 });
    }

    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000));
    const totalAmount = days * vehicle.pricePerDay;

    // Handle CNIC upload
    let cnicImagePath: string | undefined;
    if (cnicFile && cnicFile.size > 0) {
      if (cnicFile.size > MAX_CNIC_SIZE) {
        return NextResponse.json({ error: "CNIC file too large (max 5MB)" }, { status: 400 });
      }
      if (!ALLOWED_TYPES.includes(cnicFile.type)) {
        return NextResponse.json({ error: "Invalid CNIC file type" }, { status: 400 });
      }
      const buffer = Buffer.from(await cnicFile.arrayBuffer());
      cnicImagePath = await saveCnicFile(buffer, cnicFile.name);
    }

    const booking = await prisma.booking.create({
      data: {
        customerId: session.customerId,
        vehicleId,
        startDate: start,
        endDate: end,
        days,
        totalAmount,
        status: "PENDING",
        pickupLocation: pickupLocation || null,
        notes: notes || null,
        paymentMethod: paymentMethod || "BANK",
        cnicImagePath: cnicImagePath || null,
        termsAcceptedAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true, bookingId: booking.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bookings = await prisma.booking.findMany({
    where: { customerId: session.customerId },
    include: { vehicle: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ bookings });
}
