import { z } from "zod";
import { recordRefSchema } from "@/lib/records";

export const meetingSchema = z.object({
	id: z.string(),
	title: z.string(),
	start: z.string(),
	end: z.string(),
	location: z.string(),
	record: recordRefSchema.nullable(),
	attendeeIds: z.array(z.string()),
});
export type Meeting = z.infer<typeof meetingSchema>;

export const askSchema = z.object({
	question: z.string().trim().min(2, "Ask a question first").max(300),
});
export type Ask = z.infer<typeof askSchema>;

export const askAnswerSchema = z.object({
	text: z.string(),
	links: z.array(z.object({ label: z.string(), href: z.string(), type: z.string() })),
});
export type AskAnswer = z.infer<typeof askAnswerSchema>;
