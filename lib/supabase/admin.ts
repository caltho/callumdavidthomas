/**
 * Service-role Supabase client. **Server-only.** Bypasses Row-Level-Security.
 * Use sparingly — seed scripts and admin actions that need elevated access.
 * Never import this from any file that can ship to the browser.
 */
import { createClient } from "@supabase/supabase-js";
import "server-only";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );
}
