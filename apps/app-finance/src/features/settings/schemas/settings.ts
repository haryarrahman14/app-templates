import { z } from "zod";

export const profileSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Name needs at least 2 characters.")
		.max(60, "Keep it under 60 characters."),
	email: z.email("Enter a valid email address."),
	timezone: z.string().min(1, "Choose a time zone."),
	bio: z.string().max(160, "Keep the bio under 160 characters."),
});
export type Profile = z.infer<typeof profileSchema>;

export const notificationPrefsSchema = z.object({
	priceAlerts: z.boolean(),
	dailyBrief: z.boolean(),
	weeklyReport: z.boolean(),
	dividends: z.boolean(),
	productNews: z.boolean(),
	channel: z.enum(["email", "push", "both"]),
});
export type NotificationPrefs = z.infer<typeof notificationPrefsSchema>;

export const sessionSchema = z.object({
	id: z.string(),
	device: z.string(),
	location: z.string(),
	lastActive: z.number(),
	current: z.boolean(),
});
export type DeviceSession = z.infer<typeof sessionSchema>;

export const securitySchema = z.object({
	twoFactor: z.boolean(),
	sessions: z.array(sessionSchema),
	passwordChangedAt: z.number(),
});
export type Security = z.infer<typeof securitySchema>;

export const changePasswordSchema = z
	.object({
		current: z.string().min(1, "Enter your current password."),
		next: z
			.string()
			.min(8, "Use at least 8 characters.")
			.regex(/[0-9]/, "Include at least one number."),
		confirm: z.string(),
	})
	.refine((v) => v.next === v.confirm, { path: ["confirm"], message: "Passwords do not match." })
	.refine((v) => v.next !== v.current, { path: ["next"], message: "Choose a different password." });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const connectedAccountSchema = z.object({
	id: z.string(),
	name: z.string(),
	kind: z.enum(["bank", "brokerage", "card", "export"]),
	detail: z.string(),
	connected: z.boolean(),
	lastSync: z.number().nullable(),
});
export type ConnectedAccount = z.infer<typeof connectedAccountSchema>;

export const planIdSchema = z.enum(["free", "plus", "pro"]);
export type PlanId = z.infer<typeof planIdSchema>;

export const billingSchema = z.object({
	plan: planIdSchema,
	renewsAt: z.number(),
	card: z.string(),
	invoices: z.array(
		z.object({
			id: z.string(),
			date: z.number(),
			amount: z.number(),
			status: z.enum(["paid", "open"]),
			plan: z.string(),
		}),
	),
});
export type Billing = z.infer<typeof billingSchema>;
