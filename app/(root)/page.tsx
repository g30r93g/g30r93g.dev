import type { Metadata } from "next";
import Link from "next/link";
import "./home.css";
import GithubCard from "@/components/home/github-card";
import NavPill from "@/components/home/nav-pill";
import SocialPill from "@/components/home/social-pill";
import Spotlight from "@/components/home/spotlight";
import { ThemeName, WearTheme } from "@/components/home/theme-controls";
import { Bento, HomeProvider } from "@/components/home/theme-provider";
import { THEME_BOOT_SCRIPT, THEME_IDS, THEMES } from "@/components/home/themes";
import ToolStrip from "@/components/home/tool-strip";
import { getBlogPosts } from "@/lib/blog";
import { getContributions } from "@/lib/contributions";
import { getExperience } from "@/lib/experience";
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
  twitter: { card: "summary", title: `${NAME} | ${JOB_TITLE}`, description: DESCRIPTION },
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
  const yearsOf = Math.floor(
    (BUILT.getTime() - Math.min(...work.map((e) => e.startDate.getTime()))) / (365.25 * 24 * 3600 * 1000),
  );

  const projects = THEME_IDS.flatMap((theme) => {
    const slug = THEMES[theme].project;
    const project = slug ? getSingleProject(slug) : undefined;
    return project ? [{ theme, project }] : [];
  });
  const post = getBlogPosts()[0];
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
    <HomeProvider>
      {/* wear the saved theme before first paint */}
      <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      <script
        type={"application/ld+json"}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className={"aura"} aria-hidden={"true"} />

      <NavPill />

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
                <span>
                  {current.role} at <b>{current.companyName}</b>
                </span>
              </div>
            )}
          </div>
        </section>

        <ToolStrip data={tools} />

        <Spotlight />

        <section className={"card c-exp"} data-cat={"work"}>
          <div className={"label"}>{yearsOf} years of</div>
          <h2 className={"display"}>Experience</h2>
          <ol className={"exp-list"}>
            {shown.map((e) => (
              <li key={e.slug}>
                <Link href={e.url} className={`exp${e === current ? "" : " past"}`}>
                  <h3 className={"role display"}>{e.role}</h3>
                  <div>
                    <div className={"co"}>
                      <span>{e.companyName}</span>
                      {e.logo && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={e.logo} style={{ background: e.logoBackground }} alt={""} />
                      )}
                    </div>
                    <span className={"yr"}>{years(e)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section className={"card c-now"} data-cat={"projects"}>
          <div className={"label"}>Currently building</div>
          <div className={"arrow-row"}>
            <div className={"big display"}>RaceDash — cloud rendering pipeline</div>
            <span className={"badge live"}>IN PROGRESS</span>
          </div>
        </section>

        {post ? (
          <Link className={"card c-blog"} data-cat={"about"} href={post.url}>
            <div className={"label"}>Latest writing{post.draft ? " · Draft" : ""}</div>
            <div>
              <div className={"big display"}>{post.title}</div>
              {post.description && <p>{post.description}</p>}
            </div>
          </Link>
        ) : (
          <section className={"card c-blog"} data-cat={"about"}>
            <div className={"label"}>Writing</div>
            <div>
              <div className={"big display"}>First post coming soon</div>
            </div>
          </section>
        )}

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
                <WearTheme theme={theme} />
              </div>
            </section>
          );
        })}

        <GithubCard profile={profile} days={days} />
      </Bento>

      <footer className={"home-foot"}>
        <span className={"label"}>
          © {BUILT.getFullYear()} {NAME} · <ThemeName />
        </span>
        <span className={"label kbd-hint"}>
          Themes <span className={"kbd"}>1</span>–<span className={"kbd"}>{THEME_IDS.length}</span>
        </span>
      </footer>
    </HomeProvider>
  );
}
