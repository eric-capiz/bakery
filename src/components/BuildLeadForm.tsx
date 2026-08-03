import { useState, FormEvent, useEffect } from "react";
import { Button, Form, FormGroup, Input } from "reactstrap";
import { FaUser, FaEnvelope, FaPhone, FaComments } from "react-icons/fa";
import { BsCake } from "react-icons/bs";
import {
  MAX_BUILD_NOTES_LENGTH,
  BUILD_SUCCESS_TO_BUILDER_DELAY_MS,
} from "../../lib/constants";

export type BuildLeadCompletePayload = {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
};

type BuildLeadFormProps = {
  onLeadComplete?: (data: BuildLeadCompletePayload) => void;
  onDirtyChange?: (dirty: boolean) => void;
  defaultLead?: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  };
  existingBuildRequestId?: string | null;
};

const BuildLeadForm = ({
  onLeadComplete,
  onDirtyChange,
  defaultLead,
  existingBuildRequestId,
}: BuildLeadFormProps) => {
  const [name, setName] = useState(defaultLead?.name ?? "");
  const [email, setEmail] = useState(defaultLead?.email ?? "");
  const [phone, setPhone] = useState(defaultLead?.phone ?? "");
  const [notes, setNotes] = useState(defaultLead?.notes ?? "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (defaultLead) {
      setName(defaultLead.name);
      setEmail(defaultLead.email);
      setPhone(defaultLead.phone);
      setNotes(defaultLead.notes);
      onDirtyChange?.(false);
    }
  }, [defaultLead, onDirtyChange]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Add your name, email, and phone so we can get back to you.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        notes: notes.trim() || undefined,
        design: {},
      };

      const isUpdate =
        Boolean(existingBuildRequestId) && existingBuildRequestId !== null;

      const res = await fetch(
        isUpdate ? "/api/build-requests/update" : "/api/build-requests/submit",
        {
          method: isUpdate ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isUpdate
              ? { id: existingBuildRequestId, ...payload }
              : payload
          ),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          typeof data.error === "string"
            ? data.error
            : "Something went wrong. Please try again."
        );
        return;
      }
      const id = typeof data.id === "string" ? data.id : "";
      if (!id) {
        setError("Something went wrong. Please try again.");
        return;
      }

      const snapshot: BuildLeadCompletePayload = {
        id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        notes: notes.trim(),
      };

      onLeadComplete?.(snapshot);
      onDirtyChange?.(false);
      setSuccess(true);

      if (!onLeadComplete) {
        setName("");
        setEmail("");
        setPhone("");
        setNotes("");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form className="consultation-form build-lead-form" onSubmit={handleSubmit}>
      <p className="build-field-legend">
        <BsCake className="build-field-legend-cake" aria-hidden />
        <span>
          A bloom marks each line we use to know who you are and how to reach
          you once you send this.
        </span>
      </p>

      <FormGroup className="input-group build-field-row-for-reply">
        <div className="icon-input icon-input--required-hint">
          <FaUser className="input-icon" aria-hidden />
          <Input
            type="text"
            name="name"
            value={name}
            onChange={(ev) => {
              setName(ev.target.value);
              onDirtyChange?.(true);
            }}
            placeholder="Your name"
            required
            autoComplete="name"
          />
          <span
            className="field-required-cake"
            title="How we greet you when we respond"
          >
            <BsCake aria-hidden />
          </span>
        </div>
      </FormGroup>

      <FormGroup className="input-group build-field-row-for-reply">
        <div className="icon-input icon-input--required-hint">
          <FaEnvelope className="input-icon" aria-hidden />
          <Input
            type="email"
            name="email"
            value={email}
            onChange={(ev) => {
              setEmail(ev.target.value);
              onDirtyChange?.(true);
            }}
            placeholder="Your email"
            required
            autoComplete="email"
          />
          <span
            className="field-required-cake"
            title="Where we send your reply"
          >
            <BsCake aria-hidden />
          </span>
        </div>
      </FormGroup>

      <FormGroup className="input-group build-field-row-for-reply">
        <div className="icon-input icon-input--required-hint">
          <FaPhone className="input-icon" aria-hidden />
          <Input
            type="tel"
            name="phone"
            value={phone}
            onChange={(ev) => {
              setPhone(ev.target.value);
              onDirtyChange?.(true);
            }}
            placeholder="Your phone number"
            required
            autoComplete="tel"
          />
          <span
            className="field-required-cake"
            title="Another way to reach you if email is slow"
          >
            <BsCake aria-hidden />
          </span>
        </div>
      </FormGroup>

      <FormGroup className="input-group">
        <div className="icon-input icon-input-textarea">
          <FaComments className="input-icon" aria-hidden />
          <Input
            type="textarea"
            name="notes"
            value={notes}
            onChange={(ev) => {
              setNotes(ev.target.value);
              onDirtyChange?.(true);
            }}
            placeholder="Optional: palette, date needed, venue, stem preferences, inspiration links, etc."
            maxLength={MAX_BUILD_NOTES_LENGTH}
            rows={5}
          />
          <div className="build-lead-char-count" aria-live="polite">
            {notes.length} / {MAX_BUILD_NOTES_LENGTH}
          </div>
        </div>
      </FormGroup>

      {error ? (
        <p className="build-lead-form-error" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="build-lead-form-success" role="status">
          Got it. Your contact details are saved for this build. The designer
          opens in about{" "}
          {Math.round(BUILD_SUCCESS_TO_BUILDER_DELAY_MS / 1000)} seconds.
        </p>
      ) : null}

      <Button
        type="submit"
        color="primary"
        disabled={isSubmitting || success}
      >
        {isSubmitting ? "Sending…" : "Submit"}
      </Button>
    </Form>
  );
};

export default BuildLeadForm;
