import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@repo/ui/components/sidebar";
import { useTheme } from "@repo/ui/hooks/use-theme";
import type { Theme } from "@repo/ui/lib/theme";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
	ChevronsUpDown,
	Keyboard,
	LogOut,
	Monitor,
	Moon,
	Palette,
	Settings,
	Sun,
	User,
} from "lucide-react";
import { InitialsAvatar } from "@/components/kit/initials-avatar";
import { meQuery } from "@/features/workspace/api/queries";
import { signOut } from "@/lib/session";
import { setUi } from "@/lib/ui-state";

export function UserMenu() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: me } = useQuery(meQuery);
	const { theme, setTheme } = useTheme();
	const name = me?.name ?? "…";

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
							<InitialsAvatar name={name} size="md" />
							<span className="grid flex-1 text-left leading-tight">
								<span className="truncate font-medium text-sm">{name}</span>
								<span className="truncate text-muted-foreground text-xs">{me?.email}</span>
							</span>
							<ChevronsUpDown className="ml-auto text-muted-foreground" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent side="top" align="start" className="w-60 rounded-xl" sideOffset={6}>
						<DropdownMenuLabel className="font-normal">
							<div className="font-medium text-sm">{name}</div>
							<div className="text-muted-foreground text-xs">{me?.title}</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem onSelect={() => navigate({ to: "/settings/profile" })}>
							<User /> Profile
						</DropdownMenuItem>
						<DropdownMenuItem onSelect={() => navigate({ to: "/settings/workspace" })}>
							<Settings /> Settings
						</DropdownMenuItem>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<Palette /> Theme
							</DropdownMenuSubTrigger>
							<DropdownMenuSubContent className="rounded-xl">
								<DropdownMenuRadioGroup
									value={theme}
									onValueChange={(value) => setTheme(value as Theme)}
								>
									<DropdownMenuRadioItem value="light">
										<Sun /> Light
									</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="dark">
										<Moon /> Dark
									</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="system">
										<Monitor /> System
									</DropdownMenuRadioItem>
								</DropdownMenuRadioGroup>
							</DropdownMenuSubContent>
						</DropdownMenuSub>
						<DropdownMenuItem onSelect={() => setUi({ shortcutsOpen: true })}>
							<Keyboard /> Keyboard shortcuts
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onSelect={() => {
								signOut();
								queryClient.clear();
								navigate({ to: "/sign-in", replace: true });
							}}
						>
							<LogOut /> Sign out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
