import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ForgotPasswordInput, SignInInput, SignUpInput } from "@/features/auth/schemas/auth";
import { sampleDelay } from "@/lib/delay";
import { endSession, startSession } from "@/lib/session";

function nameFromEmail(email: string) {
	const local = email.split("@")[0] ?? "there";
	const first = local.split(/[._-]/)[0] ?? local;
	return first.charAt(0).toUpperCase() + first.slice(1);
}

/** Sample sign-in: any valid email and password start a session. PLUG REAL AUTH HERE (see lib/session.ts). */
export function useSignIn() {
	return useMutation({
		mutationFn: async (input: SignInInput) => {
			await sampleDelay(600);
			return startSession({ name: nameFromEmail(input.email), email: input.email });
		},
	});
}

export function useSignUp() {
	return useMutation({
		mutationFn: async (input: SignUpInput) => {
			await sampleDelay(700);
			return startSession({
				name: input.name.split(" ")[0] ?? input.name,
				email: input.email,
			});
		},
	});
}

/** Sample only: no email is sent. Swap for your provider's reset endpoint. */
export function useRequestPasswordReset() {
	return useMutation({
		mutationFn: async (_input: ForgotPasswordInput) => {
			await sampleDelay(700);
			return { ok: true as const };
		},
	});
}

export function useSignOut() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async () => endSession(),
		onSuccess: () => queryClient.clear(),
	});
}
