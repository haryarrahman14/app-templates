import { APP_IDS, APPS, type AppId, appIdSchema } from "@/lib/apps";

export type TerminalContext = {
	profile: {
		name: string;
		role: string;
		location: string;
		pitch: string;
		email: string;
		links: { label: string; href: string }[];
	};
	projects: { title: string; tagline: string; period?: string }[];
};

export type CommandEffect =
	| { type: "open"; id: AppId }
	| { type: "theme"; value: "light" | "dark" | "system" }
	| { type: "clear" };

export type CommandResult = { output: string[]; effect?: CommandEffect };

export const COMMANDS = [
	"help",
	"about",
	"projects",
	"open",
	"theme",
	"clear",
	"whoami",
	"date",
	"echo",
];

const HELP = [
	"Available commands:",
	"  help              this list",
	"  about             who I am",
	"  projects          selected work",
	`  open <app>        open a window: ${APP_IDS.join(", ")}`,
	"  theme dark|light  switch the theme (or system)",
	"  clear             clear the screen",
	"  whoami · date · echo <text>",
];

/** Pure: parses a line and returns what to print plus an optional side effect for the UI to run. */
export function runCommand(line: string, ctx: TerminalContext): CommandResult {
	const [command = "", ...args] = line.trim().split(/\s+/);
	const arg = args.join(" ");

	switch (command.toLowerCase()) {
		case "":
			return { output: [] };
		case "help":
			return { output: HELP };
		case "about":
			return {
				output: [
					`${ctx.profile.name} — ${ctx.profile.role}, ${ctx.profile.location}`,
					ctx.profile.pitch,
					"",
					...ctx.profile.links.map(
						(link) => `  ${link.label.padEnd(9)} ${link.href.replace(/^mailto:/, "")}`,
					),
				],
			};
		case "projects":
			return {
				output: [
					...ctx.projects.map(
						(p) => `  ${(p.period ?? "").padEnd(20)} ${p.title.padEnd(30)} ${p.tagline}`,
					),
					"",
					"Type `open projects` to browse them.",
				],
			};
		case "open": {
			const parsed = appIdSchema.safeParse(arg.toLowerCase());
			if (!parsed.success) {
				return { output: [`open: unknown app "${arg}". Try one of: ${APP_IDS.join(", ")}`] };
			}
			return {
				output: [`Opening ${APPS[parsed.data].title}…`],
				effect: { type: "open", id: parsed.data },
			};
		}
		case "theme": {
			const value = arg.toLowerCase();
			if (value !== "dark" && value !== "light" && value !== "system") {
				return { output: ["usage: theme dark|light|system"] };
			}
			return { output: [`Theme set to ${value}.`], effect: { type: "theme", value } };
		}
		case "clear":
			return { output: [], effect: { type: "clear" } };
		case "whoami":
			return { output: ["guest — welcome. Type help to look around."] };
		case "date":
			return { output: [new Date().toString()] };
		case "echo":
			return { output: [arg] };
		case "sudo":
			return { output: ["Nice try. This desktop runs on good intentions only."] };
		default:
			return { output: [`command not found: ${command}. Type help.`] };
	}
}
