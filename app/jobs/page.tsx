"use client";

import { JobCard } from "@/components/job-card";
import { JobCardSkeleton } from "@/components/job-card-skeleton";
import { JobSearchForm } from "@/components/job-search-form";
import { Button } from "@/components/ui/button";
import {
  getLikedJobs,
  getUserProfile,
  LIKED_JOBS_KEY,
  USER_PROFILE_KEY,
  UserProfile,
} from "@/lib/localStorage";
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
  const query = searchTerm.trim();
  if (!query) return [];

  try {
    const response = await api.get<JSearchApiResponse>("/search", {
      params: {
        query: query,
        num_pages: 1,
        country: "us",
        language: "en",
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
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [hasUserSearchedManually, setHasUserSearchedManually] = useState(false);
  const [likedJobs, setLikedJobs] = useState<Job[]>([]);

  useEffect(() => {
    const profile = getUserProfile();
    setUserProfile(profile);

    const initialQuery = profile?.desiredJobTitle || "Software Developer";
    setCurrentSearchTerm(initialQuery);
    setIsProfileLoading(false);

    setLikedJobs(getLikedJobs());

    const handleLocalStorageChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.key === USER_PROFILE_KEY) {
        const updatedProfile = getUserProfile();
        setUserProfile(updatedProfile);
        if (updatedProfile?.desiredJobTitle && !hasUserSearchedManually) {
          setCurrentSearchTerm(updatedProfile.desiredJobTitle);
        } else if (
          !updatedProfile?.desiredJobTitle &&
          !hasUserSearchedManually
        ) {
          setCurrentSearchTerm("Software Developer");
        }
      } else if (customEvent.detail?.key === LIKED_JOBS_KEY) {
        setLikedJobs(getLikedJobs());
      }
    };

    window.addEventListener("localStorageChange", handleLocalStorageChange);
    return () => {
      window.removeEventListener(
        "localStorageChange",
        handleLocalStorageChange
      );
    };
  }, [hasUserSearchedManually]);

  const { data, isLoading, isError, error, refetch } = useQuery<Job[], Error>({
    queryKey: ["jobs", currentSearchTerm],
    queryFn: () => fetchJobs(currentSearchTerm),
    enabled: !!currentSearchTerm && !isProfileLoading,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const handleSearchSubmit = (searchTerm: string) => {
    setCurrentSearchTerm(searchTerm);
    setHasUserSearchedManually(true);
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

  const pageTitle = hasUserSearchedManually
    ? `Search Results: "${currentSearchTerm}"`
    : userProfile?.desiredJobTitle
    ? `Recommended Jobs: "${userProfile.desiredJobTitle}"`
    : "Popular Jobs (Default)";

  if (isProfileLoading || isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-7xl mt-10">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-900">
          {isProfileLoading ? "Loading Profile..." : "Loading Jobs..."}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl mt-10">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-900">
        {pageTitle}
      </h1>

      <JobSearchForm
        initialSearchTerm={currentSearchTerm}
        onSearch={handleSearchSubmit}
      />

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
            <p className="text-gray-600 mb-4 text-lg">
              No jobs found for your query.
            </p>
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
