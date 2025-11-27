"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useTranslations } from "next-intl";

export const CoverLetter: FC = () => {
  const t = useTranslations("HomePage.coverLetter");
  const router = useRouter();

  const handleNavigate = () => {
    router.push("/profile/cover-letter");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  return (
    <section className="flex items-center bg-white px-4 pb-20 pt-20 md:px-4 lg:pt-[60px] xl:pb-[90px] 2xl:py-[120px]">
      <div className="container mx-auto flex flex-wrap items-center gap-9 md:flex-nowrap lg:gap-[60px] lg:pl-dynamic xl:gap-[180px]">
        <div className="flex flex-col items-center md:items-start lg:max-w-[455px] 2xl:max-w-[584px]">
          <h2 className="mb-4 text-h2-sm text-blue-900 md:text-h2-md lg:text-h2 2xl:mb-6 2xl:text-h2-2xl">
            {t("title")}
          </h2>
          <p className="mb-10 text-black-500 md:text-body">
            {t("description")}
          </p>
          <div>
            <button
              className="inline-block rounded-[100px] bg-blue-500 px-[45px] py-[12px] text-center text-body-semibold text-white md:px-[26px] lg:px-[46px] 2xl:px-[41px]"
              onClick={handleNavigate}
            >
              {t("button")}
            </button>
          </div>
        </div>
        <Image
          src="/images/cover_steps/cover_letter.webp"
          alt="Cover letter"
          width={400}
          height={400}
          className="w-[350px] flex-shrink-0 object-contain md:h-[320px] md:w-[352px] lg:h-[400px] lg:w-[400px]"
        />
      </div>
    </section>
  );
};
