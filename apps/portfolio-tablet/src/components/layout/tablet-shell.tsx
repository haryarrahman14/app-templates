import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, useHydrated } from "@tanstack/react-router";
import { MotionConfig } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { APP_VIEWS } from "@/components/layout/app-registry";
import { useHomeWidgets } from "@/components/layout/home-widgets";
import { StatusBar } from "@/components/layout/status-bar";
import { Dock } from "@/features/dock/components/dock";
import { AppGrid } from "@/features/home/components/app-grid";
import { WidgetGrid } from "@/features/home/components/widget-grid";
import { projectsQuery } from "@/features/projects/api/queries";
import { AppSwitcher } from "@/features/stage/components/app-switcher";
import { StageView } from "@/features/stage/components/stage";
import { openedApps, useOpenedApps, useStage } from "@/features/stage/hooks/use-stage";
import { APPS, type AppId, DOCK_APPS } from "@/lib/apps";
import { useApplyPreferences } from "@/lib/preferences";
import { PRERENDERED } from "@/lib/site";
import type { StageSearch } from "@/lib/stage-search";
import { PHONE_QUERY, useMediaQuery } from "@/lib/use-media-query";

const route = getRouteApi("/");

/** Shown in the dock's recent section until the visitor has opened apps of their own. */
const SUGGESTED_RECENT: AppId[] = ["gallery", "experience", "settings"];

/** What the prerendered HTML was made for: bare `/`, home screen, nothing open. */
const PRERENDERED_SEARCH: StageSearch = {};

/** The whole tablet: wallpaper, status bar, widget home, app stage, dock and switcher. */
export function TabletShell() {
	const urlSearch = route.useSearch();
	const hydrated = useHydrated();
	// The static HTML has no search params: hydrate as the home screen, open the linked apps right after.
	const deferSearch = PRERENDERED && !hydrated;
	const search = deferSearch ? PRERENDERED_SEARCH : urlSearch;
	const navigate = route.useNavigate();
	const isPhone = useMediaQuery(PHONE_QUERY);
	const preferences = useApplyPreferences();
	const stage = useStage(
		search,
		(next, options) => navigate({ search: next, replace: options?.replace, resetScroll: false }),
		isPhone,
	);
	const opened = useOpenedApps();
	const [editing, setEditing] = useState(false);
	const [switcherOpen, setSwitcherOpen] = useState(false);
	const widgets = useHomeWidgets(stage.open);
	const appOpen = stage.visible.length > 0;
	const visibleKey = stage.visible.join(",");

	// Remember what was opened, for the switcher and the dock's recent apps.
	useEffect(() => {
		if (visibleKey) openedApps.touch(visibleKey.split(",") as AppId[]);
	}, [visibleKey]);

	// Leaving the home screen ends edit mode.
	useEffect(() => {
		if (appOpen) setEditing(false);
	}, [appOpen]);

	const home = stage.home;
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement | null;
			const typing = target?.closest("input, textarea, select, [contenteditable='true']");
			if (e.key === "`" && !typing && !e.metaKey && !e.ctrlKey) {
				e.preventDefault();
				setSwitcherOpen((o) => !o);
			}
			if (
				e.key === "Escape" &&
				!e.defaultPrevented &&
				!document.querySelector("[role='dialog'], [role='menu']")
			) {
				home();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [home]);

	const closeSwitcher = useCallback((open: boolean) => setSwitcherOpen(open), []);

	const recent = [...opened.filter((a) => !DOCK_APPS.includes(a)), ...SUGGESTED_RECENT]
		.filter((a, i, all) => !DOCK_APPS.includes(a) && all.indexOf(a) === i)
		.slice(0, 3);

	const reducedMotion =
		preferences.reduceMotion === "on"
			? "always"
			: preferences.reduceMotion === "off"
				? "never"
				: "user";

	return (
		<MotionConfig reducedMotion={reducedMotion}>
			<div className="wallpaper min-h-dvh">
				<StatusBar
					showCustomize={!appOpen}
					editing={editing}
					onCustomize={() => setEditing((e) => !e)}
					onSwitcher={() => setSwitcherOpen(true)}
				/>

				<main
					inert={appOpen || undefined}
					className="mx-auto w-full max-w-[1320px] px-4 pt-14 pb-32 md:px-8 md:pt-16 md:pb-36 xl:px-10"
				>
					<WidgetGrid widgets={widgets} editing={editing} onEditingChange={setEditing} />
					<AppGrid apps={Object.values(APPS)} onOpen={(id) => stage.open(id)} />
					<SelectedWork />
				</main>

				<StageView
					// A new key once the linked apps arrive, so they appear as already open (no entrance animation).
					key={deferSearch ? "prerendered" : "live"}
					stage={stage}
					isPhone={isPhone}
					renderApp={(app, props) => {
						const View = APP_VIEWS[app];
						return <View {...props} />;
					}}
				/>

				<Dock
					pinned={DOCK_APPS.map((id) => APPS[id])}
					recent={recent.map((id) => APPS[id])}
					active={stage.visible}
					onOpen={(id) => stage.open(id)}
				/>

				<AppSwitcher
					open={switcherOpen}
					apps={opened}
					visible={stage.visible}
					onOpenChange={closeSwitcher}
					onSelect={(id) => {
						setSwitcherOpen(false);
						if (!stage.visible.includes(id)) stage.open(id);
					}}
					onRemove={(id) => {
						openedApps.remove(id);
						if (stage.layout.left?.app === id) stage.close("left");
						else if (stage.layout.right?.app === id) stage.close("right");
					}}
					onHome={() => {
						setSwitcherOpen(false);
						stage.home();
					}}
				/>
			</div>
		</MotionConfig>
	);
}

/** Server-rendered project list for search engines and screen readers; visually hidden. */
function SelectedWork() {
	const { data: projects } = useSuspenseQuery(projectsQuery);
	return (
		<section className="sr-only" aria-label="Selected work">
			<h2>Selected work</h2>
			<ul>
				{projects.map((p) => (
					<li key={p.slug}>
						<a href={`/?app=projects&id=${p.slug}`}>{p.title}</a>: {p.summary}
					</li>
				))}
			</ul>
		</section>
	);
}
