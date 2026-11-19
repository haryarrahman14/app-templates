import { cn } from "@repo/ui/lib/cn";
import type { ReactNode } from "react";

/** Large calm page title with an optional description and actions on the right. */
export function PageHeader({
	title,
	description,
	actions,
	className,
}: {
	title: ReactNode;
	description?: ReactNode;
	actions?: ReactNode;
	className?: string;
}) {
	return (
		<header className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
			<div className="min-w-0 space-y-1">
				<h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">{title}</h1>
				{description ? <p className="text-muted-foreground">{description}</p> : null}
			</div>
			{actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
		</header>
	);
}

/** The standard padded, centred content column used by app pages. */
export function PageContainer({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 sm:py-10", className)}>
			{children}
		</div>
	);
}
