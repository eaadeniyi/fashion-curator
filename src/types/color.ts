export type HarmonyMode =
  | "complement"
  | "analogic"
  | "triad"
  | "quad"
  | "monochrome"
  | "analogic-complement";

export interface Swatch {
  hex: string;
  name: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  role: "primary" | "secondary" | "accent" | "neutral";
}

export interface ColorPalette {
  baseColor: string;
  harmonyMode: HarmonyMode;
  swatches: Swatch[];
  neutrals: string[];
}
