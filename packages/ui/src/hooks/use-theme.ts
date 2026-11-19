"use client";

import { useSyncExternalStore } from "react";
import {
	type ResolvedTheme,
	readTheme,
	resolveTheme,
	setTheme,
	subscribeTheme,
	type Theme,
} from "#lib/theme";

const getSnapshot = () => {
	const theme = readTheme();
	return `${theme}:${resolveTheme(theme)}`;
};

/** `theme` and `resolvedTheme` are undefined during SSR and hydration; render a neutral control then. */
export function useTheme(): {
	theme: Theme | undefined;
	resolvedTheme: ResolvedTheme | undefined;
	setTheme: (theme: Theme) => void;
} {
	const snapshot = useSyncExternalStore(subscribeTheme, getSnapshot, () => "");
	const [theme, resolvedTheme] = snapshot ? snapshot.split(":") : [];
	return {
		theme: theme as Theme | undefined,
		resolvedTheme: resolvedTheme as ResolvedTheme | undefined,
		setTheme,
	};
}
