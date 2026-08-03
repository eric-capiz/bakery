import Link from "next/link";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="br-home">
      <section className="br-chamber">
        <motion.div
          className="br-chamber-copy"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="br-brand">Brume</p>
          <h1>Florals for evenings that matter.</h1>
          <p className="br-lede">
            Bridal bouquets and private arrangements composed in deep color —
            restrained, modern, sure of themselves.
          </p>
          <div className="br-actions">
            <Link href="/commission" className="br-btn">
              Commission
            </Link>
            <Link href="/portfolio" className="br-btn br-btn--ghost">
              Portfolio
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="br-chamber-aperture"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src="/img/brume/home/hero.jpg"
            alt="Burgundy bridal bouquet by Brume"
          />
        </motion.div>
      </section>

      <section className="br-strip">
        <div className="br-shell">
          <p className="br-kicker">Selected work</p>
          <div className="br-strip-row">
            <Link href="/portfolio" className="br-strip-card">
              <img src="/img/brume/work/02.jpg" alt="Apricot bridal bouquet" />
              <span>Bridal bouquets</span>
            </Link>
            <Link href="/portfolio" className="br-strip-card">
              <img src="/img/brume/work/05.jpg" alt="Table arrangement" />
              <span>Table vessels</span>
            </Link>
            <Link href="/portfolio" className="br-strip-card">
              <img src="/img/brume/work/07.jpg" alt="Studio bouquet" />
              <span>Studio studies</span>
            </Link>
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
            <Link href="/commission" className="br-btn">
              Commission
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
