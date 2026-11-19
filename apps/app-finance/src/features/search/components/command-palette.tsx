import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@repo/ui/components/command";
import { useTheme } from "@repo/ui/hooks/use-theme";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { BellPlusIcon, MoonIcon, PlusCircleIcon, SunIcon } from "lucide-react";
import { useState } from "react";
import { Change } from "@/components/kit/change";
import { InstrumentMark } from "@/components/kit/instrument-mark";
import { searchIndexQuery } from "@/features/search/api/queries";
import type { AppPath } from "@/lib/app-path";
import { useFormat } from "@/lib/use-format";

export type PaletteNavItem = { href: AppPath; label: string; icon: LucideIcon };

function Kbd({ children }: { children: React.ReactNode }) {
	return (
		<kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border bg-foreground/[0.04] px-1 font-medium font-sans text-[10px] text-muted-foreground">
			{children}
		</kbd>
	);
}

export function CommandPalette({
	open,
	onOpenChange,
	navItems,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	navItems: PaletteNavItem[];
}) {
	const navigate = useNavigate();
	const format = useFormat();
	const { resolvedTheme, setTheme } = useTheme();
	const [search, setSearch] = useState("");
	const { data: entries, isPending } = useQuery({ ...searchIndexQuery, enabled: open });

	const run = (action: () => void) => {
		onOpenChange(false);
		setSearch("");
		action();
	};

	return (
		<CommandDialog
			open={open}
			onOpenChange={(next) => {
				onOpenChange(next);
				if (!next) setSearch("");
			}}
			title="Search"
			description="Search instruments, pages and actions"
			className="glass top-[18%] max-w-[calc(100%-1.5rem)] rounded-2xl! shadow-float sm:max-w-xl"
		>
			<Command className="bg-transparent">
				<CommandInput
					value={search}
					onValueChange={setSearch}
					placeholder="Search tickers, companies, pages…"
					aria-label="Search"
				/>
				<CommandList className="max-h-[min(60vh,420px)]">
					<CommandEmpty>
						<p className="font-medium">No matches for “{search}”</p>
						<p className="mt-1 text-muted-foreground text-xs">
							Try a ticker like NVRA or a page like Reports.
						</p>
					</CommandEmpty>

					{search === "" ? (
						<div className="px-3 pt-3 pb-1 text-muted-foreground text-xs">
							Type to search all instruments. Press <Kbd>↵</Kbd> to open, <Kbd>esc</Kbd> to close.
						</div>
					) : null}

					<CommandGroup heading="Instruments">
						{isPending ? (
							<CommandItem disabled value="loading">
								<span className="text-muted-foreground">Loading instruments…</span>
							</CommandItem>
						) : null}
						{(search === "" ? entries?.slice(0, 5) : entries)?.map((entry) => (
							<CommandItem
								key={entry.symbol}
								value={`${entry.symbol} ${entry.name} ${entry.sector}`}
								onSelect={() =>
									run(() => navigate({ to: "/markets/$symbol", params: { symbol: entry.symbol } }))
								}
								className="gap-3 py-2"
							>
								<InstrumentMark symbol={entry.symbol} className="size-7" />
								<span className="min-w-0 flex-1">
									<span className="block truncate font-medium">{entry.name}</span>
									<span className="block text-muted-foreground text-xs">
										{entry.symbol} · {entry.sector}
									</span>
								</span>
								<span className="text-right text-xs">
									<span className="block tabular-nums">{format.currency(entry.price)}</span>
									<Change value={entry.changePct} showIcon={false}>
										{format.percent(entry.changePct, { signed: true })}
									</Change>
								</span>
							</CommandItem>
						))}
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Go to">
						{navItems.map((item) => (
							<CommandItem
								key={item.href}
								value={`Go to ${item.label}`}
								onSelect={() => run(() => navigate({ to: item.href }))}
							>
								<item.icon />
								{item.label}
							</CommandItem>
						))}
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Actions">
						<CommandItem
							value="Toggle theme dark light"
							onSelect={() => run(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"))}
						>
							{resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
							Switch to {resolvedTheme === "dark" ? "light" : "dark"} theme
						</CommandItem>
						<CommandItem
							value="New price alert"
							onSelect={() => run(() => navigate({ to: "/alerts", search: { new: 1 } }))}
						>
							<BellPlusIcon />
							New price alert
						</CommandItem>
						<CommandItem
							value="Add transaction"
							onSelect={() => run(() => navigate({ to: "/transactions", search: { new: 1 } }))}
						>
							<PlusCircleIcon />
							Add transaction
						</CommandItem>
					</CommandGroup>
				</CommandList>
				<div className="flex items-center gap-3 border-t px-3 py-2 text-[11px] text-muted-foreground">
					<span className="inline-flex items-center gap-1">
						<Kbd>↑</Kbd>
						<Kbd>↓</Kbd> navigate
					</span>
					<span className="inline-flex items-center gap-1">
						<Kbd>↵</Kbd> open
					</span>
					<span className="ml-auto inline-flex items-center gap-1">
						<Kbd>⌘</Kbd>
						<Kbd>K</Kbd> toggle
					</span>
				</div>
			</Command>
		</CommandDialog>
	);
}
