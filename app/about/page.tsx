import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn how Gifted Delites sources, brands, packages and delivers premium corporate gifts and promotional merchandise.",
};

export default function AboutPage() {
  return (
    <main>
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
            <a href="/about" aria-current="page">About</a>
            <a href="/services">Our Services</a>
            <a href="/#contact">Contact</a>
          </nav>

          <a href="/products" className="header-cta">
            Explore Gifts
          </a>
        </div>
      </header>

      <section className="about-page-hero">
        <div className="wrap about-page-hero-grid">
          <div>
            <p className="eyebrow">ABOUT GIFTED DELITES</p>
            <h1>Corporate Gifting, Thoughtfully Handled</h1>
            <p>
              Every gift is an opportunity to strengthen relationships,
              express appreciation and create lasting goodwill.
            </p>
          </div>

          <div className="about-page-hero-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/gifted-delites-about.webp"
              alt="A premium Gifted Delites corporate gift collection"
            />
          </div>
        </div>
      </section>

      <section className="about-story section">
        <div className="wrap about-story-grid">
          <div>
            <p className="eyebrow">WHO WE ARE</p>
            <h2>Your Procurement Partner for Memorable Gifts</h2>
          </div>

          <div className="about-prose">
            <p>
              Gifted Delites specializes in sourcing and delivering
              thoughtfully curated corporate gifts, promotional merchandise,
              branded merchandise and premium executive gift solutions that
              help organizations celebrate the people who matter most.
            </p>
            <p>
              Unlike traditional retailers, we do not maintain stock. We
              operate a procurement-based model, sourcing every item
              specifically for your requirements. This gives you access to a
              wider range of quality products, greater flexibility,
              competitive pricing and the freedom to customize every order for
              your brand, budget and occasion.
            </p>
            <p>
              Whether you are recognizing C-suite executives, rewarding
              employees, appreciating clients, welcoming delegates or
              promoting your brand, we work with trusted local and
              international suppliers to identify suitable products and
              deliver them on time.
            </p>
          </div>
        </div>
      </section>

      <section className="about-final-cta">
        <div className="wrap">
          <p className="eyebrow">EXPLORE GIFTED DELITES</p>
          <h2>Discover What We Can Do for You</h2>
          <p>
            Browse our product catalogs or learn how our end-to-end services
            make corporate gifting effortless.
          </p>
          <div className="hero-buttons">
            <a href="/products" className="primary-btn">Browse Products</a>
            <a
              href="/services"
              className="secondary-btn"
            >
              View Our Services
            </a>
          </div>
          <p className="about-signoff">
            Premium Corporate Gifts. Expertly Sourced. Beautifully Branded.
            Professionally Delivered.
          </p>
        </div>
      </section>

      <footer>
        <div className="wrap footer-grid">
          <div className="footer-col">
            <div className="logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/gifted-delites-logo.jpg" alt="Gifted Delites" />
            </div>
            <p>
              Premium corporate gifts, expertly sourced, beautifully branded
              and professionally delivered.
            </p>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <a href="/">Home</a>
            <a href="/products">Product Catalogs</a>
            <a href="/about">About</a>
            <a href="/services">Our Services</a>
          </div>

          <div className="footer-col">
            <h4>Start an Enquiry</h4>
            <a
              href="https://wa.me/2349126105778"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
            <a href="/#contact">Contact</a>
          </div>
        </div>

        <div className="wrap footer-bottom">
          © {new Date().getFullYear()} Gifted Delites. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
