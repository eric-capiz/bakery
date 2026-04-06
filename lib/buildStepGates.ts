import type { BuildDesignerFormState } from "./buildDesignerState";

function validInt(s: string, min: number, max: number): boolean {
  const n = parseInt(s, 10);
  if (Number.isNaN(n)) return false;
  return n >= min && n <= max;
}

function isCakeTailStepComplete(
  step: number,
  s: BuildDesignerFormState
): boolean {
  switch (step) {
    case 3:
      return validInt(s.cakeTiers, 1, 5);
    case 4:
      return validInt(s.cakeLayersPerTier, 2, 6);
    case 5:
      return s.cakeSizeOrServings.trim() !== "";
    case 6:
      return s.cakeFilling !== "";
    case 7:
      return s.cakeFrosting !== "";
    case 8:
      return s.cakeColorsTheme.trim() !== "" || s.cakeAckNoTheme;
    case 9:
      return (
        s.cakeToppings.length > 0 ||
        s.cakeToppingsNotes.trim() !== "" ||
        s.cakeAckNoDecor
      );
    case 10:
      return s.cakeMessage.trim() !== "" || s.cakeAckNoMessage;
    case 11:
      return s.cakeEventDate.trim() !== "";
    case 12:
      return s.cakeDietary.trim() !== "" || s.cakeAckNoDietary;
    default:
      return false;
  }
}

export function showCakeTailStep(
  step: number,
  s: BuildDesignerFormState
): boolean {
  if (step < 3) return false;
  for (let k = 3; k < step; k++) {
    if (!isCakeTailStepComplete(k, s)) return false;
  }
  return true;
}

function isCookieTailStepComplete(
  step: number,
  s: BuildDesignerFormState
): boolean {
  switch (step) {
    case 3:
      return validInt(s.cookieQuantityDozen, 1, 99);
    case 4:
      return (
        s.cookieMixins.length > 0 ||
        s.cookieMixinsNotes.trim() !== "" ||
        s.cookieAckNoMixins
      );
    case 5:
      return s.cookiePackaging !== "";
    case 6:
      return s.cookieOccasionNote.trim() !== "" || s.cookieAckNoOccasion;
    case 7:
      return s.cookieEventDate.trim() !== "";
    case 8:
      return s.cookieDietary.trim() !== "" || s.cookieAckNoDietary;
    default:
      return false;
  }
}

export function showCookieTailStep(
  step: number,
  s: BuildDesignerFormState
): boolean {
  for (let k = 3; k < step; k++) {
    if (!isCookieTailStepComplete(k, s)) return false;
  }
  return true;
}

function isPieTailStepComplete(step: number, s: BuildDesignerFormState): boolean {
  switch (step) {
    case 3:
      return s.pieSize !== "";
    case 4:
      return s.pieFinish.length > 0 || s.pieAckNoFinish;
    case 5:
      return s.pieColorsTheme.trim() !== "" || s.pieAckNoTheme;
    case 6:
      return s.pieEventDate.trim() !== "";
    case 7:
      return s.pieDietary.trim() !== "" || s.pieAckNoDietary;
    default:
      return false;
  }
}

export function showPieTailStep(step: number, s: BuildDesignerFormState): boolean {
  for (let k = 3; k < step; k++) {
    if (!isPieTailStepComplete(k, s)) return false;
  }
  return true;
}

function isCupcakeTailStepComplete(
  step: number,
  s: BuildDesignerFormState
): boolean {
  switch (step) {
    case 3:
      return validInt(s.cupcakeQuantity, 1, 500);
    case 4:
      return s.cupcakeFrosting !== "";
    case 5:
      return (
        s.cupcakeToppings.length > 0 ||
        s.cupcakeToppingsNotes.trim() !== "" ||
        s.cupcakeAckNoDecor
      );
    case 6:
      return s.cupcakeMessage.trim() !== "" || s.cupcakeAckNoMessage;
    case 7:
      return s.cupcakeEventDate.trim() !== "";
    case 8:
      return s.cupcakeDietary.trim() !== "" || s.cupcakeAckNoDietary;
    default:
      return false;
  }
}

export function showCupcakeTailStep(
  step: number,
  s: BuildDesignerFormState
): boolean {
  for (let k = 3; k < step; k++) {
    if (!isCupcakeTailStepComplete(k, s)) return false;
  }
  return true;
}

function isBrownieTailStepComplete(
  step: number,
  s: BuildDesignerFormState
): boolean {
  switch (step) {
    case 3:
      return validInt(s.brownieQuantity, 1, 999);
    case 4:
      return s.browniePanSize !== "";
    case 5:
      return s.brownieToppings.length > 0 || s.brownieAckNoToppings;
    case 6:
      return s.brownieEventDate.trim() !== "";
    case 7:
      return s.brownieDietary.trim() !== "" || s.brownieAckNoDietary;
    default:
      return false;
  }
}

export function showBrownieTailStep(
  step: number,
  s: BuildDesignerFormState
): boolean {
  for (let k = 3; k < step; k++) {
    if (!isBrownieTailStepComplete(k, s)) return false;
  }
  return true;
}

/** True when all steps for the chosen pastry are satisfied (ready to save design). */
export function isDesignerFlowComplete(s: BuildDesignerFormState): boolean {
  if (!s.pastryType || !s.primaryFlavor.trim()) return false;
  switch (s.pastryType) {
    case "cake":
      return isCakeTailStepComplete(12, s);
    case "cookie":
      return isCookieTailStepComplete(8, s);
    case "pie":
      return isPieTailStepComplete(7, s);
    case "cupcake":
      return isCupcakeTailStepComplete(8, s);
    case "brownie":
      return isBrownieTailStepComplete(7, s);
    default:
      return false;
  }
}

/** True when the final step’s section is on screen (submit can appear with it). */
export function isLastTailStepVisible(s: BuildDesignerFormState): boolean {
  if (!s.pastryType || !s.primaryFlavor.trim()) return false;
  switch (s.pastryType) {
    case "cake":
      return showCakeTailStep(12, s);
    case "cookie":
      return showCookieTailStep(8, s);
    case "pie":
      return showPieTailStep(7, s);
    case "cupcake":
      return showCupcakeTailStep(8, s);
    case "brownie":
      return showBrownieTailStep(7, s);
    default:
      return false;
  }
}
