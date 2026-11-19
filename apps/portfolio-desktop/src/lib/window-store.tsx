import {
	createContext,
	type Dispatch,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useReducer,
} from "react";
import { APPS, type AppId } from "@/lib/apps";

export type WindowState = {
	id: AppId;
	x: number;
	y: number;
	w: number;
	h: number;
	minimized: boolean;
	maximized: boolean;
};

export type WindowsState = {
	windows: Partial<Record<AppId, WindowState>>;
	/** Back to front. The last visible entry is the focused window. */
	order: AppId[];
	/** False until the first client render has been hydrated and the deep link applied. */
	hydrated: boolean;
};

type Action =
	| { type: "open"; id: AppId; geometry: Pick<WindowState, "x" | "y" | "w" | "h"> }
	| { type: "focus"; id: AppId }
	| { type: "close"; id: AppId }
	| { type: "minimize"; id: AppId }
	| { type: "toggleMaximize"; id: AppId }
	| { type: "move"; id: AppId; x: number; y: number }
	| { type: "resize"; id: AppId; w: number; h: number }
	| { type: "hydrate"; app?: AppId; vw: number; vh: number };

export const MENU_BAR_HEIGHT = 32;
export const MIN_SIZE = { w: 360, h: 260 };

const toFront = (order: AppId[], id: AppId) => [...order.filter((item) => item !== id), id];

function patch(state: WindowsState, id: AppId, change: Partial<WindowState>): WindowsState {
	const current = state.windows[id];
	if (!current) return state;
	return { ...state, windows: { ...state.windows, [id]: { ...current, ...change } } };
}

function reducer(state: WindowsState, action: Action): WindowsState {
	switch (action.type) {
		case "open": {
			const existing = state.windows[action.id];
			const window: WindowState = existing
				? { ...existing, minimized: false }
				: { id: action.id, ...action.geometry, minimized: false, maximized: false };
			return {
				...state,
				windows: { ...state.windows, [action.id]: window },
				order: toFront(state.order, action.id),
			};
		}
		case "focus":
			if (!state.windows[action.id] || state.order.at(-1) === action.id) return state;
			return { ...state, order: toFront(state.order, action.id) };
		case "close": {
			const { [action.id]: _closed, ...windows } = state.windows;
			return { ...state, windows, order: state.order.filter((item) => item !== action.id) };
		}
		case "minimize": {
			const next = patch(state, action.id, { minimized: true });
			// Send it to the back so the next visible window takes focus.
			return { ...next, order: [action.id, ...next.order.filter((item) => item !== action.id)] };
		}
		case "toggleMaximize": {
			const current = state.windows[action.id];
			if (!current) return state;
			return {
				...patch(state, action.id, { maximized: !current.maximized }),
				order: toFront(state.order, action.id),
			};
		}
		case "move":
			return patch(state, action.id, { x: action.x, y: action.y });
		case "hydrate": {
			if (state.hydrated) return state;
			// The page is prerendered once without search params, so the deep-linked window is only added now,
			// at the spot it had when it was server-rendered.
			let next = state;
			if (action.app && action.app !== "home" && !state.windows[action.app]) {
				const geometry = initialGeometry(action.app, 1);
				next = reducer(state, { type: "open", id: action.app, geometry });
			}
			// Pull server-placed windows inside the real viewport.
			const windows: WindowsState["windows"] = {};
			for (const win of Object.values(next.windows)) {
				const w = Math.min(win.w, action.vw - 32);
				const h = Math.min(win.h, action.vh - MENU_BAR_HEIGHT - 120);
				windows[win.id] = {
					...win,
					w,
					h,
					x: Math.max(16, Math.min(win.x, action.vw - w - 16)),
					y: Math.max(MENU_BAR_HEIGHT + 8, Math.min(win.y, action.vh - h - 100)),
				};
			}
			return { ...next, windows, hydrated: true };
		}
		case "resize":
			return patch(state, action.id, {
				w: Math.max(MIN_SIZE.w, action.w),
				h: Math.max(MIN_SIZE.h, action.h),
			});
	}
}

/** Deterministic positions used on the server and for deep links (no viewport known yet). */
function initialGeometry(id: AppId, index: number) {
	const { w, h } = APPS[id].size;
	return { x: 150 + index * 230, y: 60 + index * 90, w, h };
}

/** Centre-ish position for a window opened in the browser, cascading a little per open window. */
function placeWindow(id: AppId, openCount: number) {
	const { w: baseW, h: baseH } = APPS[id].size;
	const vw = window.innerWidth;
	const vh = window.innerHeight;
	const w = Math.min(baseW, vw - 48);
	const h = Math.min(baseH, vh - MENU_BAR_HEIGHT - 120);
	const cascade = (openCount % 5) * 28;
	return {
		w,
		h,
		x: Math.max(16, Math.round((vw - w) / 2) - 60 + cascade),
		y: Math.max(MENU_BAR_HEIGHT + 16, Math.round((vh - h) / 2) - 40 + cascade),
	};
}

/** Only Home: the static HTML never knows the search params, so the first client render must not use them either. */
export function createInitialState(): WindowsState {
	return {
		windows: {
			home: { id: "home", ...initialGeometry("home", 0), minimized: false, maximized: false },
		},
		order: ["home"],
		hydrated: false,
	};
}

type WindowsContextValue = {
	state: WindowsState;
	dispatch: Dispatch<Action>;
	focusedId: AppId | null;
	open: (id: AppId) => void;
	close: (id: AppId) => void;
	focus: (id: AppId) => void;
	minimize: (id: AppId) => void;
	toggleMaximize: (id: AppId) => void;
	/** Dock behaviour: open, restore, focus, or minimise when it is already in front. */
	activate: (id: AppId) => void;
};

const WindowsContext = createContext<WindowsContextValue | null>(null);

export function getFocusedId(state: WindowsState): AppId | null {
	for (let i = state.order.length - 1; i >= 0; i--) {
		const id = state.order[i];
		if (id && !state.windows[id]?.minimized) return id;
	}
	return null;
}

export function WindowsProvider({
	initialApp,
	children,
}: {
	initialApp?: AppId;
	children: ReactNode;
}) {
	const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
	const focusedId = getFocusedId(state);

	const value = useMemo<WindowsContextValue>(() => {
		const open = (id: AppId) =>
			dispatch({ type: "open", id, geometry: placeWindow(id, state.order.length) });
		return {
			state,
			dispatch,
			focusedId,
			open,
			close: (id) => dispatch({ type: "close", id }),
			focus: (id) => dispatch({ type: "focus", id }),
			minimize: (id) => dispatch({ type: "minimize", id }),
			toggleMaximize: (id) => dispatch({ type: "toggleMaximize", id }),
			activate: (id) => {
				if (focusedId === id) dispatch({ type: "minimize", id });
				else open(id);
			},
		};
	}, [state, focusedId]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: runs once after hydration; later `?app=` changes are handled by the page
	useEffect(() => {
		dispatch({ type: "hydrate", app: initialApp, vw: window.innerWidth, vh: window.innerHeight });
	}, []);

	// Escape closes the focused window, unless a menu, dialog or popover is handling it.
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Escape" || event.defaultPrevented || !focusedId) return;
			if (document.querySelector("[role=menu], [role=dialog][data-state=open], [role=listbox]"))
				return;
			dispatch({ type: "close", id: focusedId });
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [focusedId]);

	return <WindowsContext.Provider value={value}>{children}</WindowsContext.Provider>;
}

export function useWindows() {
	const value = useContext(WindowsContext);
	if (!value) throw new Error("useWindows must be used inside WindowsProvider");
	return value;
}
