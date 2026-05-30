import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCnicAbsPath } from "@/lib/storage";

export async function GET(req: NextRequest, { params }: { params: Promise<{ bookingId: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { bookingId } = await params;
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking?.cnicImagePath) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const absPath = getCnicAbsPath(booking.cnicImagePath);
    const file = await readFile(absPath);
    const ext = booking.cnicImagePath.split(".").pop()?.toLowerCase();
    const contentType =
      ext === "pdf" ? "application/pdf" : ext === "png" ? "image/png" : "image/jpeg";

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="cnic-${bookingId.slice(-8)}.${ext}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
