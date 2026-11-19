import { useTheme } from "@repo/ui/hooks/use-theme";
import { cn } from "@repo/ui/lib/cn";
import type { Theme } from "@repo/ui/lib/theme";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import type { ReactNode } from "react";
import { Group, GroupRow, PageBody, PageHeader } from "@/components/kit/page";
import type { AppViewProps } from "@/lib/apps";
import { ACCENTS, type Preferences, usePreferences, WALLPAPERS } from "@/lib/preferences";

const THEMES: { value: Theme; label: string; icon: typeof Sun }[] = [
	{ value: "light", label: "Light", icon: Sun },
	{ value: "dark", label: "Dark", icon: Moon },
	{ value: "system", label: "Auto", icon: Monitor },
];

const MOTION: { value: Preferences["reduceMotion"]; label: string }[] = [
	{ value: "system", label: "System" },
	{ value: "on", label: "Reduced" },
	{ value: "off", label: "Full" },
];

/** Visitor preferences. Stored in this browser only (localStorage). */
export function SettingsPage(_: AppViewProps) {
	const { theme, setTheme } = useTheme();
	const { preferences, update } = usePreferences();

	return (
		<div className="h-full overflow-y-auto">
			<PageBody className="max-w-2xl">
				<PageHeader
					title="Settings"
					description="Make the place yours. Saved in this browser only."
				/>

				<Group title="Appearance">
					<div className="grid grid-cols-3 gap-3 p-4">
						{THEMES.map((option) => (
							<button
								key={option.value}
								type="button"
								aria-pressed={theme === option.value}
								onClick={() => setTheme(option.value)}
								className={cn(
									"flex flex-col items-center gap-2 rounded-2xl border p-3 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
									theme === option.value
										? "border-tint-text bg-tint/15"
										: "border-border hover:bg-shade/4",
								)}
							>
								<ThemePreview mode={option.value} />
								<span className="flex items-center gap-1.5 font-medium text-[13.5px]">
									<option.icon className="size-3.5" />
									{option.label}
								</span>
							</button>
						))}
					</div>
				</Group>

				<Group title="Wallpaper">
					<div className="grid grid-cols-2 gap-3 p-4 @md:grid-cols-4">
						{WALLPAPERS.map((wallpaper) => (
							<button
								key={wallpaper.id}
								type="button"
								aria-pressed={preferences.wallpaper === wallpaper.id}
								onClick={() => update({ wallpaper: wallpaper.id })}
								className="group flex flex-col items-center gap-2 rounded-2xl outline-none"
							>
								<span
									data-wallpaper={wallpaper.id}
									style={{ background: "var(--wallpaper)" }}
									className={cn(
										"relative block aspect-[4/3] w-full rounded-xl border shadow-soft transition group-focus-visible:ring-2 group-focus-visible:ring-ring",
										preferences.wallpaper === wallpaper.id
											? "border-tint-text ring-2 ring-tint"
											: "border-border",
									)}
								>
									{preferences.wallpaper === wallpaper.id ? <SelectedBadge /> : null}
								</span>
								<span className="text-[13px]">{wallpaper.name}</span>
							</button>
						))}
					</div>
				</Group>

				<Group title="Accent colour">
					<GroupRow label="Accent">
						<div className="flex gap-2.5">
							{ACCENTS.map((accent) => (
								<button
									key={accent.id}
									type="button"
									aria-pressed={preferences.accent === accent.id}
									aria-label={accent.name}
									title={accent.name}
									onClick={() => update({ accent: accent.id })}
									className={cn(
										"flex size-7 items-center justify-center rounded-full bg-tint text-tint-foreground outline-none ring-offset-2 ring-offset-card transition focus-visible:ring-2 focus-visible:ring-ring",
										preferences.accent === accent.id && "ring-2 ring-shade/30",
									)}
									data-accent={accent.id}
								>
									{preferences.accent === accent.id ? (
										<Check className="size-3.5" strokeWidth={3} />
									) : null}
								</button>
							))}
						</div>
					</GroupRow>
				</Group>

				<Group
					title="Motion"
					footer="Reduced turns off springs, scaling and the edit-mode wobble. System follows your device."
				>
					<GroupRow label="Animations">
						<Segmented
							label="Animations"
							value={preferences.reduceMotion}
							options={MOTION}
							onChange={(value) => update({ reduceMotion: value })}
						/>
					</GroupRow>
				</Group>
			</PageBody>
		</div>
	);
}

function SelectedBadge() {
	return (
		<span className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-tint text-tint-foreground shadow-soft">
			<Check className="size-3" strokeWidth={3} />
		</span>
	);
}

function ThemePreview({ mode }: { mode: Theme }) {
	const half = (dark: boolean): ReactNode => (
		<span className={cn("flex flex-1 flex-col gap-1 p-2", dark ? "bg-[#121212]" : "bg-white")}>
			<span className={cn("h-1.5 w-8 rounded-full", dark ? "bg-white/40" : "bg-black/20")} />
			<span className={cn("h-1.5 w-5 rounded-full", dark ? "bg-white/20" : "bg-black/10")} />
			<span className="mt-auto h-3 w-full rounded-[4px] bg-tint" />
		</span>
	);
	return (
		<span aria-hidden className="flex h-16 w-full overflow-hidden rounded-xl border border-border">
			{mode === "dark" ? half(true) : half(false)}
			{mode === "system" ? half(true) : null}
		</span>
	);
}

function Segmented<T extends string>({
	label,
	value,
	options,
	onChange,
}: {
	label: string;
	value: T;
	options: { value: T; label: string }[];
	onChange: (value: T) => void;
}) {
	return (
		<fieldset className="flex rounded-lg bg-shade/6 p-0.5">
			<legend className="sr-only">{label}</legend>
			{options.map((option) => (
				<button
					key={option.value}
					type="button"
					aria-pressed={value === option.value}
					onClick={() => onChange(option.value)}
					className={cn(
						"rounded-md px-3 py-1 font-medium text-[13px] outline-none transition focus-visible:ring-2 focus-visible:ring-ring",
						value === option.value
							? "bg-card shadow-soft"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					{option.label}
				</button>
			))}
		</fieldset>
	);
}
