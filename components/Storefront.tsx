"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { PRODUCT_CATALOGS } from "@/lib/catalogs";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2349126105778";

const INSTAGRAM_HANDLE =
  process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "manestyle.lagos";

const COLLECTION_TABS = [
  {
    id: "bestseller",
    label: "Best Sellers",
  },
  {
    id: "featured",
    label: "Featured Products",
  },
  {
    id: "all",
    label: "All Products",
  },
] as const;

type CollectionTab = (typeof COLLECTION_TABS)[number]["id"];

function money(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}

function normalizeBadge(product: Product) {
  return String(product.badge || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

function isBestSeller(product: Product) {
  const badge = normalizeBadge(product);

  return badge === "bestseller" || badge === "bestselling";
}

function isFeaturedProduct(product: Product) {
  const badge = normalizeBadge(product);

  return badge === "featured" || badge === "featuredproduct";
}

const PLACEHOLDER = (seed: string, number: number) =>
  number % 2 === 0
    ? "/images/gifted-delites-hero.webp"
    : "/images/gifted-delites-about.webp";

function imagesFor(product: Product) {
  const validImages = Array.isArray(product.images)
    ? product.images.filter(
        (image): image is string =>
          typeof image === "string" && image.trim().length > 0
      )
    : [];

  if (validImages.length > 0) {
    return validImages;
  }

  const safeName =
    typeof product.name === "string" && product.name.trim()
      ? product.name
      : `product-${product.id}`;

  const seed = safeName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  return [
    PLACEHOLDER(seed, 1),
    PLACEHOLDER(seed, 2),
    PLACEHOLDER(seed, 3),
  ];
}

export default function Storefront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [collectionTab, setCollectionTab] =
    useState<CollectionTab>("all");

  const [detailProduct, setDetailProduct] =
    useState<Product | null>(null);

  const [detailImageIdx, setDetailImageIdx] = useState(0);
  const [detailQty, setDetailQty] = useState(1);

  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custAddress, setCustAddress] = useState("");

  /*
   * Read category links coming from the homepage.
   * Example: /products?category=Executive%20Gifts
   */
  useEffect(() => {
    const urlParameters = new URLSearchParams(
      window.location.search
    );

    const selectedCategory =
      urlParameters.get("category");

    if (selectedCategory) {
      setCategory(selectedCategory);
      setCollectionTab("all");
    }
  }, []);

  /*
   * Load products from the public products API.
   */
  useEffect(() => {
    let active = true;

    async function loadProducts() {
      setLoading(true);
      setLoadError("");

      try {
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Unable to load products.");
        }

        const data = await response.json();

        if (active) {
          setProducts(
            Array.isArray(data.products)
              ? data.products
              : []
          );
        }
      } catch {
        if (active) {
          setProducts([]);
          setLoadError(
            "We could not load the product collection. Please try again."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  /*
   * Create the category dropdown from the categories
   * currently available in Supabase.
   */
  const categories = ["all", ...PRODUCT_CATALOGS];

  /*
   * Apply tab, category and text-search filters.
   */
  const filtered = useMemo(() => {
    let list = [...products];

    if (collectionTab === "bestseller") {
      list = list.filter(isBestSeller);
    }

    if (collectionTab === "featured") {
      list = list.filter(isFeaturedProduct);
    }

    if (category !== "all") {
      const selectedCatalog = category.toLowerCase();

      list = list.filter(
        (product) =>
          typeof product.category === "string" &&
          product.category.trim().toLowerCase() === selectedCatalog
      );
    }

    if (search.trim()) {
      const query = search
        .toLowerCase()
        .trim();

      list = list.filter((product) => {
        const productName =
          typeof product.name === "string"
            ? product.name.toLowerCase()
            : "";

        const productCategory =
          typeof product.category === "string"
            ? product.category.toLowerCase()
            : "";

        const productDescription =
          typeof product.description === "string"
            ? product.description.toLowerCase()
            : "";

        return (
          productName.includes(query) ||
          productCategory.includes(query) ||
          productDescription.includes(query)
        );
      });
    }

    return list;
  }, [
    products,
    category,
    collectionTab,
    search,
  ]);

  const cartEntries = Object.entries(cart).map(
    ([id, quantity]) => ({
      id: Number(id),
      quantity,
    })
  );

  const cartCount = cartEntries.reduce(
    (total, entry) =>
      total + entry.quantity,
    0
  );

  const cartSubtotal = cartEntries.reduce(
    (total, entry) => {
      const product = products.find(
        (item) => item.id === entry.id
      );

      return (
        total +
        (product
          ? product.price * entry.quantity
          : 0)
      );
    },
    0
  );

  function selectCollectionTab(tab: CollectionTab) {
    setCollectionTab(tab);
    setCategory("all");
    setCategoryOpen(false);

    // Search and category filters only apply to All Products.
    if (tab !== "all") {
      setSearch("");
    }

    window.history.replaceState(
      {},
      "",
      "/products"
    );
  }

  function selectCategory(
    selectedCategory: string
  ) {
    setCategory(selectedCategory);
    setCollectionTab("all");
    setCategoryOpen(false);

    if (selectedCategory === "all") {
      window.history.replaceState(
        {},
        "",
        "/products"
      );

      return;
    }

    window.history.replaceState(
      {},
      "",
      `/products?category=${encodeURIComponent(
        selectedCategory
      )}`
    );
  }

  function addToCart(
    id: number,
    quantity = 1
  ) {
    setCart((currentCart) => ({
      ...currentCart,
      [id]:
        (currentCart[id] || 0) + quantity,
    }));
  }

  function changeCartQty(
    id: number,
    amount: number
  ) {
    setCart((currentCart) => {
      const nextCart = {
        ...currentCart,
        [id]:
          (currentCart[id] || 0) + amount,
      };

      if (nextCart[id] <= 0) {
        delete nextCart[id];
      }

      return nextCart;
    });
  }

  function removeFromCart(id: number) {
    setCart((currentCart) => {
      const nextCart = {
        ...currentCart,
      };

      delete nextCart[id];

      return nextCart;
    });
  }

  function openDetail(product: Product) {
    setDetailProduct(product);
    setDetailImageIdx(0);
    setDetailQty(1);
  }

  function buildOrderMessage() {
    const orderLines = cartEntries
      .map((entry) => {
        const product = products.find(
          (item) => item.id === entry.id
        );

        if (!product) {
          return null;
        }

        return `• ${product.name} x${
          entry.quantity
        } — ${money(
          product.price * entry.quantity
        )}`;
      })
      .filter(
        (line): line is string =>
          Boolean(line)
      );

    return [
      "New order from Gifted Delites website:",
      `Name: ${
        custName || "(not provided)"
      }`,
      `Phone: ${
        custPhone || "(not provided)"
      }`,
      `Delivery address: ${
        custAddress || "(not provided)"
      }`,
      "",
      "Items:",
      ...orderLines,
      "",
      `Total: ${money(cartSubtotal)}`,
    ].join("\n");
  }

  function sendOrder(
    channel: "whatsapp" | "instagram"
  ) {
    const message = buildOrderMessage();

    if (channel === "whatsapp") {
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
          message
        )}`,
        "_blank",
        "noopener,noreferrer"
      );
    } else {
      navigator.clipboard
        ?.writeText(message)
        .catch(() => undefined);

      window.open(
        `https://instagram.com/${INSTAGRAM_HANDLE}`,
        "_blank",
        "noopener,noreferrer"
      );

      alert(
        "Order details copied. Paste them into your Instagram DM."
      );
    }

    setCheckoutOpen(false);
  }

  function emptyStateTitle() {
    if (collectionTab === "bestseller") {
      return "No best sellers available yet";
    }

    if (collectionTab === "featured") {
      return "No featured products available yet";
    }

    return "No products found";
  }

  return (
    <>
      {/* Navigation */}
      <header>
        <div className="wrap header-row">
          <a href="/" className="logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/gifted-delites-logo.jpg"
              alt="Gifted Delites — Spreading joy and goodwill"
            />
          </a>

          <nav
            className="nav-links"
            aria-label="Main navigation"
          >
            <a href="/">Home</a>
            <a href="/products" aria-current="page">Product Catalogs</a>
            <a href="/about">About</a>
            <a href="/services">Our Services</a>
            <a href="/#contact">Contact</a>
          </nav>

          <div className="header-icons">
            <button
              type="button"
              className="icon-btn"
              onClick={() =>
                setCartOpen(true)
              }
              aria-label={`Open cart with ${cartCount} item${
                cartCount === 1 ? "" : "s"
              }`}
            >
              <svg viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>

              {cartCount > 0 && (
                <span className="badge">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Catalog introduction */}
      <section className="catalog-hero">
        <div className="wrap catalog-hero-inner">
          <p className="catalog-eyebrow">
            OUR COLLECTION
          </p>

          <h1>
            Find a Gift <em>Worth Remembering</em>
          </h1>

          <p className="catalog-description">
            Explore personalised keepsakes, premium corporate gifts and
            custom-branded essentials prepared to make every recipient feel
            valued.
          </p>

          <div
            className="catalog-tabs"
            role="tablist"
            aria-label="Product collections"
          >
            {COLLECTION_TABS.map((tab) => {
              const isActive =
                collectionTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="catalog-product-results"
                  className={`catalog-tab ${
                    isActive
                      ? "catalog-tab-active"
                      : ""
                  }`}
                  onClick={() =>
                    selectCollectionTab(tab.id)
                  }
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="product-catalog-list section">
        <div className="wrap">
          <div className="about-section-heading">
            <p className="eyebrow">OUR PRODUCT CATALOGS</p>
            <h2>Products for Every Gifting Occasion</h2>
            <p>
              We source and customize a wide variety of corporate and
              promotional products. Select a catalog below or browse the live
              collection.
            </p>
          </div>

          <div className="about-category-grid">
            {PRODUCT_CATALOGS.map((catalog) => (
              <button
                type="button"
                className="about-category-item"
                key={catalog}
                onClick={() => {
                  setSearch("");
                  selectCategory(catalog);
                  document
                    .getElementById("catalog-product-results")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span aria-hidden="true">→</span>
                {catalog}
              </button>
            ))}
          </div>

          <p className="about-category-note">
            Cannot find the product you are looking for? Let us know and our
            sourcing team will locate the ideal solution for your needs.
          </p>
        </div>
      </section>

      {/* Product collection */}
      <section
        id="catalog-product-results"
        className="catalog-products section wrap"
        role="tabpanel"
        aria-live="polite"
      >
        {/* Search and category filters only appear under All Products */}
        {collectionTab === "all" && (
          <>
            <div className="shop-toolbar">
              <div className="search-box">
                <input
                  type="search"
                  placeholder="Search products"
                  aria-label="Search products"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />
              </div>

              <div className="category-menu">
                <button
                  type="button"
                  className="category-btn"
                  aria-expanded={categoryOpen}
                  aria-haspopup="menu"
                  onClick={() =>
                    setCategoryOpen(
                      (open) => !open
                    )
                  }
                >
                  {category === "all"
                    ? "Categories"
                    : category}

                  <span aria-hidden="true">
                    ▾
                  </span>
                </button>

                {categoryOpen && (
                  <div
                    className="category-dropdown"
                    role="menu"
                  >
                    {categories.map(
                      (categoryOption) => (
                        <button
                          key={categoryOption}
                          type="button"
                          role="menuitem"
                          onClick={() =>
                            selectCategory(
                              categoryOption
                            )
                          }
                          className={
                            categoryOption ===
                            category
                              ? "active-category"
                              : ""
                          }
                        >
                          {categoryOption === "all"
                            ? "All Categories"
                            : categoryOption}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            {category !== "all" && (
              <div className="active-category-bar">
                <span>
                  Showing products in:{" "}
                  <strong>{category}</strong>
                </span>

                <button
                  type="button"
                  onClick={() =>
                    selectCategory("all")
                  }
                >
                  Clear filter
                </button>
              </div>
            )}
          </>
        )}

        {loading ? (
          <p
            style={{
              color: "var(--ink-soft)",
            }}
          >
            Loading products…
          </p>
        ) : loadError ? (
          <div className="catalog-empty-state">
            <h3>
              Product collection unavailable
            </h3>

            <p>{loadError}</p>

            <button
              type="button"
              className="btn btn-outline"
              onClick={() =>
                window.location.reload()
              }
            >
              Try Again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="catalog-empty-state">
            <h3>{emptyStateTitle()}</h3>

            <p>
              {collectionTab === "all"
                ? "Try changing your search or category filter."
                : "Products will appear here after they are assigned this badge in the admin area."}
            </p>

            {collectionTab !== "all" && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() =>
                  selectCollectionTab("all")
                }
              >
                View All Products
              </button>
            )}
          </div>
        ) : (
          <div className="shop-grid">
            {filtered.map((product) => (
              <article
                className="card"
                key={product.id}
              >
                <div
                  className="card-media"
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${product.name}`}
                  onClick={() =>
                    openDetail(product)
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" ||
                      event.key === " "
                    ) {
                      event.preventDefault();
                      openDetail(product);
                    }
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagesFor(product)[0]}
                    alt={product.name}
                  />
                </div>

                <div className="card-body">
                  <h3
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      openDetail(product)
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" ||
                        event.key === " "
                      ) {
                        event.preventDefault();
                        openDetail(product);
                      }
                    }}
                  >
                    {product.name}
                  </h3>

                  <div className="card-desc">
                    {product.description}
                  </div>

                  <div className="card-foot">
                    <span className="price">
                      {money(product.price)}
                    </span>
                  </div>

                  <div className="card-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-dark"
                      onClick={() =>
                        addToCart(product.id)
                      }
                    >
                      Add to Cart
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() =>
                        openDetail(product)
                      }
                    >
                      View
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Product detail modal */}
      {detailProduct && (
        <div
          className="overlay-bg"
          role="presentation"
          onClick={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setDetailProduct(null);
            }
          }}
        >
          <div
            className="detail-panel"
            role="dialog"
            aria-modal="true"
            aria-label={`${detailProduct.name} product details`}
          >
            <button
              type="button"
              className="detail-close"
              onClick={() =>
                setDetailProduct(null)
              }
              aria-label="Close product details"
            >
              <svg
                viewBox="0 0 24 24"
                style={{
                  width: 16,
                  height: 16,
                  stroke: "var(--ink)",
                  fill: "none",
                  strokeWidth: 1.5,
                }}
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="detail-grid">
              <div className="detail-media">
                <div className="gallery-main">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      imagesFor(
                        detailProduct
                      )[detailImageIdx]
                    }
                    alt={detailProduct.name}
                  />
                </div>

                <div className="gallery-thumbs">
                  {imagesFor(
                    detailProduct
                  ).map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      className={`thumb ${
                        index ===
                        detailImageIdx
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setDetailImageIdx(
                          index
                        )
                      }
                      aria-label={`View image ${
                        index + 1
                      } of ${
                        detailProduct.name
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt=""
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="detail-info">
                <div className="eyebrow">
                  {detailProduct.category}

                  {detailProduct.badge
                    ? ` · ${detailProduct.badge}`
                    : ""}
                </div>

                <h2
                  style={{
                    fontSize: 26,
                    fontWeight: 400,
                    margin: "8px 0",
                  }}
                >
                  {detailProduct.name}
                </h2>

                <div className="detail-price">
                  {money(
                    detailProduct.price
                  )}
                </div>

                <p className="detail-desc">
                  {detailProduct.long_description ||
                    detailProduct.description}
                </p>

                <ul className="detail-list">
                  {(
                    detailProduct.features ||
                    []
                  ).map(
                    (feature, index) => (
                      <li
                        key={`${feature}-${index}`}
                      >
                        {feature}
                      </li>
                    )
                  )}
                </ul>

                <div className="qty-control">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() =>
                      setDetailQty(
                        (quantity) =>
                          Math.max(
                            1,
                            quantity - 1
                          )
                      )
                    }
                  >
                    −
                  </button>

                  <span>{detailQty}</span>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() =>
                      setDetailQty(
                        (quantity) =>
                          quantity + 1
                      )
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="btn btn-dark btn-full"
                  onClick={() => {
                    addToCart(
                      detailProduct.id,
                      detailQty
                    );

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
          <div
            className="drawer-bg"
            onClick={() =>
              setCartOpen(false)
            }
          />

          <div
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            <div className="drawer-head">
              <h3
                style={{
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                Your Bag
              </h3>

              <button
                type="button"
                className="icon-btn"
                onClick={() =>
                  setCartOpen(false)
                }
                aria-label="Close shopping cart"
              >
                <svg
                  viewBox="0 0 24 24"
                  style={{
                    width: 18,
                    height: 18,
                    stroke: "var(--ink)",
                    fill: "none",
                    strokeWidth: 1.5,
                  }}
                >
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

                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={() =>
                      setCartOpen(false)
                    }
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cartEntries.map((entry) => {
                  const product =
                    products.find(
                      (item) =>
                        item.id === entry.id
                    );

                  if (!product) {
                    return null;
                  }

                  return (
                    <div
                      className="cart-row"
                      key={entry.id}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          imagesFor(
                            product
                          )[0]
                        }
                        alt={product.name}
                      />

                      <div className="cart-row-info">
                        <div className="cart-row-top">
                          <span>
                            {product.name}
                          </span>

                          <span>
                            {money(
                              product.price *
                                entry.quantity
                            )}
                          </span>
                        </div>

                        <div className="cart-row-controls">
                          <div className="qty-control">
                            <button
                              type="button"
                              aria-label={`Decrease ${product.name} quantity`}
                              onClick={() =>
                                changeCartQty(
                                  product.id,
                                  -1
                                )
                              }
                            >
                              −
                            </button>

                            <span>
                              {entry.quantity}
                            </span>

                            <button
                              type="button"
                              aria-label={`Increase ${product.name} quantity`}
                              onClick={() =>
                                changeCartQty(
                                  product.id,
                                  1
                                )
                              }
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            className="remove-link"
                            onClick={() =>
                              removeFromCart(
                                product.id
                              )
                            }
                          >
                            Remove
                          </button>
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
                  <span>
                    {money(cartSubtotal)}
                  </span>
                </div>

                <button
                  type="button"
                  className="btn btn-gold btn-full"
                  onClick={() =>
                    setCheckoutOpen(true)
                  }
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Checkout modal */}
      {checkoutOpen && (
        <div
          className="modal-bg"
          role="presentation"
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-heading"
          >
            <button
              type="button"
              style={{
                position: "absolute",
                top: 16,
                right: 16,
              }}
              className="icon-btn"
              onClick={() =>
                setCheckoutOpen(false)
              }
              aria-label="Close checkout"
            >
              <svg
                viewBox="0 0 24 24"
                style={{
                  width: 16,
                  height: 16,
                  stroke: "var(--ink)",
                  fill: "none",
                  strokeWidth: 1.5,
                }}
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <h3
              id="checkout-heading"
              style={{
                margin: "0 0 10px",
                fontWeight: 400,
                fontSize: 22,
              }}
            >
              Confirm your order
            </h3>

            <p
              style={{
                color: "var(--ink-soft)",
                fontSize: 13.5,
                marginBottom: 20,
              }}
            >
              We&apos;ll pre-fill your
              order as a message. Just send
              it once WhatsApp opens.
            </p>

            <div className="field">
              <label htmlFor="customer-name">
                Full name
              </label>

              <input
                id="customer-name"
                value={custName}
                onChange={(event) =>
                  setCustName(
                    event.target.value
                  )
                }
              />
            </div>

            <div className="field">
              <label htmlFor="customer-phone">
                Phone number
              </label>

              <input
                id="customer-phone"
                type="tel"
                value={custPhone}
                onChange={(event) =>
                  setCustPhone(
                    event.target.value
                  )
                }
              />
            </div>

            <div className="field">
              <label htmlFor="customer-address">
                Delivery address
              </label>

              <textarea
                id="customer-address"
                rows={2}
                value={custAddress}
                onChange={(event) =>
                  setCustAddress(
                    event.target.value
                  )
                }
              />
            </div>

            <button
              type="button"
              className="btn btn-gold btn-full"
              onClick={() =>
                sendOrder("whatsapp")
              }
            >
              Send Order via WhatsApp
            </button>

            <button
              type="button"
              className="btn btn-outline btn-full"
              style={{ marginTop: 10 }}
              onClick={() =>
                sendOrder("instagram")
              }
            >
              Confirm via Instagram DM
            </button>
          </div>
        </div>
      )}
    </>
  );
}
