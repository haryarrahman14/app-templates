import { Button } from "@repo/ui/components/button";
import { Skeleton } from "@repo/ui/components/skeleton";
import { toast } from "@repo/ui/components/sonner";
import { Spinner } from "@repo/ui/components/spinner";
import { useQuery } from "@tanstack/react-query";
import {
	BriefcaseBusinessIcon,
	CreditCardIcon,
	FileSpreadsheetIcon,
	LandmarkIcon,
} from "lucide-react";
import { Panel } from "@/components/kit/panel";
import { useSetConnection } from "@/features/settings/api/mutations";
import { connectedAccountsQuery } from "@/features/settings/api/queries";
import { SampleNote } from "@/features/settings/components/settings-section";
import { formatDate } from "@/lib/format";

const ICON = {
	bank: LandmarkIcon,
	brokerage: BriefcaseBusinessIcon,
	card: CreditCardIcon,
	export: FileSpreadsheetIcon,
} as const;

export function AccountsSettings() {
	const { data } = useQuery(connectedAccountsQuery);
	const setConnection = useSetConnection();
	if (!data) return <Skeleton className="h-96 w-full rounded-2xl" />;
	return (
		<div className="space-y-4">
			<SampleNote>
				All institutions here are invented and nothing connects to a bank. Plug in your aggregation
				provider in <code>features/settings/api</code>.
			</SampleNote>
			<div className="grid gap-4 sm:grid-cols-2">
				{data.map((item) => {
					const Icon = ICON[item.kind];
					const pending = setConnection.isPending && setConnection.variables?.id === item.id;
					return (
						<Panel key={item.id} className="flex flex-col gap-4">
							<div className="flex items-start gap-3">
								<span className="flex size-10 items-center justify-center rounded-xl bg-foreground/[0.06]">
									<Icon aria-hidden className="size-5" />
								</span>
								<div className="min-w-0 flex-1">
									<p className="font-medium">{item.name}</p>
									<p className="text-muted-foreground text-sm">{item.detail}</p>
								</div>
								<span
									className={
										item.connected
											? "inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.06] px-2 py-0.5 text-foreground text-xs"
											: "rounded-full bg-foreground/[0.06] px-2 py-0.5 text-muted-foreground text-xs"
									}
								>
									{item.connected ? (
										<span aria-hidden className="size-1.5 rounded-full bg-gain" />
									) : null}
									{item.connected ? "Connected" : "Not connected"}
								</span>
							</div>
							<div className="mt-auto flex items-center justify-between gap-2">
								<p className="text-muted-foreground text-xs">
									{item.lastSync
										? `Synced ${formatDate(item.lastSync, "dayTime")}`
										: "Never synced"}
								</p>
								<Button
									size="sm"
									variant={item.connected ? "outline" : "default"}
									disabled={pending}
									onClick={() =>
										setConnection.mutate(
											{ id: item.id, connected: !item.connected },
											{
												onSuccess: (a) =>
													toast.success(
														a.connected ? `${a.name} connected (sample)` : `${a.name} disconnected`,
													),
											},
										)
									}
								>
									{pending ? <Spinner /> : null}
									{item.connected ? "Disconnect" : "Connect"}
								</Button>
							</div>
						</Panel>
					);
				})}
			</div>
		</div>
	);
}
