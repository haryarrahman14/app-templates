import { queryOptions } from "@tanstack/react-query";
import {
	allocationRowSchema,
	briefSchema,
	eventSchema,
	moverSchema,
	newsItemSchema,
	portfolioHistorySchema,
	portfolioSummarySchema,
} from "@/features/overview/schemas/overview";
import { sampleDelay } from "@/lib/delay";
import { LIVE_TICK_MS, queryRoots } from "@/lib/query-keys";
import type { ChartRange } from "@/lib/ranges";
import { account } from "@/lib/sample-data/account-store";
import { SAMPLE_BRIEF, SAMPLE_EVENTS, SAMPLE_NEWS } from "@/lib/sample-data/news";
import { currentTick, liveQuote, sparkline } from "@/lib/sample-data/prices";
import { round } from "@/lib/sample-data/random";
import { UNIVERSE } from "@/lib/sample-data/universe";
import {
	portfolioSeries,
	sectorAllocation,
	sectorMoves,
	valueHoldings,
} from "@/lib/sample-data/valuation";

/*
 * Overview data. Every queryFn below reads in-memory sample data; replace the body with a fetch to your
 * API and keep the key and schema. The route loader (routes/_app/index.tsx) warms the market-wide queries
 * before the page renders.
 */

export const portfolioSummaryQuery = queryOptions({
	queryKey: [...queryRoots.portfolio, "summary"],
	queryFn: async () => {
		await sampleDelay(260);
		const { holdings, cash } = account();
		const valued = valueHoldings(holdings, currentTick(LIVE_TICK_MS));
		const invested = valued.reduce((sum, h) => sum + h.value, 0);
		const cost = valued.reduce((sum, h) => sum + h.cost, 0);
		const dayChange = valued.reduce((sum, h) => sum + h.dayChange, 0);
		const value = invested + cash;
		return portfolioSummarySchema.parse({
			value: round(value),
			invested: round(invested),
			cash,
			dayChange: round(dayChange),
			dayChangePct: round((dayChange / (value - dayChange)) * 100),
			totalPnl: round(invested - cost),
			totalPnlPct: round(((invested - cost) / cost) * 100),
		});
	},
	refetchInterval: LIVE_TICK_MS,
});

export const portfolioHistoryQuery = (range: ChartRange) =>
	queryOptions({
		queryKey: [...queryRoots.portfolio, "history", range],
		queryFn: async () => {
			await sampleDelay(340);
			const { holdings, cash } = account();
			const { points, base } = portfolioSeries(holdings, cash, range);
			return portfolioHistorySchema.parse({ range, base, points });
		},
	});

export const allocationQuery = queryOptions({
	queryKey: [...queryRoots.portfolio, "allocation"],
	queryFn: async () => {
		await sampleDelay(300);
		return allocationRowSchema
			.array()
			.parse(sectorAllocation(account().holdings, currentTick(LIVE_TICK_MS)));
	},
	refetchInterval: LIVE_TICK_MS * 2,
});

/** A short written brief derived from today's sample moves and the account (swap for your writer/API). */
export const briefQuery = queryOptions({
	queryKey: [...queryRoots.account, "brief"],
	queryFn: async () => {
		await sampleDelay(200);
		const tick = currentTick(LIVE_TICK_MS);
		const moves = sectorMoves(tick).sort((a, b) => b.changePct - a.changePct);
		const [first, second] = moves;
		const last = moves[moves.length - 1];
		const { holdings, alerts } = account();
		const allocation = sectorAllocation(holdings, tick);
		const top = allocation[0];
		const near = alerts.filter((a) => {
			const price = liveQuote(a.symbol, tick).price;
			return a.enabled && Math.abs((a.price - price) / price) <= 0.05;
		}).length;
		const held = new Set(holdings.map((h) => h.symbol));
		const reporting = SAMPLE_EVENTS.filter(
			(e) => e.kind === "earnings" && held.has(e.symbol),
		).length;
		const word = (n: number) => (n >= 0 ? "rose" : "fell");
		return briefSchema.parse({
			headline: `${first?.sector} and ${second?.sector} led the session; ${last?.sector.toLowerCase()} lagged.`,
			body: `${first?.sector} ${word(first?.changePct ?? 0)} ${Math.abs(first?.changePct ?? 0).toFixed(2)}% on a cap-weighted basis, with ${first?.leader.symbol} the biggest mover in the group. ${last?.sector} ${word(last?.changePct ?? 0)} ${Math.abs(last?.changePct ?? 0).toFixed(2)}%, led by ${last?.leader.symbol}. ${SAMPLE_BRIEF.body}`,
			points: [
				top
					? `${top.sector} is your largest sector at ${top.weight.toFixed(0)}% of holdings.`
					: "You have no holdings yet.",
				`${near} of your active alerts ${near === 1 ? "is" : "are"} within 5% of the target price.`,
				`${reporting} ${reporting === 1 ? "company" : "companies"} you hold report results in the next two weeks.`,
			],
		});
	},
	refetchInterval: LIVE_TICK_MS * 6,
});

export const newsQuery = queryOptions({
	queryKey: [...queryRoots.market, "news"],
	queryFn: async () => {
		await sampleDelay(240);
		return newsItemSchema.array().parse(SAMPLE_NEWS);
	},
});

export const eventsQuery = queryOptions({
	queryKey: [...queryRoots.market, "events"],
	queryFn: async () => {
		await sampleDelay(200);
		return eventSchema.array().parse(SAMPLE_EVENTS);
	},
});

export const moversQuery = queryOptions({
	queryKey: [...queryRoots.quotes, "movers"],
	queryFn: async () => {
		await sampleDelay(220);
		const tick = currentTick(LIVE_TICK_MS);
		const rows = UNIVERSE.map((entry) => {
			const quote = liveQuote(entry.symbol, tick);
			return {
				symbol: entry.symbol,
				name: entry.name,
				price: quote.price,
				changePct: quote.changePct,
				spark: sparkline(entry.symbol, 20),
			};
		}).sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct));
		return moverSchema.array().parse(rows.slice(0, 5));
	},
	refetchInterval: LIVE_TICK_MS,
});
