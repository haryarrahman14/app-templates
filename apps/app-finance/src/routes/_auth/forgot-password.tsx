import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordPage } from "@/features/auth/components/forgot-password-page";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_auth/forgot-password")({
	head: () => ({ meta: [{ title: pageTitle("Reset password") }] }),
	component: ForgotPasswordPage,
});
