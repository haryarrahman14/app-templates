import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/cn";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Settings-style split: sidebar list + detail. Side by side when the pane is wide enough (container
 * query, so it also works inside a 30% split); one at a time with a back button when narrow.
 */
export function MasterDetail({
	sidebar,
	detail,
	hasSelection,
	onBack,
	backLabel,
	sidebarClassName,
}: {
	sidebar: ReactNode;
	detail: ReactNode;
	/** On narrow panes the detail shows only when something is selected. */
	hasSelection: boolean;
	onBack: () => void;
	backLabel: string;
	sidebarClassName?: string;
}) {
	return (
		<div className="@container/md h-full min-h-0">
			<div className="flex h-full min-h-0">
				<nav
					aria-label={backLabel}
					className={cn(
						"scrollbar-none h-full w-full shrink-0 overflow-y-auto border-border/60 px-3 py-4 @2xl/md:w-64 @2xl/md:border-r @4xl/md:w-72",
						"bg-secondary/50",
						hasSelection && "hidden @2xl/md:block",
						sidebarClassName,
					)}
				>
					{sidebar}
				</nav>
				<section
					className={cn(
						"h-full min-w-0 flex-1 overflow-y-auto",
						!hasSelection && "hidden @2xl/md:block",
					)}
				>
					<div className="sticky top-0 z-10 px-3 pt-3 @2xl/md:hidden">
						<Button variant="secondary" size="sm" onClick={onBack} className="glass shadow-soft">
							<ChevronLeft />
							{backLabel}
						</Button>
					</div>
					{detail}
				</section>
			</div>
		</div>
	);
}

/** A selectable row for MasterDetail sidebars. */
export function SidebarRow({
	active,
	onClick,
	icon,
	title,
	subtitle,
	trailing,
}: {
	active: boolean;
	onClick: () => void;
	icon?: ReactNode;
	title: string;
	subtitle?: string;
	trailing?: ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-current={active ? "true" : undefined}
			className={cn(
				"flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left outline-none transition-colors",
				"focus-visible:ring-2 focus-visible:ring-ring",
				active ? "bg-tint text-tint-foreground shadow-soft" : "hover:bg-shade/5 active:bg-shade/8",
			)}
		>
			{icon}
			<span className="min-w-0 flex-1">
				<span className="block truncate font-medium text-[14px]">{title}</span>
				{subtitle ? (
					<span
						className={cn(
							"block truncate text-[12.5px]",
							active ? "text-tint-foreground/80" : "text-muted-foreground",
						)}
					>
						{subtitle}
					</span>
				) : null}
			</span>
			{trailing}
		</button>
	);
}

/** Small uppercase group label inside sidebars. */
export function SidebarLabel({ children }: { children: ReactNode }) {
	return (
		<p className="px-3 pt-4 pb-1.5 font-medium text-[11px] text-muted-foreground uppercase tracking-[0.08em] first:pt-1">
			{children}
		</p>
	);
}
