"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserProfile } from "@/lib/localStorage";
import { profileValidationSchema } from "@/lib/validation-schemas";
import {
  ErrorMessage,
  Field,
  FieldInputProps,
  Form,
  Formik,
  FormikHelpers,
} from "formik";
import React from "react";

interface ProfileFormProps {
  initialValues: UserProfile;
  onSubmit: (
    values: UserProfile,
    formikHelpers: FormikHelpers<UserProfile>
  ) => void;
  isEditMode: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  initialValues,
  onSubmit,
  isEditMode,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={profileValidationSchema}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {({ errors, touched, isSubmitting, isValid, dirty }) => (
        <Form className="space-y-6">
          <div>
            <Label className="mb-4" htmlFor="name">
              Name
            </Label>
            <Field name="name">
              {({ field }: { field: FieldInputProps<string> }) => (
                <Input
                  id="name"
                  placeholder="Your Name"
                  className={
                    errors.name && touched.name ? "border-red-500" : ""
                  }
                  {...field}
                />
              )}
            </Field>
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <Label className="mb-4" htmlFor="desiredJobTitle">
              Desired Job Title
            </Label>
            <Field name="desiredJobTitle">
              {({ field }: { field: FieldInputProps<string> }) => (
                <Input
                  id="desiredJobTitle"
                  placeholder="e.g., Software Engineer"
                  className={
                    errors.desiredJobTitle && touched.desiredJobTitle
                      ? "border-red-500"
                      : ""
                  }
                  {...field}
                />
              )}
            </Field>
            <ErrorMessage
              name="desiredJobTitle"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <Label className="mb-4" htmlFor="aboutMe">
              About Me
            </Label>
            <Field name="aboutMe">
              {({ field }: { field: FieldInputProps<string> }) => (
                <Textarea
                  id="aboutMe"
                  placeholder="Tell us about yourself, your skills, and experience..."
                  rows={5}
                  className={
                    errors.aboutMe && touched.aboutMe ? "border-red-500" : ""
                  }
                  {...field}
                />
              )}
            </Field>
            <ErrorMessage
              name="aboutMe"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !isValid || !dirty}
          >
            {isEditMode ? "Save Changes" : "Create Profile"}
          </Button>
        </Form>
      )}
    </Formik>
  );
};
