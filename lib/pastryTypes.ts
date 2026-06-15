export const PASTRY_TYPES = [
  "cake",
  "cookie",
  "pie",
  "cupcake",
  "brownie",
] as const;

export type PastryType = (typeof PASTRY_TYPES)[number];

export const PASTRY_LABELS: Record<PastryType, string> = {
  cake: "Cake",
  cookie: "Cookie",
  pie: "Pie",
  cupcake: "Cupcake",
  brownie: "Brownie",
};

export type { BuildDesign } from "./buildDesignerState";
