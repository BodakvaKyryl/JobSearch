import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addLikedJob, removeLikedJob } from "@/lib/localStorage";
import { Job } from "@/types/job";
import { Heart } from "lucide-react";
import React from "react";

interface JobCardProps {
  job: Job;
  onViewDetails?: (jobId: string) => void;
  onApply?: (applyLink: string) => void;
  onRemoveLikedJob?: (jobId: string) => void;
  isLiked: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onViewDetails,
  onApply,
  onRemoveLikedJob,
  isLiked,
}) => {
  const handleLikeToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isLiked) {
      if (onRemoveLikedJob) {
        onRemoveLikedJob(job.job_id);
      } else {
        removeLikedJob(job.job_id);
      }
    } else {
      addLikedJob(job);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center gap-4">
        {job.employer_logo && (
          <Avatar className="size-16">
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
          <CardTitle className="text-xl font-semibold text-neutral-900">
            {job.job_title}
          </CardTitle>
          {job.employer_name && (
            <CardDescription className="text-neutral-500 text-sm">
              {job.employer_name}
            </CardDescription>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLikeToggle}
          className="text-gray-400 hover:text-red-500"
        >
          <Heart fill={isLiked ? "red" : "none"} />
        </Button>
      </CardHeader>
      <CardContent className="flex-1">
        {(job.job_city || job.job_state || job.job_location) && (
          <p className="text-gray-500 text-sm mb-2">
            {job.job_location ||
              `${job.job_city || ""}${
                job.job_city && job.job_state ? ", " : ""
              }${job.job_state || ""}`}
            {job.job_country && ` (${job.job_country})`}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-2">
          {job.job_employment_types &&
            job.job_employment_types.map((type, index) => (
              <span
                key={index}
                className="inline-block bg-neutral-200 text-neutral-800 text-xs px-2 py-1 rounded-full capitalize"
              >
                {type.replace("_", " ").toLowerCase()}
              </span>
            ))}
          {job.job_is_remote && (
            <span className="inline-block bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
              Remote
            </span>
          )}
        </div>

        {(job.job_min_salary || job.job_max_salary || job.job_salary) && (
          <p className="text-emerald-700 font-medium text-sm mb-2">
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
          <p className="text-neutral-400 text-xs mb-2">
            Posted: {job.job_posted_at}
          </p>
        )}

        {job.job_highlights?.Qualifications &&
          job.job_highlights.Qualifications.length > 0 && (
            <div className="mb-4 mt-auto">
              <h4 className="text-sm font-semibold text-neutral-700 mb-1">
                Main requirements:
              </h4>
              <ul className="text-sm text-neutral-600 space-y-1 list-none p-0">
                {job.job_highlights.Qualifications.slice(0, 3).map(
                  (qual, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-neutral-600 mr-1">•</span>
                      {qual}
                    </li>
                  )
                )}
                {job.job_highlights.Qualifications.length > 3 && (
                  <li className="text-neutral-400">
                    +{job.job_highlights.Qualifications.length - 3} more...
                  </li>
                )}
              </ul>
            </div>
          )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="flex gap-2 w-full">
          <Button
            onClick={() => onApply && onApply(job.job_apply_link)}
            className="flex-1 bg-neutral-900 hover:bg-neutral-700 text-sm"
            disabled={!job.job_apply_link}
          >
            Apply
          </Button>
          <Button
            variant="outline"
            onClick={() => onViewDetails && onViewDetails(job.job_id)}
            className="flex-1 border-neutral-900 text-neutral-900 hover:bg-neutral-100 text-sm"
          >
            Details
          </Button>
        </div>

        {job.job_publisher && (
          <p className="text-xs text-neutral-500 mt-2 text-center">
            from {job.job_publisher}
          </p>
        )}
      </CardFooter>
    </Card>
  );
};
