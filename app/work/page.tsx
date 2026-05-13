import type { Metadata } from "next";
import { getProjects } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { ProjectRow } from "@/components/project-row";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected work — software, web tools, design projects.",
};

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <>
      <section className="pt-24 pb-12 md:pt-36 md:pb-16">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <Reveal>
            <p className="eyebrow">§ Index of work</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="font-display mt-6 text-[14vw] leading-[0.84] tracking-[-0.04em] text-bone-50 md:text-[10vw]">
              Work<span className="text-ember">.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl text-lg leading-[1.55] text-bone-200 md:text-xl">
              {projects.length} projects spanning construction software,
              traffic engineering, web games, and late-night experiments.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-32">
        <div className="border-y border-border/60">
          {projects.map((p, i) => (
            <ProjectRow key={p.slug} project={p} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
