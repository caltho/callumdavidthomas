import type { Metadata } from "next";
import Link from "next/link";
import { getStuff } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Stuff",
  description: "Other stuff — hikes, hobbies, adventures.",
};

export default async function StuffPage() {
  const stuff = await getStuff();

  return (
    <>
      <section className="pt-24 pb-12 md:pt-36 md:pb-16">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <Reveal>
            <p className="eyebrow">§ Other stuff</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="font-display mt-6 text-[14vw] leading-[0.84] tracking-[-0.04em] text-bone-50 md:text-[10vw]">
              Stuff<span className="text-ember">.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl text-lg leading-[1.55] text-bone-200 md:text-xl">
              Things I do when I&apos;m not at a keyboard.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-32">
        <div className="border-y border-border/60">
          {stuff.map((item, i) => (
            <Link
              key={item.slug}
              href={`/stuff/${item.slug}`}
              className="sweep group block border-t border-border/60 first:border-t-0"
            >
              <div className="mx-auto grid max-w-[1600px] grid-cols-12 items-baseline gap-6 px-6 py-7 md:px-10 md:py-10">
                <span className="col-span-2 font-mono text-xs uppercase tracking-[0.2em] text-bone-600 md:col-span-1">
                  {pad(i + 1)}
                </span>
                <div className="col-span-10 md:col-span-7">
                  <h3 className="font-display text-3xl text-bone-50 transition-transform group-hover:translate-x-1.5 md:text-5xl lg:text-6xl">
                    {item.title}
                  </h3>
                </div>
                <p className="col-span-7 hidden text-sm text-bone-400 md:col-span-3 md:block">
                  {item.summary}
                </p>
                <span className="col-span-5 text-right font-mono text-[10px] uppercase tracking-[0.2em] text-bone-400 md:col-span-1">
                  Read →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
