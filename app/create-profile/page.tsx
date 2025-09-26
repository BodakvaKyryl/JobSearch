"use client";

import { ProfileForm } from "@/components/profile-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getUserProfile,
  saveUserProfile,
  UserProfile,
} from "@/lib/localStorage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateProfilePage() {
  const [initialProfile, setInitialProfile] = useState<UserProfile | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const profile = getUserProfile();
    setInitialProfile(profile);
    setIsLoading(false);
  }, []);

  const handleSubmit = (
    values: UserProfile,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    saveUserProfile(values);
    alert("Profile successfully saved!");
    setSubmitting(false);
    router.push("/jobs");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-2xl text-center py-8">
        <p className="text-neutral-600">Loading profile...</p>
      </div>
    );
  }

  const formInitialValues: UserProfile = initialProfile || {
    name: "",
    desiredJobTitle: "",
    aboutMe: "",
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            {initialProfile ? "Edit Profile" : "Create Profile"}
          </CardTitle>
          <CardDescription className="text-center mt-2">
            {initialProfile
              ? "Update your profile details to get better job recommendations."
              : "Create your profile to receive personalized job recommendations."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm
            initialValues={formInitialValues}
            onSubmit={handleSubmit}
            isEditMode={!!initialProfile}
          />
        </CardContent>
      </Card>
    </div>
  );
}
