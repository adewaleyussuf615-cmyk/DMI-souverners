import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const products = data.map((item) => ({
    id: item.id,
    name: item.product_name,
    description: item.description,
    price: item.price,
    category: item.category,
    images: [
      item["image_url 1"],
      item["image_url 2"],
      item["image_url 3"],
    ].filter(Boolean),
  }));

  return NextResponse.json({ products });
}