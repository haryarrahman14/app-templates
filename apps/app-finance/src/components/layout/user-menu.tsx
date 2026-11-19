import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { toast } from "@repo/ui/components/sonner";
import { useTheme } from "@repo/ui/hooks/use-theme";
import type { Theme } from "@repo/ui/lib/theme";
import { Link, useNavigate } from "@tanstack/react-router";
import {
	CreditCardIcon,
	LogOutIcon,
	MonitorIcon,
	MoonIcon,
	SettingsIcon,
	SunIcon,
	UserIcon,
} from "lucide-react";
import { useSession } from "@/components/layout/session-context";
import { useSignOut } from "@/features/auth/api/mutations";

export function initials(name: string) {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

export function UserMenu() {
	const session = useSession();
	const navigate = useNavigate();
	const { theme, setTheme } = useTheme();
	const signOut = useSignOut();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="rounded-full" aria-label="Account menu">
					<Avatar className="size-8">
						<AvatarFallback className="bg-lettermark text-lettermark-foreground font-medium text-xs">
							{initials(session.name)}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-60">
				<DropdownMenuLabel className="font-normal">
					<p className="font-medium text-foreground text-sm">{session.name}</p>
					<p className="truncate text-muted-foreground text-xs">{session.email}</p>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link to="/settings/profile">
							<UserIcon />
							Profile
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link to="/settings/billing">
							<CreditCardIcon />
							Billing
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link to="/settings/appearance">
							<SettingsIcon />
							Settings
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuLabel className="text-muted-foreground text-xs">Theme</DropdownMenuLabel>
				<DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as Theme)}>
					<DropdownMenuRadioItem value="light">
						<SunIcon />
						Light
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="dark">
						<MoonIcon />
						Dark
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="system">
						<MonitorIcon />
						System
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					variant="destructive"
					disabled={signOut.isPending}
					onSelect={() =>
						signOut.mutate(undefined, {
							onSuccess: () => {
								navigate({ to: "/sign-in", replace: true });
							},
							onError: () => toast.error("Sign out failed. Try again."),
						})
					}
				>
					<LogOutIcon />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
