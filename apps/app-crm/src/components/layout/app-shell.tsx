import { SidebarInset, SidebarProvider } from "@repo/ui/components/sidebar";
import type { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { GlobalOverlays } from "@/components/layout/global-overlays";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({ children }: { children: ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="min-w-0 md:border md:border-sidebar-border md:shadow-soft">
				<Topbar />
				<main id="main" className="min-w-0 flex-1">
					{children}
				</main>
			</SidebarInset>
			<GlobalOverlays />
		</SidebarProvider>
	);
}
