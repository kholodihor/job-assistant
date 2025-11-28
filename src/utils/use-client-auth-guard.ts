"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";

export const useClientAuthGuard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      const locale = pathname.split("/")[1] || "en";
      const callbackUrl = encodeURIComponent(
        pathname || `/${locale}/profile/dashboard`
      );

      router.replace(`/${locale}/signin?callbackUrl=${callbackUrl}`);
    }
  }, [isPending, session, router, pathname]);

  return { session, isPending };
};

export const useCheckSession = () => {
  const { data: session } = useSession();
  return session;
};
