import { cn } from "@repo/ui/lib/cn";
import type { ComponentProps, ReactNode } from "react";

/** The glass card every screen is built from: frosted surface, hairline edge, large radius. */
export function Panel({ className, ...props }: ComponentProps<"section">) {
	return (
		<section
			className={cn("glass relative rounded-2xl p-5 shadow-soft sm:p-6", className)}
			{...props}
		/>
	);
}

export function PanelHeader({
	title,
	description,
	action,
	className,
	id,
}: {
	title: ReactNode;
	description?: ReactNode;
	action?: ReactNode;
	className?: string;
	id?: string;
}) {
	return (
		<header className={cn("mb-4 flex items-start justify-between gap-4", className)}>
			<div className="min-w-0">
				<h2 id={id} className="font-semibold text-[15px]">
					{title}
				</h2>
				{description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
			</div>
			{action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
		</header>
	);
}
