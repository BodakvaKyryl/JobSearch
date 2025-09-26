import { JobDetailsContent } from "./_components/job-details-content";

interface JobDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id: jobId } = await params;

  if (!jobId) {
    return (
      <div className="container mx-auto p-4 max-w-4xl text-center py-8 text-red-500 text-lg">
        Invalid job ID provided.
      </div>
    );
  }

  return <JobDetailsContent jobId={jobId} />;
}
