import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { compareSync } from "bcryptjs";
import { prisma } from "@/lib/db";
import { setAdminSession, clearAdminSession } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin || !compareSync(password, admin.passwordHash)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await setAdminSession({ adminId: admin.id, email: admin.email });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

export async function DELETE() {
  await clearAdminSession();
  return NextResponse.json({ ok: true });
}
