/**
 * Deterministic sample data. Every name, company and email here is invented.
 * Delete this folder once the queryFns in features/<f>/api call a real backend.
 */
import type { Activity } from "@/features/activities/schemas/activity";
import {
	COMPANY_SIZES,
	type Company,
	type CompanyStatus,
	INDUSTRIES,
} from "@/features/companies/schemas/company";
import { DEAL_STAGES, type Deal } from "@/features/deals/schemas/deal";
import type { Meeting } from "@/features/home/schemas/meeting";
import type { Note } from "@/features/notes/schemas/note";
import type { Person, PersonStage } from "@/features/people/schemas/person";
import type { Task } from "@/features/tasks/schemas/task";
import type {
	Favourite,
	Member,
	Notification,
	RecordList,
} from "@/features/workspace/schemas/workspace";
import { createRandom, dayOffset, todayAt } from "./random";

const rand = createRandom(20261119);

export const ME_ID = "m1";

const MEMBERS: Member[] = [
	["Robin Ashgrove", "owner", "Head of Sales"],
	["Priya Vantrell", "admin", "Account Executive"],
	["Theo Marchbank", "member", "Account Executive"],
	["Lena Okonkwo-Hale", "member", "Customer Success"],
	["Jonah Pellegrew", "member", "Sales Development"],
	["Mira Castellane", "guest", "Advisor"],
].map(([name, role, title], index) => ({
	id: `m${index + 1}`,
	name: name as string,
	email: `${(name as string).split(" ")[0]?.toLowerCase()}@fernhill.example.com`,
	role: role as Member["role"],
	status: index === 5 ? "invited" : "active",
	title: title as string,
	joinedAt: dayOffset(-400 + index * 40),
}));

const OWNER_IDS = ["m1", "m2", "m3", "m4", "m5"];

const NAME_A = [
	"Bright",
	"Quill",
	"Marrow",
	"Lumen",
	"Copper",
	"Tidal",
	"Hollow",
	"Juniper",
	"Saffron",
	"Ember",
	"Fable",
	"Granite",
	"Halcyon",
	"Indigo",
	"Kestrel",
	"Larch",
	"Moss",
	"Nimbus",
	"Orchard",
	"Pebble",
	"Quarry",
	"Rook",
	"Sable",
	"Thistle",
	"Umber",
	"Vellum",
	"Willow",
	"Yarrow",
	"Zephyr",
	"Alder",
	"Bramble",
	"Cinder",
	"Drift",
	"Fern",
	"Gale",
	"Heron",
];
const NAME_B = [
	"loom Labs",
	"feather Co",
	"bend Freight",
	"stack Health",
	"field Goods",
	"works Finance",
	"gate Robotics",
	"lane Learning",
	"wick Hotels",
	"ridge Systems",
	"line Studio",
	"post Supply",
];
const CITIES: [string, string][] = [
	["Lisbon", "Portugal"],
	["Rotterdam", "Netherlands"],
	["Austin", "United States"],
	["Melbourne", "Australia"],
	["Toronto", "Canada"],
	["Osaka", "Japan"],
	["Leeds", "United Kingdom"],
	["Bandung", "Indonesia"],
	["Valencia", "Spain"],
	["Cape Town", "South Africa"],
];
const BLURBS = [
	"Builds tools that keep warehouse teams in sync.",
	"Runs a network of neighbourhood clinics.",
	"Sells hand-finished homeware online and in two shops.",
	"Helps small lenders approve loans in a day.",
	"Makes modular furniture for offices.",
	"Teaches design to adults in evening cohorts.",
	"Operates boutique hotels in old town centres.",
	"Moves refrigerated freight across the region.",
];

export const COMPANIES: Company[] = NAME_A.map((first, index) => {
	const suffix = NAME_B[index % NAME_B.length] as string;
	const name = `${first}${suffix}`;
	const [city, country] = rand.pick(CITIES);
	const status: CompanyStatus =
		index % 7 === 0
			? "churned"
			: index % 3 === 0
				? "customer"
				: index % 2 === 0
					? "prospect"
					: "lead";
	const slug = `${first}${suffix.split(" ")[0]}`.toLowerCase();
	const created = -rand.int(2, 420);
	return {
		id: `c${index + 1}`,
		name,
		domain: `${slug}.example.com`,
		industry: INDUSTRIES[index % INDUSTRIES.length] as Company["industry"],
		size: rand.pick(COMPANY_SIZES),
		status,
		city,
		country,
		ownerId: OWNER_IDS[index % OWNER_IDS.length] as string,
		arr: status === "customer" ? rand.int(8, 240) * 1000 : 0,
		description: rand.pick(BLURBS),
		createdAt: dayOffset(created, 10),
		lastContactedAt: rand.chance(0.8) ? dayOffset(-rand.int(0, Math.min(60, -created)), 14) : null,
	};
});

const FIRST = [
	"Ada",
	"Milo",
	"Noor",
	"Felix",
	"Ines",
	"Oskar",
	"Wren",
	"Tomas",
	"Hana",
	"Rafael",
	"Elsie",
	"Kofi",
	"Sanne",
	"Bruno",
	"Leila",
	"Arlo",
	"Yuki",
	"Dario",
	"Maeve",
	"Idris",
];
const LAST = [
	"Fenwick",
	"Quarrington",
	"Almeida",
	"Thornbury",
	"Vasquel",
	"Lindqvarn",
	"Ashby-Roe",
	"Kettleworth",
	"Moreland",
	"Pemberly",
	"Sato-Briggs",
	"Okafor-Lane",
];
const TITLES = [
	"Head of Operations",
	"Founder",
	"VP Sales",
	"Procurement Lead",
	"CTO",
	"Office Manager",
	"Finance Director",
	"Product Manager",
	"Chief of Staff",
	"Marketing Lead",
];
const STAGES: PersonStage[] = ["new", "engaged", "champion", "inactive"];

export const PEOPLE: Person[] = Array.from({ length: 60 }, (_, index) => {
	const firstName = FIRST[index % FIRST.length] as string;
	const lastName = LAST[(index * 7) % LAST.length] as string;
	const company = COMPANIES[index % COMPANIES.length] as Company;
	const created = -rand.int(1, 380);
	return {
		id: `p${index + 1}`,
		firstName,
		lastName,
		email: `${`${firstName}.${lastName}`.toLowerCase().replace(/[^a-z.]/g, "")}@example.com`,
		phone: `+1 555 01${String(10 + index).padStart(2, "0")}`,
		title: rand.pick(TITLES),
		companyId: index % 13 === 12 ? null : company.id,
		ownerId: company.ownerId,
		stage: STAGES[(index * 3) % STAGES.length] as PersonStage,
		city: company.city,
		createdAt: dayOffset(created, 11),
		lastContactedAt: rand.chance(0.75) ? dayOffset(-rand.int(0, Math.min(45, -created)), 15) : null,
	};
});

const DEAL_KINDS = [
	"Annual plan",
	"Pilot",
	"Expansion",
	"Renewal",
	"Onboarding package",
	"Team seats",
];

export const DEALS: Deal[] = Array.from({ length: 30 }, (_, index) => {
	const company = COMPANIES[(index * 5) % COMPANIES.length] as Company;
	const contact = PEOPLE.find((person) => person.companyId === company.id) ?? null;
	const stage = DEAL_STAGES[index % DEAL_STAGES.length] as Deal["stage"];
	const closed = stage === "won" || stage === "lost";
	return {
		id: `d${index + 1}`,
		name: `${company.name.split(" ")[0]} · ${DEAL_KINDS[index % DEAL_KINDS.length]}`,
		companyId: company.id,
		contactId: contact?.id ?? null,
		ownerId: company.ownerId,
		stage,
		value: rand.int(4, 120) * 500,
		closeDate: closed ? dayOffset(-rand.int(3, 330)) : dayOffset(rand.int(4, 90)),
		createdAt: dayOffset(-rand.int(20, 360)),
		rank: index,
	};
});

const TASK_TITLES = [
	"Send the revised proposal",
	"Book a demo with the ops team",
	"Follow up on pricing questions",
	"Share onboarding checklist",
	"Confirm contract start date",
	"Prepare quarterly review deck",
	"Introduce to customer success",
	"Check in after the pilot",
	"Update billing contact",
	"Draft case study outline",
];

export const TASKS: Task[] = Array.from({ length: 36 }, (_, index) => {
	const company = COMPANIES[(index * 3) % COMPANIES.length] as Company;
	const dueIn = (index % 9) - 3;
	return {
		id: `t${index + 1}`,
		title: TASK_TITLES[index % TASK_TITLES.length] as string,
		dueDate: index % 8 === 7 ? null : dayOffset(dueIn),
		done: index % 5 === 4,
		assigneeId: index % 3 === 0 ? ME_ID : (OWNER_IDS[index % OWNER_IDS.length] as string),
		priority: index % 6 === 0 ? "high" : index % 4 === 0 ? "low" : "normal",
		record:
			index % 4 === 3
				? { type: "person", id: (PEOPLE[index] as Person).id }
				: index % 5 === 2
					? { type: "deal", id: (DEALS[index % DEALS.length] as Deal).id }
					: { type: "company", id: company.id },
		createdAt: dayOffset(-index - 2),
	};
});

const NOTE_SEEDS: [string, string][] = [
	[
		"Kick-off call",
		"Goals for the first 90 days:\n- Move the team off spreadsheets\n- Weekly pipeline review on Mondays\n- One owner per account\n\nNext step: share the import template.",
	],
	[
		"Pricing objections",
		"They compared us with an in-house tool. Main worry is seat cost for part-time staff.\n\nIdea: offer viewer seats at no charge.",
	],
	[
		"Quarterly review",
		"Usage is up 40% since spring. Two new teams asked for access.\n\nAsk about expansion in the next call.",
	],
	[
		"Security questionnaire",
		"Received the questionnaire. Most answers are in our trust page. Need input from engineering on data retention.",
	],
	[
		"Champion map",
		"Main champion: ops lead. Economic buyer: finance director. Blocker: none so far.",
	],
	[
		"Lunch notes",
		"Relaxed chat, no pitch. They are opening a second office in spring and will need more seats then.",
	],
];

export const NOTES: Note[] = Array.from({ length: 18 }, (_, index) => {
	const [title, body] = NOTE_SEEDS[index % NOTE_SEEDS.length] as [string, string];
	const company = COMPANIES[(index * 2) % COMPANIES.length] as Company;
	return {
		id: `n${index + 1}`,
		title,
		body,
		record:
			index % 3 === 2
				? { type: "person", id: (PEOPLE[index * 2] as Person).id }
				: { type: "company", id: company.id },
		authorId: OWNER_IDS[index % OWNER_IDS.length] as string,
		createdAt: dayOffset(-index * 3 - 1, 10),
		updatedAt: dayOffset(-index * 2, 16),
	};
});

const ACTIVITY_SEEDS: [Activity["type"], string][] = [
	["email", "Sent a follow-up email"],
	["call", "Had a 20 minute discovery call"],
	["meeting", "Met for a product walkthrough"],
	["note", "Added a note"],
	["task", "Completed a task"],
	["deal", "Moved a deal to Proposal"],
	["email", "Replied about pricing"],
	["call", "Left a voicemail"],
];

export const ACTIVITIES: Activity[] = Array.from({ length: 140 }, (_, index) => {
	const [type, summary] = ACTIVITY_SEEDS[index % ACTIVITY_SEEDS.length] as [
		Activity["type"],
		string,
	];
	const onPerson = index % 3 === 1;
	const record = onPerson
		? { type: "person" as const, id: (PEOPLE[(index * 7) % PEOPLE.length] as Person).id }
		: { type: "company" as const, id: (COMPANIES[(index * 5) % COMPANIES.length] as Company).id };
	const daysAgo = Math.floor(index / 2.2);
	return {
		id: `a${index + 1}`,
		type,
		summary,
		detail: "",
		record,
		actorId: OWNER_IDS[index % OWNER_IDS.length] as string,
		at: dayOffset(-daysAgo, 16 - (index % 8), (index * 13) % 60),
	};
});

export const MEETINGS: Meeting[] = [
	{
		id: "mt1",
		title: "Pipeline review",
		start: todayAt(9, 30),
		end: todayAt(10),
		location: "Video call",
		record: null,
		attendeeIds: [],
	},
	{
		id: "mt2",
		title: "Demo for the ops team",
		start: todayAt(11),
		end: todayAt(11, 45),
		location: "Video call",
		record: { type: "company", id: "c2" },
		attendeeIds: ["p2", "p38"],
	},
	{
		id: "mt3",
		title: "Contract walkthrough",
		start: todayAt(14),
		end: todayAt(14, 30),
		location: "Room 2",
		record: { type: "deal", id: "d4" },
		attendeeIds: ["p4"],
	},
	{
		id: "mt4",
		title: "Quarterly check-in",
		start: todayAt(16),
		end: todayAt(16, 45),
		location: "Video call",
		record: { type: "company", id: "c4" },
		attendeeIds: ["p4", "p40"],
	},
];

export const LISTS: RecordList[] = [
	{
		id: "l1",
		name: "Hot accounts",
		color: "red",
		recordType: "company",
		recordIds: ["c2", "c3", "c5", "c9", "c11", "c16"],
	},
	{
		id: "l2",
		name: "Renewals this quarter",
		color: "orange",
		recordType: "company",
		recordIds: ["c4", "c7", "c10", "c13"],
	},
	{
		id: "l3",
		name: "Event follow-ups",
		color: "teal",
		recordType: "person",
		recordIds: ["p1", "p5", "p9", "p12", "p20", "p33"],
	},
];

export const FAVOURITES: Favourite[] = [
	{ type: "company", id: "c2", label: (COMPANIES[1] as Company).name },
	{ type: "person", id: "p1", label: "Ada Fenwick" },
	{ type: "company", id: "c4", label: (COMPANIES[3] as Company).name },
];

export const NOTIFICATIONS: Notification[] = [
	{
		id: "nt1",
		title: "Priya assigned you a task",
		body: "Send the revised proposal",
		at: dayOffset(0, 8, 12),
		read: false,
		href: "/tasks",
	},
	{
		id: "nt2",
		title: "Deal moved to Negotiation",
		body: `${(DEALS[3] as Deal).name} by Theo`,
		at: dayOffset(-1, 15, 40),
		read: false,
		href: `/deals?deal=${(DEALS[3] as Deal).id}`,
	},
	{
		id: "nt3",
		title: "New comment on a note",
		body: "Lena replied on Kick-off call",
		at: dayOffset(-2, 11, 5),
		read: true,
		href: "/notes",
	},
];

export { MEMBERS };
