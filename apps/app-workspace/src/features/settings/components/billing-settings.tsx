import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { toast } from "@repo/ui/components/sonner";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui/components/table";
import { cn } from "@repo/ui/lib/cn";
import { useSuspenseQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { CheckIcon, DownloadIcon } from "lucide-react";
import { billingQuery } from "@/features/settings/api/queries";
import { SettingsCard } from "@/features/settings/components/settings-card";

const money = (amount: number) => `$${amount.toFixed(2)}`;

function Usage({
	label,
	used,
	total,
	unit,
}: {
	label: string;
	used: number;
	total: number;
	unit: string;
}) {
	const percent = Math.min(100, Math.round((used / total) * 100));
	return (
		<div className="space-y-2">
			<div className="flex items-baseline justify-between text-sm">
				<span className="font-medium">{label}</span>
				<span className="text-muted-foreground tabular-nums">
					{used} of {total} {unit}
				</span>
			</div>
			<div
				role="progressbar"
				aria-label={label}
				aria-valuenow={percent}
				aria-valuemin={0}
				aria-valuemax={100}
				className="h-2 overflow-hidden rounded-full bg-muted"
			>
				<div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
			</div>
		</div>
	);
}

/** Sample billing, prefetched on the server. Swap the queryFn for your billing provider. */
export function BillingSettings() {
	const { data } = useSuspenseQuery(billingQuery);

	return (
		<>
			<SettingsCard title="Usage" description="Your workspace this billing period.">
				<div className="grid gap-5 sm:grid-cols-2">
					<Usage label="Seats" used={data.seats.used} total={data.seats.total} unit="members" />
					<Usage
						label="Storage"
						used={data.storage.usedGb}
						total={data.storage.totalGb}
						unit="GB"
					/>
				</div>
			</SettingsCard>

			<SettingsCard title="Plan" description="Change at any time. We prorate the difference.">
				<div className="grid gap-3 lg:grid-cols-3">
					{data.plans.map((plan) => {
						const current = plan.id === data.currentPlan;
						return (
							<div
								key={plan.id}
								className={cn(
									"flex flex-col gap-4 rounded-2xl border p-4",
									current && "border-tint ring-1 ring-tint",
								)}
							>
								<div>
									<p className="flex items-center gap-2 font-semibold">
										{plan.name}
										{current ? <Badge>Current</Badge> : null}
									</p>
									<p className="text-muted-foreground text-xs">{plan.blurb}</p>
								</div>
								<p>
									<span className="font-semibold text-2xl tracking-tight">${plan.price}</span>
									<span className="text-muted-foreground text-sm"> / member / month</span>
								</p>
								<ul className="flex-1 space-y-1.5 text-sm">
									{plan.features.map((feature) => (
										<li key={feature} className="flex items-start gap-2">
											<CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" /> {feature}
										</li>
									))}
								</ul>
								<Button
									variant={current ? "outline" : "default"}
									disabled={current}
									onClick={() =>
										toast("Sample billing", {
											description: `Connect your billing provider to switch to ${plan.name}.`,
										})
									}
								>
									{current ? "Your plan" : `Switch to ${plan.name}`}
								</Button>
							</div>
						);
					})}
				</div>
			</SettingsCard>

			<SettingsCard title="Invoices" description="Download a PDF for your records.">
				<div className="-mx-5 overflow-x-auto sm:-mx-6">
					<Table>
						<TableHeader>
							<TableRow className="hover:bg-transparent">
								<TableHead className="pl-5 sm:pl-6">Invoice</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Amount</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="pr-5 text-right sm:pr-6">
									<span className="sr-only">Download</span>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.invoices.map((invoice) => (
								<TableRow key={invoice.id}>
									<TableCell className="pl-5 font-medium sm:pl-6">{invoice.id}</TableCell>
									<TableCell className="text-muted-foreground">
										{format(parseISO(invoice.date), "MMM d, yyyy")}
									</TableCell>
									<TableCell className="tabular-nums">{money(invoice.amount)}</TableCell>
									<TableCell>
										<Badge variant={invoice.status === "paid" ? "secondary" : "outline"}>
											{invoice.status === "paid" ? "Paid" : "Open"}
										</Badge>
									</TableCell>
									<TableCell className="pr-5 text-right sm:pr-6">
										<Button
											variant="ghost"
											size="icon-sm"
											aria-label={`Download ${invoice.id}`}
											onClick={() =>
												toast("Sample invoice", {
													description: "Invoices come from your billing provider.",
												})
											}
										>
											<DownloadIcon />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</SettingsCard>
		</>
	);
}
