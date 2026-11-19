export type EmailTemplate = { id: string; name: string; subject: string; body: string };

/** Sample templates. `{{firstName}}` is filled from the first recipient. */
export const EMAIL_TEMPLATES: EmailTemplate[] = [
	{
		id: "intro",
		name: "Friendly intro",
		subject: "Quick hello from Fernhill Studio",
		body: "Hi {{firstName}},\n\nThanks for your time earlier. I put together a short overview of how teams like yours use Tidewell to keep their pipeline tidy.\n\nWould a 20 minute call next week work for you?\n\nBest,\nRobin",
	},
	{
		id: "follow-up",
		name: "Meeting follow-up",
		subject: "Follow-up: next steps",
		body: "Hi {{firstName}},\n\nThanks for meeting today. A quick recap of what we agreed:\n\n- Share the pilot plan by Friday\n- Set up a check-in in two weeks\n\nLet me know if I missed anything.\n\nBest,\nRobin",
	},
	{
		id: "proposal",
		name: "Proposal sent",
		subject: "Your proposal is ready",
		body: "Hi {{firstName}},\n\nAs promised, the proposal is attached. It covers pricing for the team plan and the onboarding package.\n\nHappy to walk through it whenever suits you.\n\nBest,\nRobin",
	},
	{
		id: "check-in",
		name: "Gentle check-in",
		subject: "Checking in",
		body: "Hi {{firstName}},\n\nJust checking in to see whether you had a chance to look at my last note. No rush at all.\n\nBest,\nRobin",
	},
];
