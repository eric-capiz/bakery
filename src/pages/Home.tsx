import Link from "next/link";
import { motion } from "framer-motion";
import type { SiteContent } from "../../lib/content";
import { DEFAULT_CONTENT } from "../../lib/defaults";

type HomeProps = {
  /** Optional so legacy alias routes keep rendering branch defaults. */
  content?: SiteContent;
};

const Home = ({ content = DEFAULT_CONTENT }: HomeProps) => {
  const { hero, marquee, notice } = content;
  const tape = marquee && marquee.length > 0 ? marquee : [];
  const h1 = [hero.title, hero.titleAccent, hero.titleEnd]
    .filter((s) => s && s.trim().length > 0)
    .join(" ");

  return (
    <div className="pt-home">
      {notice && notice.trim().length > 0 ? (
        <div className="pt-notice" role="status">
          <span className="pt-notice-tag">Shop notice</span>
          <p>{notice}</p>
        </div>
      ) : null}

      <section className="pt-hero" aria-label="PIT hero">
        <img src={hero.image} alt={hero.imageAlt} />
        <div className="pt-hero-shade" aria-hidden="true" />
        <motion.div
          className="pt-hero-copy"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          {hero.eyebrow ? (
            <p className="pt-kicker pt-hero-kicker">{hero.eyebrow}</p>
          ) : null}
          <h1>{h1}</h1>
          <p className="pt-hero-line">{hero.subtitle}</p>
          {hero.caption ? <p className="pt-hero-sub">{hero.caption}</p> : null}
          <div className="pt-actions">
            <Link href={hero.ctaPrimaryHref} className="pt-btn">
              {hero.ctaPrimary}
            </Link>
            <Link href={hero.ctaSecondaryHref} className="pt-btn pt-btn--ghost">
              {hero.ctaSecondary}
            </Link>
          </div>
        </motion.div>
      </section>

      <div className="pt-tape" aria-hidden="true">
        <div className="pt-tape-track">
          {[...tape, ...tape].map((item, i) => (
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
            <Link href={hero.ctaPrimaryHref} className="pt-btn">
              {hero.ctaPrimary}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
