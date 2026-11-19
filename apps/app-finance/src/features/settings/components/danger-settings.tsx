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
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { toast } from "@repo/ui/components/sonner";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useSignOut } from "@/features/auth/api/mutations";
import { exportSampleAccount, useResetSampleData } from "@/features/settings/api/mutations";
import { SettingsSection } from "@/features/settings/components/settings-section";

export function DangerSettings() {
	const navigate = useNavigate();
	const reset = useResetSampleData();
	const signOut = useSignOut();
	const [confirm, setConfirm] = useState("");

	const exportData = () => {
		const url = URL.createObjectURL(
			new Blob([exportSampleAccount()], { type: "application/json" }),
		);
		const link = document.createElement("a");
		link.href = url;
		link.download = "ledgerfinch-sample-account.json";
		link.click();
		URL.revokeObjectURL(url);
		toast.success("Exported your sample account as JSON");
	};

	return (
		<div className="space-y-6">
			<SettingsSection
				title="Export your data"
				description="Download everything in this sample account as JSON."
			>
				<Button variant="outline" onClick={exportData}>
					Export data
				</Button>
			</SettingsSection>
			<SettingsSection
				title="Reset sample data"
				description="Undo every trade, list, alert and transaction you added in this tab."
			>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant="outline">Reset sample data</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Reset the sample account?</AlertDialogTitle>
							<AlertDialogDescription>
								Your changes in this tab are discarded and the original sample portfolio comes back.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={() =>
									reset.mutate(undefined, { onSuccess: () => toast.success("Sample data reset") })
								}
							>
								Reset
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</SettingsSection>
			<SettingsSection
				title="Delete account"
				description="Permanently remove your account and data. In this template it signs you out and resets the sample."
			>
				<AlertDialog onOpenChange={(open) => !open && setConfirm("")}>
					<AlertDialogTrigger asChild>
						<Button variant="destructive">Delete account</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Delete your account?</AlertDialogTitle>
							<AlertDialogDescription>
								In a real app this cannot be undone. Type{" "}
								<span className="font-mono font-medium text-foreground">DELETE</span> to confirm.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<div className="grid gap-2">
							<Label htmlFor="confirm-delete" className="sr-only">
								Type DELETE to confirm
							</Label>
							<Input
								id="confirm-delete"
								value={confirm}
								onChange={(e) => setConfirm(e.target.value)}
								autoComplete="off"
								placeholder="DELETE"
							/>
						</div>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								variant="destructive"
								disabled={confirm !== "DELETE"}
								onClick={() =>
									reset.mutate(undefined, {
										onSuccess: () =>
											signOut.mutate(undefined, {
												onSuccess: () => {
													toast.success("Sample account deleted");
													navigate({ to: "/sign-up", replace: true });
												},
											}),
									})
								}
							>
								Delete account
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</SettingsSection>
		</div>
	);
}
