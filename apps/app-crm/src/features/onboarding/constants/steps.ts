export type OnboardingStep = {
	id: string;
	title: string;
	description: string;
	action: string;
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
	{
		id: "profile",
		title: "Set up your profile",
		description: "Add your name and title so teammates know who owns what.",
		action: "Open profile",
	},
	{
		id: "import",
		title: "Import your contacts",
		description: "Bring companies in from a CSV. A sample file is ready to try.",
		action: "Start import",
	},
	{
		id: "company",
		title: "Create a company",
		description: "Add one record by hand to see how fields and owners work.",
		action: "New company",
	},
	{
		id: "deal",
		title: "Move a deal",
		description: "Drag a card on the pipeline board, or use its Move to menu.",
		action: "Open deals",
	},
	{
		id: "email",
		title: "Send your first email",
		description: "Write from the composer; it is logged on the record.",
		action: "Compose",
	},
	{
		id: "invite",
		title: "Invite a teammate",
		description: "CRMs work best when the whole team keeps them up to date.",
		action: "Invite",
	},
];
