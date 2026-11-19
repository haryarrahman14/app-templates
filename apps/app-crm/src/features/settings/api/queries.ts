import { queryOptions } from "@tanstack/react-query";
import {
	type ApiKey,
	apiKeySchema,
	type Billing,
	billingSchema,
	type CustomField,
	customFieldSchema,
	type NotificationPrefs,
	notificationPrefsSchema,
	type WorkspaceSettings,
	workspaceSettingsSchema,
} from "@/features/settings/schemas/settings";
import { delay } from "@/lib/sample-db/db";
import { dayOffset } from "@/lib/sample-db/random";

/**
 * Settings sample state. Lives in the browser tab like the rest of the sample data.
 * ▶ Real API: replace each queryFn with a fetch to your settings endpoints.
 */
export const settingsStore: {
	workspace: WorkspaceSettings;
	fields: CustomField[];
	notifications: NotificationPrefs;
	apiKeys: ApiKey[];
	billing: Billing;
} = {
	workspace: {
		name: "Fernhill Studio",
		slug: "fernhill",
		currency: "USD",
		timezone: "Europe/Lisbon",
	},
	fields: [
		{
			id: "f1",
			label: "Lead source",
			type: "select",
			recordType: "company",
			required: false,
			options: ["Referral", "Event", "Website", "Outbound"],
		},
		{
			id: "f2",
			label: "Renewal date",
			type: "date",
			recordType: "company",
			required: false,
			options: [],
		},
		{
			id: "f3",
			label: "LinkedIn",
			type: "url",
			recordType: "person",
			required: false,
			options: [],
		},
		{
			id: "f4",
			label: "Decision maker",
			type: "checkbox",
			recordType: "person",
			required: false,
			options: [],
		},
		{ id: "f5", label: "Seats", type: "number", recordType: "deal", required: true, options: [] },
	],
	notifications: {
		assigned: true,
		mentioned: true,
		dealStage: true,
		dailyDigest: false,
		weeklyReport: true,
		productNews: false,
	},
	apiKeys: [
		{
			id: "k1",
			name: "Website forms",
			prefix: "tw_sample_4f2a",
			createdAt: dayOffset(-120),
			lastUsedAt: dayOffset(-1, 13),
		},
		{
			id: "k2",
			name: "Data warehouse sync",
			prefix: "tw_sample_9c1e",
			createdAt: dayOffset(-40),
			lastUsedAt: null,
		},
	],
	billing: {
		plan: "team",
		trialDaysLeft: 12,
		seatsUsed: 6,
		seatsTotal: 10,
		recordsUsed: 158,
		recordsTotal: 5000,
		emailsUsed: 1240,
		emailsTotal: 2000,
		invoices: [
			{ id: "i1", number: "TW-0012", date: dayOffset(-18), amount: 240, status: "due" },
			{ id: "i2", number: "TW-0011", date: dayOffset(-48), amount: 240, status: "paid" },
			{ id: "i3", number: "TW-0010", date: dayOffset(-79), amount: 200, status: "paid" },
			{ id: "i4", number: "TW-0009", date: dayOffset(-109), amount: 200, status: "paid" },
		],
	},
};

export const workspaceSettingsQuery = queryOptions({
	queryKey: ["settings", "workspace"],
	queryFn: async () => {
		await delay();
		return workspaceSettingsSchema.parse(settingsStore.workspace);
	},
});

export const customFieldsQuery = queryOptions({
	queryKey: ["settings", "fields"],
	queryFn: async () => {
		await delay();
		return customFieldSchema.array().parse(settingsStore.fields);
	},
});

export const notificationPrefsQuery = queryOptions({
	queryKey: ["settings", "notifications"],
	queryFn: async () => {
		await delay();
		return notificationPrefsSchema.parse(settingsStore.notifications);
	},
});

export const apiKeysQuery = queryOptions({
	queryKey: ["settings", "api-keys"],
	queryFn: async () => {
		await delay();
		return apiKeySchema.array().parse(settingsStore.apiKeys);
	},
});

export const billingQuery = queryOptions({
	queryKey: ["settings", "billing"],
	queryFn: async () => {
		await delay();
		return billingSchema.parse(settingsStore.billing);
	},
});
