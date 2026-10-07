const LONDON = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" });

/** The date in London as YYYY-MM-DD: the daily puzzle's key. */
export const londonDay = (at = new Date()) => LONDON.format(at);

/** Whole days from one YYYY-MM-DD to another. */
export const daysBetween = (from: string, to: string) =>
  Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
