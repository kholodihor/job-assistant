import { useCallback, useEffect, useRef, useState } from "react";
import { resumeConfig } from "@/components/profile/resume/config";
import {
  getStoredDocument,
  useDocumentCollection,
} from "@/components/profile/shared/hooks/use-document-collection";

type JobSource = "dou" | "linkedin";

export interface Job {
  title: string;
  company: string;
  description: string;
  link: string;
  id: string;
  source: JobSource;
  uniqueKey: string;
}

type RawJob = Partial<Omit<Job, "source" | "uniqueKey">>;

const isValidJob = (job: Job, jobSource: JobSource): boolean => {
  const isValid =
    !!job.title?.trim() &&
    !!job.company?.trim() &&
    !!job.description?.trim() &&
    !!job.link?.startsWith("http") &&
    !job.title.includes("*") &&
    !job.company.includes("*") &&
    !job.description.includes("*");

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
};

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLinkedIn, setIsLoadingLinkedIn] = useState(false);
  const [error, setError] = useState("");
  const [source, setSource] = useState<JobSource>("dou");
  const sourceRef = useRef<JobSource>("dou");
  const abortRef = useRef<AbortController | null>(null);

  const { allDocuments: allResumes } = useDocumentCollection(resumeConfig);
  const firstResume = allResumes[0];

  // Derive a primitive so effects don't depend on the resume object identity
  const resumeData = firstResume ? getStoredDocument(firstResume) : null;
  const searchQuery = resumeData
    ? `${resumeData.profession} ${resumeData.skills?.slice(0, 3).join(" ")}`
    : "";

  const handleSearch = useCallback(
    async (jobSource: JobSource) => {
      // Clear previous jobs when changing source
      if (sourceRef.current !== jobSource) {
        setJobs([]);
      }
      sourceRef.current = jobSource;
      setSource(jobSource);

      if (!searchQuery) {
        return;
      }

      // Cancel any in-flight search so a slower response can't overwrite a newer one
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(jobSource === "dou");
      setIsLoadingLinkedIn(jobSource === "linkedin");
      setError("");

      try {
        const response = await fetch(`/api/jobs/${jobSource}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ searchQuery }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data: { jobs: RawJob[] } = await response.json();

        const jobsWithKeys: Job[] = data.jobs.map((job, index) => ({
          title: "",
          company: "",
          description: "",
          link: "",
          id: "",
          ...job,
          source: jobSource,
          uniqueKey: [
            jobSource,
            String(index),
            job.id || "",
            job.company || "",
            job.title || "",
            job.link || "",
          ]
            .join("--")
            .replace(/[^a-zA-Z0-9-]/g, "-"),
        }));

        if (controller.signal.aborted) return;
        setJobs(jobsWithKeys.filter((job) => isValidJob(job, jobSource)));
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error(err);
        setError("Failed to fetch jobs");
      } finally {
        if (abortRef.current === controller) {
          abortRef.current = null;
          setIsLoading(false);
          setIsLoadingLinkedIn(false);
        }
      }
    },
    [searchQuery]
  );

  useEffect(() => {
    if (searchQuery) {
      handleSearch(sourceRef.current);
    }
  }, [searchQuery, handleSearch]);

  // Cancel any pending request on unmount
  useEffect(() => () => abortRef.current?.abort(), []);

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
