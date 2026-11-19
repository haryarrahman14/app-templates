import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageSkeleton } from "@/components/kit/skeletons";
import { barsQuery, instrumentQuery, quoteQuery } from "@/features/instruments/api/queries";
import { InstrumentNotFound } from "@/features/instruments/components/instrument-not-found";
import { InstrumentPage } from "@/features/instruments/components/instrument-page";
import { DEFAULT_INSTRUMENT_RANGE } from "@/features/instruments/constants/chart";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/markets/$symbol")({
	loader: async ({ params, context: { queryClient } }) => {
		const symbol = params.symbol.toUpperCase();
		const instrument = await queryClient.ensureQueryData(instrumentQuery(symbol));
		if (!instrument) throw notFound();
		await Promise.all([
			queryClient.ensureQueryData(quoteQuery(symbol)),
			queryClient.ensureQueryData(barsQuery(symbol, DEFAULT_INSTRUMENT_RANGE)),
		]);
		return { symbol, name: instrument.name };
	},
	head: ({ loaderData }) => ({
		meta: [
			{ title: pageTitle(loaderData ? `${loaderData.symbol} · ${loaderData.name}` : "Not found") },
		],
	}),
	pendingComponent: () => <PageSkeleton variant="detail" />,
	notFoundComponent: InstrumentNotFound,
	component: InstrumentRoute,
});

function InstrumentRoute() {
	const { symbol } = Route.useLoaderData();
	return <InstrumentPage symbol={symbol} />;
}
