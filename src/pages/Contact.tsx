import Link from "next/link";
import ConsultationForm from "../components/ConsultationForm";

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <section className="consultation-section">
          <h2>Book a Consultation</h2>
          <p>
            Schedule a time to discuss your custom cake needs. Please fill out
            the form below and I'll get back to you as soon as possible.
          </p>
          <p className="contact-page-crosslink">
            Want to sketch your cake or pastries first? Try the{" "}
            <Link href="/build">Build</Link>
            {" "}page to use the visual designer and send your ideas with your
            details.
          </p>

          <ConsultationForm />
        </section>
      </div>
    </div>
  );
};

export default Contact;
