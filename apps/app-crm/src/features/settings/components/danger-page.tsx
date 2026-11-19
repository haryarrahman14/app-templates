import { Button } from "@repo/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { toast } from "@repo/ui/components/sonner";
import { Spinner } from "@repo/ui/components/spinner";
import { Download, Trash2 } from "lucide-react";
import { useState } from "react";
import { SettingsSection } from "@/features/settings/components/settings-layout";
import { WORKSPACE_NAME } from "@/lib/site";

export function DangerPage() {
	const [exporting, setExporting] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [typed, setTyped] = useState("");

	return (
		<SettingsSection title="Danger zone" description="Actions here affect the whole workspace.">
			<div className="overflow-hidden rounded-2xl border border-destructive/30 bg-card shadow-soft">
				<div className="flex flex-wrap items-center justify-between gap-4 border-b px-5 py-4">
					<div>
						<p className="font-medium text-sm">Export all data</p>
						<p className="text-muted-foreground text-sm">
							A CSV per record type, sent to your email.
						</p>
					</div>
					<Button
						variant="outline"
						disabled={exporting}
						onClick={() => {
							setExporting(true);
							setTimeout(() => {
								setExporting(false);
								toast.success("Export started", {
									description: "Sample: in a real app a download link arrives by email.",
								});
							}, 800);
						}}
					>
						{exporting ? <Spinner /> : <Download />}
						Export
					</Button>
				</div>
				<div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
					<div>
						<p className="font-medium text-destructive text-sm">Delete workspace</p>
						<p className="text-muted-foreground text-sm">
							Removes every record, member and setting. This cannot be undone.
						</p>
					</div>
					<Button variant="destructive" onClick={() => setDeleteOpen(true)}>
						<Trash2 /> Delete workspace
					</Button>
				</div>
			</div>

			<Dialog
				open={deleteOpen}
				onOpenChange={(open) => {
					setDeleteOpen(open);
					if (!open) setTyped("");
				}}
			>
				<DialogContent className="rounded-2xl sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Delete {WORKSPACE_NAME}?</DialogTitle>
						<DialogDescription>
							Everything in this workspace is deleted for everyone. Type the workspace name to
							confirm.
						</DialogDescription>
					</DialogHeader>
					<form
						className="flex flex-col gap-4"
						onSubmit={(event) => {
							event.preventDefault();
							if (typed !== WORKSPACE_NAME) return;
							setDeleteOpen(false);
							setTyped("");
							toast("Sample workspace kept", {
								description: "Deleting is disabled in the sample. Wire it to your API.",
							});
						}}
					>
						<div className="grid gap-2">
							<Label htmlFor="confirm-workspace">
								Type <span className="font-semibold">{WORKSPACE_NAME}</span>
							</Label>
							<Input
								id="confirm-workspace"
								value={typed}
								autoComplete="off"
								onChange={(event) => setTyped(event.target.value)}
							/>
						</div>
						<DialogFooter>
							<Button type="button" variant="ghost" onClick={() => setDeleteOpen(false)}>
								Cancel
							</Button>
							<Button
								type="submit"
								className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
								disabled={typed !== WORKSPACE_NAME}
							>
								Delete forever
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</SettingsSection>
	);
}
