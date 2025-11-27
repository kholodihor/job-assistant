"use client";

import { useEffect } from "react";

type LocaleProviderProps = {
  children: React.ReactNode;
  locale: "en" | "ua";
};

export function LocaleProvider({ children, locale }: LocaleProviderProps) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return <>{children}</>;
}
