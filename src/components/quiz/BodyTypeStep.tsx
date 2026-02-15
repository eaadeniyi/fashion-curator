"use client";

import { BodyType } from "@/types/fashion";
import { usePreferencesStore } from "@/stores/preferences";
import { getBodyTypeDescription } from "@/lib/body-type-rules";
import { Card } from "@/components/ui/card";

const bodyTypeOptions = [
  { value: BodyType.APPLE, label: "Apple", icon: "🍎" },
  { value: BodyType.PEAR, label: "Pear", icon: "🍐" },
  { value: BodyType.HOURGLASS, label: "Hourglass", icon: "⌛" },
  { value: BodyType.RECTANGLE, label: "Rectangle", icon: "▬" },
  { value: BodyType.INVERTED_TRIANGLE, label: "Inverted Triangle", icon: "▽" },
];

export function BodyTypeStep() {
  const { bodyType, setBodyType, nextStep } = usePreferencesStore();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">What's your body shape?</h2>
        <p className="text-muted-foreground">
          We'll recommend fits that flatter your frame
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
        {bodyTypeOptions.map((option) => (
          <Card
            key={option.value}
            className={`p-5 cursor-pointer transition-all hover:shadow-md text-center ${
              bodyType === option.value
                ? "ring-2 ring-violet-500 bg-violet-50 dark:bg-violet-950"
                : "hover:bg-muted/50"
            }`}
            onClick={() => {
              setBodyType(option.value);
              setTimeout(nextStep, 300);
            }}
          >
            <div className="text-3xl mb-2">{option.icon}</div>
            <h3 className="font-semibold text-sm">{option.label}</h3>
            <p className="text-xs text-muted-foreground mt-2">
              {getBodyTypeDescription(option.value)}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
