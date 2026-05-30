import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Royal Wheels — Premium Car Rentals with Driver",
  description:
    "Every Ride, A Royal Experience. Premium chauffeured car rentals across Pakistan. Airport transfers, corporate travel, family trips and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {children}
      </body>
    </html>
  );
}
