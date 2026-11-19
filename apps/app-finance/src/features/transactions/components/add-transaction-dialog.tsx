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
import { useForm, useWatch } from "react-hook-form";
import { useAddTransaction } from "@/features/transactions/api/mutations";
import { TYPE_LABEL } from "@/features/transactions/constants/types";
import {
	type NewTransactionInput,
	newTransactionSchema,
} from "@/features/transactions/schemas/transaction";
import { toInputDate } from "@/features/transactions/utils/date-range";
import { SAMPLE_AS_OF } from "@/lib/sample-data/calendar";
import { UNIVERSE } from "@/lib/sample-data/universe";

const DEFAULTS: NewTransactionInput = {
	type: "deposit",
	date: toInputDate(SAMPLE_AS_OF),
	amount: Number.NaN,
	account: "Brokerage",
	symbol: "",
	note: "",
};

export function AddTransactionDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const add = useAddTransaction();
	const form = useForm<NewTransactionInput>({
		resolver: zodResolver(newTransactionSchema),
		defaultValues: DEFAULTS,
	});
	const type = useWatch({ control: form.control, name: "type" });

	const close = (next: boolean) => {
		onOpenChange(next);
		if (!next) form.reset(DEFAULTS);
	};

	return (
		<Dialog open={open} onOpenChange={close}>
			<DialogContent className="glass rounded-2xl shadow-float sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Record a cash movement</DialogTitle>
					<DialogDescription>
						Adds a line to the sample ledger and updates sample cash. Trades are placed from an
						instrument page.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						noValidate
						className="grid gap-4"
						onSubmit={form.handleSubmit((values) =>
							add.mutate(values, {
								onSuccess: (tx) => {
									toast.success(`${TYPE_LABEL[tx.type]} recorded`, {
										description: `Reference ${tx.id}`,
									});
									close(false);
								},
								onError: (error) => toast.error(error.message),
							}),
						)}
					>
						<div className="grid grid-cols-2 gap-3">
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Type</FormLabel>
										<Select value={field.value} onValueChange={field.onChange}>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{(["deposit", "withdrawal", "dividend", "fee"] as const).map((t) => (
													<SelectItem key={t} value={t}>
														{TYPE_LABEL[t]}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="date"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Date</FormLabel>
										<FormControl>
											<Input type="date" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<FormField
								control={form.control}
								name="amount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Amount</FormLabel>
										<FormControl>
											<Input
												type="number"
												inputMode="decimal"
												step="0.01"
												min={0}
												placeholder="0.00"
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
							<FormField
								control={form.control}
								name="account"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Account</FormLabel>
										<Select value={field.value} onValueChange={field.onChange}>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="Brokerage">Brokerage</SelectItem>
												<SelectItem value="Savings">Savings</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						{type === "dividend" ? (
							<FormField
								control={form.control}
								name="symbol"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Paid by</FormLabel>
										<Select value={field.value} onValueChange={field.onChange}>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Choose an instrument" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{UNIVERSE.map((e) => (
													<SelectItem key={e.symbol} value={e.symbol}>
														{e.symbol} · {e.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						) : null}
						<FormField
							control={form.control}
							name="note"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Note (optional)</FormLabel>
									<FormControl>
										<Input placeholder="e.g. Monthly transfer" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => close(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={add.isPending}>
								{add.isPending ? <Spinner /> : null}
								Record
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
