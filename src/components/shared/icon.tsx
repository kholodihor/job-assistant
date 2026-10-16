import { cn } from "@/lib/utils";

export type IconName =
  | "icon-analysis"
  | "icon-edit"
  | "icon-google"
  | "icon-closed"
  | "icon-open"
  | "icon-dashboard"
  | "icon-person"
  | "icon-resume"
  | "resume-page"
  | "icon-cover-letter"
  | "ellipsis"
  | "icon-pdf"
  | "icon-pencil"
  | "icon-delete"
  | "icon-search"
  | "icon-interview-trainer";

type IconProps = {
  name: IconName;
  /** Tailwind size classes (e.g. "w-6 h-6"). */
  size?: string;
  className?: string;
} & React.SVGProps<SVGSVGElement>;

export const Icon = ({
  name,
  size = "w-6 h-6",
  className,
  ...props
}: IconProps) => (
  <svg
    aria-hidden="true"
    className={cn("block shrink-0", size, className)}
    {...props}
  >
    <use href={`/icons/sprite.svg#${name}`} />
  </svg>
);
