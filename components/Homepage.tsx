"use client";

import Storefront from "@/components/Storefront";

export default function Homepage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div className="text-2xl font-semibold tracking-wide">
            NOOR
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="/" className="font-medium">
              Home
            </a>

            <a href="#products">
              Products
            </a>

            <a href="#about">
              About
            </a>

            <a href="#contact">
              Contact
            </a>
          </div>

          <button className="rounded-full border px-5 py-2 text-sm">
            Search
          </button>

        </nav>
      </header>


      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">

        <div>

          <p className="mb-5 text-sm uppercase tracking-[0.3em] text-neutral-500">
            Premium Corporate Gifts
          </p>

          <h1 className="text-5xl leading-tight font-light md:text-7xl">
            Create Custom Products
            <br />
            That Feel Premium
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-neutral-600">
            Discover thoughtfully designed corporate gifts and branded essentials
            created to elevate every occasion and leave a lasting impression.
          </p>

          <div className="mt-10 flex gap-4">

            <a
              href="#products"
              className="rounded-full bg-black px-8 py-4 text-white"
            >
              Explore Collection
            </a>

            <a
              href="#contact"
              className="rounded-full border px-8 py-4"
            >
              Custom Order
            </a>

          </div>

        </div>


        <div className="overflow-hidden rounded-3xl bg-neutral-100">
          <img
            src="https://images.unsplash.com/photo-1544816155-12df9643f363"
            alt="Premium corporate gifts"
            className="h-[600px] w-full object-cover"
          />
        </div>

      </section>


      {/* Benefits */}
      <section className="border-y py-12">

        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3">

          {[
            "Premium Quality",
            "Custom Branding",
            "Fast Delivery",
          ].map((item) => (
            <div key={item} className="text-center">
              <h3 className="text-lg font-medium">
                {item}
              </h3>
              <p className="mt-2 text-sm text-neutral-500">
                Designed for memorable experiences.
              </p>
            </div>
          ))}

        </div>

      </section>


      {/* Products */}
      <section id="products" className="py-20">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mb-10">
            <p className="text-sm uppercase tracking-widest text-neutral-500">
              Collection
            </p>

            <h2 className="mt-3 text-4xl font-light">
              Featured Products
            </h2>
          </div>


          <Storefront />

        </div>

      </section>


      {/* About */}
      <section id="about" className="bg-neutral-50 py-20">

        <div className="mx-auto max-w-4xl px-6 text-center">

          <h2 className="text-4xl font-light">
            Designed For Meaningful Connections
          </h2>

          <p className="mt-6 text-lg text-neutral-600">
            NOOR creates premium products that help businesses celebrate,
            connect, and create unforgettable moments.

          </p>

        </div>

      </section>


      {/* Contact CTA */}
      <section id="contact" className="py-20">

        <div className="mx-auto max-w-5xl rounded-3xl bg-black px-8 py-16 text-center text-white">

          <h2 className="text-4xl font-light">
            Need Something Unique?
          </h2>

          <p className="mt-5 text-neutral-300">
            Start your custom project with NOOR today.
          </p>

          <button className="mt-8 rounded-full bg-white px-8 py-4 text-black">
            Start Your Project
          </button>

        </div>

      </section>


      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-neutral-500">
        © {new Date().getFullYear()} NOOR. All rights reserved.
      </footer>


    </main>
  );
}