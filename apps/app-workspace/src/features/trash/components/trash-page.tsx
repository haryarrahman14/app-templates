import { Button } from "@repo/ui/components/button";
import { Skeleton } from "@repo/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { RotateCcwIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/kit/confirm-dialog";
import { PageContainer, PageHeader } from "@/components/kit/page-header";
import { StateScreen } from "@/components/kit/state-screen";
import { useDeleteDocsForever, useRestoreDocs } from "@/features/documents/api/mutations";
import { trashedDocsQuery } from "@/features/documents/api/queries";
import type { Doc } from "@/features/documents/schemas/document";
import { formatRelative } from "@/lib/format";

/** Documents in the trash: restore them, or delete them for good after a confirmation. */
export function TrashPage() {
	const trashed = useQuery(trashedDocsQuery);
	const restore = useRestoreDocs();
	const deleteForever = useDeleteDocsForever();
	const [confirm, setConfirm] = useState<{ docs: Doc[] } | null>(null);
	const docs = trashed.data ?? [];

	return (
		<PageContainer className="max-w-3xl space-y-8">
			<PageHeader
				title="Trash"
				description="Deleted documents stay here until you remove them for good."
				actions={
					docs.length ? (
						<Button variant="destructive" onClick={() => setConfirm({ docs })}>
							<Trash2Icon /> Empty trash
						</Button>
					) : null
				}
			/>
			{trashed.isPending ? (
				<div className="space-y-2">
					<Skeleton className="h-16 rounded-xl" />
					<Skeleton className="h-16 rounded-xl" />
				</div>
			) : docs.length === 0 ? (
				<StateScreen
					icon={Trash2Icon}
					title="Trash is empty"
					description="Documents you delete show up here first."
				/>
			) : (
				<ul className="divide-y overflow-hidden rounded-2xl border bg-card shadow-soft">
					{docs.map((doc) => (
						<li key={doc.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
							<span aria-hidden className="text-xl">
								{doc.emoji}
							</span>
							<div className="min-w-0 flex-1">
								<p className="truncate font-medium">{doc.title || "Untitled"}</p>
								<p className="text-muted-foreground text-xs">
									Deleted {doc.trashedAt ? formatRelative(doc.trashedAt) : ""}
								</p>
							</div>
							<div className="flex gap-1.5">
								<Button variant="outline" size="sm" onClick={() => restore.mutate([doc.id])}>
									<RotateCcwIcon /> Restore
								</Button>
								<Button
									variant="ghost"
									size="sm"
									className="text-destructive"
									onClick={() => setConfirm({ docs: [doc] })}
								>
									Delete forever
								</Button>
							</div>
						</li>
					))}
				</ul>
			)}
			<ConfirmDialog
				open={confirm !== null}
				onOpenChange={(open) => !open && setConfirm(null)}
				destructive
				title={
					confirm?.docs.length === 1
						? `Delete “${confirm.docs[0]?.title || "Untitled"}” forever?`
						: `Delete ${confirm?.docs.length ?? 0} documents forever?`
				}
				description="This can't be undone. Comments and history go with them."
				confirmLabel="Delete forever"
				onConfirm={() => {
					if (confirm) deleteForever.mutate(confirm.docs.map((d) => d.id));
					setConfirm(null);
				}}
			/>
		</PageContainer>
	);
}
