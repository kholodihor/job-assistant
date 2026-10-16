import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser, handleRouteError, unauthorized } from "@/lib/api";
import { launchBrowser } from "../browser";
import { searchForKeyword } from "./helper";

export const dynamic = "force-dynamic";
// Increase timeout for Vercel (max 60 seconds)
export const maxDuration = 60;
// Force dynamic to prevent caching
export const fetchCache = "force-no-store";
export const revalidate = 0;

const MAX_KEYWORDS = 5;

const bodySchema = z.object({
  searchQuery: z.string().trim().min(1).max(200),
  location: z.string().max(100).optional(),
});

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  try {
    const { searchQuery, location } = bodySchema.parse(await req.json());
    const keywords = searchQuery
      .split(/[,\s]+/)
      .filter(Boolean)
      .slice(0, MAX_KEYWORDS);

    const browser = await launchBrowser();
    const jobsArrays: Awaited<ReturnType<typeof searchForKeyword>>[] = [];
    try {
      // Process keywords sequentially to avoid timeouts
      for (const keyword of keywords) {
        try {
          const jobs = await searchForKeyword(
            browser,
            keyword,
            location ?? "Ukraine"
          );
          jobsArrays.push(jobs);
          // Break early if we've found enough jobs
          if (jobsArrays.flat().length >= 20) break;
        } catch (error) {
          console.error(`Error searching for keyword ${keyword}:`, error);
          jobsArrays.push([]);
        }
      }
    } finally {
      await browser.close();
    }

    // Combine all results and remove duplicates based on job link
    const uniqueJobs = Array.from(
      new Map(jobsArrays.flat().map((job) => [job.link, job])).values()
    );

    return NextResponse.json({ jobs: uniqueJobs });
  } catch (error) {
    return handleRouteError(error, "Failed to fetch jobs");
  }
}
