import { Button } from "@repo/ui/components/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@repo/ui/components/input-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/components/select";
import { SearchIcon, XIcon } from "lucide-react";
import { TagDot } from "@/components/kit/tag-pill";
import type { Folder, Tag } from "@/features/documents/schemas/document";
import type { DocFilters as Filters } from "@/features/documents/utils/doc-helpers";
import type { Member } from "@/features/members/schemas/member";
import { SAMPLE_USER_ID } from "@/lib/session";

const ALL = "__all";

export function DocFilters({
	filters,
	onChange,
	folders,
	tags,
	members,
	showOwner = true,
}: {
	filters: Filters;
	onChange: (patch: Filters) => void;
	folders: Folder[];
	tags: Tag[];
	members: Member[];
	showOwner?: boolean;
}) {
	const active = Boolean(filters.folder || filters.tag || filters.owner || filters.q);
	const folderLabel = (folder: Folder) => {
		const parent = folders.find((f) => f.id === folder.parentId);
		return parent ? `${parent.name} / ${folder.name}` : folder.name;
	};

	return (
		<div className="flex flex-wrap items-center gap-2">
			<InputGroup className="h-9 w-full rounded-xl sm:w-60">
				<InputGroupAddon>
					<SearchIcon />
				</InputGroupAddon>
				<InputGroupInput
					aria-label="Search documents"
					placeholder="Search documents"
					value={filters.q ?? ""}
					onChange={(event) => onChange({ q: event.target.value || undefined })}
				/>
			</InputGroup>
			<Select
				value={filters.folder ?? ALL}
				onValueChange={(value) => onChange({ folder: value === ALL ? undefined : value })}
			>
				<SelectTrigger aria-label="Filter by folder" className="h-9 rounded-xl">
					<SelectValue placeholder="All folders" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={ALL}>All folders</SelectItem>
					<SelectSeparator />
					{folders.map((folder) => (
						<SelectItem key={folder.id} value={folder.id}>
							{folderLabel(folder)}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Select
				value={filters.tag ?? ALL}
				onValueChange={(value) => onChange({ tag: value === ALL ? undefined : value })}
			>
				<SelectTrigger aria-label="Filter by tag" className="h-9 rounded-xl">
					<SelectValue placeholder="All tags" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={ALL}>All tags</SelectItem>
					<SelectSeparator />
					{tags.map((tag) => (
						<SelectItem key={tag.id} value={tag.id}>
							<TagDot tint={tag.tint} /> {tag.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{showOwner ? (
				<Select
					value={filters.owner ?? ALL}
					onValueChange={(value) => onChange({ owner: value === ALL ? undefined : value })}
				>
					<SelectTrigger aria-label="Filter by owner" className="h-9 rounded-xl">
						<SelectValue placeholder="Anyone" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>Anyone</SelectItem>
						<SelectItem value="me">Owned by me</SelectItem>
						<SelectItem value="others">Owned by others</SelectItem>
						<SelectSeparator />
						{members
							.filter((m) => m.id !== SAMPLE_USER_ID && m.status === "active")
							.map((member) => (
								<SelectItem key={member.id} value={member.id}>
									{member.name}
								</SelectItem>
							))}
					</SelectContent>
				</Select>
			) : null}
			{active ? (
				<Button
					variant="ghost"
					size="sm"
					onClick={() =>
						onChange({ folder: undefined, tag: undefined, owner: undefined, q: undefined })
					}
				>
					<XIcon /> Clear
				</Button>
			) : null}
		</div>
	);
}
