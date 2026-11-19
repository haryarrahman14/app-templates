import { z } from "zod";

export const prioritySchema = z.enum(["low", "medium", "high"]);
export type Priority = z.infer<typeof prioritySchema>;

/** Dates are plain calendar days ("2026-11-19"), not timestamps. */
export const dayString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a valid date.");

export const taskSchema = z.object({
	id: z.string(),
	title: z.string().min(1),
	notes: z.string(),
	dueDate: dayString.nullable(),
	priority: prioritySchema,
	done: z.boolean(),
	docId: z.string().nullable(),
	createdAt: z.string(),
});
export type Task = z.infer<typeof taskSchema>;

export const taskFormSchema = z.object({
	title: z
		.string()
		.trim()
		.min(1, "Give the task a title.")
		.max(120, "Keep it under 120 characters."),
	notes: z.string().max(1000, "Keep notes under 1000 characters."),
	dueDate: z.union([dayString, z.literal("")]),
	priority: prioritySchema,
	docId: z.string(),
});
export type TaskForm = z.infer<typeof taskFormSchema>;

export const PRIORITY_LABELS: Record<Priority, string> = {
	low: "Low",
	medium: "Medium",
	high: "High",
};
