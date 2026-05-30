import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminPhotoRequestsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const requests = await prisma.photoRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      vehicle: { select: { name: true } },
      customer: { select: { phone: true } },
    },
  });

  return (
    <div>
      <h1 className="font-display text-2xl text-cream mb-6">Photo Requests</h1>
      <div className="border border-cream/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream/10">
              {["Customer", "Vehicle", "Status", "Requested", "Action"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-cream/40 font-body text-xs uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-b border-cream/5 hover:bg-cream/5">
                <td className="px-4 py-3 text-cream/70">{r.customer.phone}</td>
                <td className="px-4 py-3 text-cream">{r.vehicle.name}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 border ${r.status === "FULFILLED" ? "border-green-700/40 text-green-400" : "border-gold/40 text-gold"}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-cream/40 text-xs">
                  {new Date(r.createdAt).toLocaleDateString("en-PK", { dateStyle: "medium" })}
                </td>
                <td className="px-4 py-3">
                  {r.status === "PENDING" && (
                    <a
                      href={`https://wa.me/${r.customer.phone.replace("+", "")}?text=Hi%2C%20here%20are%20the%20photos%20you%20requested%20for%20${encodeURIComponent(r.vehicle.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gold/70 hover:text-gold transition-colors"
                    >
                      Reply via WhatsApp →
                    </a>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-cream/30">No photo requests</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
