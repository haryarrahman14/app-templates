import { createFileRoute } from "@tanstack/react-router";
import { SignInPage } from "@/features/auth/components/sign-in-page";
import { signInSearchSchema } from "@/features/auth/schemas/auth";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_auth/sign-in")({
	validateSearch: signInSearchSchema,
	head: () => ({ meta: [{ title: pageTitle("Sign in") }] }),
	component: SignInPage,
});
