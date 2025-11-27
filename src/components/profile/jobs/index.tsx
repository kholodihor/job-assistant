"use client";

import { Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { JobCard } from "./components/job-card";
import { useJobs } from "./hooks/use-jobs";

export const Jobs = () => {
  const { jobs, isLoading, isLoadingLinkedIn, error, source, handleSearch } =
    useJobs();
  const locale = useLocale();

  return (
    <div className="w-full space-y-4 p-[24px]">
      {jobs.length ? (
        <div className="mb-2 text-sm text-gray-500">
          {locale === "en" ? "Found" : "Знайдено"}
          &nbsp;
          {jobs.length} {locale === "en" ? "jobs" : "вакансій"}
        </div>
      ) : null}

      <div className="flex gap-2">
        <Button
          variant={source === "dou" ? "default" : "outline"}
          onClick={() => handleSearch("dou")}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          DOU.ua
        </Button>
        <Button
          variant={source === "linkedin" ? "default" : "outline"}
          onClick={() => handleSearch("linkedin")}
          disabled={isLoadingLinkedIn}
        >
          {isLoadingLinkedIn && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          LinkedIn
        </Button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <div className="max-h-[600px] space-y-4 overflow-y-auto">
        {jobs.map((job) => (
          <JobCard key={job.uniqueKey} job={job} />
        ))}
      </div>
    </div>
  );
};
