"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "@/i18n/routing";
import { AccountButton } from "./account-button";
import { ProfileInfo } from "./profile-info";

export const ProfileButtonSwitchWidget = () => {
  const pathname = usePathname();
  const { status, data } = useSession();
  return (
    <>
      {pathname.split("/")[1] === "profile" && status === "authenticated" ? (
        <ProfileInfo name={data?.user.name as string} />
      ) : (
        <AccountButton />
      )}
    </>
  );
};
