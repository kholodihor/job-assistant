import Image from "next/image";
import { useTranslations } from "next-intl";
import { CreateWithAi } from "../homepage/footer/create-with-ai";
import { Socials } from "../homepage/footer/socials";

export const Footer = () => {
  const t = useTranslations("Footer");

  return (
    <footer className="overflow-hidden bg-blue-900">
      <div className="footer-container">
        <div className="flex w-full flex-col items-center gap-[3.125rem] ms:items-start md:flex-row md:gap-[4.6rem] xl:gap-[6rem] 2xl:gap-36 3xl:gap-[13.75rem]">
          <div className="flex flex-col gap-6">
            <div className="relative h-12 w-24 invert">
              <Image src="/icons/logo.png" fill alt={t("logo.alt")} />
            </div>
            <Socials classNames="hidden md:max-lg:flex flex-col ms:items-start ms:order-last ms:max-md:min-w-[180px] gap-6 text-white" />
          </div>

          <div className="flex grow flex-col flex-wrap gap-[3.125rem] ms:flex-row ms:items-start ms:gap-[3.75rem] ms:gap-y-[4.375rem] md:justify-between">
            <Socials classNames="flex md:max-lg:hidden lg:order-last flex-col ms:items-start ms:order-last items-center ms:max-md:min-w-[180px] gap-6 text-white" />
            <CreateWithAi classNames="flex md:order-last lg:order-2 ms:items-start ms:max-md:min-w-[180px] flex-col items-center gap-6 text-white " />
          </div>
        </div>
      </div>
    </footer>
  );
};
