import { z } from "zod";

export const reportPeriodSchema = z.enum(["3", "6", "12"]);
export type ReportPeriod = z.infer<typeof reportPeriodSchema>;

export const reportSchema = z.object({
	period: reportPeriodSchema,
	months: z.array(
		z.object({
			month: z.number(),
			income: z.number(),
			spending: z.number(),
			net: z.number(),
			savingsRate: z.number(),
		}),
	),
	categories: z.array(
		z.object({ name: z.string(), amount: z.number(), share: z.number(), change: z.number() }),
	),
	incomeSources: z.array(z.object({ name: z.string(), amount: z.number(), share: z.number() })),
	totals: z.object({
		income: z.number(),
		spending: z.number(),
		net: z.number(),
		savingsRate: z.number(),
		incomeChange: z.number(),
		spendingChange: z.number(),
	}),
});
export type Report = z.infer<typeof reportSchema>;
