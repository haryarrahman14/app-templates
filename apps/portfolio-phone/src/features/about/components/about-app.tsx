import { useSuspenseQuery } from "@tanstack/react-query";
import {
	BriefcaseBusiness,
	GraduationCap,
	Layers,
	type LucideIcon,
	Mail,
	MessageCircle,
	SquareCode,
} from "lucide-react";
import { AppScreen } from "@/components/kit/app-screen";
import { InsetRow, InsetSection } from "@/components/kit/inset-list";
import { profileQuery } from "@/features/about/api/queries";
import type { Profile } from "@/features/about/schemas/profile";
import { usePhoneNav } from "@/lib/phone-nav";

const LINK_ICONS: Record<Profile["links"][number]["kind"], LucideIcon> = {
	github: SquareCode,
	linkedin: BriefcaseBusiness,
	email: Mail,
};

export function AboutApp() {
	const { data: profile } = useSuspenseQuery(profileQuery);
	const nav = usePhoneNav();

	return (
		<AppScreen title="About" back={{ label: "Home", onClick: nav.back }}>
			<div className="flex flex-col gap-7">
				<section className="mx-4 flex flex-col items-center rounded-[20px] bg-(--grouped-card) px-5 pt-7 pb-5 text-center shadow-[0_0_0_0.5px_var(--grouped-line)]">
					<span className="grid size-20 place-items-center rounded-full bg-[#EAEAEA] font-semibold text-[#121212] text-[28px] tracking-tight dark:bg-[#2A2A2A] dark:text-white">
						{profile.initials}
					</span>
					<h2 className="mt-3 font-semibold text-[22px] tracking-tight">{profile.name}</h2>
					<p className="text-[14px] text-muted-foreground">{profile.headline}</p>
					<p className="text-[13px] text-muted-foreground">{profile.location}</p>
					<div className="mt-5 grid w-full grid-cols-3 gap-2">
						{[
							{ label: "Ask me", icon: MessageCircle, onClick: () => nav.open("messages") },
							{ label: "Work", icon: Layers, onClick: () => nav.open("projects") },
							{
								label: "Email",
								icon: Mail,
								onClick: () => window.open(`mailto:${profile.email}`, "_self"),
							},
						].map(({ label, icon: Icon, onClick }) => (
							<button
								key={label}
								type="button"
								onClick={onClick}
								className="flex flex-col items-center gap-1 rounded-xl bg-tint/10 py-2.5 font-medium text-[12.5px] text-tint-text outline-none transition-colors hover:bg-tint/15 focus-visible:ring-2 focus-visible:ring-ring/50"
							>
								<Icon className="size-[18px]" />
								{label}
							</button>
						))}
					</div>
				</section>

				<InsetSection header="Hello">
					<div className="flex flex-col gap-3 px-4 py-3.5 text-[15px] leading-relaxed">
						{profile.bio.map((paragraph) => (
							<p key={paragraph.slice(0, 24)}>{paragraph}</p>
						))}
					</div>
				</InsetSection>

				{profile.facts.length ? (
					<div className="mx-4 grid grid-cols-2 gap-2">
						{profile.facts.map((fact) => (
							<div
								key={fact.label}
								className="rounded-[14px] bg-(--grouped-card) px-3 py-3 shadow-[0_0_0_0.5px_var(--grouped-line)]"
							>
								<p className="font-semibold text-[20px] tracking-tight">{fact.value}</p>
								<p className="text-[12px] text-muted-foreground leading-tight">{fact.label}</p>
							</div>
						))}
					</div>
				) : null}

				<InsetSection
					header="Skills"
					footer="Marked “ongoing”: used only in work not released yet."
				>
					{profile.skills.map((skill) => (
						<InsetRow
							key={skill.group}
							label={skill.group}
							detail={
								<span className="mt-1.5 flex flex-wrap gap-1.5">
									{skill.items.map((item) => (
										<span
											key={item}
											className="rounded-full bg-foreground/[0.06] px-2.5 py-0.5 text-[12.5px] text-foreground/80"
										>
											{item}
											{skill.ongoing.includes(item) ? (
												<span className="text-muted-foreground"> · ongoing</span>
											) : null}
										</span>
									))}
								</span>
							}
						/>
					))}
				</InsetSection>

				<InsetSection header="Education" footer="Roles and companies are in Experience.">
					{profile.education.map((item) => (
						<InsetRow
							key={item.school}
							icon={GraduationCap}
							iconBackground="#007AFF"
							label={<span className="whitespace-normal">{item.degree}</span>}
							detail={
								<span className="whitespace-normal">
									{item.school} · {item.period}
									{item.detail ? <span className="block">{item.detail}</span> : null}
								</span>
							}
						/>
					))}
					<InsetRow label="Open Experience" onClick={() => nav.open("experience")} />
				</InsetSection>

				<InsetSection header="Elsewhere">
					{profile.links.map((link) => (
						<InsetRow
							key={link.href}
							icon={LINK_ICONS[link.kind]}
							label={link.label}
							value={link.handle}
							href={link.href}
						/>
					))}
				</InsetSection>
			</div>
		</AppScreen>
	);
}
