/**
 * Server-side Supabase client. Reads/writes cookies for Auth so RSCs
 * + server actions see the current user. Use this for any code that
 * runs on the server and needs Row-Level-Security to apply normally.
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // RSC context cannot set cookies — that's fine, middleware will.
          }
        },
      },
    }
  );
}
