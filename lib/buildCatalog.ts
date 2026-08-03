import type { PastryType } from "./pastryTypes";

export type FlavorOption = {
  value: string;
  label: string;
};

/**
 * Once per step: checkboxes + detail textarea below.
 * Explains that blank detail = studio may choose.
 */
export const CHECKBOX_WITH_DETAIL_TEXTAREA_NOTICE =
  "Add specifics in the detail box below when you care about stem, palette, or look. If you leave it blank, the studio may use their usual choice or any fitting seasonal option.";

/**
 * Once per step: checkboxes only—no text area in this section.
 * Points to lead notes; same “may vary if unspecified” idea.
 */
export const CHECKBOX_LEAD_NOTES_SECTION_NOTICE =
  'If something needs to be exact, say so under “Your details” notes or when you edit contact. Otherwise the studio may use any suitable option for what you checked.';

/** Cake layer flavors and cupcake flavors (README). */
export const CAKE_CUPCAKE_FLAVORS: FlavorOption[] = [
  { value: "vanilla", label: "Vanilla" },
  { value: "chocolate", label: "Chocolate" },
  { value: "red_velvet", label: "Red velvet" },
  { value: "marble", label: "Marble" },
  { value: "funfetti", label: "Funfetti" },
  { value: "lemon", label: "Lemon" },
  { value: "carrot", label: "Carrot" },
];

export const COOKIE_VARIETIES: FlavorOption[] = [
  { value: "chocolate_chip", label: "Chocolate chip" },
  { value: "sugar", label: "Sugar" },
  { value: "oatmeal_raisin", label: "Oatmeal raisin" },
  { value: "peanut_butter", label: "Peanut butter" },
  { value: "snickerdoodle", label: "Snickerdoodle" },
  { value: "double_chocolate", label: "Double chocolate" },
  { value: "shortbread", label: "Shortbread" },
];

const PIE_VARIETIES: FlavorOption[] = [
  { value: "apple", label: "Apple" },
  { value: "cherry", label: "Cherry" },
  { value: "pumpkin", label: "Pumpkin" },
  { value: "pecan", label: "Pecan" },
  { value: "key_lime", label: "Key lime" },
  { value: "blueberry", label: "Blueberry" },
  { value: "peach", label: "Peach" },
];

const BROWNIE_STYLES: FlavorOption[] = [
  { value: "classic_fudge", label: "Classic fudge" },
  { value: "walnut", label: "Walnut" },
  { value: "salted_caramel", label: "Salted caramel" },
  { value: "blondie", label: "Blondie" },
  { value: "cheesecake_swirl", label: "Cheesecake swirl" },
  { value: "mint_chocolate", label: "Mint chocolate" },
];

export type FirstSubstepMeta = {
  /** Step heading inside the builder (after pastry type). */
  title: string;
  /** Short hint under the title. */
  lead: string;
  /** `<select>` options / values stored on `design`. */
  options: FlavorOption[];
};

export function getFirstSubstepMeta(pastryType: PastryType): FirstSubstepMeta {
  switch (pastryType) {
    case "cake":
      return {
        title: "Layer flavor",
        lead: "Flavor of the baked layers (not the frosting yet).",
        options: CAKE_CUPCAKE_FLAVORS,
      };
    case "cupcake":
      return {
        title: "Cupcake flavor",
        lead: "Base flavor for the cupcake.",
        options: CAKE_CUPCAKE_FLAVORS,
      };
    case "cookie":
      return {
        title: "Cookie flavor or variety",
        lead: "Choose the cookie type you have in mind.",
        options: COOKIE_VARIETIES,
      };
    case "pie":
      return {
        title: "Pie flavor or variety",
        lead: "Choose the pie you want.",
        options: PIE_VARIETIES,
      };
    case "brownie":
      return {
        title: "Brownie flavor or style",
        lead: "Pick a style; add details in your notes if needed.",
        options: BROWNIE_STYLES,
      };
  }
}

export const CAKE_FILLING_OPTIONS: FlavorOption[] = [
  { value: "vanilla_buttercream", label: "Vanilla buttercream filling" },
  { value: "chocolate_ganache", label: "Chocolate ganache" },
  { value: "strawberry", label: "Strawberry" },
  { value: "raspberry", label: "Raspberry" },
  { value: "lemon_curd", label: "Lemon curd" },
  { value: "bavarian", label: "Bavarian cream" },
  { value: "none", label: "None / decide later" },
];

export const FROSTING_OPTIONS: FlavorOption[] = [
  { value: "buttercream", label: "Buttercream" },
  { value: "chocolate_buttercream", label: "Chocolate buttercream" },
  { value: "cream_cheese", label: "Cream cheese" },
  { value: "whipped_cream", label: "Whipped cream" },
  { value: "fondant", label: "Fondant" },
  { value: "ganache", label: "Ganache" },
  { value: "naked_semi_naked", label: "Naked / semi-naked" },
];

/** Cake step 8 and cupcake step 5 (decorations). */
export const CAKE_CUPCAKE_DECORATION_OPTIONS: FlavorOption[] = [
  { value: "fresh_fruit", label: "Fresh fruit" },
  { value: "flowers", label: "Flowers" },
  { value: "macarons", label: "Macarons" },
  { value: "sprinkles", label: "Sprinkles" },
  { value: "drip", label: "Drip finish" },
  {
    value: "gold_silver",
    label: "Gold or silver accents",
  },
  { value: "edible_image", label: "Edible image" },
  { value: "topper", label: "Custom topper" },
];

export const COOKIE_MIXIN_OPTIONS: FlavorOption[] = [
  { value: "chocolate_chips", label: "Chocolate chips" },
  { value: "nuts", label: "Nuts" },
  { value: "sprinkles", label: "Sprinkles" },
  {
    value: "mms",
    label: "Candy-coated chocolates (e.g. M&M’s)",
  },
  { value: "coconut", label: "Coconut" },
  { value: "sea_salt", label: "Sea salt flake" },
  { value: "white_chocolate", label: "White chocolate chunks" },
];

export const COOKIE_PACKAGING_OPTIONS: FlavorOption[] = [
  { value: "box", label: "Box" },
  { value: "platter", label: "Platter" },
  { value: "individual", label: "Individual bags" },
  { value: "gift", label: "Gift packaging" },
  { value: "undecided", label: "Not sure yet" },
];

export const PIE_SIZE_OPTIONS: FlavorOption[] = [
  { value: "whole_8", label: 'Whole 8"' },
  { value: "whole_9", label: 'Whole 9"' },
  { value: "whole_10", label: 'Whole 10"' },
  { value: "other", label: "Other (describe in notes)" },
];

export const PIE_FINISH_OPTIONS: FlavorOption[] = [
  { value: "lattice", label: "Lattice top" },
  { value: "full_crust", label: "Full top crust" },
  { value: "streusel", label: "Streusel topping" },
  { value: "whipped", label: "Whipped cream on serve" },
  { value: "plain", label: "Baked top only" },
];

export const BROWNIE_PAN_OPTIONS: FlavorOption[] = [
  { value: "8_8", label: '8" × 8"' },
  { value: "9_9", label: '9" × 9"' },
  { value: "9_13", label: '9" × 13"' },
];

export const BROWNIE_TOPPING_OPTIONS: FlavorOption[] = [
  {
    value: "frosting_on_top",
    label: "Frosting on top",
  },
  {
    value: "chocolate_drizzle",
    label: "Chocolate drizzle",
  },
  {
    value: "caramel_drizzle",
    label: "Caramel drizzle",
  },
  { value: "nuts", label: "Nuts" },
  { value: "powdered_sugar", label: "Powdered sugar" },
  { value: "sea_salt", label: "Sea salt flake" },
];
