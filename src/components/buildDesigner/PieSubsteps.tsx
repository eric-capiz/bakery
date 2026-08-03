import {
  CHECKBOX_LEAD_NOTES_SECTION_NOTICE,
  PIE_FINISH_OPTIONS,
  PIE_SIZE_OPTIONS,
} from "../../../lib/buildCatalog";
import { showPieTailStep } from "../../../lib/buildStepGates";
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

export function PieSubsteps({ state, patch }: Props) {
  const toggleFinish = (id: string) =>
    patch({
      pieFinish: toggleIdInList(state.pieFinish, id),
      pieAckNoFinish: false,
    });

  return (
    <>
      {showPieTailStep(3, state) ? (
        <BuildSubstepBlock step={3} title="Pie size" lead="Whole pie size.">
          <BuildSelect
            id="pie-size"
            ariaLabel="Pie size"
            value={state.pieSize}
            onChange={(v) => patch({ pieSize: v })}
            options={PIE_SIZE_OPTIONS}
          />
        </BuildSubstepBlock>
      ) : null}

      {showPieTailStep(4, state) ? (
        <BuildSubstepBlock
          step={4}
          title="Crust and topping style"
          lead="How should the top look or be finished?"
        >
          <BuildCheckboxSectionNotice
            text={CHECKBOX_LEAD_NOTES_SECTION_NOTICE}
          />
          <BuildCheckboxGroup
            aria-label="Pie finish options"
            namePrefix="pie-fin"
            options={PIE_FINISH_OPTIONS}
            values={state.pieFinish}
            onToggle={toggleFinish}
          />
          <BuildOptionalContinue
            label="No preference — continue"
            onContinue={() =>
              patch({ pieAckNoFinish: true, pieFinish: [] })
            }
          />
        </BuildSubstepBlock>
      ) : null}

      {showPieTailStep(5, state) ? (
        <BuildSubstepBlock
          step={5}
          title="Colors / theme"
          lead="Optional: colors, ribbon, or party vibe."
        >
          <BuildTextField
            id="pie-theme"
            label="Theme (optional)"
            value={state.pieColorsTheme}
            onChange={(v) =>
              patch({ pieColorsTheme: v, pieAckNoTheme: false })
            }
            placeholder="e.g. rustic fall"
          />
          <BuildOptionalContinue
            label="No theme — continue"
            onContinue={() =>
              patch({ pieAckNoTheme: true, pieColorsTheme: "" })
            }
          />
        </BuildSubstepBlock>
      ) : null}

      {showPieTailStep(6, state) ? (
        <BuildSubstepBlock
          step={6}
          title="Needed-by date"
          lead="Event or pickup timing."
        >
          <BuildTextField
            id="pie-event-date"
            label="Date needed"
            type="date"
            value={state.pieEventDate}
            onChange={(v) => patch({ pieEventDate: v })}
          />
        </BuildSubstepBlock>
      ) : null}

      {showPieTailStep(7, state) ? (
        <BuildSubstepBlock step={7} title="Dietary and allergies">
          <BuildTextField
            id="pie-dietary"
            label="Dietary needs or allergies"
            value={state.pieDietary}
            onChange={(v) =>
              patch({ pieDietary: v, pieAckNoDietary: false })
            }
            rows={3}
            placeholder="e.g. gluten-free request"
          />
          <BuildOptionalContinue
            label="Nothing to note — continue"
            onContinue={() =>
              patch({ pieAckNoDietary: true, pieDietary: "" })
            }
          />
        </BuildSubstepBlock>
      ) : null}
    </>
  );
}
