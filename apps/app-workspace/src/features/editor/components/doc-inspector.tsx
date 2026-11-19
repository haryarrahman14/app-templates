import { Label } from "@repo/ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/components/select";
import { Switch } from "@repo/ui/components/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { cn } from "@repo/ui/lib/cn";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";
import type { ReactNode } from "react";
import { DOC_COVERS, docCover } from "@/components/kit/doc-cover";
import { RadioCards } from "@/components/kit/radio-cards";
import { SegmentedControl } from "@/components/kit/segmented-control";
import { UserAvatar } from "@/components/kit/user-avatar";
import { foldersQuery, tagsQuery } from "@/features/documents/api/queries";
import type { Doc, DocFont, DocPatch, DocWidth } from "@/features/documents/schemas/document";
import { CommentsPanel } from "@/features/editor/components/comments-panel";
import { TagsEditor } from "@/features/editor/components/tags-editor";
import { membersQuery } from "@/features/members/api/queries";
import { formatDateTime } from "@/lib/format";
import { SAMPLE_USER_ID } from "@/lib/session";
import { useSessionUser } from "@/lib/session-context";

const FONTS: { value: DocFont; label: string; sample: string; className: string }[] = [
	{ value: "sans", label: "Default", sample: "Ag", className: "font-sans" },
	{ value: "serif", label: "Serif", sample: "Ag", className: "font-serif" },
	{ value: "mono", label: "Mono", sample: "Ag", className: "font-mono" },
];

const NO_FOLDER = "__none";

function Section({ title, children }: { title: string; children: ReactNode }) {
	return (
		<section className="space-y-3">
			<h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">{title}</h3>
			{children}
		</section>
	);
}

export type InspectorTab = "style" | "info" | "comments";

export function DocInspector({
	doc,
	onPatch,
	tab,
	onTabChange,
	wordCount,
}: {
	doc: Doc;
	onPatch: (patch: DocPatch) => void;
	tab: InspectorTab;
	onTabChange: (tab: InspectorTab) => void;
	wordCount: number;
}) {
	const user = useSessionUser();
	const folders = useQuery(foldersQuery);
	const tags = useQuery(tagsQuery);
	const members = useQuery(membersQuery);
	const owner =
		doc.ownerId === SAMPLE_USER_ID
			? { name: user.name }
			: (members.data?.find((m) => m.id === doc.ownerId) ?? { name: "Someone" });

	return (
		<Tabs
			value={tab}
			onValueChange={(value) => onTabChange(value as InspectorTab)}
			className="gap-5"
		>
			<TabsList className="w-full">
				<TabsTrigger value="style">Style</TabsTrigger>
				<TabsTrigger value="info">Info</TabsTrigger>
				<TabsTrigger value="comments">Comments</TabsTrigger>
			</TabsList>

			<TabsContent value="style" className="space-y-7">
				<Section title="Font">
					<RadioCards<DocFont>
						name="doc-font"
						label="Font"
						value={doc.font}
						onValueChange={(font) => onPatch({ font })}
						options={FONTS}
						className="grid grid-cols-3 gap-2"
						itemClassName="rounded-xl"
						renderItem={(option, checked) => (
							<span
								className={cn(
									"flex flex-col items-center gap-1 rounded-xl border bg-card py-3 transition-colors hover:bg-accent",
									checked && "border-tint ring-1 ring-tint",
								)}
							>
								<span
									className={cn("text-xl", FONTS.find((f) => f.value === option.value)?.className)}
								>
									Ag
								</span>
								<span className="text-muted-foreground text-xs">{option.label}</span>
							</span>
						)}
					/>
				</Section>

				<Section title="Text width">
					<SegmentedControl<DocWidth>
						label="Text width"
						value={doc.width}
						onValueChange={(width) => onPatch({ width })}
						className="w-full"
						options={[
							{ value: "narrow", label: "Narrow" },
							{ value: "normal", label: "Normal" },
							{ value: "wide", label: "Wide" },
						]}
					/>
				</Section>

				<Section title="Cover">
					<div className="flex items-center justify-between">
						<Label htmlFor="cover-switch">Show cover</Label>
						<Switch
							id="cover-switch"
							checked={doc.cover.enabled}
							onCheckedChange={(enabled) => onPatch({ cover: { ...doc.cover, enabled } })}
						/>
					</div>
					<RadioCards<Doc["cover"]["tint"]>
						name="doc-cover"
						label="Cover colour"
						value={doc.cover.tint}
						onValueChange={(tint) => onPatch({ cover: { enabled: true, tint } })}
						options={DOC_COVERS.map((cover) => ({ value: cover.id, label: cover.name }))}
						className="grid grid-cols-6 gap-2"
						itemClassName="rounded-lg"
						renderItem={(option, checked) => (
							<span
								title={option.label}
								className={cn(
									"flex aspect-square items-center justify-center rounded-lg ring-offset-2 ring-offset-background",
									docCover(option.value).className,
									checked && "ring-2 ring-tint",
								)}
							>
								{checked ? (
									<CheckIcon className={cn("size-3.5", docCover(option.value).check)} />
								) : null}
							</span>
						)}
					/>
				</Section>
			</TabsContent>

			<TabsContent value="info" className="space-y-7">
				<Section title="Details">
					<dl className="space-y-2.5 text-sm">
						<div className="flex items-center justify-between gap-3">
							<dt className="text-muted-foreground">Owner</dt>
							<dd className="flex items-center gap-2">
								<UserAvatar name={owner.name} size="sm" />
								{owner.name}
							</dd>
						</div>
						<div className="flex justify-between gap-3">
							<dt className="text-muted-foreground">Created</dt>
							<dd className="text-right">{formatDateTime(doc.createdAt)}</dd>
						</div>
						<div className="flex justify-between gap-3">
							<dt className="text-muted-foreground">Updated</dt>
							<dd className="text-right">{formatDateTime(doc.updatedAt)}</dd>
						</div>
						<div className="flex justify-between gap-3">
							<dt className="text-muted-foreground">Words</dt>
							<dd className="tabular-nums">{wordCount}</dd>
						</div>
					</dl>
				</Section>

				<Section title="Folder">
					<Select
						value={doc.folderId ?? NO_FOLDER}
						onValueChange={(value) => onPatch({ folderId: value === NO_FOLDER ? null : value })}
					>
						<SelectTrigger aria-label="Folder" className="w-full rounded-xl">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={NO_FOLDER}>No folder</SelectItem>
							<SelectSeparator />
							{(folders.data ?? []).map((folder) => (
								<SelectItem key={folder.id} value={folder.id}>
									{folder.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Section>

				<Section title="Tags">
					<TagsEditor
						tagIds={doc.tagIds}
						tags={tags.data ?? []}
						onChange={(tagIds) => onPatch({ tagIds })}
					/>
				</Section>
			</TabsContent>

			<TabsContent value="comments">
				<CommentsPanel docId={doc.id} />
			</TabsContent>
		</Tabs>
	);
}
