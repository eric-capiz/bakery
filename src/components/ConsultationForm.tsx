import { useState, useEffect, FormEvent } from "react";
import { Button, Form, FormGroup, Input } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaCalendar,
  FaClock,
  FaLeaf,
  FaMapMarkerAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaComments,
  FaHome,
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
    if (submitStatus === "idle") return;
    const timer = setTimeout(() => setSubmitStatus("idle"), 5000);
    return () => clearTimeout(timer);
  }, [submitStatus]);

  const handleConsultationChange = (
    field: keyof ConsultationData,
    value: string | Date | null
  ) => {
    setConsultation((prev) => ({ ...prev, [field]: value }));
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
    formData.append("service", consultation.eventType);
    formData.append("scope", consultation.guestCount);
    formData.append("address", consultation.budget);
    formData.append("message", consultation.message);
    formData.append(
      "_subject",
      `ELLIS visit request from ${consultation.name}`
    );

    try {
      const response = await fetch("https://formsubmit.co/ericcapiz@gmail.com", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
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
        throw new Error("failed");
      }
    } catch {
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
            value={consultation.name}
            onChange={(e) => handleConsultationChange("name", e.target.value)}
            placeholder="Name"
            required
          />
        </div>
      </FormGroup>
      <FormGroup className="input-group">
        <div className="icon-input">
          <FaEnvelope className="input-icon" />
          <Input
            type="email"
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
            value={consultation.time}
            onChange={(e) => handleConsultationChange("time", e.target.value)}
            required
          >
            <option value="">Preferred window</option>
            <option value="morning">Morning</option>
            <option value="midday">Midday</option>
            <option value="afternoon">Afternoon</option>
          </Input>
        </div>
      </FormGroup>
      <FormGroup className="input-group">
        <div className="icon-input">
          <FaLeaf className="input-icon" />
          <Input
            type="select"
            value={consultation.eventType}
            onChange={(e) =>
              handleConsultationChange("eventType", e.target.value)
            }
            required
          >
            <option value="">Interest</option>
            <option value="grounds">Grounds / lawn</option>
            <option value="surface">Exterior wash</option>
            <option value="vehicle">Mobile detailing</option>
            <option value="combined">Combined care</option>
          </Input>
        </div>
      </FormGroup>
      <FormGroup className="input-group">
        <div className="icon-input">
          <FaMapMarkerAlt className="input-icon" />
          <Input
            type="select"
            value={consultation.guestCount}
            onChange={(e) =>
              handleConsultationChange("guestCount", e.target.value)
            }
            required
          >
            <option value="">Property scale</option>
            <option value="compact">Compact lot</option>
            <option value="standard">Standard lot</option>
            <option value="estate">Larger property</option>
            <option value="vehicles">Vehicles only</option>
          </Input>
        </div>
      </FormGroup>
      <FormGroup className="input-group">
        <div className="icon-input">
          <FaHome className="input-icon" />
          <Input
            type="text"
            value={consultation.budget}
            onChange={(e) => handleConsultationChange("budget", e.target.value)}
            placeholder="Address or ZIP"
            required
          />
        </div>
      </FormGroup>
      <FormGroup className="input-group">
        <div className="icon-input">
          <FaComments className="input-icon" />
          <Input
            type="textarea"
            value={consultation.message}
            onChange={(e) =>
              handleConsultationChange("message", e.target.value)
            }
            placeholder="Notes for the visit"
            required
          />
        </div>
      </FormGroup>
      <Button type="submit" color="primary" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send request"}
      </Button>
      {submitStatus === "success" && (
        <div className="success-message">
          Received. We will confirm timing and a range shortly.
        </div>
      )}
      {submitStatus === "error" && (
        <div className="error-message">
          Something went wrong. Please try again or call the studio.
        </div>
      )}
    </Form>
  );
};

export default ConsultationForm;
