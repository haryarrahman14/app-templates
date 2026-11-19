import { DesktopIcons } from "@/features/desktop/components/desktop-icons";
import { Widgets } from "@/features/desktop/components/widgets";

type Props = {
	location: string;
	timeZone: string;
	latestNote?: { title: string; date: string };
};

/** Everything that sits on the wallpaper under the windows: shortcuts on the left, widgets on the right. */
export function DesktopSurface(props: Props) {
	return (
		<main className="fixed inset-x-0 top-8 bottom-[88px] z-[1] overflow-y-auto px-4 pt-5 pb-4 md:bottom-0 md:overflow-hidden md:p-0">
			<DesktopIcons className="md:absolute md:top-5 md:left-5" />
			<Widgets
				{...props}
				className="mx-auto mt-6 max-w-sm md:hidden lg:absolute lg:top-5 lg:right-5 lg:mt-0 lg:flex lg:w-72"
			/>
		</main>
	);
}
