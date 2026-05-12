/**
 * Bootstrap the first portfolio admin.
 *
 *   npm run bootstrap:admin <email>
 *
 * Idempotent:
 *  - If an auth user with that email already exists (e.g. you already use this
 *    Supabase project for another app), we just add their existing user_id to
 *    portfolio_admins.
 *  - Otherwise we create the user with email_confirm=true so they can sign in
 *    immediately via magic link without verifying.
 */
import { createClient } from "@supabase/supabase-js";
import { config as loadEnv } from "dotenv";
import { resolve } from "path";

loadEnv({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing env: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const email = process.argv[2];
if (!email) {
  console.error("Usage: npm run bootstrap:admin -- <email>");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(email: string) {
  // listUsers pages 50 at a time; for an admin tool we'll just scan the
  // first few pages — way more than enough for personal-project use.
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const found = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (found) return found;
    if (data.users.length < 200) return null;
  }
  return null;
}

async function main() {
  console.log(`→ Looking up auth user for ${email}…`);
  let user = await findUserByEmail(email);

  if (!user) {
    console.log("  not found — creating");
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
    });
    if (error) throw error;
    user = data.user;
    console.log(`  created user ${user.id}`);
  } else {
    console.log(`  found existing user ${user.id}`);
  }

  console.log("→ Adding to portfolio_admins…");
  const { error } = await supabase
    .from("portfolio_admins")
    .upsert({ user_id: user.id, email: user.email! }, { onConflict: "user_id" });
  if (error) throw error;

  console.log("\nBootstrap complete ✓");
  console.log(`  Go to /admin/login, enter ${email}, click "Send magic link".`);
}

main().catch((err) => {
  console.error("\nBootstrap failed:", err.message || err);
  process.exit(1);
});
