import { createFileRoute } from "@tanstack/react-router";
import { BillingPage } from "@/features/settings/components/billing-page";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/settings/billing")({
	head: () => pageTitle("Billing · Settings"),
	component: BillingPage,
});
