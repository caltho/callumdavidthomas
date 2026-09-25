import Link from "next/link";

/** Shared frame for posts, project write-ups and index pages. */
export function ArticleHead({
  back,
  crumb,
  kicker,
  title,
  dek,
}: {
  back: { href: string; label: string };
  crumb?: React.ReactNode;
  kicker?: React.ReactNode;
  title: string;
  dek?: React.ReactNode;
}) {
  return (
    <section className="row titlerow">
      <div className="cell crumbs">
        <Link className="label" href={back.href}>
          ← {back.label}
        </Link>
        {crumb && <span className="label">{crumb}</span>}
      </div>
      <div className="cell ttl">
        {kicker && <p className="label">{kicker}</p>}
        <h1>{title}</h1>
        {dek && <p className="dek">{dek}</p>}
      </div>
    </section>
  );
}

export function Facts({ items }: { items: [string, React.ReactNode][] }) {
  return (
    <dl className="facts">
      {items.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ArticleBody({ side, children }: { side?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="row body" id="content">
      <div className="cell side">
        <div className="in">{side}</div>
      </div>
      <article className="cell">{children}</article>
    </section>
  );
}
