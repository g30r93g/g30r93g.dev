import type { Metadata } from "next";
import "@/components/experience/experience.css";
import RoleBrowser, { type RoleCard } from "@/components/experience/role-browser";
import PageTransition from "@/components/site/page-transition";
import { getExperience, period, tenure, timelineOf, yearsOfWork } from "@/lib/experience";

// the page is static: "now" is when it was built
const BUILT = new Date();

export const metadata: Metadata = {
  title: "Experience",
  description:
    "George Nick Gorzynski's software engineering roles, his Computer Science degree at the University of Surrey and the student societies he built for.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  const experience = getExperience();
  const current = experience.find((e) => e.type === "work" && !e.endDate);
  const roles: RoleCard[] = experience.map((e) => ({
    slug: e.slug,
    url: e.url,
    role: e.role,
    companyName: e.companyName,
    logo: e.logo,
    logoBackground: e.logoBackground,
    type: e.type,
    current: e === current,
    period: period(e),
    tenure: tenure(e, BUILT),
    tools: e.tools ?? [],
  }));

  return (
    <PageTransition>
      <main className={"page-grid xp"}>
        <section className={"card xp-intro span-12"}>
          <div>
            <div className={"label"}>{yearsOfWork(experience, BUILT)} years of</div>
            <h1 className={"display"}>Experience</h1>
          </div>
          <div className={"row"}>
            <p className={"lede"}>
              Software engineering roles, studies and the student societies I built for, side by side.
              {current && (
                <>
                  {" "}
                  Currently a <b>{current.role}</b> at <b>{current.companyName}</b>.
                </>
              )}
            </p>
            <dl className={"xp-tally"}>
              <div>
                <dt className={"label"}>Roles</dt>
                <dd className={"display"}>{experience.length}</dd>
              </div>
              <div>
                <dt className={"label"}>Organisations</dt>
                <dd className={"display"}>{new Set(experience.map((e) => e.companyName)).size}</dd>
              </div>
              <div>
                <dt className={"label"}>Tools</dt>
                <dd className={"display"}>{new Set(experience.flatMap((e) => e.tools ?? [])).size}</dd>
              </div>
            </dl>
          </div>
        </section>

        <RoleBrowser roles={roles} timeline={timelineOf(experience, BUILT)} />
      </main>
    </PageTransition>
  );
}
