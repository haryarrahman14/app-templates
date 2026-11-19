import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/cn";
import { Link } from "@tanstack/react-router";
import { CompassIcon } from "lucide-react";
import { StateScreen } from "@/components/kit/state-screen";

export function NotFoundScreen({ inShell = false }: { inShell?: boolean }) {
	return (
		<main
			className={cn(
				"flex items-center justify-center p-6",
				inShell ? "min-h-[70dvh]" : "min-h-dvh",
			)}
		>
			<StateScreen
				icon={CompassIcon}
				title="This page wandered off"
				description="The link may be old, or the page was moved. Let's get you somewhere useful."
				className="max-w-md border-none"
			>
				<Button asChild>
					<Link to="/">Go to all docs</Link>
				</Button>
			</StateScreen>
		</main>
	);
}

/** The not-found state inside the signed-in shell. */
export function ShellNotFoundScreen() {
	return <NotFoundScreen inShell />;
}
