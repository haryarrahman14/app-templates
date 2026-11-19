import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@repo/ui/components/dialog";
import { setUi, useUi } from "@/lib/ui-state";

const SHORTCUTS: [string, string][] = [
	["⌘ K", "Search, jump to a record, run a command"],
	["⌘ B", "Collapse or expand the sidebar"],
	["?", "Show this list"],
	["Esc", "Close a dialog, sheet or menu"],
	["Enter", "Save an inline edit"],
];

export function ShortcutsDialog() {
	const open = useUi((state) => state.shortcutsOpen);
	return (
		<Dialog open={open} onOpenChange={(next) => setUi({ shortcutsOpen: next })}>
			<DialogContent className="rounded-2xl sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Help and shortcuts</DialogTitle>
					<DialogDescription>
						Everything here works with the keyboard. On Windows and Linux use Ctrl for ⌘.
					</DialogDescription>
				</DialogHeader>
				<dl className="divide-y rounded-xl border">
					{SHORTCUTS.map(([keys, label]) => (
						<div key={keys} className="flex items-center justify-between gap-4 px-3 py-2.5 text-sm">
							<dt className="text-muted-foreground">{label}</dt>
							<dd>
								<kbd className="rounded-md border bg-muted px-2 py-0.5 font-sans text-xs">
									{keys}
								</kbd>
							</dd>
						</div>
					))}
				</dl>
			</DialogContent>
		</Dialog>
	);
}
