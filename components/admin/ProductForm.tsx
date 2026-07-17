"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";

type Props = {
  initial?: Product;
};

export default function ProductForm({ initial }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [name, setName] = useState(initial?.name || "");
  const [price, setPrice] = useState(initial?.price?.toString() || "");
  const [category, setCategory] = useState(initial?.category || "");
  const [rating, setRating] = useState(initial?.rating?.toString() || "4.7");
  const [moq, setMoq] = useState(initial?.moq || "");
  const [weight, setWeight] = useState(initial?.weight || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [longDescription, setLongDescription] = useState(initial?.long_description || "");
  const [features, setFeatures] = useState((initial?.features || []).join("\n"));
  const [badge, setBadge] = useState(initial?.badge || "");
  const [images, setImages] = useState<string[]>(initial?.images || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !files.length) return;
    setUploading(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        uploaded.push(data.url);
      }
      setImages((prev) => [...prev, ...uploaded]);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((i) => i !== url));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name,
      price: Number(price),
      category,
      rating: Number(rating),
      moq,
      weight,
      description,
      long_description: longDescription,
      features: features.split("\n").map((f) => f.trim()).filter(Boolean),
      images,
      badge: badge || null,
    };

    const res = await fetch(isEdit ? `/api/admin/products/${initial!.id}` : "/api/admin/products", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="admin-shell" style={{ paddingTop: 40 }}>
      <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 24, marginBottom: 22 }}>
        {isEdit ? "Edit Product" : "Add Product"}
      </h1>

      <div className="form-grid">
        <div className="field">
          <label>Product name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="field">
          <label>Category</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>
        <div className="field">
          <label>Price (₦)</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div className="field">
          <label>Rating</label>
          <input type="number" step="0.1" value={rating} onChange={(e) => setRating(e.target.value)} />
        </div>
        <div className="field">
          <label>MOQ</label>
          <input value={moq} onChange={(e) => setMoq(e.target.value)} placeholder="e.g. 50 units" />
        </div>
        <div className="field">
          <label>Weight</label>
          <input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 0.5 kg" />
        </div>
      </div>

      <div className="field">
        <label>Short description (shown on the product card)</label>
        <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="field">
        <label>Long description (shown on the product page)</label>
        <textarea rows={3} value={longDescription} onChange={(e) => setLongDescription(e.target.value)} />
      </div>

      <div className="field">
        <label>Features — one per line</label>
        <textarea rows={4} value={features} onChange={(e) => setFeatures(e.target.value)} />
      </div>

      <div className="field">
        <label>Badge</label>
        <select value={badge} onChange={(e) => setBadge(e.target.value)}>
          <option value="">None</option>
          <option value="Bestseller">Bestseller</option>
          <option value="New">New</option>
        </select>
      </div>

      <div className="field">
        <label>Product photos (upload at least 3)</label>
        <input type="file" accept="image/*" multiple onChange={handleFileUpload} />
        {uploading && <p style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>Uploading…</p>}
        <div className="thumb-preview">
          {images.map((url) => (
            <div key={url} style={{ position: "relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                style={{
                  position: "absolute", top: -6, right: -6, background: "var(--danger)",
                  color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: 11, lineHeight: "18px",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && <p style={{ color: "var(--danger)", fontSize: 13, margin: "10px 0" }}>{error}</p>}

      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button className="btn btn-dark" disabled={saving}>
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Product"}
        </button>
        <button type="button" className="btn btn-outline" onClick={() => router.push("/admin")}>
          Cancel
        </button>
      </div>
    </form>
  );
}
