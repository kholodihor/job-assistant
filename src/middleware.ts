/* eslint-disable import/order */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { auth } from "@/lib/auth";

// Create the next-intl middleware
const intlMiddleware = createIntlMiddleware({
  locales: ["en", "ua"],
  defaultLocale: "ua",
  localePrefix: "always",
});

export default async function middleware(request: NextRequest) {
  // Check if the path is under /profile/
  const isProfilePath =
    request.nextUrl.pathname.includes("/profile/") ||
    request.nextUrl.pathname.match(/^\/(ua|en)\/profile\//);

  // If not a profile path, just handle localization
  if (!isProfilePath) {
    return intlMiddleware(request);
  }

  try {
    const session = await auth();
    if (!session?.user) {
      // Extract current locale from URL or use default
      const locale = request.nextUrl.pathname.startsWith("/en/") ? "en" : "ua";
      const signInUrl = new URL(`/${locale}/signin`, request.url);
      return NextResponse.redirect(signInUrl);
    }
  } catch (error) {
    console.log(error);
    // Extract current locale from URL or use default
    const locale = request.nextUrl.pathname.startsWith("/en/") ? "en" : "ua";
    const signInUrl = new URL(`/${locale}/signin`, request.url);
    return NextResponse.redirect(signInUrl);
  }

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
