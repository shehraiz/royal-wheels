import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white font-bold text-sm">R</span>
            <span className="font-bold text-white text-lg tracking-tight">
              Royal<span className="text-gold">Wheels</span>
            </span>
          </div>
          <p className="text-white/50 leading-relaxed text-sm max-w-xs mb-5">
            Premium chauffeured car rentals across Pakistan. Airport transfers, corporate travel, family trips, and more.
          </p>
          <a
            href="https://wa.me/923005245427?text=Hi%2C%20I%27d%20like%20to%20book%20a%20car%20with%20Royal%20Wheels"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gold text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gold-dark transition-colors"
          >
            Book on WhatsApp
          </a>
        </div>

        {/* Services */}
        <div>
          <p className="font-semibold text-white mb-4">Services</p>
          <div className="flex flex-col gap-2.5 text-white/50">
            {["Airport Transfers", "Corporate Rentals", "Family Trips", "Intercity Travel", "Wedding Cars", "VIP & Executive"].map(s => (
              <span key={s} className="hover:text-white/80 transition-colors cursor-default">{s}</span>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className="font-semibold text-white mb-4">Contact</p>
          <div className="flex flex-col gap-2.5 text-white/50">
            <a href="tel:+923005245427" className="hover:text-white/80 transition-colors">0300-5245427</a>
            <a href="mailto:info@royalwheels.com.pk" className="hover:text-white/80 transition-colors">info@royalwheels.com.pk</a>
            <a href="https://wa.me/923005245427" target="_blank" rel="noopener noreferrer" className="hover:text-white/80 transition-colors">WhatsApp Chat</a>
          </div>
          <div className="mt-6">
            <p className="font-semibold text-white mb-4">Company</p>
            <div className="flex flex-col gap-2.5 text-white/50">
              <Link href="/fleet" className="hover:text-white/80 transition-colors">Our Fleet</Link>
              <Link href="/account/bookings" className="hover:text-white/80 transition-colors">My Bookings</Link>
              <Link href="/account/login" className="hover:text-white/80 transition-colors">Sign In</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <span>© {new Date().getFullYear()} Royal Wheels. All rights reserved.</span>
          <span className="text-gold/50 italic">Every Ride, A Royal Experience</span>
        </div>
      </div>
    </footer>
  );
}
