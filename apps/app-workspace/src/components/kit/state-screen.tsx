import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@repo/ui/components/empty-state";
import { cn } from "@repo/ui/lib/cn";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** Empty, not-found and error states share this calm, centred layout. */
export function StateScreen({
	icon: Icon,
	title,
	description,
	children,
	className,
}: {
	icon: LucideIcon;
	title: ReactNode;
	description: ReactNode;
	children?: ReactNode;
	className?: string;
}) {
	return (
		<Empty className={cn("border py-14", className)}>
			<EmptyHeader>
				<EmptyMedia variant="icon" className="size-11 rounded-2xl bg-primary/10 text-primary">
					<Icon className="size-5" />
				</EmptyMedia>
				<EmptyTitle className="font-semibold text-lg">{title}</EmptyTitle>
				<EmptyDescription>{description}</EmptyDescription>
			</EmptyHeader>
			{children ? (
				<EmptyContent className="flex-row justify-center gap-2">{children}</EmptyContent>
			) : null}
		</Empty>
	);
}
