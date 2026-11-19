import { z } from "zod";

const email = z.email("Enter a valid email address.");
const password = z.string().min(8, "Use at least 8 characters.");

export const signInSchema = z.object({
	email,
	password: z.string().min(1, "Enter your password."),
});
export type SignInInput = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
	name: z.string().trim().min(2, "Tell us your name (2 characters or more)."),
	email,
	password: password.regex(/\d/, "Include at least one number."),
	terms: z.literal(true, { error: "Please accept the terms to continue." }),
});
export type SignUpInput = z.infer<typeof signUpSchema>;

export const forgotPasswordSchema = z.object({ email });
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/** Fills the sign-in form for the demo. Not a real credential: the sample accepts anything valid. */
export const SAMPLE_ACCOUNT = { email: "mara.okoye@fernhill.example", password: "paperwren-demo" };
