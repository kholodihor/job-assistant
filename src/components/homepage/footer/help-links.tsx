import { useTranslations } from "next-intl";

export const HelpLinks = ({ classNames }: { classNames: string }) => {
  const t = useTranslations("Footer.help");

  const siteList = [
    { label: t("links.bazaSkill"), href: "https://baza-skill.com.ua" },
    {
      label: t("links.jobTracker"),
      href: "https://job-tracker-frontend-three.vercel.app/log-in",
    },
  ];
  return (
    <div className={classNames}>
      <h5 className="font-sans text-h5 3xl:text-h2-sm">{t("title")}</h5>
      <div className="flex flex-col items-center gap-4 ms:items-start">
        {siteList.map((s) => (
          <a key={s.href} href={s.href} target="_blank">
            <p className="text-body 3xl:text-body-sm">{s.label}</p>
          </a>
        ))}
      </div>
    </div>
  );
};
