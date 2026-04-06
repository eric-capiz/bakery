import type { PastryType } from "./pastryTypes";

/** All builder fields; only the block for `pastryType` is shown in the UI. */
export type BuildDesignerFormState = {
  pastryType: PastryType | null;
  primaryFlavor: string;
  cakeTiers: string;
  cakeLayersPerTier: string;
  cakeSizeOrServings: string;
  cakeFilling: string;
  cakeFrosting: string;
  cakeColorsTheme: string;
  cakeToppings: string[];
  cakeToppingsNotes: string;
  cakeMessage: string;
  cakeEventDate: string;
  cakeDietary: string;
  cookieQuantityDozen: string;
  cookieMixins: string[];
  cookieMixinsNotes: string;
  cookiePackaging: string;
  cookieOccasionNote: string;
  cookieEventDate: string;
  cookieDietary: string;
  pieSize: string;
  pieFinish: string[];
  pieColorsTheme: string;
  pieEventDate: string;
  pieDietary: string;
  cupcakeQuantity: string;
  cupcakeFrosting: string;
  cupcakeToppings: string[];
  cupcakeToppingsNotes: string;
  cupcakeMessage: string;
  cupcakeEventDate: string;
  cupcakeDietary: string;
  brownieQuantity: string;
  browniePanSize: string;
  brownieToppings: string[];
  brownieToppingsNotes: string;
  brownieEventDate: string;
  brownieDietary: string;
  /** Optional-step “continue” flags so empty fields can still unlock the next step. */
  cakeAckNoTheme: boolean;
  cakeAckNoDecor: boolean;
  cakeAckNoMessage: boolean;
  cakeAckNoDietary: boolean;
  cookieAckNoMixins: boolean;
  cookieAckNoOccasion: boolean;
  cookieAckNoDietary: boolean;
  pieAckNoFinish: boolean;
  pieAckNoTheme: boolean;
  pieAckNoDietary: boolean;
  cupcakeAckNoDecor: boolean;
  cupcakeAckNoMessage: boolean;
  cupcakeAckNoDietary: boolean;
  brownieAckNoToppings: boolean;
  brownieAckNoDietary: boolean;
};

export function createEmptyDesignerState(): BuildDesignerFormState {
  return {
    pastryType: null,
    primaryFlavor: "",
    cakeTiers: "",
    cakeLayersPerTier: "",
    cakeSizeOrServings: "",
    cakeFilling: "",
    cakeFrosting: "",
    cakeColorsTheme: "",
    cakeToppings: [],
    cakeToppingsNotes: "",
    cakeMessage: "",
    cakeEventDate: "",
    cakeDietary: "",
    cookieQuantityDozen: "",
    cookieMixins: [],
    cookieMixinsNotes: "",
    cookiePackaging: "",
    cookieOccasionNote: "",
    cookieEventDate: "",
    cookieDietary: "",
    pieSize: "",
    pieFinish: [],
    pieColorsTheme: "",
    pieEventDate: "",
    pieDietary: "",
    cupcakeQuantity: "",
    cupcakeFrosting: "",
    cupcakeToppings: [],
    cupcakeToppingsNotes: "",
    cupcakeMessage: "",
    cupcakeEventDate: "",
    cupcakeDietary: "",
    brownieQuantity: "",
    browniePanSize: "",
    brownieToppings: [],
    brownieToppingsNotes: "",
    brownieEventDate: "",
    brownieDietary: "",
    cakeAckNoTheme: false,
    cakeAckNoDecor: false,
    cakeAckNoMessage: false,
    cakeAckNoDietary: false,
    cookieAckNoMixins: false,
    cookieAckNoOccasion: false,
    cookieAckNoDietary: false,
    pieAckNoFinish: false,
    pieAckNoTheme: false,
    pieAckNoDietary: false,
    cupcakeAckNoDecor: false,
    cupcakeAckNoMessage: false,
    cupcakeAckNoDietary: false,
    brownieAckNoToppings: false,
    brownieAckNoDietary: false,
  };
}

export function toggleIdInList(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

/**
 * `design` payload with only fields for the selected pastry (excludes other types’ keys).
 */
export function serializeBuildDesignForSelectedPastry(
  s: BuildDesignerFormState
): Record<string, unknown> {
  if (!s.pastryType) return {};

  const { pastryType, primaryFlavor } = s;
  switch (pastryType) {
    case "cake":
      return {
        pastryType,
        primaryFlavor,
        cakeTiers: s.cakeTiers,
        cakeLayersPerTier: s.cakeLayersPerTier,
        cakeSizeOrServings: s.cakeSizeOrServings,
        cakeFilling: s.cakeFilling,
        cakeFrosting: s.cakeFrosting,
        cakeColorsTheme: s.cakeColorsTheme,
        cakeToppings: s.cakeToppings,
        cakeToppingsNotes: s.cakeToppingsNotes,
        cakeMessage: s.cakeMessage,
        cakeEventDate: s.cakeEventDate,
        cakeDietary: s.cakeDietary,
        cakeAckNoTheme: s.cakeAckNoTheme,
        cakeAckNoDecor: s.cakeAckNoDecor,
        cakeAckNoMessage: s.cakeAckNoMessage,
        cakeAckNoDietary: s.cakeAckNoDietary,
      };
    case "cookie":
      return {
        pastryType,
        primaryFlavor,
        cookieQuantityDozen: s.cookieQuantityDozen,
        cookieMixins: s.cookieMixins,
        cookieMixinsNotes: s.cookieMixinsNotes,
        cookiePackaging: s.cookiePackaging,
        cookieOccasionNote: s.cookieOccasionNote,
        cookieEventDate: s.cookieEventDate,
        cookieDietary: s.cookieDietary,
        cookieAckNoMixins: s.cookieAckNoMixins,
        cookieAckNoOccasion: s.cookieAckNoOccasion,
        cookieAckNoDietary: s.cookieAckNoDietary,
      };
    case "pie":
      return {
        pastryType,
        primaryFlavor,
        pieSize: s.pieSize,
        pieFinish: s.pieFinish,
        pieColorsTheme: s.pieColorsTheme,
        pieEventDate: s.pieEventDate,
        pieDietary: s.pieDietary,
        pieAckNoFinish: s.pieAckNoFinish,
        pieAckNoTheme: s.pieAckNoTheme,
        pieAckNoDietary: s.pieAckNoDietary,
      };
    case "cupcake":
      return {
        pastryType,
        primaryFlavor,
        cupcakeQuantity: s.cupcakeQuantity,
        cupcakeFrosting: s.cupcakeFrosting,
        cupcakeToppings: s.cupcakeToppings,
        cupcakeToppingsNotes: s.cupcakeToppingsNotes,
        cupcakeMessage: s.cupcakeMessage,
        cupcakeEventDate: s.cupcakeEventDate,
        cupcakeDietary: s.cupcakeDietary,
        cupcakeAckNoDecor: s.cupcakeAckNoDecor,
        cupcakeAckNoMessage: s.cupcakeAckNoMessage,
        cupcakeAckNoDietary: s.cupcakeAckNoDietary,
      };
    case "brownie":
      return {
        pastryType,
        primaryFlavor,
        brownieQuantity: s.brownieQuantity,
        browniePanSize: s.browniePanSize,
        brownieToppings: s.brownieToppings,
        brownieToppingsNotes: s.brownieToppingsNotes,
        brownieEventDate: s.brownieEventDate,
        brownieDietary: s.brownieDietary,
        brownieAckNoToppings: s.brownieAckNoToppings,
        brownieAckNoDietary: s.brownieAckNoDietary,
      };
    default:
      return { pastryType, primaryFlavor };
  }
}

/** Plain JSON object for API `design` (selected pastry only). */
export function serializeBuildDesignForApi(
  s: BuildDesignerFormState
): Record<string, unknown> {
  return JSON.parse(
    JSON.stringify(serializeBuildDesignForSelectedPastry(s))
  ) as Record<string, unknown>;
}

/** Reset optional-step flags (e.g. when step 2 flavor changes). */
export function clearedAckPatches(): Partial<BuildDesignerFormState> {
  return {
    cakeAckNoTheme: false,
    cakeAckNoDecor: false,
    cakeAckNoMessage: false,
    cakeAckNoDietary: false,
    cookieAckNoMixins: false,
    cookieAckNoOccasion: false,
    cookieAckNoDietary: false,
    pieAckNoFinish: false,
    pieAckNoTheme: false,
    pieAckNoDietary: false,
    cupcakeAckNoDecor: false,
    cupcakeAckNoMessage: false,
    cupcakeAckNoDietary: false,
    brownieAckNoToppings: false,
    brownieAckNoDietary: false,
  };
}

/** Subset of form state persisted on a build request (`design` in Redis). */
export type BuildDesign = Partial<
  Omit<BuildDesignerFormState, "pastryType">
> & {
  pastryType?: PastryType;
};
