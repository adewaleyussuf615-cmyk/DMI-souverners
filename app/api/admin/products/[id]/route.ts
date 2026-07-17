import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

  const { data, error } = await supabaseAdmin
    .from("products")
    .update(payload)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await supabaseAdmin.from("products").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
