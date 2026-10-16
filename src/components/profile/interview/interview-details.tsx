import { useTranslations } from "next-intl";

interface InterviewDetailsProps {
  jobPosition: string;
  jobExperience: string;
  techStack: string[] | null;
}

export const InterviewDetails = ({
  jobPosition,
  jobExperience,
  techStack,
}: InterviewDetailsProps) => {
  const t = useTranslations("Interviewer");

  return (
    <div className="rounded-lg border bg-muted/5 p-4">
      <h3 className="mb-2 font-medium">
        {t("liveInterview.interviewDetails")}
      </h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {t("liveInterview.position")}:
          </span>
          <span className="font-medium">{jobPosition}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {t("liveInterview.experience")}:
          </span>
          <span className="font-medium">{jobExperience} years</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {t("liveInterview.techStack")}:
          </span>
          <div className="mt-1 flex flex-wrap gap-1">
            {techStack?.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
