"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export const Dashboard = () => {
  const locale = useLocale();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-start px-4 py-6 sm:px-8 md:px-[80px] md:py-[40px]">
      <Image
        src="/dashboard-bg.webp"
        alt="dashboard-bg"
        width={500}
        height={500}
        className="h-auto w-full max-w-[500px] object-cover"
      />
      <div className="absolute left-[50%] top-[35%] flex w-[90%] translate-x-[-50%] flex-col items-center justify-center space-y-4 px-4 sm:top-[45%] md:w-[70%] lg:w-[50%]">
        <h1 className="text-center text-[20px] font-[600] sm:text-[24px]">
          {locale === "en"
            ? "Build a resume and cover letter tailored to market demands."
            : "Побудуй резюме та супровідний лист відповідно до ринкових запитів."}
        </h1>
        <p className="mx-auto max-w-full text-center text-[14px] sm:max-w-[400px] sm:text-[16px]">
          {locale === "en"
            ? "Optimize document formatting with Artificial Intelligence and achieve your long-awaited match."
            : "Оптимізуй оформлення документів за допомогою Штучного Інтелекту та отримай свій довгоочікуваний метч."}
        </p>
        <Link href="/profile/resume/editor">
          <Button variant="filled" className="w-[120px]">
            {locale === "en" ? "Start" : "Почати"}
          </Button>
        </Link>
      </div>
    </div>
  );
};
