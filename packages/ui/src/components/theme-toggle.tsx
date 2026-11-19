"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { Button } from "#components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "#components/dropdown-menu";
import { useTheme } from "#hooks/use-theme";
import type { Theme } from "#lib/theme";

const OPTIONS: { value: Theme; label: string; icon: typeof SunIcon }[] = [
	{ value: "light", label: "Light", icon: SunIcon },
	{ value: "dark", label: "Dark", icon: MoonIcon },
	{ value: "system", label: "System", icon: MonitorIcon },
];

/** Light / Dark / System menu. Shows a neutral icon until the theme is known on the client. */
export function ThemeToggle({ className }: { className?: string }) {
	const { theme, resolvedTheme, setTheme } = useTheme();
	const Icon =
		resolvedTheme === "dark" ? MoonIcon : resolvedTheme === "light" ? SunIcon : MonitorIcon;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className={className} aria-label="Theme">
					<Icon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as Theme)}>
					{OPTIONS.map((option) => (
						<DropdownMenuRadioItem key={option.value} value={option.value}>
							<option.icon />
							{option.label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
