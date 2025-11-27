import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import { LocaleProvider } from "@/components/locale-provider";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { AlertProvider } from "@/contexts/alert-context";
import { routing } from "@/i18n/routing";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Job Assistant",
  description: "Job Assistant",
};
type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: "ua" | "en" }>;
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const session = await auth();
  if (!routing.locales.includes(locale)) {
    notFound();
  }
  const messages = await getMessages({ locale });
  return (
    <LocaleProvider locale={locale}>
      <SessionProvider session={session}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AlertProvider>
            <Toaster richColors closeButton position="top-right" />
            <Header />
            <main>{children}</main>
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
      </SessionProvider>
    </LocaleProvider>
  );
}
