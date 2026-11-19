import { z } from "zod";
import { recordRefSchema } from "@/lib/records";

export const taskPrioritySchema = z.enum(["low", "normal", "high"]);
export type TaskPriority = z.infer<typeof taskPrioritySchema>;

export const taskSchema = z.object({
	id: z.string(),
	title: z.string().min(1),
	dueDate: z.string().nullable(),
	done: z.boolean(),
	assigneeId: z.string(),
	priority: taskPrioritySchema,
	record: recordRefSchema.nullable(),
	createdAt: z.string(),
});
export type Task = z.infer<typeof taskSchema>;

export const taskFormSchema = z.object({
	title: z.string().trim().min(1, "What needs doing?").max(120, "Keep it under 120 characters"),
	dueDate: z.string(),
	assigneeId: z.string().min(1, "Pick someone"),
	priority: taskPrioritySchema,
	/** "type:id" or "" for none, so it fits a select. */
	record: z.string(),
});
export type TaskForm = z.infer<typeof taskFormSchema>;
