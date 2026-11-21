import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PAGE_SIZE = 12;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const transaction = searchParams.get("transaction");
  const propertyType = searchParams.get("property_type");
  const city = searchParams.get("city");
  const area = searchParams.get("area");
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  const minSurface = searchParams.get("min_surface");
  const minRooms = searchParams.get("min_rooms");
  const bedrooms = searchParams.get("bedrooms");
  const page = Math.max(1, Number(searchParams.get("page") || "1"));

  const supabase = await createClient();

  let query = supabase
    .from("properties")
    .select(
      "id, title, description, transaction, property_type, price, currency, city, area, bedrooms, rooms, surface, public_slug",
      { count: "exact" },
    )
    .eq("status", "published")
    .not("public_slug", "is", null);

  if (transaction === "sale" || transaction === "rent") {
    query = query.eq("transaction", transaction);
  }

  if (propertyType) {
    query = query.eq("property_type", propertyType);
  }

  if (city) {
    query = query.ilike("city", `%${city}%`);
  }

  if (area) {
    query = query.ilike("area", `%${area}%`);
  }

  if (minPrice && Number.isFinite(Number(minPrice))) {
    query = query.gte("price", Number(minPrice));
  }

  if (maxPrice && Number.isFinite(Number(maxPrice))) {
    query = query.lte("price", Number(maxPrice));
  }

  if (minSurface && Number.isFinite(Number(minSurface))) {
    query = query.gte("surface", Number(minSurface));
  }

  if (minRooms && Number.isFinite(Number(minRooms))) {
    query = query.gte("rooms", Number(minRooms));
  }

  if (bedrooms && Number.isFinite(Number(bedrooms))) {
    query = query.gte("bedrooms", Number(bedrooms));
  }

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return NextResponse.json(
      { error: "Impossible de rechercher les biens." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    properties: data ?? [],
    total: count ?? 0,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE)),
  });
}