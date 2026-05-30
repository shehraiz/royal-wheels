import { createHash, randomInt } from "crypto";
import { prisma } from "./db";

export function generateOtp(): string {
  return String(randomInt(100000, 999999));
}

export function hashOtp(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

export async function sendOtp(phone: string, code: string): Promise<void> {
  if (process.env.OTP_MODE === "dev") {
    console.log(`[OTP DEV] Phone: ${phone} | Code: ${code}`);
    return;
  }
  // TODO: plug in Twilio Verify or Pakistani SMS gateway
  throw new Error("SMS provider not configured");
}

export async function createOtpRecord(phone: string, code: string) {
  const codeHash = hashOtp(code);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await prisma.otpCode.create({ data: { phone, codeHash, expiresAt } });
}

export async function verifyOtpRecord(
  phone: string,
  code: string
): Promise<boolean> {
  const codeHash = hashOtp(code);
  const record = await prisma.otpCode.findFirst({
    where: {
      phone,
      codeHash,
      consumed: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });
  if (!record) return false;
  await prisma.otpCode.update({ where: { id: record.id }, data: { consumed: true } });
  return true;
}

export async function checkOtpRateLimit(phone: string): Promise<boolean> {
  const since = new Date(Date.now() - 10 * 60 * 1000);
  const count = await prisma.otpCode.count({
    where: { phone, createdAt: { gte: since } },
  });
  return count < 3;
}
