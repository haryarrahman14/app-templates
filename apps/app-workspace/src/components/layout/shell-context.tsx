import { createContext, useContext } from "react";

/** Shell-level overlays any screen may open: command palette, shortcuts sheet, share dialog. */
export type ShellActions = {
	openPalette: () => void;
	openShortcuts: () => void;
	openShare: (doc?: { id: string; title: string }) => void;
};

export const ShellContext = createContext<ShellActions | null>(null);

export function useShell() {
	const shell = useContext(ShellContext);
	if (!shell) throw new Error("useShell must be used inside the app shell.");
	return shell;
}
