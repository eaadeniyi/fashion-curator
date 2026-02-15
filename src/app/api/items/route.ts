import { NextRequest, NextResponse } from "next/server";
import { filterItems, getAllItems } from "@/lib/fashion-data";
import { StyleType, BodyType, GenderExpression } from "@/types/fashion";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const style = searchParams.get("style") as StyleType | null;
  const bodyType = searchParams.get("bodyType") as BodyType | null;
  const gender = searchParams.get("gender") as GenderExpression | null;
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  try {
    const items = filterItems({
      style: style || undefined,
      bodyType: bodyType || undefined,
      gender: gender || undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    });

    return NextResponse.json({ items, total: items.length });
  } catch (error) {
    console.error("Items query error:", error);
    return NextResponse.json(
      { error: "Failed to query items" },
      { status: 500 }
    );
  }
}
