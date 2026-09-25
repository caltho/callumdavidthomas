/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStuff, getStuffItem } from "@/lib/content";
import { ArticleBody, ArticleHead, Facts } from "@/components/site/article";
import { TitleBlock } from "@/components/site/title-block";

export async function generateStaticParams() {
  const stuff = await getStuff();
  return stuff.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getStuffItem(slug);
  if (!item) return { title: "Not found" };
  return { title: item.title, description: item.summary };
}

export default async function StuffDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getStuffItem(slug);
  if (!item) notFound();

  const [hero, ...rest] = (item.image ?? []).filter(Boolean);
  const facts: [string, React.ReactNode][] = [];
  if (item.location) facts.push(["Where", item.location]);
  if (item.year) facts.push(["When", String(item.year)]);
  if (item.tags?.length)
    facts.push([
      "Filed under",
      <span className="tags" key="t">
        {item.tags.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </span>,
    ]);

  return (
    <>
      <ArticleHead
        back={{ href: "/#proof", label: "Proof of humanity" }}
        crumb={<b>Field note</b>}
        kicker={<><b>Off the clock</b> · Written by a human</>}
        title={item.title}
        dek={item.summary}
      />
      {hero && (
        <section className="row">
          <div className="cell hero">
            <figure>
              <img src={hero} alt={item.title} />
            </figure>
          </div>
        </section>
      )}
      <ArticleBody side={<Facts items={facts} />}>
        <div className="prose" dangerouslySetInnerHTML={{ __html: item.longDescription }} />
        {rest.length > 0 && (
          <div className="gallery">
            {rest.map((src) => (
              <figure key={src}>
                <a href={src} target="_blank" rel="noopener noreferrer">
                  <img src={src} alt="" loading="lazy" />
                </a>
              </figure>
            ))}
          </div>
        )}
        {item.links?.length > 0 && (
          <div className="linkrow">
            {item.links.map((l) => (
              <a key={l.href} className="btn" href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label} ↗
              </a>
            ))}
          </div>
        )}
        <div className="after">
          <Link className="btn solid" href="/#ask">
            Ask Callum about it →
          </Link>
          <Link className="btn" href="/stuff">
            More field notes
          </Link>
        </div>
      </ArticleBody>
      <TitleBlock drawing="Field note" />
    </>
  );
}
