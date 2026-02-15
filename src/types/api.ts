import { UserPreferences } from "./preferences";
import { OutfitCombination, FashionItem } from "./fashion";
import { ColorPalette } from "./color";

export interface RecommendRequest {
  preferences: UserPreferences;
}

export interface RecommendResponse {
  outfits: OutfitCombination[];
  palette: ColorPalette;
  totalItemsConsidered: number;
}

export interface ClaudeOutfitSuggestion {
  itemIds: string[];
  reasoning: string;
  colorStory: string;
  stylingTips: string;
  coherenceScore: number;
}

export interface ColorSchemeRequest {
  hex: string;
  mode: string;
  count?: number;
}

export interface ColorSchemeResponse {
  palette: ColorPalette;
}

export interface SaveOutfitRequest {
  outfit: OutfitCombination;
}

export interface ItemsQueryParams {
  category?: string;
  style?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  bodyType?: string;
  gender?: string;
}
