import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { saveCarImage } from "@/lib/storage";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().optional(),
  seats: z.number().int().positive().optional(),
  pricePerDay: z.number().int().positive().optional(),
  description: z.string().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  available: z.boolean().optional(),
  mileageLimitKmPerDay: z.number().int().positive().nullable().optional(),
  extraKmCharge: z.number().int().positive().nullable().optional(),
  outOfCitySurcharge: z.number().int().positive().nullable().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const contentType = req.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("multipart/form-data")) {
      // Image upload
      const form = await req.formData();
      const vehicle = await prisma.vehicle.findUnique({ where: { id } });
      if (!vehicle) return NextResponse.json({ error: "Not found" }, { status: 404 });

      const existing: string[] = JSON.parse(vehicle.images || "[]");
      const newImages: string[] = [];

      for (const [, val] of form.entries()) {
        if (val instanceof File && val.size > 0) {
          const buf = Buffer.from(await val.arrayBuffer());
          const path = await saveCarImage(buf, val.name);
          newImages.push(path);
        }
      }

      const updated = await prisma.vehicle.update({
        where: { id },
        data: { images: JSON.stringify([...existing, ...newImages]) },
      });
      return NextResponse.json({ ok: true, images: JSON.parse(updated.images) });
    } else {
      const body = await req.json();
      const data = updateSchema.parse(body);
      const updated = await prisma.vehicle.update({ where: { id }, data });
      return NextResponse.json({ ok: true, vehicle: updated });
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.vehicle.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
