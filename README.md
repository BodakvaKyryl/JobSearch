# Job Search Application

## Project Overview

This is a modern job search application built with Next.js, React, and TypeScript. It allows users to search for jobs, view job details, manage a list of liked jobs, and receive personalized job recommendations based on their profile. The application emphasizes a clean UI/UX using Shadcn UI components and robust form validation with Formik and Yup.

## Features

- **Job Search**: Search for job listings using keywords.
- **Job Details**: View comprehensive details for each job.
- **User Profile Management**: Create and edit a user profile including Name, Desired Job Title, and About Me.
- **Personalized Job Recommendations**: Automatically fetches job recommendations on the `/jobs` page based on the "Desired Job Title" from the user's profile stored in LocalStorage.
- **Liked Jobs**: Mark jobs as liked and view them on a dedicated "Liked Jobs" page. Liked status updates in real-time across the application.
- **Responsive Design**: Optimized for various screen sizes.
- **Client-Side Data Fetching**: Uses `@tanstack/react-query` for efficient data fetching and caching.
- **Form Validation**: Implemented with Formik and Yup for robust input validation.
- **Automatic Routing**: Redirects from the home page to the jobs page, and from the profile creation page to the jobs page after saving.
- **Loading Skeletons**: Provides a smooth user experience during data fetching with custom skeleton loaders.

## Code Structure

The project follows a modular and component-driven architecture. Key directories and their purposes:

- `client/app`: Contains Next.js page routes (e.g., `/jobs`, `/create-profile`, `/liked`). Each route typically has its `page.tsx` file.
- `client/components`: Houses reusable UI components (e.g., `JobCard`, `JobSearchForm`, `ProfileForm`, `JobCardSkeleton`, `JobDetailsSkeleton`). Components are organized into individual folders to promote modularity and encapsulation.
- `client/lib`: Stores utility functions and configurations, including LocalStorage helpers (`localStorage.ts`) and validation schemas (`validation-schemas.ts`).
- `client/services`: Contains the API service configuration (`api.ts`).
- `client/types`: Defines TypeScript interfaces and types for data structures (e.g., `Job`, `UserProfile`).

**Folder-Scoped Components**: Each significant component (e.g., `job-card`, `job-search-form`, `profile-form`, `job-card-skeleton`, `job-details-skeleton`) resides in its own directory within `client/components`. This structure helps in organizing component-related files (e.g., `index.tsx`, `styles.module.css`, `types.ts`) and provides a clear export interface through an `index.ts` file within each component folder.

## Technologies Used

- **Next.js**: React framework for production.
- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Strongly typed superset of JavaScript.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **Shadcn UI**: Beautifully designed components built with Radix UI and Tailwind CSS.
- **Formik**: For building forms in React.
- **Yup**: For schema validation in forms.
- **@tanstack/react-query**: For server state management, data fetching, caching, and synchronization.
- **Axios**: Promise-based HTTP client.
- **Local Storage**: For client-side data persistence (user profile, liked jobs).

## Setup and Installation

To run this project locally, follow these steps:

1.  **Clone the repository**:

    ```bash
    git clone <repository-url>
    cd job-search
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables**:
    Create a `.env.local` file in the root directory and add your API key:

    ```
    NEXT_PUBLIC_JSEARCH_API_KEY=YOUR_JSEARCH_API_KEY
    ```

    (Replace `YOUR_JSEARCH_API_KEY` with your actual JSearch API key. You can obtain one from [RapidAPI](https://rapidapi.com/apidojo/api/jsearch/).)

4.  **Run the development server**:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1.  **Home Page**: Automatically redirects to the `/jobs` page.
2.  **Create/Edit Profile**: Navigate to `/create-profile` to set up your name, desired job title, and a brief "About Me" section. This data is saved in LocalStorage and used for personalized job recommendations.
3.  **Job Listings (`/jobs`)**: View a list of jobs. Initially, recommendations are based on your profile's "Desired Job Title" (or a default if no profile exists). You can use the search bar to find specific jobs.
4.  **Like/Unlike Jobs**: Click the heart icon on any job card to like or unlike a job. The status updates in real-time.
5.  **Liked Jobs (`/liked`)**: View all the jobs you have liked.
6.  **Job Details (`/job-details/[id]`)**: Click on a job card to see its full details.

## Recent Changes and Development Log

This section summarizes the key enhancements and refactorings implemented recently:

- **User Profile Feature**: Added a `/create-profile` page with a Formik and Yup-validated form to capture user's name, desired job title, and a self-description. Profile data is stored in LocalStorage.
- **Personalized Job Recommendations**: The `/jobs` page now conditionally fetches job recommendations based on the "Desired Job Title" from the user's profile in LocalStorage. This integrates seamlessly with the existing search functionality.
- **Real-time Liked Jobs Status**: Addressed issues where liked status was not updating in real-time. This involved:
  - Refactoring `client/lib/localStorage.ts` to store and retrieve full `Job` objects for liked items.
  - Implementing `localStorageChange` event listeners in `client/app/jobs/page.tsx` and `client/app/job-details/[id]/_components/job-details-content.tsx` to ensure real-time UI updates.
  - Adjusting `client/components/job-card.tsx` to correctly display and manage the `isLiked` status.
- **UI/UX Enhancements**: Integrated Shadcn UI components for a consistent and modern look across the application.
- **Code Structure Refinements**:
  - **Component Extraction**: The main profile form logic and UI were extracted from `client/app/create-profile/page.tsx` into a reusable `client/components/profile-form.tsx` component.
  - **Validation Schema Separation**: The Yup validation schema for the profile form was moved to `client/lib/validation-schemas.ts` for better organization and reusability.
  - **Skeleton Componentization**: The loading skeleton JSX for job cards and job details were extracted into dedicated components: `client/components/job-card-skeleton.tsx` and `client/components/job-details-skeleton.tsx`. Shadows were removed from skeleton loaders for a cleaner appearance.
- **Automatic Navigation**: Implemented automatic redirection from the root URL (`/`) to the `/jobs` page. Also, after a successful profile submission on `/create-profile`, users are now automatically redirected to the `/jobs` page.
- **Code Cleanup**: Removed all `console.log` statements and unnecessary comments for a cleaner and more production-ready codebase.
