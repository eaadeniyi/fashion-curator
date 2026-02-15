"use client";

import { useState, useEffect } from "react";
import { usePreferencesStore } from "@/stores/preferences";
import { HarmonyMode } from "@/types/color";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const presetColors = [
  { hex: "#4A90D9", name: "Blue" },
  { hex: "#E74C3C", name: "Red" },
  { hex: "#2ECC71", name: "Green" },
  { hex: "#1A1A1A", name: "Black" },
  { hex: "#F5F5F5", name: "White" },
  { hex: "#9B59B6", name: "Purple" },
  { hex: "#E67E22", name: "Orange" },
  { hex: "#E8A0BF", name: "Pink" },
  { hex: "#C19A6B", name: "Camel" },
  { hex: "#556B2F", name: "Olive" },
  { hex: "#1B3A5C", name: "Navy" },
  { hex: "#722F37", name: "Burgundy" },
];

const harmonyModes: { value: HarmonyMode; label: string; description: string }[] = [
  { value: "analogic", label: "Analogous", description: "Colors next to each other on the wheel — harmonious" },
  { value: "complement", label: "Complementary", description: "Opposite colors — bold contrast" },
  { value: "triad", label: "Triadic", description: "Three evenly spaced colors — vibrant" },
  { value: "monochrome", label: "Monochrome", description: "Shades of one color — cohesive" },
  { value: "quad", label: "Tetradic", description: "Four colors forming a rectangle — rich" },
  { value: "analogic-complement", label: "Split Complement", description: "Analogous + complement — balanced" },
];

interface PalettePreview {
  swatches: { hex: string; name: string }[];
}

export function ColorStep() {
  const { baseColor, setBaseColor, harmonyMode, setHarmonyMode, nextStep } =
    usePreferencesStore();
  const [preview, setPreview] = useState<PalettePreview | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPalette = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/colors?hex=${baseColor.replace("#", "")}&mode=${harmonyMode}`
        );
        const data = await res.json();
        if (data.palette?.swatches) {
          setPreview({
            swatches: data.palette.swatches.map((s: { hex: string; name: string }) => ({
              hex: s.hex,
              name: s.name,
            })),
          });
        }
      } catch {
        setPreview(null);
      }
      setLoading(false);
    };
    fetchPalette();
  }, [baseColor, harmonyMode]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose your colors</h2>
        <p className="text-muted-foreground">
          Pick a base color and harmony style for your outfit palette
        </p>
      </div>

      {/* Base Color */}
      <div className="max-w-3xl mx-auto space-y-4">
        <Label className="text-sm font-medium">Base Color</Label>
        <div className="flex flex-wrap gap-2">
          {presetColors.map((color) => (
            <button
              key={color.hex}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                baseColor === color.hex
                  ? "border-violet-500 scale-110 shadow-lg"
                  : "border-transparent hover:scale-105"
              }`}
              style={{ backgroundColor: color.hex }}
              onClick={() => setBaseColor(color.hex)}
              title={color.name}
            />
          ))}
          <div className="flex items-center gap-2 ml-2">
            <Input
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="w-10 h-10 p-0 border-0 cursor-pointer"
            />
            <span className="text-xs text-muted-foreground">Custom</span>
          </div>
        </div>
      </div>

      {/* Harmony Mode */}
      <div className="max-w-3xl mx-auto space-y-4">
        <Label className="text-sm font-medium">Color Harmony</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {harmonyModes.map((mode) => (
            <Card
              key={mode.value}
              className={`p-3 cursor-pointer transition-all ${
                harmonyMode === mode.value
                  ? "ring-2 ring-violet-500 bg-violet-50 dark:bg-violet-950"
                  : "hover:bg-muted/50"
              }`}
              onClick={() => setHarmonyMode(mode.value)}
            >
              <h3 className="font-semibold text-sm">{mode.label}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {mode.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Palette Preview */}
      {preview && (
        <div className="max-w-3xl mx-auto space-y-2">
          <Label className="text-sm font-medium">Your Palette Preview</Label>
          <div className="flex rounded-lg overflow-hidden h-16 shadow-sm">
            {preview.swatches.map((swatch, i) => (
              <div
                key={i}
                className="flex-1 flex items-end justify-center pb-1 transition-all hover:flex-[2]"
                style={{ backgroundColor: swatch.hex }}
              >
                <span
                  className="text-[10px] font-medium px-1 rounded"
                  style={{
                    color:
                      parseInt(swatch.hex.replace("#", ""), 16) > 0x808080
                        ? "#000"
                        : "#fff",
                  }}
                >
                  {swatch.name}
                </span>
              </div>
            ))}
          </div>
          {loading && (
            <p className="text-xs text-muted-foreground text-center">
              Generating palette...
            </p>
          )}
        </div>
      )}

      <div className="flex justify-center">
        <Button onClick={nextStep} size="lg">
          Continue
        </Button>
      </div>
    </div>
  );
}
