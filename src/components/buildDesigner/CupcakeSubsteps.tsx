import { MAX_BUILD_CAKE_MESSAGE_LENGTH } from "../../../lib/constants";
import {
  CAKE_CUPCAKE_DECORATION_OPTIONS,
  CHECKBOX_WITH_DETAIL_TEXTAREA_NOTICE,
  FROSTING_OPTIONS,
} from "../../../lib/buildCatalog";
import { showCupcakeTailStep } from "../../../lib/buildStepGates";
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

export function CupcakeSubsteps({ state, patch }: Props) {
  const toggleTop = (id: string) =>
    patch({
      cupcakeToppings: toggleIdInList(state.cupcakeToppings, id),
      cupcakeAckNoDecor: false,
    });

  return (
    <>
      {showCupcakeTailStep(3, state) ? (
        <BuildSubstepBlock
          step={3}
          title="Quantity"
          lead="How many cupcakes (approximate count)?"
        >
          <BuildTextField
            id="cupcake-qty"
            label="Count"
            type="number"
            min={1}
            max={500}
            value={state.cupcakeQuantity}
            onChange={(v) => patch({ cupcakeQuantity: v })}
            placeholder="e.g. 24"
          />
        </BuildSubstepBlock>
      ) : null}

      {showCupcakeTailStep(4, state) ? (
        <BuildSubstepBlock step={4} title="Frosting" lead="Style for the tops.">
          <BuildSelect
            id="cupcake-frosting"
            ariaLabel="Frosting"
            value={state.cupcakeFrosting}
            onChange={(v) => patch({ cupcakeFrosting: v })}
            options={FROSTING_OPTIONS}
          />
        </BuildSubstepBlock>
      ) : null}

      {showCupcakeTailStep(5, state) ? (
        <BuildSubstepBlock
          step={5}
          title="Toppings and decorations"
          lead="Select any that apply."
        >
          <BuildCheckboxSectionNotice
            text={CHECKBOX_WITH_DETAIL_TEXTAREA_NOTICE}
          />
          <BuildCheckboxGroup
            aria-label="Cupcake decorations"
            namePrefix="cupcake-dec"
            options={CAKE_CUPCAKE_DECORATION_OPTIONS}
            values={state.cupcakeToppings}
            onToggle={toggleTop}
          />
          <BuildTextField
            id="cupcake-dec-notes"
            label="Describe the look (optional)"
            value={state.cupcakeToppingsNotes}
            onChange={(v) =>
              patch({ cupcakeToppingsNotes: v, cupcakeAckNoDecor: false })
            }
            rows={3}
            placeholder="Extra detail"
          />
          <BuildOptionalContinue
            label="No extra decorations — continue"
            onContinue={() =>
              patch({
                cupcakeAckNoDecor: true,
                cupcakeToppings: [],
                cupcakeToppingsNotes: "",
              })
            }
          />
        </BuildSubstepBlock>
      ) : null}

      {showCupcakeTailStep(6, state) ? (
        <BuildSubstepBlock
          step={6}
          title="Message or topper text"
          lead="Optional short line for picks or a tag."
        >
          <BuildTextField
            id="cupcake-message"
            label="Message"
            value={state.cupcakeMessage}
            onChange={(v) =>
              patch({ cupcakeMessage: v, cupcakeAckNoMessage: false })
            }
            maxLength={MAX_BUILD_CAKE_MESSAGE_LENGTH}
            placeholder="e.g. Team Sarah"
          />
          <BuildOptionalContinue
            label="No message — continue"
            onContinue={() =>
              patch({ cupcakeAckNoMessage: true, cupcakeMessage: "" })
            }
          />
        </BuildSubstepBlock>
      ) : null}

      {showCupcakeTailStep(7, state) ? (
        <BuildSubstepBlock step={7} title="Needed-by date">
          <BuildTextField
            id="cupcake-event-date"
            label="Date needed"
            type="date"
            value={state.cupcakeEventDate}
            onChange={(v) => patch({ cupcakeEventDate: v })}
          />
        </BuildSubstepBlock>
      ) : null}

      {showCupcakeTailStep(8, state) ? (
        <BuildSubstepBlock step={8} title="Dietary and allergies">
          <BuildTextField
            id="cupcake-dietary"
            label="Dietary needs or allergies"
            value={state.cupcakeDietary}
            onChange={(v) =>
              patch({ cupcakeDietary: v, cupcakeAckNoDietary: false })
            }
            rows={3}
            placeholder="e.g. nut-free"
          />
          <BuildOptionalContinue
            label="Nothing to note — continue"
            onContinue={() =>
              patch({ cupcakeAckNoDietary: true, cupcakeDietary: "" })
            }
          />
        </BuildSubstepBlock>
      ) : null}
    </>
  );
}
