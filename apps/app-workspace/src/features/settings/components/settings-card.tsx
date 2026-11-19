import { cn } from "@repo/ui/lib/cn";
import type { ReactNode } from "react";

/** A titled settings panel. */
export function SettingsCard({
	title,
	description,
	children,
	footer,
	className,
}: {
	title: string;
	description?: string;
	children: ReactNode;
	footer?: ReactNode;
	className?: string;
}) {
	return (
		<section className={cn("overflow-hidden rounded-2xl border bg-card shadow-soft", className)}>
			<div className="space-y-5 p-5 sm:p-6">
				<header className="space-y-1">
					<h2 className="font-semibold text-lg tracking-tight">{title}</h2>
					{description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
				</header>
				{children}
			</div>
			{footer ? (
				<div className="flex items-center justify-end gap-2 border-t bg-muted/40 px-5 py-3 sm:px-6">
					{footer}
				</div>
			) : null}
		</section>
	);
}
