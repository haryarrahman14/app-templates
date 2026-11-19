import { useRef, useSyncExternalStore } from "react";
import { getSession, type SessionUser, subscribeSession } from "@/lib/session";

/**
 * The signed-in user for screens inside the guarded routes. It follows profile edits live and keeps
 * the last user while a sign-out navigates away, so the shell never renders without one.
 */
export function useSessionUser(): SessionUser {
	const user = useSyncExternalStore(subscribeSession, getSession, () => null);
	const last = useRef(user);
	if (user) last.current = user;
	if (!last.current) throw new Error("useSessionUser must be used inside the signed-in routes.");
	return last.current;
}
