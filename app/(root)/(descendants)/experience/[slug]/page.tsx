import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import "@/components/experience/experience.css";
import RoleLogo from "@/components/experience/logo";
import Timeline from "@/components/experience/timeline";
import PageTransition, { Morph } from "@/components/site/page-transition";
import { getExperience, getSingleExperience, monthYear, period, tenure, timelineOf } from "@/lib/experience";
import { toolIcon } from "@/lib/tools";
import type Experience from "@/types/experience";

// the page is static: "now" is when it was built
const BUILT = new Date();

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const e = getSingleExperience((await params).slug);
  if (!e) return {};
  return {
    title: `${e.role} at ${e.companyName}`,
    description:
      e.description ??
      `${e.role} at ${e.companyName}, ${period(e)}.${e.tools?.length ? ` Tools: ${e.tools.join(", ")}.` : ""}`,
    alternates: { canonical: e.url },
  };
}

/** "Azure DevOps" to "AD", for a tool without a logo */
const initials = (name: string) =>
  name
    .replace(/[^A-Za-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/** A link to the role before or after this one: newer slides back, earlier slides forward. */
function Step({ e, direction }: { e?: Experience; direction: "newer" | "earlier" }) {
  if (!e) return <div className={"span-6"} />;
  return (
    <Link
      className={`card step ${direction} span-6`}
      href={e.url}
      transitionTypes={[direction === "earlier" ? "nav-forward" : "nav-back"]}
    >
      <RoleLogo slug={e.slug} logo={e.logo} background={e.logoBackground} />
      <div>
        <div className={"label"}>{direction === "earlier" ? "Earlier" : "Newer"}</div>
        <h3 className={"display"}>
          <Morph name={`role-title-${e.slug}`}>
            <span className={"morph-text"}>{e.role}</span>
          </Morph>
        </h3>
        <div className={"co muted"}>{e.companyName}</div>
      </div>
    </Link>
  );
}

export default async function ExperienceItemPage({ params }: Params) {
  const { slug } = await params;
  const experience = getExperience();
  const i = experience.findIndex((e) => e.slug === slug);
  const e = experience[i];
  if (!e) notFound();

  const body = e.content.trim();

  return (
    <PageTransition>
      <main className={"page-grid xp xp-role"}>
        <section className={"card c-role span-8"}>
          <div className={"at"}>
            <RoleLogo slug={e.slug} logo={e.logo} background={e.logoBackground} />
            <div>
              <div className={"label"}>{e.type === "education" ? "Education" : "Work"}</div>
              <a href={e.companyUrl} target={"_blank"} rel={"noreferrer"}>
                {e.companyName}
                <svg className={"ext"} viewBox={"0 0 24 24"} aria-hidden={"true"}>
                  <path d={"M7 17 17 7"} />
                  <path d={"M7 7h10v10"} />
                </svg>
              </a>
            </div>
          </div>
          <h1 className={`display${e.role.length > 40 ? " long" : ""}`}>
            <Morph name={`role-title-${e.slug}`}>
              <span className={"morph-text"}>{e.role}</span>
            </Morph>
          </h1>
          <div className={"foot"}>
            {!e.endDate && <span className={"badge live"}>Current</span>}
            <span className={"label"}>{period(e)}</span>
          </div>
        </section>

        <section className={"card write-up stretch"} aria-labelledby={"about"}>
          <h2 className={"label"} id={"about"}>
            About the role
          </h2>
          {e.description || body ? (
            <div className={"prose"}>
              {e.description && <p>{e.description}</p>}
              {body && <MDXRemote source={body} />}
            </div>
          ) : (
            <p className={"empty"}>
              The write-up for this role is still to come. Until then, the tools list shows what the work used.
            </p>
          )}
        </section>

        <div className={"side-stack"}>
          <section className={"card glance"} aria-labelledby={"glance"}>
            <h2 className={"label"} id={"glance"}>
              At a glance
            </h2>
            <dl className={"facts"}>
              <div>
                <dt className={"label"}>Time there</dt>
                <dd className={"display"}>{tenure(e, BUILT)}</dd>
              </div>
              <div>
                <dt className={"label"}>Started</dt>
                <dd>{monthYear(e.startDate)}</dd>
              </div>
              <div>
                <dt className={"label"}>{e.endDate ? "Finished" : "Until"}</dt>
                <dd>{e.endDate ? monthYear(e.endDate) : "Present"}</dd>
              </div>
            </dl>
          </section>
          {e.tools?.length ? (
            <section className={"card tools"} aria-labelledby={"tools"}>
              <h2 className={"label"} id={"tools"}>
                Tools
              </h2>
              <ul className={"tool-list"}>
                {e.tools.map((name) => {
                  const icon = toolIcon(name);
                  return (
                    <li key={name}>
                      <span className={"ti"}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {icon ? <img src={icon} alt={""} /> : <b aria-hidden={"true"}>{initials(name)}</b>}
                      </span>
                      {name}
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}
          {e.skills?.length ? (
            <section className={"card skills-card"} aria-labelledby={"skills"}>
              <h2 className={"label"} id={"skills"}>
                Skills
              </h2>
              <ul className={"skills"}>
                {e.skills.map((s) => (
                  <li key={s} className={"chip"}>
                    {s}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <section className={"card c-time span-12"} aria-labelledby={"where"}>
          <div className={"time-head"}>
            <h2 className={"label"} id={"where"}>
              Where this sits
            </h2>
            <Link className={"label"} href={"/experience"} transitionTypes={["nav-back"]}>
              All experience
            </Link>
          </div>
          <Timeline timeline={timelineOf(experience, BUILT)} focus={e.slug} />
        </section>

        <Step e={experience[i - 1]} direction={"newer"} />
        <Step e={experience[i + 1]} direction={"earlier"} />
      </main>
    </PageTransition>
  );
}

export function generateStaticParams() {
  return getExperience().map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;
