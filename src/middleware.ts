import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// Only handles localization; auth is enforced inside the app, not in Edge middleware
export default createMiddleware(routing);

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
