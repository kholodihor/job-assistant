"use client";

import { usePathname } from "@/i18n/routing";
import { useSession } from "@/lib/auth-client";
import { AccountButton } from "./account-button";
import { ProfileInfo } from "./profile-info";

export const ProfileButtonSwitchWidget = () => {
  const pathname = usePathname();
  const { data } = useSession();
  const isAuthenticated = !!data?.user;
  return (
    <>
      {pathname.split("/")[1] === "profile" && isAuthenticated ? (
        <ProfileInfo name={data?.user.name as string} />
      ) : (
        <AccountButton />
      )}
    </>
  );
};
