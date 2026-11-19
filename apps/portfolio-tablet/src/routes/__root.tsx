import { Toaster } from "@repo/ui/components/sonner";
import { TooltipProvider } from "@repo/ui/components/tooltip";
import { themeScript } from "@repo/ui/lib/theme";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { preferencesScript } from "@/lib/preferences";
import { APP_NAME, APP_TAGLINE, SITE_URL, THEME_COLOR } from "@/lib/site";
import appCss from "@/styles/app.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
			{ title: APP_NAME },
			{ name: "description", content: APP_TAGLINE },
			// What a link preview shows when the address is shared.
			{ property: "og:type", content: "website" },
			{ property: "og:title", content: APP_NAME },
			{ property: "og:description", content: APP_TAGLINE },
			{ property: "og:url", content: SITE_URL },
			{ property: "og:image", content: `${SITE_URL}/og.jpg` },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "theme-color", content: THEME_COLOR.light, media: "(prefers-color-scheme: light)" },
			{ name: "theme-color", content: THEME_COLOR.dark, media: "(prefers-color-scheme: dark)" },
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
		],
		scripts: [{ children: themeScript("system") }, { children: preferencesScript }],
	}),
	shellComponent: RootDocument,
	component: RootLayout,
});

function RootDocument({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
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
			<Toaster position="top-center" />
		</TooltipProvider>
	);
}
