"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export const CreateWithAi = ({ classNames }: { classNames: string }) => {
  const t = useTranslations("Footer.createWithAi");
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const linkList = [
    { label: t("links.resume"), href: "/profile/resume/editor" },
    {
      label: t("links.coverLetter"),
      href: "/profile/cover-letter",
    },
  ];

  return (
    <div className={classNames}>
      <h5 className="font-sans text-h5 3xl:text-h2-sm">{t("title")}</h5>
      <div className="flex flex-col items-center gap-4 ms:items-start">
        {linkList.map((l) => (
          <button
            key={l.label}
            onClick={() => handleNavigate(l.href)}
            className="text-left"
          >
            <p className="text-body 3xl:text-body-sm">{l.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
