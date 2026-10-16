/* eslint-disable @typescript-eslint/no-explicit-any */
import chromium from "@sparticuz/chromium-min";
import puppeteer, { type Browser, type Page } from "puppeteer";
import puppeteerCore, {
  type Browser as BrowserCore,
  type LaunchOptions,
} from "puppeteer-core";

export async function launchBrowser(): Promise<Browser | BrowserCore> {
  if (
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production"
  ) {
    const executablePath = await chromium.executablePath(
      "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar"
    );
    return puppeteerCore.launch({
      executablePath,
      args: chromium.args,
      headless: true,
      defaultViewport: chromium.defaultViewport,
    } as LaunchOptions);
  }

  return puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

/**
 * Aborts image/stylesheet/font/media requests and stamps the given
 * Accept-Language header on everything else.
 */
export async function blockHeavyResources(page: Page, acceptLanguage: string) {
  await page.setRequestInterception(true);
  page.on("request", (request: any) => {
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
      headers["Accept-Language"] = acceptLanguage;
      headers["Accept"] =
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
      request.continue({ headers });
    }
  });
}
