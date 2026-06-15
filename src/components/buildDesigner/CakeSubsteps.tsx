import { MAX_BUILD_CAKE_MESSAGE_LENGTH } from "../../../lib/constants";
import {
  CAKE_FILLING_OPTIONS,
  CAKE_CUPCAKE_DECORATION_OPTIONS,
  CHECKBOX_WITH_DETAIL_TEXTAREA_NOTICE,
  FROSTING_OPTIONS,
} from "../../../lib/buildCatalog";
import { showCakeTailStep } from "../../../lib/buildStepGates";
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

export function CakeSubsteps({ state, patch }: Props) {
  const toggleTopping = (id: string) =>
    patch({
      cakeToppings: toggleIdInList(state.cakeToppings, id),
      cakeAckNoDecor: false,
    });

  return (
    <>
      {showCakeTailStep(3, state) ? (
        <BuildSubstepBlock
          step={3}
          title="Number of tiers"
          lead="Tiers are separate cakes stacked on top of each other (wedding-style tall cake). One tier means a single cake. Choose 2 or 3 only if you want that stacked look."
        >
          <BuildTextField
            id="cake-tiers"
            label="How many tiers"
            type="number"
            min={1}
            max={5}
            value={state.cakeTiers}
            onChange={(v) => patch({ cakeTiers: v })}
            placeholder="e.g. 1"
          />
        </BuildSubstepBlock>
      ) : null}

      {showCakeTailStep(4, state) ? (
        <BuildSubstepBlock
          step={4}
          title="Layers per tier"
          lead="Layers are the horizontal cake sheets inside each tier, with filling between—what you see when the cake is sliced. Different from tiers: tier count was step 3."
        >
          <BuildTextField
            id="cake-layers"
            label="Layers in each tier"
            type="number"
            min={2}
            max={6}
            value={state.cakeLayersPerTier}
            onChange={(v) => patch({ cakeLayersPerTier: v })}
            placeholder="e.g. 2 or 3"
          />
        </BuildSubstepBlock>
      ) : null}

      {showCakeTailStep(5, state) ? (
        <BuildSubstepBlock
          step={5}
          title="Size or servings"
          lead="Approximate guest count and/or standard size, if you know it."
        >
          <BuildTextField
            id="cake-size"
            label="Servings or size"
            value={state.cakeSizeOrServings}
            onChange={(v) => patch({ cakeSizeOrServings: v })}
            placeholder='e.g. ~24 guests or 8" round'
          />
        </BuildSubstepBlock>
      ) : null}

      {showCakeTailStep(6, state) ? (
        <BuildSubstepBlock
          step={6}
          title="Filling"
          lead="Between the cake layers."
        >
          <BuildSelect
            id="cake-filling"
            ariaLabel="Filling between layers"
            value={state.cakeFilling}
            onChange={(v) => patch({ cakeFilling: v })}
            options={CAKE_FILLING_OPTIONS}
          />
        </BuildSubstepBlock>
      ) : null}

      {showCakeTailStep(7, state) ? (
        <BuildSubstepBlock step={7} title="Frosting" lead="Outside finish.">
          <BuildSelect
            id="cake-frosting"
            ariaLabel="Frosting type"
            value={state.cakeFrosting}
            onChange={(v) => patch({ cakeFrosting: v })}
            options={FROSTING_OPTIONS}
          />
        </BuildSubstepBlock>
      ) : null}

      {showCakeTailStep(8, state) ? (
        <BuildSubstepBlock
          step={8}
          title="Colors / theme"
          lead="Optional: main colors or party theme."
        >
          <BuildTextField
            id="cake-colors"
            label="Colors or theme"
            value={state.cakeColorsTheme}
            onChange={(v) =>
              patch({ cakeColorsTheme: v, cakeAckNoTheme: false })
            }
            placeholder="e.g. blush pink and gold"
          />
          <BuildOptionalContinue
            label="No specific colors or theme — continue"
            onContinue={() =>
              patch({ cakeAckNoTheme: true, cakeColorsTheme: "" })
            }
          />
        </BuildSubstepBlock>
      ) : null}

      {showCakeTailStep(9, state) ? (
        <BuildSubstepBlock
          step={9}
          title="Toppings and decorations"
          lead="Select any that apply, then add detail if you like."
        >
          <BuildCheckboxSectionNotice
            text={CHECKBOX_WITH_DETAIL_TEXTAREA_NOTICE}
          />
          <BuildCheckboxGroup
            aria-label="Cake decorations"
            namePrefix="cake-dec"
            options={CAKE_CUPCAKE_DECORATION_OPTIONS}
            values={state.cakeToppings}
            onToggle={toggleTopping}
          />
          <BuildTextField
            id="cake-dec-notes"
            label="Describe the look (optional)"
            value={state.cakeToppingsNotes}
            onChange={(v) =>
              patch({ cakeToppingsNotes: v, cakeAckNoDecor: false })
            }
            rows={3}
            placeholder="Extra detail, inspiration, or ideas"
          />
          <BuildOptionalContinue
            label="No extra decorations — continue"
            onContinue={() =>
              patch({
                cakeAckNoDecor: true,
                cakeToppings: [],
                cakeToppingsNotes: "",
              })
            }
          />
        </BuildSubstepBlock>
      ) : null}

      {showCakeTailStep(10, state) ? (
        <BuildSubstepBlock
          step={10}
          title="Message on the cake"
          lead="Short wording; we will confirm spelling."
        >
          <BuildTextField
            id="cake-message"
            label="Inscription"
            value={state.cakeMessage}
            onChange={(v) =>
              patch({ cakeMessage: v, cakeAckNoMessage: false })
            }
            maxLength={MAX_BUILD_CAKE_MESSAGE_LENGTH}
            placeholder="e.g. Happy 30th Alex"
          />
          <BuildOptionalContinue
            label="No message on the cake — continue"
            onContinue={() =>
              patch({ cakeAckNoMessage: true, cakeMessage: "" })
            }
          />
        </BuildSubstepBlock>
      ) : null}

      {showCakeTailStep(11, state) ? (
        <BuildSubstepBlock
          step={11}
          title="Event or needed-by date"
          lead="Pickup or delivery timing can be finalized with the bakery."
        >
          <BuildTextField
            id="cake-event-date"
            label="Date needed"
            type="date"
            value={state.cakeEventDate}
            onChange={(v) => patch({ cakeEventDate: v })}
          />
        </BuildSubstepBlock>
      ) : null}

      {showCakeTailStep(12, state) ? (
        <BuildSubstepBlock
          step={12}
          title="Dietary and allergies"
          lead="Important for safety; add anything the bakery should know."
        >
          <BuildTextField
            id="cake-dietary"
            label="Dietary needs or allergies"
            value={state.cakeDietary}
            onChange={(v) =>
              patch({ cakeDietary: v, cakeAckNoDietary: false })
            }
            rows={3}
            placeholder="e.g. nut-free, gluten-free request"
          />
          <BuildOptionalContinue
            label="Nothing to note — continue"
            onContinue={() =>
              patch({ cakeAckNoDietary: true, cakeDietary: "" })
            }
          />
        </BuildSubstepBlock>
      ) : null}
    </>
  );
}
