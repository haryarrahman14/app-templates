import { z } from "zod";
import { chartRangeSchema } from "@/lib/ranges";

export const instrumentSchema = z.object({
	symbol: z.string(),
	name: z.string(),
	sector: z.string(),
	about: z.string(),
	hq: z.string(),
	founded: z.number(),
	employees: z.number(),
	capBn: z.number(),
	pe: z.number().nullable(),
	dividendYield: z.number(),
	beta: z.number(),
	yearLow: z.number(),
	yearHigh: z.number(),
	avgVolume: z.number(),
});
export type Instrument = z.infer<typeof instrumentSchema>;

export const quoteSchema = z.object({
	symbol: z.string(),
	price: z.number(),
	prevClose: z.number(),
	change: z.number(),
	changePct: z.number(),
	open: z.number(),
	high: z.number(),
	low: z.number(),
	volume: z.number(),
	tick: z.number(),
});
export type Quote = z.infer<typeof quoteSchema>;

export const barsSchema = z.object({
	range: chartRangeSchema,
	base: z.number(),
	bars: z.array(
		z.object({
			t: z.number(),
			open: z.number(),
			high: z.number(),
			low: z.number(),
			close: z.number(),
			volume: z.number(),
		}),
	),
});
export type Bars = z.infer<typeof barsSchema>;

export const relatedSchema = z.object({
	symbol: z.string(),
	name: z.string(),
	price: z.number(),
	changePct: z.number(),
	spark: z.array(z.number()),
});
export type Related = z.infer<typeof relatedSchema>;

export const positionSchema = z.object({
	quantity: z.number(),
	avgCost: z.number(),
	cash: z.number(),
	watchlists: z.array(z.object({ id: z.string(), name: z.string(), contains: z.boolean() })),
	alerts: z.number(),
});
export type Position = z.infer<typeof positionSchema>;
