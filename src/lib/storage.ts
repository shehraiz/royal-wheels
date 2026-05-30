import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "private_uploads");
const PUBLIC_CAR_ROOT = path.join(process.cwd(), "public", "uploads", "cars");

export async function saveCnicFile(
  buffer: Buffer,
  filename: string
): Promise<string> {
  const dir = path.join(UPLOAD_ROOT, "cnic");
  await mkdir(dir, { recursive: true });
  const safeName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const fullPath = path.join(dir, safeName);
  await writeFile(fullPath, buffer);
  return `cnic/${safeName}`;
}

export async function saveCarImage(
  buffer: Buffer,
  filename: string
): Promise<string> {
  await mkdir(PUBLIC_CAR_ROOT, { recursive: true });
  const safeName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const fullPath = path.join(PUBLIC_CAR_ROOT, safeName);
  await writeFile(fullPath, buffer);
  return `/uploads/cars/${safeName}`;
}

export async function savePaymentProof(
  buffer: Buffer,
  filename: string
): Promise<string> {
  const dir = path.join(UPLOAD_ROOT, "payment_proofs");
  await mkdir(dir, { recursive: true });
  const safeName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const fullPath = path.join(dir, safeName);
  await writeFile(fullPath, buffer);
  return `payment_proofs/${safeName}`;
}

export function getCnicAbsPath(relativePath: string): string {
  return path.join(UPLOAD_ROOT, relativePath);
}
