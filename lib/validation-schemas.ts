import * as Yup from "yup";

export const profileValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .required("Name is required"),
  desiredJobTitle: Yup.string()
    .min(2, "Desired job title must be at least 2 characters")
    .max(100, "Desired job title must not exceed 100 characters")
    .required("Desired Job Title is required"),
  aboutMe: Yup.string()
    .min(10, "About Me must be at least 10 characters")
    .max(500, "About Me must not exceed 500 characters")
    .required("About Me is required"),
});
