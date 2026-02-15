"use client";

import { GenderExpression } from "@/types/fashion";
import { usePreferencesStore } from "@/stores/preferences";
import { Card } from "@/components/ui/card";

const genderOptions = [
  {
    value: GenderExpression.FEMININE,
    label: "Feminine",
    description: "Dresses, skirts, blouses, heels, and feminine accessories",
    icon: "✿",
  },
  {
    value: GenderExpression.MASCULINE,
    label: "Masculine",
    description: "Tailored shirts, trousers, boots, and structured pieces",
    icon: "◆",
  },
  {
    value: GenderExpression.NEUTRAL,
    label: "Neutral",
    description: "Gender-neutral pieces, unisex fits, and versatile items",
    icon: "○",
  },
];

export function GenderStep() {
  const { genderExpression, setGenderExpression, nextStep } =
    usePreferencesStore();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">How do you like to dress?</h2>
        <p className="text-muted-foreground">
          This helps us curate the right items for you
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {genderOptions.map((option) => (
          <Card
            key={option.value}
            className={`p-6 cursor-pointer transition-all hover:shadow-md text-center ${
              genderExpression === option.value
                ? "ring-2 ring-violet-500 bg-violet-50 dark:bg-violet-950"
                : "hover:bg-muted/50"
            }`}
            onClick={() => {
              setGenderExpression(option.value);
              setTimeout(nextStep, 300);
            }}
          >
            <div className="text-3xl mb-3">{option.icon}</div>
            <h3 className="font-semibold">{option.label}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {option.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
