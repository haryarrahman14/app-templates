import { Button } from "@repo/ui/components/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRightIcon, BriefcaseBusinessIcon, FolderOpenIcon, MapPinIcon } from "lucide-react";
import { InitialsAvatar } from "@/components/kit/initials-avatar";
import { profileQuery } from "@/features/about/api/queries";
import { useWindows } from "@/lib/window-store";

export function AboutApp() {
	const { data: profile } = useSuspenseQuery(profileQuery);
	const { open } = useWindows();

	return (
		<div className="h-full overflow-y-auto">
			<div className="mx-auto flex max-w-2xl flex-col gap-9 px-6 py-8 md:px-10">
				<header className="flex flex-col items-center gap-3 text-center">
					<InitialsAvatar name={profile.name} size={88} />
					<div>
						<h1 className="font-semibold text-2xl tracking-tight">{profile.name}</h1>
						<p className="text-muted-foreground">
							{profile.role}
							<span className="mx-2 opacity-40">·</span>
							<MapPinIcon className="-mt-0.5 mr-1 inline size-3.5" />
							{profile.location}
						</p>
					</div>
					<div className="flex flex-wrap justify-center gap-2 pt-1">
						<Button
							variant="outline"
							size="sm"
							className="rounded-full"
							onClick={() => open("projects")}
						>
							<FolderOpenIcon />
							Projects
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="rounded-full"
							onClick={() => open("experience")}
						>
							<BriefcaseBusinessIcon />
							Experience
						</Button>
						{profile.links.map((link) => (
							<Button key={link.label} variant="ghost" size="sm" className="rounded-full" asChild>
								<a
									href={link.href}
									target={link.href.startsWith("http") ? "_blank" : undefined}
									rel="noreferrer"
								>
									{link.label}
									<ArrowUpRightIcon />
								</a>
							</Button>
						))}
					</div>
				</header>

				<section className="flex flex-col gap-3">
					{profile.summary.map((paragraph) => (
						<p
							key={paragraph.slice(0, 24)}
							className="text-[15px] text-foreground/85 leading-relaxed"
						>
							{paragraph}
						</p>
					))}
				</section>

				<section>
					<h2 className="mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-[0.12em]">
						Skills
					</h2>
					<div className="grid gap-3 sm:grid-cols-2">
						{profile.skills.map((group) => (
							<div key={group.group} className="rounded-xl bg-foreground/[0.035] p-4">
								<p className="mb-2 font-medium text-sm">{group.group}</p>
								<div className="flex flex-wrap gap-1.5">
									{group.items.map((item) => (
										<span
											key={item}
											className="rounded-full bg-background px-2.5 py-0.5 text-[13px] text-foreground/80 shadow-soft"
										>
											{item}
											{group.ongoing.includes(item) && (
												<span className="ml-1 text-muted-foreground text-xs">· in development</span>
											)}
										</span>
									))}
								</div>
							</div>
						))}
					</div>
				</section>

				<section>
					<h2 className="mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-[0.12em]">
						{profile.timelineTitle}
					</h2>
					<ol className="relative ml-2 border-l border-foreground/10">
						{profile.timeline.map((item) => (
							<li key={item.year + item.title} className="relative pb-5 pl-6 last:pb-0">
								<span className="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-tint ring-4 ring-background" />
								<p className="font-mono text-muted-foreground text-xs">{item.year}</p>
								<p className="font-medium">{item.title}</p>
								<p className="text-muted-foreground text-sm">{item.detail}</p>
							</li>
						))}
					</ol>
				</section>
			</div>
		</div>
	);
}
