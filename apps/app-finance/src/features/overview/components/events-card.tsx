import { useSuspenseQuery } from "@tanstack/react-query";
import { CalendarClockIcon, CoinsIcon, UsersIcon } from "lucide-react";
import { Panel, PanelHeader } from "@/components/kit/panel";
import { TickerChip } from "@/components/kit/ticker-chip";
import { eventsQuery } from "@/features/overview/api/queries";
import { formatDate } from "@/lib/format";

const ICON = { earnings: CalendarClockIcon, dividend: CoinsIcon, meeting: UsersIcon } as const;

export function EventsCard() {
	const { data } = useSuspenseQuery(eventsQuery);
	return (
		<Panel aria-labelledby="events-title">
			<PanelHeader
				id="events-title"
				title="Upcoming"
				description="Results, dividends and meetings"
			/>
			<ol className="space-y-3">
				{data.map((event) => {
					const Icon = ICON[event.kind];
					const [weekday, rest] = formatDate(event.date, "weekday").split(", ");
					return (
						<li key={event.id} className="flex items-center gap-3">
							<span className="flex w-12 shrink-0 flex-col items-center rounded-xl bg-foreground/[0.05] py-1 text-center">
								<span className="text-[10px] text-muted-foreground uppercase">{weekday}</span>
								<span className="font-semibold text-sm leading-tight">{rest?.split(" ")[0]}</span>
							</span>
							<div className="min-w-0 flex-1">
								<p className="flex items-center gap-1.5 text-sm">
									<TickerChip symbol={event.symbol} />
									<span className="truncate">{event.label}</span>
								</p>
								<p className="mt-0.5 flex items-center gap-1 text-muted-foreground text-xs capitalize">
									<Icon aria-hidden className="size-3" />
									{event.kind} · {formatDate(event.date, "medium")}
								</p>
							</div>
						</li>
					);
				})}
			</ol>
		</Panel>
	);
}
