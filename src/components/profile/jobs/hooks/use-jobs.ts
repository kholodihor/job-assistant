/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useResumeLogic } from "@/components/profile/hooks/use-resume-logic";

// import { getUserLocation } from "@/lib/get-user-location";

export interface Job {
  title: string;
  company: string;
  description: string;
  link: string;
  id: string;
  source: "dou" | "linkedin";
  uniqueKey: string;
}

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLinkedIn, setIsLoadingLinkedIn] = useState(false);
  const [error, setError] = useState("");
  const [source, setSource] = useState<"dou" | "linkedin">("dou");

  const { allResumes } = useResumeLogic();
  const firstResume = allResumes[0];

  const handleSearch = async (jobSource: "dou" | "linkedin") => {
    // Clear previous jobs when changing source
    if (source !== jobSource) {
      setJobs([]);
    }

    setSource(jobSource);

    if (!firstResume) {
      return;
    }

    const searchQuery = firstResume
      ? "isDuplicate" in firstResume
        ? `${firstResume.data.profession} ${firstResume.data.skills?.slice(0, 3).join(" ")}`
        : `${firstResume.profession} ${firstResume.skills?.slice(0, 3).join(" ")}`
      : "";

    console.log("Search query for jobs:", searchQuery);

    try {
      if (jobSource === "dou") {
        setIsLoading(true);
      } else {
        setIsLoadingLinkedIn(true);
      }
      setError("");

      const response = await fetch(
        `/api/jobs${jobSource === "linkedin" ? "/linkedin" : "/dou"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            searchQuery,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();
      console.log("Raw jobs from API:", data.jobs);
      console.log("Raw jobs count:", data.jobs.length);

      // Map jobs to add source and unique key
      const jobsWithKeys = data.jobs.map((job: any, index: number) => {
        // Create a unique key using all available data
        const uniqueKey = [
          jobSource,
          String(index),
          job.id || "",
          job.company || "",
          job.title || "",
          job.link || "",
        ]
          .join("--")
          .replace(/[^a-zA-Z0-9-]/g, "-");

        // Log first few jobs to verify key generation
        if (index < 3) {
          console.log("Generated key for job:", {
            uniqueKey,
            title: job.title,
            company: job.company,
            id: job.id,
            index,
          });
        }

        return {
          ...job,
          source: jobSource,
          uniqueKey,
        };
      });

      console.log("First 3 jobs with keys:", jobsWithKeys.slice(0, 3));

      console.log("Jobs with keys count:", jobsWithKeys.length);

      // Filter out invalid jobs
      const validJobs = jobsWithKeys.filter((job: any) => {
        // Basic validation
        const isValid =
          job.title?.trim() &&
          job.company?.trim() &&
          job.description?.trim() &&
          job.link?.startsWith("http") &&
          !job.title?.includes("*") &&
          !job.company?.includes("*") &&
          !job.description?.includes("*");

        // Location check only for LinkedIn
        if (jobSource === "linkedin" && isValid) {
          const jobLocation = job.description.toLowerCase();
          return (
            jobLocation.includes("ukraine") ||
            jobLocation.includes("україна") ||
            jobLocation.includes("kyiv") ||
            jobLocation.includes("київ")
          );
        }

        return isValid;
      });

      console.log("Valid jobs count:", validJobs.length);

      // No need for complex deduplication since we have unique keys with index
      const uniqueJobs = validJobs;

      console.log("Final jobs:", {
        total: uniqueJobs.length,
        first3: uniqueJobs.slice(0, 3).map((job: any) => ({
          uniqueKey: job.uniqueKey,
          title: job.title,
          company: job.company,
        })),
      });

      setJobs(uniqueJobs);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch jobs");
    } finally {
      if (jobSource === "dou") {
        setIsLoading(false);
      } else {
        setIsLoadingLinkedIn(false);
      }
    }
  };

  useEffect(() => {
    if (firstResume) {
      handleSearch(source);
    }
  }, [firstResume]);

  return {
    jobs,
    isLoading,
    isLoadingLinkedIn,
    error,
    source,
    handleSearch,
    firstResume,
  };
};
