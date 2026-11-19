import { z } from "zod";
import { memberRoleSchema } from "@/features/workspace/schemas/workspace";
import { recordTypeSchema } from "@/lib/records";

export const profileSchema = z.object({
	name: z.string().trim().min(2, "Enter your name").max(60),
	title: z.string().trim().max(60, "Keep it under 60 characters"),
	email: z.email("Enter a valid email address"),
});
export type Profile = z.infer<typeof profileSchema>;

export const CURRENCIES = ["USD", "EUR", "GBP", "AUD", "IDR", "JPY"] as const;
export const TIMEZONES = [
	"UTC",
	"Europe/Lisbon",
	"Europe/Amsterdam",
	"America/Chicago",
	"America/Toronto",
	"Asia/Jakarta",
	"Asia/Tokyo",
	"Australia/Melbourne",
] as const;

export const workspaceSettingsSchema = z.object({
	name: z.string().trim().min(2, "Enter a workspace name").max(40),
	slug: z
		.string()
		.trim()
		.min(3, "Use at least 3 characters")
		.max(30)
		.regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes only"),
	currency: z.enum(CURRENCIES),
	timezone: z.enum(TIMEZONES),
});
export type WorkspaceSettings = z.infer<typeof workspaceSettingsSchema>;

export const FIELD_TYPES = ["text", "number", "date", "select", "checkbox", "url"] as const;
export const fieldTypeSchema = z.enum(FIELD_TYPES);
export type FieldType = z.infer<typeof fieldTypeSchema>;

export const customFieldSchema = z.object({
	id: z.string(),
	label: z.string(),
	type: fieldTypeSchema,
	recordType: recordTypeSchema,
	required: z.boolean(),
	options: z.array(z.string()),
});
export type CustomField = z.infer<typeof customFieldSchema>;

export const newFieldSchema = z
	.object({
		label: z.string().trim().min(2, "Name the field").max(40, "Keep it under 40 characters"),
		type: fieldTypeSchema,
		recordType: recordTypeSchema,
		required: z.boolean(),
		options: z.string(),
	})
	.refine((value) => value.type !== "select" || value.options.split(",").some((o) => o.trim()), {
		path: ["options"],
		message: "Add at least one option, separated by commas",
	});
export type NewField = z.infer<typeof newFieldSchema>;

export const notificationPrefsSchema = z.record(z.string(), z.boolean());
export type NotificationPrefs = z.infer<typeof notificationPrefsSchema>;

export const apiKeySchema = z.object({
	id: z.string(),
	name: z.string(),
	prefix: z.string(),
	createdAt: z.string(),
	lastUsedAt: z.string().nullable(),
});
export type ApiKey = z.infer<typeof apiKeySchema>;

export const newApiKeySchema = z.object({
	name: z.string().trim().min(2, "Name the key so you know where it is used").max(40),
});
export type NewApiKey = z.infer<typeof newApiKeySchema>;

export const invoiceSchema = z.object({
	id: z.string(),
	number: z.string(),
	date: z.string(),
	amount: z.number(),
	status: z.enum(["paid", "due"]),
});
export type Invoice = z.infer<typeof invoiceSchema>;

export const billingSchema = z.object({
	plan: z.enum(["starter", "team", "business"]),
	trialDaysLeft: z.number(),
	seatsUsed: z.number(),
	seatsTotal: z.number(),
	recordsUsed: z.number(),
	recordsTotal: z.number(),
	emailsUsed: z.number(),
	emailsTotal: z.number(),
	invoices: z.array(invoiceSchema),
});
export type Billing = z.infer<typeof billingSchema>;

export const inviteSchema = z.object({
	emails: z
		.string()
		.trim()
		.min(1, "Add at least one email")
		.refine(
			(value) =>
				value
					.split(/[\s,;]+/)
					.filter(Boolean)
					.every((email) => z.email().safeParse(email).success),
			"One of these is not a valid email address",
		),
	role: memberRoleSchema,
});
export type Invite = z.infer<typeof inviteSchema>;
