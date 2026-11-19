import { queryOptions } from "@tanstack/react-query";
import { searchEntrySchema } from "@/features/search/schemas/search";
import { sampleDelay } from "@/lib/delay";
import { LIVE_TICK_MS, queryRoots } from "@/lib/query-keys";
import { currentTick, liveQuote } from "@/lib/sample-data/prices";
import { UNIVERSE } from "@/lib/sample-data/universe";

/** Instrument search index for the command palette. Swap for your search endpoint. */
async function listSearchEntries() {
	await sampleDelay(200);
	const tick = currentTick(LIVE_TICK_MS);
	return searchEntrySchema.array().parse(
		UNIVERSE.map((entry) => {
			const quote = liveQuote(entry.symbol, tick);
			return {
				symbol: entry.symbol,
				name: entry.name,
				sector: entry.sector,
				price: quote.price,
				changePct: quote.changePct,
			};
		}),
	);
}

export const searchIndexQuery = queryOptions({
	queryKey: [...queryRoots.market, "search-index"],
	queryFn: listSearchEntries,
	staleTime: LIVE_TICK_MS,
});
