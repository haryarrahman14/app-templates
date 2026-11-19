import { Switch } from "@repo/ui/components/switch";
import { useTheme } from "@repo/ui/hooks/use-theme";
import { cn } from "@repo/ui/lib/cn";
import type { Theme } from "@repo/ui/lib/theme";
import { Check, Lock, Monitor, Moon, RotateCcw, Sparkles, Sun } from "lucide-react";
import type { CSSProperties } from "react";
import { AppScreen } from "@/components/kit/app-screen";
import { InsetRow, InsetSection } from "@/components/kit/inset-list";
import { usePhoneNav } from "@/lib/phone-nav";
import { ACCENTS, DEFAULT_PREFERENCES, usePreferences, WALLPAPERS } from "@/lib/preferences";

const THEMES: { value: Theme; label: string; icon: typeof Sun }[] = [
	{ value: "light", label: "Light", icon: Sun },
	{ value: "dark", label: "Dark", icon: Moon },
	{ value: "system", label: "Auto", icon: Monitor },
];

export function SettingsApp({ onLock }: { onLock: () => void }) {
	const nav = usePhoneNav();
	const prefs = usePreferences();
	const { theme, setTheme } = useTheme();

	return (
		<AppScreen title="Settings" back={{ label: "Home", onClick: nav.back }}>
			<div className="flex flex-col gap-7">
				<InsetSection header="Appearance">
					<fieldset className="min-w-0 grid grid-cols-3 gap-2 p-3" aria-label="Theme">
						{THEMES.map(({ value, label, icon: Icon }) => (
							<button
								key={value}
								type="button"
								aria-pressed={theme === value}
								onClick={() => setTheme(value)}
								className={cn(
									"flex flex-col items-center gap-1.5 rounded-xl py-3 font-medium text-[13px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50",
									theme === value
										? "bg-tint/12 text-tint-text"
										: "text-muted-foreground hover:bg-foreground/[0.04]",
								)}
							>
								<Icon className="size-5" />
								{label}
							</button>
						))}
					</fieldset>
				</InsetSection>

				<InsetSection header="Wallpaper" footer="Applies to the lock and home screens.">
					<fieldset className="min-w-0 grid grid-cols-4 gap-2.5 p-3" aria-label="Wallpaper">
						{WALLPAPERS.map((wall) => (
							<button
								key={wall.id}
								type="button"
								aria-pressed={prefs.wallpaper === wall.id}
								onClick={() => prefs.update({ wallpaper: wall.id })}
								className="group flex flex-col items-center gap-1.5 outline-none"
							>
								<span
									data-wallpaper={wall.id}
									className={cn(
										"wallpaper relative aspect-[9/16] w-full rounded-[10px] shadow-soft ring-offset-(--grouped-card) transition-shadow group-focus-visible:ring-2 group-focus-visible:ring-ring/50",
										prefs.wallpaper === wall.id && "ring-2 ring-tint ring-offset-2",
									)}
								>
									{prefs.wallpaper === wall.id ? (
										<Check className="absolute right-1.5 bottom-1.5 size-4 rounded-full bg-tint p-0.5 text-tint-foreground" />
									) : null}
								</span>
								<span className="text-[12px] text-muted-foreground">{wall.label}</span>
							</button>
						))}
					</fieldset>
				</InsetSection>

				<InsetSection header="Accent">
					<fieldset className="min-w-0 flex justify-between px-5 py-4" aria-label="Accent colour">
						{ACCENTS.map((accent) => (
							<button
								key={accent.id}
								type="button"
								aria-pressed={prefs.accent === accent.id}
								aria-label={accent.label}
								onClick={() => prefs.update({ accent: accent.id })}
								className={cn(
									"grid size-9 place-items-center rounded-full bg-(--swatch-light) text-tint-foreground outline-none ring-offset-(--grouped-card) transition-shadow focus-visible:ring-2 focus-visible:ring-ring/50 dark:bg-(--swatch-dark)",
									prefs.accent === accent.id &&
										"ring-(--swatch-light) ring-2 ring-offset-2 dark:ring-(--swatch-dark)",
								)}
								style={
									{
										"--swatch-light": accent.swatch.light,
										"--swatch-dark": accent.swatch.dark,
									} as CSSProperties
								}
							>
								{prefs.accent === accent.id ? <Check className="size-4" strokeWidth={3} /> : null}
							</button>
						))}
					</fieldset>
				</InsetSection>

				<InsetSection
					header="Motion"
					footer="Swaps zooms and slides for quick fades. Your system setting is respected either way."
				>
					<InsetRow
						icon={Sparkles}
						iconBackground="#007AFF"
						label={<label htmlFor="reduce-motion">Reduce motion</label>}
						trailing={
							<Switch
								id="reduce-motion"
								checked={prefs.reduceMotion}
								onCheckedChange={(checked) => prefs.update({ reduceMotion: checked })}
								className="data-[size=default]:h-[26px] data-[size=default]:w-[44px] [&>span]:size-[22px]! [&>span]:data-checked:translate-x-[18px]!"
							/>
						}
					/>
				</InsetSection>

				<InsetSection>
					<InsetRow icon={Lock} iconBackground="#8E8E93" label="Lock phone" onClick={onLock} />
					<InsetRow
						icon={RotateCcw}
						iconBackground="#FF3B30"
						label="Reset appearance"
						onClick={() => {
							prefs.update(DEFAULT_PREFERENCES);
							setTheme("system");
						}}
					/>
				</InsetSection>
			</div>
		</AppScreen>
	);
}
