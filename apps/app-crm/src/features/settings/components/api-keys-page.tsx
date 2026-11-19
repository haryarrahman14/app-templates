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
import { Form } from "@repo/ui/components/form";
import { Skeleton } from "@repo/ui/components/skeleton";
import { toast } from "@repo/ui/components/sonner";
import { Spinner } from "@repo/ui/components/spinner";
import { useQuery } from "@tanstack/react-query";
import { Check, Copy, KeyRound, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ConfirmDialog } from "@/components/kit/confirm-dialog";
import { TextField } from "@/components/kit/form-fields";
import { useCreateApiKey, useRevokeApiKey } from "@/features/settings/api/mutations";
import { apiKeysQuery } from "@/features/settings/api/queries";
import { SettingsSection } from "@/features/settings/components/settings-layout";
import { type ApiKey, type NewApiKey, newApiKeySchema } from "@/features/settings/schemas/settings";
import { formatAgo, formatDate } from "@/lib/format";

export function ApiKeysPage() {
	const { data, isPending } = useQuery(apiKeysQuery);
	const revoke = useRevokeApiKey();
	const [creating, setCreating] = useState(false);
	const [revealed, setRevealed] = useState<{ name: string; secret: string } | null>(null);
	const [revoking, setRevoking] = useState<ApiKey | null>(null);

	return (
		<SettingsSection
			title="API keys"
			description="Keys let your own tools read and write records. Treat them like passwords."
			actions={
				<Button onClick={() => setCreating(true)}>
					<Plus /> Create key
				</Button>
			}
		>
			<div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
				<ul className="divide-y">
					{isPending ? (
						<li className="px-4 py-4">
							<Skeleton className="h-5 w-56 rounded" />
						</li>
					) : (data ?? []).length === 0 ? (
						<li className="px-4 py-8 text-center text-muted-foreground text-sm">
							No keys yet. Create one to connect a tool.
						</li>
					) : (
						(data ?? []).map((key) => (
							<li key={key.id} className="flex flex-wrap items-center gap-3 px-4 py-3.5">
								<span className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
									<KeyRound className="size-4" />
								</span>
								<div className="min-w-0 flex-1">
									<p className="truncate font-medium text-sm">{key.name}</p>
									<p className="truncate font-mono text-muted-foreground text-xs">
										{key.prefix}••••••••
									</p>
								</div>
								<div className="text-right text-muted-foreground text-xs">
									<p>Created {formatDate(key.createdAt)}</p>
									<p>{key.lastUsedAt ? `Used ${formatAgo(key.lastUsedAt)}` : "Never used"}</p>
								</div>
								<Button variant="destructive" size="sm" onClick={() => setRevoking(key)}>
									Revoke
								</Button>
							</li>
						))
					)}
				</ul>
			</div>

			<CreateKeyDialog
				open={creating}
				onOpenChange={setCreating}
				onCreated={(name, secret) => {
					setCreating(false);
					setRevealed({ name, secret });
				}}
			/>
			<RevealDialog revealed={revealed} onClose={() => setRevealed(null)} />
			<ConfirmDialog
				open={revoking !== null}
				onOpenChange={(open) => {
					if (!open) setRevoking(null);
				}}
				title={`Revoke “${revoking?.name ?? "key"}”?`}
				description="Anything using this key stops working right away. This cannot be undone."
				confirmLabel="Revoke"
				onConfirm={() => {
					if (revoking) revoke.mutate(revoking.id);
					setRevoking(null);
				}}
			/>
		</SettingsSection>
	);
}

function CreateKeyDialog({
	open,
	onOpenChange,
	onCreated,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCreated: (name: string, secret: string) => void;
}) {
	const create = useCreateApiKey();
	const form = useForm<NewApiKey>({
		resolver: zodResolver(newApiKeySchema),
		defaultValues: { name: "" },
	});

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				if (!next) form.reset();
				onOpenChange(next);
			}}
		>
			<DialogContent className="rounded-2xl sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Create an API key</DialogTitle>
					<DialogDescription>Name it after the tool that will use it.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						noValidate
						className="flex flex-col gap-4"
						onSubmit={form.handleSubmit((values) =>
							create.mutate(values.name, {
								onSuccess: ({ key, secret }) => {
									form.reset();
									onCreated(key.name, secret);
								},
							}),
						)}
					>
						<TextField
							control={form.control}
							name="name"
							label="Key name"
							placeholder="e.g. Website forms"
						/>
						<DialogFooter>
							<Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={create.isPending}>
								{create.isPending ? <Spinner /> : null}
								Create key
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

function RevealDialog({
	revealed,
	onClose,
}: {
	revealed: { name: string; secret: string } | null;
	onClose: () => void;
}) {
	const [copied, setCopied] = useState(false);
	return (
		<Dialog
			open={revealed !== null}
			onOpenChange={(open) => {
				if (!open) {
					setCopied(false);
					onClose();
				}
			}}
		>
			<DialogContent className="rounded-2xl sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Copy your new key</DialogTitle>
					<DialogDescription>
						This is the only time “{revealed?.name}” is shown in full. Store it somewhere safe.
						(Sample value; it works nowhere.)
					</DialogDescription>
				</DialogHeader>
				<div className="flex items-center gap-2 rounded-xl border bg-muted/50 p-2 pl-3">
					<code className="min-w-0 flex-1 truncate font-mono text-sm">{revealed?.secret}</code>
					<Button
						size="sm"
						variant="outline"
						onClick={async () => {
							try {
								await navigator.clipboard.writeText(revealed?.secret ?? "");
								setCopied(true);
								toast.success("Key copied");
							} catch {
								toast.error("Copy failed; select the text instead");
							}
						}}
					>
						{copied ? <Check /> : <Copy />}
						{copied ? "Copied" : "Copy"}
					</Button>
				</div>
				<DialogFooter>
					<Button onClick={onClose}>Done</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
