import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/cn";
import { GripVertical, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { type KeyboardEvent, type PointerEvent, useEffect, useRef, useState } from "react";
import { useWidgetOrder } from "@/features/home/hooks/use-widget-order";
import type { WidgetSize, WidgetSlot } from "@/features/home/types/widget-slot";

/** Bento sizes. 1 column under 440px, 2 on phones, 4 on tablets, 6 on wide screens. */
const SIZE_CLASS: Record<WidgetSize, string> = {
	small: "col-span-1 row-span-1",
	medium: "min-[440px]:col-span-2 row-span-1",
	large: "min-[440px]:col-span-2 row-span-2",
	wide: "min-[440px]:col-span-2 md:col-span-4 row-span-1",
};

const LAYOUT_SPRING = { type: "spring", bounce: 0.15, duration: 0.4 } as const;

function moveTo(list: string[], id: string, index: number) {
	const next = list.filter((x) => x !== id);
	next.splice(Math.max(0, Math.min(index, next.length)), 0, id);
	return next;
}

/**
 * The home bento. In edit mode every widget gets a handle: drag it with a pointer (touch works), or
 * focus it and use the arrow keys. The order is saved to localStorage when a move ends.
 */
export function WidgetGrid({
	widgets,
	editing,
	onEditingChange,
}: {
	widgets: WidgetSlot[];
	editing: boolean;
	onEditingChange: (editing: boolean) => void;
}) {
	const { order, save, reset, isCustom } = useWidgetOrder(widgets.map((w) => w.id));
	const byId = new Map(widgets.map((w) => [w.id, w]));
	const [draft, setDraft] = useState<string[] | null>(null);
	const [dragging, setDragging] = useState<string | null>(null);
	const [announcement, setAnnouncement] = useState("");
	const lastMove = useRef(0);
	const current = draft ?? order;

	useEffect(() => {
		if (!editing) return;
		const onKey = (e: globalThis.KeyboardEvent) => {
			if (e.key === "Escape") onEditingChange(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [editing, onEditingChange]);

	const label = (id: string) => byId.get(id)?.label ?? id;

	const onPointerDown = (id: string) => (e: PointerEvent<HTMLButtonElement>) => {
		if (e.button !== 0) return;
		e.currentTarget.setPointerCapture(e.pointerId);
		setDragging(id);
		setDraft(order);
	};

	const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
		if (!dragging || !draft) return;
		const now = performance.now();
		if (now - lastMove.current < 180) return; // let the layout animation settle; avoids flip-flopping
		const target = document
			.elementFromPoint(e.clientX, e.clientY)
			?.closest<HTMLElement>("[data-widget-id]")?.dataset.widgetId;
		if (!target || target === dragging) return;
		lastMove.current = now;
		setDraft(moveTo(draft, dragging, draft.indexOf(target)));
	};

	const endDrag = () => {
		if (draft && dragging) {
			save(draft);
			setAnnouncement(
				`${label(dragging)} moved to position ${draft.indexOf(dragging) + 1} of ${draft.length}.`,
			);
		}
		setDraft(null);
		setDragging(null);
	};

	const onKeyDown = (id: string) => (e: KeyboardEvent<HTMLButtonElement>) => {
		const delta = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }[e.key];
		if (!delta) return;
		e.preventDefault();
		const index = order.indexOf(id) + delta;
		if (index < 0 || index >= order.length) return;
		const next = moveTo(order, id, index);
		save(next);
		setAnnouncement(`${label(id)} moved to position ${index + 1} of ${next.length}.`);
		requestAnimationFrame(() =>
			document.querySelector<HTMLButtonElement>(`[data-widget-handle="${id}"]`)?.focus(),
		);
	};

	return (
		<section aria-label="Widgets" className="relative">
			{editing ? (
				<div className="glass-strong fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-1/2 z-45 flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-2 rounded-full py-1.5 pr-1.5 pl-4 shadow-float md:bottom-30">
					<p className="text-[13px] text-muted-foreground">
						<span className="hidden sm:inline">
							Drag widgets to rearrange. Arrow keys work too.
						</span>
						<span className="sm:hidden">Drag to rearrange</span>
					</p>
					<Button
						variant="ghost"
						size="sm"
						disabled={!isCustom}
						onClick={() => {
							reset();
							setAnnouncement("Layout reset to default.");
						}}
						className="rounded-full"
					>
						<RotateCcw />
						Reset
					</Button>
					<Button size="sm" onClick={() => onEditingChange(false)} className="rounded-full px-3.5">
						Done
					</Button>
				</div>
			) : null}

			<ul className="grid grid-flow-row-dense auto-rows-[9.5rem] grid-cols-1 gap-3.5 min-[440px]:grid-cols-2 md:auto-rows-[10rem] md:grid-cols-4 md:gap-4 xl:grid-cols-6 xl:gap-5">
				{current.map((id, index) => {
					const widget = byId.get(id);
					if (!widget) return null;
					const isDragging = dragging === id;
					return (
						<motion.li
							key={id}
							layout
							transition={LAYOUT_SPRING}
							data-widget-id={id}
							animate={{ scale: isDragging ? 1.04 : 1 }}
							className={cn("relative min-w-0", SIZE_CLASS[widget.size], isDragging && "z-20")}
						>
							<div
								className={cn("h-full", editing && !isDragging && "jiggle")}
								style={{ animationDelay: `${(index % 5) * -0.07}s` }}
								inert={editing || undefined}
							>
								{widget.node}
							</div>
							{editing ? (
								<button
									type="button"
									data-widget-handle={id}
									aria-label={`Move ${widget.label}, position ${index + 1} of ${current.length}. Use arrow keys.`}
									onPointerDown={onPointerDown(id)}
									onPointerMove={onPointerMove}
									onPointerUp={endDrag}
									onPointerCancel={endDrag}
									onKeyDown={onKeyDown(id)}
									className={cn(
										"absolute inset-0 z-10 touch-none rounded-[26px] outline-none ring-tint/0 transition-shadow focus-visible:ring-[3px] focus-visible:ring-ring",
										isDragging ? "cursor-grabbing shadow-float ring-2 ring-tint/50" : "cursor-grab",
									)}
								>
									<span className="glass-strong absolute -top-2 -left-2 flex size-7 items-center justify-center rounded-full text-foreground/70 shadow-float">
										<GripVertical className="size-4" />
									</span>
								</button>
							) : null}
						</motion.li>
					);
				})}
			</ul>
			<p aria-live="polite" className="sr-only">
				{announcement}
			</p>
		</section>
	);
}
