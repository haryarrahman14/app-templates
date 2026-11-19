import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { toast } from "@repo/ui/components/sonner";
import { useTheme } from "@repo/ui/hooks/use-theme";
import { cn } from "@repo/ui/lib/cn";
import type { Theme } from "@repo/ui/lib/theme";
import { CopyIcon, MailIcon, MoonIcon, SunIcon, XIcon } from "lucide-react";
import { type ReactNode, useEffect } from "react";
import { APPS, DOCK_APPS } from "@/lib/apps";
import { useNow } from "@/lib/use-now";
import { useWindows } from "@/lib/window-store";

function Menu({
	label,
	children,
	className,
	bold,
}: {
	label: ReactNode;
	children: ReactNode;
	className?: string;
	bold?: boolean;
}) {
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger
				className={cn(
					"h-6 rounded-md px-2.5 text-[13px] outline-none transition-colors hover:bg-foreground/10 focus-visible:bg-foreground/10 data-[state=open]:bg-foreground/10",
					bold ? "font-semibold" : "font-medium text-foreground/85",
					className,
				)}
			>
				{label}
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="start"
				sideOffset={6}
				className="glass w-auto min-w-60 rounded-xl p-1.5 shadow-float"
			>
				{children}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

/** Top bar: owner name as the app name, working menus, theme toggle and clock. */
export function MenuBar({ ownerName, email }: { ownerName: string; email: string }) {
	const { open, close, focusedId } = useWindows();
	const { theme, resolvedTheme, setTheme } = useTheme();
	const now = useNow();

	// ⌘, (Ctrl+, elsewhere) opens Settings, as the menu promises.
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "," && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				open("settings");
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [open]);

	const copyEmail = async () => {
		try {
			await navigator.clipboard.writeText(email);
			toast.success("Email copied", { description: email });
		} catch {
			toast(email, { description: "Copy it from here." });
		}
	};

	return (
		<header className="fixed inset-x-0 top-0 z-40 flex h-8 items-center justify-between gap-2 border-foreground/5 border-b bg-card/50 px-2 backdrop-blur-2xl backdrop-saturate-150 dark:bg-background/45">
			<nav aria-label="Menu bar" className="flex min-w-0 items-center">
				<Menu label={ownerName} bold>
					<DropdownMenuItem onSelect={() => open("home")}>About this desktop</DropdownMenuItem>
					<DropdownMenuItem onSelect={() => open("settings")}>
						Settings…
						<DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem disabled={!focusedId} onSelect={() => focusedId && close(focusedId)}>
						<XIcon />
						Close window
						<DropdownMenuShortcut>Esc</DropdownMenuShortcut>
					</DropdownMenuItem>
				</Menu>
				<Menu label="About" className="max-sm:hidden">
					<DropdownMenuItem onSelect={() => open("about")}>About me</DropdownMenuItem>
					<DropdownMenuItem onSelect={() => open("experience")}>Experience & CV</DropdownMenuItem>
					<DropdownMenuItem onSelect={() => open("notes")}>Notes</DropdownMenuItem>
				</Menu>
				<Menu label="View" className="max-sm:hidden">
					<DropdownMenuLabel className="text-xs">Theme</DropdownMenuLabel>
					<DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as Theme)}>
						<DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="system">Match system</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem onSelect={() => open("settings")}>Wallpaper & accent…</DropdownMenuItem>
				</Menu>
				<Menu label="Go">
					{DOCK_APPS.map((id) => {
						const app = APPS[id];
						return (
							<DropdownMenuItem key={id} onSelect={() => open(id)}>
								<app.icon />
								{app.title}
								<span className="ml-auto whitespace-nowrap pl-6 text-muted-foreground text-xs">
									{app.hint}
								</span>
							</DropdownMenuItem>
						);
					})}
				</Menu>
				<Menu label="Contact" className="max-sm:hidden">
					<DropdownMenuItem onSelect={() => open("contact")}>
						<MailIcon />
						Write a message
					</DropdownMenuItem>
					<DropdownMenuItem onSelect={copyEmail}>
						<CopyIcon />
						Copy email address
					</DropdownMenuItem>
				</Menu>
			</nav>
			<div className="flex shrink-0 items-center gap-1 text-[13px]">
				<button
					type="button"
					aria-label={resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
					onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
					className="flex size-6 items-center justify-center rounded-md text-foreground/80 hover:bg-foreground/10"
				>
					{resolvedTheme === "dark" ? (
						<SunIcon className="size-3.5" />
					) : (
						<MoonIcon className="size-3.5" />
					)}
				</button>
				<time
					className="min-w-16 px-1.5 text-right font-medium text-foreground/85 tabular-nums"
					dateTime={now?.toISOString()}
					suppressHydrationWarning
				>
					{now && (
						<>
							<span className="max-sm:hidden">
								{now.toLocaleDateString("en-GB", {
									weekday: "short",
									day: "numeric",
									month: "short",
								})}{" "}
							</span>
							{now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
						</>
					)}
				</time>
			</div>
		</header>
	);
}
