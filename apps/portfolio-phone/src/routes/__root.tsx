import { Toaster } from "@repo/ui/components/sonner";
import { TooltipProvider } from "@repo/ui/components/tooltip";
import { themeScript } from "@repo/ui/lib/theme";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { deepLinkScript } from "@/lib/phone-nav";
import { PreferencesProvider, preferencesScript } from "@/lib/preferences";
import { APP_NAME } from "@/lib/site";
import appCss from "@/styles/app.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
			{ name: "theme-color", content: "#ffffff", media: "(prefers-color-scheme: light)" },
			{ name: "theme-color", content: "#121212", media: "(prefers-color-scheme: dark)" },
			{ title: APP_NAME },
		],
		links: [{ rel: "stylesheet", href: appCss }],
		scripts: [
			{ children: themeScript("system") },
			{ children: preferencesScript },
			...(deepLinkScript ? [{ children: deepLinkScript }] : []),
		],
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
		<PreferencesProvider>
			<TooltipProvider>
				<Outlet />
				<Toaster position="top-center" />
			</TooltipProvider>
		</PreferencesProvider>
	);
}
