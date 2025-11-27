/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Browser, type Page } from "puppeteer";
import { type Browser as BrowserCore } from "puppeteer-core";
import { getUserLocation } from "@/lib/get-user-location";

export async function searchForKeyword(
  browser: Browser | BrowserCore,
  keyword: string
) {
  const page = (await browser.newPage()) as Page;

  try {
    console.log("Starting LinkedIn job search for:", keyword);

    // Set a realistic viewport and user agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
    );

    // Enable stealth mode
    await page.evaluateOnNewDocument(() => {
      // Hide webdriver
      Object.defineProperty(navigator, "webdriver", { get: () => false });
      // Hide automation
      Object.defineProperty(navigator, "plugins", {
        get: () => [1, 2, 3, 4, 5],
      });
      Object.defineProperty(navigator, "languages", {
        get: () => ["en-US", "en"],
      });
    });

    // Get user's location from our utility function
    const location = await getUserLocation();
    const country = location.country;

    // Set shorter timeout and optimize page load
    await page.setDefaultTimeout(20000);
    await page.setJavaScriptEnabled(true);

    // Block unnecessary resources to speed up loading
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const resourceType = request.resourceType();
      if (
        resourceType === "image" ||
        resourceType === "stylesheet" ||
        resourceType === "font" ||
        resourceType === "media"
      ) {
        request.abort();
      } else {
        const headers = request.headers();
        headers["Accept-Language"] = "en-US,en;q=0.9";
        headers["Accept"] =
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
        request.continue({ headers });
      }
    });

    // Add location to search URL
    const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keyword)}&location=${encodeURIComponent(country)}`;
    console.log(`Searching LinkedIn jobs at: ${searchUrl}`);

    console.log("Attempting to navigate to:", searchUrl);
    try {
      await page.goto(searchUrl, {
        waitUntil: "domcontentloaded", // Changed from networkidle0 to be less strict
        timeout: 45000, // Increased timeout
      });
    } catch (navError) {
      console.error("Navigation error:", navError);
      // Try again with less strict options
      await page.goto(searchUrl, {
        waitUntil: "load",
        timeout: 60000,
      });
    }

    // Log the current URL to debug redirects
    const currentUrl = await page.url();
    console.log("Current page URL:", currentUrl);

    // Take a screenshot in production for debugging
    if (
      process.env.NODE_ENV === "production" ||
      process.env.VERCEL_ENV === "production"
    ) {
      try {
        const screenshot = await page.screenshot();
        console.log("Screenshot taken, size:", screenshot.length, "bytes");
      } catch (screenshotError) {
        console.error("Screenshot error:", screenshotError);
      }
    }

    // Check the page content and status
    const pageContent = await page.content();
    console.log("Page content length:", pageContent.length);

    // First check if we're redirected to login page
    const isLoginPage = await page.evaluate(() => {
      const url = window.location.href;
      const isLogin =
        url.includes("linkedin.com/login") ||
        url.includes("linkedin.com/checkpoint") ||
        document.querySelector("form#login") !== null;
      return isLogin;
    });

    console.log("Is login page:", isLoginPage);

    if (isLoginPage) {
      console.log("LinkedIn requires authentication. Returning empty results.");
      return [];
    }

    // Reduced wait time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Try different selectors for job listings
    const selectors = [
      ".jobs-search__results-list",
      ".scaffold-layout__list-container",
      ".jobs-search-results-list",
    ];

    let foundSelector = null;
    console.log("Checking selectors...");
    for (const selector of selectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          foundSelector = selector;
          console.log("Found working selector:", selector);
          break;
        }
      } catch (selectorError) {
        console.error("Error checking selector:", selector, selectorError);
      }
    }

    if (!foundSelector) {
      console.log("No job listings found with known selectors");
      return [];
    }

    // Simplified scrolling with fewer iterations
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let scrollCount = 0;
        const maxScrolls = 5; // Reduced number of scrolls

        const timer = setInterval(() => {
          window.scrollBy(0, window.innerHeight);
          scrollCount++;

          if (scrollCount >= maxScrolls) {
            clearInterval(timer);
            resolve(true);
          }
        }, 100);
      });
    });

    // Minimal wait after scrolling
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Extract job listings with more flexible selectors
    const jobs = await page.evaluate(() => {
      const getTextContent = (element: Element | null, selector: string) => {
        const el = element?.querySelector(selector);
        return el?.textContent?.trim() || "";
      };

      const getLink = (element: Element | null, selector: string) => {
        const el = element?.querySelector(selector);
        return el?.getAttribute("href") || "";
      };

      // Try different selectors for job cards
      const cardSelectors = [
        ".jobs-search__results-list > li",
        ".scaffold-layout__list-container div.job-search-card",
        ".jobs-search-results-list .job-card-container",
      ];

      let listings: Element[] = [];
      for (const selector of cardSelectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          listings = Array.from(elements);
          break;
        }
      }

      return listings
        .map((listing) => {
          // Try different selectors for each field
          const titleSelectors = [
            ".base-search-card__title",
            ".job-card-list__title",
            "h3.base-search-card__title",
            ".job-card-container__link",
          ];

          const companySelectors = [
            ".base-search-card__subtitle",
            ".job-card-container__company-name",
            ".job-card-container__primary-description",
          ];

          const locationSelectors = [
            ".job-search-card__location",
            ".job-card-container__metadata-item",
            ".job-card-container__location",
          ];

          const linkSelectors = [
            ".base-card__full-link",
            ".job-card-list__title",
            ".job-card-container__link",
          ];

          let title = "";
          let company = "";
          let location = "";
          let link = "";

          // Try each selector until we find content
          for (const selector of titleSelectors) {
            title = getTextContent(listing, selector);
            if (title) break;
          }

          for (const selector of companySelectors) {
            company = getTextContent(listing, selector);
            if (company) break;
          }

          for (const selector of locationSelectors) {
            location = getTextContent(listing, selector);
            if (location) break;
          }

          for (const selector of linkSelectors) {
            link = getLink(listing, selector);
            if (link) break;
          }

          // Generate a unique ID
          const id = Math.random().toString(36).substring(7);

          return {
            title,
            company,
            description: location,
            link: link.startsWith("http")
              ? link
              : `https://www.linkedin.com${link}`,
            id,
            source: "linkedin",
          };
        })
        .filter((job) => job.title && job.company && job.link);
    });

    return jobs;
  } catch (error) {
    console.error(`Error searching LinkedIn for ${keyword}:`, error);
    return [];
  } finally {
    await page.close();
  }
}
