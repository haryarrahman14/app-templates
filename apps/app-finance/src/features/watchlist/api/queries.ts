import { queryOptions } from "@tanstack/react-query";
import { watchlistSchema } from "@/features/watchlist/schemas/watchlist";
import { sampleDelay } from "@/lib/delay";
import { LIVE_TICK_MS, queryRoots } from "@/lib/query-keys";
import { account } from "@/lib/sample-data/account-store";
import { currentTick, liveQuote, sparkline } from "@/lib/sample-data/prices";
import { findInstrument, UNIVERSE } from "@/lib/sample-data/universe";

/** The user's watchlists with live sample quotes (browser-side account data). */
export const watchlistsQuery = queryOptions({
	queryKey: [...queryRoots.watchlists],
	queryFn: async () => {
		await sampleDelay(300);
		const tick = currentTick(LIVE_TICK_MS);
		return watchlistSchema.array().parse(
			account().watchlists.map((list) => ({
				id: list.id,
				name: list.name,
				rows: list.symbols.map((symbol) => {
					const q = liveQuote(symbol, tick);
					return {
						symbol,
						name: findInstrument(symbol)?.name ?? symbol,
						price: q.price,
						change: q.change,
						changePct: q.changePct,
						spark: sparkline(symbol, 30),
					};
				}),
			})),
		);
	},
	refetchInterval: LIVE_TICK_MS,
});

export const watchCandidates = UNIVERSE.map((e) => ({
	symbol: e.symbol,
	name: e.name,
	sector: e.sector,
}));
