import { createFileRoute } from "@tanstack/react-router";
import { WatchlistPage } from "@/features/watchlist/components/watchlist-page";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/watchlist")({
	head: () => ({ meta: [{ title: pageTitle("Watchlist") }] }),
	component: WatchlistPage,
});
