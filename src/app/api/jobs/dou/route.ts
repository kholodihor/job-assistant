import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser, handleRouteError, unauthorized } from "@/lib/api";
import { launchBrowser } from "../browser";
import { type DouJob, searchForKeyword } from "./helper";

export const dynamic = "force-dynamic";
// Increase timeout for Vercel (max 60 seconds)
export const maxDuration = 60;
// Force dynamic to prevent caching
export const fetchCache = "force-no-store";
export const revalidate = 0;

const MAX_KEYWORDS = 5;

const bodySchema = z.object({
  searchQuery: z.string().trim().min(1).max(200),
});

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  try {
    const { searchQuery } = bodySchema.parse(await req.json());
    const keywords = searchQuery
      .split(/[,\s]+/)
      .filter(Boolean)
      .slice(0, MAX_KEYWORDS);

    const browser = await launchBrowser();
    const jobsArrays: DouJob[][] = [];
    try {
      // Process keywords sequentially and limit total results
      for (const keyword of keywords) {
        try {
          const jobs = await searchForKeyword(browser, keyword);
          jobsArrays.push(jobs);
          // Break early if we've found enough jobs
          if (jobsArrays.flat().length >= 15) break;
          // Add minimal delay between searches
          await delay(500);
        } catch (error) {
          console.error(`Error searching for keyword ${keyword}:`, error);
          jobsArrays.push([]);
        }
      }
    } finally {
      await browser.close();
    }

    // Create a more unique key using multiple fields
    const uniqueJobs = Array.from(
      new Map(
        jobsArrays.flat().map((job) => [
          `${job.id}-${job.company}-${job.title}`, // Using multiple fields as unique key
          job,
        ])
      ).values()
    );

    return NextResponse.json({ jobs: uniqueJobs });
  } catch (error) {
    return handleRouteError(error, "Failed to fetch jobs");
  }
}
