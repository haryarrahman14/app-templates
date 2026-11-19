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
import { TriangleAlert } from "lucide-react";
import { useEffect } from "react";

export function ErrorState({ error, reset }: { error: unknown; reset: () => void }) {
	useEffect(() => {
		// ▶ Report to your error tracker here.
		console.error(error);
	}, [error]);

	return (
		<div className="flex min-h-[60dvh] items-center justify-center px-4">
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<TriangleAlert />
					</EmptyMedia>
					<EmptyTitle>Something went wrong</EmptyTitle>
					<EmptyDescription>
						The page could not load. Try again; if it keeps happening, the details are in the
						console.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent className="flex-row justify-center">
					<Button onClick={reset}>Try again</Button>
					<Button variant="outline" asChild>
						<Link to="/home">Go home</Link>
					</Button>
				</EmptyContent>
			</Empty>
		</div>
	);
}
