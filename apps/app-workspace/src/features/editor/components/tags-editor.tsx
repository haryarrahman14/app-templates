import { Button } from "@repo/ui/components/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@repo/ui/components/command";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/popover";
import { CheckIcon, PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { TAG_TINT_KEYS, TagDot, TagPill } from "@/components/kit/tag-pill";
import { useCreateTag } from "@/features/documents/api/mutations";
import type { Tag } from "@/features/documents/schemas/document";

/** Shows the document's tags; add existing ones or create a new tag by typing its name. */
export function TagsEditor({
	tagIds,
	tags,
	onChange,
}: {
	tagIds: string[];
	tags: Tag[];
	onChange: (tagIds: string[]) => void;
}) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const createTag = useCreateTag();
	const selected = tagIds.map((id) => tags.find((t) => t.id === id)).filter((t): t is Tag => !!t);
	const name = search.trim().toLowerCase().replace(/\s+/g, "-").slice(0, 24);
	const exists = tags.some((t) => t.name === name);

	const toggle = (id: string) =>
		onChange(tagIds.includes(id) ? tagIds.filter((t) => t !== id) : [...tagIds, id]);

	return (
		<div className="flex flex-wrap items-center gap-1.5">
			{selected.map((tag) => (
				<TagPill key={tag.id} tint={tag.tint} className="pr-1">
					{tag.name}
					<button
						type="button"
						aria-label={`Remove tag ${tag.name}`}
						onClick={() => toggle(tag.id)}
						className="rounded-full p-0.5 outline-none hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-ring"
					>
						<XIcon className="size-3" />
					</button>
				</TagPill>
			))}
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant="ghost" size="xs" className="text-muted-foreground">
						<PlusIcon /> Add tag
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-60 p-0" align="start">
					<Command>
						<CommandInput
							placeholder="Find or create a tag"
							value={search}
							onValueChange={setSearch}
						/>
						<CommandList>
							<CommandEmpty>Type a name to create a tag.</CommandEmpty>
							<CommandGroup>
								{tags.map((tag) => (
									<CommandItem key={tag.id} value={tag.name} onSelect={() => toggle(tag.id)}>
										<TagDot tint={tag.tint} />
										{tag.name}
										{tagIds.includes(tag.id) ? <CheckIcon className="ml-auto" /> : null}
									</CommandItem>
								))}
								{name && !exists ? (
									<CommandItem
										value={`create ${name}`}
										onSelect={() =>
											createTag.mutate(
												{
													name,
													tint: TAG_TINT_KEYS[tags.length % TAG_TINT_KEYS.length] ?? "blue",
												},
												{
													onSuccess: (tag) => {
														onChange([...tagIds, tag.id]);
														setSearch("");
													},
												},
											)
										}
									>
										<PlusIcon /> Create “{name}”
									</CommandItem>
								) : null}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
