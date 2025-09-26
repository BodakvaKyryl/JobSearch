"use client";

import { JobDetailsSkeleton } from "@/components/job-details-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addLikedJob, isJobLiked, removeLikedJob } from "@/lib/localStorage";
import api from "@/services/api";
import { Job, JobSearchErrorResponse, JSearchApiResponse } from "@/types/job";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ErrorResponseData {
  error: {
    message: string;
    code?: string;
  };
}

function isAxiosErrorWithResponseData(
  error: unknown
): error is AxiosError<ErrorResponseData> {
  if (!(error instanceof AxiosError)) {
    return false;
  }
  if (!error.response) {
    return false;
  }
  return !!error.response.data?.error;
}

function isErrorResponse(
  response: JSearchApiResponse
): response is JobSearchErrorResponse {
  return response.status === "ERROR";
}

async function fetchJobDetails(jobId: string): Promise<Job> {
  if (!jobId) throw new Error("Job ID is required.");

  try {
    const decodedJobId = decodeURIComponent(jobId);
    const response = await api.get<JSearchApiResponse>("/job-details", {
      params: {
        job_id: decodedJobId,
        extended_publisher_details: false,
      },
    });

    if (isErrorResponse(response.data)) {
      throw new Error(response.data.error.message);
    }

    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Job not found.");
    }

    return response.data.data[0];
  } catch (error: unknown) {
    if (isAxiosErrorWithResponseData(error)) {
      throw new Error("Axios error with response data.");
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error while fetching job details.");
  }
}

interface JobDetailsContentProps {
  jobId: string;
}

export function JobDetailsContent({ jobId }: JobDetailsContentProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);

  const {
    data: job,
    isLoading,
    isError,
    error,
  } = useQuery<Job, Error>({
    queryKey: ["job-details", jobId],
    queryFn: () => fetchJobDetails(jobId),
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (!job) return;

    const updateLikedStatus = () => {
      setLiked(isJobLiked(job.job_id));
    };

    updateLikedStatus();

    window.addEventListener("localStorageChange", updateLikedStatus);
    return () => {
      window.removeEventListener("localStorageChange", updateLikedStatus);
    };
  }, [job, jobId]);

  const handleLikeToggle = () => {
    if (!job) return;

    if (liked) {
      removeLikedJob(job.job_id);
    } else {
      addLikedJob(job);
    }
  };

  if (isLoading) {
    return <JobDetailsSkeleton />;
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4 max-w-4xl text-center py-8 text-red-500 text-lg">
        Error: {error?.message}
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="ml-4 mt-4 flex-1 border-neutral-900 text-neutral-900 hover:bg-neutral-100 text-sm"
        >
          Go Back
        </Button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto p-4 max-w-4xl text-center py-8 text-gray-600 text-lg">
        Job not found.
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="ml-4 mt-4 flex-1 border-neutral-900 text-neutral-900 hover:bg-neutral-100 text-sm"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Button
        onClick={() => router.back()}
        className="mb-6 border-neutral-900 text-neutral-900 hover:bg-neutral-100 text-sm"
        variant="outline"
      >
        &larr; Back to Job Listings
      </Button>

      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {job.employer_logo && (
            <Avatar className="size-20">
              <AvatarImage
                src={job.employer_logo}
                alt={job.employer_name || "Employer Logo"}
              />
              <AvatarFallback>
                {job.employer_name?.charAt(0) || "N/A"}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex-1">
            <CardTitle className="text-3xl font-extrabold text-neutral-900 leading-tight">
              {job.job_title}
            </CardTitle>
            {job.employer_name && (
              <CardDescription className="text-neutral-500 text-lg mt-1">
                {job.employer_name}
              </CardDescription>
            )}
            {(job.job_city || job.job_state || job.job_location) && (
              <p className="text-neutral-500 text-sm mt-1">
                {job.job_location ||
                  `${job.job_city || ""}${
                    job.job_city && job.job_state ? ", " : ""
                  }${job.job_state || ""}`}
                {job.job_country && ` (${job.job_country})`}
              </p>
            )}
          </div>
          <Button
            onClick={handleLikeToggle}
            className="ml-4 p-2 rounded-full hover:bg-neutral-200"
            variant="ghost"
          >
            <Heart
              className={`h-6 w-6 ${
                liked ? "text-red-500" : "text-neutral-500"
              }`}
            />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {job.job_employment_types &&
              job.job_employment_types.map((type, index) => (
                <Badge
                  key={index}
                  className="bg-neutral-200 text-neutral-800 capitalize"
                >
                  {type.replace("_", " ").toLowerCase()}
                </Badge>
              ))}
            {job.job_is_remote && (
              <Badge className="bg-gray-200 text-gray-600">Remote</Badge>
            )}
          </div>

          {(job.job_min_salary || job.job_max_salary || job.job_salary) && (
            <p className="text-emerald-700 font-bold text-lg">
              {job.job_salary ||
                (job.job_min_salary && job.job_max_salary
                  ? `$${job.job_min_salary.toLocaleString()} - $${job.job_max_salary.toLocaleString()}`
                  : job.job_min_salary
                  ? `From $${job.job_min_salary.toLocaleString()}`
                  : job.job_max_salary
                  ? `Up to $${job.job_max_salary.toLocaleString()}`
                  : "")}
              {job.job_salary_period &&
                ` / ${job.job_salary_period.toLowerCase()}`}
            </p>
          )}

          {job.job_posted_at && (
            <p className="text-neutral-400 text-xs">
              Posted: {job.job_posted_at}
            </p>
          )}

          {job.job_description && (
            <div>
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">
                About the Job
              </h3>
              <p className="text-neutral-700 whitespace-pre-line leading-relaxed">
                {job.job_description}
              </p>
            </div>
          )}

          {job.job_highlights?.Qualifications &&
            job.job_highlights.Qualifications.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-neutral-700 mb-2">
                  Qualifications
                </h3>
                <ul className="list-disc list-inside text-neutral-700 space-y-1">
                  {job.job_highlights.Qualifications.map((qual, index) => (
                    <li key={index}>{qual}</li>
                  ))}
                </ul>
              </div>
            )}

          {job.job_highlights?.Responsibilities &&
            job.job_highlights.Responsibilities.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-neutral-700 mb-2">
                  Responsibilities
                </h3>
                <ul className="list-disc list-inside text-neutral-700 space-y-1">
                  {job.job_highlights.Responsibilities.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </div>
            )}
          {job.job_highlights?.Benefits &&
            job.job_highlights.Benefits.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-neutral-700 mb-2">
                  Benefits
                </h3>
                <ul className="list-disc list-inside text-neutral-700 space-y-1">
                  {job.job_highlights.Benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}

          {job.job_apply_link && (
            <Button
              onClick={() => window.open(job.job_apply_link, "_blank")}
              className="w-full py-3 bg-neutral-900 hover:bg-neutral-700 text-lg"
            >
              Apply Now
            </Button>
          )}
          {job.job_publisher && (
            <p className="text-xs text-neutral-500 mt-2 text-center">
              from {job.job_publisher}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
