"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

/**
 * Single-image picker that uploads to the `portfolio-media` Supabase bucket
 * and surfaces the public URL into a hidden form field.
 */
export function ImageInput({
  name,
  defaultValue = "",
  folder = "misc",
}: {
  name: string;
  defaultValue?: string;
  folder?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("portfolio-media")
        .upload(path, file, { cacheControl: "31536000", upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("portfolio-media").getPublicUrl(path);
      setUrl(data.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <Input
        name={name}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://… or upload below"
      />
      <div className="flex items-center gap-3">
        <label className="inline-flex cursor-pointer items-center justify-center gap-2 border border-border bg-ink-700 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-200 transition-colors hover:border-ember/60">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void upload(f);
            }}
          />
          {uploading ? "Uploading…" : "↑ Upload image"}
        </label>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone-400 hover:text-ember"
          >
            Preview ↗
          </a>
        )}
      </div>
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          className="max-h-32 w-auto border border-border/60 object-contain"
        />
      )}
      {error && <p className="text-xs text-ember">{error}</p>}
    </div>
  );
}

/**
 * Multi-image picker. Stores newline-separated URLs in a single textarea field
 * to keep the server action parser simple.
 */
export function ImageListInput({
  name,
  defaultValue = "",
  folder = "misc",
}: {
  name: string;
  defaultValue?: string;
  folder?: string;
}) {
  const initial = defaultValue.split(/\s*\n+\s*/).filter(Boolean);
  const [urls, setUrls] = useState<string[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(files: FileList) {
    setUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      const newUrls: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() ?? "bin";
        const path = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("portfolio-media")
          .upload(path, file, { cacheControl: "31536000", upsert: false });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("portfolio-media").getPublicUrl(path);
        newUrls.push(data.publicUrl);
      }
      setUrls((prev) => [...prev, ...newUrls]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <Textarea
        name={name}
        value={urls.join("\n")}
        onChange={(e) =>
          setUrls(e.target.value.split(/\s*\n+\s*/).filter(Boolean))
        }
        rows={Math.max(3, urls.length)}
        placeholder="One URL per line"
      />

      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center justify-center gap-2 border border-border bg-ink-700 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-200 transition-colors hover:border-ember/60">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files?.length) void upload(e.target.files);
            }}
          />
          {uploading ? "Uploading…" : "↑ Upload image(s)"}
        </label>
        {urls.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setUrls([])}
          >
            Clear all
          </Button>
        )}
      </div>

      {urls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {urls.map((u, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={u + i}
              src={u}
              alt=""
              className="size-20 border border-border/60 object-cover"
            />
          ))}
        </div>
      )}
      {error && <p className="text-xs text-ember">{error}</p>}
    </div>
  );
}
