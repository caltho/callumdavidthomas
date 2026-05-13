import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjects } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { pad } from "@/lib/utils";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Not found" };
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const projects = await getProjects();
  const idx = projects.findIndex((p) => p.slug === slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <>
      <article className="pt-24 md:pt-36">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <Reveal>
            <Link
              href="/work"
              className="font-mono text-xs uppercase tracking-[0.2em] text-bone-400 transition-colors hover:text-ember"
            >
              ← Back to index
            </Link>
          </Reveal>

          <div className="mt-8 flex items-baseline gap-6">
            <Reveal>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-bone-600">
                Project {pad(idx + 1)}
              </span>
            </Reveal>
          </div>

          <Reveal delay={0.05}>
            <h1 className="font-display mt-4 text-[12vw] leading-[0.86] tracking-[-0.04em] text-bone-50 md:text-[8vw]">
              {project.title}
              <span className="text-ember">.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-10 max-w-2xl text-lg leading-[1.55] text-bone-200 md:text-xl">
              {project.summary}
            </p>
          </Reveal>

          <div className="mt-16 grid grid-cols-12 gap-6 border-y border-border/60 py-8">
            <Reveal className="col-span-12 md:col-span-4">
              <p className="eyebrow">Stack</p>
              <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-bone-200">
                {project.techStack.map((t) => (
                  <li key={t} className="font-mono text-xs uppercase tracking-[0.15em]">
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="col-span-6 md:col-span-4" delay={0.05}>
              <p className="eyebrow">Live</p>
              <p className="mt-3 text-sm">
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bone-50 transition-colors hover:text-ember"
                  >
                    {project.link.replace(/^https?:\/\//, "")} ↗
                  </a>
                ) : (
                  <span className="text-bone-600">—</span>
                )}
              </p>
            </Reveal>
            <Reveal className="col-span-6 md:col-span-4" delay={0.1}>
              <p className="eyebrow">Source</p>
              <p className="mt-3 text-sm">
                {project.github ? (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bone-50 transition-colors hover:text-ember"
                  >
                    {project.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")} ↗
                  </a>
                ) : (
                  <span className="text-bone-600">—</span>
                )}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div
              className="prose-cdt mx-auto mt-16 max-w-3xl text-lg leading-[1.55] text-bone-200 [&_a]:text-ember [&_a:hover]:text-bone-50 [&_li]:my-2 [&_ul]:list-disc [&_ul]:pl-6"
              dangerouslySetInnerHTML={{ __html: project.longDescription }}
            />
          </Reveal>

          {project.codeblock && (
            <Reveal delay={0.2}>
              <div className="mx-auto mt-16 max-w-4xl space-y-8">
                {project.codeblock.code.map((code, i) => (
                  <div key={i}>
                    {project.codeblock!.desc[i] && (
                      <p className="eyebrow mb-3">{project.codeblock!.desc[i]}</p>
                    )}
                    <pre className="overflow-x-auto rounded-lg border border-border/60 bg-ink-700 p-6 font-mono text-[12px] leading-relaxed text-bone-200">
                      <code>{code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </article>

      <section className="mt-32 border-t border-border/60">
        <Link
          href={`/work/${next.slug}`}
          className="sweep group block"
        >
          <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-10 md:py-24">
            <p className="eyebrow">Next project</p>
            <p className="font-display mt-4 text-5xl text-bone-50 transition-colors group-hover:text-ember md:text-7xl">
              {next.title} →
            </p>
          </div>
        </Link>
      </section>
    </>
  );
}
