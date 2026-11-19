import { queryOptions } from "@tanstack/react-query";
import { performanceSchema, portfolioSchema } from "@/features/portfolio/schemas/portfolio";
import { sampleDelay } from "@/lib/delay";
import { LIVE_TICK_MS, queryRoots } from "@/lib/query-keys";
import type { ChartRange } from "@/lib/ranges";
import { account } from "@/lib/sample-data/account-store";
import { currentTick } from "@/lib/sample-data/prices";
import { round } from "@/lib/sample-data/random";
import { BENCHMARK } from "@/lib/sample-data/universe";
import { benchmarkSeries, portfolioSeries, valueHoldings } from "@/lib/sample-data/valuation";

/** Holdings with live sample prices. Account data: read in the browser. Swap for your positions API. */
export const portfolioQuery = queryOptions({
	queryKey: [...queryRoots.portfolio, "holdings"],
	queryFn: async () => {
		await sampleDelay(320);
		const { holdings, cash } = account();
		const valued = valueHoldings(holdings, currentTick(LIVE_TICK_MS));
		const invested = valued.reduce((s, h) => s + h.value, 0);
		const cost = valued.reduce((s, h) => s + h.cost, 0);
		const dayChange = valued.reduce((s, h) => s + h.dayChange, 0);
		const total = invested + cash;
		return portfolioSchema.parse({
			holdings: valued
				.map((h) => ({ ...h, weight: round((h.value / (invested || 1)) * 100) }))
				.sort((a, b) => b.value - a.value),
			cash,
			invested: round(invested),
			total: round(total),
			dayChange: round(dayChange),
			dayChangePct: round((dayChange / (total - dayChange)) * 100),
			pnl: round(invested - cost),
			pnlPct: cost ? round(((invested - cost) / cost) * 100) : 0,
		});
	},
	refetchInterval: LIVE_TICK_MS,
});

export const performanceQuery = (range: ChartRange) =>
	queryOptions({
		queryKey: [...queryRoots.portfolio, "performance", range],
		queryFn: async () => {
			await sampleDelay(340);
			const { holdings, cash } = account();
			const { points, base } = portfolioSeries(holdings, cash, range);
			const bench = benchmarkSeries(range, base);
			const offset = bench.length - points.length;
			return performanceSchema.parse({
				range,
				base,
				benchmarkName: `${BENCHMARK.name} (${BENCHMARK.symbol})`,
				points: points.map((p, i) => ({ ...p, benchmark: bench[i + offset]?.value ?? base })),
			});
		},
	});
