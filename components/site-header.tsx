"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  // The terminal homepage owns the whole viewport — no global chrome there.
  if (pathname === "/") return null;
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-background/60 border-b border-border/60">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 md:px-10">
        <Link
          href="/"
          className="group inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-bone-200"
        >
          <span className="pulse-dot" aria-hidden />
          <span>{site.shortName}</span>
          <span className="hidden text-bone-600 sm:inline">/</span>
          <span className="hidden text-bone-400 sm:inline">{site.role}</span>
        </Link>

        <nav className="flex items-center gap-6 font-mono text-xs uppercase tracking-[0.2em] text-bone-400">
          {site.nav.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-bone-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
