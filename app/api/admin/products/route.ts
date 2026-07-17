import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Middleware already guarantees only an authenticated admin session reaches this route.

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const payload = {
    name: body.name,
    price: Number(body.price),
    category: body.category || "Uncategorized",
    rating: body.rating ? Number(body.rating) : 4.7,
    moq: body.moq || null,
    weight: body.weight || null,
    description: body.description || "",
    long_description: body.long_description || body.description || "",
    features: Array.isArray(body.features) ? body.features : [],
    images: Array.isArray(body.images) ? body.images : [],
    badge: body.badge || null,
  };

  if (!payload.name || !payload.price) {
    return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.from("products").insert(payload).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}
