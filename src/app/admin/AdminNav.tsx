"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/vehicles", label: "Vehicles" },
  { href: "/admin/photo-requests", label: "Photo Requests" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return null;

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  return (
    <header className="border-b border-white/10 bg-ink sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="flex items-center gap-2 shrink-0">
            <span className="text-gold text-sm">♛</span>
            <span className="font-display text-base tracking-widest uppercase">
              <span className="text-white">Royal</span>{" "}
              <span className="text-gold">Wheels</span>
            </span>
            <span className="text-white/20 text-xs font-body ml-1">Admin</span>
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-xs font-body tracking-widest uppercase">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`transition-colors ${
                  pathname === l.href ? "text-gold" : "text-white/40 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <button onClick={logout} className="text-[10px] text-white/30 hover:text-white transition-colors uppercase tracking-widest">
          Sign out
        </button>
      </div>
    </header>
  );
}
