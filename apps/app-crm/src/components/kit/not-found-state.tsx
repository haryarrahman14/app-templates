import { Button } from "@repo/ui/components/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@repo/ui/components/empty-state";
import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";

export function NotFoundState({
	title = "This page does not exist",
	description = "The link may be old, or the record was deleted.",
	backHref = "/home",
	backLabel = "Go home",
}: {
	title?: string;
	description?: string;
	backHref?: string;
	backLabel?: string;
}) {
	return (
		<div className="flex min-h-[60dvh] items-center justify-center px-4">
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Compass />
					</EmptyMedia>
					<EmptyTitle>{title}</EmptyTitle>
					<EmptyDescription>{description}</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button asChild>
						<Link to={backHref}>{backLabel}</Link>
					</Button>
				</EmptyContent>
			</Empty>
		</div>
	);
}
