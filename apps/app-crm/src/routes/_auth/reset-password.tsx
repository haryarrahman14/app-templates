import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordPage } from "@/features/auth/components/reset-password-page";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_auth/reset-password")({
	head: () => pageTitle("Reset password"),
	component: ResetPasswordPage,
});
