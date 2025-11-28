/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import chromium from "@sparticuz/chromium-min";
import puppeteer, { type Browser } from "puppeteer";
import puppeteerCore, {
  type Browser as BrowserCore,
  type LaunchOptions,
} from "puppeteer-core";
import { requireAuth } from "@/utils/auth-guard";
import { searchForKeyword } from "./helper";

export const dynamic = "force-dynamic";
// Increase timeout for Vercel (max 60 seconds)
export const maxDuration = 60;
// Force dynamic to prevent caching
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const { session } = await requireAuth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchQuery } = await req.json();
    const keywords = searchQuery.split(/[,\s]+/).filter(Boolean);

    let browser: Browser | BrowserCore;
    if (
      process.env.NODE_ENV === "production" ||
      process.env.VERCEL_ENV === "production"
    ) {
      const executablePath = await chromium.executablePath(
        "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar"
      );
      browser = await puppeteerCore.launch({
        executablePath,
        args: chromium.args,
        headless: true,
        defaultViewport: chromium.defaultViewport,
      } as LaunchOptions);
    } else {
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }

    // Process keywords sequentially to avoid timeouts
    const jobsArrays = [];
    for (const keyword of keywords) {
      try {
        const jobs = await searchForKeyword(browser, keyword);
        jobsArrays.push(jobs);
        // Break early if we've found enough jobs
        if (jobsArrays.flat().length >= 20) break;
      } catch (error) {
        console.error(`Error searching for keyword ${keyword}:`, error);
        jobsArrays.push([]);
      }
    }

    await browser.close();

    // Combine all results and remove duplicates based on job link
    const uniqueJobs = Array.from(
      new Map(jobsArrays.flat().map((job) => [job.link, job])).values()
    );

    return NextResponse.json({ jobs: uniqueJobs });
  } catch (error) {
    console.error("Error fetching LinkedIn jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
