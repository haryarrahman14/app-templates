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
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
	useSidebar,
} from "@repo/ui/components/sidebar";
import { Skeleton } from "@repo/ui/components/skeleton";
import { cn } from "@repo/ui/lib/cn";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useSearch } from "@tanstack/react-router";
import {
	CalendarIcon,
	CheckSquareIcon,
	ChevronRightIcon,
	FolderIcon,
	FolderOpenIcon,
	LayoutGridIcon,
	PlusIcon,
	SearchIcon,
	SquarePenIcon,
	Trash2Icon,
	UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { Kbd } from "@/components/kit/kbd";
import { TagDot } from "@/components/kit/tag-pill";
import { useShell } from "@/components/layout/shell-context";
import { UserMenu } from "@/components/layout/user-menu";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import { docsQuery, foldersQuery, tagsQuery } from "@/features/documents/api/queries";
import { NewFolderDialog } from "@/features/documents/components/new-folder-dialog";
import { useNewDoc } from "@/features/documents/hooks/use-new-doc";

const NAV = [
	{ label: "All docs", href: "/", icon: LayoutGridIcon },
	{ label: "Tasks", href: "/tasks", icon: CheckSquareIcon },
	{ label: "Calendar", href: "/calendar", icon: CalendarIcon },
	{ label: "Shared with me", href: "/shared", icon: UsersIcon },
];

export function AppSidebar({ onSignOut }: { onSignOut: () => void }) {
	const pathname = useLocation({ select: (location) => location.pathname });
	const search = useSearch({ strict: false });
	const { openPalette } = useShell();
	const { isMobile, setOpenMobile } = useSidebar();
	const { newDoc, isPending } = useNewDoc();
	const docs = useQuery(docsQuery);
	const folders = useQuery(foldersQuery);
	const tags = useQuery(tagsQuery);
	const [folderDialog, setFolderDialog] = useState(false);
	const [expanded, setExpanded] = useState<Record<string, boolean>>({ "f-projects": true });

	const closeOnMobile = () => {
		if (isMobile) setOpenMobile(false);
	};
	const hasFilter = Boolean(search.folder || search.tag);
	const starred = (docs.data ?? []).filter((doc) => doc.starred);
	const rootFolders = (folders.data ?? []).filter((f) => !f.parentId);
	const childrenOf = (id: string) => (folders.data ?? []).filter((f) => f.parentId === id);

	return (
		<Sidebar collapsible="icon" className="border-sidebar-border backdrop-blur-xl">
			<SidebarHeader className="gap-1 pt-3">
				<WorkspaceSwitcher />
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							tooltip="Search (⌘K)"
							onClick={openPalette}
							className="text-muted-foreground"
						>
							<SearchIcon />
							<span>Search</span>
							<Kbd className="ml-auto group-data-[collapsible=icon]:hidden">⌘K</Kbd>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton
							tooltip="New document (N)"
							disabled={isPending}
							onClick={() => {
								newDoc();
								closeOnMobile();
							}}
						>
							<SquarePenIcon className="text-primary" />
							<span>New document</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{NAV.map((item) => (
								<SidebarMenuItem key={item.href}>
									<SidebarMenuButton
										asChild
										tooltip={item.label}
										isActive={
											item.href === "/"
												? pathname === "/" && !hasFilter
												: pathname.startsWith(item.href)
										}
									>
										<Link to={item.href} onClick={closeOnMobile}>
											<item.icon />
											<span>{item.label}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup className="group-data-[collapsible=icon]:hidden">
					<SidebarGroupLabel>Starred</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{docs.isPending ? (
								<SidebarSkeleton />
							) : starred.length ? (
								starred.map((doc) => (
									<SidebarMenuItem key={doc.id}>
										<SidebarMenuButton asChild size="sm" isActive={pathname === `/docs/${doc.id}`}>
											<Link to="/docs/$docId" params={{ docId: doc.id }} onClick={closeOnMobile}>
												<span aria-hidden className="w-4 text-center">
													{doc.emoji}
												</span>
												<span>{doc.title || "Untitled"}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))
							) : (
								<p className="px-2 text-muted-foreground text-xs">
									Star a document to keep it here.
								</p>
							)}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup className="group-data-[collapsible=icon]:hidden">
					<SidebarGroupLabel>Folders</SidebarGroupLabel>
					<SidebarGroupAction title="New folder" onClick={() => setFolderDialog(true)}>
						<PlusIcon />
						<span className="sr-only">New folder</span>
					</SidebarGroupAction>
					<SidebarGroupContent>
						<SidebarMenu>
							{folders.isPending ? (
								<SidebarSkeleton />
							) : (
								rootFolders.map((folder) => {
									const children = childrenOf(folder.id);
									const open = expanded[folder.id] ?? false;
									const active = search.folder === folder.id;
									return (
										<SidebarMenuItem key={folder.id}>
											<SidebarMenuButton asChild size="sm" isActive={pathname === "/" && active}>
												<Link to="/" search={{ folder: folder.id }} onClick={closeOnMobile}>
													{active ? <FolderOpenIcon /> : <FolderIcon />}
													<span>{folder.name}</span>
												</Link>
											</SidebarMenuButton>
											{children.length ? (
												<>
													<SidebarMenuAction
														aria-label={open ? `Collapse ${folder.name}` : `Expand ${folder.name}`}
														aria-expanded={open}
														onClick={() => setExpanded((e) => ({ ...e, [folder.id]: !open }))}
													>
														<ChevronRightIcon
															className={cn("transition-transform", open && "rotate-90")}
														/>
													</SidebarMenuAction>
													{open ? (
														<SidebarMenuSub>
															{children.map((child) => (
																<SidebarMenuSubItem key={child.id}>
																	<SidebarMenuSubButton
																		asChild
																		size="sm"
																		isActive={pathname === "/" && search.folder === child.id}
																	>
																		<Link
																			to="/"
																			search={{ folder: child.id }}
																			onClick={closeOnMobile}
																		>
																			<FolderIcon />
																			<span>{child.name}</span>
																		</Link>
																	</SidebarMenuSubButton>
																</SidebarMenuSubItem>
															))}
														</SidebarMenuSub>
													) : null}
												</>
											) : null}
										</SidebarMenuItem>
									);
								})
							)}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup className="group-data-[collapsible=icon]:hidden">
					<SidebarGroupLabel>Tags</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{(tags.data ?? []).map((tag) => (
								<SidebarMenuItem key={tag.id}>
									<SidebarMenuButton
										asChild
										size="sm"
										isActive={pathname === "/" && search.tag === tag.id}
									>
										<Link to="/" search={{ tag: tag.id }} onClick={closeOnMobile}>
											<span className="flex size-4 items-center justify-center">
												<TagDot tint={tag.tint} />
											</span>
											<span>{tag.name}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className="pb-3">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild tooltip="Trash" isActive={pathname === "/trash"}>
							<Link to="/trash" onClick={closeOnMobile}>
								<Trash2Icon />
								<span>Trash</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
				<UserMenu onSignOut={onSignOut} />
			</SidebarFooter>
			<SidebarRail />
			<NewFolderDialog open={folderDialog} onOpenChange={setFolderDialog} />
		</Sidebar>
	);
}

function SidebarSkeleton() {
	return (
		<div className="space-y-2 px-2 py-1">
			<Skeleton className="h-4 w-3/4" />
			<Skeleton className="h-4 w-1/2" />
		</div>
	);
}
