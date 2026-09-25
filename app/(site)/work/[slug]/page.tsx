/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjects } from "@/lib/content";
import { toWorkItem } from "@/lib/work";
import { ArticleBody, ArticleHead, Facts } from "@/components/site/article";
import { TitleBlock } from "@/components/site/title-block";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Not found" };
  return { title: toWorkItem(project).title, description: project.summary };
}

const KIND = { work: "Work", client: "Client", own: "Personal" } as const;

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const projects = await getProjects();
  const idx = projects.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? projects[idx - 1] : undefined;
  const next = idx >= 0 && idx < projects.length - 1 ? projects[idx + 1] : undefined;
  const item = toWorkItem(project);
  const no = `CT-${String(idx + 1).padStart(2, "0")}`;
  const images = (project.image ?? []).filter(Boolean);

  return (
    <>
      <ArticleHead
        back={{ href: "/#work", label: "All work" }}
        crumb={
          <>
            <b>{no}</b> · {KIND[item.kind]}
          </>
        }
        kicker={
          <>
            <b>{KIND[item.kind]}</b>
            {project.techStack?.length ? ` · ${project.techStack.slice(0, 3).join(" · ")}` : ""}
          </>
        }
        title={item.title}
        dek={project.summary}
      />
      <ArticleBody
        side={
          <Facts
            items={[
              ["Drawing", no],
              ["Type", KIND[item.kind]],
              ...(project.techStack?.length
                ? ([
                    [
                      "Built with",
                      <span className="tags" key="t">
                        {project.techStack.map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </span>,
                    ],
                  ] as [string, React.ReactNode][])
                : []),
              ...(item.live
                ? ([["Live", <a key="l" href={item.live} target="_blank" rel="noopener noreferrer" style={{ borderBottom: "1px solid" }}>{item.live.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")} ↗</a>]] as [string, React.ReactNode][])
                : []),
              ...(project.github
                ? ([["Source", <a key="g" href={project.github} target="_blank" rel="noopener noreferrer" style={{ borderBottom: "1px solid" }}>{project.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")} ↗</a>]] as [string, React.ReactNode][])
                : []),
            ]}
          />
        }
      >
        <div className="prose" dangerouslySetInnerHTML={{ __html: project.longDescription }} />

        {images.length > 0 && (
          <div className="gallery">
            {images.map((src) => (
              <figure key={src}>
                <a href={src} target="_blank" rel="noopener noreferrer">
                  <img src={src} alt={`${item.title} screenshot`} loading="lazy" />
                </a>
              </figure>
            ))}
          </div>
        )}

        {project.codeblock && (
          <div className="code">
            <p className="label">
              <b>{project.codeblock.desc?.[0] ?? "Code"}</b>
            </p>
            {project.codeblock.code.map((c, i) => (
              <pre key={i}>{c}</pre>
            ))}
          </div>
        )}

        <div className="linkrow">
          {item.live && (
            <a className="btn solid" href={item.live} target="_blank" rel="noopener noreferrer">
              Open the live app ↗
            </a>
          )}
          <Link className="btn" href="/#ask">
            Ask Callum about it →
          </Link>
        </div>

        {(prev || next) && (
          <nav className="pager" aria-label="More projects">
            {prev ? (
              <Link href={`/work/${prev.slug}`}>
                <span className="label">← Previous</span>
                <strong>{toWorkItem(prev).title}</strong>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={`/work/${next.slug}`}>
                <span className="label">Next →</span>
                <strong>{toWorkItem(next).title}</strong>
              </Link>
            )}
          </nav>
        )}
      </ArticleBody>
      <TitleBlock drawing={`${no} ${item.title}`} />
    </>
  );
}
