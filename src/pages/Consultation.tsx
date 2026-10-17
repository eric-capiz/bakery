import Link from "next/link";
import ConsultationForm from "../components/ConsultationForm";
import type { SiteContent } from "../../lib/content";
import { DEFAULT_CONTENT } from "../../lib/defaults";

type BookProps = {
  /** Optional so legacy alias routes keep rendering branch defaults. */
  content?: SiteContent;
};

const Book = ({ content = DEFAULT_CONTENT }: BookProps) => {
  const { about, faq } = content;

  return (
    <div className="pt-page pt-book">
      <header className="pt-page-head">
        <p className="pt-kicker">Book</p>
        <h1>Grab a slot</h1>
        <p>
          Shop or mobile, what&apos;s wrong, and when you need it. We confirm
          time and a range before we turn a wrench.
        </p>
      </header>

      <div className="pt-book-grid">
        <aside>
          <img src="/img/pit/work/03.jpg" alt="Service in progress" />
          <ul>
            <li>
              <span>Phone</span>
              <strong>{about.phone}</strong>
            </li>
            <li>
              <span>Shop</span>
              <strong>{about.address}</strong>
            </li>
            <li>
              <span>Hours</span>
              <strong>
                {about.hours.map((h, i) => (
                  <span key={i} className="pt-hours-line">
                    {h.day} · {h.time}
                  </span>
                ))}
              </strong>
            </li>
            {about.email ? (
              <li>
                <span>Email</span>
                <strong>{about.email}</strong>
              </li>
            ) : null}
          </ul>
          <p>
            Price list first? <Link href="/services">Services</Link>
          </p>
        </aside>
        <div className="pt-book-form">
          <h2>Request form</h2>
          <ConsultationForm />
        </div>
      </div>

      {faq.length > 0 ? (
        <section className="pt-faq" aria-label="Common questions">
          <div className="pt-shell">
            <p className="pt-kicker">Common questions</p>
            <h2>Before you book</h2>
            <div className="pt-faq-list">
              {faq.map((f, i) => (
                <details key={i} className="pt-faq-item">
                  <summary>{f.question}</summary>
                  <p>{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default Book;
