import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@repo/ui/components/command";
import { useTheme } from "@repo/ui/hooks/use-theme";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
	CalendarIcon,
	CheckSquareIcon,
	FileTextIcon,
	HomeIcon,
	KeyboardIcon,
	LogOutIcon,
	MoonIcon,
	SettingsIcon,
	Share2Icon,
	SunIcon,
	Trash2Icon,
	UsersIcon,
} from "lucide-react";
import { docsQuery } from "@/features/documents/api/queries";

const PAGES = [
	{ label: "Home", href: "/", icon: HomeIcon, keywords: "all docs documents" },
	{ label: "Tasks", href: "/tasks", icon: CheckSquareIcon, keywords: "todo" },
	{ label: "Calendar", href: "/calendar", icon: CalendarIcon, keywords: "events schedule" },
	{ label: "Shared with me", href: "/shared", icon: UsersIcon, keywords: "shared" },
	{ label: "Trash", href: "/trash", icon: Trash2Icon, keywords: "deleted bin" },
	{
		label: "Settings",
		href: "/settings/profile",
		icon: SettingsIcon,
		keywords: "preferences account",
	},
];

/**
 * ⌘K palette: search documents, jump to a screen, create from a template, switch theme.
 * Document search is cmdk's fuzzy filter over titles; for a real API with many documents,
 * replace the docs list with a server search query keyed by the input value.
 */
export function CommandPalette({
	open,
	onOpenChange,
	templates,
	onNewDoc,
	onShortcuts,
	onInvite,
	onSignOut,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	templates: { id: string; label: string; emoji: string }[];
	onNewDoc: (templateId: string) => void;
	onShortcuts: () => void;
	onInvite: () => void;
	onSignOut: () => void;
}) {
	const navigate = useNavigate();
	const docs = useQuery({ ...docsQuery, enabled: open });
	const { resolvedTheme, setTheme } = useTheme();

	const run = (action: () => void) => {
		onOpenChange(false);
		action();
	};

	return (
		<CommandDialog
			open={open}
			onOpenChange={onOpenChange}
			title="Command palette"
			description="Search documents or run a command"
			className="sm:max-w-xl"
		>
			<Command className="rounded-xl">
				<CommandInput placeholder="Search documents or type a command…" />
				<CommandList className="max-h-[min(60vh,26rem)]">
					<CommandEmpty>No results. Try another word.</CommandEmpty>
					<CommandGroup heading="Documents">
						{(docs.data ?? []).slice(0, 30).map((doc) => (
							<CommandItem
								key={doc.id}
								value={`${doc.title} ${doc.id}`}
								onSelect={() =>
									run(() => navigate({ to: "/docs/$docId", params: { docId: doc.id } }))
								}
							>
								<span aria-hidden className="w-4 text-center">
									{doc.emoji}
								</span>
								<span className="truncate">{doc.title || "Untitled"}</span>
							</CommandItem>
						))}
						{docs.isPending ? (
							<CommandItem disabled value="loading documents">
								<FileTextIcon /> Loading documents…
							</CommandItem>
						) : null}
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Create">
						{templates.map((template, index) => (
							<CommandItem
								key={template.id}
								value={`new ${template.label}`}
								onSelect={() => run(() => onNewDoc(template.id))}
							>
								<span aria-hidden className="w-4 text-center">
									{template.emoji}
								</span>
								New {template.label.toLowerCase()}
								{index === 0 ? <CommandShortcut>N</CommandShortcut> : null}
							</CommandItem>
						))}
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Go to">
						{PAGES.map((page) => (
							<CommandItem
								key={page.href}
								value={`go ${page.label}`}
								keywords={[page.keywords]}
								onSelect={() => run(() => navigate({ to: page.href }))}
							>
								<page.icon /> {page.label}
							</CommandItem>
						))}
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Actions">
						<CommandItem
							value="toggle theme dark light mode"
							onSelect={() => run(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"))}
						>
							{resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
							Switch to {resolvedTheme === "dark" ? "light" : "dark"} theme
							<CommandShortcut>⇧⌘L</CommandShortcut>
						</CommandItem>
						<CommandItem value="invite teammates share" onSelect={() => run(onInvite)}>
							<Share2Icon /> Invite teammates
						</CommandItem>
						<CommandItem value="keyboard shortcuts help" onSelect={() => run(onShortcuts)}>
							<KeyboardIcon /> Keyboard shortcuts
							<CommandShortcut>?</CommandShortcut>
						</CommandItem>
						<CommandItem value="sign out log out" onSelect={() => run(onSignOut)}>
							<LogOutIcon /> Sign out
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>
		</CommandDialog>
	);
}
