import { createFileRoute } from "@tanstack/react-router";
import { ProfileSettings } from "@/features/settings/components/profile-settings";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/settings/profile")({
	head: () => pageTitle("Profile"),
	component: ProfileSettings,
});
