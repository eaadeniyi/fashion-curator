"use client";

import { FashionItem, Category, GenderExpression, OutfitCombination } from "@/types/fashion";

// Maps SVG zone IDs to the categories they represent
const ZONE_CATEGORY_MAP: Record<string, Category[]> = {
  "zone-head":   [Category.HAT],
  "zone-eyes":   [Category.SUNGLASSES],
  "zone-ears":   [Category.JEWELRY],
  "zone-neck":   [Category.SCARF, Category.JEWELRY],
  "zone-torso":  [Category.TOP, Category.DRESS, Category.OUTERWEAR],
  "zone-waist":  [Category.BELT],
  "zone-wrist":  [Category.WATCH, Category.JEWELRY],
  "zone-hand":   [Category.BAG],
  "zone-legs":   [Category.BOTTOM, Category.DRESS],
  "zone-feet":   [Category.SHOES, Category.SOCKS],
};

// Human-readable zone labels shown in tooltips
const ZONE_LABELS: Record<string, string> = {
  "zone-head":  "Hat",
  "zone-eyes":  "Sunglasses",
  "zone-ears":  "Earrings / Jewelry",
  "zone-neck":  "Scarf / Necklace",
  "zone-torso": "Top / Outerwear",
  "zone-waist": "Belt",
  "zone-wrist": "Watch / Bracelet",
  "zone-hand":  "Bag",
  "zone-legs":  "Bottoms",
  "zone-feet":  "Shoes / Socks",
};

function getItemForZone(zone: string, items: FashionItem[]): FashionItem | null {
  const categories = ZONE_CATEGORY_MAP[zone];
  if (!categories) return null;
  // For zones that map to multiple categories (e.g. neck → scarf OR jewelry),
  // pick the first item from the outfit that fits any of those categories.
  return items.find((item) => categories.includes(item.category)) ?? null;
}

// Hex color + 99 = ~60% opacity
function zoneColor(item: FashionItem | null, active: boolean): string {
  if (!item) return "transparent";
  const hex = item.dominantColor.replace("#", "");
  return `#${hex}${active ? "cc" : "88"}`;
}

interface FashionFigureProps {
  outfit: Pick<OutfitCombination, "items">;
  gender: GenderExpression;
  activeZone: string | null;
  onZoneClick: (zone: string, category: Category) => void;
}

export function FashionFigure({ outfit, gender, activeZone, onZoneClick }: FashionFigureProps) {
  const isFeminine = gender === GenderExpression.FEMININE;
  const src = isFeminine
    ? "/mannequins/female-sketch.svg"
    : "/mannequins/male-sketch.svg";

  const handleZoneClick = (zoneId: string) => {
    const categories = ZONE_CATEGORY_MAP[zoneId];
    if (!categories || categories.length === 0) return;
    // Use the primary category for the zone
    onZoneClick(zoneId, categories[0]);
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      <p className="text-xs text-muted-foreground mb-2">
        Click a zone on the figure to swap items
      </p>
      <div className="relative w-[220px]" style={{ aspectRatio: "220/520" }}>
        {/* Base SVG illustration */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Fashion figure"
          className="w-full h-full pointer-events-none select-none"
          draggable={false}
        />

        {/* Interactive overlay SVG — same viewBox, layered on top */}
        <svg
          viewBox="0 0 220 520"
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {Object.entries(ZONE_CATEGORY_MAP).map(([zoneId]) => {
            const item = getItemForZone(zoneId, outfit.items);
            const isActive = activeZone === zoneId;
            const hasItem = item !== null;
            const fill = zoneColor(item, isActive);

            return (
              <ZoneOverlay
                key={zoneId}
                zoneId={zoneId}
                fill={fill}
                hasItem={hasItem}
                isActive={isActive}
                label={ZONE_LABELS[zoneId]}
                item={item}
                onClick={() => handleZoneClick(zoneId)}
              />
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-1.5 justify-center max-w-[220px]">
        {outfit.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-1 text-[10px] text-muted-foreground"
          >
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.dominantColor }}
            />
            <span>{item.subcategory || item.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Individual zone overlay shape — matches the zone geometry in the SVG
function ZoneOverlay({
  zoneId,
  fill,
  hasItem,
  isActive,
  label,
  item,
  onClick,
}: {
  zoneId: string;
  fill: string;
  hasItem: boolean;
  isActive: boolean;
  label: string;
  item: FashionItem | null;
  onClick: () => void;
}) {
  const cursorClass = "cursor-pointer";
  const strokeColor = isActive ? "#7c3aed" : hasItem ? "#00000022" : "#00000011";
  const strokeWidth = isActive ? 2 : 0.5;

  // Shared props for all zone shapes
  const sharedProps = {
    fill,
    stroke: strokeColor,
    strokeWidth,
    onClick,
    className: cursorClass,
    role: "button" as const,
    "aria-label": `${label}${item ? `: ${item.name}` : " (empty)"}`,
    style: { transition: "fill 0.2s, stroke 0.2s" },
  };

  // Return the appropriate shape for each zone, matching the SVG geometry
  switch (zoneId) {
    case "zone-head":
      return <ellipse {...sharedProps} cx="110" cy={isFeminine(zoneId) ? 38 : 36} rx="28" ry="32" />;
    case "zone-eyes":
      return <rect {...sharedProps} x="88" y="42" width="44" height="14" rx="7" />;
    case "zone-ears":
      return <circle {...sharedProps} cx="82" cy="58" r="10" />;
    case "zone-neck":
      return <rect {...sharedProps} x="96" y="70" width="28" height="20" rx="4" />;
    case "zone-torso":
      return (
        <path
          {...sharedProps}
          d="M74 92 Q56 100 54 142 L60 202 Q82 214 110 216 Q138 214 160 202 L166 142 Q164 100 146 92 Q130 84 110 84 Q90 84 74 92Z"
        />
      );
    case "zone-waist":
      return <rect {...sharedProps} x="64" y="202" width="92" height="18" rx="4" />;
    case "zone-wrist":
      return <rect {...sharedProps} x="38" y="196" width="18" height="14" rx="3" />;
    case "zone-hand":
      return (
        <path
          {...sharedProps}
          d="M160 212 Q176 224 178 252 Q176 266 162 260 L156 224 Z"
        />
      );
    case "zone-legs":
      return (
        <path
          {...sharedProps}
          d="M64 220 Q60 265 58 325 L62 390 L102 390 L110 335 L118 390 L158 390 L162 325 Q160 265 156 220 Z"
        />
      );
    case "zone-feet":
      return (
        <path
          {...sharedProps}
          d="M58 392 Q54 412 56 430 Q62 444 82 442 Q100 440 102 426 L102 392 Z
             M118 392 L118 426 Q120 440 138 442 Q158 444 164 430 Q166 412 162 392 Z"
        />
      );
    default:
      return null;
  }
}

// Helper to distinguish female-specific geometry adjustments
function isFeminine(zoneId: string): boolean {
  // This is a simple helper used within the ZoneOverlay switch.
  // In practice the parent component decides which SVG to load.
  return false; // overlay shapes are gender-neutral approximations
}
