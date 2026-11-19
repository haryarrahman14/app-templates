import { Button } from "@repo/ui/components/button";
import { Link } from "@tanstack/react-router";
import { CompassIcon } from "lucide-react";

/** Full-screen 404 for an address no route matches. */
export function NotFoundPage() {
	return (
		<div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
			<span className="glass flex size-14 items-center justify-center rounded-2xl shadow-float">
				<CompassIcon aria-hidden className="size-6 text-tint-ink" />
			</span>
			<div>
				<p className="font-medium text-muted-foreground text-sm">404</p>
				<h1 className="font-semibold text-2xl tracking-tight">This page isn't on the chart</h1>
				<p className="mt-1 text-muted-foreground">The link may be old, or the page moved.</p>
			</div>
			<Button asChild>
				<Link to="/">Back to overview</Link>
			</Button>
		</div>
	);
}
