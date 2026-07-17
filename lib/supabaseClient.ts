import { createClient } from "@supabase/supabase-js";

// Public client — safe to use in the browser. Uses the anon key, which can
// only ever READ products (see supabase/schema.sql row-level security policy).
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
