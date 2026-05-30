import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const VALID_STATUSES = ["PENDING", "CNIC_VERIFIED", "ADVANCE_PAID", "CONFIRMED", "OUT", "RETURNED", "CLOSED", "CANCELLED"];

const schema = z.object({
  status: z.enum(VALID_STATUSES as [string, ...string[]]),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const body = await req.json();
    const { status } = schema.parse(body);

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ ok: true, status: updated.status });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
