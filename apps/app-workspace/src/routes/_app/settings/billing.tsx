import { createFileRoute } from "@tanstack/react-router";
import { billingQuery } from "@/features/settings/api/queries";
import { BillingSettings } from "@/features/settings/components/billing-settings";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/settings/billing")({
	// The page reads billing with useSuspenseQuery; loading it first keeps the route's skeleton in charge.
	loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(billingQuery),
	head: () => pageTitle("Billing"),
	component: BillingSettings,
});
