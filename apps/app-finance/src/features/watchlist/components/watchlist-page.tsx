import { zodResolver } from "@hookform/resolvers/zod";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@repo/ui/components/alert-dialog";
import { Button } from "@repo/ui/components/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@repo/ui/components/command";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@repo/ui/components/dialog";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@repo/ui/components/empty-state";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/popover";
import { toast } from "@repo/ui/components/sonner";
import { cn } from "@repo/ui/lib/cn";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
	ArrowDownIcon,
	ArrowUpIcon,
	ListPlusIcon,
	PlusIcon,
	StarIcon,
	Trash2Icon,
	XIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Change } from "@/components/kit/change";
import { Sparkline } from "@/components/kit/charts/sparkline";
import { InstrumentMark } from "@/components/kit/instrument-mark";
import { PageHeader } from "@/components/kit/page-header";
import { Panel } from "@/components/kit/panel";
import { ListSkeleton } from "@/components/kit/skeletons";
import {
	useAddSymbol,
	useCreateList,
	useDeleteList,
	useMoveSymbol,
	useRemoveSymbol,
} from "@/features/watchlist/api/mutations";
import { watchCandidates, watchlistsQuery } from "@/features/watchlist/api/queries";
import {
	type NewListInput,
	newListSchema,
	type Watchlist,
} from "@/features/watchlist/schemas/watchlist";
import { useFormat } from "@/lib/use-format";

function NewListDialog({ onCreated }: { onCreated: (id: string) => void }) {
	const [open, setOpen] = useState(false);
	const create = useCreateList();
	const form = useForm<NewListInput>({
		resolver: zodResolver(newListSchema),
		defaultValues: { name: "" },
	});
	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				setOpen(next);
				if (!next) form.reset();
			}}
		>
			<DialogTrigger asChild>
				<Button>
					<ListPlusIcon />
					New list
				</Button>
			</DialogTrigger>
			<DialogContent className="glass rounded-2xl shadow-float">
				<DialogHeader>
					<DialogTitle>New watchlist</DialogTitle>
					<DialogDescription>Group instruments you want to keep an eye on.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						noValidate
						className="grid gap-4"
						onSubmit={form.handleSubmit((values) =>
							create.mutate(values, {
								onSuccess: (list) => {
									toast.success(`Created “${list.name}”`);
									onCreated(list.id);
									setOpen(false);
									form.reset();
								},
							}),
						)}
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="e.g. Clean energy" autoFocus {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => setOpen(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={create.isPending}>
								Create list
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

function AddSymbolPicker({ list }: { list: Watchlist }) {
	const [open, setOpen] = useState(false);
	const add = useAddSymbol();
	const present = new Set(list.rows.map((r) => r.symbol));
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm">
					<PlusIcon />
					Add instrument
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-72 p-0">
				<Command>
					<CommandInput placeholder="Search instruments…" aria-label="Search instruments to add" />
					<CommandList>
						<CommandEmpty>No instrument found.</CommandEmpty>
						<CommandGroup>
							{watchCandidates
								.filter((c) => !present.has(c.symbol))
								.map((c) => (
									<CommandItem
										key={c.symbol}
										value={`${c.symbol} ${c.name}`}
										onSelect={() =>
											add.mutate(
												{ id: list.id, symbol: c.symbol },
												{
													onSuccess: () => {
														toast.success(`Added ${c.symbol} to ${list.name}`);
														setOpen(false);
													},
												},
											)
										}
									>
										<span className="w-12 font-medium font-mono text-xs">{c.symbol}</span>
										<span className="truncate text-muted-foreground">{c.name}</span>
									</CommandItem>
								))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

function ListBody({ list }: { list: Watchlist }) {
	const format = useFormat();
	const remove = useRemoveSymbol();
	const move = useMoveSymbol();
	const del = useDeleteList();

	return (
		<Panel className="p-0 sm:p-0" aria-labelledby={`list-${list.id}`}>
			<div className="flex flex-wrap items-center justify-between gap-3 border-b p-4 sm:px-6">
				<div>
					<h2 id={`list-${list.id}`} className="font-semibold">
						{list.name}
					</h2>
					<p className="text-muted-foreground text-sm">
						{list.rows.length} {list.rows.length === 1 ? "instrument" : "instruments"}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<AddSymbolPicker list={list} />
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="ghost" size="icon-sm" aria-label={`Delete list ${list.name}`}>
								<Trash2Icon />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Delete “{list.name}”?</AlertDialogTitle>
								<AlertDialogDescription>
									The list and its {list.rows.length} instruments are removed from your sample
									account.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									variant="destructive"
									onClick={() =>
										del.mutate(
											{ id: list.id },
											{ onSuccess: () => toast.success(`Deleted “${list.name}”`) },
										)
									}
								>
									Delete list
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>
			{list.rows.length === 0 ? (
				<Empty className="py-14">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<StarIcon />
						</EmptyMedia>
						<EmptyTitle>Nothing on this list yet</EmptyTitle>
						<EmptyDescription>
							Add instruments here, or use “Add to watchlist” on any instrument page.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<AddSymbolPicker list={list} />
					</EmptyContent>
				</Empty>
			) : (
				<ol className="divide-y divide-border/60">
					{list.rows.map((row, index) => (
						<li key={row.symbol} className="group flex items-center gap-3 px-4 py-2.5 sm:px-6">
							<Link
								to="/markets/$symbol"
								params={{ symbol: row.symbol }}
								className="flex min-w-0 flex-1 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							>
								<InstrumentMark symbol={row.symbol} />
								<span className="min-w-0 flex-1">
									<span className="block font-medium text-sm">{row.symbol}</span>
									<span className="block truncate text-muted-foreground text-xs">{row.name}</span>
								</span>
								<Sparkline values={row.spark} width={88} height={24} className="hidden sm:block" />
								<span className="w-24 text-right text-sm">
									<span className="block tabular-nums">{format.currency(row.price)}</span>
									<Change value={row.changePct} className="justify-end text-xs">
										{format.percent(row.changePct, { signed: true })}
									</Change>
								</span>
							</Link>
							<div className="flex items-center opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
								<Button
									variant="ghost"
									size="icon-xs"
									aria-label={`Move ${row.symbol} up`}
									disabled={index === 0 || move.isPending}
									onClick={() => move.mutate({ id: list.id, symbol: row.symbol, by: -1 })}
								>
									<ArrowUpIcon />
								</Button>
								<Button
									variant="ghost"
									size="icon-xs"
									aria-label={`Move ${row.symbol} down`}
									disabled={index === list.rows.length - 1 || move.isPending}
									onClick={() => move.mutate({ id: list.id, symbol: row.symbol, by: 1 })}
								>
									<ArrowDownIcon />
								</Button>
								<Button
									variant="ghost"
									size="icon-xs"
									aria-label={`Remove ${row.symbol} from ${list.name}`}
									onClick={() =>
										remove.mutate(
											{ id: list.id, symbol: row.symbol },
											{ onSuccess: () => toast.success(`Removed ${row.symbol} from ${list.name}`) },
										)
									}
								>
									<XIcon />
								</Button>
							</div>
						</li>
					))}
				</ol>
			)}
		</Panel>
	);
}

export function WatchlistPage() {
	const { data } = useQuery(watchlistsQuery);
	const [selected, setSelected] = useState<string | null>(null);
	const active = data?.find((l) => l.id === selected) ?? data?.[0];

	return (
		<>
			<PageHeader
				title="Watchlist"
				description="Keep lists of instruments and see how they move."
				actions={<NewListDialog onCreated={setSelected} />}
			/>
			{!data ? (
				<ListSkeleton rows={6} />
			) : data.length === 0 || !active ? (
				<Panel>
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<StarIcon />
							</EmptyMedia>
							<EmptyTitle>No watchlists</EmptyTitle>
							<EmptyDescription>Create a list to start tracking instruments.</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<NewListDialog onCreated={setSelected} />
						</EmptyContent>
					</Empty>
				</Panel>
			) : (
				<div className="space-y-4">
					<div role="tablist" aria-label="Watchlists" className="flex gap-2 overflow-x-auto pb-1">
						{data.map((list) => (
							<button
								key={list.id}
								type="button"
								role="tab"
								aria-selected={list.id === active.id}
								onClick={() => setSelected(list.id)}
								className={cn(
									"shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
									list.id === active.id
										? "border-transparent bg-foreground text-background"
										: "glass text-muted-foreground hover:text-foreground",
								)}
							>
								{list.name}
								<span className="ml-1.5 text-xs opacity-60">{list.rows.length}</span>
							</button>
						))}
					</div>
					<div role="tabpanel">
						<ListBody list={active} />
					</div>
				</div>
			)}
		</>
	);
}
