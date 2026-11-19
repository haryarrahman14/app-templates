import { cn } from "@repo/ui/lib/cn";
import { ChevronLeft } from "lucide-react";
import { type ReactNode, useState } from "react";

/**
 * A full-screen in-phone view: translucent navigation bar (back + compact title that fades in
 * on scroll), a large title, and a scrolling body that clears the status bar and home indicator.
 */
export function AppScreen({
	title,
	back,
	trailing,
	children,
	largeTitle = true,
	subtitle,
	footer,
	className,
}: {
	title: string;
	back: { label: string; onClick: () => void };
	trailing?: ReactNode;
	children: ReactNode;
	largeTitle?: boolean;
	subtitle?: ReactNode;
	/** Pinned under the scrolling body (e.g. a chat composer); it clears the home indicator. */
	footer?: ReactNode;
	className?: string;
}) {
	const [scrolled, setScrolled] = useState(!largeTitle);

	return (
		<div className={cn("absolute inset-0 flex flex-col bg-(--grouped)", className)}>
			<header
				className={cn(
					"absolute inset-x-0 top-0 z-20 pt-(--status-h) transition-[background-color,box-shadow] duration-200",
					scrolled &&
						"bg-(--grouped)/80 shadow-[0_0.5px_0_var(--grouped-line)] backdrop-blur-xl backdrop-saturate-150",
				)}
			>
				<div className="relative flex h-11 items-center justify-between px-2">
					<button
						type="button"
						onClick={back.onClick}
						className="flex h-9 min-w-0 items-center gap-0.5 rounded-lg pr-2 text-[16px] text-tint-text outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
					>
						<ChevronLeft className="size-6 shrink-0" strokeWidth={2.4} />
						<span className="max-w-28 truncate">{back.label}</span>
					</button>
					<span
						className={cn(
							"-translate-x-1/2 pointer-events-none absolute left-1/2 max-w-[50%] truncate font-semibold text-[16px] transition-opacity duration-200",
							scrolled ? "opacity-100" : "opacity-0",
						)}
						aria-hidden
					>
						{title}
					</span>
					<div className="flex items-center gap-1">{trailing}</div>
				</div>
			</header>
			<div
				className="no-scrollbar flex-1 overflow-y-auto overscroll-contain"
				onScroll={(event) => {
					if (largeTitle) setScrolled(event.currentTarget.scrollTop > 36);
				}}
			>
				<div
					className={cn(
						"pt-[calc(var(--status-h)+2.75rem)]",
						footer ? "pb-3" : "pb-[calc(var(--home-h)+1.5rem)]",
					)}
				>
					{largeTitle ? null : <h1 className="sr-only">{title}</h1>}
					{largeTitle ? (
						<div className="px-5 pt-1 pb-4">
							<h1 className="font-bold text-[32px] leading-tight tracking-[-0.02em]">{title}</h1>
							{subtitle ? (
								<p className="mt-1 text-[14px] text-muted-foreground">{subtitle}</p>
							) : null}
						</div>
					) : null}
					{children}
				</div>
			</div>
			{footer ? <div className="shrink-0 pb-(--home-h)">{footer}</div> : null}
		</div>
	);
}
