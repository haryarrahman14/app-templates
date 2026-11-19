import type { Deal, DealStage } from "@/features/deals/schemas/deal";

export const byRank = (a: Deal, b: Deal) => a.rank - b.rank;

/** Deals of a stage in board order. */
export const dealsIn = (deals: Deal[], stage: DealStage) =>
	deals.filter((deal) => deal.stage === stage).sort(byRank);

/**
 * Rank for a card dropped at `index` of a column (the column without the dragged card).
 * Midpoint between neighbours, so only the moved deal changes.
 */
export function rankAt(column: Deal[], index: number) {
	const before = column[index - 1];
	const after = column[index];
	if (before && after) return (before.rank + after.rank) / 2;
	if (before) return before.rank + 1;
	if (after) return after.rank - 1;
	return 0;
}
