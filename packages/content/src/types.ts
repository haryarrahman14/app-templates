/** Year-month string, e.g. "2024-08". A bare year ("2018") is allowed for coarse dates. */
export type YearMonth = string;

export type Link = { label: string; href: string };

/** A quantified, CV-backed outcome. Never invent these. */
export type Metric = { value: string; label: string };

export type Role = {
	title: string;
	start: YearMonth;
	/** null = present */
	end: YearMonth | null;
	employmentType?: string;
};

/**
 * One real screenshot under apps/web/public/proof (also <name>-800.webp, and <name>-400.webp for a phone
 * shot). Web shots are 16:10; phone shots 9:16, or the whole phone screen (1170 × 2544).
 */
export type Shot = {
	src: string;
	width: number;
	height: number;
	alt: string;
	caption: string;
	kind: "web" | "phone";
};

/**
 * One row of a body of work: plain words, or words with what they need. `art` is the row's illustration
 * (a key of the case art, apps/web/src/art/cases); "ongoing" = not released, always labelled on the site.
 */
export type Bullet = string | { text: string; art?: string; status?: "ongoing" };

export type ExperienceSection = {
	title: string;
	subtitle?: string;
	/** The whole section is "ongoing": built or in progress, not released, always labelled on the site. */
	status?: "ongoing";
	gallery?: Shot[];
	bullets: Bullet[];
	/** Figures of this body of work alone: they show only with it, never as the company's. */
	metrics?: Metric[];
	tech?: string[];
	outcome?: string;
};

export type ClientProject = {
	name: string;
	country?: string;
	period: string;
	summary: string;
	tech: string[];
	links?: Link[];
};

export type Experience = {
	slug: string;
	company: string;
	companyUrl?: string;
	kind: "employment" | "freelance";
	employmentType: string;
	location?: string;
	workMode?: "Remote" | "Hybrid" | "On-site";
	start: YearMonth;
	end: YearMonth | null;
	/** Newest first. More than one entry = progression inside the company. */
	roles: Role[];
	/** One factual sentence for cards and meta descriptions. */
	summary: string;
	/** The home page's one line for this company, at most 14 words. */
	statement: string;
	/** The company's main gallery, on the home page and the case page. A section's own gallery shows only there. */
	gallery?: Shot[];
	metrics: Metric[];
	sections: ExperienceSection[];
	tech: string[];
	clientProjects?: ClientProject[];
	featured: boolean;
};

export type Project = {
	slug: string;
	name: string;
	tagline: string;
	kind: "Thesis" | "Side project" | "Hackathon" | "Open source" | "Community";
	period: string;
	status: "Live" | "In development" | "Completed";
	summary: string;
	bullets: string[];
	metrics: Metric[];
	tech: string[];
	links: Link[];
	gallery?: Shot[];
	featured: boolean;
};

export type Education = {
	slug: string;
	school: string;
	degree: string;
	start: YearMonth;
	end: YearMonth;
	expected?: boolean;
	gpa?: string;
	notes: string[];
};

/** A song of his playlist: an official upload, played in YouTube's embedded player. */
export type Track = {
	/** The song's own name, which the lyrics are looked up by. */
	title: string;
	artist: string;
	/** Which recording, when it is not the studio one: a live take. */
	version?: string;
	/** The YouTube video. */
	videoId: string;
	/** Whose upload it is: a channel's handle, or the id of a label's "Topic" channel, which has none. */
	channel: string;
	/** The video's own length: the list shows it, and lyrics are timed only to a recording this long. */
	seconds: number;
};

/** One body of work on the CV: its title and note (a company with one body has neither), bullets, the Tech line. */
export type CvGroup = { title?: string; note?: string; bullets: string[]; tech: string[] };

export type CvExperience = {
	/** Instead of the company's name; the heading then says the role too, so there is no role line. */
	heading?: string;
	/** Left of the dates, in the CV's words: "Remote · Australia". */
	place?: string;
	groups: CvGroup[];
};

export type CvProject = { heading: string; label: string; bullets: string[]; tech: string[] };

/** The CV's words, keyed by the slug of the record they belong to. */
export type Cv = {
	summary: string;
	experience: Record<string, CvExperience>;
	projects: Record<string, CvProject>;
	education: Record<string, string[]>;
};

export type Post = {
	slug: string;
	title: string;
	excerpt: string;
	/** ISO date, e.g. "2026-10-20" */
	publishedAt: string;
	tags: string[];
	/** Markdown (GFM) */
	body: string;
	/** true = placeholder used to preview the reading layout; real posts arrive with the blog CMS. */
	sample: boolean;
};

/** A blog post's words as one version: what is live, or the draft that waits to replace it (CP2). */
export type PostDoc = {
	title: string;
	/** Markdown (GFM). An image is ![alt](/media/blog/<post id>/<name>.webp), served by the site's Worker from R2. */
	body: string;
	excerpt: string;
	tags: string[];
	/** The address, /blog/<slug>: it follows the title until the first publish, then it is locked. */
	slug: string;
};

/** A post as the admin reads it (/api/admin/posts). */
export type AdminPost = {
	id: string;
	/** What is live: null before the first publish and after Back to draft. */
	published: PostDoc | null;
	/** What waits to replace it: null when nothing does. */
	draft: PostDoc | null;
	/** ISO date-time of the first publish: the post's Date. */
	publishedAt: string | null;
	updatedAt: string;
};

/** A published post as the site's build reads it (GET /api/posts), newest first. */
export type PublicPost = PostDoc & {
	publishedAt: string;
	/** The thumbnail on /blog: an https picture, 16:9. Only a post kept as a file has one so far. */
	cover?: string;
	/** The picture a shared link shows: /og/<slug>.png in apps/web/public, 1200 × 630, a PNG under 200 KB. */
	share?: string;
	/** The short film of the post, over its words: /video/<slug>.mp4 in apps/web/public, 16:9; `cover` is its poster. */
	video?: string;
	/** The language it is written in; none reads as English. */
	lang?: PostLang;
	/** The slug of the post this one translates: it is left out of the lists, and reached by the switch on a post. */
	translationOf?: string;
	/** Every language of this post, its own first language first: the build fills it in when there are two. */
	versions?: { lang: PostLang; slug: string }[];
};
export type PostLang = "en" | "id";

/** What a Publish found: `blocks` stop it, `notes` are only said. */
export type PublishCheck = { blocks: string[]; notes: string[] };

export type SocialLink = Link & { kind: "github" | "linkedin" | "email"; handle: string };

export type Profile = {
	name: string;
	initials: string;
	headline: string;
	role: string;
	/** Whether and how he is open to work, said where a reader decides: hero, CV, portfolio PDF. */
	availability: string;
	/** The hero's rotating titles, current first; each one is a title the CV or the work record uses. */
	titles: string[];
	location: string;
	/** This portfolio, on the CV's contact line. */
	site: string;
	/** ISO 3166, for search engines. */
	countryCode: string;
	timezone: string;
	email: string;
	/** Two short paragraphs, straight from the CV summary. */
	summary: [string, string];
	/** The first screen's words: the summary shorter, AI included, plus the full name. */
	intro: { hi: string; lines: [string, string]; more: string };
	industries: string[];
	careerStart: YearMonth;
	links: SocialLink[];
	cv: {
		href: string;
		fileName: string;
		sizeLabel: string;
		pages: number;
		updatedAt: string;
	};
	/** null until a real photo is uploaded; render the initials monogram instead. */
	avatarUrl: string | null;
};

export type SkillGroup = {
	name: string;
	items: string[];
	/** Each item → the slug of the experience or project its chip links to. */
	where: Record<string, string>;
	/** Items used only in work not released yet: always labelled on the site. */
	ongoing: string[];
};

export type StoryScene =
	| "first-commit"
	| "learning-to-ship"
	| "first-clients"
	| "full-stack"
	| "making-it-fast"
	| "remote-australia"
	| "in-parallel"
	| "today";

export type StoryChapter = {
	slug: StoryScene;
	/** Big label on the story rail, e.g. "2021" or "Now". */
	year: string;
	period: string;
	title: string;
	/** First person, factual — every claim must trace back to the CV, LinkedIn or GitHub. */
	body: string;
	/** Receipts: slugs of the experiences/projects this chapter is based on. */
	refs: { experiences?: string[]; projects?: string[] };
};

export type Story = { title: string; chapters: StoryChapter[] };
