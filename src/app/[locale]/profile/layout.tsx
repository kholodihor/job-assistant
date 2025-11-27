"use client";

import { usePathname } from "next/navigation";
// import { useEffect } from "react";
// import { useSession } from "next-auth/react";
import { Sidebar } from "@/components/profile/sidebar";
import { HorizontalSidebar } from "@/components/profile/sidebar/components/horizontal-sidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { data: session, status } = useSession();
  // const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  // useEffect(() => {
  //   if (status === "unauthenticated") {
  //     const locale = pathname.split("/")[1];
  //     // Use current path as callback URL
  //     router.replace(
  //       `/${locale}/signin?callbackUrl=${encodeURIComponent(pathname)}`
  //     );
  //   }
  // }, [status, router, pathname]);

  // if (status === "loading") {
  //   return <div>Loading...</div>;
  // }

  // if (!session) {
  //   return null;
  // }

  return (
    <div className="flex w-full pb-[120px] pt-10">
      <HorizontalSidebar />
      <Sidebar lng={locale} />
      <div className="w-full overflow-hidden">{children}</div>
    </div>
  );
}
