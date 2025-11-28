/* eslint-disable import/order */
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

// Create the next-intl middleware
const intlMiddleware = createIntlMiddleware({
  locales: ["en", "ua"],
  defaultLocale: "ua",
  localePrefix: "always",
});

export default async function middleware(request: NextRequest) {
  // Only handle localization; auth is enforced inside the app, not in Edge middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - API routes
    // - Static files
    // - Internal Next.js paths
    "/((?!api|_next|_vercel|.*\\..*).*)",
    "/",
  ],
};
