import { useSyncExternalStore } from "react";
import type { RecordType } from "@/lib/records";

/**
 * Tiny global UI state shared by the shell and features (command palette, composer, dialogs).
 * A plain external store; no extra dependency.
 */
export type CreateKind = RecordType | "task" | "list" | "invite";

export type UiState = {
	commandOpen: boolean;
	composer: { open: boolean; minimized: boolean; to: string[]; subject: string };
	create: { kind: CreateKind; defaults?: Record<string, string> } | null;
	onboardingOpen: boolean;
	importOpen: boolean;
	shortcutsOpen: boolean;
};

let state: UiState = {
	commandOpen: false,
	composer: { open: false, minimized: false, to: [], subject: "" },
	create: null,
	onboardingOpen: false,
	importOpen: false,
	shortcutsOpen: false,
};

const listeners = new Set<() => void>();

export function setUi(update: Partial<UiState> | ((current: UiState) => Partial<UiState>)) {
	const patch = typeof update === "function" ? update(state) : update;
	state = { ...state, ...patch };
	for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

export function useUi<T>(selector: (current: UiState) => T): T {
	return useSyncExternalStore(subscribe, () => selector(state));
}

export const openComposer = (to: string[] = [], subject = "") =>
	setUi({ composer: { open: true, minimized: false, to, subject } });

export const openCreate = (kind: CreateKind, defaults?: Record<string, string>) =>
	setUi({ create: { kind, defaults } });
