import { usePreferences, WALLPAPERS } from "@/lib/preferences";

/** Full-screen flat neutral. Light and dark layers both render; the theme class picks one, so there's no flash.
 * The colour comes from --wallpaper-*, which preferencesScript sets before paint, so a saved wallpaper doesn't flash either. */
export function Wallpaper() {
	const { wallpaper } = usePreferences();
	const current = WALLPAPERS.find((item) => item.id === wallpaper) ?? WALLPAPERS[0];

	return (
		<div aria-hidden className="fixed inset-0 z-0">
			<div
				className="absolute inset-0 transition-[background] duration-500 dark:hidden"
				style={{ background: `var(--wallpaper-light, ${current.light})` }}
			/>
			<div
				className="absolute inset-0 hidden transition-[background] duration-500 dark:block"
				style={{ background: `var(--wallpaper-dark, ${current.dark})` }}
			/>
		</div>
	);
}
