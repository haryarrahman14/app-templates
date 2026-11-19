import { toast } from "@repo/ui/components/sonner";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Download, GraduationCap } from "lucide-react";
import { AppScreen } from "@/components/kit/app-screen";
import { InsetRow, InsetSection } from "@/components/kit/inset-list";
import { cvQuery } from "@/features/experience/api/queries";
import { usePhoneNav } from "@/lib/phone-nav";

export function ExperienceApp() {
	const { data: cv } = useSuspenseQuery(cvQuery);
	const nav = usePhoneNav();

	const download = () => {
		if (cv.cvUrl) {
			window.open(cv.cvUrl, "_blank", "noopener");
			return;
		}
		toast("CV download is a stub", {
			description: "Add the PDF to public/ and set profile.cv.href in packages/content.",
		});
	};

	return (
		<AppScreen
			title="Experience"
			subtitle={`${cv.roles.length} positions · since ${cv.since}`}
			back={{ label: "Home", onClick: nav.back }}
			trailing={
				<button
					type="button"
					onClick={download}
					aria-label="Download CV"
					className="grid size-9 place-items-center rounded-lg text-tint-text outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
				>
					<Download className="size-[19px]" />
				</button>
			}
		>
			<div className="flex flex-col gap-7">
				<ol className="mx-4 rounded-[20px] bg-(--grouped-card) px-4 py-2 shadow-[0_0_0_0.5px_var(--grouped-line)]">
					{cv.roles.map((role, index) => (
						<li key={role.id} className="relative flex gap-4 py-4">
							<div className="relative flex w-3 shrink-0 justify-center">
								<span
									className={
										role.current
											? "relative z-10 mt-1.5 size-3 rounded-full bg-tint ring-4 ring-tint/20"
											: "relative z-10 mt-1.5 size-3 rounded-full border-2 border-muted-foreground/40 bg-(--grouped-card)"
									}
								/>
								{index < cv.roles.length - 1 ? (
									<span className="-bottom-6 absolute top-5 w-px bg-(--grouped-line)" />
								) : null}
							</div>
							<div className="min-w-0 flex-1">
								<p className="text-[12.5px] text-muted-foreground tabular-nums">
									{role.period}
									{role.meta ? ` · ${role.meta}` : ""}
								</p>
								<h2 className="font-semibold text-[16px] leading-snug tracking-tight">
									{role.title}
								</h2>
								<p className="text-[14px] text-tint-text">{role.company}</p>
								{role.earlier.map((item) => (
									<p key={item.title} className="text-[12.5px] text-muted-foreground">
										Before: {item.title}, {item.period}
									</p>
								))}
								<p className="mt-1.5 text-[14px] text-foreground/80 leading-relaxed">
									{role.summary}
								</p>
								{role.sections.map((section) => (
									<div key={section.title} className="mt-2.5">
										<p className="font-medium text-[12.5px] text-foreground/70">
											{section.title}
											{section.ongoing ? (
												<span className="ml-1.5 rounded-full bg-foreground/[0.06] px-1.5 py-px font-semibold text-[10.5px] text-muted-foreground uppercase">
													Ongoing
												</span>
											) : null}
										</p>
										<ul className="mt-1 flex list-disc flex-col gap-1 pl-4 text-[13.5px] text-muted-foreground leading-snug marker:text-muted-foreground/50">
											{section.highlights.map((line) => (
												<li key={line}>{line}</li>
											))}
										</ul>
									</div>
								))}
							</div>
						</li>
					))}
				</ol>

				<InsetSection header="Education">
					{cv.education.map((item) => (
						<InsetRow
							key={item.title}
							icon={GraduationCap}
							iconBackground="#007AFF"
							label={item.title}
							detail={item.school}
							value={item.year}
						/>
					))}
				</InsetSection>

				<InsetSection footer={cv.cvLabel}>
					<InsetRow icon={Download} label="Download CV" onClick={download} />
				</InsetSection>
			</div>
		</AppScreen>
	);
}
