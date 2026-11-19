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
	BarChart3,
	CheckSquare,
	Home,
	Keyboard,
	ListPlus,
	Mail,
	Moon,
	NotebookPen,
	Plus,
	Settings,
	Sun,
	Upload,
	UserPlus,
} from "lucide-react";
import { InitialsAvatar } from "@/components/kit/initials-avatar";
import { RecordGlyph } from "@/components/kit/record-glyph";
import { companiesQuery } from "@/features/companies/api/queries";
import { dealsQuery } from "@/features/deals/api/queries";
import { peopleQuery } from "@/features/people/api/queries";
import { fullName } from "@/features/people/schemas/person";
import { RECORD_TYPES, type RecordType, recordHref } from "@/lib/records";
import { type CreateKind, openComposer, openCreate, setUi, useUi } from "@/lib/ui-state";

const PAGES = [
	{ href: "/home", label: "Home", icon: Home },
	{ href: "/tasks", label: "Tasks", icon: CheckSquare },
	{ href: "/notes", label: "Notes", icon: NotebookPen },
	{ href: "/reports", label: "Reports", icon: BarChart3 },
	{ href: "/settings/profile", label: "Settings", icon: Settings },
];

/** Word-start matches rank first, then plain substrings; no loose fuzzy matching. */
function matchWords(value: string, search: string, keywords?: string[]) {
	const query = search.trim().toLowerCase();
	if (!query) return 1;
	const words = `${value} ${keywords?.join(" ") ?? ""}`.toLowerCase().split(/[\s.@]+/);
	if (words.some((word) => word.startsWith(query))) return 1;
	return words.join(" ").includes(query) ? 0.4 : 0;
}

/** ⌘K: jump to any record or page, create things, toggle the theme. */
export function CommandPalette() {
	const open = useUi((state) => state.commandOpen);
	const navigate = useNavigate();
	const { resolvedTheme, setTheme } = useTheme();
	const companies = useQuery({ ...companiesQuery, enabled: open }).data ?? [];
	const people = useQuery({ ...peopleQuery, enabled: open }).data ?? [];
	const deals = useQuery({ ...dealsQuery, enabled: open }).data ?? [];

	const close = () => setUi({ commandOpen: false });
	const run = (action: () => void) => {
		close();
		action();
	};
	const go = (href: string) => run(() => navigate({ href }));
	const create = (kind: CreateKind) => run(() => openCreate(kind));

	return (
		<CommandDialog
			open={open}
			onOpenChange={(next) => setUi({ commandOpen: next })}
			title="Search and commands"
			description="Jump to a record or page, or run a command"
			className="rounded-2xl! sm:max-w-xl"
		>
			{/* CommandDialog does not render the cmdk root itself. */}
			<Command
				className="rounded-none! p-1.5 **:data-[slot=command-item]:py-2 [&_[data-slot=command-item]>svg:last-child]:hidden"
				filter={matchWords}
			>
				<CommandInput placeholder="Search records, pages and commands…" />
				<CommandList className="max-h-[min(26rem,60dvh)]">
					<CommandEmpty>Nothing found.</CommandEmpty>
					<CommandGroup heading="Go to">
						{PAGES.map((page) => (
							<CommandItem
								key={page.href}
								value={`go ${page.label}`}
								onSelect={() => go(page.href)}
							>
								<page.icon /> {page.label}
							</CommandItem>
						))}
						{(Object.keys(RECORD_TYPES) as RecordType[]).map((type) => (
							<CommandItem
								key={type}
								value={`go ${RECORD_TYPES[type].plural}`}
								onSelect={() => go(RECORD_TYPES[type].basePath)}
							>
								<RecordGlyph type={type} /> {RECORD_TYPES[type].plural}
							</CommandItem>
						))}
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Create">
						<CommandItem value="new company create" onSelect={() => create("company")}>
							<Plus /> New company
						</CommandItem>
						<CommandItem value="new person create contact" onSelect={() => create("person")}>
							<Plus /> New person
						</CommandItem>
						<CommandItem value="new deal create opportunity" onSelect={() => create("deal")}>
							<Plus /> New deal
						</CommandItem>
						<CommandItem value="new task create todo" onSelect={() => create("task")}>
							<Plus /> New task
						</CommandItem>
						<CommandItem value="new list create" onSelect={() => create("list")}>
							<ListPlus /> New list
						</CommandItem>
						<CommandItem value="compose email write" onSelect={() => run(() => openComposer())}>
							<Mail /> Compose email
						</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Actions">
						<CommandItem
							value="toggle theme dark light mode appearance"
							onSelect={() => run(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"))}
						>
							{resolvedTheme === "dark" ? <Sun /> : <Moon />}
							Switch to {resolvedTheme === "dark" ? "light" : "dark"} theme
						</CommandItem>
						<CommandItem
							value="import csv upload"
							onSelect={() => run(() => setUi({ importOpen: true }))}
						>
							<Upload /> Import companies from CSV
						</CommandItem>
						<CommandItem value="invite teammates members" onSelect={() => create("invite")}>
							<UserPlus /> Invite teammates
						</CommandItem>
						<CommandItem
							value="keyboard shortcuts help"
							onSelect={() => run(() => setUi({ shortcutsOpen: true }))}
						>
							<Keyboard /> Keyboard shortcuts
							<CommandShortcut>?</CommandShortcut>
						</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Companies">
						{companies.map((company) => (
							<CommandItem
								key={company.id}
								value={`company ${company.name} ${company.id}`}
								keywords={[company.domain, company.industry]}
								onSelect={() => go(recordHref({ type: "company", id: company.id }))}
							>
								<InitialsAvatar name={company.name} square size="xs" />
								{company.name}
								<span className="ml-auto text-muted-foreground text-xs">{company.industry}</span>
							</CommandItem>
						))}
					</CommandGroup>
					<CommandGroup heading="People">
						{people.map((person) => (
							<CommandItem
								key={person.id}
								value={`person ${fullName(person)} ${person.id}`}
								keywords={[person.email]}
								onSelect={() => go(recordHref({ type: "person", id: person.id }))}
							>
								<InitialsAvatar name={fullName(person)} size="xs" />
								{fullName(person)}
								<span className="ml-auto truncate text-muted-foreground text-xs">
									{person.title}
								</span>
							</CommandItem>
						))}
					</CommandGroup>
					<CommandGroup heading="Deals">
						{deals.map((deal) => (
							<CommandItem
								key={deal.id}
								value={`deal ${deal.name} ${deal.id}`}
								onSelect={() => go(recordHref({ type: "deal", id: deal.id }))}
							>
								<RecordGlyph type="deal" size="xs" />
								{deal.name}
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			</Command>
		</CommandDialog>
	);
}
