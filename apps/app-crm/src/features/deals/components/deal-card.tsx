import { Button } from "@repo/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { cn } from "@repo/ui/lib/cn";
import { CalendarClock, MoveRight } from "lucide-react";
import type { PointerEvent } from "react";
import { InitialsAvatar } from "@/components/kit/initials-avatar";
import {
	DEAL_STAGE_META,
	DEAL_STAGES,
	type Deal,
	type DealStage,
} from "@/features/deals/schemas/deal";
import { formatDay, formatMoney } from "@/lib/format";

export function DealCard({
	deal,
	companyName,
	ownerName,
	dragging = false,
	ghost = false,
	onOpen,
	onMove,
	onPointerDown,
}: {
	deal: Deal;
	companyName: string;
	ownerName: string;
	dragging?: boolean;
	ghost?: boolean;
	onOpen?: () => void;
	onMove?: (stage: DealStage) => void;
	onPointerDown?: (event: PointerEvent<HTMLDivElement>) => void;
}) {
	const overdue =
		deal.stage !== "won" && deal.stage !== "lost" && deal.closeDate < new Date().toISOString();
	return (
		<div
			data-card-id={deal.id}
			onPointerDown={onPointerDown}
			className={cn(
				"group/card relative select-none rounded-xl border bg-card p-3 shadow-soft transition-[opacity,box-shadow,transform] duration-150",
				dragging && "opacity-35",
				ghost && "rotate-[1.5deg] cursor-grabbing shadow-float ring-1 ring-primary/30",
				!ghost && "cursor-grab hover:shadow-float active:cursor-grabbing",
			)}
		>
			<button
				type="button"
				onClick={onOpen}
				className="block w-full rounded-md pr-7 text-left font-medium text-sm leading-snug outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-ring"
			>
				{deal.name}
			</button>
			<p className="mt-0.5 truncate text-muted-foreground text-xs">{companyName}</p>
			<div className="mt-3 flex items-center gap-2 text-xs">
				<span className="font-semibold text-sm tabular-nums">{formatMoney(deal.value)}</span>
				<span
					className={cn(
						"ml-auto flex items-center gap-1 text-muted-foreground",
						overdue && "text-destructive",
					)}
				>
					<CalendarClock className="size-3" />
					{formatDay(deal.closeDate)}
				</span>
				<InitialsAvatar name={ownerName} size="xs" />
			</div>
			{onMove ? (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="icon-xs"
							aria-label={`Move ${deal.name} to another stage`}
							onPointerDown={(event) => event.stopPropagation()}
							className="absolute top-2 right-2 z-10 opacity-60 transition hover:opacity-100 focus-visible:opacity-100 group-hover/card:opacity-100"
						>
							<MoveRight />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-44 rounded-xl">
						<DropdownMenuLabel className="text-muted-foreground text-xs">Move to</DropdownMenuLabel>
						<DropdownMenuRadioGroup
							value={deal.stage}
							onValueChange={(stage) => onMove(stage as DealStage)}
						>
							{DEAL_STAGES.map((stage) => (
								<DropdownMenuRadioItem key={stage} value={stage}>
									<span className={cn("size-2 rounded-full", DEAL_STAGE_META[stage].dot)} />
									{DEAL_STAGE_META[stage].label}
								</DropdownMenuRadioItem>
							))}
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			) : null}
		</div>
	);
}
