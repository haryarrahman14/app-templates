import type { PointerEvent as ReactPointerEvent } from "react";
import type { AppId } from "@/lib/apps";
import { MENU_BAR_HEIGHT, useWindows, type WindowState } from "@/lib/window-store";

const isPhone = () => window.matchMedia("(max-width: 767px)").matches;

/** Tracks a pointer from down to up on window, calling `onMove` with the delta. */
function track(event: ReactPointerEvent, cursor: string, onMove: (dx: number, dy: number) => void) {
	const startX = event.clientX;
	const startY = event.clientY;
	const body = document.body;
	body.style.userSelect = "none";
	body.style.cursor = cursor;

	const move = (e: PointerEvent) => onMove(e.clientX - startX, e.clientY - startY);
	const up = () => {
		body.style.userSelect = "";
		body.style.cursor = "";
		window.removeEventListener("pointermove", move);
		window.removeEventListener("pointerup", up);
		window.removeEventListener("pointercancel", up);
	};
	window.addEventListener("pointermove", move);
	window.addEventListener("pointerup", up);
	window.addEventListener("pointercancel", up);
}

export type ResizeEdge = "right" | "bottom" | "corner";

/** Drag by the title bar and resize from the edges. Disabled on phones and when maximised. */
export function useWindowDrag(win: WindowState) {
	const { dispatch } = useWindows();
	const id: AppId = win.id;

	const onTitlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
		if (event.button !== 0 || win.maximized || isPhone()) return;
		if ((event.target as HTMLElement).closest("button")) return;
		event.preventDefault();
		const { x, y } = win;
		track(event, "grabbing", (dx, dy) => {
			const maxX = window.innerWidth - 120;
			const maxY = window.innerHeight - 80;
			dispatch({
				type: "move",
				id,
				x: Math.min(maxX, Math.max(120 - win.w, x + dx)),
				y: Math.min(maxY, Math.max(MENU_BAR_HEIGHT + 4, y + dy)),
			});
		});
	};

	const onResizePointerDown = (edge: ResizeEdge) => (event: ReactPointerEvent<HTMLElement>) => {
		if (event.button !== 0 || win.maximized || isPhone()) return;
		event.preventDefault();
		event.stopPropagation();
		const { w, h } = win;
		const cursor = edge === "right" ? "ew-resize" : edge === "bottom" ? "ns-resize" : "nwse-resize";
		track(event, cursor, (dx, dy) => {
			dispatch({
				type: "resize",
				id,
				w: edge === "bottom" ? w : Math.min(window.innerWidth - win.x - 8, w + dx),
				h: edge === "right" ? h : Math.min(window.innerHeight - win.y - 8, h + dy),
			});
		});
	};

	return { onTitlePointerDown, onResizePointerDown };
}
