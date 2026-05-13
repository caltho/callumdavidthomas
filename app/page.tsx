import Link from "next/link";
import { getProjects } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { ProjectRow } from "@/components/project-row";
import { MarqueeTags } from "@/components/marquee-tags";
import { LiveAppsGrid } from "@/components/live-apps";
import { StickerShop } from "@/components/relics/sticker-shop";
import { GreentextRelic } from "@/components/relics/greentext";
import { site } from "@/lib/site";
import { liveApps } from "@/data/live-apps";

export default async function Home() {
  const projects = await getProjects();
  const featured = projects.slice(0, 6);

  // De-duped tech tags for the marquee
  const allTags = Array.from(
    new Set(projects.flatMap((p) => p.techStack ?? p.tags ?? []))
  );

  return (
    <>
      {/* HERO ----------------------------------------------------------- */}
      <section className="relative pt-24 pb-32 md:pt-36 md:pb-48">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="pulse-dot" aria-hidden />
              Index 001 · 2026 · it me
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="font-display mt-8 text-[28vw] leading-[0.88] tracking-[-0.04em] text-bone-50 sm:text-[20vw] md:text-[14vw]">
              it me<span className="text-ember">.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.07}>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-bone-400">
              Callum David Thomas — software developer, Melbourne
            </p>
          </Reveal>

          <div className="mt-16 grid grid-cols-12 gap-6">
            <Reveal delay={0.1} className="col-span-12 md:col-span-7">
              <p className="max-w-xl text-lg leading-[1.55] text-bone-200 md:text-xl">
                I build clean, modular web apps —{" "}
                <span className="text-bone-50">slowly and on purpose.</span>{" "}
                Construction tools, traffic engineering software, late-night
                experiments. Currently freelancing out of {site.location}.
              </p>
            </Reveal>

            <Reveal delay={0.15} className="col-span-12 md:col-span-3 md:col-start-10">
              <div className="space-y-4 font-mono text-xs uppercase tracking-[0.2em] text-bone-400">
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span>Status</span>
                  <span className="text-bone-50">Open</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span>Loc.</span>
                  <span className="text-bone-50">{site.location}</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span>Time</span>
                  <span className="text-bone-50">UTC+10</span>
                </div>
                <Link
                  href="/work"
                  className="mt-6 inline-flex items-center gap-2 text-bone-50 transition-colors hover:text-ember"
                >
                  See selected work →
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TECH MARQUEE -------------------------------------------------- */}
      <MarqueeTags items={allTags.slice(0, 24)} />

      {/* LIVE APPS ----------------------------------------------------- */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <Reveal>
            <div className="flex items-end justify-between">
              <p className="eyebrow">§ In the wild</p>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-bone-400">
                {liveApps.length} live
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="font-display mt-6 max-w-4xl text-5xl leading-[0.95] tracking-[-0.04em] text-bone-50 md:text-7xl">
              Apps that are{" "}
              <span className="text-ember">actually running.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-bone-400">
              Click through, kick the tyres. Live URLs only — no screenshots,
              no demos behind glass.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-14">
              <LiveAppsGrid apps={liveApps} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* SELECTED WORK ------------------------------------------------- */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <Reveal>
            <div className="flex items-end justify-between">
              <p className="eyebrow">§ Selected work</p>
              <Link
                href="/work"
                className="font-mono text-xs uppercase tracking-[0.2em] text-bone-400 transition-colors hover:text-bone-50"
              >
                Full index →
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="font-display mt-6 text-5xl leading-none tracking-[-0.04em] text-bone-50 md:text-7xl">
              Things I have made,
              <br />
              <span className="text-bone-400">on purpose.</span>
            </h2>
          </Reveal>
        </div>

        <div className="mt-16">
          {featured.map((p, i) => (
            <ProjectRow key={p.slug} project={p} index={i} />
          ))}
          <div className="border-t border-border/60" />
        </div>

        <div className="mx-auto mt-16 max-w-[1600px] px-6 md:px-10">
          <Link
            href="/work"
            className="font-display text-3xl text-bone-200 underline decoration-ember/60 decoration-2 underline-offset-8 transition-colors hover:text-bone-50 md:text-5xl"
          >
            See the full archive →
          </Link>
        </div>
      </section>

      {/* B-SIDES — internet relics ------------------------------------ */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <Reveal>
            <div className="flex items-end justify-between">
              <p className="eyebrow">§ B-sides</p>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone-600">
                small internet artifacts
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="font-display mt-6 max-w-4xl text-5xl leading-[0.95] tracking-[-0.04em] text-bone-50 md:text-7xl">
              Stuff that{" "}
              <span className="text-bone-400">doesn&apos;t belong anywhere else.</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-12 gap-5 md:gap-6">
            <Reveal className="col-span-12" delay={0.1}>
              <StickerShop />
            </Reveal>
            <Reveal className="col-span-12 md:col-span-7" delay={0.15}>
              <GreentextRelic />
            </Reveal>
          </div>
        </div>
      </section>

      {/* QUIET CTA ---------------------------------------------------- */}
      <section className="relative py-32 md:py-48">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <Reveal>
            <p className="eyebrow">§ The list</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display mt-6 max-w-5xl text-5xl leading-[0.95] tracking-[-0.04em] text-bone-50 md:text-8xl">
              You&apos;re on it.{" "}
              <a
                href={`mailto:${site.email}`}
                className="relative inline-block text-ember underline decoration-ember/40 decoration-[0.08em] underline-offset-[0.12em] transition-colors hover:text-bone-50"
              >
                Email →
              </a>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-md text-sm text-bone-400">
              No bouncer. No list. No idea why I framed it that way.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
