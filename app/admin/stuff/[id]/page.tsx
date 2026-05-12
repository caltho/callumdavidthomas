import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { StuffForm } from "@/components/admin/stuff-form";

export const dynamic = "force-dynamic";

export default async function EditStuffPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("portfolio_stuff")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header>
        <p className="eyebrow">§ Edit stuff</p>
        <h1 className="font-display mt-3 text-5xl leading-none text-bone-50 md:text-7xl">
          {data.title}
        </h1>
      </header>
      <StuffForm item={data} />
    </div>
  );
}
