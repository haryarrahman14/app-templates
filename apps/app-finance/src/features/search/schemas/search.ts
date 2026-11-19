import { z } from "zod";

export const searchEntrySchema = z.object({
	symbol: z.string(),
	name: z.string(),
	sector: z.string(),
	price: z.number(),
	changePct: z.number(),
});
export type SearchEntry = z.infer<typeof searchEntrySchema>;
