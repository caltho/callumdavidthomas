import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStuff, getStuffItem } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { ImageGallery } from "@/components/image-gallery";
import { pad } from "@/lib/utils";

export async function generateStaticParams() {
  const stuff = await getStuff();
  return stuff.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getStuffItem(slug);
  if (!item) return { title: "Not found" };
  return { title: item.title, description: item.summary };
}

export default async function StuffDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getStuffItem(slug);
  if (!item) notFound();

  const stuff = await getStuff();
  const idx = stuff.findIndex((s) => s.slug === slug);

  return (
    <article className="pt-24 pb-32 md:pt-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <Reveal>
          <Link
            href="/stuff"
            className="font-mono text-xs uppercase tracking-[0.2em] text-bone-400 transition-colors hover:text-ember"
          >
            ← Back to stuff
          </Link>
        </Reveal>

        <Reveal delay={0.05}>
          <span className="font-mono mt-8 block text-xs uppercase tracking-[0.2em] text-bone-600">
            Stuff {pad(idx + 1)}
          </span>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="font-display mt-4 text-[12vw] leading-[0.86] tracking-[-0.04em] text-bone-50 md:text-[8vw]">
            {item.title}
            <span className="text-ember">.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-10 max-w-2xl text-lg leading-[1.55] text-bone-200 md:text-xl">
            {item.summary}
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div
            className="prose-cdt mx-auto mt-16 max-w-3xl text-lg leading-[1.55] text-bone-200 [&_a]:text-ember"
            dangerouslySetInnerHTML={{ __html: item.longDescription }}
          />
        </Reveal>

        {item.image && item.image.length > 0 && (
          <Reveal delay={0.25}>
            <div className="mx-auto mt-16 max-w-5xl">
              <p className="eyebrow mb-6">§ Photos</p>
              <ImageGallery images={item.image} alt={item.title} />
            </div>
          </Reveal>
        )}
      </div>
    </article>
  );
}
