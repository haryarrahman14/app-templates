import { cn } from "@repo/ui/lib/cn";
import { BatteryFull, SignalHigh, Wifi } from "lucide-react";
import { formatTime, useNow } from "@/lib/use-now";

/**
 * The fake status bar. Hidden on real phones (they draw their own).
 * `onWall` = the wallpaper's own text colour (`--on-wall`); otherwise it follows the theme.
 */
export function StatusBar({ onWall, hideTime }: { onWall: boolean; hideTime?: boolean }) {
	const now = useNow();
	return (
		<div
			aria-hidden
			className={cn(
				"pointer-events-none absolute inset-x-0 top-0 z-50 hidden h-[52px] items-center justify-between px-[34px] pt-1 font-semibold text-[15px] tabular-nums transition-colors duration-300 sm:flex",
				onWall ? "text-on-wall" : "text-foreground",
			)}
		>
			<span className={cn("w-14", hideTime && "opacity-0")}>{now ? formatTime(now) : null}</span>
			<span className="flex items-center gap-1.5">
				<SignalHigh className="size-[17px]" strokeWidth={2.6} />
				<Wifi className="size-[16px]" strokeWidth={2.6} />
				<BatteryFull className="size-[22px]" strokeWidth={1.8} />
			</span>
		</div>
	);
}
