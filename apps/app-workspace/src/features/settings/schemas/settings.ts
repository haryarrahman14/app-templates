import { z } from "zod";

export const workspaceUseSchema = z.enum(["team-docs", "personal-notes", "projects", "school"]);
export type WorkspaceUse = z.infer<typeof workspaceUseSchema>;

export const workspaceSchema = z.object({
	id: z.string(),
	name: z.string().min(1),
	use: workspaceUseSchema,
	current: z.boolean(),
	tint: z.string(),
});
export type Workspace = z.infer<typeof workspaceSchema>;

export const workspaceNameSchema = z
	.string()
	.trim()
	.min(2, "Use at least 2 characters.")
	.max(40, "Keep it under 40 characters.");

export const profileSchema = z.object({
	id: z.string(),
	jobTitle: z.string(),
	bio: z.string(),
});
export type Profile = z.infer<typeof profileSchema>;

export const profileFormSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Use at least 2 characters.")
		.max(60, "Keep it under 60 characters."),
	email: z.email("Enter a valid email address."),
	jobTitle: z.string().trim().max(60, "Keep it under 60 characters."),
	bio: z.string().trim().max(240, "Keep your bio under 240 characters."),
});
export type ProfileForm = z.infer<typeof profileFormSchema>;

export const notificationPrefsSchema = z.object({
	id: z.string(),
	mentions: z.boolean(),
	comments: z.boolean(),
	shares: z.boolean(),
	taskReminders: z.boolean(),
	weeklyDigest: z.boolean(),
	productNews: z.boolean(),
});
export type NotificationPrefs = z.infer<typeof notificationPrefsSchema>;

export const planSchema = z.object({
	id: z.enum(["free", "team", "business"]),
	name: z.string(),
	price: z.number(),
	blurb: z.string(),
	features: z.array(z.string()),
});
export type Plan = z.infer<typeof planSchema>;

export const invoiceSchema = z.object({
	id: z.string(),
	date: z.string(),
	amount: z.number(),
	status: z.enum(["paid", "open"]),
});
export type Invoice = z.infer<typeof invoiceSchema>;

export const billingSchema = z.object({
	currentPlan: planSchema.shape.id,
	seats: z.object({ used: z.number(), total: z.number() }),
	storage: z.object({ usedGb: z.number(), totalGb: z.number() }),
	plans: z.array(planSchema),
	invoices: z.array(invoiceSchema),
});
export type Billing = z.infer<typeof billingSchema>;
