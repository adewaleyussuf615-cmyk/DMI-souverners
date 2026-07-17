import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { data: product } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product) return notFound();

  return <ProductForm initial={product} />;
}
