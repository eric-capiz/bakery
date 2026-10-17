import Link from "next/link";
import ConsultationForm from "../components/ConsultationForm";
import type { SiteContent } from "../../lib/content";

/** Contact page — CMS-driven contact details + the consultation form. */
const Contact = ({ content }: { content: SiteContent }) => {
  const about = content.about;
  const phoneHref = about.phone ? `tel:${about.phone.replace(/\D/g, "")}` : "tel:";

  return (
    <div className="contact-page">
      <div className="contact-container">
        <section className="consultation-section">
          <h2>Book a Consultation</h2>
          <p>
            Schedule a time to discuss your custom cake needs. Please fill out
            the form below and I&apos;ll get back to you as soon as possible.
          </p>
          <p className="contact-page-crosslink">
            Want to sketch your cake or pastries first? Try the{" "}
            <Link href="/build">Build</Link> page to use the visual designer
            and send your ideas with your details.
          </p>

          <ConsultationForm />

          <aside className="contact-details-card" aria-label="Bakery contact details">
            <h3>Get in touch directly</h3>
            <ul>
              <li>
                <span className="contact-details-label">Email</span>
                <a href={`mailto:${about.email}`}>{about.email}</a>
              </li>
              <li>
                <span className="contact-details-label">Phone</span>
                <a href={phoneHref}>{about.phone}</a>
              </li>
              {about.address && (
                <li>
                  <span className="contact-details-label">Location</span>
                  <span>{about.address}</span>
                </li>
              )}
              {about.hours.length > 0 && (
                <li>
                  <span className="contact-details-label">Hours</span>
                  <span>
                    {about.hours.map((h) => `${h.day}: ${h.time}`).join(" · ")}
                  </span>
                </li>
              )}
            </ul>
          </aside>
        </section>
      </div>
    </div>
  );
};

export default Contact;
