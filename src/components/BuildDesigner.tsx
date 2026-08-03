import { useCallback, useState, type ComponentType } from "react";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { BsCake } from "react-icons/bs";
import { FaCookie } from "react-icons/fa";
import { GiChocolateBar, GiCupcake, GiPieSlice } from "react-icons/gi";
import { BrownieSubsteps } from "./buildDesigner/BrownieSubsteps";
import { CakeSubsteps } from "./buildDesigner/CakeSubsteps";
import { CookieSubsteps } from "./buildDesigner/CookieSubsteps";
import { CupcakeSubsteps } from "./buildDesigner/CupcakeSubsteps";
import { PieSubsteps } from "./buildDesigner/PieSubsteps";
import { getFirstSubstepMeta } from "../../lib/buildCatalog";
import {
  isDesignerFlowComplete,
  isLastTailStepVisible,
} from "../../lib/buildStepGates";
import {
  clearedAckPatches,
  createEmptyDesignerState,
  serializeBuildDesignForSelectedPastry,
  type BuildDesignerFormState,
} from "../../lib/buildDesignerState";
import {
  PASTRY_LABELS,
  PASTRY_TYPES,
  type PastryType,
} from "../../lib/pastryTypes";

export type BuildLeadSnapshot = {
  name: string;
  email: string;
  phone: string;
  notes: string;
};

type BuildDesignerProps = {
  buildRequestId: string;
  lead: BuildLeadSnapshot;
  onEditContact: () => void;
};

const PASTRY_ICONS: Record<
  PastryType,
  ComponentType<{ className?: string; "aria-hidden"?: boolean }>
> = {
  cake: BsCake,
  cookie: FaCookie,
  pie: GiPieSlice,
  cupcake: GiCupcake,
  brownie: GiChocolateBar,
};

const BuildDesigner = ({
  buildRequestId,
  lead,
  onEditContact,
}: BuildDesignerProps) => {
  const [form, setForm] = useState<BuildDesignerFormState>(() =>
    createEmptyDesignerState()
  );
  const selectPastry = useCallback((id: PastryType) => {
    setForm({ ...createEmptyDesignerState(), pastryType: id });
  }, []);

  const patch = useCallback((p: Partial<BuildDesignerFormState>) => {
    setForm((s) => ({ ...s, ...p }));
  }, []);

  const { pastryType, primaryFlavor } = form;
  const firstMeta = pastryType ? getFirstSubstepMeta(pastryType) : null;
  const primaryLabel =
    firstMeta && primaryFlavor
      ? firstMeta.options.find((o) => o.value === primaryFlavor)?.label
      : null;

  const showTailSteps = Boolean(pastryType && primaryFlavor);
  const flowComplete = isDesignerFlowComplete(form);
  const lastStepVisible = isLastTailStepVisible(form);
  const showSubmitArea = showTailSteps && lastStepVisible;
  const canSubmit = flowComplete && Boolean(buildRequestId);

  const handleSubmitBuild = useCallback(() => {
    if (!buildRequestId || !isDesignerFlowComplete(form)) return;
    const payload = {
      id: buildRequestId,
      name: lead.name.trim(),
      email: lead.email.trim(),
      phone: lead.phone.trim(),
      notes: lead.notes.trim() || undefined,
      design: serializeBuildDesignForSelectedPastry(form),
    };
    // TODO: PATCH /api/build-requests/update when build submit is finalized
    console.log("[Build] submit payload (dev)", payload);
  }, [buildRequestId, form, lead]);

  return (
    <div className="build-designer">
      <div className="build-designer-summary">
        <h2 className="build-designer-summary-title">Your details</h2>
        <dl className="build-designer-dl">
          <div className="build-designer-dl-row">
            <dt>Name</dt>
            <dd>{lead.name}</dd>
          </div>
          <div className="build-designer-dl-row">
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${encodeURIComponent(lead.email)}`}>
                {lead.email}
              </a>
            </dd>
          </div>
          <div className="build-designer-dl-row">
            <dt>Phone</dt>
            <dd>
              <a href={`tel:${lead.phone.replace(/\s/g, "")}`}>{lead.phone}</a>
            </dd>
          </div>
          <div className="build-designer-dl-row build-designer-dl-row-notes">
            <dt>Notes</dt>
            <dd>
              {lead.notes.trim() ? lead.notes : "None added yet"}
            </dd>
          </div>
        </dl>
        <button
          type="button"
          className="build-designer-edit-contact"
          onClick={onEditContact}
        >
          Edit contact details
        </button>
      </div>

      <div className="build-designer-work">
        <h3 className="build-designer-step-title">Step 1: Arrangement style</h3>
        <p className="build-designer-step-lead">
          Choose a starting style for your bouquet or arrangement. Next you will
          add details step by step.
        </p>
        <div
          className="build-pastry-grid"
          role="group"
          aria-label="Arrangement style"
        >
          {PASTRY_TYPES.map((id) => {
            const Icon = PASTRY_ICONS[id];
            const label = PASTRY_LABELS[id];
            const selected = pastryType === id;
            return (
              <button
                key={id}
                type="button"
                className={
                  "build-pastry-card" +
                  (selected ? " build-pastry-card--selected" : "")
                }
                onClick={() => selectPastry(id)}
                aria-pressed={selected}
              >
                <Icon className="build-pastry-card-icon" aria-hidden />
                <span className="build-pastry-card-label">{label}</span>
              </button>
            );
          })}
        </div>

        {pastryType && firstMeta ? (
          <div className="build-designer-substep">
            <h4 className="build-designer-substep-title">
              Step 2: {firstMeta.title}
            </h4>
            <p className="build-designer-substep-lead">{firstMeta.lead}</p>
            <FormGroup className="build-substep-form-group">
              <Label
                className="build-substep-label sr-only"
                for="build-primary-flavor"
              >
                {firstMeta.title}
              </Label>
              <Input
                id="build-primary-flavor"
                name="primaryFlavor"
                type="select"
                bsSize="lg"
                className="build-substep-select"
                value={primaryFlavor}
                onChange={(e) =>
                  patch({
                    primaryFlavor: e.target.value,
                    ...clearedAckPatches(),
                  })
                }
              >
                <option value="">Choose one…</option>
                {firstMeta.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </div>
        ) : null}

        {pastryType ? (
          <p
            className={
              "build-designer-selection-hint" +
              (showTailSteps ? " build-designer-selection-hint--before-tail" : "")
            }
            role="status"
          >
            Selected style: <strong>{PASTRY_LABELS[pastryType]}</strong>
            {primaryLabel ? (
              <>
                {" · "}
                <strong>{primaryLabel}</strong>
              </>
            ) : (
              <span className="build-designer-selection-hint-muted">
                {" "}
               , pick a variety in step 2 to continue.
              </span>
            )}
          </p>
        ) : null}

        {showTailSteps && pastryType === "cake" ? (
          <CakeSubsteps state={form} patch={patch} />
        ) : null}
        {showTailSteps && pastryType === "cookie" ? (
          <CookieSubsteps state={form} patch={patch} />
        ) : null}
        {showTailSteps && pastryType === "pie" ? (
          <PieSubsteps state={form} patch={patch} />
        ) : null}
        {showTailSteps && pastryType === "cupcake" ? (
          <CupcakeSubsteps state={form} patch={patch} />
        ) : null}
        {showTailSteps && pastryType === "brownie" ? (
          <BrownieSubsteps state={form} patch={patch} />
        ) : null}

        {showSubmitArea ? (
          <div className="build-designer-submit-area build-designer-submit-area--with-last-step">
            <p className="build-designer-submit-lead">
              Finish the step above, then send your arrangement choices with the
              same contact details we have for this design.
            </p>
            <Button
              type="button"
              color="primary"
              className="build-designer-submit-btn"
              disabled={!canSubmit}
              onClick={handleSubmitBuild}
            >
              View my build
            </Button>
            {!flowComplete ? (
              <p className="build-designer-submit-hint">
                Complete this step to enable submit.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BuildDesigner;
