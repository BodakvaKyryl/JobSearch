import { Job } from "@/types/job";

export const LOCAL_STORAGE_KEY = "likedJobs";

function dispatchLocalStorageChangeEvent() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("localStorageChange"));
  }
}

export function getLikedJobs(): Job[] {
  if (typeof window === "undefined") {
    return [];
  }
  const likedJobs = localStorage.getItem(LOCAL_STORAGE_KEY);
  return likedJobs ? JSON.parse(likedJobs) : [];
}

export function isJobLiked(jobId: string): boolean {
  const likedJobs = getLikedJobs();
  return likedJobs.some((job) => job.job_id === jobId);
}

export function addLikedJob(job: Job): void {
  if (typeof window === "undefined") {
    return;
  }
  const likedJobs = getLikedJobs();
  if (!likedJobs.some((likedJob) => likedJob.job_id === job.job_id)) {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify([...likedJobs, job])
    );
    dispatchLocalStorageChangeEvent();
  }
}

export function removeLikedJob(jobId: string): void {
  if (typeof window === "undefined") {
    return;
  }
  const likedJobs = getLikedJobs();
  const updatedLikedJobs = likedJobs.filter((job) => job.job_id !== jobId);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedLikedJobs));
  dispatchLocalStorageChangeEvent();
}
