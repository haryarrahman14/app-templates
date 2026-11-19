import type { ReactNode } from "react";
import { Panel } from "@/components/kit/panel";

export function SettingsSection({
	title,
	description,
	children,
	footer,
}: {
	title: string;
	description?: ReactNode;
	children: ReactNode;
	footer?: ReactNode;
}) {
	return (
		<Panel className="p-0 sm:p-0">
			<div className="p-5 sm:p-6">
				<h2 className="font-semibold">{title}</h2>
				{description ? <p className="mt-0.5 text-muted-foreground text-sm">{description}</p> : null}
				<div className="mt-5">{children}</div>
			</div>
			{footer ? (
				<div className="flex items-center justify-end gap-2 border-t bg-foreground/[0.02] px-5 py-3 sm:px-6">
					{footer}
				</div>
			) : null}
		</Panel>
	);
}

export function SampleNote({ children }: { children: ReactNode }) {
	return (
		<p className="rounded-lg border border-dashed px-3 py-2 text-muted-foreground text-xs">
			<span className="font-medium text-foreground">Sample · </span>
			{children}
		</p>
	);
}
