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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/components/select";
import { toast } from "@repo/ui/components/sonner";
import { Spinner } from "@repo/ui/components/spinner";
import { Switch } from "@repo/ui/components/switch";
import { cn } from "@repo/ui/lib/cn";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { BellRingIcon, PlusIcon, Trash2Icon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { InstrumentMark } from "@/components/kit/instrument-mark";
import { PageHeader } from "@/components/kit/page-header";
import { Panel } from "@/components/kit/panel";
import { ListSkeleton } from "@/components/kit/skeletons";
import { TickerChip } from "@/components/kit/ticker-chip";
import { useCreateAlert, useDeleteAlert, useToggleAlert } from "@/features/alerts/api/mutations";
import { alertCandidates, alertsQuery, currentSamplePrice } from "@/features/alerts/api/queries";
import {
	type NewAlertInput,
	newAlertSchema,
	type PriceAlert,
} from "@/features/alerts/schemas/alert";
import { formatDate } from "@/lib/format";
import { useFormat } from "@/lib/use-format";

function CreateAlertDialog({
	open,
	onOpenChange,
	initialSymbol,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialSymbol: string;
}) {
	const create = useCreateAlert();
	const format = useFormat();
	const defaults: NewAlertInput = {
		symbol: initialSymbol,
		condition: "above",
		price: Number.NaN,
		note: "",
	};
	const form = useForm<NewAlertInput>({
		resolver: zodResolver(newAlertSchema),
		defaultValues: defaults,
	});
	const symbol = useWatch({ control: form.control, name: "symbol" });
	const current = symbol ? currentSamplePrice(symbol) : null;

	const close = (next: boolean) => {
		onOpenChange(next);
		if (!next) form.reset(defaults);
	};

	return (
		<Dialog open={open} onOpenChange={close}>
			<DialogContent className="glass rounded-2xl shadow-float sm:max-w-md">
				<DialogHeader>
					<DialogTitle>New price alert</DialogTitle>
					<DialogDescription>
						Get notified when a sample price crosses your target.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						noValidate
						className="grid gap-4"
						onSubmit={form.handleSubmit((values) =>
							create.mutate(values, {
								onSuccess: (alert) => {
									toast.success(`Alert set for ${alert.symbol}`, {
										description: `When it goes ${alert.condition} ${format.currency(alert.price)}.`,
									});
									close(false);
								},
							}),
						)}
					>
						<FormField
							control={form.control}
							name="symbol"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Instrument</FormLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Choose an instrument" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{alertCandidates.map((c) => (
												<SelectItem key={c.symbol} value={c.symbol}>
													{c.symbol} · {c.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{current != null ? (
										<FormDescription>
											Current sample price {format.currency(current)}
										</FormDescription>
									) : null}
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-2 gap-3">
							<FormField
								control={form.control}
								name="condition"
								render={({ field }) => (
									<FormItem>
										<FormLabel>When price goes</FormLabel>
										<Select value={field.value} onValueChange={field.onChange}>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="above">Above</SelectItem>
												<SelectItem value="below">Below</SelectItem>
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="price"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Target price</FormLabel>
										<FormControl>
											<Input
												type="number"
												inputMode="decimal"
												step="0.01"
												min={0}
												placeholder={current != null ? current.toFixed(2) : "0.00"}
												name={field.name}
												ref={field.ref}
												onBlur={field.onBlur}
												value={Number.isFinite(field.value) ? field.value : ""}
												onChange={(e) => field.onChange(e.target.valueAsNumber)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="note"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Note (optional)</FormLabel>
									<FormControl>
										<Input placeholder="e.g. Review position" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => close(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={create.isPending}>
								{create.isPending ? <Spinner /> : null}
								Create alert
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

function AlertRow({ alert }: { alert: PriceAlert }) {
	const format = useFormat();
	const toggle = useToggleAlert();
	const remove = useDeleteAlert();
	const Icon = alert.condition === "above" ? TrendingUpIcon : TrendingDownIcon;
	const switchId = `alert-${alert.id}`;
	return (
		<li
			className={cn(
				"flex flex-wrap items-center gap-4 px-4 py-3.5 sm:px-6",
				!alert.enabled && "opacity-60",
			)}
		>
			<InstrumentMark symbol={alert.symbol} />
			<div className="min-w-0 flex-1">
				<p className="flex flex-wrap items-center gap-2 text-sm">
					<TickerChip symbol={alert.symbol} />
					<span className="inline-flex items-center gap-1">
						<Icon aria-hidden className="size-3.5 text-muted-foreground" />
						{alert.condition === "above" ? "Above" : "Below"}{" "}
						<span className="font-medium tabular-nums">{format.currency(alert.price)}</span>
					</span>
					{alert.triggered ? (
						<span className="rounded-full bg-warning/15 px-2 py-0.5 font-medium text-[11px] text-warning">
							Triggered
						</span>
					) : null}
				</p>
				<p className="mt-0.5 truncate text-muted-foreground text-xs">
					Now {format.currency(alert.current)} ·{" "}
					{alert.triggered
						? "target reached"
						: `${format.percent(Math.abs(alert.distancePct), { digits: 1 })} to go`}
					{alert.note ? ` · ${alert.note}` : ""} · set {formatDate(alert.createdAt, "day")}
				</p>
			</div>
			<div className="flex items-center gap-2">
				<label htmlFor={switchId} className="sr-only">
					{alert.enabled ? "Disable" : "Enable"} alert for {alert.symbol}
				</label>
				<Switch
					id={switchId}
					checked={alert.enabled}
					disabled={toggle.isPending}
					onCheckedChange={(enabled) =>
						toggle.mutate(
							{ id: alert.id, enabled },
							{
								onSuccess: () =>
									toast.success(`${alert.symbol} alert ${enabled ? "on" : "paused"}`),
							},
						)
					}
				/>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant="ghost" size="icon-sm" aria-label={`Delete ${alert.symbol} alert`}>
							<Trash2Icon />
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Delete this alert?</AlertDialogTitle>
							<AlertDialogDescription>
								{alert.symbol} {alert.condition} {format.currency(alert.price)}. You can create it
								again later.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Keep it</AlertDialogCancel>
							<AlertDialogAction
								variant="destructive"
								onClick={() =>
									remove.mutate(
										{ id: alert.id },
										{ onSuccess: () => toast.success("Alert deleted") },
									)
								}
							>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</li>
	);
}

export function AlertsPage() {
	const { data } = useQuery(alertsQuery);
	const search = useSearch({ from: "/_app/alerts" });
	const navigate = useNavigate({ from: "/alerts" });
	const [open, setOpen] = useState(false);
	const fromUrl = search.new === 1;
	const dialogOpen = open || fromUrl;
	const setDialogOpen = (next: boolean) => {
		setOpen(next);
		if (!next && fromUrl) navigate({ search: {}, replace: true });
	};
	const active = data?.filter((a) => a.enabled).length ?? 0;

	return (
		<>
			<PageHeader
				title="Alerts"
				description={
					data
						? `${active} active of ${data.length}. Sample prices are checked every few seconds.`
						: "Price alerts"
				}
				actions={
					<Button onClick={() => setDialogOpen(true)}>
						<PlusIcon />
						New alert
					</Button>
				}
			/>
			{!data ? (
				<ListSkeleton rows={4} />
			) : data.length === 0 ? (
				<Panel>
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<BellRingIcon />
							</EmptyMedia>
							<EmptyTitle>No alerts yet</EmptyTitle>
							<EmptyDescription>
								Set a target price and we'll flag it when a sample price crosses it.
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<Button onClick={() => setDialogOpen(true)}>
								<PlusIcon />
								New alert
							</Button>
						</EmptyContent>
					</Empty>
				</Panel>
			) : (
				<Panel className="p-0 sm:p-0">
					<ul className="divide-y divide-border/60" aria-label="Price alerts">
						{data.map((alert) => (
							<AlertRow key={alert.id} alert={alert} />
						))}
					</ul>
				</Panel>
			)}
			<CreateAlertDialog
				key={search.symbol ?? "none"}
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				initialSymbol={search.symbol ?? ""}
			/>
		</>
	);
}
