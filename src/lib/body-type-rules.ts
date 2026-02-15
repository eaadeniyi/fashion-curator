import { BodyType } from "@/types/fashion";

export interface FitRecommendation {
  preferredFits: string[];
  avoidFits: string[];
  preferredNecklines: string[];
  preferredSilhouettes: string[];
  notes: string;
}

export const bodyTypeRules: Record<BodyType, FitRecommendation> = {
  [BodyType.APPLE]: {
    preferredFits: ["relaxed", "a-line", "empire", "structured"],
    avoidFits: ["tight", "bodycon", "clingy"],
    preferredNecklines: ["v-neck", "scoop", "wrap"],
    preferredSilhouettes: ["a-line", "empire waist", "fit-and-flare"],
    notes:
      "Draw attention upward with statement necklaces and structured shoulders. Empire waists and A-line shapes create a flattering silhouette.",
  },
  [BodyType.PEAR]: {
    preferredFits: ["bootcut", "wide-leg", "a-line", "fitted-top"],
    avoidFits: ["skinny-bottom", "pencil-skirt"],
    preferredNecklines: ["boat", "off-shoulder", "square"],
    preferredSilhouettes: ["a-line", "wide-leg", "statement-top"],
    notes:
      "Balance proportions with brighter or detailed tops and darker bottoms. Boat necks and statement sleeves draw the eye upward.",
  },
  [BodyType.HOURGLASS]: {
    preferredFits: ["wrap", "belted", "fitted", "tailored"],
    avoidFits: ["boxy", "shapeless", "oversized"],
    preferredNecklines: ["v-neck", "wrap", "sweetheart"],
    preferredSilhouettes: ["wrap", "belted", "bodycon", "fit-and-flare"],
    notes:
      "Wrap dresses and belted pieces highlight your natural waist. Fitted cuts that follow your curves work beautifully.",
  },
  [BodyType.RECTANGLE]: {
    preferredFits: ["layered", "peplum", "belted", "structured"],
    avoidFits: ["straight", "column"],
    preferredNecklines: ["scoop", "cowl", "ruffle"],
    preferredSilhouettes: ["layered", "peplum", "fit-and-flare", "belted"],
    notes:
      "Create curves with layering, peplum tops, and belted waists. Ruffles and texture add dimension to your frame.",
  },
  [BodyType.INVERTED_TRIANGLE]: {
    preferredFits: ["wide-leg", "a-line", "relaxed-top", "v-neck"],
    avoidFits: ["shoulder-pad", "boat-neck", "puff-sleeve"],
    preferredNecklines: ["v-neck", "deep-v", "halter"],
    preferredSilhouettes: ["wide-leg", "a-line", "flared-bottom"],
    notes:
      "Balance broader shoulders with volume on the bottom. Wide-leg pants, A-line skirts, and V-necks create harmony.",
  },
};

export function getBodyTypeDescription(bodyType: BodyType): string {
  const descriptions: Record<BodyType, string> = {
    [BodyType.APPLE]:
      "Broader midsection with slimmer legs and arms. Weight tends to gather around the middle.",
    [BodyType.PEAR]:
      "Narrower shoulders with wider hips and thighs. Lower body is broader than upper body.",
    [BodyType.HOURGLASS]:
      "Balanced shoulders and hips with a defined, narrower waist.",
    [BodyType.RECTANGLE]:
      "Shoulders, waist, and hips are similar in width. Evenly proportioned frame.",
    [BodyType.INVERTED_TRIANGLE]:
      "Broader shoulders tapering to narrower hips. Athletic build with wider upper body.",
  };
  return descriptions[bodyType];
}
