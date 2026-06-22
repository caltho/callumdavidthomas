"use client";

import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

export function SiteFooter() {
  const pathname = usePathname();
  // The terminal homepage has its own colophon — skip the global footer there.
  if (pathname === "/") return null;
  const year = new Date().getFullYear();
  return (
    <footer className="mt-32 border-t border-border/60">
      <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-6 px-6 py-12 md:px-10">
        <div className="col-span-12 md:col-span-6">
          <p className="eyebrow">Currently</p>
          <p className="mt-3 max-w-md text-lg text-bone-200">
            Open to good emails. Face control applies.
          </p>
        </div>

        <div className="col-span-6 md:col-span-3">
          <p className="eyebrow">Elsewhere</p>
          <ul className="mt-3 space-y-2 text-sm text-bone-200">
            {site.socials.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-ember"
                >
                  {s.label} ↗
                </a>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${site.email}`}
                className="transition-colors hover:text-ember"
              >
                Email ↗
              </a>
            </li>
          </ul>
        </div>

        <div className="col-span-6 md:col-span-3">
          <p className="eyebrow">Index</p>
          <ul className="mt-3 space-y-2 text-sm text-bone-200">
            {site.nav.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  className="transition-colors hover:text-ember"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-12 mt-8 flex items-center justify-between border-t border-border/60 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-600">
          <span>© {year} {site.name}</span>
          <span>Built in the dark · v0.1</span>
        </div>
      </div>
    </footer>
  );
}
