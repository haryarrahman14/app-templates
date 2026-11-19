import { useSuspenseQuery } from "@tanstack/react-query";
import { Panel, PanelHeader } from "@/components/kit/panel";
import { TickerChip } from "@/components/kit/ticker-chip";
import { newsQuery } from "@/features/overview/api/queries";

function ago(minutes: number) {
	if (minutes < 60) return `${minutes}m ago`;
	return `${Math.floor(minutes / 60)}h ago`;
}

export function NewsFeed() {
	const { data } = useSuspenseQuery(newsQuery);
	return (
		<Panel aria-labelledby="news-title">
			<PanelHeader
				id="news-title"
				title="Latest"
				description="Invented headlines about invented companies"
			/>
			<ul className="-mx-2 space-y-1">
				{data.map((item) => (
					<li key={item.id}>
						<article className="rounded-xl px-2 py-3 transition-colors hover:bg-foreground/[0.03]">
							<div className="mb-1.5 flex flex-wrap items-center gap-1.5 text-muted-foreground text-xs">
								{item.symbols.map((symbol) => (
									<TickerChip key={symbol} symbol={symbol} />
								))}
								<span>·</span>
								<span>{item.source}</span>
								<span>·</span>
								<span>{ago(item.minutesAgo)}</span>
							</div>
							<h3 className="font-medium text-sm leading-snug">{item.title}</h3>
							<p className="mt-1 text-muted-foreground text-sm">{item.summary}</p>
						</article>
					</li>
				))}
			</ul>
		</Panel>
	);
}
