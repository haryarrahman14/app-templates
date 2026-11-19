import { z } from "zod";
import { chartRangeSchema } from "@/lib/ranges";

export const portfolioSummarySchema = z.object({
	value: z.number(),
	invested: z.number(),
	cash: z.number(),
	dayChange: z.number(),
	dayChangePct: z.number(),
	totalPnl: z.number(),
	totalPnlPct: z.number(),
});
export type PortfolioSummary = z.infer<typeof portfolioSummarySchema>;

export const portfolioHistorySchema = z.object({
	range: chartRangeSchema,
	base: z.number(),
	points: z.array(z.object({ t: z.number(), value: z.number() })),
});
export type PortfolioHistory = z.infer<typeof portfolioHistorySchema>;

export const allocationRowSchema = z.object({
	sector: z.string(),
	value: z.number(),
	weight: z.number(),
	changePct: z.number(),
	count: z.number(),
});
export type AllocationRow = z.infer<typeof allocationRowSchema>;

export const briefSchema = z.object({
	headline: z.string(),
	body: z.string(),
	points: z.array(z.string()),
});
export type Brief = z.infer<typeof briefSchema>;

export const newsItemSchema = z.object({
	id: z.string(),
	minutesAgo: z.number(),
	source: z.string(),
	symbols: z.array(z.string()),
	title: z.string(),
	summary: z.string(),
});
export type NewsItem = z.infer<typeof newsItemSchema>;

export const moverSchema = z.object({
	symbol: z.string(),
	name: z.string(),
	price: z.number(),
	changePct: z.number(),
	spark: z.array(z.number()),
});
export type Mover = z.infer<typeof moverSchema>;

export const eventSchema = z.object({
	id: z.string(),
	date: z.number(),
	symbol: z.string(),
	kind: z.enum(["earnings", "dividend", "meeting"]),
	label: z.string(),
});
export type MarketEvent = z.infer<typeof eventSchema>;
