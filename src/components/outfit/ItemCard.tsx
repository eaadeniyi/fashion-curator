"use client";

import { FashionItem } from "@/types/fashion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ItemCardProps {
  item: FashionItem;
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Card className="p-3 flex gap-3 items-start">
      {/* Color swatch as placeholder for image */}
      <div
        className="w-14 h-14 rounded-lg shrink-0 border border-border/50"
        style={{ backgroundColor: item.dominantColor }}
      />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium truncate">{item.name}</h4>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="secondary" className="text-xs">
            {item.category}
          </Badge>
          <span className="text-sm font-semibold text-violet-600">
            ${item.priceUsd}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {item.material} · {item.fitType} fit
        </p>
      </div>
      {/* Color chips */}
      <div className="flex gap-1 shrink-0">
        {item.colors.slice(0, 3).map((color, i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full border border-border/50"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </Card>
  );
}
