import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupAction,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSkeleton,
	SidebarRail,
	useSidebar,
} from "@repo/ui/components/sidebar";
import { cn } from "@repo/ui/lib/cn";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useSearch } from "@tanstack/react-router";
import {
	BarChart3,
	CheckSquare,
	Home,
	NotebookPen,
	Plus,
	Rocket,
	Search,
	Sparkles,
	Star,
	UserPlus,
} from "lucide-react";
import { DOT_TONES, type PillTone } from "@/components/kit/pill";
import { Progress } from "@/components/kit/progress";
import { RecordGlyph } from "@/components/kit/record-glyph";
import { UserMenu } from "@/components/layout/user-menu";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import { useOnboarding } from "@/features/onboarding/hooks/use-onboarding";
import { tasksQuery } from "@/features/tasks/api/queries";
import { favouritesQuery, listsQuery } from "@/features/workspace/api/queries";
import type { ListColor } from "@/features/workspace/schemas/workspace";
import { hrefLink } from "@/lib/href-link";
import { RECORD_TYPES, type RecordType, recordHref } from "@/lib/records";
import { SESSION_MEMBER_ID } from "@/lib/session";
import { openCreate, setUi } from "@/lib/ui-state";

const QUICK = [
	{ href: "/home", label: "Home", icon: Home },
	{ href: "/tasks", label: "Tasks", icon: CheckSquare },
	{ href: "/notes", label: "Notes", icon: NotebookPen },
	{ href: "/reports", label: "Reports", icon: BarChart3 },
];

const RECORDS: RecordType[] = ["company", "person", "deal"];

export const LIST_TONE: Record<ListColor, PillTone> = {
	blue: "blue",
	gray: "gray",
	teal: "teal",
	orange: "orange",
	red: "red",
};

export function AppSidebar() {
	const pathname = useLocation({ select: (location) => location.pathname });
	const activeList = useSearch({ strict: false, select: (search) => search.list });
	const { setOpenMobile } = useSidebar();
	const lists = useQuery(listsQuery);
	const favourites = useQuery(favouritesQuery);
	const tasks = useQuery(tasksQuery);
	const onboarding = useOnboarding();

	const openTasks = (tasks.data ?? []).filter(
		(task) => !task.done && task.assigneeId === SESSION_MEMBER_ID,
	).length;
	const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
	const closeMobile = () => setOpenMobile(false);

	return (
		<Sidebar variant="inset" collapsible="icon">
			<SidebarHeader className="gap-1">
				<WorkspaceSwitcher />
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							tooltip="Search  ⌘K"
							onClick={() => {
								closeMobile();
								setUi({ commandOpen: true });
							}}
							className="text-muted-foreground"
						>
							<Search />
							<span>Search</span>
							<kbd className="ml-auto rounded border bg-background/60 px-1.5 font-sans text-[10px] text-muted-foreground group-data-[collapsible=icon]:hidden">
								⌘K
							</kbd>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{QUICK.map((item) => (
								<SidebarMenuItem key={item.href}>
									<SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.label}>
										<Link to={item.href} onClick={closeMobile}>
											<item.icon />
											<span>{item.label}</span>
											{item.href === "/tasks" && openTasks > 0 ? (
												<span className="ml-auto text-muted-foreground text-xs tabular-nums group-data-[collapsible=icon]:hidden">
													{openTasks}
												</span>
											) : null}
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Records</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{RECORDS.map((type) => {
								const meta = RECORD_TYPES[type];
								return (
									<SidebarMenuItem key={type}>
										<SidebarMenuButton
											asChild
											isActive={isActive(meta.basePath) && !activeList}
											tooltip={meta.plural}
										>
											<Link to={meta.basePath} onClick={closeMobile}>
												<RecordGlyph type={type} />
												<span>{meta.plural}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Lists</SidebarGroupLabel>
					<SidebarGroupAction title="New list" onClick={() => openCreate("list")}>
						<Plus />
						<span className="sr-only">New list</span>
					</SidebarGroupAction>
					<SidebarGroupContent>
						<SidebarMenu>
							{lists.isPending
								? [0, 1, 2].map((index) => (
										<SidebarMenuItem key={index}>
											<SidebarMenuSkeleton />
										</SidebarMenuItem>
									))
								: (lists.data ?? []).map((list) => (
										<SidebarMenuItem key={list.id}>
											<SidebarMenuButton
												asChild
												isActive={activeList === list.id}
												tooltip={list.name}
											>
												<Link
													{...hrefLink(`${RECORD_TYPES[list.recordType].basePath}?list=${list.id}`)}
													onClick={closeMobile}
												>
													<span className="flex size-4 items-center justify-center">
														<span
															className={cn(
																"size-2 rounded-full",
																DOT_TONES[LIST_TONE[list.color]],
															)}
														/>
													</span>
													<span>{list.name}</span>
													<span className="ml-auto text-muted-foreground text-xs tabular-nums group-data-[collapsible=icon]:hidden">
														{list.recordIds.length}
													</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Favourites</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{(favourites.data ?? []).map((favourite) => {
								const href = recordHref(favourite);
								return (
									<SidebarMenuItem key={`${favourite.type}-${favourite.id}`}>
										<SidebarMenuButton
											asChild
											isActive={pathname === href}
											tooltip={favourite.label}
										>
											<Link {...hrefLink(href)} onClick={closeMobile}>
												<RecordGlyph type={favourite.type} size="xs" className="mx-0.5" />
												<span>{favourite.label}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
							{favourites.data?.length === 0 ? (
								<p className="flex items-center gap-1.5 px-2 py-1 text-muted-foreground text-xs group-data-[collapsible=icon]:hidden">
									<Star className="size-3" /> Star a record to pin it here
								</p>
							) : null}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className="gap-1">
				<button
					type="button"
					onClick={() => {
						closeMobile();
						setUi({ onboardingOpen: true });
					}}
					className="mb-1 flex flex-col gap-2 rounded-xl border bg-background/70 p-3 text-left shadow-soft outline-none transition hover:bg-background focus-visible:ring-2 focus-visible:ring-ring group-data-[collapsible=icon]:hidden"
				>
					<span className="flex items-center gap-2 font-medium text-sm">
						<Rocket className="size-4 text-primary" />
						Getting started
						<span className="ml-auto text-muted-foreground text-xs tabular-nums">
							{onboarding.completed}/{onboarding.total}
						</span>
					</span>
					<Progress value={(onboarding.completed / onboarding.total) * 100} />
				</button>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton tooltip="Invite teammates" onClick={() => openCreate("invite")}>
							<UserPlus />
							<span>Invite teammates</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton asChild tooltip="Plan" isActive={pathname === "/settings/billing"}>
							<Link to="/settings/billing" onClick={closeMobile}>
								<Sparkles />
								<span>Trial · 12 days</span>
								<span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 font-medium text-[11px] text-primary group-data-[collapsible=icon]:hidden">
									Upgrade
								</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
				<UserMenu />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
