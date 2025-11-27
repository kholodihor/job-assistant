"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export const HeroSection = () => {
  const locale = useLocale();
  const t = useTranslations("HomePage.hero");
  const router = useRouter();

  const handleNavigate = () => {
    router.push("/profile/resume/editor");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex w-full items-center justify-center overflow-hidden bg-background sm:flex-col sm:gap-0 sm:pb-[76px] sm:pt-[60px] md:h-[calc(100vh-84px)] md:flex-row md:justify-between md:gap-[32px] md:px-4 md:py-20 lg:flex-row lg:gap-10 lg:px-10 xl:gap-[102px] xl:px-20 xl:py-[34px] 2xl:flex-wrap 2xl:content-center 2xl:gap-[111px] 2xl:px-[120px] 2xl:py-0 3xl:h-[calc(100vh-96px)] 3xl:gap-0">
      <div className="flex w-full flex-col items-center sm:gap-[60px] sm:px-4 md:w-[352px] md:items-start md:gap-10 md:px-0 lg:w-[443px] lg:gap-[60px] xl:w-[450px] xl:justify-center 2xl:w-[548px] 2xl:flex-wrap 2xl:content-center 3xl:w-auto">
        <div className="flex w-full flex-col ms:w-[332px]">
          <h1 className="text-center text-3xl text-black-900 sm:text-h1-sm md:text-start md:text-h2 lg:text-left lg:text-h1 2xl:text-h1-large 3xl:text-h1-3xl">
            {t("title")}
          </h1>
          <p className="mx-auto w-full pt-4 text-center text-black-500 sm:text-base sm:text-body md:pt-4 md:text-start lg:mx-0 lg:w-[354px] lg:text-left 2xl:pt-6 3xl:w-[568px] 3xl:text-body-sm">
            {t("description")}
          </p>

          <button
            onClick={handleNavigate}
            className="mds:w-[220px] mt-10 flex h-10 w-full items-center justify-center rounded-[100px] bg-blue-500 text-white sm:h-12 sm:w-[318px] sm:text-btn ms:w-[220px] md:w-[224px] lg:mx-0 lg:w-[220px] xl:w-[200px] 2xl:w-[309px] 3xl:h-[60px] 3xl:w-[404px] 3xl:text-body-sm"
          >
            {t("button")}
          </button>
        </div>
        <div className="mx-auto flex w-full flex-col items-center text-center text-violet-800 sm:gap-4 sm:text-body md:items-start md:gap-2 md:text-start lg:mx-0 lg:flex-row lg:gap-6 lg:text-left 3xl:w-[544px] 3xl:gap-[33px] 3xl:text-[20px]">
          <p className="w-full border-l border-l-black-100 text-center sm:pl-2 md:pl-4 md:text-start 3xl:pl-6">
            {t("features.feature1")}
          </p>
          <p className="w-full border-l border-l-black-100 text-center sm:pl-2 md:pl-4 md:text-start 3xl:pl-6">
            {t("features.feature2")}
          </p>
        </div>
      </div>

      <div className="flex items-center md:items-start md:justify-end 2xl:flex-wrap 2xl:justify-center 3xl:w-[830px]">
        <div className="relative w-full sm:mt-[52px] sm:h-[414px] sm:w-[414px] ms:mt-9 ms:h-[448px] ms:w-[448px] md:mt-8 md:h-[360px] md:w-[360px] lg:mt-0 lg:h-[460px] lg:w-[460px] xl:h-[568px] xl:w-[568px] xl:items-center 2xl:mt-0 3xl:h-[720px] 3xl:w-[720px]">
          <Image
            src="/images/hero/ellipse_1.webp"
            alt={t("images.ellipse")}
            width={720}
            height={720}
            className="absolute inset-0 h-full w-[250vw] object-cover sm:w-full"
          />
          <Image
            src="/images/hero/ellipse_inlying.webp"
            className="absolute inset-0 m-auto sm:h-[334px] sm:w-[334px] ms:h-[340px] ms:w-[340px] md:h-[320px] md:w-[320px] lg:h-[360px] lg:w-[360px] xl:h-[480px] xl:w-[480px] 3xl:h-[540px] 3xl:w-[540px]"
            alt={t("images.ellipseInlying")}
            width={460}
            height={460}
          />
          <Image
            src={
              locale === "ua"
                ? "/images/hero/CV.webp"
                : "/images/hero/CV-eng.webp"
            }
            className="absolute inset-0 m-auto sm:h-[383px] sm:w-[271px] md:top-[-14px] 3xl:h-[500px] 3xl:w-[340px]"
            alt={t("images.cv")}
            width={340}
            height={500}
          />
          <Image
            src="/images/hero/typography.webp"
            className="absolute sm:right-[51px] sm:top-[367px] ms:right-[67px] ms:top-[385px] md:right-[20px] md:top-[340px] lg:right-[-12px] lg:top-[-12px] xl:right-[60px] xl:top-[43px] 3xl:right-[350px] 3xl:top-16"
            alt={t("images.typography")}
            width={320}
            height={48}
          />
          <Image
            src="/images/hero/ATS.webp"
            className="absolute sm:right-[280px] sm:top-[281px] ms:right-[338px] ms:top-[181px] md:right-64 md:top-[250px] lg:right-[37px] lg:top-[146px] xl:right-[107px] xl:top-[196px] 3xl:right-[436px] 3xl:top-[584px]"
            alt={t("images.ats")}
            width={77}
            height={28}
          />
          <Image
            src={
              locale === "ua"
                ? "/images/hero/ai.webp"
                : "/images/hero/ai-eng.webp"
            }
            className="invisible absolute lg:visible lg:bottom-[110px] lg:right-[-16px] xl:bottom-[166px] xl:right-[10px] 3xl:bottom-[216px] 3xl:right-[450px]"
            alt={t("images.ai")}
            width={181}
            height={88}
          />
          <Image
            src="/images/hero/logo_AI.webp"
            className="absolute sm:bottom-[95px] sm:left-[281px] ms:bottom-[113px] ms:left-[329px] md:bottom-[80px] md:left-[260px] lg:bottom-[32px] lg:left-20 xl:bottom-[75px] xl:left-40 3xl:bottom-[336px] 3xl:left-[512px]"
            alt={t("images.aiLogo")}
            width={80}
            height={80}
          />
          <Image
            src="/images/hero/colors.webp"
            className="absolute sm:bottom-[381px] sm:left-[114px] ms:bottom-[399px] ms:left-[136px] md:bottom-[355.2px] md:left-[90px] lg:bottom-[242px] lg:left-[14px] xl:bottom-[175px] xl:left-[22px] 3xl:bottom-[200px] 3xl:left-[493px]"
            alt={t("images.colors")}
            width={250}
            height={33}
          />
        </div>
      </div>
    </div>
  );
};
