import { Switch } from "@repo/ui/components/switch";
import { useTheme } from "@repo/ui/hooks/use-theme";
import { cn } from "@repo/ui/lib/cn";
import type { Theme } from "@repo/ui/lib/theme";
import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ACCENTS, usePreferences, WALLPAPERS } from "@/lib/preferences";

const THEMES: { value: Theme; label: string; icon: typeof SunIcon }[] = [
	{ value: "light", label: "Light", icon: SunIcon },
	{ value: "dark", label: "Dark", icon: MoonIcon },
	{ value: "system", label: "Auto", icon: MonitorIcon },
];

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
	return (
		<section className="rounded-2xl bg-background/70 p-5 shadow-soft dark:bg-foreground/[0.04]">
			<h2 className="font-semibold text-sm">{title}</h2>
			{hint && <p className="text-muted-foreground text-sm">{hint}</p>}
			<div className="mt-4">{children}</div>
		</section>
	);
}

export function SettingsApp() {
	const { theme, resolvedTheme, setTheme } = useTheme();
	const prefs = usePreferences();

	return (
		<div className="h-full overflow-y-auto bg-foreground/[0.02]">
			<div className="mx-auto flex max-w-xl flex-col gap-4 p-5 md:p-7">
				<Section title="Appearance" hint="Auto follows your system.">
					<div className="grid grid-cols-3 gap-3">
						{THEMES.map((option) => {
							const active = theme === option.value;
							return (
								<button
									key={option.value}
									type="button"
									aria-pressed={active}
									onClick={() => setTheme(option.value)}
									className="flex flex-col items-center gap-2 text-sm"
								>
									<span
										className={cn(
											"flex aspect-[4/3] w-full items-center justify-center rounded-xl shadow-[inset_0_0_0_1px_var(--border)] ring-2 transition-shadow",
											option.value === "light" && "bg-[#ffffff] text-[#222222]",
											option.value === "dark" && "bg-[#121212] text-[#ffffff]",
											option.value === "system" &&
												"bg-[linear-gradient(135deg,#ffffff_50%,#121212_50%)] text-tint",
											active ? "ring-tint" : "ring-transparent",
										)}
									>
										<option.icon className="size-5" />
									</span>
									<span className={active ? "font-medium" : "text-muted-foreground"}>
										{option.label}
									</span>
								</button>
							);
						})}
					</div>
				</Section>

				<Section title="Wallpaper">
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
						{WALLPAPERS.map((wallpaper) => {
							const active = prefs.wallpaper === wallpaper.id;
							return (
								<button
									key={wallpaper.id}
									type="button"
									aria-pressed={active}
									onClick={() => prefs.set({ wallpaper: wallpaper.id })}
									className="flex flex-col items-center gap-2 text-sm"
								>
									<span
										className={cn(
											"relative aspect-[4/3] w-full rounded-xl shadow-[inset_0_0_0_1px_var(--border)] ring-2 ring-offset-2 ring-offset-background transition-shadow",
											active ? "ring-tint" : "ring-transparent",
										)}
										style={{
											background: resolvedTheme === "dark" ? wallpaper.dark : wallpaper.light,
										}}
									>
										{active && (
											<CheckIcon className="absolute right-1.5 bottom-1.5 size-4 rounded-full bg-tint p-0.5 text-tint-foreground" />
										)}
									</span>
									<span className={active ? "font-medium" : "text-muted-foreground"}>
										{wallpaper.name}
									</span>
								</button>
							);
						})}
					</div>
				</Section>

				<Section title="Accent colour" hint="Buttons, links and highlights.">
					<div className="flex flex-wrap gap-3">
						{ACCENTS.map((accent) => {
							const active = prefs.accent === accent.id;
							return (
								<button
									key={accent.id}
									type="button"
									aria-pressed={active}
									aria-label={accent.name}
									title={accent.name}
									onClick={() => prefs.set({ accent: accent.id })}
									className={cn(
										"flex size-8 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-background transition-shadow",
										active ? "ring-foreground/30" : "ring-transparent",
									)}
									style={{ background: accent.swatch }}
								>
									{active && <CheckIcon className="size-4 text-tint-foreground" />}
								</button>
							);
						})}
					</div>
				</Section>

				<Section title="Motion">
					<div className="flex items-center justify-between gap-4">
						<span>
							<label htmlFor="reduce-motion" className="block text-sm">
								Reduce motion
							</label>
							<span className="block text-muted-foreground text-sm">
								Turns off window animations and dock magnification.
							</span>
						</span>
						<Switch
							id="reduce-motion"
							checked={prefs.reduceMotion}
							onCheckedChange={(checked) => prefs.set({ reduceMotion: checked })}
						/>
					</div>
				</Section>
			</div>
		</div>
	);
}
