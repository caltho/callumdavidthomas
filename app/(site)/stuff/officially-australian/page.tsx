import type { Metadata } from "next";
import Link from "next/link";
import { ArticleBody, ArticleHead, Facts } from "@/components/site/article";
import { OptionalFigure } from "@/components/site/optional-figure";
import { TitleBlock } from "@/components/site/title-block";
import { CITIZENSHIP } from "./meta";

export const metadata: Metadata = {
  title: "Officially Australian",
  description: "Callum Thomas is now an Australian citizen. Still a Kiwi. Still a person. Now with paperwork.",
};

export default function CitizenshipPost() {
  return (
    <>
      <ArticleHead
        back={{ href: "/#proof", label: "Proof of humanity" }}
        crumb={
          <>
            <b>Exhibit A</b> · Field note
          </>
        }
        kicker={
          <>
            <b>Citizenship</b> · 2 minute read · Written by a human
          </>
        }
        title={CITIZENSHIP.title}
        dek={CITIZENSHIP.summary}
      />
      <section className="row">
        <div className="cell hero">
          <OptionalFigure
            src={CITIZENSHIP.hero}
            alt="Callum holding his citizenship certificate and a small Australian flag, standing with guests in front of the Aboriginal, Australian and Torres Strait Islander flags"
            caption="Fig. 1 · Certificate, tiny flag, gold jacket. Merri-bek."
          />
        </div>
      </section>
      <ArticleBody
        side={
          <Facts
            items={[
              ["Status", "Australian citizen"],
              ["Also", "Still a Kiwi"],
              ["Where", "Merri-bek, Melbourne"],
              ["Took", "One pledge, one handshake"],
              ["Souvenirs", "Certificate, tiny flag, a plant"],
              ["Plant status", "Alive (so far)"],
            ]}
          />
        }
      >
        <div className="prose">
          <p className="lead">Some news from the human department: I&apos;m an Australian citizen now.</p>
          <p>
            I&apos;ve lived in Melbourne long enough to have strong opinions about coffee and to call the afternoon the arvo without irony. At some point
            the paperwork caught up with the feeling, and there was a ceremony.
          </p>

          <h2>
            <span>01</span>The ceremony
          </h2>
          <p>
            It was at Merri-bek, under three flags and one very red curtain. There were speeches, a pledge, a handshake, a certificate, a tiny flag, and a
            small plant to take home. I&apos;m now responsible for keeping an Australian plant alive, which feels like the real citizenship test.
          </p>
          <p>I wore the gold jacket. If you&apos;re only going to become a citizen once, you should dress like it.</p>

          <OptionalFigure
            className="inline"
            src={CITIZENSHIP.handshake}
            alt="Callum shaking hands and receiving his certificate on stage"
            caption="Fig. 2 · The handshake. Legally binding, probably."
          />

          <h2>
            <span>02</span>The pledge
          </h2>
          <p>
            You make the pledge out loud, in a room full of people who are all doing the same thing for their own reasons. Nobody can do it on your behalf:
            no assistant, no model, no autocomplete. For something that&apos;s mostly forms and waiting, it was surprisingly moving.
          </p>
          <p className="pull">I can feel things, man.</p>
          <p>Only one robot has ever been granted citizenship (Sophia, Saudi Arabia, 2017). I&apos;m pleased to confirm I&apos;m not her.</p>

          <h2>
            <span>03</span>Still a Kiwi
          </h2>
          <p>
            New Zealand lets you keep both, so I&apos;m now officially two things at once. The only downside is working out who to cheer for when they play
            each other. I&apos;ll be supporting whoever&apos;s winning.
          </p>

          <h2>
            <span>04</span>Thanks
          </h2>
          <p>
            To everyone who came along, to the council team who ran the whole thing, and to Australia for having me. Next step: learn the second verse of the
            anthem.
          </p>
        </div>
        <div className="after">
          <Link className="btn solid" href="/#ask">
            Say congrats to Callum →
          </Link>
          <Link className="btn" href="/#proof">
            More proof of humanity
          </Link>
        </div>
      </ArticleBody>
      <TitleBlock drawing="Field note 01" />
    </>
  );
}
