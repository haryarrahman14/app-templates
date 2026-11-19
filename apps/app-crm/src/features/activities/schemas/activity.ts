import { z } from "zod";
import { recordRefSchema } from "@/lib/records";

export const ACTIVITY_TYPES = [
	"email",
	"call",
	"meeting",
	"note",
	"task",
	"deal",
	"created",
] as const;
export const activityTypeSchema = z.enum(ACTIVITY_TYPES);
export type ActivityType = z.infer<typeof activityTypeSchema>;

export const activitySchema = z.object({
	id: z.string(),
	type: activityTypeSchema,
	summary: z.string(),
	detail: z.string(),
	record: recordRefSchema,
	actorId: z.string(),
	at: z.string(),
});
export type Activity = z.infer<typeof activitySchema>;

export const logActivitySchema = z.object({
	type: z.enum(["email", "call", "meeting"]),
	summary: z.string().trim().min(3, "Add a short summary").max(140),
	detail: z.string().trim().max(2000),
});
export type LogActivity = z.infer<typeof logActivitySchema>;
