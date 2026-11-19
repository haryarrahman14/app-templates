import { Button } from "@repo/ui/components/button";
import { Skeleton } from "@repo/ui/components/skeleton";
import { toast } from "@repo/ui/components/sonner";
import { cn } from "@repo/ui/lib/cn";
import { useQuery } from "@tanstack/react-query";
import { Check, Download } from "lucide-react";
import { Pill } from "@/components/kit/pill";
import { Progress } from "@/components/kit/progress";
import { billingQuery } from "@/features/settings/api/queries";
import { SettingsCard, SettingsSection } from "@/features/settings/components/settings-layout";
import { formatDate, formatMoney } from "@/lib/format";

const PLANS = [
	{
		id: "starter",
		name: "Starter",
		price: 0,
		blurb: "For one person getting organised.",
		features: ["1 seat", "500 records", "Email logging"],
	},
	{
		id: "team",
		name: "Team",
		price: 24,
		blurb: "For small teams sharing a pipeline.",
		features: ["Up to 10 seats", "5,000 records", "Reports and lists", "API access"],
	},
	{
		id: "business",
		name: "Business",
		price: 49,
		blurb: "For teams that need control.",
		features: ["Unlimited seats", "Unlimited records", "Roles and audit log", "Priority support"],
	},
] as const;

export function BillingPage() {
	const { data } = useQuery(billingQuery);

	return (
		<div className="flex flex-col gap-10">
			<SettingsSection
				title="Plan"
				description={
					data
						? `You are on a Team trial with ${data.trialDaysLeft} days left. Prices are per seat per month.`
						: "Loading…"
				}
			>
				<div className="grid gap-4 lg:grid-cols-3">
					{PLANS.map((plan) => {
						const current = data?.plan === plan.id;
						return (
							<div
								key={plan.id}
								className={cn(
									"flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-soft",
									current && "ring-2 ring-primary/60",
								)}
							>
								<div className="flex items-center justify-between">
									<p className="font-semibold">{plan.name}</p>
									{current ? <Pill tone="blue">Current</Pill> : null}
								</div>
								<p>
									<span className="font-semibold text-3xl tracking-tight">${plan.price}</span>
									<span className="text-muted-foreground text-sm"> / seat / month</span>
								</p>
								<p className="text-muted-foreground text-sm">{plan.blurb}</p>
								<ul className="flex flex-1 flex-col gap-1.5 text-sm">
									{plan.features.map((feature) => (
										<li key={feature} className="flex items-center gap-2">
											<Check className="size-4 text-primary" /> {feature}
										</li>
									))}
								</ul>
								<Button
									variant={current ? "outline" : "default"}
									disabled={current}
									onClick={() =>
										toast("Plan changes are not part of the sample", { description: plan.name })
									}
								>
									{current ? "Your plan" : `Switch to ${plan.name}`}
								</Button>
							</div>
						);
					})}
				</div>
			</SettingsSection>

			<SettingsSection title="Usage" description="Resets on the first of each month.">
				<SettingsCard className="grid gap-5 sm:grid-cols-3">
					{data ? (
						<>
							<Meter label="Seats" used={data.seatsUsed} total={data.seatsTotal} />
							<Meter label="Records" used={data.recordsUsed} total={data.recordsTotal} />
							<Meter label="Emails sent" used={data.emailsUsed} total={data.emailsTotal} />
						</>
					) : (
						[0, 1, 2].map((index) => <Skeleton key={index} className="h-12 rounded-lg" />)
					)}
				</SettingsCard>
			</SettingsSection>

			<SettingsSection title="Invoices" description="Sample invoices for this workspace.">
				<div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
					<ul className="divide-y">
						{(data?.invoices ?? []).map((invoice) => (
							<li key={invoice.id} className="flex items-center gap-3 px-4 py-3 text-sm">
								<span className="w-20 font-medium tabular-nums">{invoice.number}</span>
								<span className="flex-1 text-muted-foreground">{formatDate(invoice.date)}</span>
								<span className="tabular-nums">{formatMoney(invoice.amount)}</span>
								{invoice.status === "paid" ? (
									<Pill tone="green">Paid</Pill>
								) : (
									<Pill tone="orange">Due</Pill>
								)}
								<Button
									variant="ghost"
									size="icon-sm"
									aria-label={`Download ${invoice.number}`}
									onClick={() => toast("Invoice PDFs are not part of the sample")}
								>
									<Download />
								</Button>
							</li>
						))}
					</ul>
				</div>
			</SettingsSection>
		</div>
	);
}

function Meter({ label, used, total }: { label: string; used: number; total: number }) {
	const percent = (used / total) * 100;
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-baseline justify-between text-sm">
				<span className="font-medium">{label}</span>
				<span className="text-muted-foreground tabular-nums">
					{used.toLocaleString("en-US")} / {total.toLocaleString("en-US")}
				</span>
			</div>
			<Progress value={percent} />
		</div>
	);
}
