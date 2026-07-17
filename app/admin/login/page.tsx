"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Incorrect password.");
    }
  }

  return (
    <div className="admin-shell" style={{ maxWidth: 380, paddingTop: 100 }}>
      <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 26, marginBottom: 6 }}>
        Staff Login
      </h1>
      <p style={{ color: "var(--ink-soft)", fontSize: 13.5, marginBottom: 24 }}>
        Enter the shared admin password to manage products.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
        </div>
        {error && <p style={{ color: "var(--danger)", fontSize: 12.5, marginBottom: 12 }}>{error}</p>}
        <button className="btn btn-dark btn-full" disabled={loading}>
          {loading ? "Checking…" : "Log In"}
        </button>
      </form>
    </div>
  );
}
