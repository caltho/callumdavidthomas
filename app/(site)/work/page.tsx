import type { Metadata } from "next";
import { getWorkItems } from "@/lib/work";
import { ArticleHead } from "@/components/site/article";
import { WorkRows } from "@/components/site/work-list";
import { TitleBlock } from "@/components/site/title-block";

export const metadata: Metadata = {
  title: "Work",
  description: "Everything Callum Thomas has built: construction software, tools for traffic engineers, client sites and personal apps.",
};

export default async function WorkPage() {
  const items = await getWorkItems();
  return (
    <>
      <ArticleHead
        back={{ href: "/", label: "Home" }}
        crumb={<b>Register of work</b>}
        kicker={<><b>{items.length} projects</b> · newest first</>}
        title="Work."
        dek="Things I've built for construction sites, traffic engineers, clients, and my own life."
      />
      <section className="row" id="content">
        <div className="cell main">
          <WorkRows items={items} className="index-list" />
        </div>
      </section>
      <TitleBlock drawing="Register of work" />
    </>
  );
}
