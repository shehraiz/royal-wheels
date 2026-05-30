import { redirect, notFound } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import VehicleEditForm from "./VehicleEditForm";

export default async function AdminVehicleEditPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) notFound();

  return (
    <div className="max-w-2xl">
      <a href="/admin/vehicles" className="text-cream/40 hover:text-cream text-sm transition-colors mb-6 inline-block">
        ← Vehicles
      </a>
      <h1 className="font-display text-2xl text-cream mb-6">Edit {vehicle.name}</h1>
      <VehicleEditForm vehicle={vehicle} />
    </div>
  );
}
