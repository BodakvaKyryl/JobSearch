"use client";

import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export const JobCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col h-full">
      <Skeleton className="w-16 h-16 object-contain mb-4 rounded-full" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-1" />
      <Skeleton className="h-4 w-1/3 mb-2" />
      <div className="flex flex-wrap gap-2 mb-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
      <Skeleton className="h-4 w-2/5 mb-2" />
      <Skeleton className="h-4 w-1/4 mb-4" />
      <Skeleton className="h-16 w-full mt-auto" />
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
    </div>
  );
};
