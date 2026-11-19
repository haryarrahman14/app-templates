import { z } from "zod";
import { recordRefSchema, recordTypeSchema } from "@/lib/records";

export const memberRoleSchema = z.enum(["owner", "admin", "member", "guest"]);
export type MemberRole = z.infer<typeof memberRoleSchema>;

export const memberSchema = z.object({
	id: z.string(),
	name: z.string().min(1),
	email: z.email(),
	role: memberRoleSchema,
	status: z.enum(["active", "invited"]),
	title: z.string(),
	joinedAt: z.string(),
});
export type Member = z.infer<typeof memberSchema>;

export const LIST_COLORS = ["blue", "gray", "teal", "orange", "red"] as const;
export const listColorSchema = z.enum(LIST_COLORS);
export type ListColor = z.infer<typeof listColorSchema>;

export const recordListSchema = z.object({
	id: z.string(),
	name: z.string().min(1),
	color: listColorSchema,
	recordType: recordTypeSchema,
	recordIds: z.array(z.string()),
});
export type RecordList = z.infer<typeof recordListSchema>;

export const favouriteSchema = recordRefSchema.extend({ label: z.string() });
export type Favourite = z.infer<typeof favouriteSchema>;

export const notificationSchema = z.object({
	id: z.string(),
	title: z.string(),
	body: z.string(),
	at: z.string(),
	read: z.boolean(),
	href: z.string(),
});
export type Notification = z.infer<typeof notificationSchema>;

export const newListSchema = z.object({
	name: z.string().trim().min(1, "Give the list a name").max(40, "Keep it under 40 characters"),
	color: listColorSchema,
	recordType: recordTypeSchema,
});
export type NewList = z.infer<typeof newListSchema>;
