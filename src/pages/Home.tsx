import Link from "next/link";
import { motion } from "framer-motion";

const TAPE = [
  "Oil & filter",
  "Brakes",
  "Battery",
  "Diagnostics",
  "Coolant",
  "Spark plugs",
  "A/C",
  "Mobile service",
];

const Home = () => {
  return (
    <div className="pt-home">
      <section className="pt-hero" aria-label="PIT hero">
        <img
          src="/img/pit/home/hero.jpg"
          alt="Mechanic working under a vehicle in the bay"
        />
        <div className="pt-hero-shade" aria-hidden="true" />
        <motion.div
          className="pt-hero-copy"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1>Pit</h1>
          <p className="pt-hero-line">Bay work. Driveway saves.</p>
          <p className="pt-hero-sub">
            Shop lift or mobile van — posted prices, straight answers, no
            mystery invoice.
          </p>
          <div className="pt-actions">
            <Link href="/book" className="pt-btn">
              Book a slot
            </Link>
            <Link href="/services" className="pt-btn pt-btn--ghost">
              Price board
            </Link>
          </div>
        </motion.div>
      </section>

      <div className="pt-tape" aria-hidden="true">
        <div className="pt-tape-track">
          {[...TAPE, ...TAPE].map((item, i) => (
            <span key={`${item}-${i}`}>{item}</span>
          ))}
        </div>
      </div>

      <section className="pt-lanes">
        <article>
          <img src="/img/pit/home/bay.jpg" alt="PIT service bay" />
          <div>
            <p className="pt-kicker">Shop</p>
            <h2>Full bay.</h2>
            <p>Lift jobs, deep diagnostics, anything that needs the floor.</p>
          </div>
        </article>
        <article>
          <img src="/img/pit/home/mobile.jpg" alt="PIT mobile van" />
          <div>
            <p className="pt-kicker">Mobile</p>
            <h2>We roll.</h2>
            <p>Oil, batteries, pads, roadside — priced by zone on services.</p>
          </div>
        </article>
      </section>

      <section className="pt-order">
        <div className="pt-shell">
          <p className="pt-kicker">Work order</p>
          <h2>Starting rates</h2>
          <div className="pt-order-grid">
            <div>
              <span>Oil change</span>
              <strong>$69 / $99</strong>
              <small>Shop / Mobile</small>
            </div>
            <div>
              <span>Brake pads</span>
              <strong>$189 / $249</strong>
              <small>Shop / Mobile</small>
            </div>
            <div>
              <span>Battery install</span>
              <strong>$149 / $189</strong>
              <small>Shop / Mobile</small>
            </div>
            <div>
              <span>Diagnostic</span>
              <strong>$129 / $159</strong>
              <small>Shop / Mobile</small>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-punch">
        <div className="pt-shell">
          <p className="pt-kicker">Ready</p>
          <h2>Get on the board.</h2>
          <p>Tell us shop or mobile, what&apos;s wrong, and when you need it.</p>
          <div className="pt-actions">
            <Link href="/book" className="pt-btn">
              Book now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
