import { Button } from "@repo/ui/components/button";
import { Link } from "@tanstack/react-router";
import { SearchXIcon } from "lucide-react";
import { Panel } from "@/components/kit/panel";

export function InstrumentNotFound() {
	return (
		<Panel className="mx-auto mt-10 max-w-lg text-center">
			<span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-foreground/[0.06]">
				<SearchXIcon aria-hidden className="size-5 text-muted-foreground" />
			</span>
			<h1 className="font-semibold text-xl tracking-tight">No instrument with that symbol</h1>
			<p className="mt-1 text-muted-foreground text-sm">
				The sample universe has about thirty invented tickers. Browse them in Markets or press ⌘K.
			</p>
			<Button className="mt-5" asChild>
				<Link to="/markets">Open Markets</Link>
			</Button>
		</Panel>
	);
}
