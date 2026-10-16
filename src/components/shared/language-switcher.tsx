"use client";

import { useLocale } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Locale, usePathname, useRouter } from "@/i18n/routing";

const languages: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ua", label: "UA" },
];

export const LanguageSwitcher = ({
  variant = "default",
}: {
  variant?: "default" | "mobile";
}) => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    // Read the query at click time; useSearchParams in the shared header
    // would force a Suspense boundary around every page.
    const query = window.location.search;
    router.replace(`${pathname}${query}`, {
      locale: newLocale as Locale,
    });
  };

  if (variant === "mobile") {
    return (
      <div className="flex gap-4">
        {languages.map((lang) => (
          <button
            type="button"
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`text-xl font-semibold 2xl:text-[3rem] ${
              locale === lang.code
                ? "text-white"
                : "text-white/60 hover:text-white/80"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <Select value={locale} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[70px] border-none bg-transparent text-base hover:bg-blue-100/50 focus:ring-0 focus:ring-offset-0 2xl:text-xl">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
