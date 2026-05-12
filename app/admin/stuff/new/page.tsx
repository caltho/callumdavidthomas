import { requireAdmin } from "@/lib/auth";
import { StuffForm } from "@/components/admin/stuff-form";

export const dynamic = "force-dynamic";

export default async function NewStuffPage() {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header>
        <p className="eyebrow">§ New stuff</p>
        <h1 className="font-display mt-3 text-5xl leading-none text-bone-50 md:text-7xl">
          New entry<span className="text-ember">.</span>
        </h1>
      </header>
      <StuffForm />
    </div>
  );
}
