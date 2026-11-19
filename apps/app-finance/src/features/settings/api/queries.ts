import { queryOptions } from "@tanstack/react-query";
import { settingsStore } from "@/features/settings/api/sample-store";
import {
	billingSchema,
	connectedAccountSchema,
	notificationPrefsSchema,
	securitySchema,
} from "@/features/settings/schemas/settings";
import { sampleDelay } from "@/lib/delay";
import { queryRoots } from "@/lib/query-keys";

/* Settings data for the signed-in user (browser-side). Swap each queryFn for your user API. */

export const profileOverridesQuery = queryOptions({
	queryKey: [...queryRoots.settings, "profile"],
	queryFn: async () => {
		await sampleDelay(220);
		return { ...settingsStore.profile };
	},
});

export const notificationPrefsQuery = queryOptions({
	queryKey: [...queryRoots.settings, "notifications"],
	queryFn: async () => {
		await sampleDelay(220);
		return notificationPrefsSchema.parse({ ...settingsStore.notifications });
	},
});

export const securityQuery = queryOptions({
	queryKey: [...queryRoots.settings, "security"],
	queryFn: async () => {
		await sampleDelay(240);
		return securitySchema.parse(structuredClone(settingsStore.security));
	},
});

export const connectedAccountsQuery = queryOptions({
	queryKey: [...queryRoots.settings, "accounts"],
	queryFn: async () => {
		await sampleDelay(240);
		return connectedAccountSchema.array().parse(structuredClone(settingsStore.accounts));
	},
});

export const billingQuery = queryOptions({
	queryKey: [...queryRoots.settings, "billing"],
	queryFn: async () => {
		await sampleDelay(260);
		return billingSchema.parse(structuredClone(settingsStore.billing));
	},
});
