import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@repo/ui/components/breadcrumb";
import { Button } from "@repo/ui/components/button";
import { SidebarTrigger } from "@repo/ui/components/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/components/tooltip";
import { Link, useLocation } from "@tanstack/react-router";
import { CircleHelp, PenLine, Search } from "lucide-react";
import { Fragment } from "react";
import { NotificationsPopover } from "@/components/layout/notifications-popover";
import { openComposer, setUi } from "@/lib/ui-state";
import { useLookups } from "@/lib/use-lookups";

const LABELS: Record<string, string> = {
	home: "Home",
	tasks: "Tasks",
	notes: "Notes",
	reports: "Reports",
	companies: "Companies",
	people: "People",
	deals: "Deals",
	settings: "Settings",
	profile: "Profile",
	workspace: "Workspace",
	members: "Members",
	fields: "Custom fields",
	notifications: "Notifications",
	billing: "Billing",
	"api-keys": "API keys",
	danger: "Danger zone",
};

function useCrumbs() {
	const pathname = useLocation({ select: (location) => location.pathname });
	const { company, person } = useLookups();
	const segments = pathname.split("/").filter(Boolean);
	return segments.map((segment, index) => {
		const href = `/${segments.slice(0, index + 1).join("/")}`;
		const parent = segments[index - 1];
		let label = LABELS[segment] ?? segment;
		if (parent === "companies") label = company.get(segment)?.name ?? "Company";
		if (parent === "people") {
			const found = person.get(segment);
			label = found ? `${found.firstName} ${found.lastName}` : "Person";
		}
		return { href, label };
	});
}

export function Topbar() {
	const crumbs = useCrumbs();
	return (
		<header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 rounded-t-xl border-b bg-background/80 px-3 backdrop-blur-xl md:px-4">
			<SidebarTrigger className="-ml-1" />
			<Breadcrumb className="min-w-0 flex-1">
				<BreadcrumbList className="flex-nowrap">
					{crumbs.map((crumb, index) => (
						<Fragment key={crumb.href}>
							{index > 0 ? <BreadcrumbSeparator className="hidden sm:block" /> : null}
							<BreadcrumbItem
								className={index < crumbs.length - 1 ? "hidden sm:inline-flex" : "min-w-0"}
							>
								{index === crumbs.length - 1 ? (
									<BreadcrumbPage className="truncate font-medium">{crumb.label}</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild>
										<Link to={crumb.href}>{crumb.label}</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						</Fragment>
					))}
				</BreadcrumbList>
			</Breadcrumb>
			<button
				type="button"
				onClick={() => setUi({ commandOpen: true })}
				className="hidden h-8 w-56 items-center gap-2 rounded-lg border bg-muted/50 px-2.5 text-muted-foreground text-sm outline-none transition hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 md:flex"
			>
				<Search className="size-4" />
				Search or jump to…
				<kbd className="ml-auto rounded border bg-background px-1.5 font-sans text-[10px]">⌘K</kbd>
			</button>
			<Button
				variant="ghost"
				size="icon"
				className="md:hidden"
				aria-label="Search"
				onClick={() => setUi({ commandOpen: true })}
			>
				<Search />
			</Button>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						aria-label="Compose email"
						onClick={() => openComposer()}
					>
						<PenLine />
					</Button>
				</TooltipTrigger>
				<TooltipContent>Compose email</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						aria-label="Help and shortcuts"
						onClick={() => setUi({ shortcutsOpen: true })}
					>
						<CircleHelp />
					</Button>
				</TooltipTrigger>
				<TooltipContent>Help and shortcuts</TooltipContent>
			</Tooltip>
			<NotificationsPopover />
		</header>
	);
}
