"use client";

import Storefront from "@/components/Storefront";

export default function Homepage() {
  return (
    <main>

      {/* Navigation */}
      <header>
        <div className="header-row wrap">

          <div className="logo">
            NOOR
          </div>

          <nav className="nav-links">
            <a href="/">Home</a>
            <a href="/products">Products</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>

          <a href="/products" className="search-btn">
            Search
          </a>

        </div>
      </header>


      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://picsum.photos/seed/noor-hero-bg/1600/900"
            alt=""
          />
          <div className="hero-overlay" />
        </div>

        <div className="wrap hero-copy">

          <p className="eyebrow">
            PREMIUM CORPORATE GIFTS
          </p>

          <h1>
            Create Custom Products
            <br />
            That Feel Premium
          </h1>

          <p className="hero-text">
            Discover thoughtfully designed corporate gifts and branded essentials
            created to elevate every occasion and leave a lasting impression.
          </p>

          <div className="hero-buttons">

            <a href="/products" className="primary-btn">
              Explore Collection
            </a>

            <a href="#contact" className="secondary-btn secondary-btn-light">
              Custom Order
            </a>

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




      {/* About */}
      <section id="about" className="about">

        <div className="wrap about-grid">

          <div className="about-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://picsum.photos/seed/noor-about/900/900"
              alt=""
            />
          </div>

          <div className="about-copy">
            <p className="eyebrow">OUR APPROACH</p>
            <h2>
              Designed For Meaningful Connections
            </h2>
            <p>
              NOOR creates premium products that help brands celebrate,
              connect and create memorable experiences. Every item is chosen
              for how it holds up in daily use, not just how it photographs
              — because a gift that lasts says more than one that doesn't.
            </p>
          </div>

        </div>

      </section>



      {/* Contact */}
      <section id="contact" className="contact wrap">

        <h2>
          Need Something Unique?
        </h2>

        <p>
          Start your custom project with NOOR today.
        </p>

        <a href="https://wa.me/2349126105778" className="primary-btn">
          Start Your Project
        </a>

      </section>



      <footer>
        <div className="wrap footer-grid">

          <div className="footer-col">
            <div className="logo">NOOR</div>
            <p>Considered corporate gifting essentials, made to impress and built to last.</p>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <a href="/products">All Products</a>
            <a href="/#about">About</a>
            <a href="/#contact">Custom Orders</a>
          </div>

          <div className="footer-col">
            <h4>Order Via</h4>
            <a href="https://wa.me/2349126105778">WhatsApp</a>
            <a href="https://instagram.com/manestyle.lagos">Instagram</a>
          </div>

        </div>

        <div className="wrap footer-bottom">
          © {new Date().getFullYear()} NOOR. All rights reserved.
        </div>
      </footer>


    </main>
  );
}