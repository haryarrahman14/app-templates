import { z } from "zod";

export const chartRangeSchema = z.enum(["1D", "1W", "1M", "3M", "YTD", "1Y"]);
export type ChartRange = z.infer<typeof chartRangeSchema>;
export const CHART_RANGES = chartRangeSchema.options;

export const RANGE_LABEL: Record<ChartRange, string> = {
	"1D": "today",
	"1W": "past week",
	"1M": "past month",
	"3M": "past 3 months",
	YTD: "year to date",
	"1Y": "past year",
};
