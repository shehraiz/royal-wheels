import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import SettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const settings = await prisma.setting.findMany();
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl text-cream mb-6">Settings</h1>
      <SettingsForm settings={map} />
    </div>
  );
}
