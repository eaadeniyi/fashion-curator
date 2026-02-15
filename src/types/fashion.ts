export enum Category {
  TOP = "top",
  BOTTOM = "bottom",
  DRESS = "dress",
  OUTERWEAR = "outerwear",
  SHOES = "shoes",
  SOCKS = "socks",
  BAG = "bag",
  JEWELRY = "jewelry",
  HAT = "hat",
  SCARF = "scarf",
  BELT = "belt",
  SUNGLASSES = "sunglasses",
  WATCH = "watch",
  UNDERWEAR = "underwear",
}

export enum StyleType {
  STREETWEAR = "streetwear",
  MINIMALIST = "minimalist",
  BOHEMIAN = "bohemian",
  CLASSIC = "classic",
  PREPPY = "preppy",
  ATHLEISURE = "athleisure",
  VINTAGE = "vintage",
  EDGY = "edgy",
  ROMANTIC = "romantic",
  SMART_CASUAL = "smart_casual",
}

export enum VibeType {
  CASUAL_FRIDAY = "casual_friday",
  DATE_NIGHT = "date_night",
  BUSINESS_MEETING = "business_meeting",
  BRUNCH = "brunch",
  FESTIVAL = "festival",
  COCKTAIL_PARTY = "cocktail_party",
  EVERYDAY = "everyday",
  WORKOUT = "workout",
  TRAVEL = "travel",
  FORMAL_EVENT = "formal_event",
}

export enum BodyType {
  APPLE = "apple",
  PEAR = "pear",
  HOURGLASS = "hourglass",
  RECTANGLE = "rectangle",
  INVERTED_TRIANGLE = "inverted_triangle",
}

export enum GenderExpression {
  MASCULINE = "masculine",
  FEMININE = "feminine",
  NEUTRAL = "neutral",
}

export interface FashionItem {
  id: string;
  name: string;
  category: Category;
  subcategory: string;
  colors: string[];
  dominantColor: string;
  styles: StyleType[];
  priceUsd: number;
  retailer: string;
  productUrl: string;
  imageUrl: string;
  fitType: string;
  bodyTypeCompatibility: BodyType[];
  material: string;
  season: ("spring" | "summer" | "fall" | "winter")[];
  minimalAesthetic: boolean;
  genderExpression: GenderExpression;
}

export interface OutfitCombination {
  id: string;
  items: FashionItem[];
  palette: import("./color").ColorPalette;
  totalPrice: number;
  style: StyleType;
  vibe: VibeType;
  coherenceScore: number;
  bodyType: BodyType;
  isMinimal: boolean;
  reasoning: string;
  colorStory: string;
  stylingTips: string;
}
