import { revalidatePath } from "next/cache";
import { londonDay } from "@/lib/daily";

/**
 * Re-renders the home page so its HTML carries the new day's Ship it puzzle.
 * Vercel crons run on UTC, so vercel.json calls this at 23:00 and 00:00 UTC:
 * one of the two is just after midnight in London, whether or not it's BST.
 */
export function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  revalidatePath("/");
  return Response.json({ revalidated: true, day: londonDay() });
}
