import { NextRequest, NextResponse } from "next/server";
import { RecommendRequest, RecommendResponse } from "@/types/api";
import { buildPalette } from "@/lib/color-engine";
import { getOutfitRecommendations } from "@/lib/claude";
import { filterItems, getItemsByIds } from "@/lib/fashion-data";
import { scoreOutfitCoherence } from "@/lib/outfit-scorer";

export async function POST(request: NextRequest) {
  try {
    const body: RecommendRequest = await request.json();
    const { preferences } = body;

    // 1. Build color palette
    const palette = await buildPalette(
      preferences.baseColor,
      preferences.harmonyMode
    );

    // 2. Pre-filter catalog
    const filteredItems = filterItems({
      style: preferences.style,
      bodyType: preferences.bodyType,
      gender: preferences.genderExpression,
      minPrice: 0,
      maxPrice: preferences.budgetRange.max,
      minimal: preferences.preferMinimal || undefined,
      palette,
      minColorScore: 40, // items must be within ~24° of a palette hue, or be a neutral
    });

    // If too few items after strict filtering, relax filters
    let itemsForAI = filteredItems;
    if (filteredItems.length < 10) {
      itemsForAI = filterItems({
        bodyType: preferences.bodyType,
        gender: preferences.genderExpression,
        maxPrice: preferences.budgetRange.max,
      });
    }

    // 3. Get AI recommendations
    const suggestions = await getOutfitRecommendations(
      preferences,
      palette,
      itemsForAI
    );

    // 4. Build outfit combinations
    const outfits = suggestions.map((suggestion) => {
      const items = getItemsByIds(suggestion.itemIds);
      const totalPrice = items.reduce((sum, i) => sum + i.priceUsd, 0);
      const coherenceScore = scoreOutfitCoherence(items, palette);

      return {
        id: crypto.randomUUID(),
        items,
        palette,
        totalPrice,
        style: preferences.style,
        vibe: preferences.vibe,
        coherenceScore,
        bodyType: preferences.bodyType,
        isMinimal: preferences.preferMinimal,
        reasoning: suggestion.reasoning,
        colorStory: suggestion.colorStory,
        stylingTips: suggestion.stylingTips,
      };
    });

    const response: RecommendResponse = {
      outfits,
      palette,
      totalItemsConsidered: itemsForAI.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Recommendation error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
