import type { Shot } from "./types.ts";

/**
 * Every screenshot on the site, under apps/web/public/proof/<slug>/ (<name>.webp, <name>-800.webp and for
 * a phone shot <name>-400.webp, made once with Pillow, each checked by eye for names, emails, phone numbers
 * and real customers).
 * Web shots are 16:10; phone shots 9:16, or the whole phone screen for MapTrack's phone app.
 *
 * Captions stay honest and short: a company's own site gets "<domain> today", never "my work";
 * anything not released says so.
 */
const web = (slug: string, name: string, alt: string, caption: string, width = 1600): Shot => ({
	src: `/proof/${slug}/${name}.webp`,
	width,
	height: (width * 10) / 16,
	alt,
	caption,
	kind: "web",
});

const phone = (slug: string, name: string, alt: string, caption: string): Shot => ({
	src: `/proof/${slug}/${name}.webp`,
	width: 900,
	height: 1600,
	alt,
	caption,
	kind: "phone",
});

/** A whole phone screen from MapTrack's phone app. */
const nativeApp = (name: string, alt: string, caption: string): Shot => ({
	src: `/proof/maptrack/native-${name}.webp`,
	width: 1170,
	height: 2544,
	alt,
	caption,
	kind: "phone",
});

export const proof = {
	/** Upwork originals, already public on his profile. */
	maptrackApp: [
		web(
			"maptrack",
			"map",
			"MapTrack’s map view: clusters of assets on a satellite map, beside the app’s sidebar.",
			"The asset map. Test account.",
		),
		web(
			"maptrack",
			"forms",
			"MapTrack’s forms page: a prompt to describe a form, other ways to start one, and a table of forms.",
			"Forms, where the Form Builder starts.",
		),
		web(
			"maptrack",
			"templates",
			"MapTrack’s template library: search, categories and cards of ready-made forms.",
			"The form template library.",
		),
		web(
			"maptrack",
			"assets",
			"MapTrack’s assets table: saved view tabs, filters, and rows with location and status.",
			"Assets table with filters and saved views.",
		),
		web(
			"maptrack",
			"ai-add-asset",
			"MapTrack’s Add Asset dialog: start from an asset you already have, snap it with AI, or start from scratch.",
			"Add Asset: reuse one, or snap it with AI. Test account.",
		),
	],
	/** MapTrack's AI, live in the app. */
	maptrackAi: [
		web(
			"maptrack",
			"ai-snap",
			"Snap It With AI: a place to drop photos, a warning about glare on one of them, tips for a good photo and a Read button.",
			"Snap it with AI: glare is caught first. Test account.",
		),
		web(
			"maptrack",
			"ai-forms",
			"MapTrack’s forms page: describe a form to have it drafted, or upload a document, above a table of forms.",
			"A form drafted from plain English or an uploaded document. Test account.",
		),
	],
	/** MapTrack's IoT, live in the app. A tracker's real place is blurred. */
	maptrackIot: [
		web(
			"maptrack",
			"iot-telemetry",
			"An asset’s telemetry page: run-time hours, last motion, battery, the device’s status and a chart of readings. The map and address are blurred.",
			"Telemetry on a demo asset. Its location is blurred.",
		),
		web(
			"maptrack",
			"map-asset",
			"The map with an asset open beside it: clusters of assets along Australia’s east coast, and the asset’s details and pictures.",
			"The map, with an asset open. Test account.",
		),
	],
	/** MapTrack’s phone app, in development: real simulator captures of test data. */
	maptrackNative: [
		nativeApp(
			"home",
			"MapTrack’s phone app home: a greeting card with Scan a tag and Enter code, shortcuts to assets, forms and sync, an asset map and the tab bar.",
			"Home. In development, test data.",
		),
		nativeApp(
			"scan",
			"Scanning several tags: the scan frame above a list of three scans, with a Complete bulk scan button and the tab bar.",
			"Scanning several tags at once. In development, test data.",
		),
		nativeApp(
			"work-order",
			"A work order: status and priority chips, a Saved on device badge, a running timer, its description and a Complete task button.",
			"Work order with a running timer. In development, test data.",
		),
		nativeApp(
			"offline-queue",
			"Working offline in the Forms tab: a banner says changes save on this device, above three changes marked Saved on device.",
			"Working offline, changes waiting to sync. In development, test data.",
		),
		nativeApp(
			"form-logic",
			"A form on the phone: a failed answer reveals a follow-up question, then a repeating question for each fault.",
			"Conditional logic and repeatable sections. In development, test data.",
		),
		nativeApp(
			"asset",
			"An asset page: QR tag, Deployed status, section tabs, the current assignment and Return and Reassign buttons.",
			"Asset page with its tag and assignment. In development, test data.",
		),
		nativeApp(
			"meter",
			"Meter readings for one asset: current engine hours, a trend chart with 7, 14, 28 and 90 day ranges, a Record reading button and history.",
			"Meter readings trend. In development, test data.",
		),
		nativeApp(
			"map",
			"A full-screen asset map of Australia with numbered clusters, one pin, and zoom, locate and map style controls.",
			"Asset map. In development, test data.",
		),
		nativeApp(
			"assets",
			"The assets list in select mode: photos, status chips, filters, saved views, one row ticked and an Actions button.",
			"Assets list, selecting for bulk actions. In development, test data.",
		),
		nativeApp(
			"audits",
			"The audits list: two quarterly audits with progress bars, one active at 0 of 4 assets, one complete at 4 of 4.",
			"Audits with progress. In development, test data.",
		),
		nativeApp(
			"work-orders",
			"The tasks list: search, filters such as My tasks and Overdue, and work orders with due dates and coloured status and priority chips.",
			"Work orders and tasks. In development, test data.",
		),
		nativeApp(
			"dashboard",
			"The home dashboard scrolled down: asset totals, utilisation, a donut chart of assets by status and recently viewed assets.",
			"Asset overview on the phone. In development, test data.",
		),
		nativeApp(
			"submission",
			"A submitted form: details, a banner reading 1 flagged, 7 of 8 answered, and All, Flagged and Unanswered filters.",
			"Submitted form with flagged answers. In development, test data.",
		),
		nativeApp(
			"sync-conflict",
			"A sync conflict: a dialog says someone changed Status while you were offline and MapTrack kept their version, with Open, Dismiss and Cancel.",
			"Sync conflict after working offline. In development, test data.",
		),
		nativeApp(
			"offline-settings",
			"The More tab: profile, workspace, a Work offline switch, Sync now and Reset offline data.",
			"Offline and sync controls. In development, test account.",
		),
		nativeApp(
			"accessories",
			"Assigning an asset: an accessories check listing items to mark Taken or Not taken, some required.",
			"Accessories check when assigning. In development, test data.",
		),
		nativeApp(
			"assign",
			"The Assign assets sheet: a warning that some selected assets may be unavailable, above location, person and due date fields.",
			"Assigning, with an availability warning. In development, test data.",
		),
		nativeApp(
			"request",
			"The Request asset sheet: request type, priority, recipient, needed from and until dates, project code and a note.",
			"Requesting an asset. In development, test data.",
		),
		nativeApp(
			"form",
			"An inspection form: the asset it is for, equipment condition choices and a Submit button.",
			"Inspection form. In development, test data.",
		),
		nativeApp(
			"missing",
			"A missing asset: a red Missing badge, an explanation with a Mark as found button, and Assign and Request buttons.",
			"A missing asset. In development, test data.",
		),
		nativeApp(
			"asset-dark",
			"An asset page in the dark theme: QR tag, Deployed status, assignment details and Return and Reassign buttons.",
			"Dark theme. In development, test data.",
		),
		nativeApp(
			"part-bin",
			"A scanned part bin: stock on hand, available, reserved, minimum and maximum, with a Scan next button.",
			"Scanned part bin with stock levels. In development, test data.",
		),
		nativeApp(
			"search",
			"Global search: typing pump lists matching assets above the keyboard.",
			"Global search. In development, test data.",
		),
		nativeApp(
			"sign-in",
			"The sign-in screen: MapTrack logo, email and password fields, Microsoft and single sign-on options.",
			"Sign in. In development.",
		),
	],
	/**
	 * BOS with test data only: seed companies, customer names and amounts masked. No revenue, no deal
	 * values, no shot with a contact's name.
	 */
	bos: [
		web(
			"maptrack",
			"bos-agents",
			"BOS’s Agents page: Inbox Triage, Post-Meeting, Deal Follow-ups, CRM & Forecast, Enrichment and Prospecting, each with its criteria, queue and results.",
			"Every agent’s workflow: what it looks for, what’s waiting, what it filed.",
			896,
		),
		// Real records: every Phone and Company cell is mosaicked and blurred past reading, at his request.
		web(
			"maptrack",
			"bos-contacts",
			"BOS’s Contacts table with the inline editor open on a Job Title cell; phone numbers and companies blurred.",
			"Contacts: edit any cell in place. Customer details blurred.",
			1376,
		),
		web(
			"maptrack",
			"bos-billing-grid",
			"BOS’s Billing Health table: customers by billed period, names and amounts masked.",
			"Billing Health: expected billing against Xero. Test data.",
			1280,
		),
		web(
			"maptrack",
			"bos-product-usage",
			"BOS’s Product Usage for one test account: features adopted and usage counts.",
			"Product Usage for one account. Test data.",
			800,
		),
	],
	bosshire: [
		web(
			"bosshire",
			"job-fair",
			"A Pulang Indonesia 2026 job-fair page on Bosshire’s site, with its date, venue and poster.",
			"bosshire.co.id today: a 2026 job-fair page.",
		),
		web(
			"bosshire",
			"events",
			"Bosshire’s events list: four Pulang Indonesia 2026 job fairs in Chinese cities.",
			"bosshire.co.id today: the events list.",
		),
		phone(
			"bosshire",
			"phone-job-fair",
			"The 2025 Pulang Indonesia online job-fair page on a phone.",
			"bosshire.co.id today: the 2025 job fair, on a phone.",
		),
	],
	edufund: [
		web(
			"edufund",
			"home",
			"Edufund’s home page: education and cash loans, beside an illustration of two people on a leaf.",
			"edufund.co.id today: the home page.",
		),
		web(
			"edufund",
			"products",
			"Edufund’s four loan products: EduCollege, EduSchool, EduCourse and EduCash.",
			"edufund.co.id in June 2026: its loan products.",
		),
		web(
			"edufund",
			"simulator",
			"The EduCash loan simulator: a financing form beside a summary of the loan.",
			"edufund.co.id today: the older Angular app, still live.",
		),
		phone(
			"edufund",
			"phone-sign-in",
			"Edufund’s sign-in form on a phone.",
			"edufund.co.id today: sign-in, on a phone.",
		),
	],
	happy5: [
		web(
			"happy5",
			"reviews",
			"Happy5’s performance-review page: a headline above review question and scoring screens.",
			"happy5.co today: performance reviews.",
		),
		web(
			"happy5",
			"engagement",
			"Happy5’s engagement page: a headline above review history, recognition and feedback screens.",
			"happy5.co today: recognition and feedback.",
		),
		phone(
			"happy5",
			"phone-reviews",
			"Review, competency and final score screens from Happy5’s site, on a phone.",
			"happy5.co today: review screens, on a phone.",
		),
	],
	mycelium: [
		web(
			"mycelium-network",
			"home",
			"Mycelium’s landing page: registering IP in one click.",
			"myceliumnetwork.io today, rebuilt after I left.",
		),
		phone(
			"mycelium-network",
			"phone-home",
			"Mycelium’s landing page on a phone.",
			"myceliumnetwork.io today, on a phone.",
		),
	],
	penawaranku: [
		web(
			"penawaranku",
			"ai-draft",
			"Penawaranku’s AI chat: a draft quotation from a template, previewed, then saved.",
			"The running app: AI draft, preview, save. Sample data.",
		),
		web(
			"penawaranku",
			"docs",
			"Penawaranku’s docs: a .docx template with placeholders beside the invoice it produces.",
			"Public docs: a template and the invoice it produces.",
		),
	],
	arsipCetak: [
		web(
			"arsip-cetak",
			"dashboard",
			"Arsip Cetak’s dashboard in a demo workspace: demo takings, receivables and ageing buckets.",
			"The running app, in a demo workspace.",
		),
		web(
			"arsip-cetak",
			"template-form",
			"Arsip Cetak’s landing page: a .docx template turning into a phone form.",
			"Landing page: a .docx becomes a phone form. Illustrative panel.",
		),
	],
	lomba: [
		web(
			"lomba-agustusan-2026",
			"bracket",
			"The finished 10-team Mobile Legends bracket on the event’s site.",
			"The finished 10-team bracket.",
		),
		phone(
			"lomba-agustusan-2026",
			"phone-event",
			"The Mobile Legends event card on a phone: date, venue, prize and entry fee.",
			"An event card, on a phone.",
		),
	],
} satisfies Record<string, Shot[]>;
