import { FashionItem } from "@/types/fashion";

export function filterByBudget(
  items: FashionItem[],
  min: number,
  max: number
): FashionItem[] {
  return items.filter(
    (item) => item.priceUsd >= min && item.priceUsd <= max
  );
}

export function getBudgetTier(
  budget: { min: number; max: number }
): "budget" | "mid" | "premium" | "luxury" {
  const avg = (budget.min + budget.max) / 2;
  if (avg < 50) return "budget";
  if (avg < 150) return "mid";
  if (avg < 400) return "premium";
  return "luxury";
}

export function estimateOutfitCost(items: FashionItem[]): number {
  return items.reduce((sum, item) => sum + item.priceUsd, 0);
}
