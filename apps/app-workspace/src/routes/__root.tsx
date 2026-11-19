import { Toaster } from "@repo/ui/components/sonner";
import { TooltipProvider } from "@repo/ui/components/tooltip";
import { themeScript } from "@repo/ui/lib/theme";
import type { QueryClient } from "@tanstack/react-query";
import {
	ClientOnly,
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ErrorScreen } from "@/components/layout/error-screen";
import { NotFoundScreen } from "@/components/layout/not-found-screen";
import { appearanceScript } from "@/lib/appearance";
import { APP_NAME, APP_TAGLINE } from "@/lib/site";
import appCss from "@/styles/app.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: APP_NAME },
			{ name: "description", content: APP_TAGLINE },
			{ name: "theme-color", media: "(prefers-color-scheme: light)", content: "#fafafa" },
			{ name: "theme-color", media: "(prefers-color-scheme: dark)", content: "#111111" },
		],
		links: [{ rel: "stylesheet", href: appCss }],
		// Theme, accent and density are set before paint.
		scripts: [{ children: `${themeScript("system")};${appearanceScript}` }],
	}),
	shellComponent: RootDocument,
	component: RootLayout,
	errorComponent: ErrorScreen,
	notFoundComponent: () => <NotFoundScreen />,
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

/**
 * The build writes one static shell for every address, so the routes render in the browser only.
 * The shell's body stays empty (the theme script has already set the background), and the first
 * screen never has to match markup that was rendered for a different route.
 */
function RootLayout() {
	return (
		<TooltipProvider>
			<ClientOnly>
				<Outlet />
				<Toaster />
			</ClientOnly>
		</TooltipProvider>
	);
}
