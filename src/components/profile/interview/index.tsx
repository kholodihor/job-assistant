"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  InterviewQuestion,
  generateInterview,
} from "@/app/actions/generate-interview";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAlert } from "@/contexts/alert-context";
import { Link } from "@/i18n/routing";
import { InterviewForm } from "./forms/interview-form";
import { InterviewFormValues } from "./forms/schema";

interface InterviewData extends InterviewFormValues {
  questions?: InterviewQuestion[];
  id?: string;
}

export const Interviewer = () => {
  const t = useTranslations("Interviewer");
  const locale = useLocale();
  const { showAlert } = useAlert();

  // State for interview data and dialog open state
  const [interviewData, setInterviewData] = useState<InterviewData[]>([]);
  const [response, setResponse] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentInterviewIndex, setCurrentInterviewIndex] = useState<
    number | null
  >(null);
  const [expandedInterview, setExpandedInterview] = useState<number | null>(0);

  // Load saved interviews when component mounts
  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/interviews");
      if (response.ok) {
        const interviews = await response.json();
        console.log("Fetched interviews:", interviews);
        if (interviews && interviews.length > 0) {
          // Transform the database format to the component format
          const formattedInterviews = interviews.map(
            (interview: {
              jobPosition: string;
              jobDescription: string;
              jobExperience: number;
              techStack: string[];
              id: string;
            }) => {
              const formattedInterview = {
                position: interview.jobPosition,
                description: interview.jobDescription,
                yearsOfExperience: interview.jobExperience,
                techStack: interview.techStack,
                id: interview.id,
                // We don't have the questions here since we're not storing them
              };
              console.log("Formatted interview:", formattedInterview);
              return formattedInterview;
            }
          );
          console.log("Setting interview data:", formattedInterviews);
          setInterviewData(formattedInterviews);
        } else {
          setInterviewData([]);
        }
      }
    } catch (error) {
      console.error("Error loading interviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to generate or regenerate questions for an interview
  const generateQuestions = async (
    data: InterviewFormValues,
    index: number
  ) => {
    try {
      setIsGenerating(true);
      setCurrentInterviewIndex(index);

      // Generate questions using the server action with current locale
      const response = await generateInterview(data, locale);

      // Save the raw response
      setResponse(response.rawResponse);

      // Update the interview with the generated questions
      setInterviewData((prevData) => {
        const updatedData = [...prevData];
        updatedData[index] = {
          ...updatedData[index],
          questions: response.questions,
        };
        return updatedData;
      });
    } catch (error) {
      console.error("Error generating interview:", error);
    } finally {
      setIsGenerating(false);
      setCurrentInterviewIndex(null);
    }
  };

  const handleSubmit = async (data: InterviewFormValues) => {
    setIsDialogOpen(false); // Close dialog after submission

    // Add the interview data without questions first
    const newInterview: InterviewData = { ...data };
    const newIndex = interviewData.length;
    setInterviewData((prev) => [...prev, newInterview]);

    // Generate questions for the new interview
    await generateQuestions(data, newIndex);

    // Save interview data to the database (only when creating a new interview)
    try {
      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });

      if (response.ok) {
        const savedInterview = await response.json();
        console.log("Saved interview with id:", savedInterview.id);

        // Update the interview in the state with the id from the server
        setInterviewData((prevData) => {
          const updatedData = [...prevData];
          if (updatedData[newIndex]) {
            updatedData[newIndex] = {
              ...updatedData[newIndex],
              id: savedInterview.id,
            };
          }
          return updatedData;
        });
      }
    } catch (dbError) {
      console.error("Error saving interview to database:", dbError);
    }
  };

  const handleRegenerate = (index: number) => {
    const interview = interviewData[index];
    if (interview) {
      generateQuestions(interview, index);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false); // Close dialog on cancel
  };

  const toggleInterview = (index: number) => {
    setExpandedInterview((current) => (current === index ? null : index));
  };

  const deleteInterview = async (id: string, index: number) => {
    if (!id) return;

    try {
      setIsDeleting(true);
      setCurrentInterviewIndex(index);

      const response = await fetch(`/api/interviews/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the interview from the local state
        setInterviewData((prev) => prev.filter((_, i) => i !== index));

        // Always clear the raw response state when deleting any interview
        setResponse(null);

        // If the deleted interview was expanded, collapse it
        if (expandedInterview === index) {
          setExpandedInterview(null);
        }
      } else {
        console.error("Failed to delete interview");
      }
    } catch (error) {
      console.error("Error deleting interview:", error);
    } finally {
      setIsDeleting(false);
      setCurrentInterviewIndex(null);
    }
  };

  const handleDelete = (id: string, index: number) => {
    if (!id) return;

    showAlert({
      title: t("deleteConfirmTitle") || "Delete Interview",
      description:
        t("deleteConfirmDescription") ||
        "Are you sure you want to delete this interview? This action cannot be undone.",
      cancelText: t("cancelButton") || "Cancel",
      confirmText: t("deleteButton") || "Delete",
      loadingText: t("deletingMessage") || "Deleting...",
      isLoading: isDeleting,
      variant: "destructive",
      onConfirm: () => deleteInterview(id, index),
    });
  };

  return (
    <div className="container mx-auto min-h-[70vh] p-[24px]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-md">{t("createButton")}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{t("createButton")}</DialogTitle>
            </DialogHeader>
            <InterviewForm onSubmit={handleSubmit} onCancel={handleCancel} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Display saved interviews */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <p>{t("loadingMessage") || "Loading interviews..."}</p>
          </div>
        ) : interviewData.length === 0 ? (
          <div className="rounded-lg border p-8 text-center">
            <p className="text-muted-foreground">{t("noInterviewsMessage")}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("getStartedMessage")}
            </p>
          </div>
        ) : (
          interviewData.map((interview, index) => (
            <Card key={index} className="shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{interview.position}</CardTitle>
                    <CardDescription>{interview.description}</CardDescription>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {interview.techStack?.map((tech, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-primary/10 px-2 py-1 text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                      <span className="rounded-full bg-secondary/20 px-2 py-1 text-xs">
                        {interview.yearsOfExperience} {t("yearsExp")}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleInterview(index)}
                      className="flex items-center gap-1"
                    >
                      {expandedInterview === index
                        ? t("collapseButton")
                        : t("expandButton")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRegenerate(index)}
                      disabled={isGenerating || isDeleting}
                      className="flex items-center gap-1"
                    >
                      {isGenerating && currentInterviewIndex === index ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : null}
                      {t("regenerateButton")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isGenerating || isDeleting}
                      className="flex items-center gap-1"
                    >
                      <Link href={`/profile/interview/${interview.id}`}>
                        Go Live
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log("Delete clicked for interview:", interview);
                        if (interview.id) {
                          console.log(
                            "Deleting interview with id:",
                            interview.id
                          );
                          handleDelete(interview.id, index);
                        } else {
                          console.error("Cannot delete: id is missing");
                        }
                      }}
                      disabled={isDeleting || isGenerating}
                      className="flex items-center gap-1 bg-red-50 hover:bg-red-100 hover:text-red-600"
                    >
                      {isDeleting && currentInterviewIndex === index ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                      {t("deleteButton") || "Delete"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {
                  isGenerating && currentInterviewIndex === index ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <p>{t("generatingMessage")}</p>
                    </div>
                  ) : interview.questions && expandedInterview === index ? (
                    <div className="space-y-6">
                      <Accordion type="single" collapsible className="w-full">
                        {interview.questions.map((q, qIndex) => (
                          <AccordionItem
                            key={qIndex}
                            value={`question-${qIndex}`}
                          >
                            <AccordionTrigger className="text-left">
                              {q.Question}
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="prose prose-sm dark:prose-invert max-w-none">
                                <p>{q.Answer}</p>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>

                      {response && currentInterviewIndex === index && (
                        <div className="mt-6 rounded-md border p-4">
                          <h4 className="mb-2 font-medium">
                            {t("rawResponseLabel")}
                          </h4>
                          <pre className="max-h-[300px] overflow-auto whitespace-pre-wrap rounded bg-gray-50 p-3 text-xs dark:bg-gray-900">
                            {response}
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : interview.questions ? (
                    <div className="py-4 text-center text-muted-foreground">
                      <p>{t("expandMessage")}</p>
                    </div>
                  ) : null
                  // (
                  //   <div className="py-4 text-center text-muted-foreground">
                  //     <p>{t("failedMessage")}</p>
                  //   </div>
                  // )
                }
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
