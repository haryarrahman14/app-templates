import { Button } from "@repo/ui/components/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
	ArrowUpRight,
	Download,
	Flag,
	GraduationCap,
	Mail,
	Sparkles,
	UserRound,
} from "lucide-react";
import { AppIcon } from "@/components/kit/app-icon";
import { Avatar } from "@/components/kit/avatar";
import { MasterDetail, SidebarLabel, SidebarRow } from "@/components/kit/master-detail";
import { Chip, Group, GroupRow, PageBody, PageHeader } from "@/components/kit/page";
import { aboutQuery } from "@/features/about/api/queries";
import type { About } from "@/features/about/schemas/about";
import type { AppViewProps } from "@/lib/apps";

const SECTIONS = [
	{ id: "profile", title: "Profile", icon: UserRound, swatch: "blue" },
	{ id: "skills", title: "Skills & tools", icon: Sparkles, swatch: "green" },
	{ id: "timeline", title: "Story", icon: Flag, swatch: "orange" },
	{ id: "education", title: "Education", icon: GraduationCap, swatch: "red" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

export function AboutPage({ itemId, onItemChange, openApp }: AppViewProps) {
	const { data } = useSuspenseQuery(aboutQuery);
	const active: SectionId = SECTIONS.find((s) => s.id === itemId)?.id ?? "profile";

	return (
		<MasterDetail
			backLabel="About"
			hasSelection={itemId !== undefined}
			onBack={() => onItemChange(undefined)}
			sidebar={
				<>
					<button
						type="button"
						onClick={() => onItemChange("profile")}
						className="mb-3 flex w-full items-center gap-3 rounded-2xl bg-card/80 p-3 text-left shadow-soft outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						<Avatar initials={data.profile.initials} className="size-12 text-[17px]" />
						<span className="min-w-0">
							<span className="block truncate font-semibold text-[15px]">{data.profile.name}</span>
							<span className="block truncate text-[12.5px] text-muted-foreground">
								{data.profile.location}
							</span>
						</span>
					</button>
					<SidebarLabel>About</SidebarLabel>
					<div className="space-y-0.5">
						{SECTIONS.map((section) => (
							<SidebarRow
								key={section.id}
								active={active === section.id}
								onClick={() => onItemChange(section.id)}
								icon={<AppIcon icon={section.icon} swatch={section.swatch} size="xs" />}
								title={section.title}
							/>
						))}
					</div>
				</>
			}
			detail={
				<PageBody>
					{active === "profile" && (
						<ProfileSection data={data} openContact={() => openApp("contact")} />
					)}
					{active === "skills" && <SkillsSection data={data} />}
					{active === "timeline" && <TimelineSection data={data} />}
					{active === "education" && <EducationSection data={data} />}
				</PageBody>
			}
		/>
	);
}

function ProfileSection({ data, openContact }: { data: About; openContact: () => void }) {
	const { profile } = data;
	return (
		<>
			<div className="mb-8 flex flex-col items-center text-center">
				<Avatar initials={profile.initials} className="mb-4 size-24 text-[32px]" />
				<h2 className="font-semibold text-[26px] tracking-tight">{profile.name}</h2>
				<p className="text-muted-foreground">{profile.role}</p>
				<div className="mt-4 flex gap-2">
					<Button onClick={openContact}>
						<Mail />
						Get in touch
					</Button>
					<Button variant="outline" asChild>
						<a href={profile.cv.href} download={profile.cv.fileName}>
							<Download />
							CV
						</a>
					</Button>
				</div>
			</div>
			<Group title="Summary">
				<div className="space-y-3 px-4 py-4 text-[15px] text-foreground/85 leading-relaxed">
					{data.bio.map((paragraph) => (
						<p key={paragraph.slice(0, 24)}>{paragraph}</p>
					))}
				</div>
			</Group>
			<Group title="Details">
				<GroupRow label="Based in">
					<span className="text-muted-foreground">{profile.location}</span>
				</GroupRow>
				<GroupRow label="Availability">
					<span className="text-right text-muted-foreground">{profile.availability}</span>
				</GroupRow>
				<GroupRow label="Email">
					<a className="truncate text-tint-text" href={`mailto:${profile.email}`}>
						{profile.email}
					</a>
				</GroupRow>
			</Group>
			<Group title="Elsewhere">
				{profile.links.map((link) => (
					<a
						key={link.url}
						href={link.url}
						target="_blank"
						rel="noreferrer"
						className="flex min-h-12 items-center justify-between px-4 py-3 text-[14.5px] hover:bg-shade/3"
					>
						<span>
							{link.label}
							<span className="ml-2 text-muted-foreground">{link.handle}</span>
						</span>
						<ArrowUpRight className="size-4 text-muted-foreground" />
					</a>
				))}
			</Group>
		</>
	);
}

function SkillsSection({ data }: { data: About }) {
	return (
		<>
			<PageHeader title="Skills & tools" />
			{data.skills.map((group) => (
				<Group
					key={group.title}
					title={group.title}
					footer={
						group.ongoing.length > 0
							? `Ongoing: ${group.ongoing.join(", ")}, used only in work not released yet.`
							: undefined
					}
				>
					<div className="flex flex-wrap gap-2 p-4">
						{group.items.map((item) => (
							<Chip key={item}>{item}</Chip>
						))}
					</div>
				</Group>
			))}
		</>
	);
}

function TimelineSection({ data }: { data: About }) {
	return (
		<>
			<PageHeader
				title={data.timeline.title}
				description="The short version. Experience has the long one."
			/>
			<ol className="relative ml-2 border-border border-l">
				{data.timeline.items.map((item) => (
					<li key={item.year + item.title} className="relative pb-7 pl-6 last:pb-0">
						<span className="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-tint ring-4 ring-background" />
						<p className="font-mono text-[12.5px] text-muted-foreground">{item.period}</p>
						<h3 className="font-semibold text-[15.5px]">{item.title}</h3>
						<p className="text-[14.5px] text-muted-foreground">{item.body}</p>
					</li>
				))}
			</ol>
		</>
	);
}

function EducationSection({ data }: { data: About }) {
	return (
		<>
			<PageHeader title="Education" />
			{data.education.map((e) => (
				<Group key={e.school} title={e.years}>
					<GroupRow
						label={
							<span>
								<span className="block font-medium">{e.degree}</span>
								<span className="block text-[13px] text-muted-foreground">{e.school}</span>
							</span>
						}
					>
						{e.gpa ? <span className="text-[13px] text-muted-foreground">GPA {e.gpa}</span> : null}
					</GroupRow>
					{e.notes.map((note) => (
						<GroupRow key={note} label={<span className="text-foreground/80">{note}</span>} />
					))}
				</Group>
			))}
		</>
	);
}
