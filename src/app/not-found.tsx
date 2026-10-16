import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 page",
  description: "404 page",
};

// Fallback for requests that never reach the [locale] segment, so there is no
// localized layout around it and it must render its own <html>/<body>.
export default function NotFound() {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <main className="flex min-h-screen flex-col items-center justify-center gap-6">
          <h1 className="text-[128px] font-semibold leading-[0.8] text-blue-900">
            404
          </h1>
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            Go to Homepage
          </Link>
        </main>
      </body>
    </html>
  );
}
