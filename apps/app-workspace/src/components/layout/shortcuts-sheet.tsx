import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@repo/ui/components/sheet";
import { Kbd } from "@/components/kit/kbd";

const GROUPS: { title: string; items: { label: string; keys: string[] }[] }[] = [
	{
		title: "Everywhere",
		items: [
			{ label: "Command palette", keys: ["⌘", "K"] },
			{ label: "New document", keys: ["N"] },
			{ label: "Toggle sidebar", keys: ["⌘", "B"] },
			{ label: "Toggle dark mode", keys: ["⇧", "⌘", "L"] },
			{ label: "Keyboard shortcuts", keys: ["?"] },
		],
	},
	{
		title: "In a document",
		items: [
			{ label: "Block menu", keys: ["/"] },
			{ label: "New block", keys: ["Enter"] },
			{ label: "Line break in a block", keys: ["⇧", "Enter"] },
			{ label: "Remove empty block", keys: ["⌫"] },
			{ label: "Move block up / down", keys: ["⌥", "⇧", "↑ ↓"] },
			{ label: "Check a to-do", keys: ["⌘", "Enter"] },
			{ label: "Save now", keys: ["⌘", "S"] },
		],
	},
	{
		title: "Markdown shortcuts",
		items: [
			{ label: "Heading / subheading", keys: ["#", "##"] },
			{ label: "Bulleted list", keys: ["-"] },
			{ label: "To-do", keys: ["[]"] },
			{ label: "Quote", keys: [">"] },
			{ label: "Divider", keys: ["---"] },
		],
	},
];

export function ShortcutsSheet({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="w-[90%] overflow-y-auto sm:max-w-sm">
				<SheetHeader>
					<SheetTitle>Keyboard shortcuts</SheetTitle>
					<SheetDescription>On Windows and Linux, use Ctrl for ⌘ and Alt for ⌥.</SheetDescription>
				</SheetHeader>
				<div className="space-y-6 px-4 pb-6">
					{GROUPS.map((group) => (
						<section key={group.title} className="space-y-2">
							<h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
								{group.title}
							</h3>
							<ul className="divide-y rounded-xl border bg-card">
								{group.items.map((item) => (
									<li
										key={item.label}
										className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
									>
										{item.label}
										<span className="flex gap-1">
											{item.keys.map((key) => (
												<Kbd key={key}>{key}</Kbd>
											))}
										</span>
									</li>
								))}
							</ul>
						</section>
					))}
				</div>
			</SheetContent>
		</Sheet>
	);
}
