import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import VehicleToggle from "./VehicleToggle";

export default async function AdminVehiclesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const vehicles = await prisma.vehicle.findMany({ orderBy: { pricePerDay: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-cream">Vehicles</h1>
        <Link href="/admin/vehicles/new" className="px-4 py-2 bg-gold text-ink text-sm hover:bg-gold-light transition-colors">
          + Add Vehicle
        </Link>
      </div>

      <div className="border border-cream/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream/10">
              {["Vehicle", "Category", "Seats", "PKR/Day", "Available", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-cream/40 font-body text-xs uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id} className="border-b border-cream/5 hover:bg-cream/5">
                <td className="px-4 py-3 text-cream font-medium">{v.name}</td>
                <td className="px-4 py-3 text-cream/60">{v.category}</td>
                <td className="px-4 py-3 text-cream/60">{v.seats}</td>
                <td className="px-4 py-3 text-cream">PKR {v.pricePerDay.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <VehicleToggle vehicleId={v.id} available={v.available} />
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/vehicles/${v.id}`} className="text-xs text-gold/70 hover:text-gold transition-colors">
                    Edit →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
