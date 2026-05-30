import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminNav from "./AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login page doesn't need auth check
  return (
    <div className="min-h-screen bg-ink text-cream font-body">
      <AdminNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
