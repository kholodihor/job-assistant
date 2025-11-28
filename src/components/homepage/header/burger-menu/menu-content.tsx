import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Link, usePathname } from "@/i18n/routing";
import { signOut, useSession } from "@/lib/auth-client";

export const MenuContent = ({ closeMenu }: { closeMenu: () => void }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const t = useTranslations("Header.menu");

  const headerLinks = [
    { name: t("links.resume"), href: "/profile/resume" },
    { name: t("links.coverLetter"), href: "/profile/cover-letter" },
    { name: t("links.myProfile"), href: "/profile/dashboard" },
  ];

  const createAvatar = (name: string) => {
    if (!name) return "AA";
    const names = name.split(" ");
    if (names.length > 1) {
      return `${names[0][0].toLocaleUpperCase()}${names[1][0].toLocaleUpperCase()}`;
    }
    return names[0][0].toLocaleUpperCase();
  };

  const handleSignOut = () => {
    signOut();
    closeMenu();
  };

  return (
    <>
      {pathname.split("/")[1] === "profile" && !!session?.user ? (
        <div className="mt-3 flex size-full flex-col gap-7 px-7 pb-16 pt-20">
          <div className="flex items-center justify-center gap-4 ms:justify-start">
            <div className="flex rounded-full bg-white px-5 py-4">
              <p className="text-3xl">{createAvatar(session!.user!.name!)}</p>
            </div>
            <p className="truncate text-wrap text-3xl font-semibold text-white">
              {session.user.name}
            </p>
          </div>
          <div className="flex grow flex-col justify-between">
            <div className="flex flex-col gap-7">
              <Link href="/profile/settings">
                <p
                  onClick={closeMenu}
                  className="text-center text-3xl font-semibold text-white ms:text-start"
                >
                  {t("account")}
                </p>
              </Link>
              <div className="flex justify-center ms:justify-start">
                <LanguageSwitcher variant="mobile" />
              </div>
            </div>
            <p
              onClick={handleSignOut}
              className="mb-6 text-center text-3xl font-semibold text-white ms:text-start"
            >
              {t("exit")}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-7 px-7 pb-16 pt-20">
          {headerLinks.map((l) => (
            <Link key={l.name} href={l.href}>
              <p
                onClick={closeMenu}
                className="text-center text-3xl font-semibold text-white ms:text-start"
              >
                {l.name}
              </p>
            </Link>
          ))}
          <div className="flex justify-center ms:justify-start">
            <LanguageSwitcher variant="mobile" />
          </div>
        </div>
      )}
    </>
  );
};
