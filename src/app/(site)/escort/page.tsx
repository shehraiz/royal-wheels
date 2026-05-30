import Link from "next/link";
import QuoteForm from "./QuoteForm";

export const metadata = { title: "Escort & Protocol Services — Royal Wheels" };

const FEATURES = [
  { icon: "🛡️", title: "Trained Escort Drivers", desc: "Experienced drivers familiar with protocol procedures and security-aware driving." },
  { icon: "📡", title: "Coordinated Convoy", desc: "Radio-coordinated multi-vehicle movements with lead and tail cars." },
  { icon: "⚡", title: "Rapid Deployment", desc: "Available at short notice for dignitary visits and time-sensitive movements." },
  { icon: "🔒", title: "Discreet & Confidential", desc: "All assignments handled with full confidentiality and professionalism." },
];

export default function EscortPage() {
  const waLink = `https://wa.me/923005245427?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20Escort%20%2F%20Protocol%20services%20from%20Royal%20Wheels.`;

  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <div className="bg-ink py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <nav className="text-xs text-white/40 mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-white/70">Home</Link>
            <span>›</span>
            <span className="text-white/70">Escort & Protocol</span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="text-gold text-xs font-semibold tracking-wide">Premium Security Service</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Escort & Protocol <span className="text-gold">Services</span>
          </h1>
          <p className="text-white/50 text-sm leading-relaxed max-w-xl">
            Professional vehicle escort and VIP protocol services for dignitaries, corporate executives, and high-profile movements across Pakistan. Pricing is custom — request a quote and we'll respond within 2 hours.
          </p>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="border-b border-border bg-cream-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col gap-1.5">
              <span className="text-2xl">{f.icon}</span>
              <p className="text-xs font-bold text-ink">{f.title}</p>
              <p className="text-xs text-ink-soft leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Form */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-bold text-ink mb-6">Request a Quote</h2>
            <QuoteForm />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 flex flex-col gap-4">

              {/* WhatsApp shortcut */}
              <div className="bg-white border border-border rounded-2xl p-5">
                <h3 className="font-bold text-ink mb-1">Need to talk first?</h3>
                <p className="text-xs text-ink-soft mb-4">Reach us directly on WhatsApp for immediate assistance with protocol arrangements.</p>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gold hover:bg-gold-dark text-white font-semibold text-sm rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>

              {/* What's included */}
              <div className="bg-white border border-border rounded-2xl p-5">
                <h3 className="font-bold text-ink mb-3">What's included</h3>
                <ul className="text-xs text-ink-soft space-y-2">
                  {[
                    "Dedicated escort driver(s)",
                    "Fully fuelled escort vehicles",
                    "Route coordination & advance survey",
                    "Radio / phone communication between cars",
                    "Flexible to your schedule",
                    "Custom quote — no fixed-rate surprises",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-gold mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Vehicles used */}
              <div className="bg-cream-dark border border-border rounded-2xl p-5">
                <h3 className="font-bold text-ink mb-2 text-sm">Typical escort vehicles</h3>
                <p className="text-xs text-ink-soft">Toyota Land Cruiser V8 · Toyota Prado · Toyota Fortuner · Toyota Hilux Revo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
