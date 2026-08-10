import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  console.log("TOTAL FROM SUPABASE:", data?.length);
console.log(
  "AWARDS:",
  data?.filter(
    (item) => item.category === "Awards & Recognition"
  )
);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const products = (data ?? [])
    .map((item) => {
      // Support different product name formats
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
          typeof image === "string" &&
          image.trim().length > 0
      );


      // Preserve Supabase catalog system
    const catalogs = [
  String(category || "Uncategorized").trim(),

  ...(Array.isArray(item.catalogs)
    ? item.catalogs
    : typeof item.catalogs === "string"
      ? item.catalogs.split(",")
      : []),
]
        .map((catalog) => String(catalog).trim())
        .filter(
          (catalog, index, array) =>
            catalog.length > 0 &&
            array.indexOf(catalog) === index
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

        catalogs,

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

    // Remove empty products
    .filter(
      (product) =>
        product.name.length > 0
    );


  return NextResponse.json({ products });
}