import { Building2, ExternalLink, MapPin } from "lucide-react";
import { useLocale } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Job } from "../hooks/use-jobs";

const getSourceColor = (source: "dou" | "linkedin") => {
  switch (source) {
    case "dou":
      return "bg-blue-500 hover:bg-blue-600";
    case "linkedin":
      return "bg-[#0A66C2] hover:bg-[#004182]";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
};

interface JobCardProps {
  job: Job;
}

export const JobCard = ({ job }: JobCardProps) => {
  const locale = useLocale();

  return (
    <Card className="group w-full transition-all duration-300 hover:shadow-lg">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold tracking-tight">
              {job.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span className="font-medium">{job.company}</span>
            </div>
          </div>
          <Badge
            className={`${getSourceColor(job.source)} text-white`}
            variant="secondary"
          >
            {job.source.toUpperCase()}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{job.description}</span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex justify-end">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="group/button gap-2 transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <span>
                {locale === "en" ? "View Details" : "Переглянути деталі"}
              </span>
              <ExternalLink className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
