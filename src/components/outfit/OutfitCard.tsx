"use client";

import { OutfitCombination } from "@/types/fashion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ItemCard } from "./ItemCard";
import { ColorPaletteBar } from "./ColorPaletteBar";

interface OutfitCardProps {
  outfit: OutfitCombination;
  index: number;
}

export function OutfitCard({ outfit, index }: OutfitCardProps) {
  return (
    <Card className="p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold">Outfit {index + 1}</h3>
          <div className="flex gap-2 mt-1">
            <Badge>{outfit.style}</Badge>
            <Badge variant="outline">{outfit.vibe}</Badge>
            {outfit.isMinimal && (
              <Badge variant="secondary">Minimal</Badge>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-violet-600">
            ${outfit.totalPrice}
          </div>
          <div className="text-xs text-muted-foreground">
            total · {outfit.items.length} items
          </div>
        </div>
      </div>

      {/* Color palette */}
      <ColorPaletteBar palette={outfit.palette} />

      <Separator />

      {/* Flat-lay visualization */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Outfit Breakdown</h4>
        <div className="grid gap-2">
          {outfit.items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Visual flat-lay grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {outfit.items.map((item) => (
          <div
            key={item.id}
            className="aspect-square rounded-lg border border-border/50 flex items-center justify-center text-xs text-center p-1"
            style={{
              backgroundColor: item.dominantColor + "20",
              borderColor: item.dominantColor + "60",
            }}
          >
            <div>
              <div
                className="w-6 h-6 rounded-full mx-auto mb-1"
                style={{ backgroundColor: item.dominantColor }}
              />
              <span className="text-[10px] text-muted-foreground leading-tight block">
                {item.subcategory || item.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* AI Reasoning */}
      <div className="space-y-3 text-sm">
        <div>
          <h4 className="font-medium mb-1">Why this works</h4>
          <p className="text-muted-foreground">{outfit.reasoning}</p>
        </div>
        <div>
          <h4 className="font-medium mb-1">Color Story</h4>
          <p className="text-muted-foreground">{outfit.colorStory}</p>
        </div>
        <div>
          <h4 className="font-medium mb-1">Styling Tips</h4>
          <p className="text-muted-foreground">{outfit.stylingTips}</p>
        </div>
      </div>

      {/* Coherence score */}
      <div className="flex items-center gap-2">
        <div className="text-xs text-muted-foreground">Coherence</div>
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"
            style={{ width: `${outfit.coherenceScore}%` }}
          />
        </div>
        <div className="text-xs font-medium">{outfit.coherenceScore}%</div>
      </div>
    </Card>
  );
}
