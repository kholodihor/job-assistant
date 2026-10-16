import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { AlertProvider } from "@/contexts/alert-context";
import { Locale, routing } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Job Assistant",
  description: "Job Assistant",
};

const openSans = Open_Sans({
  subsets: ["latin", "cyrillic"],
  variable: "--font-open-sans",
});

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!routing.locales.includes(locale)) {
    notFound();
  }
  const messages = await getMessages({ locale });
  return (
    <html lang={locale}>
      <body className={`${openSans.variable} font-sans antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AlertProvider>
            <Toaster richColors closeButton position="top-right" />
            <Header />
            <main className="min-h-[85vh]">{children}</main>
            <Footer />
          </AlertProvider>
          <NextTopLoader
            color="#1B91F0"
            height={2}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #4DC760,0 0 5px #4DC760"
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
