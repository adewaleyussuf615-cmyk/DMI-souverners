"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/types";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348000000000";
const INSTAGRAM_HANDLE = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "yourusername";

function money(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

const PLACEHOLDER = (seed: string, n: number) => `https://picsum.photos/seed/${seed}-${n}/600/600`;

function imagesFor(p: Product) {
  if (p.images && p.images.length) return p.images;
  const seed = p.name.toLowerCase().replace(/[^a-z0-9]/g, "");
  return [PLACEHOLDER(seed, 1), PLACEHOLDER(seed, 2), PLACEHOLDER(seed, 3)];
}

export default function Storefront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [detailImageIdx, setDetailImageIdx] = useState(0);
  const [detailQty, setDetailQty] = useState(1);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custAddress, setCustAddress] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  const filtered = useMemo(() => {
    let list = products;
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, category, search]);

  const cartEntries = Object.entries(cart) as unknown as [string, number][];
  const cartCount = cartEntries.reduce((sum, [, qty]) => sum + qty, 0);
  const cartSubtotal = cartEntries.reduce((sum, [id, qty]) => {
    const p = products.find((x) => x.id === Number(id));
    return sum + (p ? p.price * qty : 0);
  }, 0);

  function addToCart(id: number, qty = 1) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + qty }));
  }
  function changeCartQty(id: number, delta: number) {
    setCart((c) => {
      const next = { ...c, [id]: (c[id] || 0) + delta };
      if (next[id] <= 0) delete next[id];
      return next;
    });
  }
  function removeFromCart(id: number) {
    setCart((c) => {
      const next = { ...c };
      delete next[id];
      return next;
    });
  }

  function openDetail(p: Product) {
    setDetailProduct(p);
    setDetailImageIdx(0);
    setDetailQty(1);
  }

  function buildOrderMessage() {
    const lines = cartEntries.map(([id, qty]) => {
      const p = products.find((x) => x.id === Number(id))!;
      return `• ${p.name} x${qty} — ${money(p.price * qty)}`;
    });
    return [
      "New order from NOOR website:",
      `Name: ${custName || "(not provided)"}`,
      `Phone: ${custPhone || "(not provided)"}`,
      `Delivery address: ${custAddress || "(not provided)"}`,
      "",
      "Items:",
      ...lines,
      "",
      `Total: ${money(cartSubtotal)}`,
    ].join("\n");
  }

  function sendOrder(channel: "whatsapp" | "instagram") {
    const msg = buildOrderMessage();
    if (channel === "whatsapp") {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    } else {
      navigator.clipboard?.writeText(msg);
      window.open(`https://instagram.com/${INSTAGRAM_HANDLE}`, "_blank");
      alert("Order details copied — paste them into your Instagram DM.");
    }
    setCheckoutOpen(false);
  }

  return (
    <>
      <header>
        <div className="wrap header-row">
          <a href="/" className="logo">NOOR</a>
          <nav className="nav-links">
            <a href="/">Home</a>
            <a href="/products">Products</a>
            <a href="/#about">About</a>
            <a href="/#contact">Contact</a>
          </nav>
          <div className="header-icons">
            <button className="icon-btn" onClick={() => setCartOpen(true)} aria-label="Cart">
              <svg viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <section className="section wrap">
        <div className="section-head">
          <div>
            <div className="eyebrow">Full Collection</div>
            <h2>Corporate Gift Essentials</h2>
          </div>
        </div>

        <div className="shop-toolbar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="chip-row">
            {categories.map((c) => (
              <button
                key={c}
                className={`chip ${c === category ? "active" : ""}`}
                onClick={() => setCategory(c)}
              >
                {c === "all" ? "All" : c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p style={{ color: "var(--ink-soft)" }}>Loading products…</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: "var(--ink-soft)" }}>No products match — try a different search or filter.</p>
        ) : (
          <div className="shop-grid">
            {filtered.map((p) => (
              <div className="card" key={p.id}>
                <div className="card-media" onClick={() => openDetail(p)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagesFor(p)[0]} alt={p.name} />
                </div>
                <div className="card-body">
                  <h3 onClick={() => openDetail(p)}>{p.name}</h3>
                  <div className="card-desc">{p.description}</div>
                  <div className="card-foot">
                    <span className="price">{money(p.price)}</span>
                  </div>
                  <div className="card-actions">
                    <button className="btn btn-sm btn-dark" onClick={() => addToCart(p.id)}>
                      Add to Cart
                    </button>
                    <button className="btn btn-sm btn-outline" onClick={() => openDetail(p)}>
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Product detail modal */}
      {detailProduct && (
        <div
          className="overlay-bg"
          onClick={(e) => e.target === e.currentTarget && setDetailProduct(null)}
        >
          <div className="detail-panel">
            <button className="detail-close" onClick={() => setDetailProduct(null)}>
              <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: "var(--ink)", fill: "none", strokeWidth: 1.5 }}>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
            <div className="detail-grid">
              <div className="detail-media">
                <div className="gallery-main">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagesFor(detailProduct)[detailImageIdx]} alt={detailProduct.name} />
                </div>
                <div className="gallery-thumbs">
                  {imagesFor(detailProduct).map((img, i) => (
                    <button
                      key={i}
                      className={`thumb ${i === detailImageIdx ? "active" : ""}`}
                      onClick={() => setDetailImageIdx(i)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`${detailProduct.name} view ${i + 1}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="detail-info">
                <div className="eyebrow">
                  {detailProduct.category}
                  {detailProduct.badge ? ` · ${detailProduct.badge}` : ""}
                </div>
                <h2 style={{ fontSize: 26, fontWeight: 400, margin: "8px 0" }}>{detailProduct.name}</h2>
                <div className="detail-price">{money(detailProduct.price)}</div>
                <p className="detail-desc">{detailProduct.long_description || detailProduct.description}</p>
                <ul className="detail-list">
                  {(detailProduct.features || []).map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <div className="qty-control">
                  <button onClick={() => setDetailQty((q) => Math.max(1, q - 1))}>−</button>
                  <span>{detailQty}</span>
                  <button onClick={() => setDetailQty((q) => q + 1)}>+</button>
                </div>
                <button
                  className="btn btn-dark btn-full"
                  onClick={() => {
                    addToCart(detailProduct.id, detailQty);
                    setDetailProduct(null);
                    setCartOpen(true);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <>
          <div className="drawer-bg" onClick={() => setCartOpen(false)} />
          <div className="drawer">
            <div className="drawer-head">
              <h3 style={{ margin: 0, fontWeight: 400 }}>Your Bag</h3>
              <button className="icon-btn" onClick={() => setCartOpen(false)}>
                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: "var(--ink)", fill: "none", strokeWidth: 1.5 }}>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="drawer-items">
              {cartEntries.length === 0 ? (
                <div className="empty-state">
                  Your bag is empty.
                  <br />
                  <br />
                  <button className="btn btn-dark" onClick={() => setCartOpen(false)}>
                    Start Shopping
                  </button>
                </div>
              ) : (
                cartEntries.map(([id, qty]) => {
                  const p = products.find((x) => x.id === Number(id));
                  if (!p) return null;
                  return (
                    <div className="cart-row" key={id}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagesFor(p)[0]} alt={p.name} />
                      <div className="cart-row-info">
                        <div className="cart-row-top">
                          <span>{p.name}</span>
                          <span>{money(p.price * qty)}</span>
                        </div>
                        <div className="cart-row-controls">
                          <div className="qty-control">
                            <button onClick={() => changeCartQty(p.id, -1)}>−</button>
                            <span>{qty}</span>
                            <button onClick={() => changeCartQty(p.id, 1)}>+</button>
                          </div>
                          <a href="#" className="remove-link" onClick={(e) => { e.preventDefault(); removeFromCart(p.id); }}>
                            Remove
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {cartEntries.length > 0 && (
              <div className="drawer-foot">
                <div className="subtotal-row">
                  <span>Subtotal</span>
                  <span>{money(cartSubtotal)}</span>
                </div>
                <button className="btn btn-gold btn-full" onClick={() => setCheckoutOpen(true)}>
                  Checkout
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Checkout modal */}
      {checkoutOpen && (
        <div className="modal-bg">
          <div className="modal">
            <button
              style={{ position: "absolute", top: 16, right: 16 }}
              className="icon-btn"
              onClick={() => setCheckoutOpen(false)}
            >
              <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: "var(--ink)", fill: "none", strokeWidth: 1.5 }}>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
            <h3 style={{ margin: "0 0 10px", fontWeight: 400, fontSize: 22 }}>Confirm your order</h3>
            <p style={{ color: "var(--ink-soft)", fontSize: 13.5, marginBottom: 20 }}>
              We&apos;ll pre-fill your order as a message — just hit send once WhatsApp opens.
            </p>
            <div className="field">
              <label>Full name</label>
              <input value={custName} onChange={(e) => setCustName(e.target.value)} />
            </div>
            <div className="field">
              <label>Phone number</label>
              <input value={custPhone} onChange={(e) => setCustPhone(e.target.value)} />
            </div>
            <div className="field">
              <label>Delivery address</label>
              <textarea rows={2} value={custAddress} onChange={(e) => setCustAddress(e.target.value)} />
            </div>
            <button className="btn btn-gold btn-full" onClick={() => sendOrder("whatsapp")}>
              Pay via WhatsApp
            </button>
            <button className="btn btn-outline btn-full" style={{ marginTop: 10 }} onClick={() => sendOrder("instagram")}>
              Confirm via Instagram DM
            </button>
          </div>
        </div>
      )}
    </>
  );
}