import { createClient } from "@supabase/supabase-js";

// Server-only client — NEVER import this from a "use client" component or
// expose SUPABASE_SERVICE_ROLE_KEY to the browser. It bypasses row-level
// security, so it can insert/update/delete products. Only the admin API
// routes (app/api/admin/**) should use this.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
