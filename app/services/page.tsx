import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Complete corporate gifting services including sourcing, branding, curation, packaging, vendor management and delivery.",
};

const services = [
  { title: "Strategic Product Sourcing", description: "We source high-quality products locally and internationally based on your specifications, budget and delivery timelines." },
  { title: "Branding & Customization", description: "Bring your brand to life through premium personalization including logo printing, embroidery, engraving, embossing, debossing, laser marking, UV printing, packaging customization and bespoke gift presentation." },
  { title: "Gift Curation", description: "We help select the perfect product combinations for executive gifting, employee appreciation, conferences, product launches, festive celebrations, customer loyalty campaigns and special events." },
  { title: "Packaging Solutions", description: "Premium gift boxes, luxury wrapping, ribbons, branded inserts, thank-you cards and presentation packaging designed to create memorable unboxing experiences." },
  { title: "Procurement & Vendor Management", description: "We manage supplier selection, quality assurance, production follow-up and order coordination so you do not have to." },
  { title: "Logistics & Delivery Management", description: "From production to doorstep, we coordinate packaging, warehousing where required, nationwide and international shipping, and multi-location deliveries." },
];

export default function ServicesPage() {
  return (
    <main>
      <header>
        <div className="header-row wrap">
          <a href="/" className="logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/gifted-delites-logo.jpg" alt="Gifted Delites" />
          </a>
          <nav className="nav-links" aria-label="Main navigation">
            <a href="/">Home</a>
            <a href="/products">Product Catalogs</a>
            <a href="/about">About</a>
            <a href="/services" aria-current="page">Our Services</a>
            <a href="/#contact">Contact</a>
          </nav>
          <a href="https://wa.me/2349041000002" className="header-cta" target="_blank" rel="noreferrer">Get a Quote</a>
        </div>
      </header>

      <section className="service-page-hero">
        <div className="wrap">
          <p className="eyebrow">OUR SERVICES</p>
          <h1>Complete Corporate Gifting, From Idea to Delivery</h1>
          <p>Beyond supplying quality gift items, Gifted Delites provides a complete end-to-end corporate gifting solution.</p>
        </div>
      </section>

      <section className="about-services section">
        <div className="wrap">
          <div className="service-grid">
            {services.map((service, index) => (
              <article className="service-card" key={service.title}>
                <span className="service-number">{String(index + 1).padStart(2, "0")}</span>
                <h2>{service.title}</h2>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="how-it-works section">
        <div className="wrap how-it-works-grid">
          <div><p className="eyebrow">A SIMPLE PROCESS</p><h2>How It Works</h2></div>
          <ol>
            <li><strong>Browse:</strong> Add preferred products to your enquiry cart.</li>
            <li><strong>Brief us:</strong> Share branding, quantity, budget, recipients and deadline.</li>
            <li><strong>Receive options:</strong> We prepare a tailored quotation and recommendations.</li>
            <li><strong>We deliver:</strong> We manage sourcing, branding, packaging and logistics.</li>
          </ol>
        </div>
      </section>

      <section className="about-final-cta"><div className="wrap">
        <p className="eyebrow">LET US HANDLE THE DETAILS</p>
        <h2>Start Your Corporate Gifting Project</h2>
        <p>Tell us what you need and we will recommend the right products and process for your goals.</p>
        <div className="hero-buttons"><a href="https://wa.me/2349041000002" className="primary-btn" target="_blank" rel="noreferrer">Request a Quote</a><a href="/products" className="secondary-btn">Browse Catalogs</a></div>
        <p className="about-signoff">Premium Corporate Gifts. Expertly Sourced. Beautifully Branded. Professionally Delivered.</p>
      </div></section>

      <footer><div className="wrap footer-grid"><div className="footer-col"><div className="logo">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/images/gifted-delites-logo.jpg" alt="Gifted Delites" /></div><p>Spreading joy and goodwill through memorable corporate gifts.</p></div><div className="footer-col"><h4>Explore</h4><a href="/about">About</a><a href="/services">Our Services</a><a href="/products">Product Catalogs</a></div><div className="footer-col"><h4>Start an Enquiry</h4><a href="https://wa.me/2349041000002" target="_blank" rel="noreferrer">WhatsApp (0904 100 0002)</a><a href="/#contact">Contact</a></div></div><div className="wrap footer-bottom">© {new Date().getFullYear()} Gifted Delites. All rights reserved.</div></footer>
    </main>
  );
}
