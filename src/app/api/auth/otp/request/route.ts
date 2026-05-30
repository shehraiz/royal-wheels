import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkOtpRateLimit, createOtpRecord, generateOtp, sendOtp } from "@/lib/otp";

const schema = z.object({
  phone: z.string().regex(/^\+92\d{10}$/, "Phone must be in +92XXXXXXXXXX format"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone } = schema.parse(body);

    const allowed = await checkOtpRateLimit(phone);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many OTP requests. Please wait 10 minutes." },
        { status: 429 }
      );
    }

    const code = generateOtp();
    await createOtpRecord(phone, code);
    await sendOtp(phone, code);

    return NextResponse.json({ ok: true, message: "OTP sent" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
