"use client";

import { Label } from "@radix-ui/react-label";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import * as yup from "yup";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface JobSearchProps {
  initialSearchTerm: string;
  onSearch: (searchTerm: string) => void;
}
interface FormValues {
  searchTerm: string;
}

const validationSchema = yup.object().shape({
  searchTerm: yup
    .string()
    .min(2, "Search query must be at least 2 characters long")
    .max(100, "Search query must be no more than 100 characters long")
    .required("Search query is required"),
});

export const JobSearchForm: React.FC<JobSearchProps> = ({
  initialSearchTerm,
  onSearch,
}) => {
  const initialValues: FormValues = {
    searchTerm: initialSearchTerm,
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        onSearch(values.searchTerm);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, isValid, dirty }) => (
        <Form className="mb-6 flex gap-2 items-start">
          <div className="flex-grow">
            <Label htmlFor="searchTerm">
              <Field
                as={Input}
                type="text"
                id="searchTerm"
                name="searchTerm"
                placeholder="Enter work name..."
                className="w-full"
              />
            </Label>
            <ErrorMessage
              name="searchTerm"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || !isValid || !dirty}
            className="px-6 py-2"
          >
            {isSubmitting ? "Search..." : "Search"}
          </Button>
        </Form>
      )}
    </Formik>
  );
};
