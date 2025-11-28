import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useCheckSession } from "@/utils/use-client-auth-guard";

export const AccountButton = () => {
  const t = useTranslations("Header.accountButton");
  const session = useCheckSession();

  return (
    <Link href={session?.user ? "/profile/dashboard" : "/signin"}>
      <Button className="hidden transition-colors hover:bg-blue-100/50 lg:flex 2xl:px-9 3xl:px-[3.125rem] 3xl:py-4">
        <div className="relative h-6 w-6">
          <Image src="/icons/person.svg" fill alt={t("userIcon")} />
        </div>
        <p className="font-sans text-btn text-blue-500 3xl:text-btn-semibold">
          {t(session?.user ? "myAccount" : "signIn")}
        </p>
      </Button>
    </Link>
  );
};
