import { createFileRoute } from "@tanstack/react-router";
import { MembersPage } from "@/features/settings/components/members-page";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/settings/members")({
	head: () => pageTitle("Members · Settings"),
	component: MembersPage,
});
