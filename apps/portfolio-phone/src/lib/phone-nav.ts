import { useNavigate, useRouter, useRouterState, useSearch } from "@tanstack/react-router";
import { useCallback, useEffect } from "react";
import { z } from "zod";
import { APP_IDS, type AppId } from "@/lib/apps";

/** `/?app=projects&id=penawaranku` — which app is open, and which item inside it. */
export const phoneSearchSchema = z.object({
	app: z.enum(APP_IDS).optional().catch(undefined),
	id: z
		.string()
		.regex(/^[a-z0-9-]{1,80}$/)
		.optional()
		.catch(undefined),
});

export type PhoneSearch = z.infer<typeof phoneSearchSchema>;

/** Where the last launch started, in % of the screen, so the app can zoom out of its icon. */
let launchOrigin = { x: 50, y: 70 };

export function setLaunchOrigin(element: Element | null) {
	const screen = element?.closest("[data-phone-screen]");
	if (!element || !screen) return;
	const icon = element.getBoundingClientRect();
	const box = screen.getBoundingClientRect();
	launchOrigin = {
		x: ((icon.left + icon.width / 2 - box.left) / box.width) * 100,
		y: ((icon.top + icon.height / 2 - box.top) / box.height) * 100,
	};
}

export function getLaunchOrigin() {
	return launchOrigin;
}

/** A shareable absolute link to an app (and item). */
export function appHref(app: AppId, id?: string) {
	const params = new URLSearchParams({ app });
	if (id) params.set("id", id);
	const origin = typeof window === "undefined" ? "" : window.location.origin;
	return `${origin}/?${params.toString()}`;
}

/** Set when "home" walks back through history and may land on a deep-linked app entry. */
let pendingHome = false;

/** How many in-phone history steps the current entry is above the home screen's entry. */
function depth(router: ReturnType<typeof useRouter>) {
	const state = router.state.location.state as { phoneDepth?: number };
	return state.phoneDepth ?? 0;
}

/**
 * In-phone navigation on top of the URL. Every forward step is a real history entry that
 * remembers its depth, so the phone's back and the browser's back walk the same stack.
 */
export function usePhoneNav() {
	const search = useSearch({ from: "/" });
	const navigate = useNavigate({ from: "/" });
	const router = useRouter();

	const go = useCallback(
		(next: PhoneSearch, replace = false) => {
			// Depth counts steps since the home screen; landing on home resets it.
			const nextDepth = !next.app ? 0 : replace ? depth(router) : depth(router) + 1;
			return navigate({
				to: "/",
				search: next,
				replace,
				resetScroll: false,
				state: (prev) => {
					const state = { ...prev, phoneDepth: nextDepth };
					return state;
				},
			});
		},
		[navigate, router],
	);

	const open = useCallback((app: AppId, id?: string) => go({ app, id }), [go]);

	/** Show a sibling item without adding a history step (e.g. next photo in a lightbox). */
	const swap = useCallback(
		(id: string) => {
			if (search.app) go({ app: search.app, id }, true);
		},
		[go, search.app],
	);

	const back = useCallback(() => {
		if (!search.app) return;
		if (depth(router) > 0) {
			router.history.back();
			return;
		}
		go(search.id ? { app: search.app } : {}, true);
	}, [go, router, search.app, search.id]);

	const home = useCallback(() => {
		if (!search.app) return;
		const steps = depth(router);
		if (steps > 0) {
			pendingHome = true;
			router.history.go(-steps);
			return;
		}
		go({}, true);
	}, [go, router, search.app]);

	return { app: search.app, id: search.id, open, swap, back, home };
}

declare global {
	interface Window {
		/** The deep link `deepLinkScript` took off the URL, put back after hydration. */
		__phoneDeepLink?: string;
	}
}

/**
 * Inline in <head> on the static build only (empty otherwise). That build is one HTML file
 * rendered for bare `/`, so the router must also start at `/` to hydrate the same tree: this
 * moves `?app=…&id=…` aside before the app loads, and hides the lock screen when it opens an
 * app. `usePhoneNavSync` puts the link back right after hydration. Runs once per page load: a visit
 * that starts at bare `/` marks itself done too, or the router's re-inserted copy of this script would
 * take the first in-phone link with an id (a project's page) for a deep link and send it home.
 */
export const deepLinkScript =
	import.meta.env.VITE_STATIC_PAGE === true
		? `(()=>{try{var l=location;if("__phoneDeepLink" in window)return;if(!l.search){window.__phoneDeepLink="";return}var a=new URLSearchParams(l.search).get("app");window.__phoneDeepLink=l.pathname+l.search+l.hash;history.replaceState(history.state,"",l.pathname+l.hash);if(${JSON.stringify(APP_IDS)}.indexOf(a)>-1)document.documentElement.dataset.unlocked=""}catch(_){}})()`
		: "";

/**
 * Call once at the phone root. Restores a deep link the static page set aside, and finishes a
 * "home" that walked back to a page opened by a deep link (that entry is an app, not the home
 * screen) by replacing it with home.
 */
export function usePhoneNavSync() {
	const { app, home } = usePhoneNav();
	const router = useRouter();
	const href = useRouterState({ select: (state) => state.location.href });

	useEffect(() => {
		const deepLink = window.__phoneDeepLink;
		if (!deepLink) return;
		// Emptied, not deleted: the router re-inserts head scripts after hydration, and the
		// script only acts while the key is absent.
		window.__phoneDeepLink = "";
		router.navigate({ href: deepLink, replace: true, resetScroll: false });
	}, [router]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-check after every location change
	useEffect(() => {
		if (!pendingHome) return;
		pendingHome = false;
		if (app) home();
	}, [href]);
}
