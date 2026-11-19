import { z } from "zod";

/**
 * The sample session: the signed-in user as JSON in localStorage. There is no server, so this is only
 * a convenience for the demo, not security.
 *
 * PLUG REAL AUTH HERE: swap the bodies of `getSession`, `startSession`, `updateSessionUser` and
 * `endSession` for your provider's browser SDK (read its current user, sign in, update the profile,
 * sign out) and call `notify()` when its auth state changes. The route guards in
 * `routes/_app.tsx`, `routes/_auth.tsx` and `routes/onboarding.tsx` only call `getSession()`, so they
 * keep working. Your API must still check the provider's token on every request.
 */
const SESSION_KEY = "workspace-session";

export const sessionUserSchema = z.object({
	id: z.string(),
	name: z.string().min(1),
	email: z.email(),
});

export type SessionUser = z.infer<typeof sessionUserSchema>;

/**
 * The previews open straight into the app: with this off, nobody is asked to sign in and a sample user is
 * used. The sign-in screens still exist at /sign-in. Turn it on when you plug real auth in.
 */
export const REQUIRE_SIGN_IN = false;

/** The id every sample record treats as "me". A real backend returns the user's own id. */
export const SAMPLE_USER_ID = "u-me";

/** Who the app shows when nobody has signed in and sign-in is not required. */
const SAMPLE_USER: SessionUser = {
	id: SAMPLE_USER_ID,
	name: "Mara Okoye",
	email: "mara.okoye@fernhill.example",
};

const listeners = new Set<() => void>();
const notify = () => {
	for (const listener of listeners) listener();
};

/** Re-renders `useSessionUser` on changes, including sign-in or sign-out in another tab. */
export function subscribeSession(listener: () => void) {
	listeners.add(listener);
	const onStorage = (event: StorageEvent) => {
		if (event.key === SESSION_KEY) listener();
	};
	window.addEventListener("storage", onStorage);
	return () => {
		listeners.delete(listener);
		window.removeEventListener("storage", onStorage);
	};
}

let cache: { raw: string | null; user: SessionUser | null } = { raw: null, user: null };

function decode(raw: string | null): SessionUser | null {
	if (!raw) return null;
	try {
		const parsed = sessionUserSchema.safeParse(JSON.parse(raw));
		return parsed.success ? parsed.data : null;
	} catch {
		return null;
	}
}

/** The signed-in user, or null. Returns the same object until the stored session changes. */
export function getSession(): SessionUser | null {
	if (typeof window === "undefined") return null;
	let raw: string | null = null;
	try {
		raw = localStorage.getItem(SESSION_KEY);
	} catch {}
	if (raw !== cache.raw) cache = { raw, user: decode(raw) };
	return cache.user ?? (REQUIRE_SIGN_IN ? null : SAMPLE_USER);
}

function save(user: SessionUser | null) {
	try {
		if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
		else localStorage.removeItem(SESSION_KEY);
	} catch {}
	notify();
}

/** The sample accepts any valid email and password. A real app verifies them with its provider. */
export async function startSession(input: { name?: string; email: string }): Promise<SessionUser> {
	const fallbackName = input.email.split("@")[0]?.replace(/[._-]+/g, " ") ?? "Guest";
	const user = sessionUserSchema.parse({
		id: SAMPLE_USER_ID,
		name: (input.name?.trim() || fallbackName).replace(/\b\w/g, (c) => c.toUpperCase()),
		email: input.email,
	});
	save(user);
	return user;
}

/** Updates the name/email in the session after a profile edit. */
export async function updateSessionUser(patch: Partial<Pick<SessionUser, "name" | "email">>) {
	const current = getSession();
	if (!current) return null;
	const user = sessionUserSchema.parse({ ...current, ...patch });
	save(user);
	return user;
}

export async function endSession() {
	save(null);
}

export const initialsOf = (name: string) =>
	name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join("");

export const firstNameOf = (name: string) => name.split(/\s+/)[0] ?? name;
