"use client";

import { useEffect, useRef, useState } from "react";

type ApiProduct = {
  id?: number;
  name?: string;
  category?: string;
  images?: string[];
};

type CategoryCard = {
  name: string;
  image: string;
};

const FALLBACK_CATEGORY_CARDS: CategoryCard[] = [
  {
    name: "Corporate & Bulk",
    image: "https://picsum.photos/seed/gifted-corporate/900/1200",
  },
  {
    name: "Executive Gifts",
    image: "https://picsum.photos/seed/gifted-executive/900/1200",
  },
  {
    name: "Luxury Gift Boxes",
    image: "https://picsum.photos/seed/gifted-luxury/900/1200",
  },
  {
    name: "Branded Stationery",
    image: "https://picsum.photos/seed/gifted-stationery/900/1200",
  },
  {
    name: "Event Merchandise",
    image: "https://picsum.photos/seed/gifted-events/900/1200",
  },
  {
    name: "Custom Packaging",
    image: "https://picsum.photos/seed/gifted-packaging/900/1200",
  },
];

function createFallbackImage(category: string) {
  const seed = category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `https://picsum.photos/seed/gifted-${seed || "category"}/900/1200`;
}

export default function Homepage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(
    FALLBACK_CATEGORY_CARDS.map((category) => category.name)
  );
  const [categoryCards, setCategoryCards] = useState<CategoryCard[]>(
    FALLBACK_CATEGORY_CARDS
  );

  const searchMenuRef = useRef<HTMLDivElement>(null);
  const categoryTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Unable to load products");
        }

        const data = await response.json();

        const products: ApiProduct[] = Array.isArray(data.products)
          ? data.products
          : [];

        const categoryMap = new Map<string, string>();

        products.forEach((product) => {
          const category =
            typeof product.category === "string"
              ? product.category.trim()
              : "";

          if (!category || categoryMap.has(category)) {
            return;
          }

          const productImage = Array.isArray(product.images)
            ? product.images.find(
                (image) =>
                  typeof image === "string" && image.trim().length > 0
              )
            : undefined;

          categoryMap.set(
            category,
            productImage || createFallbackImage(category)
          );
        });

        const sortedCategories = Array.from(categoryMap.keys()).sort((a, b) =>
          a.localeCompare(b)
        );

        if (sortedCategories.length > 0) {
          setCategories(sortedCategories);

          setCategoryCards(
            sortedCategories.map((category) => ({
              name: category,
              image:
                categoryMap.get(category) || createFallbackImage(category),
            }))
          );
        }
      } catch {
        setCategories(
          FALLBACK_CATEGORY_CARDS.map((category) => category.name)
        );
        setCategoryCards(FALLBACK_CATEGORY_CARDS);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    function closeDropdown(event: MouseEvent) {
      if (
        searchMenuRef.current &&
        !searchMenuRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", closeDropdown);

    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  function scrollCategories(direction: -1 | 1) {
    const track = categoryTrackRef.current;

    if (!track) {
      return;
    }

    const scrollDistance = Math.max(track.clientWidth * 0.8, 280);

    track.scrollBy({
      left: direction * scrollDistance,
      behavior: "smooth",
    });
  }

  return (
    <main>
      {/* Navigation */}
      <header>
        <div className="header-row wrap">
          <a href="/" className="logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.jpg" alt="Gifted Delites" />
          </a>

          <nav className="nav-links" aria-label="Main navigation">
            <a href="/">Home</a>
            <a href="/products">Products</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="search-menu" ref={searchMenuRef}>
            <button
              type="button"
              className="search-btn"
              onClick={() => setSearchOpen((open) => !open)}
              aria-expanded={searchOpen}
              aria-haspopup="menu"
            >
              Search

              <span
                className={`search-arrow ${
                  searchOpen ? "search-arrow-open" : ""
                }`}
                aria-hidden="true"
              >
                ⌄
              </span>
            </button>

            {searchOpen && (
              <div className="search-dropdown" role="menu">
                <div className="search-dropdown-title">
                  Shop by category
                </div>

                <a
                  href="/products"
                  className="search-dropdown-item"
                  role="menuitem"
                  onClick={() => setSearchOpen(false)}
                >
                  All Products
                </a>

                {categories.map((category) => (
                  <a
                    key={category}
                    href={`/products?category=${encodeURIComponent(category)}`}
                    className="search-dropdown-item"
                    role="menuitem"
                    onClick={() => setSearchOpen(false)}
                  >
                    {category}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://picsum.photos/seed/gifted-hero-bg/1600/900"
            alt=""
          />

          <div className="hero-overlay" />
        </div>

        <div className="wrap hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">PREMIUM CORPORATE GIFTS</p>

            <h1>
              Create Custom Products
              <br />
              That Feel Premium
            </h1>

            <p className="hero-text">
              Discover thoughtfully designed corporate gifts and branded
              essentials created to elevate every occasion and leave a lasting
              impression.
            </p>

            <div className="hero-buttons">
              <a href="/products" className="primary-btn">
                Explore Collection
              </a>

              <a
                href="#contact"
                className="secondary-btn secondary-btn-light"
              >
                Custom Order
              </a>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="visual-abstract-circle" />

            <div className="visual-gift-box">
              <div className="gift-lid" />
              <div className="gift-ribbon-v" />
              <div className="gift-ribbon-h" />
              <span className="gift-sparkle sparkle-1" />
              <span className="gift-sparkle sparkle-2" />
              <span className="gift-sparkle sparkle-3" />
              <span className="gift-sparkle sparkle-4" />
            </div>

            <div className="visual-floating-card badge-top-left">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              <span>Fast Delivery</span>
            </div>

            <div className="visual-floating-card badge-top-right">
              <svg viewBox="0 0 24 24">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
              </svg>
              <span>Personalized</span>
            </div>

            <div className="visual-floating-card badge-bottom-right">
              <svg viewBox="0 0 24 24">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              <span>Bespoke Design</span>
            </div>

            <div className="visual-floating-card badge-bottom-left">
              <svg viewBox="0 0 24 24">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span>Curated Quality</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="benefits">
        <div className="wrap benefit-grid">
          <div>
            <h3>Premium Quality</h3>
            <p>Carefully selected products made to impress.</p>
          </div>

          <div>
            <h3>Custom Branding</h3>
            <p>Personalised solutions for every business.</p>
          </div>

          <div>
            <h3>Fast Delivery</h3>
            <p>Reliable delivery for your important occasions.</p>
          </div>
        </div>
      </section>

      {/* Explore Categories */}
      <section className="home-categories">
        <div className="wrap">
          <div className="home-categories-header">
            <div className="home-categories-heading">
              <h2>Explore Categories</h2>
              <p>Curated categories for every personalization need.</p>
            </div>

            <div className="home-categories-controls">
              <a href="/products" className="home-categories-view-all">
                View All Products
              </a>

              <div className="home-categories-arrows">
                <button
                  type="button"
                  className="home-category-arrow"
                  onClick={() => scrollCategories(-1)}
                  aria-label="View previous categories"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="home-category-arrow"
                  onClick={() => scrollCategories(1)}
                  aria-label="View more categories"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div
            className="home-category-track"
            ref={categoryTrackRef}
            aria-label="Product categories"
          >
            {categoryCards.map((category) => (
              <a
                key={category.name}
                href={`/products?category=${encodeURIComponent(
                  category.name
                )}`}
                className="home-category-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={category.image}
                  alt={`${category.name} category`}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src = createFallbackImage(
                      category.name
                    );
                  }}
                />

                <div className="home-category-overlay" />

                <div className="home-category-content">
                  <h3>{category.name}</h3>
                  <span>Explore Collection</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="about">
        <div className="wrap about-grid">
          <div className="about-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://picsum.photos/seed/gifted-about/900/900"
              alt="Premium corporate gifts arranged by Gifted Delites"
            />
          </div>

          <div className="about-copy">
            <p className="eyebrow">OUR APPROACH</p>

            <h2>Designed For Meaningful Connections</h2>

            <p>
              Gifted Delites creates premium products that help brands
              celebrate, connect and create memorable experiences —
              spreading joy and goodwill with every gift. Every item is
              chosen for how it holds up in daily use, not just how it
              photographs, because a gift that lasts says more than one that
              doesn&apos;t.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="contact wrap">
        <h2>Need Something Unique?</h2>

        <p>Start your custom project with Gifted Delites today.</p>

        <a
          href="https://wa.me/2349126105778"
          className="primary-btn"
          target="_blank"
          rel="noreferrer"
        >
          Start Your Project
        </a>
      </section>

      <footer>
        <div className="wrap footer-grid">
          <div className="footer-col">
            <div className="logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpg" alt="Gifted Delites" />
            </div>

            <p>
              Spreading joy and goodwill — considered gifting essentials,
              made to impress and built to last.
            </p>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <a href="/products">All Products</a>
            <a href="/#about">About</a>
            <a href="/#contact">Custom Orders</a>
          </div>

          <div className="footer-col">
            <h4>Order Via</h4>

            <a
              href="https://wa.me/2349126105778"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>

            <a
              href="https://instagram.com/manestyle.lagos"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>

        <div className="wrap footer-bottom">
          © {new Date().getFullYear()} Gifted Delites. All rights reserved.
        </div>
      </footer>
    </main>
  );
}