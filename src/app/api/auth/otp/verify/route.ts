import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyOtpRecord } from "@/lib/otp";
import { prisma } from "@/lib/db";
import { setCustomerSession } from "@/lib/auth";

const schema = z.object({
  phone: z.string().regex(/^\+92\d{10}$/),
  code: z.string().length(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, code } = schema.parse(body);

    const valid = await verifyOtpRecord(phone, code);
    if (!valid) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
    }

    // Create or find customer
    let customer = await prisma.customer.findUnique({ where: { phone } });
    if (!customer) {
      customer = await prisma.customer.create({ data: { phone } });
    }

    await setCustomerSession({ customerId: customer.id, phone: customer.phone });

    return NextResponse.json({ ok: true, customer: { id: customer.id, phone: customer.phone, name: customer.name } });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
