"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Vehicle {
  id: string;
  name: string;
  slug: string;
  category: string;
  seats: number;
  pricePerDay: number;
  description: string;
  transmission: string;
  fuelType: string;
  images: string;
  available: boolean;
  mileageLimitKmPerDay: number | null;
  extraKmCharge: number | null;
  outOfCitySurcharge: number | null;
}

export default function VehicleEditForm({ vehicle }: { vehicle: Vehicle }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: vehicle.name,
    pricePerDay: vehicle.pricePerDay,
    description: vehicle.description,
    transmission: vehicle.transmission,
    fuelType: vehicle.fuelType,
    seats: vehicle.seats,
    available: vehicle.available,
    mileageLimitKmPerDay: vehicle.mileageLimitKmPerDay ?? "",
    extraKmCharge: vehicle.extraKmCharge ?? "",
    outOfCitySurcharge: vehicle.outOfCitySurcharge ?? "",
  });
  const [images] = useState<string[]>(JSON.parse(vehicle.images || "[]"));
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [message, setMessage] = useState("");

  async function saveDetails(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/vehicles/${vehicle.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          pricePerDay: Number(form.pricePerDay),
          seats: Number(form.seats),
          mileageLimitKmPerDay: form.mileageLimitKmPerDay ? Number(form.mileageLimitKmPerDay) : null,
          extraKmCharge: form.extraKmCharge ? Number(form.extraKmCharge) : null,
          outOfCitySurcharge: form.outOfCitySurcharge ? Number(form.outOfCitySurcharge) : null,
        }),
      });
      if (res.ok) { setMessage("Saved!"); router.refresh(); }
      else { const d = await res.json(); setMessage(d.error); }
    } finally {
      setSaving(false);
    }
  }

  async function uploadImages(e: React.FormEvent) {
    e.preventDefault();
    if (!imageFiles?.length) return;
    setUploadingImages(true);
    setMessage("");
    try {
      const form = new FormData();
      for (const f of imageFiles) form.append("image", f);
      const res = await fetch(`/api/admin/vehicles/${vehicle.id}`, { method: "PATCH", body: form });
      if (res.ok) { setMessage("Images uploaded!"); router.refresh(); }
      else { const d = await res.json(); setMessage(d.error); }
    } finally {
      setUploadingImages(false);
    }
  }

  const field = (label: string, key: keyof typeof form, type = "text") => (
    <div key={key}>
      <label className="block text-xs text-cream/40 uppercase tracking-wider mb-1">{label}</label>
      {key === "description" ? (
        <textarea
          value={String(form[key])}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          rows={4}
          className="w-full bg-cream/5 border border-cream/10 px-3 py-2 text-cream text-sm focus:outline-none focus:border-gold resize-none"
        />
      ) : key === "available" ? (
        <select
          value={String(form[key])}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value === "true" }))}
          className="w-full bg-cream/5 border border-cream/10 px-3 py-2 text-cream text-sm focus:outline-none focus:border-gold"
        >
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>
      ) : (
        <input
          type={type}
          value={String(form[key])}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className="w-full bg-cream/5 border border-cream/10 px-3 py-2 text-cream text-sm focus:outline-none focus:border-gold"
        />
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Details form */}
      <form onSubmit={saveDetails} className="flex flex-col gap-4">
        {field("Name", "name")}
        {field("Price per Day (PKR)", "pricePerDay", "number")}
        {field("Seats", "seats", "number")}
        {field("Transmission", "transmission")}
        {field("Fuel Type", "fuelType")}
        {field("Mileage Limit (km/day)", "mileageLimitKmPerDay", "number")}
        {field("Extra KM Charge (PKR)", "extraKmCharge", "number")}
        {field("Out-of-City Surcharge (PKR)", "outOfCitySurcharge", "number")}
        {field("Availability", "available")}
        {field("Description", "description")}
        <button
          type="submit"
          disabled={saving}
          className="py-2.5 bg-gold text-ink text-sm font-medium hover:bg-gold-light transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Details"}
        </button>
      </form>

      {/* Current images */}
      {images.length > 0 && (
        <div>
          <p className="text-xs text-cream/40 uppercase tracking-wider mb-3">Current Images</p>
          <div className="grid grid-cols-3 gap-2">
            {images.map((img, i) => (
              <div key={i} className="aspect-video relative bg-cream/5">
                <Image src={img} alt={`img ${i}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload images */}
      <form onSubmit={uploadImages} className="flex flex-col gap-3">
        <p className="text-xs text-cream/40 uppercase tracking-wider">Add Images</p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImageFiles(e.target.files)}
          className="w-full text-sm text-cream/60 file:mr-3 file:border-0 file:bg-gold/10 file:text-gold file:px-3 file:py-1 file:text-xs"
        />
        <button
          type="submit"
          disabled={uploadingImages || !imageFiles?.length}
          className="py-2 border border-gold text-gold text-sm hover:bg-gold hover:text-ink transition-colors disabled:opacity-50"
        >
          {uploadingImages ? "Uploading…" : "Upload Images"}
        </button>
      </form>

      {message && (
        <p className="text-sm text-gold">{message}</p>
      )}
    </div>
  );
}
