import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { useEffect, useState } from "react";

interface HomeContent {
  hero: {
    tagline: string;
    taglineAccent: string;
    taglineEnd: string;
    subtitle: string;
  };
  features: Array<{ icon: string; title: string; description: string }>;
  specialties: Array<{ title: string; description: string }>;
}

const GALLERY = [
  "/img/Cakes/cake2.jpg",
  "/img/Cakes/cake5.jpg",
  "/img/Cakes/cake8.jpg",
  "/img/Cakes/cake11.jpg",
  "/img/Cakes/cake14.jpg",
  "/img/Cakes/cake16.jpg",
];

const MARQUEE = [
  "Custom Cakes",
  "Weddings",
  "Birthdays",
  "Cupcakes",
  "Anniversaries",
  "Private Events",
  "Sugar Art",
  "Consultations",
];

const Home = () => {
  const { ref: craftRef, inView: craftInView } = useInView({
    threshold: 0.15,
    triggerOnce: true,
  });
  const { ref: featuresRef, inView: featuresInView } = useInView({
    threshold: 0.12,
    triggerOnce: true,
  });
  const { ref: specialtiesRef, inView: specialtiesInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const { ref: galleryRef, inView: galleryInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const { ref: quoteRef, inView: quoteInView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const { ref: ctaRef, inView: ctaInView } = useInView({
    threshold: 0.15,
    triggerOnce: true,
  });

  const [content, setContent] = useState<HomeContent | null>(null);
  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setIntroReady(true), 80);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contentResponse = await fetch("/api/content/get");
        const contentData = await contentResponse.json();
        if (contentData.home) setContent(contentData.home);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);

  const features =
    content?.features ??
    ([
      {
        icon: "",
        title: "Fast Service",
        description: "Within 24hrs in most cases!",
      },
      {
        icon: "",
        title: "Affordable",
        description: "Competitive pricing with promotional discounts available!",
      },
      {
        icon: "",
        title: "Custom Made",
        description: "Dream big! We bring your vision to life.",
      },
      {
        icon: "",
        title: "Professional",
        description: "8+ years of professional baking experience.",
      },
    ] as HomeContent["features"]);

  const specialties =
    content?.specialties ??
    ([
      {
        title: "Birthday Cakes",
        description:
          "Make every birthday unforgettable with our custom designs.",
      },
      {
        title: "Wedding Cakes",
        description: "Elegant and delicious cakes for your special day.",
      },
      {
        title: "Anniversary Cakes",
        description: "Celebrate your milestones with style.",
      },
      {
        title: "Corporate Events",
        description: "Professional cakes for your business occasions.",
      },
    ] as HomeContent["specialties"]);

  const tagline = content?.hero.tagline || "The More";
  const taglineAccent = content?.hero.taglineAccent || "Cake";
  const taglineEnd = content?.hero.taglineEnd || "The Batter";
  const subtitle =
    content?.hero.subtitle || "Contact me for all your sweet tooth needs!";

  return (
    <div className="home-silk">
      <section className={`intro-silk ${introReady ? "is-ready" : ""}`}>
        <div className="intro-silk-copy">
          <p className="intro-silk-brand">Sweet Dreams Bakery</p>
          <h1 className="intro-silk-title">
            <span>{tagline}</span>
            <span className="intro-silk-accent">{taglineAccent}</span>
            <span>{taglineEnd}</span>
          </h1>
          <p className="intro-silk-subtitle">{subtitle}</p>
          <div className="intro-silk-actions">
            <Link href="/contact" className="btn-silk">
              Book a Consultation
            </Link>
            <Link href="/sample-cakes" className="btn-silk-ghost">
              View Gallery
            </Link>
          </div>
        </div>
        <div className="intro-silk-visual">
          <div className="intro-silk-frame">
            <img
              src="/img/home/hero-pastry.png"
              alt="Signature celebration cake"
            />
          </div>
          <p className="intro-silk-caption">Hand finished · Made to order</p>
        </div>
      </section>

      <div className="marquee-silk" aria-hidden="true">
        <div className="marquee-silk-track">
          {[...MARQUEE, ...MARQUEE].map((word, i) => (
            <span key={`${word}-${i}`}>
              {word}
              <i />
            </span>
          ))}
        </div>
      </div>

      <section
        ref={craftRef}
        className={`craft-silk ${craftInView ? "is-visible" : ""}`}
      >
        <div
          className="craft-silk-media"
          style={{ backgroundImage: "url(/img/home/pastry-spread.png)" }}
        />
        <div className="craft-silk-veil" />
        <div className="craft-silk-copy">
          <p className="silk-kicker">The craft</p>
          <h2>
            Pastry as an experience,
            <em> not just a dessert.</em>
          </h2>
          <p>
            Each piece is composed for the moment it belongs to, with quiet
            precision and a taste that lingers.
          </p>
        </div>
      </section>

      <section
        ref={featuresRef}
        className={`features-silk ${featuresInView ? "is-visible" : ""}`}
      >
        <div className="silk-shell">
          <div className="features-silk-head">
            <p className="silk-kicker">Why choose us</p>
            <h2 className="silk-heading">Standards we never soften</h2>
          </div>
          <ol className="features-silk-list">
            {features.map((feature, index) => (
              <li key={index}>
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        ref={specialtiesRef}
        className={`specialties-silk ${specialtiesInView ? "is-visible" : ""}`}
      >
        <div className="silk-shell">
          <div className="specialties-silk-head">
            <p className="silk-kicker">Our specialties</p>
            <h2 className="silk-heading">Made for the moment</h2>
            <p className="specialties-silk-lead">
              From quiet gatherings to grand celebrations, each piece is shaped
              around the day it belongs to.
            </p>
          </div>
          <ul className="specialties-silk-list">
            {specialties.map((specialty, index) => (
              <li key={index}>
                <span className="specialties-silk-num" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="specialties-silk-copy">
                  <h3>{specialty.title}</h3>
                  <p>{specialty.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        ref={galleryRef}
        className={`gallery-silk ${galleryInView ? "is-visible" : ""}`}
      >
        <div className="silk-shell">
          <div className="gallery-silk-head">
            <div>
              <p className="silk-kicker">Gallery</p>
              <h2 className="silk-heading">A taste of the work</h2>
              <p className="gallery-silk-lead">
                A few recent pieces from the studio. Every cake is made to order
                and finished by hand.
              </p>
            </div>
            <Link href="/sample-cakes" className="gallery-silk-link">
              See all sample cakes
            </Link>
          </div>
          <div className="gallery-silk-stage">
            <figure className="gallery-silk-feature">
              <img src={GALLERY[0]} alt="Featured sample cake" />
            </figure>
            <div className="gallery-silk-side">
              {GALLERY.slice(1, 3).map((src, index) => (
                <figure key={src} className="gallery-silk-side-item">
                  <img src={src} alt={`Sample cake ${index + 2}`} />
                </figure>
              ))}
            </div>
          </div>
          <div className="gallery-silk-row">
            {GALLERY.slice(3).map((src, index) => (
              <figure key={src} className="gallery-silk-row-item">
                <img src={src} alt={`Sample cake ${index + 4}`} />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={quoteRef}
        className={`quote-silk ${quoteInView ? "is-visible" : ""}`}
      >
        <div className="silk-shell">
          <blockquote>
            <p>
              Truly a masterpiece. The most fascinating looking cake I have
              seen.
            </p>
            <cite>Happy Customer</cite>
          </blockquote>
          <div className="quote-silk-more">
            <p>
              Sweet Dreams Bakery cakes are always moist and taste
              extraordinary.
            </p>
            <p>Always the best looking cakes.</p>
            <Link href="/reviews">Read more reviews</Link>
          </div>
        </div>
      </section>

      <section
        ref={ctaRef}
        className={`cta-silk ${ctaInView ? "is-visible" : ""}`}
      >
        <div className="cta-silk-panel">
          <h2>Ready for your perfect cake?</h2>
          <p>
            Share the celebration. We will shape the flavor, finish, and feeling
            around your vision.
          </p>
          <Link href="/contact" className="btn-silk">
            Book Consultation
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
