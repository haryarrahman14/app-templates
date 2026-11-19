/**
 * Router Link/navigate options for an app address held as data, such as a seeded notification's
 * "/deals?deal=d4". Usage: `<Link {...hrefLink(item.href)}>`.
 */
export function hrefLink(href: string) {
	const url = new URL(href, "http://app.local");
	return { to: url.pathname, search: Object.fromEntries(url.searchParams) };
}
