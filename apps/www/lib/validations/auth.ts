import { z } from "zod";
export const authSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters long",
    })
    .max(100),
  // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
  //   message:
  //     "Password must contain at least 6 characters, one uppercase, one lowercase, one number and one special character",
  // }),
});
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(), //.min(4).max(12)
});

export type ILogin = z.infer<typeof loginSchema>;
export const checkEmailSchema = z.object({
  email: authSchema.shape.email,
});
export const verfifyEmailSchema = z.object({
  code: z
    .string()
    .min(6, {
      message: "Verification code must be 6 characters long",
    })
    .max(6),
});
export const resetPasswordSchema = z
  .object({
    password: authSchema.shape.password,
    confirmPassword: authSchema.shape.password,
    code: verfifyEmailSchema.shape.code,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
