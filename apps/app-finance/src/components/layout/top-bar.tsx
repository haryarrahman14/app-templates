import { Button } from "@repo/ui/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/components/tooltip";
import { Link } from "@tanstack/react-router";
import { CandlestickChartIcon, SearchIcon } from "lucide-react";
import { SampleChip } from "@/components/kit/sample-chip";
import { Greeting } from "@/components/layout/greeting";
import { useSession } from "@/components/layout/session-context";
import { UserMenu } from "@/components/layout/user-menu";
import { NotificationsMenu } from "@/features/notifications/components/notifications-menu";
import { formatDate } from "@/lib/format";
import { SAMPLE_AS_OF } from "@/lib/sample-data/calendar";

export function TopBar({ onSearch }: { onSearch: () => void }) {
	const session = useSession();
	return (
		<header className="sticky top-0 z-30 border-transparent border-b bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55">
			<div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
				<Link
					to="/"
					aria-label="Overview"
					className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-tint text-tint-foreground shadow-soft"
				>
					<CandlestickChartIcon aria-hidden className="size-[18px]" />
				</Link>
				<div className="min-w-0 flex-1">
					<p className="truncate font-medium text-sm">
						<Greeting name={session.name} />
					</p>
					<p className="truncate text-muted-foreground text-xs">
						{formatDate(SAMPLE_AS_OF, "long")}
					</p>
				</div>

				<div className="hidden items-center gap-2 md:flex">
					<Tooltip>
						<TooltipTrigger asChild>
							<span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.06] px-2.5 py-1 font-medium text-foreground text-xs">
								<span className="relative flex size-1.5">
									<span className="absolute inline-flex size-full animate-ping rounded-full bg-gain opacity-60 motion-reduce:hidden" />
									<span className="relative inline-flex size-1.5 rounded-full bg-gain" />
								</span>
								Market open
							</span>
						</TooltipTrigger>
						<TooltipContent>Sample session. Prices tick every 5 seconds.</TooltipContent>
					</Tooltip>
					<SampleChip />
				</div>

				<Button
					variant="outline"
					onClick={onSearch}
					className="hidden h-9 w-56 justify-start gap-2 rounded-full text-muted-foreground sm:flex lg:w-64"
				>
					<SearchIcon aria-hidden />
					<span className="flex-1 text-left">Search</span>
					<kbd className="rounded border bg-foreground/[0.04] px-1.5 font-sans text-[10px]">⌘K</kbd>
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className="rounded-full sm:hidden"
					onClick={onSearch}
					aria-label="Search"
				>
					<SearchIcon />
				</Button>
				<NotificationsMenu />
				<UserMenu />
			</div>
		</header>
	);
}
