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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ConfirmDialog } from "@/components/kit/confirm-dialog";
import { useDeleteWorkspace } from "@/features/settings/api/mutations";
import { workspacesQuery } from "@/features/settings/api/queries";
import { SettingsCard } from "@/features/settings/components/settings-card";
import { resetSampleData } from "@/lib/mock-db";

export function DangerZone() {
	const queryClient = useQueryClient();
	const workspaces = useQuery(workspacesQuery);
	const name = workspaces.data?.find((w) => w.current)?.name ?? "";
	const remove = useDeleteWorkspace();
	const [resetOpen, setResetOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [typed, setTyped] = useState("");

	return (
		<>
			<SettingsCard
				title="Reset sample data"
				description="Put every document, task and event back the way the template ships."
				footer={
					<Button variant="outline" onClick={() => setResetOpen(true)}>
						Reset sample data
					</Button>
				}
			>
				<p className="text-muted-foreground text-sm">
					Handy after a demo. Your theme and accent stay as they are.
				</p>
			</SettingsCard>

			<SettingsCard
				title="Delete workspace"
				description="Removes the workspace, its documents and its members for everyone."
				className="border-destructive/40"
				footer={
					<Button variant="destructive" onClick={() => setDeleteOpen(true)}>
						Delete workspace
					</Button>
				}
			>
				<p className="text-muted-foreground text-sm">
					This can't be undone. In this sample it resets the data and signs you out.
				</p>
			</SettingsCard>

			<ConfirmDialog
				open={resetOpen}
				onOpenChange={setResetOpen}
				title="Reset all sample data?"
				description="Your edits to documents, tasks and events will be replaced by the original sample."
				confirmLabel="Reset"
				onConfirm={() => {
					resetSampleData();
					queryClient.clear();
					toast.success("Sample data reset");
					window.location.assign("/");
				}}
			/>

			<Dialog
				open={deleteOpen}
				onOpenChange={(open) => {
					setDeleteOpen(open);
					if (!open) setTyped("");
				}}
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Delete “{name}”?</DialogTitle>
						<DialogDescription>
							Type the workspace name to confirm. Everyone loses access immediately.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-2">
						<Label htmlFor="confirm-name">Workspace name</Label>
						<Input
							id="confirm-name"
							value={typed}
							onChange={(event) => setTyped(event.target.value)}
							placeholder={name}
						/>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDeleteOpen(false)}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							disabled={typed !== name || !name || remove.isPending}
							onClick={() => remove.mutate()}
						>
							{remove.isPending ? <Spinner /> : null} Delete forever
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
