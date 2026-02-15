"use client";

import { usePreferencesStore } from "@/stores/preferences";
import { GenderStep } from "@/components/quiz/GenderStep";
import { StyleStep } from "@/components/quiz/StyleStep";
import { VibeStep } from "@/components/quiz/VibeStep";
import { BodyTypeStep } from "@/components/quiz/BodyTypeStep";
import { BudgetStep } from "@/components/quiz/BudgetStep";
import { ColorStep } from "@/components/quiz/ColorStep";
import { AestheticToggle } from "@/components/quiz/AestheticToggle";
import { Button } from "@/components/ui/button";

const steps = [
  { component: GenderStep, label: "Expression" },
  { component: StyleStep, label: "Style" },
  { component: VibeStep, label: "Occasion" },
  { component: BodyTypeStep, label: "Body Type" },
  { component: BudgetStep, label: "Budget" },
  { component: ColorStep, label: "Colors" },
  { component: AestheticToggle, label: "Aesthetic" },
];

export default function QuizPage() {
  const { currentStep, prevStep } = usePreferencesStore();
  const StepComponent = steps[currentStep].component;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`text-xs font-medium transition-colors ${
                i <= currentStep
                  ? "text-violet-600"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </div>
          ))}
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all duration-500"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Back button */}
      {currentStep > 0 && (
        <Button
          variant="ghost"
          onClick={prevStep}
          className="mb-4"
        >
          &larr; Back
        </Button>
      )}

      {/* Step content */}
      <StepComponent />
    </div>
  );
}
