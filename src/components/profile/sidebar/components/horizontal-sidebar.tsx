import { usePathname } from "next/navigation";
import { Icon } from "@/components/shared/icon";
import { Link } from "@/i18n/routing";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";

interface HorizontalNavLinkProps {
  href: string;
  iconName: string;
  isActive: boolean;
}

const HorizontalNavLink = ({
  href,
  iconName,
  isActive,
}: HorizontalNavLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        isActive && "bg-blue-300 fill-blue-500 stroke-blue-50 text-blue-500",
        "flex rounded-full fill-none stroke-black-500 p-2 transition-all hover:bg-blue-50 hover:fill-blue-500 hover:stroke-blue-50 hover:text-blue-500 focus:bg-blue-50 focus:text-blue-500"
      )}
    >
      <Icon name={iconName} size="w-6 h-6" />
    </Link>
  );
};

export const HorizontalSidebar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isDashboardPage = pathname.split("/").includes("dashboard");
  const isResumePage = pathname.split("/").includes("resume");
  const isCoverLetterPage = pathname.split("/").includes("cover-letter");

  return (
    <div className="absolute left-0 top-[4rem] z-10 flex w-full items-center justify-center gap-8 border-b-2 px-4 py-2 lg:hidden">
      <Avatar name={session?.user.name || "Baza Trainee"} />
      <nav className="flex-1">
        <ul className="flex w-full items-center justify-around gap-4">
          <li>
            <HorizontalNavLink
              href="/profile/dashboard"
              iconName="icon-dashboard"
              isActive={isDashboardPage}
            />
          </li>
          <li>
            <HorizontalNavLink
              href="profile/resume"
              iconName="icon-resume"
              isActive={isResumePage}
            />
          </li>
          <li>
            <HorizontalNavLink
              href="/profile/cover-letter"
              iconName="icon-cover-letter"
              isActive={isCoverLetterPage}
            />
          </li>
        </ul>
      </nav>
    </div>
  );
};
