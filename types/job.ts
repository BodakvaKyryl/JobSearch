export interface ApplyOption {
  publisher: string;
  apply_link: string;
  is_direct: boolean;
}

export interface JobHighlights {
  Qualifications?: string[];
  Responsibilities?: string[];
  Benefits?: string[];
}

export type JobEmploymentType =
  | "FULLTIME"
  | "PARTTIME"
  | "CONTRACTOR"
  | "INTERN"
  | "TEMPORARY";

export interface Job {
  job_id: string;
  job_title: string;
  employer_name: string | null;
  employer_logo: string | null;
  employer_website: string | null;
  job_publisher: string;
  job_employment_type: string;
  job_employment_types: JobEmploymentType[];
  job_apply_link: string;
  job_apply_is_direct: boolean;
  apply_options: ApplyOption[];
  job_description: string;
  job_is_remote: boolean | null;
  job_posted_at: string;
  job_posted_at_timestamp: number;
  job_posted_at_datetime_utc: string;
  job_location: string;
  job_city: string | null;
  job_state: string | null;
  job_country: string;
  job_latitude: number | null;
  job_longitude: number | null;
  job_benefits: string[] | null;
  job_google_link: string;
  job_salary: string | null;
  job_min_salary: number | null;
  job_max_salary: number | null;
  job_salary_period: string | null;
  job_highlights: JobHighlights | null;
  job_onet_soc: string | null;
  job_onet_job_zone: string | null;
}

export interface JobSearchParameters {
  job_id?: string;
  country?: string;
  language?: string;
  query?: string;
  page?: number;
  num_pages?: number;
  date_posted?: "all" | "today" | "3days" | "week" | "month";
  remote_jobs_only?: boolean;
  employment_types?: JobEmploymentType[];
  job_requirements?: string[];
  job_titles?: string[];
  company_types?: string[];
  employer?: string[];
  radius?: number;
}

export interface JobSearchResponse {
  status: "OK" | "ERROR";
  request_id: string;
  parameters: JobSearchParameters;
  data: Job[];
}

export interface JobSearchErrorResponse {
  status: "ERROR";
  request_id: string;
  error: {
    message: string;
    code?: string;
  };
}

export type JSearchApiResponse = JobSearchResponse | JobSearchErrorResponse;

export interface JobFilters {
  query?: string;
  location?: string;
  remote_only?: boolean;
  employment_types?: JobEmploymentType[];
  salary_min?: number;
  salary_max?: number;
  date_posted?: "all" | "today" | "3days" | "week" | "month";
  company?: string;
}
