/* eslint-disable @typescript-eslint/no-explicit-any */
import { blockHeavyResources } from "../browser";

export interface DouJob {
  title: string;
  company: string;
  description: string;
  link: string;
  id: string;
}

export async function searchForKeyword(
  browser: any,
  keyword: string
): Promise<DouJob[]> {
  const page = await browser.newPage();

  try {
    // Set shorter timeouts for faster response
    await page.setDefaultNavigationTimeout(20000);
    await page.setDefaultTimeout(20000);

    // Set a realistic viewport
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
    );

    // Block unnecessary resources to speed up loading
    await blockHeavyResources(page, "uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7");

    try {
      await page.goto(
        `https://jobs.dou.ua/vacancies/?search=${encodeURIComponent(keyword)}`,
        {
          waitUntil: "domcontentloaded", // Less strict wait condition
          timeout: 20000,
        }
      );
    } catch (navError) {
      console.error("Navigation error:", navError);
      // Try again with more lenient settings
      await page.goto(
        `https://jobs.dou.ua/vacancies/?search=${encodeURIComponent(keyword)}`,
        {
          waitUntil: "load",
          timeout: 30000,
        }
      );
    }

    // Wait for either the vacancy list or the no-results message.
    // A timeout here is not fatal: we still read whatever rendered.
    try {
      await Promise.race([
        page.waitForSelector(".l-vacancy", { timeout: 30000 }),
        page.waitForSelector(".nothing-found", { timeout: 30000 }),
      ]);
    } catch {
      // continue with whatever is on the page
    }

    // Get cookies regardless of vacancy presence
    const cookies = await page.cookies();
    const csrfCookie = cookies.find(
      (cookie: any) => cookie.name === "csrftoken"
    );

    if (!csrfCookie) {
      return [];
    }

    const allJobs = await page.evaluate(() => {
      // Check for no results first
      const nothingFound = document.querySelector(".nothing-found");
      if (nothingFound) {
        return [];
      }

      const vacancies = Array.from(
        document.querySelectorAll(".l-vacancy") || []
      ).slice(0, 5); // Reduced number of jobs per keyword for faster response

      return vacancies.map((vacancy) => ({
        title: vacancy.querySelector(".vt")?.textContent?.trim() || "",
        company: vacancy.querySelector(".company")?.textContent?.trim() || "",
        description:
          vacancy.querySelector(".sh-info")?.textContent?.trim() || "",
        link:
          vacancy.querySelector(".vt a:not(.company)")?.getAttribute("href") ||
          "",
        id: vacancy.getAttribute("data-id") || "",
      }));
    });

    return allJobs.map((job: any) => ({
      ...job,
      link: job.link.startsWith("http")
        ? job.link
        : `https://jobs.dou.ua${job.link}`,
    }));
  } catch (error) {
    console.error(`Error searching for ${keyword}:`, error);
    return [];
  } finally {
    await page.close();
  }
}
