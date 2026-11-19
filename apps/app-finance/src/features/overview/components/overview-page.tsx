import { AllocationCard } from "@/features/overview/components/allocation-card";
import { BriefCard } from "@/features/overview/components/brief-card";
import { EventsCard } from "@/features/overview/components/events-card";
import { MoversCard } from "@/features/overview/components/movers-card";
import { NewsFeed } from "@/features/overview/components/news-feed";
import { PortfolioChartCard } from "@/features/overview/components/portfolio-chart-card";

export function OverviewPage() {
	return (
		<div className="grid gap-6 lg:grid-cols-3">
			<h1 className="sr-only">Overview</h1>
			<div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
				<PortfolioChartCard />
				<div className="grid gap-6 md:grid-cols-2">
					<AllocationCard />
					<MoversCard />
				</div>
				<NewsFeed />
			</div>
			<div className="flex min-w-0 flex-col gap-6">
				<BriefCard />
				<EventsCard />
			</div>
		</div>
	);
}
