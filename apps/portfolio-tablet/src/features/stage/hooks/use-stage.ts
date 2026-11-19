import { useSyncExternalStore } from "react";
import {
	fromSearch,
	otherSide,
	type Side,
	type StageLayout,
	toSearch,
} from "@/features/stage/utils/stage-model";
import type { AppId } from "@/lib/apps";
import type { SplitRatio, StageSearch } from "@/lib/stage-search";

export type StageNavigate = (search: StageSearch, options?: { replace?: boolean }) => void;

/**
 * Stage state lives in the URL (shareable, and browser Back closes what was just opened).
 * Opening pushes a history entry; selecting inside an app replaces it.
 */
export function useStage(search: StageSearch, navigate: StageNavigate, isPhone: boolean) {
	const layout = fromSearch(search, isPhone);
	const commit = (next: StageLayout, replace = false) => navigate(toSearch(next), { replace });

	const sideOf = (app: AppId): Side | undefined =>
		layout.left?.app === app ? "left" : layout.right?.app === app ? "right" : undefined;

	/** From the home screen, dock or switcher: full screen, or focus it if it is already on screen. */
	const open = (app: AppId, id?: string) => {
		const side = sideOf(app);
		if (side) {
			if (id !== undefined) commit({ ...layout, [side]: { app, id } });
			return;
		}
		commit({ left: { app, id }, ratio: layout.ratio });
	};

	return {
		layout,
		visible: [layout.left?.app, layout.right?.app].filter((a): a is AppId => a !== undefined),

		open,

		/** From inside a pane: open next to it (split), or full screen on phones. */
		openBeside(from: Side, app: AppId, id?: string) {
			if (isPhone || !layout[from]) return open(app, id);
			const side = sideOf(app) ?? otherSide(from);
			commit({ ...layout, [side]: { app, id } });
		},

		close(side: Side) {
			commit({ ...layout, [side]: undefined });
		},

		fullscreen(side: Side) {
			commit({ left: layout[side], ratio: layout.ratio });
		},

		/** Put the pane on `side` at `target`; its partner is the other pane, or `partner` if given. */
		place(side: Side, target: Side, partner?: AppId) {
			const pane = layout[side];
			if (!pane) return;
			const other = partner ? { app: partner } : layout[otherSide(side)];
			if (!other || other.app === pane.app) return;
			commit(
				target === "left"
					? { left: pane, right: other, ratio: layout.ratio }
					: { left: other, right: pane, ratio: layout.ratio },
			);
		},

		setItem(side: Side, id: string | undefined) {
			const pane = layout[side];
			if (pane) commit({ ...layout, [side]: { ...pane, id } }, true);
		},

		setRatio(ratio: SplitRatio) {
			commit({ ...layout, ratio }, true);
		},

		home() {
			if (layout.left || layout.right) navigate({});
		},
	};
}

export type Stage = ReturnType<typeof useStage>;

/* Apps opened this session, most recent first. Feeds the switcher and the dock's recent section. */
let opened: AppId[] = [];
const listeners = new Set<() => void>();
const EMPTY: AppId[] = [];

function emit() {
	for (const l of listeners) l();
}

export const openedApps = {
	touch(apps: AppId[]) {
		const next = [...apps, ...opened.filter((a) => !apps.includes(a))];
		if (next.join() !== opened.join()) {
			opened = next;
			emit();
		}
	},
	remove(app: AppId) {
		opened = opened.filter((a) => a !== app);
		emit();
	},
};

export function useOpenedApps() {
	return useSyncExternalStore(
		(l) => {
			listeners.add(l);
			return () => listeners.delete(l);
		},
		() => opened,
		() => EMPTY,
	);
}
