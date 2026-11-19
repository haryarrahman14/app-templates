import { Button } from "@repo/ui/components/button";
import { Link } from "@tanstack/react-router";
import { CompassIcon } from "lucide-react";
import { Panel } from "@/components/kit/panel";

/** Not-found inside the app shell (the dock and top bar stay). */
export function NotFoundPanel() {
	return (
		<Panel className="mx-auto mt-10 max-w-lg text-center">
			<span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-foreground/[0.06]">
				<CompassIcon aria-hidden className="size-5 text-tint-ink" />
			</span>
			<h1 className="font-semibold text-xl tracking-tight">This page isn't on the chart</h1>
			<p className="mt-1 text-muted-foreground text-sm">The link may be old, or the page moved.</p>
			<Button className="mt-5" asChild>
				<Link to="/">Back to overview</Link>
			</Button>
		</Panel>
	);
}
