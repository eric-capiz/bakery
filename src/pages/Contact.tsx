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

          <ConsultationForm />
        </section>
      </div>
    </div>
  );
};

export default Contact;
