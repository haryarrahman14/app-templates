import type { AppId } from "@/lib/apps";
import type { SplitRatio, StageSearch } from "@/lib/stage-search";

export type Side = "left" | "right";
export type Pane = { app: AppId; id?: string };
export type StageLayout = { left?: Pane; right?: Pane; ratio: SplitRatio };

export const RATIOS: SplitRatio[] = [30, 50, 70];

export const otherSide = (side: Side): Side => (side === "left" ? "right" : "left");

/** URL → layout. On phones the split pane is ignored (one app at a time). */
export function fromSearch(search: StageSearch, isPhone: boolean): StageLayout {
	const left = search.app ? { app: search.app, id: search.id } : undefined;
	const right =
		!isPhone && left && search.split && search.split !== left.app
			? { app: search.split, id: search.sid }
			: undefined;
	return { left, right, ratio: search.ratio ?? 50 };
}

/** Layout → URL. A lone right pane moves left; the default ratio is left out of the URL. */
export function toSearch(layout: StageLayout): StageSearch {
	const left = layout.left ?? layout.right;
	const right = layout.left ? layout.right : undefined;
	return {
		app: left?.app,
		id: left?.id,
		split: right?.app,
		sid: right?.id,
		ratio: right && layout.ratio !== 50 ? layout.ratio : undefined,
	};
}

export function nearestRatio(percent: number): SplitRatio {
	return RATIOS.reduce((best, r) => (Math.abs(r - percent) < Math.abs(best - percent) ? r : best));
}
