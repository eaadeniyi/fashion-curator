"use client";

import { StyleType } from "@/types/fashion";
import { usePreferencesStore } from "@/stores/preferences";
import { Card } from "@/components/ui/card";

const styleOptions = [
  { value: StyleType.MINIMALIST, label: "Minimalist", description: "Clean lines, neutral tones, less is more", color: "bg-stone-100" },
  { value: StyleType.STREETWEAR, label: "Streetwear", description: "Urban, graphic tees, sneakers, hoodies", color: "bg-zinc-200" },
  { value: StyleType.CLASSIC, label: "Classic", description: "Timeless pieces, tailored fits, elegant", color: "bg-amber-50" },
  { value: StyleType.BOHEMIAN, label: "Bohemian", description: "Flowy, earthy, artistic, free-spirited", color: "bg-orange-50" },
  { value: StyleType.PREPPY, label: "Preppy", description: "Polished, collared, clean-cut, refined", color: "bg-blue-50" },
  { value: StyleType.ATHLEISURE, label: "Athleisure", description: "Sporty comfort meets everyday style", color: "bg-green-50" },
  { value: StyleType.VINTAGE, label: "Vintage", description: "Retro-inspired, thrifted vibes, nostalgic", color: "bg-rose-50" },
  { value: StyleType.EDGY, label: "Edgy", description: "Leather, dark tones, bold statements", color: "bg-gray-200" },
  { value: StyleType.ROMANTIC, label: "Romantic", description: "Soft fabrics, florals, delicate details", color: "bg-pink-50" },
  { value: StyleType.SMART_CASUAL, label: "Smart Casual", description: "Between formal and casual, polished ease", color: "bg-slate-50" },
];

export function StyleStep() {
  const { style, setStyle, nextStep } = usePreferencesStore();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">What's your style?</h2>
        <p className="text-muted-foreground">
          Pick the aesthetic that speaks to you
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
        {styleOptions.map((option) => (
          <Card
            key={option.value}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${option.color} ${
              style === option.value
                ? "ring-2 ring-violet-500"
                : ""
            }`}
            onClick={() => {
              setStyle(option.value);
              setTimeout(nextStep, 300);
            }}
          >
            <h3 className="font-semibold text-sm">{option.label}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {option.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
