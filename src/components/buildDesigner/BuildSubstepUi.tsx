import type { ReactNode } from "react";
import { FormGroup, Input, Label } from "reactstrap";
import type { FlavorOption } from "../../../lib/buildCatalog";

type SubstepBlockProps = {
  step: number;
  title: string;
  lead?: string;
  children: ReactNode;
};

export function BuildSubstepBlock({
  step,
  title,
  lead,
  children,
}: SubstepBlockProps) {
  return (
    <div className="build-designer-substep">
      <h4 className="build-designer-substep-title">
        Step {step}: {title}
      </h4>
      {lead ? (
        <p className="build-designer-substep-lead">{lead}</p>
      ) : null}
      {children}
    </div>
  );
}

type SelectProps = {
  id: string;
  ariaLabel: string;
  value: string;
  onChange: (v: string) => void;
  options: FlavorOption[];
  placeholder?: string;
};

export function BuildSelect({
  id,
  ariaLabel,
  value,
  onChange,
  options,
  placeholder,
}: SelectProps) {
  return (
    <FormGroup className="build-substep-form-group">
      <Label className="build-substep-label sr-only" for={id}>
        {ariaLabel}
      </Label>
      <Input
        id={id}
        type="select"
        bsSize="lg"
        className="build-substep-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder ?? "Choose one…"}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Input>
    </FormGroup>
  );
}

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "number" | "date";
  placeholder?: string;
  min?: number;
  max?: number;
  maxLength?: number;
  rows?: number;
};

export function BuildTextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  min,
  max,
  maxLength,
  rows,
}: TextFieldProps) {
  const control =
    rows != null ? (
      <Input
        id={id}
        name={id}
        type="textarea"
        rows={rows}
        className="build-substep-textarea"
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <div className="build-substep-control-wrap">
        <Input
          id={id}
          name={id}
          type={type}
          bsSize="lg"
          className="build-substep-input build-substep-input--single-line"
          value={value}
          placeholder={placeholder}
          min={min}
          max={max}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );

  return (
    <FormGroup className="build-substep-form-group">
      <Label className="build-substep-visible-label" for={id}>
        {label}
      </Label>
      {control}
    </FormGroup>
  );
}

type CheckboxGroupProps = {
  "aria-label": string;
  options: FlavorOption[];
  values: string[];
  onToggle: (value: string) => void;
  namePrefix: string;
};

type SectionNoticeProps = {
  text: string;
};

/** Single notice for a whole checkbox substep (avoids repeating under each row). */
export function BuildCheckboxSectionNotice({ text }: SectionNoticeProps) {
  return (
    <p className="build-checkbox-section-notice" role="note">
      {text}
    </p>
  );
}

type OptionalContinueProps = {
  label: string;
  onContinue: () => void;
};

export function BuildOptionalContinue({
  label,
  onContinue,
}: OptionalContinueProps) {
  return (
    <button
      type="button"
      className="build-substep-continue-btn"
      onClick={onContinue}
    >
      {label}
    </button>
  );
}

export function BuildCheckboxGroup({
  "aria-label": ariaLabel,
  options,
  values,
  onToggle,
  namePrefix,
}: CheckboxGroupProps) {
  return (
    <div
      className="build-checkbox-group"
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((o) => {
        const cid = `${namePrefix}-${o.value}`;
        return (
          <label key={o.value} className="build-checkbox-row" htmlFor={cid}>
            <Input
              id={cid}
              type="checkbox"
              className="build-checkbox-input"
              checked={values.includes(o.value)}
              onChange={() => onToggle(o.value)}
            />
            <span className="build-checkbox-text">
              <span className="build-checkbox-label">{o.label}</span>
            </span>
          </label>
        );
      })}
    </div>
  );
}
