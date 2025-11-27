"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function NotFoundPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [isUa, setIsUa] = useState(false);

  useEffect(() => {
    setIsUa(pathname.includes("/ua"));
  }, [pathname]);

  const changeLanguageHandler = () => {
    router.replace(isUa ? "/ua" : "/en");
  };
  return (
    <main className="flex min-h-screen items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <div className="row-start-2 flex flex-col items-center gap-10">
        <h1 className="text-[128px] font-semibold leading-[0.8] text-blue-900 sm:text-[240px]">
          404
        </h1>
        <p className="text-center text-black-500 sm:w-[421px]">
          {isUa
            ? "Схоже, ми не зможемо знайти потрібну вам сторінку. Поверніться на головну."
            : "It seems we can't find the page you're looking for. Return to the home page."}
        </p>
        <button
          className="h-[48px] w-[318px] rounded-3xl bg-blue-500 text-white hover:bg-blue-700 sm:w-[289px] sm:text-base xl:w-[210px]"
          onClick={changeLanguageHandler}
        >
          {isUa ? "На головну" : "Go to Home"}
        </button>
      </div>
    </main>
  );
}
