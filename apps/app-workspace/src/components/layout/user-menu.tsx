import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@repo/ui/components/sidebar";
import { useTheme } from "@repo/ui/hooks/use-theme";
import type { Theme } from "@repo/ui/lib/theme";
import { useNavigate } from "@tanstack/react-router";
import {
	ChevronsUpDownIcon,
	KeyboardIcon,
	LogOutIcon,
	MonitorIcon,
	MoonIcon,
	SettingsIcon,
	SunIcon,
	UserIcon,
} from "lucide-react";
import { UserAvatar } from "@/components/kit/user-avatar";
import { useShell } from "@/components/layout/shell-context";
import { useSessionUser } from "@/lib/session-context";

export function UserMenu({ onSignOut }: { onSignOut: () => void }) {
	const user = useSessionUser();
	const navigate = useNavigate();
	const { theme, setTheme } = useTheme();
	const { openShortcuts } = useShell();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-open:bg-sidebar-accent"
							tooltip={user.name}
						>
							<UserAvatar name={user.name} />
							<span className="grid flex-1 text-left leading-tight">
								<span className="truncate font-medium text-sm">{user.name}</span>
								<span className="truncate text-muted-foreground text-xs">{user.email}</span>
							</span>
							<ChevronsUpDownIcon className="ml-auto text-muted-foreground" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent side="top" align="start" className="w-60">
						<DropdownMenuLabel className="font-normal">
							<span className="block font-medium text-foreground text-sm">{user.name}</span>
							<span className="block text-muted-foreground text-xs">{user.email}</span>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem onSelect={() => navigate({ to: "/settings/profile" })}>
							<UserIcon /> Profile
						</DropdownMenuItem>
						<DropdownMenuItem onSelect={() => navigate({ to: "/settings/appearance" })}>
							<SettingsIcon /> Settings
						</DropdownMenuItem>
						<DropdownMenuItem onSelect={openShortcuts}>
							<KeyboardIcon /> Keyboard shortcuts <DropdownMenuShortcut>?</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuLabel className="text-muted-foreground text-xs">Theme</DropdownMenuLabel>
						<DropdownMenuRadioGroup
							value={theme}
							onValueChange={(value) => setTheme(value as Theme)}
						>
							<DropdownMenuRadioItem value="light">
								<SunIcon /> Light
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="dark">
								<MoonIcon /> Dark
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="system">
								<MonitorIcon /> System
							</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem onSelect={onSignOut}>
							<LogOutIcon /> Sign out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
