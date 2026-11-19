import { cn } from "@repo/ui/lib/cn";

/** A thin progress bar (the ui package has no progress component). */
export function Progress({ value, className }: { value: number; className?: string }) {
	const clamped = Math.max(0, Math.min(100, value));
	return (
		<div
			role="progressbar"
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={Math.round(clamped)}
			className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}
		>
			<div
				className="h-full rounded-full bg-primary transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
				style={{ width: `${clamped}%` }}
			/>
		</div>
	);
}
