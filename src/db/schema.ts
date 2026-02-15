import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";

export const fashionItems = sqliteTable("fashion_items", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  colorsJson: text("colors_json").notNull(),
  dominantColor: text("dominant_color").notNull(),
  stylesJson: text("styles_json").notNull(),
  priceUsd: real("price_usd").notNull(),
  retailer: text("retailer").notNull(),
  productUrl: text("product_url").notNull(),
  imageUrl: text("image_url").notNull(),
  fitType: text("fit_type").notNull(),
  bodyTypesJson: text("body_types_json").notNull(),
  material: text("material").notNull(),
  seasonsJson: text("seasons_json").notNull(),
  minimalAesthetic: integer("minimal_aesthetic", { mode: "boolean" }).notNull(),
  genderExpression: text("gender_expression").notNull(),
});

export const savedOutfits = sqliteTable("saved_outfits", {
  id: text("id").primaryKey(),
  itemIdsJson: text("item_ids_json").notNull(),
  paletteJson: text("palette_json").notNull(),
  totalPrice: real("total_price").notNull(),
  style: text("style").notNull(),
  vibe: text("vibe").notNull(),
  bodyType: text("body_type").notNull(),
  coherenceScore: real("coherence_score").notNull(),
  reasoning: text("reasoning"),
  colorStory: text("color_story"),
  stylingTips: text("styling_tips"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
});
