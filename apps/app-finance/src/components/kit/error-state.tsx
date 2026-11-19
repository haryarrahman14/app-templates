import { Button } from "@repo/ui/components/button";
import { type ErrorComponentProps, Link, useRouter } from "@tanstack/react-router";
import { TriangleAlertIcon } from "lucide-react";
import { useEffect } from "react";
import { Panel } from "@/components/kit/panel";

export function ErrorState({ error, retry }: { error: unknown; retry: () => void }) {
	useEffect(() => {
		// Send to your error reporting service here.
		console.error(error);
	}, [error]);
	const message = error instanceof Error ? error.message : "Unknown error";
	return (
		<Panel className="mx-auto mt-10 max-w-lg text-center" role="alert">
			<span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-loss/10">
				<TriangleAlertIcon aria-hidden className="size-5 text-loss" />
			</span>
			<h1 className="font-semibold text-xl tracking-tight">
				Something went wrong loading this view
			</h1>
			<p className="mt-1 text-muted-foreground text-sm">{message}</p>
			<div className="mt-5 flex justify-center gap-2">
				<Button onClick={() => retry()}>Try again</Button>
				<Button variant="outline" asChild>
					<Link to="/">Go to overview</Link>
				</Button>
			</div>
		</Panel>
	);
}

/** The router's error boundary: retry re-runs the route's loaders, then re-renders. */
export function RouteErrorState({ error, reset }: ErrorComponentProps) {
	const router = useRouter();
	return (
		<ErrorState
			error={error}
			retry={() => {
				router.invalidate();
				reset();
			}}
		/>
	);
}
