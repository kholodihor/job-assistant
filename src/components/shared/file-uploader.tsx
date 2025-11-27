"use client";

import { useCallback, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
  className?: string;
  disabled?: boolean;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const FileUploader = ({
  onFileSelect,
  className,
  disabled,
}: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0] || null;
      setFile(selectedFile);
      onFileSelect?.(selectedFile);
    },
    [onFileSelect]
  );

  const removeFile = useCallback(() => {
    setFile(null);
    onFileSelect?.(null);
  }, [onFileSelect]);

  const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: { "application/pdf": [".pdf"] },
      maxSize: maxFileSize,
      disabled,
    });

  const hasError = fileRejections.length > 0;

  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative cursor-pointer rounded-lg border-2 border-dashed p-6 transition-colors",
          isDragActive && "border-blue-500 bg-blue-50",
          !isDragActive && !hasError && "border-gray-300 hover:border-blue-400",
          hasError && "border-red-300 bg-red-50",
          disabled && "cursor-not-allowed opacity-50",
          file && "border-solid border-gray-200 bg-gray-50"
        )}
      >
        <input {...getInputProps()} />

        {file ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <FileText className="h-10 w-10 text-red-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="h-8 w-8 flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <p className="text-lg font-medium text-gray-900">
                {isDragActive ? "Drop your CV here" : "Upload your CV"}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="mt-2 text-xs text-gray-400">
                PDF files only (max {formatFileSize(maxFileSize)})
              </p>
            </div>
          </div>
        )}
      </div>

      {hasError && (
        <div className="mt-2">
          {fileRejections.map(({ file, errors }) => (
            <div key={file.name} className="text-sm text-red-600">
              {errors.map((error) => (
                <p key={error.code}>
                  {error.code === "file-too-large"
                    ? `File is too large. Maximum size is ${formatFileSize(maxFileSize)}.`
                    : error.code === "file-invalid-type"
                      ? "Only PDF files are allowed."
                      : error.message}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
