import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "@/features/settings/components/profile-page";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/settings/profile")({
	head: () => pageTitle("Profile · Settings"),
	component: ProfilePage,
});
