"use client";

import { ColorPalette } from "@/types/color";

interface ColorPaletteBarProps {
  palette: ColorPalette;
}

export function ColorPaletteBar({ palette }: ColorPaletteBarProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">
        Color Palette — {palette.harmonyMode}
      </h3>
      <div className="flex rounded-lg overflow-hidden h-10 shadow-sm">
        {palette.swatches.map((swatch, i) => (
          <div
            key={i}
            className="flex-1 flex items-center justify-center transition-all hover:flex-[2] cursor-default"
            style={{ backgroundColor: swatch.hex }}
            title={`${swatch.name} (${swatch.hex})`}
          >
            <span
              className="text-[9px] font-medium opacity-0 hover:opacity-100 transition-opacity"
              style={{
                color:
                  parseInt(swatch.hex.replace("#", ""), 16) > 0x808080
                    ? "#000"
                    : "#fff",
              }}
            >
              {swatch.hex}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-1">
        {palette.neutrals.map((hex, i) => (
          <div
            key={i}
            className="w-6 h-6 rounded border border-border/50"
            style={{ backgroundColor: hex }}
            title={hex}
          />
        ))}
        <span className="text-xs text-muted-foreground self-center ml-1">
          neutrals
        </span>
      </div>
    </div>
  );
}
