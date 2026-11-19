import { createFileRoute } from "@tanstack/react-router";
import { AccountsSettings } from "@/features/settings/components/accounts-settings";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/settings/accounts")({
	head: () => ({ meta: [{ title: pageTitle("Connected accounts · Settings") }] }),
	component: AccountsSettings,
});
