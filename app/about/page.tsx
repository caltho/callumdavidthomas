import type { Metadata } from "next";
import Link from "next/link";
import { getAbout } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "About Callum David Thomas.",
};

export default async function AboutPage() {
  const about = await getAbout();

  return (
    <section className="pt-24 pb-32 md:pt-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <Reveal>
          <p className="eyebrow">§ About</p>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="font-display mt-6 text-[14vw] leading-[0.84] tracking-[-0.04em] text-bone-50 md:text-[10vw]">
            Hello<span className="text-ember">.</span>
          </h1>
        </Reveal>

        <div className="mt-16 grid grid-cols-12 gap-8">
          <Reveal className="col-span-12 md:col-span-7" delay={0.1}>
            <div
              className="font-display space-y-6 text-2xl leading-[1.25] text-bone-200 md:text-3xl [&_p]:max-w-2xl"
              dangerouslySetInnerHTML={{ __html: about.description }}
            />
          </Reveal>

          <Reveal className="col-span-12 md:col-span-4 md:col-start-9" delay={0.15}>
            <div className="sticky top-28 space-y-6 border-l border-border/60 pl-6">
              <div>
                <p className="eyebrow">Currently</p>
                <p className="mt-2 text-bone-200">{site.role}</p>
                <p className="text-sm text-bone-400">{site.location}</p>
              </div>

              <div>
                <p className="eyebrow">Contact</p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-2 block text-bone-50 transition-colors hover:text-ember"
                >
                  {site.email} ↗
                </a>
              </div>

              <div>
                <p className="eyebrow">Elsewhere</p>
                <ul className="mt-2 space-y-1.5">
                  {site.socials.map((s) => (
                    <li key={s.href}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-bone-200 transition-colors hover:text-ember"
                      >
                        {s.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Link
                  href="/work"
                  className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-ember"
                >
                  → See selected work
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
