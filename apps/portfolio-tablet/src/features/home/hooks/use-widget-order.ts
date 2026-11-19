import { useMemo } from "react";
import { widgetOrderSchema } from "@/features/home/schemas/widget-order";
import { createLocalStore, useLocalStore } from "@/lib/local-store";

const store = createLocalStore<string[]>("portfolio-tablet:widget-order", widgetOrderSchema, []);

/** Merge a saved order with the widgets that exist now: drop unknown ids, append new ones. */
function reconcile(saved: string[], ids: string[]) {
	const known = new Set(ids);
	const kept = saved.filter((id, i) => known.has(id) && saved.indexOf(id) === i);
	return [...kept, ...ids.filter((id) => !kept.includes(id))];
}

/** Widget order persisted in localStorage (zod-validated on read). */
export function useWidgetOrder(ids: string[]) {
	const saved = useLocalStore(store);
	const key = ids.join("|");
	// biome-ignore lint/correctness/useExhaustiveDependencies: `key` stands in for `ids`.
	const order = useMemo(() => reconcile(saved, ids), [saved, key]);
	return {
		order,
		save: (next: string[]) => store.write(next),
		reset: () => store.reset(),
		/** Only true when the saved order still changes something (it may name removed widgets only). */
		isCustom: order.join("|") !== key,
	};
}
