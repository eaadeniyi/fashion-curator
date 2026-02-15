"use client";

import { usePreferencesStore } from "@/stores/preferences";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function AestheticToggle() {
  const { preferMinimal, setPreferMinimal, getPreferences } =
    usePreferencesStore();
  const router = useRouter();

  const handleSubmit = () => {
    const prefs = getPreferences();
    if (prefs) {
      router.push("/curate");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Final touch</h2>
        <p className="text-muted-foreground">
          How much do you want in your outfit?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
        <Card
          className={`p-6 cursor-pointer transition-all text-center ${
            preferMinimal
              ? "ring-2 ring-violet-500 bg-violet-50 dark:bg-violet-950"
              : "hover:bg-muted/50"
          }`}
          onClick={() => setPreferMinimal(true)}
        >
          <div className="text-4xl mb-3">◯</div>
          <h3 className="font-semibold">Minimal</h3>
          <p className="text-xs text-muted-foreground mt-2">
            Clean, simple, fewer pieces. Quality over quantity. Muted tones and
            essential items only.
          </p>
        </Card>

        <Card
          className={`p-6 cursor-pointer transition-all text-center ${
            !preferMinimal
              ? "ring-2 ring-violet-500 bg-violet-50 dark:bg-violet-950"
              : "hover:bg-muted/50"
          }`}
          onClick={() => setPreferMinimal(false)}
        >
          <div className="text-4xl mb-3">✦</div>
          <h3 className="font-semibold">Maximalist</h3>
          <p className="text-xs text-muted-foreground mt-2">
            Layered, accessorized, bold. More pieces, patterns, textures, and
            statement accessories.
          </p>
        </Card>
      </div>

      <div className="flex justify-center pt-4">
        <Button onClick={handleSubmit} size="lg" className="px-12">
          Curate My Outfit
        </Button>
      </div>
    </div>
  );
}
