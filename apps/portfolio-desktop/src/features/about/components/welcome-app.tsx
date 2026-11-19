import { Button } from "@repo/ui/components/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRightIcon, MailIcon, MapPinIcon } from "lucide-react";
import { InitialsAvatar } from "@/components/kit/initials-avatar";
import { profileQuery } from "@/features/about/api/queries";
import { useWindows } from "@/lib/window-store";

const HOW_IT_WORKS = [
	{ title: "Dock", detail: "Open any app with one click. A dot marks what is running." },
	{ title: "Windows", detail: "Drag by the title bar, resize from the edges, Esc to close." },
	{ title: "Terminal", detail: "Prefer typing? Try help, projects or open notes." },
	{ title: "Share", detail: "The address bar follows the window in front, so links open it." },
];

/** The window open on first load: who this is, what they do, and where to go next. */
export function WelcomeApp() {
	const { data: profile } = useSuspenseQuery(profileQuery);
	const { open } = useWindows();

	return (
		<div className="grid h-full overflow-y-auto md:grid-cols-[1.15fr_1fr] md:overflow-hidden">
			<div className="flex flex-col justify-center gap-6 p-7 md:p-10">
				<p className="font-medium text-[11px] text-muted-foreground uppercase tracking-[0.14em]">
					Portfolio
				</p>
				<div className="flex items-center gap-4">
					<InitialsAvatar name={profile.name} size={60} />
					<div className="min-w-0">
						<h1 className="font-semibold text-3xl leading-tight tracking-tight md:text-[2.1rem]">
							{profile.name}
						</h1>
						<p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-muted-foreground text-sm">
							<span className="font-medium text-tint-text">{profile.role}</span>
							<span className="inline-flex items-center gap-1">
								<MapPinIcon className="size-3.5" />
								{profile.location}
							</span>
						</p>
					</div>
				</div>
				<p className="max-w-md text-[15px] text-foreground/80 leading-relaxed">{profile.pitch}</p>
				<div className="flex flex-wrap gap-2.5">
					<Button size="lg" className="rounded-full px-5" onClick={() => open("about")}>
						About me
						<ArrowRightIcon />
					</Button>
					<Button
						size="lg"
						variant="outline"
						className="rounded-full bg-background/60 px-5"
						onClick={() => open("contact")}
					>
						<MailIcon />
						Contact
					</Button>
				</div>
			</div>
			<aside className="flex flex-col justify-center gap-5 border-foreground/5 bg-foreground/[0.025] p-7 max-md:border-t md:border-l md:p-10">
				<div>
					<p className="font-medium text-[11px] text-muted-foreground uppercase tracking-[0.14em]">
						Welcome
					</p>
					<h2 className="mt-2 font-semibold text-xl tracking-tight">How this desktop works</h2>
				</div>
				<ol className="flex flex-col">
					{HOW_IT_WORKS.map((item, index) => (
						<li
							key={item.title}
							className="flex gap-4 border-foreground/5 border-t py-3 first:border-t-0"
						>
							<span className="pt-0.5 font-mono text-muted-foreground text-xs tabular-nums">
								{String(index + 1).padStart(2, "0")}
							</span>
							<div>
								<p className="font-medium text-sm">{item.title}</p>
								<p className="text-muted-foreground text-sm leading-snug">{item.detail}</p>
							</div>
						</li>
					))}
				</ol>
			</aside>
		</div>
	);
}
