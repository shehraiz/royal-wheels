"use client";

import { useState } from "react";

const FIELDS = [
  { key: "ADVANCE_PERCENT", label: "Advance Payment (%)", type: "number" },
  { key: "CNIC_PURGE_DAYS", label: "CNIC Purge After (days)", type: "number" },
  { key: "BANK_DETAILS", label: "Bank Details (shown to customers)", type: "textarea" },
  { key: "CONTACT_PHONE", label: "Contact Phone", type: "text" },
  { key: "CONTACT_EMAIL", label: "Contact Email", type: "email" },
  { key: "CONTACT_WHATSAPP", label: "WhatsApp Number (digits only)", type: "text" },
];

export default function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const [form, setForm] = useState<Record<string, string>>(settings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setMessage("Settings saved!");
      else setMessage("Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-5">
      {FIELDS.map((f) => (
        <div key={f.key}>
          <label className="block text-xs text-cream/40 uppercase tracking-wider mb-1">{f.label}</label>
          {f.type === "textarea" ? (
            <textarea
              value={form[f.key] ?? ""}
              onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
              rows={3}
              className="w-full bg-cream/5 border border-cream/10 px-3 py-2 text-cream text-sm focus:outline-none focus:border-gold resize-none"
            />
          ) : (
            <input
              type={f.type}
              value={form[f.key] ?? ""}
              onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
              className="w-full bg-cream/5 border border-cream/10 px-3 py-2 text-cream text-sm focus:outline-none focus:border-gold"
            />
          )}
        </div>
      ))}
      {message && <p className="text-sm text-gold">{message}</p>}
      <button
        type="submit"
        disabled={saving}
        className="py-2.5 bg-gold text-ink text-sm font-medium hover:bg-gold-light transition-colors disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save Settings"}
      </button>
    </form>
  );
}
