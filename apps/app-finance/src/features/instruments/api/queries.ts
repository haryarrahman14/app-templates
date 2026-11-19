import { queryOptions } from "@tanstack/react-query";
import {
	barsSchema,
	instrumentSchema,
	positionSchema,
	quoteSchema,
	relatedSchema,
} from "@/features/instruments/schemas/instrument";
import { sampleDelay } from "@/lib/delay";
import { LIVE_TICK_MS, queryRoots } from "@/lib/query-keys";
import type { ChartRange } from "@/lib/ranges";
import { account } from "@/lib/sample-data/account-store";
import {
	barsForRange,
	currentTick,
	dailyBars,
	liveQuote,
	rangeBase,
	sparkline,
	yearRange,
} from "@/lib/sample-data/prices";
import { findInstrument, UNIVERSE } from "@/lib/sample-data/universe";

/*
 * Instrument detail. Replace each queryFn body with your market-data API; keep keys and schemas.
 * `instrumentQuery` resolves to null for an unknown symbol so the route can render not-found.
 */

export const instrumentQuery = (symbol: string) =>
	queryOptions({
		queryKey: [...queryRoots.market, "instrument", symbol],
		queryFn: async () => {
			await sampleDelay(240);
			const entry = findInstrument(symbol);
			if (!entry) return null;
			const year = yearRange(entry.symbol);
			const volumes = dailyBars(entry.symbol).slice(-30);
			return instrumentSchema.parse({
				...entry,
				yearLow: year.low,
				yearHigh: year.high,
				avgVolume: Math.round(volumes.reduce((s, b) => s + b.volume, 0) / volumes.length),
			});
		},
		staleTime: Number.POSITIVE_INFINITY,
	});

export const quoteQuery = (symbol: string) =>
	queryOptions({
		queryKey: [...queryRoots.quotes, symbol],
		queryFn: async () => {
			await sampleDelay(150);
			return quoteSchema.parse(liveQuote(symbol, currentTick(LIVE_TICK_MS)));
		},
		refetchInterval: LIVE_TICK_MS,
	});

export const barsQuery = (symbol: string, range: ChartRange) =>
	queryOptions({
		queryKey: [...queryRoots.market, "bars", symbol, range],
		queryFn: async () => {
			await sampleDelay(280);
			return barsSchema.parse({
				range,
				base: rangeBase(symbol, range),
				bars: barsForRange(symbol, range),
			});
		},
		staleTime: 5 * 60_000,
	});

export const relatedQuery = (symbol: string) =>
	queryOptions({
		queryKey: [...queryRoots.quotes, "related", symbol],
		queryFn: async () => {
			await sampleDelay(220);
			const entry = findInstrument(symbol);
			const tick = currentTick(LIVE_TICK_MS);
			const peers = UNIVERSE.filter((e) => e.sector === entry?.sector && e.symbol !== symbol);
			const others = UNIVERSE.filter((e) => e.sector !== entry?.sector)
				.sort(
					(a, b) => Math.abs(a.beta - (entry?.beta ?? 1)) - Math.abs(b.beta - (entry?.beta ?? 1)),
				)
				.slice(0, Math.max(0, 5 - peers.length));
			return relatedSchema.array().parse(
				[...peers, ...others].slice(0, 5).map((e) => {
					const q = liveQuote(e.symbol, tick);
					return {
						symbol: e.symbol,
						name: e.name,
						price: q.price,
						changePct: q.changePct,
						spark: sparkline(e.symbol, 30),
					};
				}),
			);
		},
		refetchInterval: LIVE_TICK_MS * 2,
	});

/** The signed-in user's position, cash and list membership for this symbol (browser-side). */
export const positionQuery = (symbol: string) =>
	queryOptions({
		queryKey: [...queryRoots.account, "position", symbol],
		queryFn: async () => {
			await sampleDelay(200);
			const s = account();
			const holding = s.holdings.find((h) => h.symbol === symbol);
			return positionSchema.parse({
				quantity: holding?.quantity ?? 0,
				avgCost: holding?.avgCost ?? 0,
				cash: s.cash,
				watchlists: s.watchlists.map((w) => ({
					id: w.id,
					name: w.name,
					contains: w.symbols.includes(symbol),
				})),
				alerts: s.alerts.filter((a) => a.symbol === symbol).length,
			});
		},
	});
