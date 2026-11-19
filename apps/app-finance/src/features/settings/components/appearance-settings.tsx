import { Label } from "@repo/ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/components/select";
import { Switch } from "@repo/ui/components/switch";
import { useTheme } from "@repo/ui/hooks/use-theme";
import { cn } from "@repo/ui/lib/cn";
import type { Theme } from "@repo/ui/lib/theme";
import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { SettingsSection } from "@/features/settings/components/settings-section";
import { formatCurrency, formatNumber } from "@/lib/format";
import { type Preferences, setPreferences, usePreferences } from "@/lib/preferences";

const THEMES: { value: Theme; label: string; icon: typeof SunIcon }[] = [
	{ value: "light", label: "Light", icon: SunIcon },
	{ value: "dark", label: "Dark", icon: MoonIcon },
	{ value: "system", label: "System", icon: MonitorIcon },
];

const ACCENTS: {
	value: Preferences["accent"];
	label: string;
	swatch: string;
	check: string;
}[] = [
	{ value: "amber", label: "Amber", swatch: "#ffb020", check: "text-black" },
	{ value: "blue", label: "Blue", swatch: "#007aff", check: "text-white" },
	{ value: "teal", label: "Teal", swatch: "#30b0c7", check: "text-black" },
];

const LOCALES: { value: Preferences["numberLocale"]; label: string }[] = [
	{ value: "en-US", label: "1,234.56" },
	{ value: "de-DE", label: "1.234,56" },
	{ value: "fr-CH", label: "1 234,56" },
	{ value: "en-IN", label: "1,23,456.78" },
];

export function AppearanceSettings() {
	const { theme, setTheme } = useTheme();
	const prefs = usePreferences();

	return (
		<div className="space-y-6">
			<SettingsSection
				title="Theme"
				description="Dark is the default. Your choice is saved on this device."
			>
				<div role="radiogroup" aria-label="Theme" className="grid grid-cols-3 gap-3">
					{THEMES.map((option) => {
						const active = theme === option.value;
						return (
							// biome-ignore lint/a11y/useSemanticElements: card-style radio buttons.
							<button
								key={option.value}
								type="button"
								role="radio"
								aria-checked={active}
								onClick={() => setTheme(option.value)}
								className={cn(
									"flex flex-col items-center gap-2 rounded-xl border p-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
									active ? "border-tint bg-foreground/[0.03]" : "hover:bg-foreground/[0.03]",
								)}
							>
								<option.icon aria-hidden className="size-5" />
								{option.label}
							</button>
						);
					})}
				</div>
			</SettingsSection>

			<SettingsSection
				title="Accent colour"
				description="Used for buttons, focus rings and highlights. Gains and losses keep their own colours."
			>
				<div role="radiogroup" aria-label="Accent colour" className="flex flex-wrap gap-3">
					{ACCENTS.map((accent) => {
						const active = prefs.accent === accent.value;
						return (
							// biome-ignore lint/a11y/useSemanticElements: swatch radio buttons.
							<button
								key={accent.value}
								type="button"
								role="radio"
								aria-checked={active}
								aria-label={accent.label}
								onClick={() => setPreferences({ accent: accent.value })}
								className="flex items-center gap-2 rounded-full border py-1.5 pr-3 pl-1.5 text-sm transition-colors hover:bg-foreground/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-checked:border-foreground/40"
							>
								<span
									className="flex size-6 items-center justify-center rounded-full"
									style={{ background: accent.swatch }}
								>
									{active ? (
										<CheckIcon aria-hidden className={cn("size-3.5", accent.check)} />
									) : null}
								</span>
								{accent.label}
							</button>
						);
					})}
				</div>
			</SettingsSection>

			<SettingsSection
				title="Numbers"
				description="How amounts and percentages are written across the app."
			>
				<div className="grid gap-5 sm:grid-cols-2">
					<div className="grid gap-2">
						<Label htmlFor="number-format">Number format</Label>
						<Select
							value={prefs.numberLocale}
							onValueChange={(v) =>
								setPreferences({ numberLocale: v as Preferences["numberLocale"] })
							}
						>
							<SelectTrigger id="number-format" className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{LOCALES.map((l) => (
									<SelectItem key={l.value} value={l.value}>
										{l.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="currency">Display currency</Label>
						<Select
							value={prefs.currency}
							onValueChange={(v) => setPreferences({ currency: v as Preferences["currency"] })}
						>
							<SelectTrigger id="currency" className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{(["USD", "EUR", "GBP", "CHF"] as const).map((c) => (
									<SelectItem key={c} value={c}>
										{c}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<p className="text-muted-foreground text-xs">
							Changes the symbol only; sample values are not converted.
						</p>
					</div>
					<div className="flex items-center justify-between gap-4 rounded-xl border p-3 sm:col-span-2">
						<div>
							<Label htmlFor="compact">Compact large numbers</Label>
							<p className="text-muted-foreground text-xs">
								Show 12.4K instead of 12,400 for big amounts.
							</p>
						</div>
						<Switch
							id="compact"
							checked={prefs.compactNumbers}
							onCheckedChange={(v) => setPreferences({ compactNumbers: v })}
						/>
					</div>
				</div>
				<p className="mt-4 rounded-xl bg-foreground/[0.04] p-3 text-sm" aria-live="polite">
					Preview:{" "}
					<span className="font-medium tabular-nums">
						{formatCurrency(1284503.27, {
							locale: prefs.numberLocale,
							compact: prefs.compactNumbers,
							currency: prefs.currency,
						})}
					</span>{" "}
					· {formatNumber(48211, { locale: prefs.numberLocale, compact: prefs.compactNumbers })}{" "}
					shares
				</p>
			</SettingsSection>
		</div>
	);
}
