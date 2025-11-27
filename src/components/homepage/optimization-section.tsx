"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export const OptimizationSection = () => {
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const t = useTranslations("HomePage.optimization");

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (windowWidth === null) return null;

  let imageSrc = "/images/optimization-section/optimization_350.webp";
  let imageWidth = 318;
  let imageHeight = 298;

  if (windowWidth >= 1280) {
    imageSrc = "/images/optimization-section/optimization.webp";
    imageWidth = 550;
    imageHeight = 328;
  } else if (windowWidth >= 768) {
    imageSrc = "/images/optimization-section/optimization_768.webp";
    imageWidth = 352;
    imageHeight = 286;
  }
  return (
    <section className="flex h-auto w-full items-center justify-center overflow-hidden bg-white sm:py-20 2xl:py-[120px] 3xl:py-[140px]">
      <div className="container flex items-center sm:flex-col-reverse sm:px-4 md:flex-row md:gap-8 md:px-4 lg:gap-20 lg:px-10 xl:gap-[117px] xl:px-20 2xl:gap-[110px] 2xl:px-[120px]">
        <div className="mx-auto sm:h-[298px] sm:w-[318px] ms:h-[298px] ms:w-[448px] md:mx-0 md:w-[352px] lg:h-[328px] lg:w-[402px] xl:h-[328px] xl:w-[548px] 3xl:h-[400px] 3xl:w-[711px]">
          <Image
            src={imageSrc}
            alt={t("title")}
            width={imageWidth}
            height={imageHeight}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex w-full flex-col items-center sm:gap-4 md:w-[339px] md:items-start md:justify-center lg:w-[378px] 2xl:w-[540px] 2xl:gap-6">
          <h2 className="text-center text-blue-900 sm:text-start sm:text-h2-sm md:text-h2-md lg:text-left lg:text-h2 2xl:text-h2-2xl 3xl:text-h2-3xl">
            {t("title")}
          </h2>
          <p className="text-center text-black-500 sm:pb-[36px] sm:text-start sm:text-body md:pb-0 lg:text-left 3xl:w-[756px] 3xl:text-body-sm">
            {t("description")}
          </p>
        </div>
      </div>
    </section>
  );
};
