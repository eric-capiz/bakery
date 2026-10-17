import Link from "next/link";
import ConsultationForm from "../components/ConsultationForm";
import type { SiteContent } from "../../lib/content";
import { DEFAULT_CONTENT } from "../../lib/defaults";

type ConsultationProps = {
  content?: SiteContent;
};

const Commission = ({ content = DEFAULT_CONTENT }: ConsultationProps) => {
  const contact = content.about;

  return (
    <div className="br-page br-commission">
      <header className="br-page-head">
        <p className="br-kicker">Commission</p>
        <h1>Tell us the occasion</h1>
        <p>
          Share the date, setting, and mood. We reply with availability and a
          clear next step.
        </p>
      </header>

      <div className="br-commission-layout">
        <aside className="br-commission-aside">
          <img
            src="/img/brume/work/06.jpg"
            alt="Hand-tied bouquet by Brume"
          />
          <div>
            <h2>Studio contact</h2>
            <ul>
              <li>
                <span>Email</span>
                <strong>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </strong>
              </li>
              <li>
                <span>Phone</span>
                <strong>{contact.phone}</strong>
              </li>
              <li>
                <span>Visits</span>
                <strong>{contact.address}</strong>
              </li>
            </ul>
            {contact.hours.length > 0 ? (
              <>
                <h2>Studio hours</h2>
                <ul>
                  {contact.hours.map((h) => (
                    <li key={h.day}>
                      <span>{h.day}</span>
                      <strong>{h.time}</strong>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            <p>
              Prefer to browse first?{" "}
              <Link href="/portfolio">Open the portfolio</Link>.
            </p>
          </div>
        </aside>
        <div className="br-commission-form">
          <h2>Commission form</h2>
          <ConsultationForm />
        </div>
      </div>
    </div>
  );
};

export default Commission;
