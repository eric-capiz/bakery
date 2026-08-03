import {
  BROWNIE_PAN_OPTIONS,
  BROWNIE_TOPPING_OPTIONS,
  CHECKBOX_WITH_DETAIL_TEXTAREA_NOTICE,
} from "../../../lib/buildCatalog";
import { showBrownieTailStep } from "../../../lib/buildStepGates";
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

export function BrownieSubsteps({ state, patch }: Props) {
  const toggleTop = (id: string) =>
    patch({
      brownieToppings: toggleIdInList(state.brownieToppings, id),
      brownieAckNoToppings: false,
    });

  return (
    <>
      {showBrownieTailStep(3, state) ? (
        <BuildSubstepBlock
          step={3}
          title="Quantity"
          lead="Number of pieces or batches (estimate is fine)."
        >
          <BuildTextField
            id="brownie-qty"
            label="Quantity"
            type="number"
            min={1}
            max={999}
            value={state.brownieQuantity}
            onChange={(v) => patch({ brownieQuantity: v })}
            placeholder="e.g. 12 or 24"
          />
        </BuildSubstepBlock>
      ) : null}

      {showBrownieTailStep(4, state) ? (
        <BuildSubstepBlock
          step={4}
          title="Pan size"
          lead="Typical tray size if you know it."
        >
          <BuildSelect
            id="brownie-pan"
            ariaLabel="Pan size"
            value={state.browniePanSize}
            onChange={(v) => patch({ browniePanSize: v })}
            options={BROWNIE_PAN_OPTIONS}
          />
        </BuildSubstepBlock>
      ) : null}

      {showBrownieTailStep(5, state) ? (
        <BuildSubstepBlock
          step={5}
          title="Toppings or finish"
          lead="Choose each topping you want; add the detail box when the type matters (ganache vs buttercream frosting, thick vs light drizzle, which nuts, etc.)."
        >
          <BuildCheckboxSectionNotice
            text={CHECKBOX_WITH_DETAIL_TEXTAREA_NOTICE}
          />
          <BuildCheckboxGroup
            aria-label="Brownie toppings"
            namePrefix="brownie-top"
            options={BROWNIE_TOPPING_OPTIONS}
            values={state.brownieToppings}
            onToggle={toggleTop}
          />
          <BuildTextField
            id="brownie-toppings-notes"
            label="Topping details (optional)"
            value={state.brownieToppingsNotes}
            onChange={(v) =>
              patch({ brownieToppingsNotes: v, brownieAckNoToppings: false })
            }
            rows={3}
            placeholder="e.g. dark chocolate drizzle, buttercream not ganache, pecans only"
          />
          <BuildOptionalContinue
            label="Plain / no toppings — continue"
            onContinue={() =>
              patch({
                brownieAckNoToppings: true,
                brownieToppings: [],
                brownieToppingsNotes: "",
              })
            }
          />
        </BuildSubstepBlock>
      ) : null}

      {showBrownieTailStep(6, state) ? (
        <BuildSubstepBlock step={6} title="Needed-by date">
          <BuildTextField
            id="brownie-event-date"
            label="Date needed"
            type="date"
            value={state.brownieEventDate}
            onChange={(v) => patch({ brownieEventDate: v })}
          />
        </BuildSubstepBlock>
      ) : null}

      {showBrownieTailStep(7, state) ? (
        <BuildSubstepBlock step={7} title="Dietary and allergies">
          <BuildTextField
            id="brownie-dietary"
            label="Dietary needs or allergies"
            value={state.brownieDietary}
            onChange={(v) =>
              patch({ brownieDietary: v, brownieAckNoDietary: false })
            }
            rows={3}
            placeholder="e.g. nut-free"
          />
          <BuildOptionalContinue
            label="Nothing to note — continue"
            onContinue={() =>
              patch({ brownieAckNoDietary: true, brownieDietary: "" })
            }
          />
        </BuildSubstepBlock>
      ) : null}
    </>
  );
}
