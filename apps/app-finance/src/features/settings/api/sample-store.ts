import type {
	Billing,
	ConnectedAccount,
	NotificationPrefs,
	Profile,
	Security,
} from "@/features/settings/schemas/settings";
import { DAY_MS, SAMPLE_AS_OF } from "@/lib/sample-data/calendar";

/** In-memory settings for the sample user (browser tab). Replace with your user/settings API. */
export const settingsStore: {
	profile: Partial<Profile>;
	notifications: NotificationPrefs;
	security: Security;
	accounts: ConnectedAccount[];
	billing: Billing;
} = {
	profile: { timezone: "Europe/Zurich", bio: "" },
	notifications: {
		priceAlerts: true,
		dailyBrief: true,
		weeklyReport: true,
		dividends: false,
		productNews: false,
		channel: "both",
	},
	security: {
		twoFactor: false,
		passwordChangedAt: SAMPLE_AS_OF - 84 * DAY_MS,
		sessions: [
			{
				id: "s1",
				device: "This browser",
				location: "Zurich, CH (sample)",
				lastActive: SAMPLE_AS_OF + 15 * 3_600_000,
				current: true,
			},
			{
				id: "s2",
				device: "Phone app",
				location: "Zurich, CH (sample)",
				lastActive: SAMPLE_AS_OF + 8 * 3_600_000,
				current: false,
			},
			{
				id: "s3",
				device: "Desktop · Browser",
				location: "Lisbon, PT (sample)",
				lastActive: SAMPLE_AS_OF - 6 * DAY_MS,
				current: false,
			},
		],
	},
	accounts: [
		{
			id: "a1",
			name: "Pinecrest Bank · Checking",
			kind: "bank",
			detail: "•••• 0000",
			connected: true,
			lastSync: SAMPLE_AS_OF + 7 * 3_600_000,
		},
		{
			id: "a2",
			name: "Alder Credit Union · Savings",
			kind: "bank",
			detail: "•••• 0001",
			connected: true,
			lastSync: SAMPLE_AS_OF - DAY_MS,
		},
		{
			id: "a3",
			name: "Harborline Brokerage",
			kind: "brokerage",
			detail: "Holdings import",
			connected: false,
			lastSync: null,
		},
		{
			id: "a4",
			name: "Spreadsheet sync",
			kind: "export",
			detail: "Nightly CSV",
			connected: false,
			lastSync: null,
		},
	],
	billing: {
		plan: "plus",
		renewsAt: SAMPLE_AS_OF + 12 * DAY_MS,
		card: "Sample card •••• 0000",
		invoices: [0, 1, 2, 3, 4, 5].map((i) => ({
			id: `INV-2026-${String(11 - i).padStart(3, "0")}`,
			date: Date.UTC(2026, 10 - i, 1),
			amount: 9,
			status: i === 0 ? ("open" as const) : ("paid" as const),
			plan: "Plus",
		})),
	},
};
