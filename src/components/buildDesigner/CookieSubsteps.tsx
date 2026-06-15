import {
  CHECKBOX_WITH_DETAIL_TEXTAREA_NOTICE,
  COOKIE_MIXIN_OPTIONS,
  COOKIE_PACKAGING_OPTIONS,
} from "../../../lib/buildCatalog";
import { showCookieTailStep } from "../../../lib/buildStepGates";
import type { BuildDesignerFormState } from "../../../lib/buildDesignerState";
import { toggleIdInList } from "../../../lib/buildDesignerState";
import {
  BuildCheckboxGroup,
  BuildCheckboxSectionNotice,
  BuildOptionalContinue,
  BuildSelect,
  BuildSubstepBlock,
  BuildTextField,
} from "./BuildSubstepUi";

type Patch = Partial<BuildDesignerFormState>;

type Props = {
  state: BuildDesignerFormState;
  patch: (p: Patch) => void;
};

export function CookieSubsteps({ state, patch }: Props) {
  const toggleMixin = (id: string) =>
    patch({
      cookieMixins: toggleIdInList(state.cookieMixins, id),
      cookieAckNoMixins: false,
    });

  return (
    <>
      {showCookieTailStep(3, state) ? (
        <BuildSubstepBlock
          step={3}
          title="Quantity"
          lead="Roughly how many cookies (in dozens)?"
        >
          <BuildTextField
            id="cookie-dozen"
            label="Dozens"
            type="number"
            min={1}
            max={99}
            value={state.cookieQuantityDozen}
            onChange={(v) => patch({ cookieQuantityDozen: v })}
            placeholder="e.g. 2"
          />
        </BuildSubstepBlock>
      ) : null}

      {showCookieTailStep(4, state) ? (
        <BuildSubstepBlock
          step={4}
          title="Mix-ins and finish"
          lead="Select add-ons; use the notes box for combinations."
        >
          <BuildCheckboxSectionNotice
            text={CHECKBOX_WITH_DETAIL_TEXTAREA_NOTICE}
          />
          <BuildCheckboxGroup
            aria-label="Cookie mix-ins"
            namePrefix="cookie-mix"
            options={COOKIE_MIXIN_OPTIONS}
            values={state.cookieMixins}
            onToggle={toggleMixin}
          />
          <BuildTextField
            id="cookie-mix-notes"
            label="More detail (optional)"
            value={state.cookieMixinsNotes}
            onChange={(v) =>
              patch({ cookieMixinsNotes: v, cookieAckNoMixins: false })
            }
            rows={3}
            placeholder="Half with nuts, half plain, etc."
          />
          <BuildOptionalContinue
            label="No mix-ins — continue"
            onContinue={() =>
              patch({
                cookieAckNoMixins: true,
                cookieMixins: [],
                cookieMixinsNotes: "",
              })
            }
          />
        </BuildSubstepBlock>
      ) : null}

      {showCookieTailStep(5, state) ? (
        <BuildSubstepBlock
          step={5}
          title="Packaging"
          lead="How should they be packed?"
        >
          <BuildSelect
            id="cookie-packaging"
            ariaLabel="Packaging"
            value={state.cookiePackaging}
            onChange={(v) => patch({ cookiePackaging: v })}
            options={COOKIE_PACKAGING_OPTIONS}
          />
        </BuildSubstepBlock>
      ) : null}

      {showCookieTailStep(6, state) ? (
        <BuildSubstepBlock
          step={6}
          title="Occasion note"
          lead="Optional short message or occasion."
        >
          <BuildTextField
            id="cookie-occasion"
            label="Occasion or message"
            value={state.cookieOccasionNote}
            onChange={(v) =>
              patch({ cookieOccasionNote: v, cookieAckNoOccasion: false })
            }
            placeholder="e.g. Office party Friday"
          />
          <BuildOptionalContinue
            label="No occasion note — continue"
            onContinue={() =>
              patch({ cookieAckNoOccasion: true, cookieOccasionNote: "" })
            }
          />
        </BuildSubstepBlock>
      ) : null}

      {showCookieTailStep(7, state) ? (
        <BuildSubstepBlock
          step={7}
          title="Needed-by date"
          lead="When do you need them?"
        >
          <BuildTextField
            id="cookie-event-date"
            label="Date needed"
            type="date"
            value={state.cookieEventDate}
            onChange={(v) => patch({ cookieEventDate: v })}
          />
        </BuildSubstepBlock>
      ) : null}

      {showCookieTailStep(8, state) ? (
        <BuildSubstepBlock
          step={8}
          title="Dietary and allergies"
          lead="Important for safety."
        >
          <BuildTextField
            id="cookie-dietary"
            label="Dietary needs or allergies"
            value={state.cookieDietary}
            onChange={(v) =>
              patch({ cookieDietary: v, cookieAckNoDietary: false })
            }
            rows={3}
            placeholder="e.g. nut-free"
          />
          <BuildOptionalContinue
            label="Nothing to note — continue"
            onContinue={() =>
              patch({ cookieAckNoDietary: true, cookieDietary: "" })
            }
          />
        </BuildSubstepBlock>
      ) : null}
    </>
  );
}
