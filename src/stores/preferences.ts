import { create } from "zustand";
import {
  StyleType,
  VibeType,
  BodyType,
  GenderExpression,
} from "@/types/fashion";
import { HarmonyMode } from "@/types/color";
import { UserPreferences } from "@/types/preferences";

interface PreferencesState {
  currentStep: number;
  style: StyleType | null;
  vibe: VibeType | null;
  bodyType: BodyType | null;
  budgetRange: { min: number; max: number };
  baseColor: string;
  harmonyMode: HarmonyMode;
  preferMinimal: boolean;
  genderExpression: GenderExpression | null;

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStyle: (style: StyleType) => void;
  setVibe: (vibe: VibeType) => void;
  setBodyType: (bodyType: BodyType) => void;
  setBudgetRange: (range: { min: number; max: number }) => void;
  setBaseColor: (color: string) => void;
  setHarmonyMode: (mode: HarmonyMode) => void;
  setPreferMinimal: (minimal: boolean) => void;
  setGenderExpression: (gender: GenderExpression) => void;
  getPreferences: () => UserPreferences | null;
  reset: () => void;
}

const TOTAL_STEPS = 7;

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  currentStep: 0,
  style: null,
  vibe: null,
  bodyType: null,
  budgetRange: { min: 0, max: 300 },
  baseColor: "#4A90D9",
  harmonyMode: "analogic",
  preferMinimal: false,
  genderExpression: null,

  setStep: (step) => set({ currentStep: Math.min(step, TOTAL_STEPS - 1) }),
  nextStep: () =>
    set((s) => ({ currentStep: Math.min(s.currentStep + 1, TOTAL_STEPS - 1) })),
  prevStep: () =>
    set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),
  setStyle: (style) => set({ style }),
  setVibe: (vibe) => set({ vibe }),
  setBodyType: (bodyType) => set({ bodyType }),
  setBudgetRange: (budgetRange) => set({ budgetRange }),
  setBaseColor: (baseColor) => set({ baseColor }),
  setHarmonyMode: (harmonyMode) => set({ harmonyMode }),
  setPreferMinimal: (preferMinimal) => set({ preferMinimal }),
  setGenderExpression: (genderExpression) => set({ genderExpression }),

  getPreferences: () => {
    const s = get();
    if (!s.style || !s.vibe || !s.bodyType || !s.genderExpression) return null;
    return {
      style: s.style,
      vibe: s.vibe,
      bodyType: s.bodyType,
      budgetRange: s.budgetRange,
      baseColor: s.baseColor,
      harmonyMode: s.harmonyMode,
      preferMinimal: s.preferMinimal,
      genderExpression: s.genderExpression,
    };
  },

  reset: () =>
    set({
      currentStep: 0,
      style: null,
      vibe: null,
      bodyType: null,
      budgetRange: { min: 0, max: 300 },
      baseColor: "#4A90D9",
      harmonyMode: "analogic",
      preferMinimal: false,
      genderExpression: null,
    }),
}));
