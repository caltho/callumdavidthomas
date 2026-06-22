import type { ReactNode } from "react";
import Link from "next/link";
import { signOut } from "./actions";
import { getCurrentUser, isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const adminNav = [
  { label: "Dashboard", href: "/admin" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Stuff", href: "/admin/stuff" },
  { label: "About", href: "/admin/about" },
  { label: "Chat", href: "/admin/chat" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const admin = user ? await isAdmin() : false;

  return (
    <div className="min-h-screen">
      {admin && (
        <div className="sticky top-[57px] z-20 border-b border-border/60 bg-background/80 backdrop-blur-md">
          <nav className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-6 py-3 md:px-10">
            <div className="flex items-center gap-6">
              <span className="eyebrow text-ember">◉ Admin</span>
              {adminNav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone-400 transition-colors hover:text-bone-50"
                >
                  {n.label}
                </Link>
              ))}
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone-400 transition-colors hover:text-ember"
              >
                Sign out ↗
              </button>
            </form>
          </nav>
        </div>
      )}
      <div className="mx-auto max-w-[1600px] px-6 py-12 md:px-10">{children}</div>
    </div>
  );
}
