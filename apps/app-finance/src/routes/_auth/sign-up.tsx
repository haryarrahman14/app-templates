import { createFileRoute } from "@tanstack/react-router";
import { SignUpPage } from "@/features/auth/components/sign-up-page";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_auth/sign-up")({
	head: () => ({ meta: [{ title: pageTitle("Create account") }] }),
	component: SignUpPage,
});
