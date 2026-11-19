import { zodResolver } from "@hookform/resolvers/zod";
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
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { toast } from "@repo/ui/components/sonner";
import { Spinner } from "@repo/ui/components/spinner";
import { cn } from "@repo/ui/lib/cn";
import { InfoIcon } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { useSampleTrade } from "@/features/instruments/api/mutations";
import { makeTradeSchema, type TradeInput } from "@/features/instruments/schemas/trade";
import { useFormat } from "@/lib/use-format";

export function TradeDialog({
	open,
	onOpenChange,
	symbol,
	price,
	cash,
	held,
	initialSide,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	symbol: string;
	price: number;
	cash: number;
	held: number;
	initialSide: "buy" | "sell";
}) {
	const format = useFormat();
	const trade = useSampleTrade();
	const form = useForm<TradeInput>({
		resolver: zodResolver(makeTradeSchema({ price, cash, held })),
		defaultValues: { side: initialSide, quantity: 1 },
	});
	const side = useWatch({ control: form.control, name: "side" });
	const quantity = useWatch({ control: form.control, name: "quantity" });
	const total = Number.isFinite(quantity) ? quantity * price : 0;

	const onSubmit = form.handleSubmit((values) =>
		trade.mutate(
			{ symbol, side: values.side, quantity: values.quantity, price },
			{
				onSuccess: () => {
					toast.success(
						`Sample ${values.side === "buy" ? "buy" : "sell"}: ${values.quantity} ${symbol} at ${format.currency(price)}`,
						{
							description: "Only the in-memory sample portfolio changed. No real order was placed.",
						},
					);
					onOpenChange(false);
				},
				onError: (error) => toast.error(error.message),
			},
		),
	);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="glass rounded-2xl shadow-float sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Sample order · {symbol}</DialogTitle>
					<DialogDescription>
						Practice only. This updates the sample portfolio in this tab; nothing is sent to a
						broker.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={onSubmit} className="grid gap-4" noValidate>
						<FormField
							control={form.control}
							name="side"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Side</FormLabel>
									<div
										role="radiogroup"
										aria-label="Order side"
										className="grid grid-cols-2 gap-1 rounded-xl bg-foreground/[0.05] p-1"
									>
										{(["buy", "sell"] as const).map((value) => (
											// biome-ignore lint/a11y/useSemanticElements: segmented control, ARIA radio pattern.
											<button
												key={value}
												type="button"
												role="radio"
												aria-checked={field.value === value}
												onClick={() => {
													field.onChange(value);
													if (form.formState.isSubmitted) void form.trigger("quantity");
												}}
												className={cn(
													"rounded-lg py-1.5 font-medium text-sm capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
													field.value === value
														? "bg-tint text-tint-foreground"
														: "text-muted-foreground hover:text-foreground",
												)}
											>
												{value}
											</button>
										))}
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="quantity"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Shares</FormLabel>
									<FormControl>
										<Input
											type="number"
											inputMode="numeric"
											min={1}
											step={1}
											name={field.name}
											ref={field.ref}
											onBlur={field.onBlur}
											value={Number.isFinite(field.value) ? field.value : ""}
											onChange={(e) => field.onChange(e.target.valueAsNumber)}
										/>
									</FormControl>
									<FormDescription>
										{side === "buy"
											? `Sample cash available: ${format.currency(cash)}`
											: `You hold ${held} shares.`}
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<dl className="grid grid-cols-2 gap-2 rounded-xl bg-foreground/[0.04] p-3 text-sm">
							<dt className="text-muted-foreground">Sample price</dt>
							<dd className="text-right tabular-nums">{format.currency(price)}</dd>
							<dt className="text-muted-foreground">Estimated total</dt>
							<dd className="text-right font-medium tabular-nums">{format.currency(total)}</dd>
						</dl>
						<p className="flex items-start gap-2 text-muted-foreground text-xs">
							<InfoIcon aria-hidden className="mt-0.5 size-3.5 shrink-0" />
							Template feature. Not an offer, recommendation or real trade.
						</p>
						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={trade.isPending}>
								{trade.isPending ? <Spinner /> : null}
								{side === "buy" ? "Place sample buy" : "Place sample sell"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
