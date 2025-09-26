"use client";

import { JobCard } from "@/components/job-card";
import { getLikedJobs, removeLikedJob } from "@/lib/localStorage";
import { Job } from "@/types/job";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function LikedJobsPage() {
  const [likedJobs, setLikedJobs] = useState<Job[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    setLikedJobs(getLikedJobs());
  }, []);

  useEffect(() => {
    const handleLocalStorageChange = () => {
      setLikedJobs(getLikedJobs());
      queryClient.invalidateQueries({ queryKey: ["likedJobs"] });
    };

    window.addEventListener("localStorageChange", handleLocalStorageChange);

    return () => {
      window.removeEventListener(
        "localStorageChange",
        handleLocalStorageChange
      );
    };
  }, [queryClient]);

  const handleRemoveLikedJob = (jobId: string) => {
    removeLikedJob(jobId);
    setLikedJobs(getLikedJobs());
    queryClient.invalidateQueries({ queryKey: ["likedJobs"] });
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold text-center mb-8">Liked Jobs</h1>
      {likedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedJobs.map((job) => (
            <JobCard
              key={job.job_id}
              job={job}
              onRemoveLikedJob={handleRemoveLikedJob}
              isLiked={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-600 text-lg">
          No liked jobs yet. Go to the jobs page to like some!
        </div>
      )}
    </div>
  );
}
