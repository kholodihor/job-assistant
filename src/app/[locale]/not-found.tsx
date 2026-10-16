import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function NotFound() {
  const t = useTranslations("404Page");

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4">
      <div className="flex flex-col items-center gap-10">
        <h1 className="text-[128px] font-semibold leading-[0.8] text-blue-900 sm:text-[240px]">
          {t("text")}
        </h1>
        <p className="text-center text-black-500 sm:w-[421px]">{t("desc")}</p>
        <Link
          href="/"
          className="flex h-[48px] w-[318px] items-center justify-center rounded-3xl bg-blue-500 text-white hover:bg-blue-700 sm:w-[289px] sm:text-base xl:w-[210px]"
        >
          {t("buttonText")}
        </Link>
      </div>
    </div>
  );
}
