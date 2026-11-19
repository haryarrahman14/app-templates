import { AnimatePresence } from "motion/react";
import type { ReactNode } from "react";
import { WindowFrame } from "@/features/windows/components/window-frame";
import type { AppId } from "@/lib/apps";
import { APP_IDS } from "@/lib/apps";
import { useWindows } from "@/lib/window-store";

/** Renders every open window. `renderApp` maps an app id to its content (see components/layout/app-registry.tsx). */
export function WindowLayer({ renderApp }: { renderApp: (id: AppId) => ReactNode }) {
	const { state, focusedId } = useWindows();

	return (
		// initial={false}: windows open on first load (SSR) appear without a fade, so their content is visible at once.
		<AnimatePresence initial={false}>
			{APP_IDS.map((id) => {
				const win = state.windows[id];
				if (!win) return null;
				return (
					<WindowFrame
						key={id}
						win={win}
						focused={focusedId === id}
						zIndex={10 + state.order.indexOf(id)}
					>
						{renderApp(id)}
					</WindowFrame>
				);
			})}
		</AnimatePresence>
	);
}
