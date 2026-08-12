"use client";

import { useEffect, useRef, useState } from "react";
import { PRODUCT_CATALOGS } from "@/lib/catalogs";

type ApiProduct = {
  id?: number;
  name?: string;
  category?: string;
  catalogs?: string[];
  images?: string[];
};

type CategoryCard = {
  name: string;
  image: string;
};

const FALLBACK_CATEGORY_CARDS: CategoryCard[] = PRODUCT_CATALOGS.map(
  (name) => ({ name, image: createFallbackImage(name) })
);

function createFallbackImage(category: string) {
  return category.length % 2 === 0
    ? "/images/gifted-delites-about.webp"
    : "/images/gifted-delites-hero.webp";
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
          const productImage = Array.isArray(product.images)
            ? product.images.find(
                (image) =>
                  typeof image === "string" && image.trim().length > 0
              )
            : undefined;

          const productCatalogs = Array.isArray(product.catalogs)
            ? product.catalogs
            : [];

          productCatalogs.forEach((catalog) => {
            const category = catalog.trim();

            if (category && !categoryMap.has(category)) {
              categoryMap.set(
                category,
                productImage || createFallbackImage(category)
              );
            }
          });
        });

        const sortedCategories = [...PRODUCT_CATALOGS];

        setCategories(sortedCategories);

        setCategoryCards(
          sortedCategories.map((category) => ({
            name: category,
            image:
              categoryMap.get(category) || createFallbackImage(category),
          }))
        );
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
            <img
              src="/images/gifted-delites-logo.jpg"
              alt="Gifted Delites — Spreading joy and goodwill"
            />
          </a>

          <nav className="nav-links" aria-label="Main navigation">
            <a href="/">Home</a>
            <a href="/products">Product Catalogs</a>
            <a href="/about">About</a>
            <a href="/services">Our Services</a>
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
            src="/images/gifted-delites-hero.webp"
            alt=""
          />

          <div className="hero-overlay" />
        </div>

        <div className="wrap hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">GIFTS THAT MAKE AN IMPRESSION</p>

            <h1>
              Thoughtful Gifts.
              <br />
              Beautifully Personal.
            </h1>

            <p className="hero-text">
              From one-of-a-kind keepsakes to polished corporate collections,
              we create gifts that spread joy, strengthen connections and keep
              your brand remembered.
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
            <h3>Made to Delight</h3>
            <p>Beautifully selected gifts your recipients will truly value.</p>
          </div>

          <div>
            <h3>Personal to You</h3>
            <p>Names, messages and brand details finished with care.</p>
          </div>

          <div>
            <h3>Reliable Delivery</h3>
            <p>Carefully packed and delivered for your important moments.</p>
          </div>
        </div>
      </section>

      {/* Explore Categories */}
      <section className="home-categories">
        <div className="wrap">
          <div className="home-categories-header">
            <div className="home-categories-heading">
              <h2>Explore Categories</h2>
              <p>Find the right gift for clients, teams and special moments.</p>
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
              src="/images/gifted-delites-about.webp"
              alt="Premium corporate gifts arranged by Gifted Delites"
            />
          </div>

          <div className="about-copy">
            <p className="eyebrow">THE GIFTED DELITES TOUCH</p>

            <h2>Every Detail Chosen to Mean More</h2>

            <p>
              We source and deliver curated corporate gifts, promotional
              merchandise and premium executive gift solutions—customized for
              your brand, budget, recipients and occasion.
            </p>

            <a href="/about" className="text-link">Discover Our Approach</a>
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
              <img
                src="/images/gifted-delites-logo.jpg"
                alt="Gifted Delites"
              />
            </div>

            <p>
              Spreading joy and goodwill through memorable personal and
              corporate gifts, made with care.
            </p>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <a href="/products">Product Catalogs</a>
            <a href="/about">About</a>
            <a href="/services">Our Services</a>
            <a href="/#contact">Custom Orders</a>
          </div>

          <div className="footer-col">
            <h4>Order Via</h4>

            <a
              href="https://wa.me/2349126105778"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp (0912 610 5778)
            </a>

            <a
              href="https://wa.me/2349041000002"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp (0904 100 0002)
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
