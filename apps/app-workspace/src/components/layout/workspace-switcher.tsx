import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@repo/ui/components/sidebar";
import { Skeleton } from "@repo/ui/components/skeleton";
import { cn } from "@repo/ui/lib/cn";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { CheckIcon, ChevronsUpDownIcon, PlusIcon, SettingsIcon } from "lucide-react";
import { AVATAR_NEUTRAL } from "@/components/kit/user-avatar";
import { useSwitchWorkspace } from "@/features/settings/api/mutations";
import { workspacesQuery } from "@/features/settings/api/queries";
import { initialsOf } from "@/lib/session";

function WorkspaceTile({ name }: { name: string }) {
	return (
		<span
			className={cn(
				"flex size-8 shrink-0 items-center justify-center rounded-lg font-semibold text-xs",
				AVATAR_NEUTRAL,
			)}
		>
			{initialsOf(name)}
		</span>
	);
}

export function WorkspaceSwitcher() {
	const navigate = useNavigate();
	const workspaces = useQuery(workspacesQuery);
	const switchTo = useSwitchWorkspace();
	const current = workspaces.data?.find((w) => w.current);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-open:bg-sidebar-accent"
							tooltip="Switch workspace"
						>
							{current ? (
								<WorkspaceTile name={current.name} />
							) : (
								<Skeleton className="size-8 rounded-lg" />
							)}
							<span className="grid flex-1 text-left leading-tight">
								<span className="truncate font-semibold text-sm">
									{current?.name ?? "Loading…"}
								</span>
								<span className="truncate text-muted-foreground text-xs">Team plan</span>
							</span>
							<ChevronsUpDownIcon className="ml-auto text-muted-foreground" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-64">
						<DropdownMenuLabel>Workspaces</DropdownMenuLabel>
						{(workspaces.data ?? []).map((workspace) => (
							<DropdownMenuItem
								key={workspace.id}
								onSelect={() => {
									if (!workspace.current) switchTo.mutate(workspace.id);
								}}
							>
								<WorkspaceTile name={workspace.name} />
								<span className="flex-1 truncate">{workspace.name}</span>
								{workspace.current ? <CheckIcon /> : null}
							</DropdownMenuItem>
						))}
						<DropdownMenuSeparator />
						<DropdownMenuItem onSelect={() => navigate({ to: "/onboarding" })}>
							<PlusIcon /> Create workspace
						</DropdownMenuItem>
						<DropdownMenuItem onSelect={() => navigate({ to: "/settings/members" })}>
							<SettingsIcon /> Workspace settings
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
