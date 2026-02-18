"use client";

import { FashionItem, Category } from "@/types/fashion";
import { ColorPalette } from "@/types/color";
import { colorMatchScore } from "@/lib/color-engine";
import { catalogItems } from "@/lib/catalog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const CATEGORY_LABELS: Record<Category, string> = {
  [Category.TOP]: "Top",
  [Category.BOTTOM]: "Bottoms",
  [Category.DRESS]: "Dress",
  [Category.OUTERWEAR]: "Outerwear",
  [Category.SHOES]: "Shoes",
  [Category.SOCKS]: "Socks",
  [Category.BAG]: "Bag",
  [Category.JEWELRY]: "Jewelry",
  [Category.HAT]: "Hat",
  [Category.SCARF]: "Scarf",
  [Category.BELT]: "Belt",
  [Category.SUNGLASSES]: "Sunglasses",
  [Category.WATCH]: "Watch",
  [Category.UNDERWEAR]: "Underwear",
};

function getAlternatives(
  category: Category,
  palette: ColorPalette,
  maxBudget: number,
  currentItemId: string
): FashionItem[] {
  return catalogItems
    .filter(
      (item) =>
        item.category === category &&
        item.id !== currentItemId &&
        item.priceUsd <= maxBudget &&
        colorMatchScore(item.dominantColor, palette) >= 30
    )
    .sort((a, b) => {
      // Sort by color match score descending
      const scoreA = colorMatchScore(a.dominantColor, palette);
      const scoreB = colorMatchScore(b.dominantColor, palette);
      return scoreB - scoreA;
    });
}

interface SwapPanelProps {
  open: boolean;
  category: Category | null;
  currentItem: FashionItem | null;
  palette: ColorPalette;
  maxBudget: number;
  onSwap: (newItem: FashionItem) => void;
  onClose: () => void;
}

export function SwapPanel({
  open,
  category,
  currentItem,
  palette,
  maxBudget,
  onSwap,
  onClose,
}: SwapPanelProps) {
  if (!category) return null;

  const alternatives = getAlternatives(
    category,
    palette,
    maxBudget,
    currentItem?.id ?? ""
  );

  const label = CATEGORY_LABELS[category] ?? category;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:w-96 p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>Swap your {label}</SheetTitle>
          {currentItem && (
            <p className="text-sm text-muted-foreground">
              Currently: <span className="font-medium text-foreground">{currentItem.name}</span>
            </p>
          )}
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="px-4 py-4 space-y-2">
            {alternatives.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No alternatives found that match your color palette and budget.
              </div>
            ) : (
              <>
                <p className="text-xs text-muted-foreground mb-3">
                  {alternatives.length} options that match your palette
                </p>
                {alternatives.map((item) => {
                  const score = Math.round(colorMatchScore(item.dominantColor, palette));
                  return (
                    <button
                      key={item.id}
                      className="w-full text-left p-3 rounded-lg border border-border hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-all group"
                      onClick={() => {
                        onSwap(item);
                        onClose();
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {/* Color preview */}
                        <div
                          className="w-12 h-12 rounded-lg shrink-0 border border-border/50"
                          style={{ backgroundColor: item.dominantColor }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium leading-tight">{item.name}</p>
                            <span className="text-sm font-bold text-violet-600 shrink-0">
                              ${item.priceUsd}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.material} · {item.fitType} fit
                          </p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <div className="flex gap-0.5">
                              {item.colors.slice(0, 4).map((c, i) => (
                                <div
                                  key={i}
                                  className="w-3 h-3 rounded-full border border-border/50"
                                  style={{ backgroundColor: c }}
                                />
                              ))}
                            </div>
                            <Badge variant="secondary" className="text-[10px] px-1 py-0">
                              {score}% match
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
