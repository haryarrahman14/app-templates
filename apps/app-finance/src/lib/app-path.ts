import type { FileRoutesByTo } from "@/routeTree.gen";

/** Every address the router knows, for typed nav lists (`/markets`, `/settings/profile`, …). */
export type AppPath = keyof FileRoutesByTo;
