import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { fashionItems } from "./schema";
import path from "path";
import { v4 as uuid } from "uuid";

const dbPath = path.join(process.cwd(), "curator.db");
const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
const db = drizzle(sqlite);

// Create table if not exists
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS fashion_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    colors_json TEXT NOT NULL,
    dominant_color TEXT NOT NULL,
    styles_json TEXT NOT NULL,
    price_usd REAL NOT NULL,
    retailer TEXT NOT NULL,
    product_url TEXT NOT NULL,
    image_url TEXT NOT NULL,
    fit_type TEXT NOT NULL,
    body_types_json TEXT NOT NULL,
    material TEXT NOT NULL,
    seasons_json TEXT NOT NULL,
    minimal_aesthetic INTEGER NOT NULL,
    gender_expression TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS saved_outfits (
    id TEXT PRIMARY KEY,
    item_ids_json TEXT NOT NULL,
    palette_json TEXT NOT NULL,
    total_price REAL NOT NULL,
    style TEXT NOT NULL,
    vibe TEXT NOT NULL,
    body_type TEXT NOT NULL,
    coherence_score REAL NOT NULL,
    reasoning TEXT,
    color_story TEXT,
    styling_tips TEXT,
    created_at INTEGER
  );
`);

const items = [
  // === TOPS ===
  { name: "Classic White Oxford Shirt", category: "top", subcategory: "button-down", colors: ["#FFFFFF", "#F5F5F5"], dominantColor: "#FFFFFF", styles: ["classic", "preppy", "minimalist", "smart_casual"], priceUsd: 55, retailer: "Mock Store", fitType: "regular", bodyTypes: ["apple", "pear", "hourglass", "rectangle", "inverted_triangle"], material: "cotton", season: ["spring", "summer", "fall", "winter"], minimal: true, gender: "neutral" },
  { name: "Navy Crew Neck T-Shirt", category: "top", subcategory: "t-shirt", colors: ["#1B3A5C"], dominantColor: "#1B3A5C", styles: ["minimalist", "streetwear", "smart_casual"], priceUsd: 25, retailer: "Mock Store", fitType: "slim", bodyTypes: ["rectangle", "inverted_triangle", "hourglass"], material: "cotton", season: ["spring", "summer", "fall"], minimal: true, gender: "masculine" },
  { name: "Floral Wrap Blouse", category: "top", subcategory: "blouse", colors: ["#E8A0BF", "#2D5F2D", "#FFFFFF"], dominantColor: "#E8A0BF", styles: ["romantic", "bohemian"], priceUsd: 42, retailer: "Mock Store", fitType: "relaxed", bodyTypes: ["apple", "pear", "hourglass"], material: "viscose", season: ["spring", "summer"], minimal: false, gender: "feminine" },
  { name: "Black Turtleneck Sweater", category: "top", subcategory: "sweater", colors: ["#1A1A1A"], dominantColor: "#1A1A1A", styles: ["minimalist", "classic", "edgy", "smart_casual"], priceUsd: 68, retailer: "Mock Store", fitType: "slim", bodyTypes: ["rectangle", "hourglass", "inverted_triangle", "pear"], material: "merino wool", season: ["fall", "winter"], minimal: true, gender: "neutral" },
  { name: "Oversized Graphic Hoodie", category: "top", subcategory: "hoodie", colors: ["#808080", "#FF4500"], dominantColor: "#808080", styles: ["streetwear", "athleisure"], priceUsd: 60, retailer: "Mock Store", fitType: "oversized", bodyTypes: ["rectangle", "inverted_triangle", "apple"], material: "cotton blend", season: ["fall", "winter", "spring"], minimal: false, gender: "neutral" },
  { name: "Sage Linen Camp Collar Shirt", category: "top", subcategory: "camp-collar", colors: ["#9CAF88"], dominantColor: "#9CAF88", styles: ["minimalist", "bohemian", "smart_casual"], priceUsd: 48, retailer: "Mock Store", fitType: "relaxed", bodyTypes: ["apple", "rectangle", "inverted_triangle"], material: "linen", season: ["spring", "summer"], minimal: true, gender: "masculine" },
  { name: "Burgundy Silk Camisole", category: "top", subcategory: "camisole", colors: ["#722F37"], dominantColor: "#722F37", styles: ["romantic", "classic", "edgy"], priceUsd: 55, retailer: "Mock Store", fitType: "slim", bodyTypes: ["hourglass", "rectangle", "pear"], material: "silk", season: ["spring", "summer", "fall"], minimal: true, gender: "feminine" },

  // === BOTTOMS ===
  { name: "Dark Indigo Straight Jeans", category: "bottom", subcategory: "jeans", colors: ["#1C1C3A"], dominantColor: "#1C1C3A", styles: ["classic", "streetwear", "minimalist", "smart_casual"], priceUsd: 75, retailer: "Mock Store", fitType: "straight", bodyTypes: ["apple", "pear", "hourglass", "rectangle", "inverted_triangle"], material: "denim", season: ["spring", "summer", "fall", "winter"], minimal: true, gender: "neutral" },
  { name: "Olive Cargo Pants", category: "bottom", subcategory: "cargo", colors: ["#556B2F"], dominantColor: "#556B2F", styles: ["streetwear", "athleisure"], priceUsd: 65, retailer: "Mock Store", fitType: "relaxed", bodyTypes: ["rectangle", "inverted_triangle", "apple"], material: "cotton twill", season: ["spring", "fall", "winter"], minimal: false, gender: "masculine" },
  { name: "Camel Wide-Leg Trousers", category: "bottom", subcategory: "trousers", colors: ["#C19A6B"], dominantColor: "#C19A6B", styles: ["classic", "minimalist", "smart_casual", "bohemian"], priceUsd: 85, retailer: "Mock Store", fitType: "wide-leg", bodyTypes: ["pear", "hourglass", "rectangle"], material: "wool blend", season: ["fall", "winter", "spring"], minimal: true, gender: "feminine" },
  { name: "Black Tailored Chinos", category: "bottom", subcategory: "chinos", colors: ["#1A1A1A"], dominantColor: "#1A1A1A", styles: ["classic", "smart_casual", "minimalist"], priceUsd: 60, retailer: "Mock Store", fitType: "slim", bodyTypes: ["rectangle", "hourglass", "inverted_triangle"], material: "cotton stretch", season: ["spring", "summer", "fall", "winter"], minimal: true, gender: "neutral" },
  { name: "Cream Pleated Midi Skirt", category: "bottom", subcategory: "skirt", colors: ["#FFFDD0"], dominantColor: "#FFFDD0", styles: ["classic", "romantic", "minimalist"], priceUsd: 58, retailer: "Mock Store", fitType: "a-line", bodyTypes: ["apple", "pear", "hourglass", "rectangle"], material: "polyester blend", season: ["spring", "summer"], minimal: true, gender: "feminine" },

  // === DRESSES ===
  { name: "Black Wrap Midi Dress", category: "dress", subcategory: "wrap-dress", colors: ["#1A1A1A"], dominantColor: "#1A1A1A", styles: ["classic", "smart_casual", "minimalist"], priceUsd: 95, retailer: "Mock Store", fitType: "wrap", bodyTypes: ["apple", "pear", "hourglass", "rectangle", "inverted_triangle"], material: "jersey", season: ["spring", "summer", "fall"], minimal: true, gender: "feminine" },
  { name: "Terracotta Linen Shirt Dress", category: "dress", subcategory: "shirt-dress", colors: ["#CC6B49"], dominantColor: "#CC6B49", styles: ["bohemian", "classic", "smart_casual"], priceUsd: 78, retailer: "Mock Store", fitType: "relaxed", bodyTypes: ["apple", "rectangle", "pear"], material: "linen", season: ["spring", "summer"], minimal: true, gender: "feminine" },

  // === OUTERWEAR ===
  { name: "Camel Wool Overcoat", category: "outerwear", subcategory: "overcoat", colors: ["#C19A6B"], dominantColor: "#C19A6B", styles: ["classic", "minimalist", "smart_casual"], priceUsd: 195, retailer: "Mock Store", fitType: "structured", bodyTypes: ["rectangle", "hourglass", "inverted_triangle"], material: "wool", season: ["fall", "winter"], minimal: true, gender: "neutral" },
  { name: "Black Leather Biker Jacket", category: "outerwear", subcategory: "biker-jacket", colors: ["#1A1A1A"], dominantColor: "#1A1A1A", styles: ["edgy", "streetwear"], priceUsd: 180, retailer: "Mock Store", fitType: "slim", bodyTypes: ["rectangle", "hourglass", "inverted_triangle"], material: "leather", season: ["fall", "winter", "spring"], minimal: false, gender: "neutral" },
  { name: "Olive Bomber Jacket", category: "outerwear", subcategory: "bomber", colors: ["#556B2F"], dominantColor: "#556B2F", styles: ["streetwear", "athleisure", "smart_casual"], priceUsd: 110, retailer: "Mock Store", fitType: "regular", bodyTypes: ["rectangle", "apple", "inverted_triangle"], material: "nylon", season: ["fall", "spring"], minimal: false, gender: "masculine" },
  { name: "Cream Knit Cardigan", category: "outerwear", subcategory: "cardigan", colors: ["#FAF0E6"], dominantColor: "#FAF0E6", styles: ["minimalist", "classic", "bohemian", "romantic"], priceUsd: 72, retailer: "Mock Store", fitType: "relaxed", bodyTypes: ["apple", "pear", "hourglass", "rectangle"], material: "cotton knit", season: ["fall", "winter", "spring"], minimal: true, gender: "feminine" },

  // === SHOES ===
  { name: "White Leather Sneakers", category: "shoes", subcategory: "sneakers", colors: ["#FFFFFF"], dominantColor: "#FFFFFF", styles: ["minimalist", "streetwear", "smart_casual", "athleisure"], priceUsd: 95, retailer: "Mock Store", fitType: "regular", bodyTypes: ["apple", "pear", "hourglass", "rectangle", "inverted_triangle"], material: "leather", season: ["spring", "summer", "fall"], minimal: true, gender: "neutral" },
  { name: "Black Chelsea Boots", category: "shoes", subcategory: "chelsea-boots", colors: ["#1A1A1A"], dominantColor: "#1A1A1A", styles: ["classic", "edgy", "minimalist", "smart_casual"], priceUsd: 145, retailer: "Mock Store", fitType: "regular", bodyTypes: ["apple", "pear", "hourglass", "rectangle", "inverted_triangle"], material: "leather", season: ["fall", "winter", "spring"], minimal: true, gender: "neutral" },
  { name: "Tan Suede Loafers", category: "shoes", subcategory: "loafers", colors: ["#D2B48C"], dominantColor: "#D2B48C", styles: ["classic", "preppy", "smart_casual"], priceUsd: 120, retailer: "Mock Store", fitType: "regular", bodyTypes: ["apple", "pear", "hourglass", "rectangle", "inverted_triangle"], material: "suede", season: ["spring", "summer", "fall"], minimal: true, gender: "neutral" },
  { name: "Nude Block Heel Sandals", category: "shoes", subcategory: "sandals", colors: ["#E8C9A0"], dominantColor: "#E8C9A0", styles: ["classic", "romantic", "smart_casual"], priceUsd: 85, retailer: "Mock Store", fitType: "regular", bodyTypes: ["apple", "pear", "hourglass", "rectangle", "inverted_triangle"], material: "faux leather", season: ["spring", "summer"], minimal: true, gender: "feminine" },
  { name: "High-Top Canvas Sneakers", category: "shoes", subcategory: "high-tops", colors: ["#2F4F4F"], dominantColor: "#2F4F4F", styles: ["streetwear", "vintage", "edgy"], priceUsd: 65, retailer: "Mock Store", fitType: "regular", bodyTypes: ["rectangle", "inverted_triangle", "hourglass"], material: "canvas", season: ["spring", "summer", "fall"], minimal: false, gender: "neutral" },

  // === SOCKS ===
  { name: "Navy Ribbed Dress Socks", category: "socks", subcategory: "dress-socks", colors: ["#1B3A5C"], dominantColor: "#1B3A5C", styles: ["classic", "smart_casual", "preppy"], priceUsd: 12, retailer: "Mock Store", fitType: "regular", bodyTypes: ["apple", "pear", "hourglass", "rectangle", "inverted_triangle"], material: "cotton blend", season: ["spring", "summer", "fall", "winter"], minimal: true, gender: "neutral" },
  { name: "Patterned Crew Socks", category: "socks", subcategory: "crew-socks", colors: ["#FF6347", "#FFD700", "#4169E1"], dominantColor: "#FF6347", styles: ["streetwear", "vintage", "preppy"], priceUsd: 15, retailer: "Mock Store", fitType: "regular", bodyTypes: ["apple", "pear", "hourglass", "rectangle", "inverted_triangle"], material: "cotton", season: ["spring", "summer", "fall", "winter"], minimal: false, gender: "neutral" },
  { name: "Black No-Show Socks", category: "socks", subcategory: "no-show", colors: ["#1A1A1A"], dominantColor: "#1A1A1A", styles: ["minimalist", "smart_casual", "athleisure"], priceUsd: 10, retailer: "Mock Store", fitType: "regular", bodyTypes: ["apple", "pear", "hourglass", "rectangle", "inverted_triangle"], material: "cotton blend", season: ["spring", "summer", "fall", "winter"], minimal: true, gender: "neutral" },
  { name: "Sheer Ankle Socks", category: "socks", subcategory: "ankle-socks", colors: ["#F5DEB3"], dominantColor: "#F5DEB3", styles: ["romantic", "classic", "vintage"], priceUsd: 14, retailer: "Mock Store", fitType: "regular", bodyTypes: ["apple", "pear", "hourglass", "rectangle", "inverted_triangle"], material: "nylon", season: ["spring", "summer"], minimal: true, gender: "feminine" },

  // === BAGS ===
  { name: "Black Leather Tote", category: "bag", subcategory: "tote", colors: ["#1A1A1A"], dominantColor: "#1A1A1A", styles: ["classic", "minimalist", "smart_casual"], priceUsd: 120, retailer: "Mock Store", fitType: "structured", bodyTypes: ["apple", "pear", "hourglass", "rectangle", "inverted_triangle"], material: "leather", season: ["spring", "summer", "fall", "winter"], minimal: true, gender: "feminine" },
  { name: "Canvas Crossbody Bag", category: "bag", subcategory: "crossbody", colors: ["#556B2F", "#D2B48C"], dominantColor: "#556B2F", styles: ["bohemian", "streetwear", "athleisure"], priceUsd: 45, retailer: "Mock Store", fitType: "relaxed", bodyTypes: ["apple", "pear", "hourglass", "rectangle", "inverted_triangle"], material: "canvas", season: ["spring", "summer", "fall"], minimal: false, gender: "neutral" },
  { name: "Minimalist Leather Backpack", category: "bag", subcategory: "backpack", colors: ["#8B7355"], dominantColor: "#8B7355", styles: ["minimalist", "smart_casual", "streetwear"], priceUsd: 95, retailer: "Mock Store", fitType: "structured", bodyTypes: ["apple", "pear", "hourglass", "rectangle", "inverted_triangle"], material: "leather", season: ["spring", "summer", "fall", "winter"], minimal: true, gender: "neutral" },

  // === JEWELRY ===
  { name: "Gold Chain Necklace", category: "jewelry", subcategory: "necklace", colors: ["#FFD700"], dominantColor: "#FFD700", styles: ["classic", "romantic", "streetwear", "edgy"], priceUsd: 35, retailer: "Mock Store", fitType: "regular", bodyTypes: ["apple", "pear", "hourglass", "rectangle", "inverted_triangle"], material: "gold-plated", season: ["spring", "summer", "fall", "winter"], minimal: false, gender: "neutral" },
  { name: "Silver Minimalist Cuff", category: "jewelry", subcategory: "bracelet", colors: ["#C0C0C0"], dominantColor: "#C0C0C0", styles: ["minimalist", "classic", "edgy"], priceUsd: 28, retailer: "Mock Store", fitType: "regular", bodyTypes: ["apple", "pear", "hourglass", "rectangle", "inverted_triangle"], material: "sterling silver", season: ["spring", "summer", "fall", "winter"], minimal: true, gender: "neutral" },
  { name: "Pearl Stud Earrings", category: "jewelry", subcategory: "earrings", colors: ["#FDEBD0"], dominantColor: "#FDEBD0", styles: ["classic", "romantic", "preppy", "minimalist"], priceUsd: 22, retailer: "Mock Store", fitType: "regular", bodyTypes: ["apple", "pear", "hourglass", "rectangle", "inverted_triangle"], material: "faux pearl", season: ["spring", "summer", "fall", "winter"], minimal: true, gender: "feminine" },
  { name: "Layered Ring Set", category: "jewelry", subcategory: "rings", colors: ["#FFD700", "#C0C0C0"], dominantColor: "#FFD700", styles: ["bohemian", "romantic", "vintage"], priceUsd: 18, retailer: "Mock Store", fitType: "regular", bodyTypes: ["apple", "pear", "hourglass", "rectangle", "inverted_triangle"], material: "mixed metals", season: ["spring", "summer", "fall", "winter"], minimal: false, gender: "neutral" },

  // === HATS ===
  { name: "Black Wool Fedora", category: "hat", subcategory: "fedora", colors: ["#1A1A1A"], dominantColor: "#1A1A1A", styles: ["classic", "bohemian", "edgy"], priceUsd: 45, retailer: "Mock Store", fitType: "regular", bodyTypes: ["apple", "pear", "hourglass", "rectangle", "inverted_triangle"], material: "wool", season: ["fall", "winter"], minimal: true, gender: "neutral" },
  { name: "Baseball Cap", category: "hat", subcategory: "cap", colors: ["#1B3A5C"], dominantColor: "#1B3A5C", styles: ["streetwear", "athleisure"], priceUsd: 25, retailer: "Mock Store", fitType: "regular", bodyTypes: ["apple", "pear", "hourglass", "rectangle", "inverted_triangle"], material: "cotton", season: ["spring", "summer"], minimal: false, gender: "neutral" },

  // === SCARVES ===
  { name: "Cashmere Wrap Scarf", category: "scarf", subcategory: "wrap", colors: ["#C19A6B", "#FAF0E6"], dominantColor: "#C19A6B", styles: ["classic", "minimalist", "romantic"], priceUsd: 65, retailer: "Mock Store", fitType: "regular", bodyTypes: ["apple", "pear", "hourglass", "rectangle", "inverted_triangle"], material: "cashmere blend", season: ["fall", "winter"], minimal: true, gender: "neutral" },
  { name: "Silk Print Scarf", category: "scarf", subcategory: "silk-scarf", colors: ["#E8A0BF", "#4A90D9", "#FFD700"], dominantColor: "#E8A0BF", styles: ["classic", "romantic", "bohemian", "vintage"], priceUsd: 40, retailer: "Mock Store", fitType: "regular", bodyTypes: ["apple", "pear", "hourglass", "rectangle", "inverted_triangle"], material: "silk", season: ["spring", "summer", "fall"], minimal: false, gender: "feminine" },

  // === BELTS ===
  { name: "Brown Leather Belt", category: "belt", subcategory: "leather-belt", colors: ["#8B4513"], dominantColor: "#8B4513", styles: ["classic", "smart_casual", "preppy"], priceUsd: 35, retailer: "Mock Store", fitType: "regular", bodyTypes: ["apple", "pear", "hourglass", "rectangle", "inverted_triangle"], material: "leather", season: ["spring", "summer", "fall", "winter"], minimal: true, gender: "neutral" },
  { name: "Chain Detail Belt", category: "belt", subcategory: "chain-belt", colors: ["#FFD700", "#1A1A1A"], dominantColor: "#FFD700", styles: ["edgy", "streetwear", "vintage"], priceUsd: 30, retailer: "Mock Store", fitType: "regular", bodyTypes: ["hourglass", "rectangle", "pear"], material: "metal/leather", season: ["spring", "summer", "fall", "winter"], minimal: false, gender: "feminine" },

  // === SUNGLASSES ===
  { name: "Classic Aviator Sunglasses", category: "sunglasses", subcategory: "aviator", colors: ["#FFD700", "#1A1A1A"], dominantColor: "#FFD700", styles: ["classic", "smart_casual", "vintage"], priceUsd: 55, retailer: "Mock Store", fitType: "regular", bodyTypes: ["apple", "pear", "hourglass", "rectangle", "inverted_triangle"], material: "metal/glass", season: ["spring", "summer"], minimal: true, gender: "neutral" },
  { name: "Oversized Square Sunglasses", category: "sunglasses", subcategory: "square", colors: ["#1A1A1A"], dominantColor: "#1A1A1A", styles: ["edgy", "streetwear", "bohemian"], priceUsd: 40, retailer: "Mock Store", fitType: "regular", bodyTypes: ["apple", "pear", "hourglass", "rectangle", "inverted_triangle"], material: "acetate", season: ["spring", "summer"], minimal: false, gender: "feminine" },

  // === WATCHES ===
  { name: "Minimalist Silver Watch", category: "watch", subcategory: "analog", colors: ["#C0C0C0", "#FFFFFF"], dominantColor: "#C0C0C0", styles: ["minimalist", "classic", "smart_casual"], priceUsd: 85, retailer: "Mock Store", fitType: "regular", bodyTypes: ["apple", "pear", "hourglass", "rectangle", "inverted_triangle"], material: "stainless steel", season: ["spring", "summer", "fall", "winter"], minimal: true, gender: "neutral" },
  { name: "Gold Digital Watch", category: "watch", subcategory: "digital", colors: ["#FFD700"], dominantColor: "#FFD700", styles: ["vintage", "streetwear", "edgy"], priceUsd: 60, retailer: "Mock Store", fitType: "regular", bodyTypes: ["apple", "pear", "hourglass", "rectangle", "inverted_triangle"], material: "stainless steel", season: ["spring", "summer", "fall", "winter"], minimal: false, gender: "neutral" },
];

async function seed() {
  console.log("Seeding fashion items...");

  // Clear existing
  sqlite.exec("DELETE FROM fashion_items");

  for (const item of items) {
    db.insert(fashionItems)
      .values({
        id: uuid(),
        name: item.name,
        category: item.category,
        subcategory: item.subcategory,
        colorsJson: JSON.stringify(item.colors),
        dominantColor: item.dominantColor,
        stylesJson: JSON.stringify(item.styles),
        priceUsd: item.priceUsd,
        retailer: item.retailer,
        productUrl: "#",
        imageUrl: `/items/${item.category}/${item.subcategory}.png`,
        fitType: item.fitType,
        bodyTypesJson: JSON.stringify(item.bodyTypes),
        material: item.material,
        seasonsJson: JSON.stringify(item.season),
        minimalAesthetic: item.minimal,
        genderExpression: item.gender,
      })
      .run();
  }

  console.log(`Seeded ${items.length} fashion items.`);
}

seed();
