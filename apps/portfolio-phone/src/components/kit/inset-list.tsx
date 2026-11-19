import { cn } from "@repo/ui/lib/cn";
import { ChevronRight, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** A grouped, inset list section: optional header, rounded card of rows, optional footer. */
export function InsetSection({
	header,
	footer,
	children,
	className,
}: {
	header?: ReactNode;
	footer?: ReactNode;
	children: ReactNode;
	className?: string;
}) {
	return (
		<section className={cn("px-4", className)}>
			{header ? (
				<h2 className="mb-1.5 px-4 font-medium text-[12.5px] text-muted-foreground uppercase tracking-wide">
					{header}
				</h2>
			) : null}
			<div className="overflow-hidden rounded-[14px] bg-(--grouped-card) shadow-[0_0_0_0.5px_var(--grouped-line)]">
				{children}
			</div>
			{footer ? (
				<p className="mt-1.5 px-4 text-[12.5px] text-muted-foreground leading-snug">{footer}</p>
			) : null}
		</section>
	);
}

type RowProps = {
	label: ReactNode;
	detail?: ReactNode;
	value?: ReactNode;
	icon?: LucideIcon;
	/** A category-colour fill for the icon square (light glyph on top). Defaults to the accent. */
	iconBackground?: string;
	leading?: ReactNode;
	trailing?: ReactNode;
	chevron?: boolean;
	onClick?: () => void;
	href?: string;
	className?: string;
};

/** One row. Clickable when given onClick or href; rows are separated by inset hairlines. */
export function InsetRow({
	label,
	detail,
	value,
	icon: Icon,
	iconBackground,
	leading,
	trailing,
	chevron,
	onClick,
	href,
	className,
}: RowProps) {
	const body = (
		<>
			{leading ??
				(Icon ? (
					<span
						className={cn(
							"grid size-[29px] shrink-0 place-items-center rounded-[8px]",
							iconBackground ? "text-white" : "bg-tint text-tint-foreground",
						)}
						style={iconBackground ? { background: iconBackground } : undefined}
					>
						<Icon className="size-[17px]" strokeWidth={2} />
					</span>
				) : null)}
			<span className="flex min-w-0 flex-1 items-center gap-3 self-stretch border-(--grouped-line) border-b py-[11px] pr-4 group-last/row:border-b-0">
				<span className="min-w-0 flex-1">
					<span className="block truncate text-[15px] leading-snug">{label}</span>
					{detail ? (
						<span className="mt-0.5 block text-[13px] text-muted-foreground leading-snug">
							{detail}
						</span>
					) : null}
				</span>
				{value ? (
					<span className="max-w-[60%] shrink-0 truncate text-[15px] text-muted-foreground">
						{value}
					</span>
				) : null}
				{trailing}
				{chevron || onClick || href ? (
					<ChevronRight className="size-4 shrink-0 text-muted-foreground/60" strokeWidth={2.5} />
				) : null}
			</span>
		</>
	);

	const base = cn(
		"group/row flex w-full items-center gap-3 pl-4 text-left outline-none",
		(onClick || href) &&
			"transition-colors hover:bg-foreground/[0.03] focus-visible:bg-foreground/[0.05] active:bg-foreground/[0.07]",
		className,
	);

	if (href) {
		const external = href.startsWith("http");
		return (
			<a
				href={href}
				className={base}
				target={external ? "_blank" : undefined}
				rel={external ? "noreferrer" : undefined}
			>
				{body}
			</a>
		);
	}
	if (onClick) {
		return (
			<button type="button" onClick={onClick} className={base}>
				{body}
			</button>
		);
	}
	return <div className={base}>{body}</div>;
}
