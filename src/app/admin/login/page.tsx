"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <span className="text-gold text-3xl block mb-3">♛</span>
          <span className="font-display text-2xl tracking-widest uppercase">
            <span className="text-white">Royal</span>{" "}
            <span className="text-gold">Wheels</span>
          </span>
          <p className="text-white/30 font-body text-[10px] mt-1 uppercase tracking-[0.3em]">Admin Panel</p>
        </div>

        <div className="bg-white/5 border border-white/10 p-8">
          <h1 className="font-display text-xl text-white mb-6">Sign In</h1>

          {error && (
            <div className="mb-4 text-sm font-body text-red-400 bg-red-900/20 border border-red-900/30 px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-body">
            <div>
              <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-white focus:outline-none focus:border-gold text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-white focus:outline-none focus:border-gold text-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gold text-ink font-medium hover:bg-gold-dark transition-colors disabled:opacity-60 text-sm mt-2 tracking-wide"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
