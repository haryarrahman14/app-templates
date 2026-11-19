import { cn } from "@repo/ui/lib/cn";
import type { ReactNode } from "react";

/** Padded scroll content inside an app pane. */
export function PageBody({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<div className={cn("mx-auto w-full max-w-3xl px-5 pt-6 pb-16 @2xl:px-8 @2xl:pt-8", className)}>
			{children}
		</div>
	);
}

/** Large title block at the top of a detail view. */
export function PageHeader({
	eyebrow,
	title,
	description,
	actions,
}: {
	eyebrow?: ReactNode;
	title: ReactNode;
	description?: ReactNode;
	actions?: ReactNode;
}) {
	return (
		<header className="mb-6 flex flex-wrap items-end justify-between gap-4">
			<div className="min-w-0">
				{eyebrow ? (
					<p className="mb-1 font-medium text-[12.5px] text-muted-foreground">{eyebrow}</p>
				) : null}
				<h2 className="font-semibold text-[26px] leading-tight tracking-tight">{title}</h2>
				{description ? (
					<p className="mt-2 max-w-[60ch] text-[15px] text-muted-foreground leading-relaxed">
						{description}
					</p>
				) : null}
			</div>
			{actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
		</header>
	);
}

/** An inset grouped list, like a settings screen. */
export function Group({
	title,
	children,
	footer,
	className,
}: {
	title?: string;
	children: ReactNode;
	footer?: ReactNode;
	className?: string;
}) {
	return (
		<section className={cn("mb-6", className)}>
			{title ? (
				<h3 className="mb-2 px-1 font-medium text-[12px] text-muted-foreground uppercase tracking-[0.08em]">
					{title}
				</h3>
			) : null}
			<div className="divide-y divide-border/70 overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-soft">
				{children}
			</div>
			{footer ? <p className="mt-2 px-1 text-[12.5px] text-muted-foreground">{footer}</p> : null}
		</section>
	);
}

export function GroupRow({
	label,
	children,
	className,
}: {
	label?: ReactNode;
	children?: ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("flex min-h-12 items-center justify-between gap-4 px-4 py-3", className)}>
			{label ? <div className="min-w-0 text-[14.5px]">{label}</div> : null}
			{children}
		</div>
	);
}

/** Small rounded label. */
export function Chip({
	children,
	className,
	tone = "neutral",
}: {
	children: ReactNode;
	className?: string;
	tone?: "neutral" | "tint";
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium text-[12.5px] leading-none",
				tone === "tint" ? "bg-tint/25 text-tint-text" : "bg-shade/6 text-foreground/75",
				className,
			)}
		>
			{children}
		</span>
	);
}
