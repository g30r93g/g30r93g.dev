import snapshot from "@/content/github/contributions.json";

export type ContributionDay = { date: string; personal: number; work: number };
export type GithubProfile = {
  repos: number;
  stars: number;
  followers: number;
  since: string;
  avatar: string;
};

/**
 * Commits per day over the last 53 weeks, split into personal and work, plus
 * profile stats. Built by scripts/build-contributions.py with the authenticated
 * gh CLI, because GitHub's public calendar can't tell private personal repos from
 * private work repos, and its unauthenticated API allows only 60 requests an hour.
 */
export function getContributions(): {
  generated: string;
  profile: GithubProfile;
  days: ContributionDay[];
} {
  // 53 week-columns with Monday on the first row: start on the Monday 52 weeks
  // before the week of the last day in the snapshot.
  const last = new Date(snapshot.days[snapshot.days.length - 1].date + "T00:00:00Z");
  const monday = new Date(last);
  monday.setUTCDate(last.getUTCDate() - ((last.getUTCDay() + 6) % 7) - 52 * 7);
  const start = monday.toISOString().slice(0, 10);

  return {
    generated: snapshot.generated,
    profile: snapshot.profile,
    days: snapshot.days.filter((d) => d.date >= start),
  };
}
