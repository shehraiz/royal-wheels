import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: Record<string, string> = await req.json();

  const ops = Object.entries(body).map(([key, value]) =>
    prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } })
  );
  await Promise.all(ops);

  return NextResponse.json({ ok: true });
}
