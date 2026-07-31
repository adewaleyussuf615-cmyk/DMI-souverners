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

  const products = (data ?? [])
    .map((item) => {
      // Support the different column-name formats in Supabase.
      const name =
        item.product_name ??
        item.Product_name ??
        item.name ??
        item.Name ??
        "";

      const description =
        item.description ??
        item.Description ??
        "";

      const priceValue =
        item.price ??
        item.Price ??
        0;

      const category =
        item.category ??
        item.Category ??
        "Uncategorized";

      const catalogs = Array.isArray(item.catalogs)
        ? item.catalogs.filter(
            (catalog: unknown): catalog is string =>
              typeof catalog === "string" && catalog.trim().length > 0
          )
        : [];

     const images = [
  ...(Array.isArray(item.images) ? item.images : []),

  item["image_url 1"],
  item["image_url 2"],
  item["image_url 3"],

  item["Image_url 1"],
  item["Image_url 2"],
  item["Image_url 3"],

  item.image_url,
  item.Image_url,
].filter(
  (image): image is string =>
    typeof image === "string" && image.trim().length > 0
);

      return {
        id: item.id,
        name: String(name).trim(),
        description: String(description || "").trim(),
        long_description: String(
          item.long_description ??
          item.Long_description ??
          description ??
          ""
        ).trim(),
        price: Number(priceValue) || 0,
        category: String(category || "Uncategorized").trim(),
        catalogs:
          catalogs.length > 0
            ? catalogs.map((catalog: string) => catalog.trim())
            : [String(category || "Uncategorized").trim()],
        images,
        features: Array.isArray(item.features)
          ? item.features
          : [],
        badge: item.badge ?? null,
        rating: item.rating ?? null,
        moq: item.moq ?? null,
        weight: item.weight ?? null,
      };
    })
    // Do not send empty or malformed product rows to the frontend.
    .filter((product) => product.name.length > 0);

  return NextResponse.json({ products });
}
