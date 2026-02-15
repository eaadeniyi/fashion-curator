import { Category, StyleType, VibeType, BodyType, GenderExpression } from "./fashion";
import { HarmonyMode } from "./color";

export interface UserPreferences {
  style: StyleType;
  vibe: VibeType;
  bodyType: BodyType;
  budgetRange: { min: number; max: number };
  baseColor: string;
  harmonyMode: HarmonyMode;
  preferMinimal: boolean;
  excludeCategories?: Category[];
  genderExpression: GenderExpression;
}
