import Link from "next/link";
import ConsultationForm from "../components/ConsultationForm";
import type { SiteContent } from "../../lib/content";
import { DEFAULT_CONTENT } from "../../lib/defaults";

type BookProps = {
  content?: SiteContent;
};

const Book = ({ content = DEFAULT_CONTENT }: BookProps) => {
  const { about } = content;

  return (
    <div className="el-page el-book">
      <header className="el-page-head">
        <p className="el-eyebrow">Contact</p>
        <h1>Arrange a visit</h1>
        <p>
          Tell us about the property and what you need. We respond with timing
          and a clear range.
        </p>
      </header>

      <div className="el-book-grid">
        <aside>
          <p className="el-eyebrow">Studio</p>
          <ul>
            <li>
              <span>Telephone</span>
              <strong>
                <a href={`tel:${about.phone.replace(/[^+\d]/g, "")}`}>
                  {about.phone}
                </a>
              </strong>
            </li>
            {about.email ? (
              <li>
                <span>Email</span>
                <strong>
                  <a href={`mailto:${about.email}`}>{about.email}</a>
                </strong>
              </li>
            ) : null}
            <li>
              <span>Area</span>
              <strong>{about.address}</strong>
            </li>
            <li>
              <span>Hours</span>
              <strong>
                {about.hours.map((row) => (
                  <span key={row.day} className="el-hours-row">
                    {row.day} · {row.time}
                  </span>
                ))}
              </strong>
            </li>
          </ul>
          <p className="el-aside-note">
            Prefer to browse first?{" "}
            <Link href="/services">View services &amp; pricing</Link>
          </p>
        </aside>
        <div className="el-book-form">
          <h2>Request</h2>
          <ConsultationForm />
        </div>
      </div>
    </div>
  );
};

export default Book;
