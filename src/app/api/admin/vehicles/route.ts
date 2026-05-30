import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const createSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  seats: z.number().int().positive(),
  pricePerDay: z.number().int().positive(),
  description: z.string().min(1),
  transmission: z.string().default("Automatic"),
  fuelType: z.string().default("Petrol"),
  mileageLimitKmPerDay: z.number().int().positive().nullable().optional(),
  extraKmCharge: z.number().int().positive().nullable().optional(),
  outOfCitySurcharge: z.number().int().positive().nullable().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = createSchema.parse(body);
    const vehicle = await prisma.vehicle.create({ data: { ...data, images: "[]" } });
    return NextResponse.json({ ok: true, vehicle });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
