"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { SettingIcon } from "@/components/icons/setting-icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/routing";
import { signOut } from "@/lib/auth-client";

export const ProfileInfo = ({ name }: { name: string }) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Header.profileInfo");

  const createAvatar = (name: string) => {
    if (!name) return "??";
    const names = name.split(" ");
    if (names.length > 1) {
      return `${names[0][0].toLocaleUpperCase()}${names[1][0].toLocaleUpperCase()}`;
    }
    return names[0][0].toLocaleUpperCase();
  };
  return (
    <>
      <DropdownMenu onOpenChange={(state) => setOpen(state)} modal={false}>
        <div className="hidden items-center justify-center gap-3 lg:flex">
          <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-blue-50">
            <p className="text-body">{createAvatar(name)}</p>
          </div>
          <p className="text-btn">{name}</p>
          <DropdownMenuTrigger>
            <SettingIcon open={open} />
          </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent sideOffset={20} align="end" alignOffset={-10}>
          <div className="flex w-full flex-col gap-5 px-6 py-[1.625rem]">
            <Link href="/profile/settings">
              <div className="flex gap-2">
                <div className="relative h-6 w-6">
                  <Image src="/icons/account.svg" fill alt={t("accountIcon")} />
                </div>

                <p className="text-body">{t("account")}</p>
              </div>
            </Link>

            <span className="h-[1px] w-full bg-black-100"></span>
            <button
              onClick={() => {
                const locale = window.location.pathname.startsWith("/en/")
                  ? "en"
                  : "ua";
                signOut();
                window.location.href = `/${locale}`;
              }}
            >
              <div className="flex gap-2">
                <div className="relative h-6 w-6">
                  <Image src="/icons/exit.svg" fill alt={t("exitIcon")} />
                </div>
                <p className="text-body">{t("exit")}</p>
              </div>
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
