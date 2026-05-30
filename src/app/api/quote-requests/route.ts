import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional().or(z.literal("")),
  serviceType: z.enum(["ESCORT", "PROTOCOL", "CONVOY"]),
  date: z.string().min(1),
  pickupLocation: z.string().min(2),
  destination: z.string().min(2),
  vehicleCount: z.coerce.number().int().min(1).optional(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const quote = await prisma.quoteRequest.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        serviceType: data.serviceType,
        date: new Date(data.date),
        pickupLocation: data.pickupLocation,
        destination: data.destination,
        vehicleCount: data.vehicleCount ?? null,
        notes: data.notes ?? null,
      },
    });

    return NextResponse.json({ quoteId: quote.id });
  } catch (err: any) {
    if (err?.issues) return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: "Failed to submit quote request." }, { status: 500 });
  }
}
