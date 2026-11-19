import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@repo/ui/components/breadcrumb";
import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";
import { SidebarTrigger } from "@repo/ui/components/sidebar";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useSearch } from "@tanstack/react-router";
import { LayoutGridIcon, ListIcon, SearchIcon, Share2Icon } from "lucide-react";
import { Fragment } from "react";
import { SegmentedControl } from "@/components/kit/segmented-control";
import { useShell } from "@/components/layout/shell-context";
import { docQuery, foldersQuery, tagsQuery } from "@/features/documents/api/queries";
import { NotificationsPopover } from "@/features/notifications/components/notifications-popover";
import { workspacesQuery } from "@/features/settings/api/queries";
import { type CollectionView, setCollectionView, useCollectionView } from "@/lib/view-preference";

const SECTION_LABELS: Record<string, string> = {
	tasks: "Tasks",
	calendar: "Calendar",
	shared: "Shared with me",
	trash: "Trash",
	settings: "Settings",
	profile: "Profile",
	appearance: "Appearance",
	notifications: "Notifications",
	members: "Members",
	billing: "Billing",
	danger: "Danger zone",
};

type Crumb = { label: string; href?: string; folder?: string };

function useCrumbs(): Crumb[] {
	const pathname = useLocation({ select: (location) => location.pathname });
	const search = useSearch({ strict: false });
	const segments = pathname.split("/").filter(Boolean);
	const docId = segments[0] === "docs" ? segments[1] : undefined;
	const doc = useQuery({ ...docQuery(docId ?? ""), enabled: Boolean(docId) });
	const folders = useQuery(foldersQuery);
	const tags = useQuery(tagsQuery);

	if (docId) {
		const folder = folders.data?.find((f) => f.id === doc.data?.folderId);
		return [
			{ label: "All docs", href: "/" },
			...(folder ? [{ label: folder.name, href: "/", folder: folder.id }] : []),
			{ label: doc.data ? doc.data.title || "Untitled" : "…" },
		];
	}
	if (segments.length === 0) {
		const folder = folders.data?.find((f) => f.id === search.folder);
		const tag = tags.data?.find((t) => t.id === search.tag);
		if (folder) return [{ label: "All docs", href: "/" }, { label: folder.name }];
		if (tag) return [{ label: "All docs", href: "/" }, { label: `#${tag.name}` }];
		return [{ label: "All docs" }];
	}
	return segments.map((segment, index) => ({
		label: SECTION_LABELS[segment] ?? segment,
		href: index < segments.length - 1 ? `/${segments.slice(0, index + 1).join("/")}` : undefined,
	}));
}

export function TopBar() {
	const pathname = useLocation({ select: (location) => location.pathname });
	const crumbs = useCrumbs();
	const view = useCollectionView();
	const { openPalette, openShare } = useShell();
	const workspaces = useQuery(workspacesQuery);
	const workspace = workspaces.data?.find((w) => w.current);
	const docId = pathname.startsWith("/docs/") ? pathname.split("/")[2] : undefined;
	const doc = useQuery({ ...docQuery(docId ?? ""), enabled: Boolean(docId) });
	const showViewSwitch = pathname === "/" || pathname === "/shared";

	return (
		<header className="glass sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-x-0 border-t-0 px-3 sm:px-4">
			<SidebarTrigger className="text-muted-foreground" />
			<Separator orientation="vertical" className="mr-1 hidden h-4 sm:block" />
			<Breadcrumb className="min-w-0 flex-1">
				<BreadcrumbList className="flex-nowrap">
					{workspace ? (
						<>
							<BreadcrumbItem className="hidden md:inline-flex">
								<BreadcrumbLink asChild>
									<Link to="/">{workspace.name}</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
						</>
					) : null}
					{crumbs.map((crumb, index) => {
						const last = index === crumbs.length - 1;
						return (
							<Fragment key={`${crumb.href ?? "here"}:${crumb.folder ?? ""}:${crumb.label}`}>
								<BreadcrumbItem className={last ? "min-w-0" : "hidden sm:inline-flex"}>
									{last || !crumb.href ? (
										<BreadcrumbPage className="truncate font-medium">{crumb.label}</BreadcrumbPage>
									) : (
										<BreadcrumbLink asChild>
											<Link to={crumb.href} search={crumb.folder ? { folder: crumb.folder } : {}}>
												{crumb.label}
											</Link>
										</BreadcrumbLink>
									)}
								</BreadcrumbItem>
								{last ? null : <BreadcrumbSeparator className="hidden sm:block" />}
							</Fragment>
						);
					})}
				</BreadcrumbList>
			</Breadcrumb>

			<div className="flex shrink-0 items-center gap-1">
				{showViewSwitch ? (
					<SegmentedControl<CollectionView>
						label="View"
						iconOnly
						value={view}
						onValueChange={setCollectionView}
						options={[
							{ value: "grid", label: "Grid view", icon: LayoutGridIcon },
							{ value: "list", label: "List view", icon: ListIcon },
						]}
					/>
				) : null}
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label="Search"
					className="text-muted-foreground md:hidden"
					onClick={openPalette}
				>
					<SearchIcon />
				</Button>
				<NotificationsPopover />
				<Button
					size="sm"
					className="ml-1 rounded-full max-sm:size-8 max-sm:p-0"
					aria-label="Share"
					onClick={() =>
						openShare(
							doc.data ? { id: doc.data.id, title: doc.data.title || "Untitled" } : undefined,
						)
					}
				>
					<Share2Icon />
					<span className="max-sm:sr-only">Share</span>
				</Button>
			</div>
		</header>
	);
}
