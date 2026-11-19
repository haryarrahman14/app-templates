import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { renderApp } from "@/components/layout/app-registry";
import { profileQuery } from "@/features/about/api/queries";
import { DesktopSurface } from "@/features/desktop/components/desktop-surface";
import { Wallpaper } from "@/features/desktop/components/wallpaper";
import { Dock } from "@/features/dock/components/dock";
import { MenuBar } from "@/features/menu-bar/components/menu-bar";
import { notesQuery } from "@/features/notes/api/queries";
import { WindowLayer } from "@/features/windows/components/window-layer";
import type { AppId } from "@/lib/apps";
import { PreferencesProvider } from "@/lib/preferences";
import { useWindows, WindowsProvider } from "@/lib/window-store";

/** Keeps `?app=` and the window in front in step, both ways, so the address bar is always shareable. */
function useSyncSearchWithWindows(app: AppId | undefined) {
	const { state, focusedId, open } = useWindows();
	// The store applies the deep link itself on hydration; until then the windows don't reflect `?app=` yet.
	const { hydrated } = state;
	const navigate = useNavigate();
	const latest = useRef({ focusedId, open });
	latest.current = { focusedId, open };

	// URL → windows: a link to /?app=notes opens Notes.
	useEffect(() => {
		if (hydrated && app && latest.current.focusedId !== app) latest.current.open(app);
	}, [app, hydrated]);

	// Windows → URL.
	// biome-ignore lint/correctness/useExhaustiveDependencies: only react to focus changes; `app` is read to skip no-op navigations
	useEffect(() => {
		if (!hydrated) return;
		const next = focusedId && focusedId !== "home" ? focusedId : undefined;
		if (next === app) return;
		navigate({ to: "/", search: next ? { app: next } : {}, replace: true, resetScroll: false });
	}, [focusedId, hydrated]);
}

function Desktop({ app }: { app: AppId | undefined }) {
	const { data: profile } = useSuspenseQuery(profileQuery);
	const { data: notes } = useSuspenseQuery(notesQuery);
	useSyncSearchWithWindows(app);

	const latestNote = [...notes].sort((a, b) => b.date.localeCompare(a.date))[0];

	return (
		<div className="relative h-dvh overflow-hidden">
			<Wallpaper />
			<MenuBar ownerName={profile.name} email={profile.email} />
			<DesktopSurface
				location={profile.location}
				timeZone={profile.timeZone}
				latestNote={latestNote}
			/>
			<WindowLayer renderApp={(id) => renderApp(id, profile)} />
			<Dock />
		</div>
	);
}

/** The whole site: one route, one desktop. */
export function DesktopPage() {
	const { app } = useSearch({ from: "/" });
	return (
		<PreferencesProvider>
			<WindowsProvider initialApp={app}>
				<Desktop app={app} />
			</WindowsProvider>
		</PreferencesProvider>
	);
}
