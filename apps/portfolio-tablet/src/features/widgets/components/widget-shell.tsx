import { cn } from "@repo/ui/lib/cn";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Glass card for every widget. The whole card is one button (opens the widget's app); inner
 * call-to-action buttons sit above it with `pointer-events-auto relative z-10`.
 */
export function WidgetShell({
	label,
	onOpen,
	children,
	className,
	contentClassName,
	background,
}: {
	/** Accessible name of the card's main action, e.g. "Open Notes". */
	label: string;
	onOpen: () => void;
	children: ReactNode;
	className?: string;
	contentClassName?: string;
	/** Optional full-bleed layer behind the content (cover art). */
	background?: ReactNode;
}) {
	return (
		<div
			className={cn(
				"group/widget glass-strong @container relative h-full overflow-hidden rounded-[26px] shadow-soft",
				"transition-[translate,box-shadow] duration-300 ease-sheet hover:-translate-y-0.5 hover:shadow-float",
				className,
			)}
		>
			{background}
			<button
				type="button"
				onClick={onOpen}
				aria-label={label}
				className="absolute inset-0 rounded-[inherit] outline-none focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-inset"
			/>
			<div
				className={cn("pointer-events-none relative flex h-full flex-col p-4", contentClassName)}
			>
				{children}
			</div>
		</div>
	);
}

/** The small label row at the top of a widget. */
export function WidgetLabel({
	icon: Icon,
	children,
	trailing,
	className,
}: {
	icon: LucideIcon;
	children: ReactNode;
	trailing?: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"mb-2 flex items-center gap-1.5 font-semibold text-[12.5px] text-tint-text",
				className,
			)}
		>
			<Icon className="size-3.5" strokeWidth={2.4} />
			<span className="truncate">{children}</span>
			{trailing ? <span className="ml-auto">{trailing}</span> : null}
		</div>
	);
}
