import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/cn";
import { type ErrorComponentProps, Link, useRouter } from "@tanstack/react-router";
import { TriangleAlertIcon } from "lucide-react";
import { useEffect } from "react";
import { StateScreen } from "@/components/kit/state-screen";

export function ErrorScreen({
	error,
	reset,
	inShell = false,
}: ErrorComponentProps & { inShell?: boolean }) {
	const router = useRouter();
	// Some error reporters tag errors with a short reference to quote.
	const digest =
		error instanceof Error && "digest" in error && typeof error.digest === "string"
			? error.digest
			: undefined;
	useEffect(() => {
		// Report to your error tracker here.
		console.error(error);
	}, [error]);

	return (
		<main
			className={cn(
				"flex items-center justify-center p-6",
				inShell ? "min-h-[70dvh]" : "min-h-dvh",
			)}
		>
			<StateScreen
				icon={TriangleAlertIcon}
				title="Something went wrong"
				description={
					digest
						? `We hit an unexpected error (ref ${digest}). Try again in a moment.`
						: "We hit an unexpected error. Try again in a moment."
				}
				className="max-w-md border-none"
			>
				<Button
					onClick={() => {
						reset();
						// Re-runs the route's loaders too, in case the error came from one.
						void router.invalidate();
					}}
				>
					Try again
				</Button>
				<Button variant="outline" asChild>
					<Link to="/">Go home</Link>
				</Button>
			</StateScreen>
		</main>
	);
}

/** The route error state inside the signed-in shell. */
export function ShellErrorScreen(props: ErrorComponentProps) {
	return <ErrorScreen {...props} inShell />;
}
