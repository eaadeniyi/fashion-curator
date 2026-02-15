import { NextRequest, NextResponse } from "next/server";
import { buildPalette } from "@/lib/color-engine";
import { HarmonyMode } from "@/types/color";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hex = searchParams.get("hex") || "4A90D9";
  const mode = (searchParams.get("mode") || "analogic") as HarmonyMode;
  const count = parseInt(searchParams.get("count") || "5");

  try {
    const palette = await buildPalette(`#${hex.replace("#", "")}`, mode);
    return NextResponse.json({ palette });
  } catch (error) {
    console.error("Color API error:", error);
    return NextResponse.json(
      { error: "Failed to generate color palette" },
      { status: 500 }
    );
  }
}
