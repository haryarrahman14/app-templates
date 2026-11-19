import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/features/portfolio/components/portfolio-page";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/portfolio")({
	head: () => ({ meta: [{ title: pageTitle("Portfolio") }] }),
	component: PortfolioPage,
});
