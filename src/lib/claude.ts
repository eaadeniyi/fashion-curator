import Anthropic from "@anthropic-ai/sdk";
import { FashionItem } from "@/types/fashion";
import { ColorPalette } from "@/types/color";
import { UserPreferences } from "@/types/preferences";
import { ClaudeOutfitSuggestion } from "@/types/api";
import { bodyTypeRules } from "./body-type-rules";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert fashion stylist and color theory specialist.
You create outfit combinations from a catalog of available items.

RULES:
- Every outfit MUST include items from at least 3 categories (e.g., top + bottom + shoes)
- Colors in the outfit must align with the provided color palette
- Respect the body type guidelines provided
- Respect the budget range
- When "minimal aesthetic" is true, favor clean lines, muted tones, simple silhouettes, fewer accessories
- When "minimal aesthetic" is false, feel free to add more accessories, layers, and bold pieces
- Return EXACTLY valid JSON matching the schema — no markdown, no extra text

COLOR COORDINATION:
- Primary palette color should appear in the statement piece (top or dress)
- Secondary colors work for bottoms, bags, outerwear
- Accent colors for accessories, jewelry, socks
- Neutrals (black, white, gray, navy, beige) for shoes, belts, basics
- Consider color contrast and harmony across the entire outfit`;

export async function getOutfitRecommendations(
  preferences: UserPreferences,
  palette: ColorPalette,
  availableItems: FashionItem[]
): Promise<ClaudeOutfitSuggestion[]> {
  const rules = bodyTypeRules[preferences.bodyType];

  const userPrompt = `Create 3 outfit combinations for this profile:

PREFERENCES:
- Style: ${preferences.style}
- Occasion/Vibe: ${preferences.vibe}
- Body Type: ${preferences.bodyType}
- Budget: $${preferences.budgetRange.min} - $${preferences.budgetRange.max} per item
- Minimal Aesthetic: ${preferences.preferMinimal}
- Gender Expression: ${preferences.genderExpression}

BODY TYPE GUIDELINES FOR ${preferences.bodyType.toUpperCase()}:
- Preferred fits: ${rules.preferredFits.join(", ")}
- Avoid: ${rules.avoidFits.join(", ")}
- Best necklines: ${rules.preferredNecklines.join(", ")}
- Best silhouettes: ${rules.preferredSilhouettes.join(", ")}
- Notes: ${rules.notes}

COLOR PALETTE:
- Base: ${palette.baseColor}
- Harmony: ${palette.harmonyMode}
- Swatches: ${JSON.stringify(palette.swatches.map((s) => ({ hex: s.hex, name: s.name, role: s.role })))}
- Neutrals: ${JSON.stringify(palette.neutrals)}

AVAILABLE ITEMS (${availableItems.length} items):
${JSON.stringify(
  availableItems.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    subcategory: item.subcategory,
    colors: item.colors,
    price: item.priceUsd,
    fit: item.fitType,
    minimal: item.minimalAesthetic,
    material: item.material,
  })),
  null,
  0
)}

Return a JSON array of exactly 3 outfits. Each outfit object must have:
{
  "itemIds": ["id1", "id2", ...],
  "reasoning": "Why these items work together (2-3 sentences)",
  "colorStory": "How the colors coordinate (1-2 sentences)",
  "stylingTips": "How to wear this outfit (1-2 sentences)",
  "coherenceScore": 85
}

Return ONLY the JSON array, no other text.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Extract JSON from response (handle possible markdown wrapping)
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Failed to parse outfit recommendations from AI response");
  }

  return JSON.parse(jsonMatch[0]) as ClaudeOutfitSuggestion[];
}
