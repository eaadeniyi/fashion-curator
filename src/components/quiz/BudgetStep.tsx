"use client";

import { usePreferencesStore } from "@/stores/preferences";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const budgetPresets = [
  { label: "Budget-Friendly", min: 0, max: 50, description: "Under $50 per item" },
  { label: "Mid-Range", min: 20, max: 100, description: "$20 - $100 per item" },
  { label: "Premium", min: 50, max: 200, description: "$50 - $200 per item" },
  { label: "Luxury", min: 100, max: 500, description: "$100+ per item" },
  { label: "No Limit", min: 0, max: 9999, description: "Show me everything" },
];

export function BudgetStep() {
  const { budgetRange, setBudgetRange, nextStep } = usePreferencesStore();

  const isSelected = (preset: (typeof budgetPresets)[number]) =>
    budgetRange.min === preset.min && budgetRange.max === preset.max;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">What's your budget?</h2>
        <p className="text-muted-foreground">
          Price range per individual item
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
        {budgetPresets.map((preset) => (
          <Card
            key={preset.label}
            className={`p-5 cursor-pointer transition-all hover:shadow-md text-center ${
              isSelected(preset)
                ? "ring-2 ring-violet-500 bg-violet-50 dark:bg-violet-950"
                : "hover:bg-muted/50"
            }`}
            onClick={() => {
              setBudgetRange({ min: preset.min, max: preset.max });
            }}
          >
            <h3 className="font-semibold text-sm">{preset.label}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {preset.description}
            </p>
          </Card>
        ))}
      </div>
      <div className="flex justify-center">
        <Button onClick={nextStep} size="lg">
          Continue
        </Button>
      </div>
    </div>
  );
}
