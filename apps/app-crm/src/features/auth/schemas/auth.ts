import { z } from "zod";

const password = z.string().min(8, "Use at least 8 characters").max(128);

export const signInSchema = z.object({
	email: z.email("Enter a valid email address"),
	password,
});
export type SignIn = z.infer<typeof signInSchema>;

export const signUpSchema = z
	.object({
		name: z.string().trim().min(2, "Enter your name").max(60),
		email: z.email("Enter a valid email address"),
		password,
		confirm: z.string(),
		terms: z.boolean().refine((value) => value, "Please accept the terms to continue"),
	})
	.refine((value) => value.password === value.confirm, {
		path: ["confirm"],
		message: "Passwords do not match",
	});
export type SignUp = z.infer<typeof signUpSchema>;

export const forgotPasswordSchema = z.object({
	email: z.email("Enter a valid email address"),
});
export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
	.object({ password, confirm: z.string() })
	.refine((value) => value.password === value.confirm, {
		path: ["confirm"],
		message: "Passwords do not match",
	});
export type ResetPassword = z.infer<typeof resetPasswordSchema>;
