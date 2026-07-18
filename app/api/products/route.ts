import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

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
    name: item.Product_name,
    description: item.Description,
    price: item.Price,
    category: item.Category,
    images: [
      item.Image_url_1,
      item.Image_url_2,
      item.Image_url_3,
    ].filter(Boolean),
  }));

  return NextResponse.json({ products });
}