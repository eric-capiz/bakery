import Link from "next/link";
import type { SiteContent } from "../../lib/content";
import { DEFAULT_CONTENT } from "../../lib/defaults";

type AboutProps = {
  /** Optional so legacy alias routes keep rendering branch defaults. */
  content?: SiteContent;
};

const About = ({ content = DEFAULT_CONTENT }: AboutProps) => {
  const { about, features } = content;
  const introParas = about.intro
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return (
    <div className="pt-page pt-about">
      <header className="pt-page-head">
        <p className="pt-kicker">About</p>
        <h1>Built for the pit.</h1>
        <p>
          PIT runs a real bay and a mobile van — same honesty either place.
        </p>
      </header>

      <section className="pt-about-block">
        <img src="/img/pit/work/02.jpg" alt="Tools on the workbench" />
        <div>
          {introParas.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {about.highlights.length > 0 ? (
        <section className="pt-checklist" aria-label="Why the pit">
          <div className="pt-shell">
            <p className="pt-kicker">Straight from the bay</p>
            <ul>
              {about.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="pt-pillars">
        {features.map((f, i) => (
          <article key={i}>
            <h2>{String(i + 1).padStart(2, "0")}</h2>
            <p>
              <strong>{f.title}</strong> — {f.description}
            </p>
          </article>
        ))}
      </section>

      <div className="pt-page-foot">
        <p>Ready to get on the board?</p>
        <Link href="/book" className="pt-btn">
          Book now
        </Link>
      </div>
    </div>
  );
};

export default About;
