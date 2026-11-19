import { z } from "zod";
import { chartRangeSchema } from "@/lib/ranges";

export const holdingRowSchema = z.object({
	symbol: z.string(),
	name: z.string(),
	sector: z.string(),
	quantity: z.number(),
	avgCost: z.number(),
	price: z.number(),
	value: z.number(),
	cost: z.number(),
	dayChange: z.number(),
	dayChangePct: z.number(),
	pnl: z.number(),
	pnlPct: z.number(),
	weight: z.number(),
});
export type HoldingRow = z.infer<typeof holdingRowSchema>;

export const portfolioSchema = z.object({
	holdings: z.array(holdingRowSchema),
	cash: z.number(),
	invested: z.number(),
	total: z.number(),
	dayChange: z.number(),
	dayChangePct: z.number(),
	pnl: z.number(),
	pnlPct: z.number(),
});
export type Portfolio = z.infer<typeof portfolioSchema>;

export const performanceSchema = z.object({
	range: chartRangeSchema,
	base: z.number(),
	points: z.array(z.object({ t: z.number(), value: z.number(), benchmark: z.number() })),
	benchmarkName: z.string(),
});
export type Performance = z.infer<typeof performanceSchema>;
