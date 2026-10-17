import Link from "next/link";
import type { SiteContent } from "../../lib/content";
import { DEFAULT_CONTENT } from "../../lib/defaults";

type AboutProps = {
  content?: SiteContent;
};

const About = ({ content = DEFAULT_CONTENT }: AboutProps) => {
  const paragraphs = content.about.intro
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="el-page el-about">
      <header className="el-page-head">
        <p className="el-eyebrow">About</p>
        <h1>A quieter standard</h1>
        <p>
          Ellis is an outdoor care studio for properties that prefer calm
          execution over spectacle.
        </p>
      </header>

      <section className="el-about-story">
        <img
          src="/img/ellis/work/04.jpg"
          alt="Residence with maintained grounds"
        />
        <div>
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          {content.about.highlights.length > 0 ? (
            <ul className="el-about-highlights">
              {content.about.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      {content.features.length > 0 ? (
        <section className="el-principles">
          {content.features.map((feature) => (
            <article key={feature.title}>
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
            </article>
          ))}
        </section>
      ) : null}

      <div className="el-page-foot">
        <p>Speak with Ellis.</p>
        <Link href="/book" className="el-btn">
          Contact
        </Link>
      </div>
    </div>
  );
};

export default About;
