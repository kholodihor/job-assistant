"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/container";
import { useMedia } from "@/hooks/use-media";
import { createStepsData } from "./data";

export const Steps: FC = () => {
  const screenSize = useMedia();
  const t = useTranslations("HomePage.steps");
  const router = useRouter();
  const stepsData = createStepsData(t);

  const handleNavigate = () => {
    router.push("/profile/resume/editor");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  return (
    <section className="mx-auto bg-background py-20 2xl:py-[120px]">
      <Container>
        <div className="flex flex-col items-center">
          <h2 className="mb-[74px] max-w-[257px] text-center text-h2-sm text-blue-900 md:mb-[60px] md:max-w-[479px] md:text-h2-md xl:max-w-full xl:text-h2 2xl:max-w-[778px] 2xl:text-h2-2xl">
            {t("title")}
          </h2>
          <ul className="mb-10 grid place-items-center gap-[48px] md:grid-cols-2 xl:grid-cols-4 xl:gap-[51px]">
            {stepsData.map(({ img, step, title, description, width }) => (
              <li
                className="md:grow-1 flex flex-col items-center justify-center lg:basis-auto"
                style={{ width: `${width[screenSize]}px` }}
                key={title}
              >
                <Image
                  className="mb-6 w-full"
                  height={100}
                  src={img}
                  width={width[screenSize]}
                  alt={`Step ${step} image`}
                />
                <div className="mb-3 rounded bg-violet-600">
                  <p className="px-[14px] py-[2px] text-body-semibold text-white md:px-[11px]">
                    {step}
                  </p>
                </div>
                <h3 className="mb-2 text-h3 leading-normal text-blue-900">
                  {title}
                </h3>
                <p className="text-center text-body">{description}</p>
              </li>
            ))}
          </ul>
          <div>
            <button
              className="inline-block rounded-[100px] bg-blue-500 px-[85px] py-[12px] text-center text-btn text-white xl:px-[61px] 2xl:px-[46px]"
              onClick={handleNavigate}
            >
              {t("button")}
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
};
