"use client";

import { useState } from "react";
import { OutfitCombination, FashionItem, Category, GenderExpression } from "@/types/fashion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ColorPaletteBar } from "./ColorPaletteBar";
import { FashionFigure } from "./FashionFigure";
import { SwapPanel } from "./SwapPanel";

interface OutfitCardProps {
  outfit: OutfitCombination;
  index: number;
  gender: GenderExpression;
  maxBudget: number;
}

export function OutfitCard({ outfit, index, gender, maxBudget }: OutfitCardProps) {
  // Local copy of items — mutations from swaps stay here
  const [currentItems, setCurrentItems] = useState<FashionItem[]>(outfit.items);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [swapCategory, setSwapCategory] = useState<Category | null>(null);
  const [swapOpen, setSwapOpen] = useState(false);

  const totalPrice = currentItems.reduce((s, i) => s + i.priceUsd, 0);

  const currentItemForCategory = swapCategory
    ? currentItems.find((i) => i.category === swapCategory) ?? null
    : null;

  function handleZoneClick(zone: string, category: Category) {
    setActiveZone(zone);
    setSwapCategory(category);
    setSwapOpen(true);
  }

  function handleSwap(newItem: FashionItem) {
    setCurrentItems((prev) => {
      // Remove current item of same category, insert new one
      const filtered = prev.filter((i) => i.category !== newItem.category);
      return [...filtered, newItem];
    });
    setActiveZone(null);
    setSwapCategory(null);
  }

  function handlePanelClose() {
    setSwapOpen(false);
    setActiveZone(null);
  }

  return (
    <>
      <Card className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold">Outfit {index + 1}</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge>{outfit.style}</Badge>
              <Badge variant="outline">{outfit.vibe}</Badge>
              {outfit.isMinimal && <Badge variant="secondary">Minimal</Badge>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-violet-600">${totalPrice.toFixed(0)}</div>
            <div className="text-xs text-muted-foreground">
              {currentItems.length} items
            </div>
          </div>
        </div>

        {/* Color palette — driven by harmony */}
        <ColorPaletteBar palette={outfit.palette} />

        <Separator />

        {/* Main two-column layout: figure + item list */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* LEFT — Fashion figure */}
          <div className="md:w-[220px] shrink-0 flex justify-center">
            <FashionFigure
              outfit={{ items: currentItems }}
              gender={gender}
              activeZone={activeZone}
              onZoneClick={handleZoneClick}
            />
          </div>

          {/* RIGHT — Item list */}
          <div className="flex-1 space-y-2 min-w-0">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Items
            </h4>
            {currentItems.map((item) => (
              <button
                key={item.id}
                className="w-full text-left p-3 rounded-lg border border-border hover:border-violet-300 hover:bg-violet-50/50 dark:hover:bg-violet-950/20 transition-all group"
                onClick={() => {
                  // Find the zone that contains this category
                  const zone = Object.entries(
                    // Inline the map here to avoid import cycle
                    {
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
                    } as Record<string, Category[]>
                  ).find(([, cats]) => cats.includes(item.category));

                  if (zone) handleZoneClick(zone[0], item.category);
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Color dot */}
                  <div
                    className="w-10 h-10 rounded-lg shrink-0 border border-border/50 group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: item.dominantColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-snug truncate">{item.name}</p>
                      <span className="text-sm font-semibold text-violet-600 shrink-0">
                        ${item.priceUsd}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {item.category} · {item.material} · {item.fitType}
                    </p>
                    <div className="flex gap-1 mt-1">
                      {item.colors.slice(0, 5).map((c, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-full border border-border/40"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    swap →
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* AI Insights */}
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-1">Why this works</h4>
            <p className="text-muted-foreground text-xs leading-relaxed">{outfit.reasoning}</p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Color Story</h4>
            <p className="text-muted-foreground text-xs leading-relaxed">{outfit.colorStory}</p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Styling Tips</h4>
            <p className="text-muted-foreground text-xs leading-relaxed">{outfit.stylingTips}</p>
          </div>
        </div>

        {/* Coherence bar */}
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground shrink-0">Coherence</div>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all duration-700"
              style={{ width: `${outfit.coherenceScore}%` }}
            />
          </div>
          <div className="text-xs font-medium shrink-0">{outfit.coherenceScore}%</div>
        </div>
      </Card>

      {/* Swap panel — rendered outside the card to avoid layout clipping */}
      <SwapPanel
        open={swapOpen}
        category={swapCategory}
        currentItem={currentItemForCategory}
        palette={outfit.palette}
        maxBudget={maxBudget}
        onSwap={handleSwap}
        onClose={handlePanelClose}
      />
    </>
  );
}
