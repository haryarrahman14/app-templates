import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@repo/ui/components/alert-dialog";
import { Button } from "@repo/ui/components/button";
import { Skeleton } from "@repo/ui/components/skeleton";
import { toast } from "@repo/ui/components/sonner";
import { cn } from "@repo/ui/lib/cn";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, DownloadIcon } from "lucide-react";
import { useState } from "react";
import { useChangePlan } from "@/features/settings/api/mutations";
import { billingQuery } from "@/features/settings/api/queries";
import { SampleNote, SettingsSection } from "@/features/settings/components/settings-section";
import { PLANS } from "@/features/settings/constants/plans";
import type { PlanId } from "@/features/settings/schemas/settings";
import { formatCurrency, formatDate } from "@/lib/format";

function downloadInvoice(invoice: {
	id: string;
	date: number;
	amount: number;
	plan: string;
	status: string;
}) {
	const text = [
		"LEDGERFINCH (TEMPLATE) · SAMPLE INVOICE · NOT A REAL DOCUMENT",
		"",
		`Invoice: ${invoice.id}`,
		`Date: ${formatDate(invoice.date, "medium")}`,
		`Plan: ${invoice.plan}`,
		`Amount: ${formatCurrency(invoice.amount)}`,
		`Status: ${invoice.status}`,
	].join("\n");
	const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
	const link = document.createElement("a");
	link.href = url;
	link.download = `${invoice.id}-sample.txt`;
	link.click();
	URL.revokeObjectURL(url);
}

export function BillingSettings() {
	const { data } = useQuery(billingQuery);
	const changePlan = useChangePlan();
	const [target, setTarget] = useState<PlanId | null>(null);
	if (!data) return <Skeleton className="h-96 w-full rounded-2xl" />;
	const targetPlan = PLANS.find((p) => p.id === target);

	return (
		<div className="space-y-6">
			<SampleNote>
				Plans, prices and invoices are placeholders. Nothing is charged; connect your billing
				provider here.
			</SampleNote>
			<SettingsSection
				title="Plan"
				description={`Renews ${formatDate(data.renewsAt, "medium")} · ${data.card}`}
			>
				<div className="grid gap-3 md:grid-cols-3">
					{PLANS.map((plan) => {
						const current = plan.id === data.plan;
						return (
							<div
								key={plan.id}
								className={cn(
									"flex flex-col rounded-xl border p-4",
									current && "border-tint bg-foreground/[0.03]",
								)}
							>
								<div className="flex items-baseline justify-between">
									<p className="font-semibold">{plan.name}</p>
									<p className="text-sm">
										<span className="font-semibold text-lg tabular-nums">
											{formatCurrency(plan.price, { digits: 0 })}
										</span>
										<span className="text-muted-foreground">/mo</span>
									</p>
								</div>
								<p className="text-muted-foreground text-sm">{plan.blurb}</p>
								<ul className="my-4 space-y-1.5 text-sm">
									{plan.features.map((f) => (
										<li key={f} className="flex items-center gap-2">
											<CheckIcon aria-hidden className="size-3.5 text-tint-ink" />
											{f}
										</li>
									))}
								</ul>
								<Button
									className="mt-auto"
									variant={current ? "secondary" : "outline"}
									disabled={current}
									onClick={() => setTarget(plan.id)}
								>
									{current ? "Current plan" : `Switch to ${plan.name}`}
								</Button>
							</div>
						);
					})}
				</div>
			</SettingsSection>
			<SettingsSection title="Invoices">
				<div className="relative -mx-5 overflow-x-auto sm:-mx-6">
					<table className="w-full min-w-[480px] text-sm">
						<thead>
							<tr className="border-y text-muted-foreground text-xs">
								<th scope="col" className="h-9 px-5 text-left font-medium sm:px-6">
									Invoice
								</th>
								<th scope="col" className="px-3 text-left font-medium">
									Date
								</th>
								<th scope="col" className="px-3 text-right font-medium">
									Amount
								</th>
								<th scope="col" className="px-3 text-left font-medium">
									Status
								</th>
								<th scope="col" className="px-5 text-right font-medium sm:px-6">
									<span className="sr-only">Download</span>
								</th>
							</tr>
						</thead>
						<tbody>
							{data.invoices.map((inv) => (
								<tr key={inv.id} className="border-b border-border/60 last:border-0">
									<td className="px-5 py-2.5 font-mono text-xs sm:px-6">{inv.id}</td>
									<td className="px-3">{formatDate(inv.date, "medium")}</td>
									<td className="px-3 text-right tabular-nums">{formatCurrency(inv.amount)}</td>
									<td className="px-3 capitalize">{inv.status}</td>
									<td className="px-5 text-right sm:px-6">
										<Button
											variant="ghost"
											size="icon-sm"
											aria-label={`Download ${inv.id}`}
											onClick={() => downloadInvoice(inv)}
										>
											<DownloadIcon />
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</SettingsSection>
			<AlertDialog open={target !== null} onOpenChange={(open) => !open && setTarget(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Switch to {targetPlan?.name}?</AlertDialogTitle>
						<AlertDialogDescription>
							Sample only: the plan label changes in this session and nothing is charged.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() =>
								target &&
								changePlan.mutate(target, {
									onSuccess: () => toast.success(`You're on ${targetPlan?.name} (sample)`),
								})
							}
						>
							Switch plan
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
