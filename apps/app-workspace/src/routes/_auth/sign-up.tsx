import { createFileRoute } from "@tanstack/react-router";
import { SignUpForm } from "@/features/auth/components/sign-up-form";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_auth/sign-up")({
	head: () => pageTitle("Create account"),
	component: SignUpForm,
});
