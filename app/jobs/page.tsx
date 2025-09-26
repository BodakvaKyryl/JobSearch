"use client";

import { JobCard } from "@/components/job-card";
import { JobSearchForm } from "@/components/job-search-form";
import { Button } from "@/components/ui/button";
import { getLikedJobs } from "@/lib/localStorage";
import api from "@/services/api";
import { Job, JobSearchErrorResponse, JSearchApiResponse } from "@/types/job";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function isErrorResponse(
  response: JSearchApiResponse
): response is JobSearchErrorResponse {
  return response.status === "ERROR";
}

async function fetchJobs(searchTerm: string): Promise<Job[]> {
  const query = searchTerm;
  if (!query) return [];

  try {
    const response = await api.get<JSearchApiResponse>("/search", {
      params: {
        query: query,
        num_pages: 1,
      },
    });

    if (isErrorResponse(response.data)) {
      throw new Error(response.data.error.message);
    }

    return response.data.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error while fetching jobs.");
  }
}

export default function JobsPage() {
  const initialSearchTerm = (() => {
    if (typeof window !== "undefined") {
      const userProfile = localStorage.getItem("userProfile");
      if (userProfile) {
        const profile = JSON.parse(userProfile);
        return profile.desiredJobTitle || "React";
      }
    }
    return "React";
  })();

  const [currentSearchTerm, setCurrentSearchTerm] = useState(initialSearchTerm);
  const [likedJobs, setLikedJobs] = useState<Job[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLikedJobs = localStorage.getItem("likedJobs");
      if (storedLikedJobs) {
        setLikedJobs(JSON.parse(storedLikedJobs));
      }
    }
  }, []);

  useEffect(() => {
    const handleLocalStorageChange = () => {
      setLikedJobs(getLikedJobs());
    };
    window.addEventListener("localStorageChange", handleLocalStorageChange);
    return () => {
      window.removeEventListener(
        "localStorageChange",
        handleLocalStorageChange
      );
    };
  }, []);

  const { data, isLoading, isError, error, refetch } = useQuery<Job[], Error>({
    queryKey: ["jobs", currentSearchTerm],
    queryFn: () => fetchJobs(currentSearchTerm),
    enabled: !!currentSearchTerm,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const handleSearchSubmit = (searchTerm: string) => {
    setCurrentSearchTerm(searchTerm);
  };

  const handleViewDetails = (jobId: string) => {
    router.push(`/job-details/${jobId}`);
  };

  const handleApply = (applyLink: string) => {
    if (applyLink) {
      window.open(applyLink, "_blank");
    } else {
      alert("The link to apply is unavailable.");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <JobSearchForm
        initialSearchTerm={currentSearchTerm}
        onSearch={handleSearchSubmit}
      />

      {isLoading && (
        <div className="text-center py-8 text-gray-700">
          Jobs are loading...
        </div>
      )}

      {isError && (
        <div className="text-center py-8 text-red-500 text-lg">
          Error: {error?.message}
        </div>
      )}

      {!isLoading &&
        !isError &&
        (data && data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((job) => (
              <JobCard
                key={job.job_id}
                job={job}
                onViewDetails={handleViewDetails}
                onApply={handleApply}
                isLiked={likedJobs.some(
                  (likedJob) => likedJob.job_id === job.job_id
                )}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4 text-lg">No jobs are found.</p>
            <Button
              onClick={() => refetch()}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Try again
            </Button>
          </div>
        ))}
    </div>
  );
}
