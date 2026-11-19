import { cn } from "@repo/ui/lib/cn";
import type { ReactNode } from "react";

export function PageHeader({
	title,
	description,
	icon,
	actions,
	className,
}: {
	title: ReactNode;
	description?: ReactNode;
	icon?: ReactNode;
	actions?: ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("flex flex-wrap items-end justify-between gap-3", className)}>
			<div className="flex min-w-0 items-center gap-3">
				{icon}
				<div className="min-w-0">
					<h1 className="truncate font-semibold text-2xl">{title}</h1>
					{description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
				</div>
			</div>
			{actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
		</div>
	);
}

/** The scrollable content column inside the shell. */
export function PageBody({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<div
			className={cn("mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-8", className)}
		>
			{children}
		</div>
	);
}
