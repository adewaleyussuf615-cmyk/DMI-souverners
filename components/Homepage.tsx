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
            <a href="#products">Products</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>

          <button className="search-btn">
            Search
          </button>

        </div>
      </header>


      {/* Hero */}
      <section className="hero wrap">

        <div className="hero-copy">

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

            <a href="#products" className="primary-btn">
              Explore Collection
            </a>

            <a href="#contact" className="secondary-btn">
              Custom Order
            </a>

          </div>

        </div>


        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1544816155-12df9643f363"
            alt="Premium gifts"
          />
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



      {/* Products */}
      <section id="products" className="products-section wrap">

        <p className="eyebrow">
          OUR COLLECTION
        </p>

        <h2>
          Featured Products
        </h2>

        <Storefront />

      </section>



      {/* About */}
      <section id="about" className="about">

        <div className="wrap">

          <h2>
            Designed For Meaningful Connections
          </h2>

          <p>
            NOOR creates premium products that help brands celebrate,
            connect and create memorable experiences.
          </p>

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

        <button className="primary-btn">
          Start Your Project
        </button>

      </section>



      <footer>
        <div className="wrap">
          © {new Date().getFullYear()} NOOR. All rights reserved.
        </div>
      </footer>


    </main>
  );
}