import { queryOptions } from "@tanstack/react-query";
import {
	notificationPrefsStore,
	profileStore,
	workspacesStore,
} from "@/features/settings/api/store";
import {
	type Billing,
	billingSchema,
	notificationPrefsSchema,
	profileSchema,
	workspaceSchema,
} from "@/features/settings/schemas/settings";
import { sampleDelay } from "@/lib/mock-db";

/** Settings data access. Replace each queryFn with a call to your API. */
export const settingsKeys = {
	workspaces: ["workspaces"] as const,
	profile: ["profile"] as const,
	notifications: ["notification-prefs"] as const,
	billing: ["billing"] as const,
};

export const workspacesQuery = queryOptions({
	queryKey: settingsKeys.workspaces,
	queryFn: async () => {
		await sampleDelay(120);
		return workspaceSchema.array().parse(workspacesStore.all());
	},
});

export const profileQuery = queryOptions({
	queryKey: settingsKeys.profile,
	queryFn: async () => {
		await sampleDelay();
		return profileSchema.parse(profileStore.find("me"));
	},
});

export const notificationPrefsQuery = queryOptions({
	queryKey: settingsKeys.notifications,
	queryFn: async () => {
		await sampleDelay();
		return notificationPrefsSchema.parse(notificationPrefsStore.find("me"));
	},
});

/** Static sample billing. It is read-only, so the route prefetches it on the server. */
const BILLING: Billing = {
	currentPlan: "team",
	seats: { used: 6, total: 10 },
	storage: { usedGb: 18.4, totalGb: 50 },
	plans: [
		{
			id: "free",
			name: "Free",
			price: 0,
			blurb: "For one person getting started",
			features: ["Unlimited documents", "1 GB storage", "7-day history"],
		},
		{
			id: "team",
			name: "Team",
			price: 8,
			blurb: "For small teams writing together",
			features: ["Everything in Free", "50 GB storage", "Shared folders", "90-day history"],
		},
		{
			id: "business",
			name: "Business",
			price: 15,
			blurb: "For organisations with more needs",
			features: ["Everything in Team", "1 TB storage", "SSO and audit log", "Priority support"],
		},
	],
	invoices: [
		{ id: "INV-2026-011", date: "2026-11-01", amount: 48, status: "open" },
		{ id: "INV-2026-010", date: "2026-10-01", amount: 48, status: "paid" },
		{ id: "INV-2026-009", date: "2026-09-01", amount: 40, status: "paid" },
		{ id: "INV-2026-008", date: "2026-08-01", amount: 40, status: "paid" },
		{ id: "INV-2026-007", date: "2026-07-01", amount: 32, status: "paid" },
	],
};

export const billingQuery = queryOptions({
	queryKey: settingsKeys.billing,
	queryFn: async () => {
		await sampleDelay();
		return billingSchema.parse(BILLING);
	},
});
