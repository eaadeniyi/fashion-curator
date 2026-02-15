import {
  FashionItem,
  StyleType,
  BodyType,
  GenderExpression,
} from "@/types/fashion";
import { ColorPalette } from "@/types/color";
import { colorMatchScore } from "./color-engine";
import { catalogItems } from "./catalog";

export function getAllItems(): FashionItem[] {
  return catalogItems;
}

export function filterItems(params: {
  style?: StyleType;
  bodyType?: BodyType;
  gender?: GenderExpression;
  minPrice?: number;
  maxPrice?: number;
  minimal?: boolean;
  palette?: ColorPalette;
  minColorScore?: number;
}): FashionItem[] {
  let items = getAllItems();

  if (params.style) {
    items = items.filter((i) => i.styles.includes(params.style!));
  }
  if (params.bodyType) {
    items = items.filter((i) =>
      i.bodyTypeCompatibility.includes(params.bodyType!)
    );
  }
  if (params.gender) {
    items = items.filter(
      (i) =>
        i.genderExpression === params.gender ||
        i.genderExpression === GenderExpression.NEUTRAL
    );
  }
  if (params.minPrice !== undefined) {
    items = items.filter((i) => i.priceUsd >= params.minPrice!);
  }
  if (params.maxPrice !== undefined) {
    items = items.filter((i) => i.priceUsd <= params.maxPrice!);
  }
  if (params.minimal !== undefined) {
    if (params.minimal) {
      items = items.filter((i) => i.minimalAesthetic);
    }
  }
  if (params.palette && params.minColorScore) {
    items = items.filter(
      (i) =>
        colorMatchScore(i.dominantColor, params.palette!) >=
        params.minColorScore!
    );
  }

  return items;
}

export function getItemsByIds(ids: string[]): FashionItem[] {
  return ids
    .map((id) => catalogItems.find((i) => i.id === id))
    .filter((i): i is FashionItem => i !== undefined);
}
