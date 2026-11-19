import { createFileRoute } from "@tanstack/react-router";
import { SignInPage } from "@/features/auth/components/sign-in-page";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_auth/sign-in")({
	head: () => pageTitle("Sign in"),
	component: SignInPage,
});
