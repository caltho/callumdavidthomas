import type { Metadata } from "next";
import Link from "next/link";
import { getStuff } from "@/lib/content";
import { ArticleHead } from "@/components/site/article";
import { OptionalFigure } from "@/components/site/optional-figure";
import { TitleBlock } from "@/components/site/title-block";
import { CITIZENSHIP } from "./officially-australian/meta";

export const metadata: Metadata = {
  title: "Field notes",
  description: "Things Callum Thomas does when he's not at a keyboard.",
};

export default async function StuffPage() {
  const stuff = await getStuff();
  const notes = [
    { href: `/stuff/${CITIZENSHIP.slug}`, title: CITIZENSHIP.title, summary: CITIZENSHIP.summary, img: CITIZENSHIP.hero, label: "Citizenship · New" },
    ...stuff.map((s) => ({ href: `/stuff/${s.slug}`, title: s.title, summary: s.summary, img: s.thumbnail, label: s.tags?.[0] ?? "Field note" })),
  ];
  return (
    <>
      <ArticleHead
        back={{ href: "/#proof", label: "Proof of humanity" }}
        crumb={<b>Field notes</b>}
        kicker={<><b>{notes.length} notes</b> · Written by a human</>}
        title="Field notes."
        dek="Things I do when I'm not at a keyboard. Submitted as evidence."
      />
      <section className="row" id="content">
        <div className="cell main">
          <ul className="list">
            {notes.map((n) => (
              <li key={n.href} className="stuff-card">
                <div>{n.img && <OptionalFigure src={n.img} alt="" />}</div>
                <div>
                  <span className="label">{n.label}</span>
                  <h3>
                    <Link href={n.href}>{n.title}</Link>
                  </h3>
                  <p>{n.summary}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <TitleBlock drawing="Field notes" />
    </>
  );
}
