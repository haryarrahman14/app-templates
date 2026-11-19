import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/cn";
import { Plus } from "lucide-react";
import { type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";
import { useMoveDeal } from "@/features/deals/api/mutations";
import { DealCard } from "@/features/deals/components/deal-card";
import {
	DEAL_STAGE_META,
	DEAL_STAGES,
	type Deal,
	type DealStage,
} from "@/features/deals/schemas/deal";
import { dealsIn, rankAt } from "@/features/deals/utils/rank";
import { formatMoneyCompact } from "@/lib/format";
import { openCreate } from "@/lib/ui-state";

type Drag = {
	id: string;
	startX: number;
	startY: number;
	offsetX: number;
	offsetY: number;
	width: number;
	active: boolean;
	x: number;
	y: number;
	target: { stage: DealStage; index: number } | null;
};

const THRESHOLD = 5;

/**
 * Kanban by stage. Mouse/pen: drag a card between or within columns. Keyboard and touch: the
 * card's "Move to" menu. Drops are optimistic (useMoveDeal).
 */
export function DealBoard({
	deals,
	companyName,
	ownerName,
	onOpen,
	onMoved,
}: {
	deals: Deal[];
	companyName: (id: string) => string;
	ownerName: (id: string) => string;
	onOpen: (id: string) => void;
	onMoved?: () => void;
}) {
	const move = useMoveDeal();
	const [drag, setDrag] = useState<Drag | null>(null);
	const dragRef = useRef<Drag | null>(null);
	const suppressClick = useRef(false);

	const update = (next: Drag | null) => {
		dragRef.current = next;
		setDrag(next);
	};

	const moveTo = (deal: Deal, stage: DealStage, index?: number) => {
		const column = dealsIn(deals, stage).filter((item) => item.id !== deal.id);
		const rank = rankAt(column, index ?? column.length);
		if (deal.stage === stage && Math.abs(deal.rank - rank) < 1e-9) return;
		move.mutate({ id: deal.id, stage, rank }, { onSuccess: () => onMoved?.() });
	};

	// Latest drop handler, so the window listeners below are bound once per drag.
	const dropRef = useRef<(id: string, target: Drag["target"]) => void>(() => {});
	dropRef.current = (id, target) => {
		const deal = deals.find((item) => item.id === id);
		if (deal && target) moveTo(deal, target.stage, target.index);
	};
	const dragging = drag !== null;

	useEffect(() => {
		if (!dragging) return;
		const set = (next: Drag | null) => {
			dragRef.current = next;
			setDrag(next);
		};
		const locate = (x: number, y: number): Drag["target"] => {
			const element = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-stage]");
			const stage = element?.dataset.stage as DealStage | undefined;
			if (!element || !stage) return null;
			const cards = Array.from(element.querySelectorAll<HTMLElement>("[data-card-id]")).filter(
				(card) => card.dataset.cardId !== dragRef.current?.id,
			);
			let index = cards.length;
			for (const [position, card] of cards.entries()) {
				const box = card.getBoundingClientRect();
				if (y < box.top + box.height / 2) {
					index = position;
					break;
				}
			}
			return { stage, index };
		};
		const onMove = (event: PointerEvent) => {
			const current = dragRef.current;
			if (!current) return;
			const distance = Math.hypot(event.clientX - current.startX, event.clientY - current.startY);
			if (!current.active && distance < THRESHOLD) return;
			event.preventDefault();
			set({
				...current,
				active: true,
				x: event.clientX,
				y: event.clientY,
				target: locate(event.clientX, event.clientY),
			});
		};
		const onUp = () => {
			const current = dragRef.current;
			set(null);
			if (!current?.active) return;
			suppressClick.current = true;
			setTimeout(() => {
				suppressClick.current = false;
			}, 0);
			dropRef.current(current.id, current.target);
		};
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") set(null);
		};
		window.addEventListener("pointermove", onMove);
		window.addEventListener("pointerup", onUp);
		window.addEventListener("pointercancel", onUp);
		window.addEventListener("keydown", onKey);
		return () => {
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", onUp);
			window.removeEventListener("pointercancel", onUp);
			window.removeEventListener("keydown", onKey);
		};
	}, [dragging]);

	const startDrag = (deal: Deal) => (event: ReactPointerEvent<HTMLDivElement>) => {
		if (event.button !== 0 || event.pointerType === "touch") return;
		const box = event.currentTarget.getBoundingClientRect();
		update({
			id: deal.id,
			startX: event.clientX,
			startY: event.clientY,
			offsetX: event.clientX - box.left,
			offsetY: event.clientY - box.top,
			width: box.width,
			active: false,
			x: event.clientX,
			y: event.clientY,
			target: null,
		});
	};

	const dragged = drag?.active ? deals.find((deal) => deal.id === drag.id) : undefined;

	return (
		<div className="-mx-4 overflow-x-auto px-4 pb-4 md:-mx-8 md:px-8">
			<div className="flex w-max gap-3">
				{DEAL_STAGES.map((stage) => {
					const column = dealsIn(deals, stage);
					const total = column.reduce((sum, deal) => sum + deal.value, 0);
					const isTarget = drag?.active && drag.target?.stage === stage;
					const visible = column.filter((deal) => !(drag?.active && deal.id === drag.id));
					return (
						<section
							key={stage}
							data-stage={stage}
							aria-label={`${DEAL_STAGE_META[stage].label}, ${column.length} deals`}
							className={cn(
								"flex max-h-[calc(100dvh-12.5rem)] w-72 shrink-0 flex-col rounded-2xl border bg-muted/40 transition-colors",
								isTarget && "border-primary/40 bg-muted",
							)}
						>
							<header className="flex items-center gap-2 px-3 pt-3 pb-2">
								<span className={cn("size-2 rounded-full", DEAL_STAGE_META[stage].dot)} />
								<h2 className="font-medium text-sm">{DEAL_STAGE_META[stage].label}</h2>
								<span className="text-muted-foreground text-xs tabular-nums">{column.length}</span>
								<span className="ml-auto font-medium text-muted-foreground text-xs tabular-nums">
									{formatMoneyCompact(total)}
								</span>
							</header>
							<div className="flex min-h-24 flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2">
								{visible.map((deal, index) => (
									<div key={deal.id}>
										{isTarget && drag?.target?.index === index ? <DropLine /> : null}
										<DealCard
											deal={deal}
											companyName={companyName(deal.companyId)}
											ownerName={ownerName(deal.ownerId)}
											onPointerDown={startDrag(deal)}
											onOpen={() => {
												if (!suppressClick.current) onOpen(deal.id);
											}}
											onMove={(next) => moveTo(deal, next)}
										/>
									</div>
								))}
								{isTarget && (drag?.target?.index ?? 0) >= visible.length ? <DropLine /> : null}
								{column.length === 0 && !isTarget ? (
									<p className="rounded-xl border border-dashed px-3 py-6 text-center text-muted-foreground text-xs">
										Drop deals here
									</p>
								) : null}
								<Button
									variant="ghost"
									size="sm"
									className="justify-start text-muted-foreground"
									onClick={() => openCreate("deal", { stage })}
								>
									<Plus /> Add deal
								</Button>
							</div>
						</section>
					);
				})}
			</div>
			{dragged && drag ? (
				<div
					aria-hidden
					className="pointer-events-none fixed z-50"
					style={{ left: drag.x - drag.offsetX, top: drag.y - drag.offsetY, width: drag.width }}
				>
					<DealCard
						deal={dragged}
						companyName={companyName(dragged.companyId)}
						ownerName={ownerName(dragged.ownerId)}
						ghost
					/>
				</div>
			) : null}
		</div>
	);
}

function DropLine() {
	return <div className="mx-1 mb-2 h-0.5 rounded-full bg-primary" />;
}
