import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export const Socials = ({ classNames }: { classNames: string }) => {
  const t = useTranslations("Footer.socials");

  const socialIconsList = [
    {
      icon: "/icons/socials/facebook.svg",
      href: "https://www.facebook.com",
      alt: t("icons.facebook"),
    },
    {
      icon: "/icons/socials/telegram.svg",
      href: "https://web.telegram.org",
      alt: t("icons.telegram"),
    },
    {
      icon: "/icons/socials/linkedin.svg",
      href: "https://www.linkedin.com",
      alt: t("icons.linkedin"),
    },
  ];
  return (
    <div className={classNames}>
      <h5 className="font-sans text-h5 3xl:text-h2-sm">{t("title")}</h5>
      <div className="flex gap-[0.6rem] 3xl:gap-[3.125rem]">
        {socialIconsList.map((i) => (
          <Link key={i.href} href={i.href}>
            <div className="relative h-8 w-8 3xl:h-10 3xl:w-10">
              <Image src={i.icon} fill alt={i.alt} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
