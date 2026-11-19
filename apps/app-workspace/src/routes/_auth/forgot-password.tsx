import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_auth/forgot-password")({
	head: () => pageTitle("Reset password"),
	component: ForgotPasswordForm,
});
