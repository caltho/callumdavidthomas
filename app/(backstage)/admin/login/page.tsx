import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { signInWithPassword, signInWithMagicLink } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string; denied?: string }>;
}) {
  const { error, sent, denied } = await searchParams;

  // If already signed in AND admin, skip the login page.
  const user = await getCurrentUser();
  if (user && (await isAdmin())) redirect("/admin");

  return (
    <div className="mx-auto mt-16 max-w-md">
      <p className="eyebrow flex items-center gap-3">
        <span className="pulse-dot" aria-hidden /> Restricted
      </p>
      <h1 className="font-display mt-4 text-6xl leading-none text-bone-50">
        The basement<span className="text-ember">.</span>
      </h1>
      <p className="mt-6 text-bone-400">
        Sign in to manage projects, stuff, and the about page.
      </p>

      {sent && (
        <p className="mt-6 border border-ember/40 px-4 py-3 text-sm text-bone-200">
          Magic link sent. Check your inbox.
        </p>
      )}
      {denied && (
        <p className="mt-6 border border-ember-deep/60 px-4 py-3 text-sm text-bone-200">
          That account isn&apos;t on the admin allowlist.
        </p>
      )}
      {error && (
        <p className="mt-6 border border-ember-deep/60 px-4 py-3 text-sm text-bone-200">
          {error}
        </p>
      )}

      <div className="mt-10 space-y-10">
        <form action={signInWithPassword} className="space-y-6">
          <Field label="Email" htmlFor="email">
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </Field>
          <Field label="Password" htmlFor="password">
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </Field>
          <Button type="submit" className="w-full">
            Sign in →
          </Button>
        </form>

        <div className="flex items-center gap-3">
          <span className="hr-line flex-1" />
          <span className="eyebrow">or</span>
          <span className="hr-line flex-1" />
        </div>

        <form action={signInWithMagicLink} className="space-y-6">
          <Field label="Email" htmlFor="email-magic">
            <Input
              id="email-magic"
              name="email"
              type="email"
              required
              autoComplete="email"
            />
          </Field>
          <Button type="submit" variant="secondary" className="w-full">
            Send magic link →
          </Button>
        </form>
      </div>

      <p className="mt-12 text-center">
        <Link
          href="/"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone-400 hover:text-ember"
        >
          ← Back to site
        </Link>
      </p>
    </div>
  );
}
