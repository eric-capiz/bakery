import Link from "next/link";
import type { SiteContent } from "../../lib/content";
import { DEFAULT_CONTENT } from "../../lib/defaults";

type AboutProps = {
  content?: SiteContent;
};

const About = ({ content = DEFAULT_CONTENT }: AboutProps) => {
  const introParagraphs = content.about.intro
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

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
          {introParagraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="br-practice-values">
        {content.features.map((v) => (
          <article key={v.title}>
            {v.icon ? (
              <span className="br-value-icon" aria-hidden="true">
                {v.icon}
              </span>
            ) : null}
            <h2>{v.title}</h2>
            <p>{v.description}</p>
          </article>
        ))}
      </section>

      <div className="br-page-foot">
        <p>Ready to talk through a date?</p>
        <Link href={content.hero.ctaPrimaryHref} className="br-btn">
          {content.hero.ctaPrimary}
        </Link>
      </div>
    </div>
  );
};

export default About;
