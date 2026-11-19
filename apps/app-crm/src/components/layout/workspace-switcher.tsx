import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@repo/ui/components/sidebar";
import { toast } from "@repo/ui/components/sonner";
import { useNavigate } from "@tanstack/react-router";
import { Check, ChevronsUpDown, Plus, Settings, Upload } from "lucide-react";
import { APP_NAME, WORKSPACE_NAME } from "@/lib/site";
import { setUi } from "@/lib/ui-state";

const OTHER_WORKSPACES = ["Fernhill Personal", "Harbour Side Project"];

export function WorkspaceSwitcher() {
	const navigate = useNavigate();
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
							<span className="flex aspect-square size-8 items-center justify-center rounded-[10px] bg-primary font-semibold text-primary-foreground text-sm shadow-soft">
								F
							</span>
							<span className="grid flex-1 text-left leading-tight">
								<span className="truncate font-semibold text-sm">{WORKSPACE_NAME}</span>
								<span className="truncate text-muted-foreground text-xs">{APP_NAME} · Trial</span>
							</span>
							<ChevronsUpDown className="ml-auto text-muted-foreground" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-64 rounded-xl" align="start" sideOffset={6}>
						<DropdownMenuLabel className="text-muted-foreground text-xs">
							Workspaces
						</DropdownMenuLabel>
						<DropdownMenuItem>
							<Check /> {WORKSPACE_NAME}
							<DropdownMenuShortcut>⌘1</DropdownMenuShortcut>
						</DropdownMenuItem>
						{OTHER_WORKSPACES.map((name) => (
							<DropdownMenuItem
								key={name}
								onSelect={() =>
									toast(`Switching workspaces is not part of the sample`, { description: name })
								}
							>
								<span className="size-4" /> {name}
							</DropdownMenuItem>
						))}
						<DropdownMenuSeparator />
						<DropdownMenuItem onSelect={() => navigate({ to: "/settings/workspace" })}>
							<Settings /> Workspace settings
						</DropdownMenuItem>
						<DropdownMenuItem onSelect={() => setUi({ importOpen: true })}>
							<Upload /> Import data
						</DropdownMenuItem>
						<DropdownMenuItem
							onSelect={() => toast("Creating workspaces is not part of the sample")}
						>
							<Plus /> New workspace
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
