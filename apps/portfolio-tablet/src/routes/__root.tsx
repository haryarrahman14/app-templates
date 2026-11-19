import { Toaster } from "@repo/ui/components/sonner";
import { TooltipProvider } from "@repo/ui/components/tooltip";
import { themeScript } from "@repo/ui/lib/theme";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { preferencesScript } from "@/lib/preferences";
import { APP_NAME, THEME_COLOR } from "@/lib/site";
import appCss from "@/styles/app.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
			{ title: APP_NAME },
			{ name: "theme-color", content: THEME_COLOR.light, media: "(prefers-color-scheme: light)" },
			{ name: "theme-color", content: THEME_COLOR.dark, media: "(prefers-color-scheme: dark)" },
		],
		links: [{ rel: "stylesheet", href: appCss }],
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
