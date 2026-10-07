import type { Metadata } from "next";
import Link from "next/link";
import "./home.css";
import Bento from "@/components/home/bento";
import GithubCard from "@/components/home/github-card";
import ShipIt from "@/components/home/ship-it";
import SocialPill from "@/components/home/social-pill";
import Spotlight from "@/components/home/spotlight";
import { THEME_IDS, THEMES } from "@/components/home/themes";
import ToolStrip from "@/components/home/tool-strip";
import PageTransition, { Morph } from "@/components/site/page-transition";
import { getContributions } from "@/lib/contributions";
import { londonDay } from "@/lib/daily";
import { getExperience, yearsOfWork } from "@/lib/experience";
import { getSingleProject } from "@/lib/projects";
import { getToolStacks } from "@/lib/tools";
import type Experience from "@/types/experience";

const NAME = "George Nick Gorzynski";
const JOB_TITLE = "Full-Stack Software Engineer";
const LOCATION = "London";
const SITE = "https://g30r93g.dev";
const PROFILES = ["https://github.com/g30r93g", "https://www.linkedin.com/in/g30r93g"];
const SKILLS = ["TypeScript", "React", "Next.js", "Node.js", "Swift", "iOS", "Electron", "PostgreSQL", "AWS", "Vercel"];

const DESCRIPTION = `${NAME} is a full-stack software engineer in ${LOCATION}, building web, desktop and iOS products with TypeScript, React, Next.js, Swift and AWS.`;

export const metadata: Metadata = {
  title: { absolute: `${NAME} | ${JOB_TITLE} in ${LOCATION}` },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: NAME,
    title: `${NAME} | ${JOB_TITLE}`,
    description: DESCRIPTION,
    locale: "en_GB",
    firstName: "George",
    lastName: "Gorzynski",
    username: "g30r93g",
  },
  twitter: { card: "summary_large_image", title: `${NAME} | ${JOB_TITLE}`, description: DESCRIPTION },
};

// the page is static: "now" is when it was built
const BUILT = new Date();

const years = (e: Experience) => {
  const from = e.startDate.getFullYear();
  const to = e.endDate?.getFullYear();
  if (!e.endDate) return `${from} – Present`;
  return from === to ? `${from}` : `${from} – ${to}`;
};

export default function Home() {
  const experience = getExperience();
  const work = experience.filter((e) => e.type === "work");
  const current = work.find((e) => !e.endDate);
  const degree = experience.find((e) => e.type === "education");
  const shown = work.filter((e) => e.highlight);
  const yearsOf = yearsOfWork(experience, BUILT);

  const projects = THEME_IDS.flatMap((theme) => {
    const slug = THEMES[theme].project;
    const project = slug ? getSingleProject(slug) : undefined;
    return project ? [{ theme, project }] : [];
  });
  const tools = getToolStacks();
  const { profile, days } = getContributions();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: SITE,
    mainEntity: {
      "@type": "Person",
      name: NAME,
      alternateName: "g30r93g",
      url: SITE,
      jobTitle: JOB_TITLE,
      description: DESCRIPTION,
      address: { "@type": "PostalAddress", addressLocality: LOCATION, addressCountry: "GB" },
      homeLocation: { "@type": "Place", name: `${LOCATION}, United Kingdom` },
      ...(current && {
        worksFor: { "@type": "Organization", name: current.companyName, url: current.companyUrl },
      }),
      ...(degree && {
        alumniOf: { "@type": "CollegeOrUniversity", name: degree.companyName, url: degree.companyUrl },
        hasCredential: {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "degree",
          name: degree.role,
        },
      }),
      knowsAbout: ["Software Engineering", "Full-Stack Development", "System Design", ...SKILLS],
      sameAs: PROFILES,
    },
  };

  return (
    <PageTransition>
      <script
        type={"application/ld+json"}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <Bento>
        <section className={"card c-hero"} data-cat={"about"}>
          <div className={"hero-top"}>
            <div className={"avatar-wrap"}>
              <div className={"avatar"} aria-hidden={"true"}>
                GG
              </div>
            </div>
            <div>
              <h1 className={"name display"}>{NAME}</h1>
              <p className={"label roles"}>
                {JOB_TITLE} · {LOCATION} · TypeScript, React, Next.js, AWS
              </p>
            </div>
          </div>
          <h2 className={"headline display"}>
            Crafting solutions
            <br />
            for <em className={"foil-text"}>interesting</em> problems.
          </h2>
          <div className={"hero-foot"}>
            <SocialPill />
            {current && (
              <div className={"status"}>
                <span className={"dot"} />
                <a href={current.companyUrl} target={"_blank"} rel={"noreferrer"}>
                  {current.role} at <b>{current.companyName}</b>
                </a>
              </div>
            )}
          </div>
        </section>

        <ToolStrip data={tools} />

        <Spotlight />

        <section className={"card c-exp"} data-cat={"work"}>
          <Link className={"exp-more label"} href={"/experience"} transitionTypes={["nav-forward"]}>
            All experience
            {/* lucide: arrow-right */}
            <svg viewBox={"0 0 24 24"} aria-hidden={"true"}>
              <path d={"M5 12h14"} />
              <path d={"m12 5 7 7-7 7"} />
            </svg>
          </Link>
          <div className={"label"}>{yearsOf} years of</div>
          <h2 className={"display"}>
            <Link href={"/experience"} transitionTypes={["nav-forward"]}>
              Experience
            </Link>
          </h2>
          <ol className={"exp-list"}>
            {shown.map((e) => (
              <li key={e.slug}>
                <Link href={e.url} className={`exp${e === current ? "" : " past"}`} transitionTypes={["nav-forward"]}>
                  <h3 className={"role display"}>
                    <Morph name={`role-title-${e.slug}`}>
                      <span className={"morph-text"}>{e.role}</span>
                    </Morph>
                  </h3>
                  <div>
                    <div className={"co"}>
                      <span>{e.companyName}</span>
                      {e.logo && (
                        <Morph name={`role-logo-${e.slug}`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={e.logo} style={{ background: e.logoBackground }} alt={""} />
                        </Morph>
                      )}
                    </div>
                    <span className={"yr"}>{years(e)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <ShipIt day={londonDay()} />

        {projects.map(({ theme, project }) => {
          const link = project.hostedUrl ?? project.repoUrl;
          const inProgress = project.status === "In Progress";
          return (
            <section key={theme} className={"card c-proj"} data-cat={"projects"}>
              <div className={"proj-swatch"} style={{ background: THEMES[theme].swatch }} />
              {project.icon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className={"ic"} src={project.icon} alt={""} />
              )}
              <div>
                <div className={"label"}>{inProgress ? "Featured" : "Project"}</div>
                <h3 className={"display"}>
                  {link ? (
                    <a href={link} target={"_blank"} rel={"noreferrer"}>
                      {project.title}
                    </a>
                  ) : (
                    project.title
                  )}
                </h3>
              </div>
              <p>{project.description}</p>
              <ul className={"tags"} aria-label={"Built with"}>
                {THEMES[theme].tags?.map((t) => (
                  <li key={t} className={"chip"}>
                    {t}
                  </li>
                ))}
              </ul>
              <div className={"foot"}>
                <span className={`badge${inProgress ? " live" : ""}`}>
                  {inProgress
                    ? "In Progress"
                    : [project.status, project.releaseDate?.getFullYear()].filter(Boolean).join(" · ")}
                </span>
              </div>
            </section>
          );
        })}

        <GithubCard profile={profile} days={days} />
      </Bento>

      <footer className={"home-foot"}>
        <span className={"label"}>
          © {BUILT.getFullYear()} {NAME}
        </span>
      </footer>
    </PageTransition>
  );
}
