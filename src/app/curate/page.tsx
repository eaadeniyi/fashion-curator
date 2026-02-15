"use client";

import { useState, useEffect } from "react";
import { usePreferencesStore } from "@/stores/preferences";
import { OutfitCombination } from "@/types/fashion";
import { ColorPalette } from "@/types/color";
import { RecommendResponse } from "@/types/api";
import { OutfitCard } from "@/components/outfit/OutfitCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CuratePage() {
  const [outfits, setOutfits] = useState<OutfitCombination[]>([]);
  const [palette, setPalette] = useState<ColorPalette | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemsConsidered, setItemsConsidered] = useState(0);
  const preferences = usePreferencesStore((s) => s.getPreferences());
  const router = useRouter();

  const fetchRecommendations = async () => {
    if (!preferences) {
      router.push("/quiz");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences }),
      });

      if (!res.ok) throw new Error("Failed to get recommendations");

      const data: RecommendResponse = await res.json();
      setOutfits(data.outfits);
      setPalette(data.palette);
      setItemsConsidered(data.totalItemsConsidered);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-muted animate-spin border-t-violet-500" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">Curating your look...</h2>
          <p className="text-sm text-muted-foreground">
            Our AI stylist is putting together personalized outfits
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-xl font-bold text-red-500">Oops!</h2>
        <p className="text-muted-foreground">{error}</p>
        <div className="flex gap-3">
          <Button onClick={fetchRecommendations}>Try Again</Button>
          <Button variant="outline" onClick={() => router.push("/quiz")}>
            Retake Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Your Curated Outfits</h1>
        <p className="text-muted-foreground">
          {outfits.length} outfit{outfits.length !== 1 ? "s" : ""} curated from{" "}
          {itemsConsidered} items in our catalog
        </p>
        {preferences && (
          <div className="flex flex-wrap gap-2 justify-center text-xs">
            <span className="bg-violet-100 text-violet-700 px-2 py-1 rounded-full">
              {preferences.style}
            </span>
            <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
              {preferences.vibe}
            </span>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {preferences.bodyType}
            </span>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
              ${preferences.budgetRange.min} - ${preferences.budgetRange.max}
            </span>
            <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
              {preferences.preferMinimal ? "Minimal" : "Maximalist"}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {outfits.map((outfit, i) => (
          <OutfitCard key={outfit.id} outfit={outfit} index={i} />
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-8 pb-8">
        <Button onClick={fetchRecommendations} variant="outline">
          Regenerate Outfits
        </Button>
        <Button onClick={() => router.push("/quiz")}>
          Change Preferences
        </Button>
      </div>
    </div>
  );
}
