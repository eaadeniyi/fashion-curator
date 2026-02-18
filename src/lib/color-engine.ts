import { colord, extend } from "colord";
import harmoniesPlugin from "colord/plugins/harmonies";
import labPlugin from "colord/plugins/lab";
import { ColorPalette, HarmonyMode, Swatch } from "@/types/color";

extend([harmoniesPlugin, labPlugin]);

export async function getColorHarmony(
  baseHex: string,
  mode: HarmonyMode,
  count: number = 5
): Promise<Swatch[]> {
  const cleanHex = baseHex.replace("#", "");
  const res = await fetch(
    `${process.env.COLOR_API_BASE_URL || "https://www.thecolorapi.com"}/scheme?hex=${cleanHex}&mode=${mode}&count=${count}`
  );

  if (!res.ok) {
    // Fallback to local harmonies
    return getLocalSwatches(baseHex, mode);
  }

  const data = await res.json();
  return data.colors.map(
    (c: { hex: { value: string }; name: { value: string }; rgb: { r: number; g: number; b: number }; hsl: { h: number; s: number; l: number } }, i: number) => ({
      hex: c.hex.value,
      name: c.name.value,
      rgb: { r: c.rgb.r, g: c.rgb.g, b: c.rgb.b },
      hsl: { h: c.hsl.h, s: c.hsl.s, l: c.hsl.l },
      role: i === 0 ? "primary" : i === 1 ? "secondary" : i < 3 ? "accent" : "neutral",
    })
  );
}

function getLocalSwatches(baseHex: string, mode: HarmonyMode): Swatch[] {
  const base = colord(baseHex);
  const harmonyMap: Record<string, "complementary" | "analogous" | "triadic" | "tetradic"> = {
    complement: "complementary",
    analogic: "analogous",
    triad: "triadic",
    quad: "tetradic",
    monochrome: "analogous",
    "analogic-complement": "analogous",
  };

  const harmonyType = harmonyMap[mode] || "analogous";
  const colors = base.harmonies(harmonyType);

  return colors.map((c, i) => {
    const hex = c.toHex();
    const rgb = c.toRgb();
    const hsl = c.toHsl();
    return {
      hex,
      name: `Color ${i + 1}`,
      rgb: { r: rgb.r, g: rgb.g, b: rgb.b },
      hsl: { h: hsl.h, s: hsl.s, l: hsl.l },
      role: (i === 0 ? "primary" : i === 1 ? "secondary" : i < 3 ? "accent" : "neutral") as Swatch["role"],
    };
  });
}

export function generateNeutrals(baseHex: string): string[] {
  const base = colord(baseHex);
  const hue = base.toHsl().h;
  return [
    colord({ h: hue, s: 5, l: 95 }).toHex(),
    colord({ h: hue, s: 8, l: 75 }).toHex(),
    colord({ h: hue, s: 10, l: 45 }).toHex(),
    colord({ h: hue, s: 5, l: 15 }).toHex(),
  ];
}

export async function buildPalette(
  baseHex: string,
  mode: HarmonyMode
): Promise<ColorPalette> {
  const swatches = await getColorHarmony(baseHex, mode);
  const neutrals = generateNeutrals(baseHex);
  return { baseColor: baseHex, harmonyMode: mode, swatches, neutrals };
}

export function colorMatchScore(
  itemHex: string,
  palette: ColorPalette
): number {
  const itemHsl = colord(itemHex).toHsl();
  let bestScore = 0;

  // Neutral items (near-white, near-black, very desaturated) always pass —
  // they pair with any palette and are wardrobe staples.
  const isNeutral = itemHsl.s < 15 || itemHsl.l > 88 || itemHsl.l < 12;
  if (isNeutral) return 70;

  for (const swatch of palette.swatches) {
    const swatchHsl = colord(swatch.hex).toHsl();
    // Circular hue distance (0–180°)
    const hueDist = Math.min(
      Math.abs(itemHsl.h - swatchHsl.h),
      360 - Math.abs(itemHsl.h - swatchHsl.h)
    );
    // Score: 100 at 0° difference, 0 at ≥60° — matches the tolerance of
    // color harmony (analogous = ±30°, complement = 180° but scored separately)
    const score = Math.max(0, 100 - (hueDist / 60) * 100);
    bestScore = Math.max(bestScore, score);
  }

  return bestScore;
}
