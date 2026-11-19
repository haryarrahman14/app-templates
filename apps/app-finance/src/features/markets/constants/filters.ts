export const CAP_OPTIONS = [
	{ value: "all", label: "Any size" },
	{ value: "Mega", label: "Mega cap (200B+)" },
	{ value: "Large", label: "Large cap (50–200B)" },
	{ value: "Mid", label: "Mid cap (20–50B)" },
	{ value: "Small", label: "Small cap (<20B)" },
] as const;

export const CHANGE_OPTIONS = [
	{ value: "all", label: "Any move" },
	{ value: "up", label: "Gainers" },
	{ value: "down", label: "Decliners" },
	{ value: "big", label: "Moved 1%+ either way" },
] as const;
