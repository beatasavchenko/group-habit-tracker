import { object, string } from "zod";

export const signInSchema = object({
  step1: object({
    email: string({ required_error: "Email is required" })
      .min(1, "Email is required")
      .email("Invalid email"),
  }),
  step2: object({
    code: string({ required_error: "Code is required" }).regex(/^\d{6}$/, "Code must be exactly 6 digits"),
  }),
});
