import { z } from "zod";

export const signInSchema = z.object({
	email: z.email("Enter a valid email address."),
	password: z.string().min(8, "Passwords are at least 8 characters."),
	remember: z.boolean(),
});
export type SignInInput = z.infer<typeof signInSchema>;

export const signUpSchema = z
	.object({
		name: z.string().trim().min(2, "Tell us your name (2 characters or more)."),
		email: z.email("Enter a valid email address."),
		password: z
			.string()
			.min(8, "Use at least 8 characters.")
			.regex(/[0-9]/, "Include at least one number."),
		confirm: z.string(),
		terms: z.boolean().refine((v) => v, "Please accept the sample terms to continue."),
	})
	.refine((data) => data.password === data.confirm, {
		path: ["confirm"],
		message: "Passwords do not match.",
	});
export type SignUpInput = z.infer<typeof signUpSchema>;

export const forgotPasswordSchema = z.object({
	email: z.email("Enter a valid email address."),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/** `/sign-in?next=/markets/NVRA`: where to go after signing in (checked by `safeNext`). */
export const signInSearchSchema = z.object({
	next: z.string().optional().catch(undefined),
});
