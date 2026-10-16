"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { BurgerMenu } from "../homepage/header/burger-menu/burger-menu";
import { ProfileButtonSwitchWidget } from "../homepage/header/switch-widget";
import { LanguageSwitcher } from "./language-switcher";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("SharedHeader");

  const headerLinks = [
    { name: t("links.resume"), href: "/profile/resume" },
    { name: t("links.coverLetter"), href: "/profile/cover-letter" },
  ];

  return (
    <>
      <header className="bg-white px-3.5 py-2 lg:px-10 lg:py-3 xl:px-[7.5rem] 3xl:py-5">
        <div className="flex justify-between">
          <ul className="flex gap-9">
            <li className="flex items-center justify-center">
              <Link href="/">
                <div className="relative h-12 w-24">
                  <Image src="/icons/logo.png" fill alt={t("images.logo")} />
                </div>
              </Link>
            </li>
            {headerLinks.map((l) => (
              <li
                key={l.name}
                className="hidden h-full items-center justify-center lg:flex"
              >
                <Link
                  href={l.href}
                  className="font-sans text-body text-black-500 hover:text-blue-500 3xl:text-body-sm"
                >
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>
            <ProfileButtonSwitchWidget />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t("buttons.openMenu")}
              aria-expanded={open}
              className="relative block size-12 lg:hidden"
            >
              <Image src="/icons/hamburger.svg" fill alt="" />
            </button>
          </div>
        </div>
      </header>
      <BurgerMenu open={open} setOpen={setOpen} />
    </>
  );
};
