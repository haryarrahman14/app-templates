import { Button } from "@repo/ui/components/button";
import { toast } from "@repo/ui/components/sonner";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DownloadIcon, GraduationCapIcon } from "lucide-react";
import { experienceQuery } from "@/features/experience/api/queries";
import { cvText, downloadText } from "@/features/experience/utils/cv-text";

/** CV as a timeline. `owner` comes from the profile so the CV header stays in one place. */
export function ExperienceApp({ owner }: { owner: { name: string; role: string; email: string } }) {
	const { data } = useSuspenseQuery(experienceQuery);

	const download = () => {
		downloadText(`${owner.name.toLowerCase().replace(/\s+/g, "-")}-cv.txt`, cvText(owner, data));
		toast.success("CV downloaded", { description: "A plain-text copy generated from this page." });
	};

	return (
		<div className="h-full overflow-y-auto">
			<div className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-8 md:px-10">
				<header className="flex flex-wrap items-end justify-between gap-4">
					<div>
						<p className="text-muted-foreground text-xs uppercase tracking-[0.12em]">
							Curriculum vitae
						</p>
						<h1 className="mt-1 font-semibold text-2xl tracking-tight">Experience</h1>
						<p className="mt-1 max-w-md text-muted-foreground">{data.headline}</p>
					</div>
					{data.cvUrl ? (
						<Button className="rounded-full" asChild>
							<a href={data.cvUrl} download={data.cvFileName}>
								<DownloadIcon />
								Download CV
							</a>
						</Button>
					) : (
						<Button className="rounded-full" onClick={download}>
							<DownloadIcon />
							Download CV
						</Button>
					)}
				</header>

				<ol className="flex flex-col">
					{data.roles.map((role, index) => (
						<li
							key={role.company + role.period}
							className="grid gap-1 md:grid-cols-[120px_1fr] md:gap-5"
						>
							<p className="pt-0.5 text-muted-foreground text-sm tabular-nums">{role.period}</p>
							<div className="relative pb-8 pl-8">
								{index < data.roles.length - 1 && (
									<span className="absolute top-5 bottom-0 left-[5.5px] w-px bg-foreground/10" />
								)}
								<span
									className={
										index === 0
											? "absolute top-1.5 left-0 size-3 rounded-full bg-tint ring-4 ring-tint/20"
											: "absolute top-1.5 left-0 size-3 rounded-full bg-foreground/20"
									}
								/>
								<h2 className="font-semibold">{role.title}</h2>
								<p className="text-muted-foreground text-sm">
									{[role.company, role.location].filter(Boolean).join(" · ")}
								</p>
								{role.earlier.length > 0 && (
									<p className="mt-0.5 text-muted-foreground text-xs">
										Earlier:{" "}
										{role.earlier.map((item) => `${item.title} (${item.period})`).join(", ")}
									</p>
								)}
								{role.groups.map((group) => (
									<div key={group.title ?? group.highlights[0]} className="mt-3">
										{group.title && (
											<h3 className="font-medium text-sm">
												{group.title}
												{group.ongoing && (
													<span className="ml-2 rounded-full bg-foreground/[0.06] px-2 py-0.5 font-normal text-muted-foreground text-xs">
														In development
													</span>
												)}
											</h3>
										)}
										<ul className="mt-1.5 flex list-disc flex-col gap-1 pl-4 text-[15px] text-foreground/80 marker:text-foreground/30">
											{group.highlights.map((item) => (
												<li key={item}>{item}</li>
											))}
										</ul>
									</div>
								))}
							</div>
						</li>
					))}
				</ol>

				<section className="rounded-2xl bg-foreground/[0.035] p-5">
					<h2 className="mb-3 flex items-center gap-2 font-semibold text-sm">
						<GraduationCapIcon className="size-4 text-tint" />
						Education
					</h2>
					<div className="flex flex-col gap-3">
						{data.education.map((item) => (
							<div key={item.school} className="text-sm">
								<div className="flex flex-wrap justify-between gap-2">
									<span>
										<span className="font-medium">{item.degree}</span>
										<span className="text-muted-foreground"> · {item.school}</span>
									</span>
									<span className="text-muted-foreground tabular-nums">{item.period}</span>
								</div>
								{item.detail.map((line) => (
									<p key={line} className="text-muted-foreground">
										{line}
									</p>
								))}
							</div>
						))}
					</div>
				</section>
			</div>
		</div>
	);
}
