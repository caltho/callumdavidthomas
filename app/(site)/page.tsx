/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { getWorkItems } from "@/lib/work";
import { getSleep } from "@/lib/sleep";
import { site } from "@/lib/site";
import { Wordmark } from "@/components/site/wordmark";
import { WorkStrip } from "@/components/site/work-list";
import { HumanCheck, HumanSlider } from "@/components/site/fidgets";
import { AskCallum } from "@/components/site/ask-callum";
import { SketchPad } from "@/components/site/sketch-pad";
import { OptionalFigure } from "@/components/site/optional-figure";
import { Clock, Status } from "@/components/site/live";
import { TitleBlock } from "@/components/site/title-block";

const CV = [
  {
    rev: "D",
    years: "2023-now",
    role: "Lead Software Developer & Product Owner",
    org: "RJE Global",
    note: "Took over the quality and safety platform used on live construction sites and rebuilt it front to back: JavaScript to TypeScript, modular, and much faster.",
  },
  {
    rev: "C",
    years: "2021-2023",
    role: "Senior Traffic Engineer",
    org: "Amber Organisation",
    note: "Led traffic engineering projects, including a major subdivision in Dubbo. Built the quote-signing portal clients kept asking for, on the side.",
  },
  {
    rev: "B",
    years: "2019-2021",
    role: "Project Engineer",
    org: "Stantec",
    note: "Traffic impact assessments, SIDRA modelling, swept paths and transport strategies for public and private clients.",
  },
  {
    rev: "A",
    years: "2015",
    role: "BE (Hons) Civil & Environmental, BCom Finance",
    org: "University of Auckland",
    note: "Engineering and finance at the same time, which explains the spreadsheets.",
  },
];

export default async function Home() {
  const [work, sleep] = await Promise.all([getWorkItems(), getSleep()]);

  return (
    <>
      <Wordmark />

      <section className="row intro">
        <div className="cell">
          <p className="label">
            <b>00</b> · Hello
          </p>
          <h1 className="big">A person.</h1>
          <div className="defn">
            <p className="hw">
              <strong>per·son</strong>
              <span className="ipa">/ˈpɜː.sən/</span>
              <em>noun</em>
            </p>
            <ol>
              <li>A real, living human. Not artificial. Occasionally intelligent.</li>
              <li>
                <strong>Callum Thomas.</strong> Builder, AI whisperer, solution seeker. Can feel things, man.
              </li>
            </ol>
          </div>
          <p className="lede">
            The machines write a lot of the code now, and I&apos;m glad of the help. But someone still has to find the problem worth solving, ask better
            questions than the machine, and care whether it works for the people using it.{" "}
            <strong>I did that for eight years as a traffic engineer. Now I do it in software,</strong> as lead developer at RJE Global.
          </p>
          <div className="ctas">
            <a className="btn solid" href="#work">
              See the work ↓
            </a>
            <a className="btn" href="#ask">
              Ask Callum →
            </a>
          </div>
        </div>
        <figure className="cell photo">
          <img src="/images/profile photo.jfif" alt="Callum smiling on a hike, in a blue jacket, green hills and cloud behind" />
          <figcaption className="label">Fig. 1 · Callum (typical). Not AI&#8209;generated.</figcaption>
        </figure>
        <div className="cell">
          <dl className="spec">
            <div>
              <dt>Now</dt>
              <dd>Lead developer &amp; product owner, RJE Global</dd>
            </div>
            <div>
              <dt>Before</dt>
              <dd>8 years as a consulting traffic engineer (Stantec, Amber)</dd>
            </div>
            <div>
              <dt>Studied</dt>
              <dd>BE (Hons) Civil &amp; BCom Finance, University of Auckland</dd>
            </div>
            <div>
              <dt>Based</dt>
              <dd>
                Melbourne. Kiwi, and now an{" "}
                <Link href="/stuff/officially-australian" style={{ borderBottom: "1px solid" }}>
                  Australian citizen
                </Link>{" "}
                too.<span className="new">New</span>
              </dd>
            </div>
            <div>
              <dt>Human check</dt>
              <dd>
                <span className="check">✓</span>Passed. {sleep.sample ? "Still has a pulse." : `Slept ${sleep.last.toFixed(1)} h last night.`}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <main id="content">
        <WorkStrip items={work} />

        <section className="row strip" id="cv">
          <div className="cell side">
            <div className="in">
              <h2>
                <span>02</span>CV
              </h2>
              <p>The site is the CV, so here&apos;s the CV bit. Numbered like drawing revisions, because old habits.</p>
              <a className="more" href={site.socials.find((s) => s.label === "LinkedIn")?.href} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
            </div>
          </div>
          <div className="cell main">
            <p className="kicker">
              An engineer who learned to code, then learned to <em>work with the machines.</em>
            </p>
            <ul className="list cv">
              {CV.map((c) => (
                <li key={c.rev}>
                  <span className="r">
                    <i>{c.rev}</i>
                  </span>
                  <span className="y">{c.years}</span>
                  <span className="role">
                    {c.role}
                    <small>{c.org}</small>
                  </span>
                  <span className="d">{c.note}</span>
                </li>
              ))}
            </ul>
            <div className="tools">
              <span className="label">
                <b>Toolbox</b>
              </span>
              <p>
                TypeScript, React, Next.js, SvelteKit, Angular, Node, Supabase, Postgres, PHP, MySQL, Tailwind and Figma.{" "}
                <span>Plus Claude, which is faster than me at nearly everything except knowing what&apos;s worth building.</span>
              </p>
            </div>
          </div>
        </section>

        <section className="row strip" id="proof">
          <div className="cell side">
            <div className="in">
              <h2>
                <span>03</span>Proof of humanity
              </h2>
              <p>Things no language model has ever done. Submitted as evidence.</p>
              <Link className="more" href="/stuff">
                All stuff →
              </Link>
            </div>
          </div>
          <div className="cell main">
            <p className="kicker">
              Robots don&apos;t sleep, climb hills for fun, or tap out at jiu-jitsu. <em>I do all three, and more.</em>
            </p>
            <ul className="list proof">
              <li>
                <span className="ex">Exhibit A</span>
                <h3>
                  Citizenship<span className="new">New</span>
                </h3>
                <p>
                  <strong>Officially Australian</strong>, and still a Kiwi. Only one robot has ever been granted citizenship (Sophia, Saudi Arabia, 2017).
                  I&apos;m pleased to confirm I&apos;m not her.
                  <Link className="label src" href="/stuff/officially-australian" style={{ color: "var(--ink)" }}>
                    Read the post →
                  </Link>
                </p>
                <OptionalFigure
                  className="figure"
                  src="/images/citizenship/ceremony-group.jpg"
                  alt="Callum holding his citizenship certificate and a small Australian flag, with ceremony guests"
                  imgStyle={{ objectPosition: "50% 45%" }}
                  caption="Fig. 3 · Certificate, tiny flag, gold jacket."
                />
              </li>
              <li>
                <span className="ex">Exhibit B</span>
                <h3>Sleep</h3>
                <p>
                  {sleep.sample ? (
                    <>
                      <strong>About 7 hours a night</strong>, on a good fortnight. Machines don&apos;t need it. I very much do.
                    </>
                  ) : (
                    <>
                      <strong>{sleep.last.toFixed(1)} h last night</strong>, {sleep.avg.toFixed(1)} h on average. Machines don&apos;t need it. I very much do.
                    </>
                  )}
                  <span className="label src">{sleep.sample ? "Illustrative. Almanac's been quiet lately." : "Logged in Almanac, which I built"}</span>
                </p>
                <div className="bars" aria-label="Hours slept, last 14 nights">
                  {sleep.nights.map((h, i) => (
                    <span
                      key={i}
                      className={h == null ? "none" : i === sleep.nights.length - 1 ? "last" : undefined}
                      style={h == null ? undefined : { height: `${(h / 10) * 100}%` }}
                      title={h == null ? "no log" : `${h} h`}
                    />
                  ))}
                </div>
              </li>
              <li>
                <span className="ex">Exhibit C</span>
                <h3>Altitude</h3>
                <p>
                  <strong>Yukhin Peak, 5,130 m</strong>, Kyrgyzstan. Two weeks acclimatising, one awful night at base camp, then a summit so sunny I wore a
                  t-shirt. No machine would bother.
                  <Link className="label src" href="/stuff/yukhin-peak-hike" style={{ color: "var(--ink)" }}>
                    Read the trip →
                  </Link>
                </p>
                <figure className="figure">
                  <img src="/images/yukhin-peak/mountain-yak.jpg" alt="A lone black yak on golden grassland beneath a huge bare mountain" />
                  <figcaption className="label">Fig. 2 · Yak. Also not AI&#8209;generated.</figcaption>
                </figure>
              </li>
              <li>
                <span className="ex">Exhibit D</span>
                <h3>Jiu-jitsu</h3>
                <p>Brazilian. I tap out regularly. Humbling in a way no benchmark is.</p>
                <span />
              </li>
              <li>
                <span className="ex">Exhibit E</span>
                <h3>The boat</h3>
                <p>Logged in Boatlog, naturally. Every entry says &quot;windy&quot;.</p>
                <span />
              </li>
              <li>
                <span className="ex">Exhibit F</span>
                <h3>Art</h3>
                <p>Digital, and the kind with glue. Occasionally both, which is messier than it sounds.</p>
                <span />
              </li>
              <li>
                <span className="ex">Exhibit G</span>
                <h3>Right now</h3>
                <p>
                  Local time in Melbourne, where Callum is probably{" "}
                  <strong>
                    <Status />
                  </strong>
                  .
                </p>
                <Clock className="clock" />
              </li>
            </ul>
            <div className="fidgets">
              <HumanCheck />
              <HumanSlider />
            </div>
          </div>
        </section>

        <section className="row strip" id="ask">
          <div className="cell side">
            <div className="in">
              <h2>
                <span>04</span>Ask Callum
              </h2>
              <p>Hiring, collaborating, or just checking there&apos;s still a human in here.</p>
              <div className="contact">
                <span className="label">Or the old-fashioned way</span>
                <a className="mail" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
                <div className="links">
                  {site.socials.map((s) => (
                    <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">
                      {s.label} ↗
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="cell main">
            <p className="kicker">
              Everyone&apos;s asking AI.
              <br />
              <em>Try asking a human.</em>
            </p>
            <AskCallum />
          </div>
        </section>

        <SketchPad />
      </main>

      <TitleBlock drawing="Homepage" />
    </>
  );
}
