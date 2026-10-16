"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

const templates = [
  {
    nameKey: "classic",
    image: "/templates/classic.jpg",
  },
  {
    nameKey: "modernDark",
    image: "/templates/modern-dark.jpg",
  },
  {
    nameKey: "detailed",
    image: "/templates/letter-detailed.jpg",
  },
  {
    nameKey: "short",
    image: "/templates/letter-short.jpg",
  },
];

export const Templates = () => {
  const t = useTranslations("Templates");

  return (
    <div className="flex w-full flex-col items-center justify-around gap-4 py-4 lg:flex-row">
      {templates.map((template, index) => (
        <div key={index} className="flex flex-col items-start gap-2">
          <h4 className="font-bold">{t(template.nameKey)}</h4>
          <Image
            src={template.image}
            alt={t(template.nameKey)}
            width={500}
            height={500}
          />
        </div>
      ))}
    </div>
  );
};
