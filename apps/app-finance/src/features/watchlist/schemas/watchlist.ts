import { z } from "zod";

export const watchRowSchema = z.object({
	symbol: z.string(),
	name: z.string(),
	price: z.number(),
	change: z.number(),
	changePct: z.number(),
	spark: z.array(z.number()),
});
export type WatchRow = z.infer<typeof watchRowSchema>;

export const watchlistSchema = z.object({
	id: z.string(),
	name: z.string(),
	rows: z.array(watchRowSchema),
});
export type Watchlist = z.infer<typeof watchlistSchema>;

export const newListSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Give the list a name (2+ characters).")
		.max(32, "Keep it under 32 characters."),
});
export type NewListInput = z.infer<typeof newListSchema>;
