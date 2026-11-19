import { toast } from "@repo/ui/components/sonner";
import { useMutation } from "@tanstack/react-query";
import type { ForgotPasswordInput, SignInInput, SignUpInput } from "@/features/auth/schemas/auth";
import { sampleDelay } from "@/lib/mock-db";
import { startSession } from "@/lib/session";

/**
 * PLUG REAL AUTH HERE: call your provider (or your API) in these mutationFns.
 * The sample accepts any valid input and starts the localStorage session (`lib/session.ts`).
 */
export function useSignIn() {
	return useMutation({
		mutationFn: async (input: SignInInput) => {
			await sampleDelay(500);
			return startSession({ email: input.email });
		},
		onError: () => toast.error("Could not sign you in. Try again."),
	});
}

export function useSignUp() {
	return useMutation({
		mutationFn: async (input: SignUpInput) => {
			await sampleDelay(600);
			return startSession({ name: input.name, email: input.email });
		},
		onError: () => toast.error("Could not create your account. Try again."),
	});
}

export function useRequestPasswordReset() {
	return useMutation({
		mutationFn: async (input: ForgotPasswordInput) => {
			await sampleDelay(600);
			return input.email;
		},
		onError: () => toast.error("Could not send the email. Try again."),
	});
}
