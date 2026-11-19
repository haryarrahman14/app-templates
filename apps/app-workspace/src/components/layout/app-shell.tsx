import { SidebarInset, SidebarProvider } from "@repo/ui/components/sidebar";
import { useTheme } from "@repo/ui/hooks/use-theme";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { PageSkeleton } from "@/components/layout/page-skeleton";
import { ShellContext } from "@/components/layout/shell-context";
import { ShortcutsSheet } from "@/components/layout/shortcuts-sheet";
import { TopBar } from "@/components/layout/top-bar";
import { DOC_TEMPLATES } from "@/features/documents/constants/templates";
import { useNewDoc } from "@/features/documents/hooks/use-new-doc";
import { CommandPalette } from "@/features/search/components/command-palette";
import { ShareDialog } from "@/features/sharing/components/share-dialog";
import { isTypingTarget } from "@/lib/format";
import { endSession } from "@/lib/session";

/** The signed-in frame: sidebar, top bar, and the overlays every screen can open. */
export function AppShell({ children }: { children: ReactNode }) {
	return (
		<SidebarProvider defaultOpen={readSidebarOpen()}>
			<ShellFrame>{children}</ShellFrame>
		</SidebarProvider>
	);
}

/** A static frame shown while the signed-in area's code loads on the first visit. */
export function ShellPlaceholder() {
	return (
		<div className="flex min-h-svh" aria-busy="true">
			<div className="hidden w-64 shrink-0 border-r bg-sidebar md:block" />
			<div className="min-w-0 flex-1">
				<div className="h-14 border-b" />
				<PageSkeleton />
			</div>
		</div>
	);
}

/** The sidebar remembers open/collapsed in a cookie it writes itself. */
const readSidebarOpen = () => !document.cookie.split("; ").includes("sidebar_state=false");

function ShellFrame({ children }: { children: ReactNode }) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { resolvedTheme, setTheme } = useTheme();
	const { newDoc } = useNewDoc();
	const [palette, setPalette] = useState(false);
	const [shortcuts, setShortcuts] = useState(false);
	const [share, setShare] = useState<{ open: boolean; doc?: { id: string; title: string } }>({
		open: false,
	});

	const signOut = async () => {
		await endSession();
		await navigate({ to: "/sign-in" });
		queryClient.clear();
	};

	const actions = useMemo(
		() => ({
			openPalette: () => setPalette(true),
			openShortcuts: () => setShortcuts(true),
			openShare: (doc?: { id: string; title: string }) => setShare({ open: true, doc }),
		}),
		[],
	);

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			const mod = event.metaKey || event.ctrlKey;
			if (mod && event.key.toLowerCase() === "k") {
				event.preventDefault();
				setPalette((open) => !open);
				return;
			}
			if (mod && event.shiftKey && event.key.toLowerCase() === "l") {
				event.preventDefault();
				setTheme(resolvedTheme === "dark" ? "light" : "dark");
				return;
			}
			if (mod || event.altKey || isTypingTarget(event.target)) return;
			if (document.querySelector("[role=dialog], [role=menu], [role=listbox]")) return;
			if (event.key === "?") {
				event.preventDefault();
				setShortcuts(true);
			} else if (event.key.toLowerCase() === "n" && !event.shiftKey) {
				event.preventDefault();
				newDoc();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [newDoc, resolvedTheme, setTheme]);

	return (
		<ShellContext.Provider value={actions}>
			<AppSidebar onSignOut={signOut} />
			<SidebarInset className="min-w-0">
				<TopBar />
				<div className="flex-1">{children}</div>
			</SidebarInset>
			<CommandPalette
				open={palette}
				onOpenChange={setPalette}
				templates={DOC_TEMPLATES}
				onNewDoc={(templateId) => newDoc({ templateId })}
				onShortcuts={() => setShortcuts(true)}
				onInvite={() => setShare({ open: true })}
				onSignOut={signOut}
			/>
			<ShortcutsSheet open={shortcuts} onOpenChange={setShortcuts} />
			<ShareDialog
				key={share.doc?.id ?? "workspace"}
				open={share.open}
				onOpenChange={(open) => setShare((s) => ({ ...s, open }))}
				doc={share.doc}
			/>
		</ShellContext.Provider>
	);
}
