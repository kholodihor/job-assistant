import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import { LocaleProvider } from "@/components/locale-provider";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { AlertProvider } from "@/contexts/alert-context";
import { routing } from "@/i18n/routing";

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
  if (!routing.locales.includes(locale)) {
    notFound();
  }
  const messages = await getMessages({ locale });
  return (
    <LocaleProvider locale={locale}>
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
    </LocaleProvider>
  );
}
