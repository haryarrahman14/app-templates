import { themeScript } from "@repo/ui/lib/theme";
import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { NotFoundPage } from "@/components/layout/not-found-page";
import { Providers } from "@/components/layout/providers";
import { accentScript } from "@/lib/preferences-schema";
import { APP_NAME, APP_TAGLINE } from "@/lib/site";
import appCss from "@/styles/app.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: APP_NAME },
			{ name: "description", content: APP_TAGLINE },
		],
		links: [{ rel: "stylesheet", href: appCss }],
		// Inline in <head> of the static shell, so theme (dark by default) and accent apply before first paint.
		scripts: [{ children: themeScript("dark") }, { children: accentScript }],
	}),
	shellComponent: RootDocument,
	component: RootLayout,
	notFoundComponent: NotFoundPage,
});

function RootDocument({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
				{/* Two tags with one name: written here, because head() keeps only the last meta per name. */}
				<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0e0e10" />
				<meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}

function RootLayout() {
	const { queryClient } = Route.useRouteContext();
	return (
		<QueryClientProvider client={queryClient}>
			<Providers>
				<Outlet />
			</Providers>
		</QueryClientProvider>
	);
}
