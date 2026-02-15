"use client";

import { VibeType } from "@/types/fashion";
import { usePreferencesStore } from "@/stores/preferences";
import { Card } from "@/components/ui/card";

const vibeOptions = [
  { value: VibeType.EVERYDAY, label: "Everyday", description: "Your go-to daily look" },
  { value: VibeType.CASUAL_FRIDAY, label: "Casual Friday", description: "Relaxed but put-together" },
  { value: VibeType.DATE_NIGHT, label: "Date Night", description: "Impressive and confident" },
  { value: VibeType.BUSINESS_MEETING, label: "Business Meeting", description: "Professional and sharp" },
  { value: VibeType.BRUNCH, label: "Brunch", description: "Chic and effortless" },
  { value: VibeType.FESTIVAL, label: "Festival", description: "Fun, expressive, standout" },
  { value: VibeType.COCKTAIL_PARTY, label: "Cocktail Party", description: "Elevated and polished" },
  { value: VibeType.WORKOUT, label: "Workout", description: "Active and functional" },
  { value: VibeType.TRAVEL, label: "Travel", description: "Comfortable yet stylish" },
  { value: VibeType.FORMAL_EVENT, label: "Formal Event", description: "Black-tie and elegant" },
];

export function VibeStep() {
  const { vibe, setVibe, nextStep } = usePreferencesStore();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">What's the occasion?</h2>
        <p className="text-muted-foreground">
          Where are you heading in this outfit?
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
        {vibeOptions.map((option) => (
          <Card
            key={option.value}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              vibe === option.value
                ? "ring-2 ring-violet-500 bg-violet-50 dark:bg-violet-950"
                : "hover:bg-muted/50"
            }`}
            onClick={() => {
              setVibe(option.value);
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
