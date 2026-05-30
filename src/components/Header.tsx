"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-6 h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white font-bold text-sm">R</span>
          <span className="font-bold text-ink text-lg tracking-tight">
            Royal<span className="text-gold">Wheels</span>
          </span>
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden lg:flex items-center gap-6 text-sm text-ink-soft font-medium ml-4">
          <Link href="/fleet" className="hover:text-ink transition-colors">Fleet</Link>
          <Link href="/fleet?category=Sedan" className="hover:text-ink transition-colors">Sedans</Link>
          <Link href="/fleet?category=SUV" className="hover:text-ink transition-colors">SUVs</Link>
          <Link href="/fleet?category=Pickup%2F4x4" className="hover:text-ink transition-colors">4x4 / Pickup</Link>
          <Link href="/escort" className="hover:text-gold transition-colors font-semibold text-gold/80">Escort & Protocol</Link>
          <a href="https://wa.me/923005245427" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">WhatsApp</a>
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/account/login" className="text-sm font-medium text-ink-soft hover:text-ink transition-colors px-3 py-2">
            Log In
          </Link>
          <Link
            href="/account/login"
            className="text-sm font-semibold bg-gold text-white px-5 py-2 rounded-full hover:bg-gold-dark transition-colors"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden p-2 text-ink" onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {menuOpen
              ? <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              : <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-border bg-white px-4 py-4 flex flex-col gap-3 text-sm">
          {[
            ["/fleet", "All Fleet"],
            ["/fleet?category=Sedan", "Sedans"],
            ["/fleet?category=SUV", "SUVs"],
            ["/fleet?category=Pickup%2F4x4", "4x4 / Pickup"],
          ].map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="text-ink-soft hover:text-ink py-1">
              {label}
            </Link>
          ))}
          <div className="border-t border-border pt-3 flex gap-3">
            <Link href="/account/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2 border border-border rounded-full text-sm font-medium">
              Log In
            </Link>
            <Link href="/account/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2 bg-gold text-white rounded-full text-sm font-semibold">
              Book Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
