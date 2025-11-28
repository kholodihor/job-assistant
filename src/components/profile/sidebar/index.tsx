import Image from "next/image";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/shared/icon";
import { Link } from "@/i18n/routing";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Avatar } from "./components/avatar";

export function Sidebar({ lng }: { lng: string }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isDashboardPage = pathname.split("/").includes("dashboard");
  const isResumePage = pathname.split("/").includes("resume");
  const isCoverLetterPage = pathname.split("/").includes("cover-letter");
  const isJobsPage = pathname.split("/").includes("jobs");
  const isAnalyzePage = pathname.split("/").includes("cv-analyze");
  const isInterviewPage = pathname.split("/").includes("interview");

  const linkClassName = (isPath: boolean) => {
    return cn(
      isPath
        ? "bg-blue-50 fill-blue-500 stroke-blue-500 text-blue-500"
        : "fill-none stroke-black-500 text-black-500",
      "flex gap-2.5 rounded-[8px] py-3 transition-all hover:bg-blue-50 hover:stroke-blue-500 hover:text-blue-500 focus:bg-blue-50 focus:text-blue-500"
    );
  };

  return (
    <aside className="hidden border-r-2 px-4 font-semibold lg:block xl:w-[20vw]">
      <Avatar name={session?.user.name || "User"} />
      <nav className="mt-5">
        <ul className="space-y-1">
          <li>
            <Link
              href="/profile/dashboard"
              className={cn(linkClassName(isDashboardPage), "px-2")}
            >
              <Icon name="icon-dashboard" size="w-6 h-6" />
              <span className="hidden whitespace-nowrap md:inline-block">
                {lng === "en" ? "Dashboard" : "Панель керування"}
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/profile/resume"
              className={cn(linkClassName(isResumePage), "px-[2.5px]")}
            >
              <Icon name="icon-resume" size="w-6 h-6" />
              <span className="hidden whitespace-nowrap md:inline-block">
                {lng === "en" ? "Resume" : "Резюме"}
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/profile/cover-letter"
              className={cn(linkClassName(isCoverLetterPage), "px-2")}
            >
              <Icon name="icon-cover-letter" size="w-6 h-6" />
              <span className="hidden whitespace-nowrap md:inline-block">
                {lng === "en" ? "Cover Letter" : "Супровідний лист"}
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/profile/jobs"
              className={cn(linkClassName(isJobsPage), "px-2")}
            >
              <Icon name="icon-search" size="w-6 h-6" />
              <span className="hidden whitespace-nowrap md:inline-block">
                {lng === "en" ? "Search Jobs" : "Пошук роботи"}
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/profile/interview"
              className={cn(linkClassName(isInterviewPage), "px-2")}
            >
              <Icon name="icon-interview-trainer" size="w-6 h-6" />
              <span className="hidden whitespace-nowrap md:inline-block">
                {lng === "en" ? "Interview Trainer" : "Тренер інтерв'ю"}
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/profile/cv-analyze"
              className={cn(linkClassName(isAnalyzePage), "px-2")}
            >
              {/* <Icon name="icon-analysis" size="w-6 h-6" /> */}
              <Image
                src="/icons/analyze.svg"
                alt=""
                width={20}
                height={20}
                className="ml-1"
              />
              <span className="hidden whitespace-nowrap md:inline-block">
                {lng === "en" ? "CV Analyzer" : "Аналізатор резюме"}
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
