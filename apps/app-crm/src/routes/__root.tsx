import { Toaster } from "@repo/ui/components/sonner";
import { TooltipProvider } from "@repo/ui/components/tooltip";
import { themeScript } from "@repo/ui/lib/theme";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { APP_NAME, APP_TAGLINE, SITE_URL } from "@/lib/site";
import appCss from "@/styles/app.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: APP_NAME },
			{ name: "description", content: APP_TAGLINE },
			// What a link preview shows when the address is shared.
			{ property: "og:type", content: "website" },
			{ property: "og:title", content: APP_NAME },
			{ property: "og:description", content: APP_TAGLINE },
			{ property: "og:url", content: SITE_URL },
			{ property: "og:image", content: `${SITE_URL}/og.jpg` },
			{ name: "twitter:card", content: "summary_large_image" },
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
		],
		// Sets the theme class before first paint.
		scripts: [{ children: themeScript("system") }],
	}),
	shellComponent: RootDocument,
	component: RootLayout,
});

function RootDocument({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
				{/* Written here, not in head(): head() keeps one meta per name. */}
				<meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
				<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0f0f0f" />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}

function RootLayout() {
	return (
		<TooltipProvider>
			<Outlet />
			<Toaster />
		</TooltipProvider>
	);
}
