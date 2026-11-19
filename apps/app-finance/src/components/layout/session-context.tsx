import { createContext, type ReactNode, useContext } from "react";
import type { Session } from "@/lib/session";

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ session, children }: { session: Session; children: ReactNode }) {
	return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}

/** The signed-in sample user. Only valid inside the (app) shell. */
export function useSession() {
	const session = useContext(SessionContext);
	if (!session) throw new Error("useSession must be used inside the app shell");
	return session;
}
