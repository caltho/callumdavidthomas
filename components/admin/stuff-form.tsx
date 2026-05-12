"use client";

import Link from "next/link";
import { upsertStuff, deleteStuff } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";
import { ImageInput, ImageListInput } from "./image-input";

type StuffRow = {
  id: string;
  slug: string;
  number: number;
  title: string;
  summary: string;
  long_description: string;
  year: number | null;
  location: string | null;
  tags: string[];
  thumbnail: string | null;
  images: string[];
  links: { label: string; href: string }[];
  published: boolean;
};

export function StuffForm({ item }: { item?: StuffRow }) {
  const isEdit = !!item;
  return (
    <form action={upsertStuff} className="space-y-10">
      {isEdit && <input type="hidden" name="id" value={item.id} />}

      <div className="grid grid-cols-12 gap-6">
        <Field label="Title" htmlFor="title" className="col-span-12 md:col-span-8">
          <Input id="title" name="title" required defaultValue={item?.title} />
        </Field>
        <Field label="Slug" htmlFor="slug" className="col-span-8 md:col-span-3">
          <Input id="slug" name="slug" required defaultValue={item?.slug} />
        </Field>
        <Field label="Order" htmlFor="number" className="col-span-4 md:col-span-1">
          <Input id="number" name="number" type="number" defaultValue={item?.number ?? 0} />
        </Field>
      </div>

      <Field label="Summary" htmlFor="summary">
        <Textarea id="summary" name="summary" rows={2} defaultValue={item?.summary} />
      </Field>

      <Field label="Long description" htmlFor="long_description" hint="HTML allowed">
        <Textarea
          id="long_description"
          name="long_description"
          rows={10}
          defaultValue={item?.long_description}
        />
      </Field>

      <div className="grid grid-cols-12 gap-6">
        <Field label="Year" htmlFor="year" className="col-span-6 md:col-span-3">
          <Input id="year" name="year" type="number" defaultValue={item?.year ?? ""} />
        </Field>
        <Field label="Location" htmlFor="location" className="col-span-12 md:col-span-9">
          <Input id="location" name="location" defaultValue={item?.location ?? ""} />
        </Field>
      </div>

      <Field label="Tags" htmlFor="tags" hint="Comma or newline separated">
        <Textarea
          id="tags"
          name="tags"
          rows={2}
          defaultValue={item?.tags.join(", ") ?? ""}
        />
      </Field>

      <Field label="Thumbnail">
        <ImageInput
          name="thumbnail"
          defaultValue={item?.thumbnail ?? ""}
          folder={`stuff/${item?.slug ?? "new"}`}
        />
      </Field>

      <Field label="Images">
        <ImageListInput
          name="images"
          defaultValue={item?.images.join("\n") ?? ""}
          folder={`stuff/${item?.slug ?? "new"}`}
        />
      </Field>

      <Field label="Links (JSON)" htmlFor="links" hint='[{"label":"…","href":"…"}]'>
        <Textarea
          id="links"
          name="links"
          rows={3}
          defaultValue={item?.links ? JSON.stringify(item.links, null, 2) : "[]"}
        />
      </Field>

      <label className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-200">
        <input
          type="checkbox"
          name="published"
          defaultChecked={item?.published ?? true}
          className="size-4 accent-ember"
        />
        Published
      </label>

      <div className="flex items-center justify-between border-t border-border/60 pt-8">
        <Link
          href="/admin/stuff"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone-400 hover:text-ember"
        >
          ← Cancel
        </Link>
        <div className="flex items-center gap-3">
          {isEdit && (
            <form
              action={deleteStuff}
              onSubmit={(e) => {
                if (!confirm("Delete this entry?")) e.preventDefault();
              }}
            >
              <input type="hidden" name="id" value={item.id} />
              <Button type="submit" variant="danger" size="md">
                Delete
              </Button>
            </form>
          )}
          <Button type="submit">{isEdit ? "Save changes" : "Create entry"} →</Button>
        </div>
      </div>
    </form>
  );
}
