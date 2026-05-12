"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

// ---------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------
export async function signInWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/admin");
}

export async function signInWithMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const supabase = await createClient();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });
  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  }
  redirect(`/admin/login?sent=1`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------
function parseList(v: FormDataEntryValue | null): string[] {
  if (!v) return [];
  return String(v)
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function projectPayloadFrom(formData: FormData) {
  const codeblockRaw = String(formData.get("codeblock") ?? "").trim();
  let codeblock: unknown = null;
  if (codeblockRaw) {
    try {
      codeblock = JSON.parse(codeblockRaw);
    } catch {
      // Leave as null — admin gets a chance to fix it; we don't crash.
    }
  }
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    long_description: String(formData.get("long_description") ?? ""),
    number: Number(formData.get("number") ?? 0),
    year: formData.get("year") ? Number(formData.get("year")) : null,
    role: String(formData.get("role") ?? "").trim() || null,
    tech_stack: parseList(formData.get("tech_stack")),
    tags: parseList(formData.get("tags")),
    thumbnail: String(formData.get("thumbnail") ?? "").trim() || null,
    images: parseList(formData.get("images")),
    link: String(formData.get("link") ?? "").trim() || null,
    github: String(formData.get("github") ?? "").trim() || null,
    codeblock,
    published: formData.get("published") === "on",
  };
}

export async function upsertProject(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "").trim() || null;
  const payload = projectPayloadFrom(formData);

  const { error } = id
    ? await supabase.from("portfolio_projects").update(payload).eq("id", id)
    : await supabase.from("portfolio_projects").insert(payload);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath(`/work/${payload.slug}`);
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const { error } = await supabase.from("portfolio_projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/admin/projects");
}

// ---------------------------------------------------------------------
// Stuff
// ---------------------------------------------------------------------
function stuffPayloadFrom(formData: FormData) {
  const linksRaw = String(formData.get("links") ?? "").trim();
  let links: unknown = [];
  if (linksRaw) {
    try {
      links = JSON.parse(linksRaw);
    } catch {
      links = [];
    }
  }
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    long_description: String(formData.get("long_description") ?? ""),
    number: Number(formData.get("number") ?? 0),
    year: formData.get("year") ? Number(formData.get("year")) : null,
    location: String(formData.get("location") ?? "").trim() || null,
    tags: parseList(formData.get("tags")),
    thumbnail: String(formData.get("thumbnail") ?? "").trim() || null,
    images: parseList(formData.get("images")),
    links,
    published: formData.get("published") === "on",
  };
}

export async function upsertStuff(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "").trim() || null;
  const payload = stuffPayloadFrom(formData);

  const { error } = id
    ? await supabase.from("portfolio_stuff").update(payload).eq("id", id)
    : await supabase.from("portfolio_stuff").insert(payload);

  if (error) throw new Error(error.message);

  revalidatePath("/stuff");
  revalidatePath(`/stuff/${payload.slug}`);
  revalidatePath("/admin/stuff");
  redirect("/admin/stuff");
}

export async function deleteStuff(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const { error } = await supabase.from("portfolio_stuff").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/stuff");
  revalidatePath("/admin/stuff");
}

// ---------------------------------------------------------------------
// About (singleton)
// ---------------------------------------------------------------------
export async function upsertAbout(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const payload = {
    id: "singleton",
    summary: String(formData.get("summary") ?? ""),
    description: String(formData.get("description") ?? ""),
  };
  const { error } = await supabase
    .from("portfolio_about")
    .upsert(payload, { onConflict: "id" });
  if (error) throw new Error(error.message);
  revalidatePath("/about");
  revalidatePath("/admin/about");
}
