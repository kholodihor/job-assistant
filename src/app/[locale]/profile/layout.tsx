"use client";

import { useTranslations } from "next-intl";
import { Sidebar } from "@/components/profile/sidebar";
import { HorizontalSidebar } from "@/components/profile/sidebar/components/horizontal-sidebar";
import { useClientAuthGuard } from "@/utils/use-client-auth-guard";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("Common");

  const { isPending } = useClientAuthGuard();

  if (isPending) {
    return <div>{t("loading")}</div>;
  }

  return (
    <div className="flex min-h-[85vh] w-full pb-[120px] pt-10">
      <HorizontalSidebar />
      <Sidebar />
      <div className="w-full overflow-hidden">{children}</div>
    </div>
  );
}
