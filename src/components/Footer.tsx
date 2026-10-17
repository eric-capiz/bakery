import Link from "next/link";
import type { SiteContent } from "../../lib/content";
import { DEFAULT_CONTENT } from "../../lib/defaults";

type FooterProps = {
  content?: SiteContent;
};

const Footer = ({ content = DEFAULT_CONTENT }: FooterProps) => {
  const year = new Date().getFullYear();

  return (
    <footer className="br-footer">
      <div className="br-footer-inner">
        <div>
          <p className="br-footer-brand">{content.hero.eyebrow}</p>
          <p className="br-footer-tag">
            Florals for evenings that matter — bridal bouquets and private
            arrangements, composed in deep color.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="br-footer-links">
            <li>
              <Link href="/portfolio">Portfolio</Link>
            </li>
            <li>
              <Link href="/practice">Practice</Link>
            </li>
            <li>
              <Link href="/praise">Praise</Link>
            </li>
            <li>
              <Link href={content.hero.ctaPrimaryHref}>
                {content.hero.ctaPrimary}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="br-footer-inner">
        <div className="br-footer-meta" style={{ width: "100%" }}>
          <span>© {year} {content.hero.eyebrow} Studio</span>
          <a href={`mailto:${content.about.email}`}>{content.about.email}</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
