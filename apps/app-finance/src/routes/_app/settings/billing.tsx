import { createFileRoute } from "@tanstack/react-router";
import { BillingSettings } from "@/features/settings/components/billing-settings";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/settings/billing")({
	head: () => ({ meta: [{ title: pageTitle("Billing · Settings") }] }),
	component: BillingSettings,
});
