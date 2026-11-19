import { z } from "zod";
import { recordRefSchema } from "@/lib/records";

export const noteSchema = z.object({
	id: z.string(),
	title: z.string(),
	body: z.string(),
	record: recordRefSchema.nullable(),
	authorId: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});
export type Note = z.infer<typeof noteSchema>;

export const newNoteSchema = z.object({
	title: z.string().trim().max(80),
	body: z.string().trim().min(1, "Write something first").max(5000),
	record: recordRefSchema.nullable(),
});
export type NewNote = z.infer<typeof newNoteSchema>;
