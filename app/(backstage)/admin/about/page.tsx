import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { upsertAbout } from "../actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";

export const dynamic = "force-dynamic";

export default async function AdminAbout() {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("portfolio_about")
    .select("summary,description")
    .eq("id", "singleton")
    .maybeSingle();

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header>
        <p className="eyebrow">§ About</p>
        <h1 className="font-display mt-3 text-5xl leading-none text-bone-50 md:text-7xl">
          About<span className="text-ember">.</span>
        </h1>
      </header>

      <form action={upsertAbout} className="space-y-10">
        <Field label="Short summary" htmlFor="summary" hint="Plain text">
          <Textarea
            id="summary"
            name="summary"
            rows={4}
            defaultValue={data?.summary ?? ""}
          />
        </Field>

        <Field label="Long description" htmlFor="description" hint="HTML allowed">
          <Textarea
            id="description"
            name="description"
            rows={14}
            defaultValue={data?.description ?? ""}
          />
        </Field>

        <div className="flex justify-end border-t border-border/60 pt-8">
          <Button type="submit">Save about →</Button>
        </div>
      </form>
    </div>
  );
}
