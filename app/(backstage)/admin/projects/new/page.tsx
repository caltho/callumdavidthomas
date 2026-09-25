import { requireAdmin } from "@/lib/auth";
import { ProjectForm } from "@/components/admin/project-form";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header>
        <p className="eyebrow">§ New project</p>
        <h1 className="font-display mt-3 text-5xl leading-none text-bone-50 md:text-7xl">
          New project<span className="text-ember">.</span>
        </h1>
      </header>
      <ProjectForm />
    </div>
  );
}
