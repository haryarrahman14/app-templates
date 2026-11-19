import { useEffect } from "react";

/** Cmd/Ctrl+K toggles the command palette; "/" opens it when focus is not in a field. */
export function usePaletteShortcut(toggle: () => void, open: () => void) {
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				toggle();
				return;
			}
			const target = event.target as HTMLElement | null;
			const typing =
				target?.isContentEditable ||
				["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName ?? "");
			if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey) {
				event.preventDefault();
				open();
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [toggle, open]);
}
