import { Button } from "@repo/ui/components/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@repo/ui/components/sheet";
import { toast } from "@repo/ui/components/sonner";
import { Link } from "@tanstack/react-router";
import { CopyIcon } from "lucide-react";
import { Change } from "@/components/kit/change";
import { TypeBadge } from "@/features/transactions/components/type-badge";
import type { Transaction } from "@/features/transactions/schemas/transaction";
import { formatDate } from "@/lib/format";
import { useFormat } from "@/lib/use-format";

export function TransactionSheet({
	transaction,
	onOpenChange,
}: {
	transaction: Transaction | null;
	onOpenChange: (open: boolean) => void;
}) {
	const format = useFormat();
	const tx = transaction;
	return (
		<Sheet open={tx !== null} onOpenChange={onOpenChange}>
			<SheetContent className="glass w-full sm:max-w-md">
				{tx ? (
					<>
						<SheetHeader>
							<SheetTitle className="flex items-center gap-2">
								<TypeBadge type={tx.type} />
								<span className="font-mono text-muted-foreground text-sm">{tx.id}</span>
							</SheetTitle>
							<SheetDescription>{formatDate(tx.date, "long")}</SheetDescription>
						</SheetHeader>
						<div className="px-4">
							<p className="text-muted-foreground text-sm">Amount</p>
							<p className="font-semibold text-3xl tracking-tight">
								<Change value={tx.amount} showIcon={false}>
									{format.currency(tx.amount, { signed: true, compact: false })}
								</Change>
							</p>
							<dl className="mt-6 divide-y rounded-xl border text-sm">
								{[
									[
										"Status",
										<span key="s" className="capitalize">
											{tx.status}
										</span>,
									],
									["Account", tx.account],
									[
										"Instrument",
										tx.symbol ? (
											<Link
												key="i"
												to="/markets/$symbol"
												params={{ symbol: tx.symbol }}
												className="text-tint-ink underline-offset-4 hover:underline"
											>
												{tx.symbol}
											</Link>
										) : (
											"—"
										),
									],
									["Shares", tx.quantity != null ? format.number(tx.quantity) : "—"],
									["Price", tx.price != null ? format.currency(tx.price) : "—"],
									["Time (UTC)", formatDate(tx.date, "dayTime")],
									["Note", tx.note || "—"],
								].map(([label, value]) => (
									<div key={String(label)} className="flex justify-between gap-4 px-3 py-2.5">
										<dt className="text-muted-foreground">{label}</dt>
										<dd className="text-right tabular-nums">{value}</dd>
									</div>
								))}
							</dl>
						</div>
						<SheetFooter>
							<Button
								variant="outline"
								onClick={() => {
									void navigator.clipboard?.writeText(tx.id);
									toast.success(`Copied ${tx.id}`);
								}}
							>
								<CopyIcon />
								Copy reference
							</Button>
						</SheetFooter>
					</>
				) : null}
			</SheetContent>
		</Sheet>
	);
}
