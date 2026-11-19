import { type ReactNode, useCallback, useState } from "react";
import { Dock } from "@/components/layout/dock";
import { NAV_ITEMS, SETTINGS_ITEM } from "@/components/layout/nav-items";
import { SessionProvider } from "@/components/layout/session-context";
import { TopBar } from "@/components/layout/top-bar";
import { CommandPalette } from "@/features/search/components/command-palette";
import { usePaletteShortcut } from "@/features/search/hooks/use-palette-shortcut";
import type { Session } from "@/lib/session";

/** The signed-in frame: slim top bar, content column, floating dock and the ⌘K palette. */
export function AppShell({ session, children }: { session: Session; children: ReactNode }) {
	const [paletteOpen, setPaletteOpen] = useState(false);
	const openPalette = useCallback(() => setPaletteOpen(true), []);
	const togglePalette = useCallback(() => setPaletteOpen((open) => !open), []);
	usePaletteShortcut(togglePalette, openPalette);

	return (
		<SessionProvider session={session}>
			<div className="relative isolate min-h-dvh">
				<a
					href="#main"
					className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-background focus:px-3 focus:py-2"
				>
					Skip to content
				</a>
				<TopBar onSearch={openPalette} />
				<main id="main" className="mx-auto max-w-7xl px-4 pt-6 pb-32 sm:px-6 sm:pt-8 lg:px-8">
					{children}
				</main>
				<Dock onSearch={openPalette} />
				<CommandPalette
					open={paletteOpen}
					onOpenChange={setPaletteOpen}
					navItems={[...NAV_ITEMS, SETTINGS_ITEM]}
				/>
			</div>
		</SessionProvider>
	);
}
