import { Button } from "@repo/ui/components/button";
import { ThemeToggle } from "@repo/ui/components/theme-toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/components/tooltip";
import { cn } from "@repo/ui/lib/cn";
import { BatteryFull, Layers, Pencil, Wifi } from "lucide-react";
import { useNow } from "@/lib/use-now";

const dayFormat = new Intl.DateTimeFormat("en-GB", {
	weekday: "short",
	day: "numeric",
	month: "short",
});
const timeFormat = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" });

/** Slim top bar: visitor's time and date left; customize, app switcher, status glyphs and theme right. */
export function StatusBar({
	showCustomize,
	editing,
	onCustomize,
	onSwitcher,
}: {
	showCustomize: boolean;
	editing: boolean;
	onCustomize: () => void;
	onSwitcher: () => void;
}) {
	const now = useNow();

	return (
		<header className="fixed inset-x-0 top-0 z-50 flex h-10 items-center gap-3 px-4 text-[13px] before:absolute before:inset-0 before:-z-10 before:bg-(color:--wallpaper)/70 before:backdrop-blur-xl before:[mask-image:linear-gradient(to_bottom,black_55%,transparent)] md:h-11 md:px-6">
			<p className="flex min-w-0 items-center gap-2 font-semibold tabular-nums">
				<span>{now ? timeFormat.format(now) : " "}</span>
				<span className="hidden font-medium text-foreground/70 sm:inline">
					{now ? dayFormat.format(now) : ""}
				</span>
			</p>
			<div className="ml-auto flex items-center gap-1">
				{showCustomize ? (
					<Button
						variant={editing ? "default" : "ghost"}
						size="sm"
						onClick={onCustomize}
						aria-pressed={editing}
						className={cn("rounded-full", !editing && "text-foreground/80")}
					>
						<Pencil />
						{editing ? "Done" : "Customize"}
					</Button>
				) : null}
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon-sm"
							aria-label="App switcher"
							onClick={onSwitcher}
							className="rounded-full"
						>
							<Layers />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						App switcher <kbd className="ml-1 font-mono">`</kbd>
					</TooltipContent>
				</Tooltip>
				<span aria-hidden className="hidden items-center gap-1.5 px-1.5 text-foreground/70 sm:flex">
					<Wifi className="size-4" />
					<BatteryFull className="size-[18px]" />
				</span>
				<ThemeToggle className="size-7 rounded-full" />
			</div>
		</header>
	);
}
