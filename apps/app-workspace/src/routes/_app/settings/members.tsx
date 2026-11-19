import { createFileRoute } from "@tanstack/react-router";
import { MembersSettings } from "@/features/members/components/members-settings";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/settings/members")({
	head: () => pageTitle("Members"),
	component: MembersSettings,
});
