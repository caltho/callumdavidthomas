"use client";

import Link from "next/link";
import { upsertProject, deleteProject } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";
import { ImageInput, ImageListInput } from "./image-input";

type ProjectRow = {
  id: string;
  slug: string;
  number: number;
  title: string;
  summary: string;
  long_description: string;
  year: number | null;
  role: string | null;
  tech_stack: string[];
  tags: string[];
  thumbnail: string | null;
  images: string[];
  link: string | null;
  github: string | null;
  codeblock: unknown;
  published: boolean;
};

export function ProjectForm({ project }: { project?: ProjectRow }) {
  const isEdit = !!project;
  return (
    <form action={upsertProject} className="space-y-10">
      {isEdit && <input type="hidden" name="id" value={project.id} />}

      <div className="grid grid-cols-12 gap-6">
        <Field label="Title" htmlFor="title" className="col-span-12 md:col-span-8">
          <Input id="title" name="title" required defaultValue={project?.title} />
        </Field>
        <Field label="Slug" htmlFor="slug" className="col-span-8 md:col-span-3" hint="URL path">
          <Input id="slug" name="slug" required defaultValue={project?.slug} />
        </Field>
        <Field label="Order" htmlFor="number" className="col-span-4 md:col-span-1">
          <Input id="number" name="number" type="number" defaultValue={project?.number ?? 0} />
        </Field>
      </div>

      <Field label="Summary" htmlFor="summary" hint="One sentence">
        <Textarea
          id="summary"
          name="summary"
          rows={2}
          defaultValue={project?.summary}
        />
      </Field>

      <Field label="Long description" htmlFor="long_description" hint="HTML allowed">
        <Textarea
          id="long_description"
          name="long_description"
          rows={10}
          defaultValue={project?.long_description}
        />
      </Field>

      <div className="grid grid-cols-12 gap-6">
        <Field label="Year" htmlFor="year" className="col-span-6 md:col-span-2">
          <Input id="year" name="year" type="number" defaultValue={project?.year ?? ""} />
        </Field>
        <Field label="Role" htmlFor="role" className="col-span-12 md:col-span-5">
          <Input id="role" name="role" defaultValue={project?.role ?? ""} />
        </Field>
        <Field label="Live URL" htmlFor="link" className="col-span-12 md:col-span-5">
          <Input id="link" name="link" type="url" defaultValue={project?.link ?? ""} />
        </Field>
      </div>

      <Field label="GitHub URL" htmlFor="github">
        <Input id="github" name="github" type="url" defaultValue={project?.github ?? ""} />
      </Field>

      <div className="grid grid-cols-12 gap-6">
        <Field
          label="Tech stack"
          htmlFor="tech_stack"
          hint="Comma or newline separated"
          className="col-span-12 md:col-span-6"
        >
          <Textarea
            id="tech_stack"
            name="tech_stack"
            rows={3}
            defaultValue={project?.tech_stack.join(", ") ?? ""}
          />
        </Field>
        <Field
          label="Tags"
          htmlFor="tags"
          hint="Comma or newline separated"
          className="col-span-12 md:col-span-6"
        >
          <Textarea
            id="tags"
            name="tags"
            rows={3}
            defaultValue={project?.tags.join(", ") ?? ""}
          />
        </Field>
      </div>

      <Field label="Thumbnail" hint="Public URL or upload">
        <ImageInput
          name="thumbnail"
          defaultValue={project?.thumbnail ?? ""}
          folder={`projects/${project?.slug ?? "new"}`}
        />
      </Field>

      <Field label="Images" hint="One URL per line — gallery">
        <ImageListInput
          name="images"
          defaultValue={project?.images.join("\n") ?? ""}
          folder={`projects/${project?.slug ?? "new"}`}
        />
      </Field>

      <Field label="Codeblock (JSON)" htmlFor="codeblock" hint="Optional">
        <Textarea
          id="codeblock"
          name="codeblock"
          rows={4}
          placeholder='{"lang":"ts","desc":["…"],"code":["…"]}'
          defaultValue={
            project?.codeblock ? JSON.stringify(project.codeblock, null, 2) : ""
          }
        />
      </Field>

      <label className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-200">
        <input
          type="checkbox"
          name="published"
          defaultChecked={project?.published ?? true}
          className="size-4 accent-ember"
        />
        Published
      </label>

      <div className="flex items-center justify-between border-t border-border/60 pt-8">
        <Link
          href="/admin/projects"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone-400 hover:text-ember"
        >
          ← Cancel
        </Link>
        <div className="flex items-center gap-3">
          {isEdit && (
            <DeleteButton id={project.id} />
          )}
          <Button type="submit">{isEdit ? "Save changes" : "Create project"} →</Button>
        </div>
      </div>
    </form>
  );
}

function DeleteButton({ id }: { id: string }) {
  return (
    <form
      action={deleteProject}
      onSubmit={(e) => {
        if (!confirm("Delete this project? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="danger" size="md">
        Delete
      </Button>
    </form>
  );
}
