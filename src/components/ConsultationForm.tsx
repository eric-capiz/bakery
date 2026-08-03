import { useState, useEffect, FormEvent } from "react";
import { Button, Form, FormGroup, Input } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaCalendar,
  FaClock,
  FaCar,
  FaWrench,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaComments,
  FaMapMarkerAlt,
} from "react-icons/fa";

interface ConsultationData {
  name: string;
  email: string;
  phone: string;
  date: Date | null;
  time: string;
  eventType: string;
  guestCount: string;
  budget: string;
  message: string;
}

const ConsultationForm = () => {
  const [consultation, setConsultation] = useState<ConsultationData>({
    name: "",
    email: "",
    phone: "",
    date: null,
    time: "",
    eventType: "",
    guestCount: "",
    budget: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  useEffect(() => {
    if (submitStatus !== "idle") {
      const timer = setTimeout(() => {
        setSubmitStatus("idle");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const handleConsultationChange = (
    field: keyof ConsultationData,
    value: string | Date | null
  ) => {
    setConsultation((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const formData = new FormData();
    formData.append("name", consultation.name);
    formData.append("email", consultation.email);
    formData.append("phone", consultation.phone);
    formData.append(
      "date",
      consultation.date ? consultation.date.toLocaleDateString() : ""
    );
    formData.append("time", consultation.time);
    formData.append("serviceType", consultation.eventType);
    formData.append("location", consultation.guestCount);
    formData.append("vehicle", consultation.budget);
    formData.append("message", consultation.message);
    formData.append(
      "_subject",
      `PIT booking request from ${consultation.name}`
    );

    try {
      const response = await fetch("https://formsubmit.co/ericcapiz@gmail.com", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setSubmitStatus("success");
        setConsultation({
          name: "",
          email: "",
          phone: "",
          date: null,
          time: "",
          eventType: "",
          guestCount: "",
          budget: "",
          message: "",
        });
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form className="consultation-form" onSubmit={handleSubmit}>
      <FormGroup className="input-group">
        <div className="icon-input">
          <FaUser className="input-icon" />
          <Input
            type="text"
            name="name"
            value={consultation.name}
            onChange={(e) => handleConsultationChange("name", e.target.value)}
            placeholder="Your name"
            required
          />
        </div>
      </FormGroup>

      <FormGroup className="input-group">
        <div className="icon-input">
          <FaEnvelope className="input-icon" />
          <Input
            type="email"
            name="email"
            value={consultation.email}
            onChange={(e) => handleConsultationChange("email", e.target.value)}
            placeholder="Email"
            required
          />
        </div>
      </FormGroup>

      <FormGroup className="input-group">
        <div className="icon-input">
          <FaPhone className="input-icon" />
          <Input
            type="text"
            name="phone"
            value={consultation.phone}
            onChange={(e) => handleConsultationChange("phone", e.target.value)}
            placeholder="Phone"
            required
          />
        </div>
      </FormGroup>

      <FormGroup className="input-group">
        <div className="icon-input">
          <FaCalendar className="input-icon" />
          <DatePicker
            selected={consultation.date}
            onChange={(date) => handleConsultationChange("date", date)}
            minDate={new Date()}
            placeholderText="Preferred date"
            className="form-control"
            required
          />
        </div>
      </FormGroup>

      <FormGroup className="input-group">
        <div className="icon-input">
          <FaClock className="input-icon" />
          <Input
            type="select"
            name="time"
            value={consultation.time}
            onChange={(e) => handleConsultationChange("time", e.target.value)}
            required
          >
            <option value="">Preferred time</option>
            <option value="08:00">8:00 AM</option>
            <option value="09:00">9:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="13:00">1:00 PM</option>
            <option value="14:00">2:00 PM</option>
            <option value="15:00">3:00 PM</option>
            <option value="16:00">4:00 PM</option>
          </Input>
        </div>
      </FormGroup>

      <FormGroup className="input-group">
        <div className="icon-input">
          <FaWrench className="input-icon" />
          <Input
            type="select"
            name="eventType"
            value={consultation.eventType}
            onChange={(e) =>
              handleConsultationChange("eventType", e.target.value)
            }
            required
          >
            <option value="">Service needed</option>
            <option value="oil">Oil & filter</option>
            <option value="brakes">Brakes</option>
            <option value="battery">Battery</option>
            <option value="diag">Diagnostic</option>
            <option value="tires">Tires</option>
            <option value="other">Other / not sure</option>
          </Input>
        </div>
      </FormGroup>

      <FormGroup className="input-group">
        <div className="icon-input">
          <FaMapMarkerAlt className="input-icon" />
          <Input
            type="select"
            name="guestCount"
            value={consultation.guestCount}
            onChange={(e) =>
              handleConsultationChange("guestCount", e.target.value)
            }
            required
          >
            <option value="">Shop or mobile?</option>
            <option value="shop">Shop bay</option>
            <option value="mobile-a">Mobile · Zone A</option>
            <option value="mobile-b">Mobile · Zone B</option>
            <option value="mobile-c">Mobile · Zone C</option>
          </Input>
        </div>
      </FormGroup>

      <FormGroup className="input-group">
        <div className="icon-input">
          <FaCar className="input-icon" />
          <Input
            type="text"
            name="budget"
            value={consultation.budget}
            onChange={(e) => handleConsultationChange("budget", e.target.value)}
            placeholder="Year / make / model"
            required
          />
        </div>
      </FormGroup>

      <FormGroup className="input-group">
        <div className="icon-input">
          <FaComments className="input-icon" />
          <Input
            type="textarea"
            name="message"
            value={consultation.message}
            onChange={(e) =>
              handleConsultationChange("message", e.target.value)
            }
            placeholder="What's going on? Symptoms, noises, warning lights…"
            required
          />
        </div>
      </FormGroup>

      <Button type="submit" color="primary" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Request booking"}
      </Button>

      {submitStatus === "success" && (
        <div className="success-message">
          Got it — we&apos;ll confirm time and a price range shortly.
        </div>
      )}
      {submitStatus === "error" && (
        <div className="error-message">
          Something went wrong. Try again or call the shop.
        </div>
      )}
    </Form>
  );
};

export default ConsultationForm;
