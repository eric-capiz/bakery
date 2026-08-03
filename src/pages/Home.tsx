import Link from "next/link";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="el-home">
      <section className="el-hero" aria-label="Ellis hero">
        <img
          src="/img/ellis/home/hero.jpg"
          alt="Modern residence with composed landscape"
        />
        <div className="el-hero-veil" aria-hidden="true" />
        <motion.div
          className="el-hero-copy"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="el-eyebrow">Outdoor care</p>
          <h1>Ellis</h1>
          <p className="el-hero-line">Property, finished.</p>
          <p className="el-hero-sub">
            Refined lawn care, exterior washing, and mobile detailing with quiet
            standards for the modern property.
          </p>
          <div className="el-actions">
            <Link href="/book" className="el-btn">
              Reserve a visit
            </Link>
            <Link href="/services" className="el-btn el-btn--light">
              View services
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="el-intro">
        <div className="el-shell">
          <div className="el-rule" aria-hidden="true" />
          <h2>Stewardship with restraint.</h2>
          <p>
            Ellis tends the grounds and the driveway with the same calm
            precision: clear communication, considered pricing, and a finish
            that feels intentional.
          </p>
        </div>
      </section>

      <section className="el-chapter">
        <div className="el-chapter-media">
          <img
            src="/img/ellis/home/grounds.jpg"
            alt="Manicured lawn and garden beds"
          />
        </div>
        <div className="el-chapter-copy">
          <p className="el-eyebrow">Grounds</p>
          <h2>Lawn, edge, and bed.</h2>
          <p>
            Regular cuts, clean lines, and seasonal care that keep the property
            reading composed, never overworked.
          </p>
          <Link href="/services#grounds" className="el-link">
            See grounds pricing
          </Link>
        </div>
      </section>

      <section className="el-chapter is-flip">
        <div className="el-chapter-media">
          <img
            src="/img/ellis/work/06.jpg"
            alt="Clean exterior surfaces after washing"
          />
        </div>
        <div className="el-chapter-copy">
          <p className="el-eyebrow">Surface</p>
          <h2>Wash without noise.</h2>
          <p>
            Driveways, stone, and façades restored with care, soft where it
            matters, thorough where it counts.
          </p>
          <Link href="/services#surface" className="el-link">
            See wash pricing
          </Link>
        </div>
      </section>

      <section className="el-chapter">
        <div className="el-chapter-media">
          <img
            src="/img/ellis/work/05.jpg"
            alt="Vehicle after mobile detailing"
          />
        </div>
        <div className="el-chapter-copy">
          <p className="el-eyebrow">Vehicle</p>
          <h2>Detail at your door.</h2>
          <p>
            Hand wash and interior detailing in your driveway, discreet,
            punctual, and finished to a quiet shine.
          </p>
          <Link href="/services#vehicle" className="el-link">
            See detailing pricing
          </Link>
        </div>
      </section>

      <section className="el-invite">
        <div className="el-shell">
          <p className="el-eyebrow">Begin</p>
          <h2>A visit, arranged.</h2>
          <p>
            Share what you need: grounds, wash, detail, or all three. We reply
            with timing and a clear range.
          </p>
          <div className="el-actions">
            <Link href="/book" className="el-btn">
              Contact Ellis
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
