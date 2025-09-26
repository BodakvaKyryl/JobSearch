import { Job } from "@/types/job";

export const LIKED_JOBS_KEY = "likedJobs";
export const USER_PROFILE_KEY = "userProfile";

export interface UserProfile {
  name: string;
  desiredJobTitle: string;
  aboutMe: string;
}

function dispatchLocalStorageChangeEvent(key: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("localStorageChange", { detail: { key } })
    );
  }
}

export function getLikedJobs(): Job[] {
  if (typeof window === "undefined") {
    return [];
  }
  const likedJobs = localStorage.getItem(LIKED_JOBS_KEY);
  return likedJobs ? JSON.parse(likedJobs) : [];
}

export function isJobLiked(jobId: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  const likedJobs = getLikedJobs();
  return likedJobs.some((job) => job.job_id === jobId);
}

export function addLikedJob(job: Job): void {
  if (typeof window === "undefined") {
    return;
  }
  const likedJobs = getLikedJobs();
  if (!likedJobs.some((likedJob) => likedJob.job_id === job.job_id)) {
    localStorage.setItem(LIKED_JOBS_KEY, JSON.stringify([...likedJobs, job]));
    dispatchLocalStorageChangeEvent(LIKED_JOBS_KEY);
  }
}

export function removeLikedJob(jobId: string): void {
  if (typeof window === "undefined") {
    return;
  }
  const likedJobs = getLikedJobs();
  const updatedLikedJobs = likedJobs.filter((job) => job.job_id !== jobId);
  localStorage.setItem(LIKED_JOBS_KEY, JSON.stringify(updatedLikedJobs));
  dispatchLocalStorageChangeEvent(LIKED_JOBS_KEY);
}

export function getUserProfile(): UserProfile | null {
  if (typeof window === "undefined") {
    return null;
  }
  const profile = localStorage.getItem(USER_PROFILE_KEY);
  return profile ? JSON.parse(profile) : null;
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  dispatchLocalStorageChangeEvent(USER_PROFILE_KEY);
}

export function removeUserProfile(): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(USER_PROFILE_KEY);
  dispatchLocalStorageChangeEvent(USER_PROFILE_KEY);
}
