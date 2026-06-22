"use server";

/**
 * leave-a-message — the only *persisted* part of the chat.
 *
 * Live chat + the emulator are ephemeral (Realtime Broadcast / local nano).
 * "Leave Callum a message" drops a row in `portfolio_messages` so he sees it
 * later. Fails soft: if the table doesn't exist yet, the visitor still gets a
 * friendly response instead of a crash.
 *
 * Requires a one-time DB setup (see SQL in the project notes):
 *   create table portfolio_messages (
 *     id uuid primary key default gen_random_uuid(),
 *     created_at timestamptz not null default now(),
 *     name text, contact text, body text not null, page text
 *   );
 *   alter table portfolio_messages enable row level security;
 *   create policy "anon can insert" on portfolio_messages
 *     for insert to anon, authenticated with check (char_length(body) between 1 and 4000);
 *   -- reads stay admin-only (no select policy = no public reads).
 */

import { createClient } from "@/lib/supabase/server";

export type LeaveMessageInput = {
  name?: string;
  contact?: string;
  body: string;
  page?: string;
};

export type LeaveMessageResult = { ok: boolean; error?: string };

export async function leaveMessage(
  input: LeaveMessageInput
): Promise<LeaveMessageResult> {
  const body = (input.body ?? "").trim();
  if (!body) return { ok: false, error: "Message was empty." };
  if (body.length > 4000) return { ok: false, error: "Message too long." };

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("portfolio_messages").insert({
      name: input.name?.trim() || null,
      contact: input.contact?.trim() || null,
      body,
      page: input.page?.trim() || null,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error." };
  }
}
