import Link from "next/link";
import { getProjects } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { ProjectRow } from "@/components/project-row";
import { MarqueeTags } from "@/components/marquee-tags";
import { LiveAppsGrid } from "@/components/live-apps";
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
              Portfolio · 2026 / Index 001
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="font-display mt-8 text-[16vw] leading-[0.84] tracking-[-0.04em] text-bone-50 sm:text-[14vw] md:text-[12vw]">
              Callum
              <br />
              <span className="text-bone-200">David</span>
              <br />
              <span className="inline-flex items-baseline">
                Thomas<span className="text-ember">.</span>
              </span>
            </h1>
          </Reveal>

          <div className="mt-16 grid grid-cols-12 gap-6">
            <Reveal delay={0.1} className="col-span-12 md:col-span-7">
              <p className="max-w-2xl font-display text-2xl leading-[1.2] text-bone-200 md:text-3xl">
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

      {/* QUIET CTA ---------------------------------------------------- */}
      <section className="relative py-32 md:py-48">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <Reveal>
            <p className="eyebrow">§ Get in touch</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display mt-6 max-w-5xl text-5xl leading-[0.95] tracking-[-0.04em] text-bone-50 md:text-8xl">
              The basement door is{" "}
              <a
                href={`mailto:${site.email}`}
                className="relative inline-block text-ember underline decoration-ember/40 decoration-[0.08em] underline-offset-[0.12em] transition-colors hover:text-bone-50"
              >
                always open.
              </a>
            </h2>
          </Reveal>
        </div>
      </section>
    </>
  );
}
