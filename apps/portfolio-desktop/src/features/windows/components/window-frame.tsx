import { cn } from "@repo/ui/lib/cn";
import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { WindowControls } from "@/features/windows/components/window-controls";
import { useWindowDrag } from "@/features/windows/hooks/use-window-drag";
import { APPS } from "@/lib/apps";
import { useWindows, type WindowState } from "@/lib/window-store";

const EASE = [0.32, 0.72, 0, 1] as const;

/**
 * One desktop window. Desktop: positioned from CSS variables (SSR-safe), draggable and resizable.
 * Phone (<768px): a full-width sheet between the menu bar and the dock.
 */
export function WindowFrame({
	win,
	focused,
	zIndex,
	children,
}: {
	win: WindowState;
	focused: boolean;
	zIndex: number;
	children: ReactNode;
}) {
	const { close, focus, minimize, toggleMaximize } = useWindows();
	const { onTitlePointerDown, onResizePointerDown } = useWindowDrag(win);
	const app = APPS[win.id];

	const style = {
		zIndex,
		"--x": `${win.x}px`,
		"--y": `${win.y}px`,
		"--w": `${win.w}px`,
		"--h": `${win.h}px`,
	} as CSSProperties;

	return (
		<motion.section
			aria-label={`${app.title} window`}
			data-window={win.id}
			style={style}
			onPointerDownCapture={() => focus(win.id)}
			initial={{ opacity: 0, scale: 0.96, y: 8 }}
			animate={
				win.minimized
					? { opacity: 0, scale: 0.9, y: 80, transitionEnd: { visibility: "hidden" } }
					: { opacity: 1, scale: 1, y: 0, visibility: "visible" }
			}
			exit={{ opacity: 0, scale: 0.96, y: 8 }}
			transition={{ duration: 0.2, ease: EASE }}
			className={cn(
				"fixed flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-background/85 backdrop-blur-2xl backdrop-saturate-150 dark:bg-card/85",
				focused ? "shadow-float" : "shadow-soft",
				win.minimized && "pointer-events-none",
				"max-md:inset-x-2 max-md:top-10 max-md:bottom-[88px]",
				win.maximized
					? "md:inset-x-2 md:top-10 md:bottom-[96px]"
					: "md:top-(--y) md:left-(--x) md:h-(--h) md:w-(--w)",
			)}
		>
			{/* biome-ignore lint/a11y/noStaticElementInteractions: pointer drag handle; keyboard users have the window controls */}
			<header
				onPointerDown={onTitlePointerDown}
				onDoubleClick={(event) => {
					if (!(event.target as HTMLElement).closest("button")) toggleMaximize(win.id);
				}}
				className={cn(
					"relative flex h-11 shrink-0 select-none items-center border-foreground/5 border-b px-4 md:cursor-grab md:active:cursor-grabbing",
					focused ? "bg-foreground/[0.03]" : "bg-transparent",
				)}
			>
				<WindowControls
					active={focused}
					onClose={() => close(win.id)}
					onMinimize={() => minimize(win.id)}
					onMaximize={() => toggleMaximize(win.id)}
				/>
				<h2
					className={cn(
						"pointer-events-none absolute inset-x-24 truncate text-center font-medium text-[13px]",
						focused ? "text-foreground/80" : "text-muted-foreground",
					)}
				>
					{app.title}
				</h2>
			</header>
			<div className="relative min-h-0 flex-1">{children}</div>
			{!win.maximized && (
				<>
					<div
						aria-hidden
						onPointerDown={onResizePointerDown("right")}
						className="absolute inset-y-4 -right-1 hidden w-2 cursor-ew-resize md:block"
					/>
					<div
						aria-hidden
						onPointerDown={onResizePointerDown("bottom")}
						className="absolute inset-x-4 -bottom-1 hidden h-2 cursor-ns-resize md:block"
					/>
					<div
						aria-hidden
						onPointerDown={onResizePointerDown("corner")}
						className="absolute -right-1 -bottom-1 hidden size-4 cursor-nwse-resize md:block"
					/>
				</>
			)}
		</motion.section>
	);
}
