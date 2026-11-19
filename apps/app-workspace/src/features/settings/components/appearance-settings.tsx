import { useTheme } from "@repo/ui/hooks/use-theme";
import { cn } from "@repo/ui/lib/cn";
import type { Theme } from "@repo/ui/lib/theme";
import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { RadioCards } from "@/components/kit/radio-cards";
import { SegmentedControl } from "@/components/kit/segmented-control";
import { SettingsCard } from "@/features/settings/components/settings-card";
import {
	ACCENTS,
	type Accent,
	applyAppearance,
	DEFAULT_ACCENT,
	type Density,
	readAppearance,
} from "@/lib/appearance";

const THEMES: { value: Theme; label: string; icon: typeof SunIcon; preview: string }[] = [
	{ value: "light", label: "Light", icon: SunIcon, preview: "bg-[#FAFAFA]" },
	{ value: "dark", label: "Dark", icon: MoonIcon, preview: "bg-[#111111]" },
	{
		value: "system",
		label: "System",
		icon: MonitorIcon,
		preview: "bg-[linear-gradient(90deg,#FAFAFA_50%,#111111_50%)]",
	},
];

export function AppearanceSettings() {
	const { theme, setTheme } = useTheme();
	const [prefs, setPrefs] = useState<{ accent: Accent; density: Density }>({
		accent: DEFAULT_ACCENT,
		density: "comfortable",
	});

	useEffect(() => setPrefs(readAppearance()), []);

	const update = (patch: Partial<typeof prefs>) => {
		const next = { ...prefs, ...patch };
		setPrefs(next);
		applyAppearance(next);
	};

	return (
		<>
			<SettingsCard
				title="Theme"
				description="Light is lovely in the day; dark is easier at night."
			>
				<RadioCards<Theme>
					name="theme"
					label="Theme"
					value={theme}
					onValueChange={setTheme}
					options={THEMES}
					className="grid grid-cols-3 gap-3"
					itemClassName="rounded-2xl"
					renderItem={(option, checked) => {
						const item = THEMES.find((t) => t.value === option.value);
						const Icon = item?.icon ?? SunIcon;
						return (
							<span
								className={cn(
									"block space-y-2 rounded-2xl border p-2 transition-colors hover:bg-accent",
									checked && "border-tint ring-1 ring-tint",
								)}
							>
								<span className={cn("block h-16 rounded-xl border", item?.preview)} />
								<span className="flex items-center gap-1.5 px-1 text-sm">
									<Icon className="size-3.5" /> {option.label}
								</span>
							</span>
						);
					}}
				/>
			</SettingsCard>
			<SettingsCard
				title="Accent"
				description="One highlighter colour for selected text, the active item, checked to-dos and unread dots."
			>
				<RadioCards<Accent>
					name="accent"
					label="Accent colour"
					value={prefs.accent}
					onValueChange={(accent) => update({ accent })}
					options={(Object.keys(ACCENTS) as Accent[]).map((accent) => ({
						value: accent,
						label: ACCENTS[accent].label,
					}))}
					className="flex flex-wrap gap-3"
					itemClassName="group rounded-xl"
					renderItem={(option, checked) => (
						<span className="flex flex-col items-center gap-1.5 p-1">
							<span
								className="flex size-10 items-center justify-center rounded-full shadow-soft transition-transform group-hover:scale-105 motion-reduce:transition-none"
								style={{ background: ACCENTS[option.value].light }}
							>
								{checked ? <CheckIcon className="size-4 text-[#1A1A1A]" /> : null}
							</span>
							<span className="text-muted-foreground text-xs">{option.label}</span>
						</span>
					)}
				/>
			</SettingsCard>
			<SettingsCard
				title="Density"
				description="Compact fits more on screen; comfortable gives everything room."
			>
				<SegmentedControl<Density>
					label="Density"
					value={prefs.density}
					onValueChange={(density) => update({ density })}
					options={[
						{ value: "comfortable", label: "Comfortable" },
						{ value: "compact", label: "Compact" },
					]}
				/>
			</SettingsCard>
		</>
	);
}
