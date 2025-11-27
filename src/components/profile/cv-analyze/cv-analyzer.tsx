"use client";

import { useState } from "react";
import {
  CheckCircle,
  CloudUpload,
  FileText,
  Loader2,
  TrendingDown,
  TrendingUp,
  Upload,
  XCircle,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import {
  CVAnalysisFeedback,
  CVAnalysisFormData,
  analyzeCv,
} from "@/app/actions/analyze-cv";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CVAnalyzerProps {
  className?: string;
}

export const CVAnalyzer = ({ className }: CVAnalyzerProps) => {
  const t = useTranslations("cvAnalyzer");
  const locale = useLocale();

  const [file, setFile] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<CVAnalysisFeedback | null>(null);

  // React Dropzone configuration
  const onDrop = (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        toast.success(t("success.fileUploaded"));
      } else {
        toast.error(t("errors.pdfOnly"));
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB limit
  });

  const handleAnalyze = async () => {
    if (!file || !jobTitle.trim()) {
      toast.error(t("errors.missingFields"));
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const formData: CVAnalysisFormData = {
        companyName: companyName.trim(),
        jobTitle: jobTitle.trim(),
        jobDescription: jobDescription.trim(),
        cvFile: file,
      };

      const result = await analyzeCv(formData, locale);
      setAnalysisResult(result.feedback);
      toast.success(t("success.analysisComplete"));
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(t("errors.analysisFailed"));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="h-4 w-4" />;
    if (score >= 60) return <TrendingUp className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  const renderTips = (
    tips: Array<{ type: "good" | "improve"; tip: string; explanation?: string }>
  ) => {
    return (
      <div className="space-y-2">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start space-x-2">
            {tip.type === "good" ? (
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
            ) : (
              <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">{tip.tip}</p>
              {tip.explanation && (
                <p className="mt-1 text-sm text-gray-600">{tip.explanation}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`mx-auto max-w-[75vw] space-y-6 ${className}`}>
      {/* Upload and Form Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t("title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload - Dropzone */}
          <div className="space-y-2">
            <Label>{t("form.uploadCV")} (PDF)</Label>
            <div
              {...getRootProps()}
              className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : file
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center space-y-2">
                {file ? (
                  <>
                    <CheckCircle className="h-12 w-12 text-green-500" />
                    <p className="text-lg font-medium text-green-700">
                      {file.name}
                    </p>
                    <p className="text-sm text-green-600">
                      {t("form.fileUploaded")}
                    </p>
                  </>
                ) : isDragActive ? (
                  <>
                    <CloudUpload className="h-12 w-12 text-blue-500" />
                    <p className="text-lg font-medium text-blue-700">
                      {t("form.dropHere")}
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-gray-400" />
                    <p className="text-lg font-medium text-gray-700">
                      {t("form.dragDrop")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("form.clickBrowse")}
                    </p>
                    <p className="text-xs text-gray-400">{t("form.pdfOnly")}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Company Name */}
          <div>
            <Label htmlFor="company-name">
              {t("form.companyName")} {t("form.optional")}
            </Label>
            <Input
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder={t("form.companyPlaceholder")}
              className="mt-1"
            />
          </div>

          {/* Job Title */}
          <div>
            <Label htmlFor="job-title">
              {t("form.jobTitle")} {t("form.required")}
            </Label>
            <Input
              id="job-title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder={t("form.jobTitlePlaceholder")}
              className="mt-1"
              required
            />
          </div>

          {/* Job Description */}
          <div>
            <Label htmlFor="job-description">
              {t("form.jobDescription")} {t("form.optional")}
            </Label>
            <Textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder={t("form.jobDescriptionPlaceholder")}
              className="mt-1 min-h-[100px]"
            />
          </div>

          {/* Analyze Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !file || !jobTitle.trim()}
              className="w-[20vw] hover:bg-blue-100"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("form.analyzing")}
                </>
              ) : (
                t("form.analyzeButton")
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {analysisResult && (
        <div className="space-y-4">
          {/* Overall Score */}
          <div
            className={`rounded-lg border p-4 ${getScoreColor(analysisResult.overallScore)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getScoreIcon(analysisResult.overallScore)}
                <h3 className="text-lg font-semibold">
                  {t("results.overallScore")}
                </h3>
              </div>
              <div className="text-2xl font-bold">
                {analysisResult.overallScore}/100
              </div>
            </div>
          </div>

          {/* ATS Score */}
          <Card>
            <CardHeader>
              <div
                className={`rounded-lg border p-4 ${getScoreColor(analysisResult.ATS.score)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getScoreIcon(analysisResult.ATS.score)}
                    <h3 className="text-lg font-semibold">
                      {t("results.sections.ats")}
                    </h3>
                  </div>
                  <div className="text-2xl font-bold">
                    {analysisResult.ATS.score}/100
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>{renderTips(analysisResult.ATS.tips)}</CardContent>
          </Card>

          {/* Tone and Style */}
          <Card>
            <CardHeader>
              <div
                className={`rounded-lg border p-4 ${getScoreColor(analysisResult.toneAndStyle.score)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getScoreIcon(analysisResult.toneAndStyle.score)}
                    <h3 className="text-lg font-semibold">
                      {t("results.sections.toneAndStyle")}
                    </h3>
                  </div>
                  <div className="text-2xl font-bold">
                    {analysisResult.toneAndStyle.score}/100
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {renderTips(analysisResult.toneAndStyle.tips)}
            </CardContent>
          </Card>

          {/* Content Analysis */}
          <Card>
            <CardHeader>
              <div
                className={`rounded-lg border p-4 ${getScoreColor(analysisResult.content.score)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getScoreIcon(analysisResult.content.score)}
                    <h3 className="text-lg font-semibold">
                      {t("results.sections.content")}
                    </h3>
                  </div>
                  <div className="text-2xl font-bold">
                    {analysisResult.content.score}/100
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>{renderTips(analysisResult.content.tips)}</CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
