import { useSyncExternalStore } from "react";

/** Grid or list for document collections; shared by the top bar switch and the collection. */
export type CollectionView = "grid" | "list";

const KEY = "workspace-collection-view";
const listeners = new Set<() => void>();

function read(): CollectionView {
	try {
		return localStorage.getItem(KEY) === "list" ? "list" : "grid";
	} catch {
		return "grid";
	}
}

export function setCollectionView(view: CollectionView) {
	try {
		localStorage.setItem(KEY, view);
	} catch {}
	for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

export function useCollectionView() {
	return useSyncExternalStore(subscribe, read, () => "grid" as const);
}
