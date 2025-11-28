"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/profile/sidebar";
import { HorizontalSidebar } from "@/components/profile/sidebar/components/horizontal-sidebar";
import { useClientAuthGuard } from "@/utils/use-client-auth-guard";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const { isPending } = useClientAuthGuard();

  if (isPending) {
    return <div>Loading...</div>;
  }

  // useEffect(() => {
  //   if (status === "unauthenticated") {
  //     const locale = pathname.split("/")[1];
  //     // Use current path as callback URL
  //     router.replace(
  //       `/${locale}/signin?callbackUrl=${encodeURIComponent(pathname)}`
  //     );
  //   }
  // }, [status, router, pathname]);

  return (
    <div className="flex w-full pb-[120px] pt-10">
      <HorizontalSidebar />
      <Sidebar lng={locale} />
      <div className="w-full overflow-hidden">{children}</div>
    </div>
  );
}
