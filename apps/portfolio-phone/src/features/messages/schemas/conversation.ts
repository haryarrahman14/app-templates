import { z } from "zod";

export const cannedQuestionSchema = z.object({
	id: z.string(),
	question: z.string(),
	/** Each string is one reply bubble. */
	answer: z.array(z.string()).min(1),
});

export const conversationSchema = z.object({
	greeting: z.array(z.string()).min(1),
	questions: z.array(cannedQuestionSchema),
	/** Reply to anything typed that isn't a preset question. */
	fallback: z.array(z.string()).min(1),
});

export type CannedQuestion = z.infer<typeof cannedQuestionSchema>;
export type Conversation = z.infer<typeof conversationSchema>;
