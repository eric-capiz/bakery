import Link from "next/link";

const VALUES = [
  {
    title: "Depth over brightness",
    description: "We favour wine, dusk, and hush — color that holds a room.",
  },
  {
    title: "Bouquets as architecture",
    description: "Form first, then bloom. Every piece must sit well in the hand.",
  },
  {
    title: "Small by design",
    description: "Few commissions. Full attention. No theatre on the day.",
  },
];

const About = () => {
  return (
    <div className="br-page br-practice">
      <header className="br-page-head">
        <p className="br-kicker">Practice</p>
        <h1>The Brume studio</h1>
        <p>
          A dark, measured floral practice for weddings and private evenings.
        </p>
      </header>

      <section className="br-practice-lead">
        <img
          src="/img/brume/home/detail.jpg"
          alt="Table arrangement by Brume"
        />
        <div>
          <p>
            Brume began with a preference for florals that feel like dusk — rich
            without shouting, composed without stiffness.
          </p>
          <p>
            We work with couples and hosts who want bouquets and arrangements
            that hold presence after the light softens. Restraint is the luxury.
          </p>
        </div>
      </section>

      <section className="br-practice-values">
        {VALUES.map((v) => (
          <article key={v.title}>
            <h2>{v.title}</h2>
            <p>{v.description}</p>
          </article>
        ))}
      </section>

      <div className="br-page-foot">
        <p>Ready to talk through a date?</p>
        <Link href="/commission" className="br-btn">
          Commission
        </Link>
      </div>
    </div>
  );
};

export default About;
