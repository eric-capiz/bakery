import Link from "next/link";
import { motion } from "framer-motion";
import type { SiteContent } from "../../lib/content";
import { DEFAULT_CONTENT } from "../../lib/defaults";

const STRIP_IMAGES = [
  { src: "/img/brume/work/02.jpg", alt: "Apricot bridal bouquet" },
  { src: "/img/brume/work/05.jpg", alt: "Table arrangement" },
  { src: "/img/brume/work/07.jpg", alt: "Studio bouquet" },
];

type HomeProps = {
  content?: SiteContent;
};

const Home = ({ content = DEFAULT_CONTENT }: HomeProps) => {
  const hero = content.hero;
  const services = content.services.slice(0, 3);

  return (
    <div className="br-home">
      {content.notice ? (
        <div className="br-notice" role="status">
          <p>{content.notice}</p>
        </div>
      ) : null}

      <section className="br-chamber">
        <motion.div
          className="br-chamber-copy"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="br-brand">{hero.eyebrow}</p>
          <h1>
            {hero.title}
            {hero.titleAccent ? (
              <span className="br-accent">{hero.titleAccent}</span>
            ) : null}
            {hero.titleEnd}
          </h1>
          <p className="br-lede">{hero.subtitle}</p>
          <div className="br-actions">
            <Link href={hero.ctaPrimaryHref} className="br-btn">
              {hero.ctaPrimary}
            </Link>
            <Link href={hero.ctaSecondaryHref} className="br-btn br-btn--ghost">
              {hero.ctaSecondary}
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="br-chamber-aperture"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src={hero.image} alt={hero.imageAlt} />
        </motion.div>
      </section>

      <section className="br-strip">
        <div className="br-shell">
          <p className="br-kicker">Selected work</p>
          <div className="br-strip-row">
            {services.map((service, i) => (
              <Link
                key={service.title}
                href="/portfolio"
                className="br-strip-card"
              >
                <img
                  src={STRIP_IMAGES[i % STRIP_IMAGES.length].src}
                  alt={STRIP_IMAGES[i % STRIP_IMAGES.length].alt}
                />
                <span>{service.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="br-shell br-statement">
        <div>
          <p className="br-kicker">Practice</p>
          <h2>Color with intention. Silence where it counts.</h2>
          <p>
            Brume is a small studio. We design for the hand, the aisle, and the
            room after dark — never for the feed alone.
          </p>
          <Link href="/practice" className="br-text-link">
            Meet the practice
          </Link>
        </div>
        <img
          src="/img/brume/home/secondary.jpg"
          alt="Peach and cream bridal bouquet"
        />
      </section>

      <section className="br-close">
        <div className="br-shell">
          <p className="br-kicker">Commission</p>
          <h2>Begin with a date and a feeling.</h2>
          <p>We reply with availability and a clear next step.</p>
          <div className="br-actions">
            <Link href={hero.ctaPrimaryHref} className="br-btn">
              {hero.ctaPrimary}
            </Link>
            <Link href="/praise" className="br-btn br-btn--ghost">
              Praise
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
