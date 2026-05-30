import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "fallback-secret-change-me"
);

export interface CustomerSession {
  customerId: string;
  phone: string;
}

export interface AdminSession {
  adminId: string;
  email: string;
}

export async function setCustomerSession(data: CustomerSession) {
  const token = await new SignJWT({ ...data, type: "customer" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set("customer_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

export async function getCustomerSession(): Promise<CustomerSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("customer_session")?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secret);
    if (payload.type !== "customer") return null;
    return { customerId: payload.customerId as string, phone: payload.phone as string };
  } catch {
    return null;
  }
}

export async function clearCustomerSession() {
  const cookieStore = await cookies();
  cookieStore.delete("customer_session");
}

export async function setAdminSession(data: AdminSession) {
  const token = await new SignJWT({ ...data, type: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("8h")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secret);
    if (payload.type !== "admin") return null;
    return { adminId: payload.adminId as string, email: payload.email as string };
  } catch {
    return null;
  }
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}
