import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import DeleteButton from "@/components/admin/DeleteButton";
import LogoutButton from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const { data: products, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="admin-shell">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontSize: 26, margin: 0 }}>
            Products
          </h1>
          <p style={{ color: "var(--ink-soft)", fontSize: 13, margin: "4px 0 0" }}>
            {products?.length || 0} product{products?.length === 1 ? "" : "s"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/admin/new" className="btn btn-gold">
            + Add Product
          </Link>
          <LogoutButton />
        </div>
      </div>

      {error && <p style={{ color: "var(--danger)" }}>{error.message}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Badge</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(products || []).map((p) => (
              <tr key={p.id}>
                <td>
                  {p.images?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0]} alt={p.name} />
                  )}
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>₦{Number(p.price).toLocaleString("en-NG")}</td>
                <td>{p.badge || "—"}</td>
                <td className="admin-actions">
                  <Link href={`/admin/edit/${p.id}`}>Edit</Link>
                  <DeleteButton id={p.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(!products || products.length === 0) && (
        <p style={{ color: "var(--ink-soft)", marginTop: 20 }}>
          No products yet — click &quot;Add Product&quot; to create your first one.
        </p>
      )}
    </div>
  );
}
