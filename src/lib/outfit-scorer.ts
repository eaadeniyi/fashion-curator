import { FashionItem, Category } from "@/types/fashion";
import { ColorPalette } from "@/types/color";
import { colorMatchScore } from "./color-engine";

export function scoreOutfitCoherence(
  items: FashionItem[],
  palette: ColorPalette
): number {
  if (items.length === 0) return 0;

  // Category diversity (more categories = better outfit)
  const categories = new Set(items.map((i) => i.category));
  const diversityScore = Math.min(categories.size / 4, 1) * 30;

  // Essential categories check
  const hasTop =
    categories.has(Category.TOP) || categories.has(Category.DRESS);
  const hasBottom =
    categories.has(Category.BOTTOM) || categories.has(Category.DRESS);
  const hasShoes = categories.has(Category.SHOES);
  const essentialScore = (hasTop ? 10 : 0) + (hasBottom ? 10 : 0) + (hasShoes ? 10 : 0);

  // Color coherence
  const colorScores = items.map((item) =>
    colorMatchScore(item.dominantColor, palette)
  );
  const avgColorScore =
    colorScores.reduce((a, b) => a + b, 0) / colorScores.length;
  const colorScore = (avgColorScore / 100) * 30;

  // Style consistency
  const allStyles = items.flatMap((i) => i.styles);
  const styleCounts: Record<string, number> = {};
  for (const s of allStyles) {
    styleCounts[s] = (styleCounts[s] || 0) + 1;
  }
  const maxStyleCount = Math.max(...Object.values(styleCounts));
  const styleScore = Math.min(maxStyleCount / items.length, 1) * 10;

  return Math.round(diversityScore + essentialScore + colorScore + styleScore);
}

export function validateOutfit(items: FashionItem[]): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  const categories = new Set(items.map((i) => i.category));

  if (
    !categories.has(Category.TOP) &&
    !categories.has(Category.DRESS)
  ) {
    issues.push("Missing a top or dress");
  }
  if (
    !categories.has(Category.BOTTOM) &&
    !categories.has(Category.DRESS)
  ) {
    issues.push("Missing bottoms or a dress");
  }
  if (!categories.has(Category.SHOES)) {
    issues.push("Missing shoes");
  }

  return { valid: issues.length === 0, issues };
}
