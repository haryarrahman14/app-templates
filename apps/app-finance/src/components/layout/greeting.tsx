/** Time-of-day greeting in the visitor's local time. */
export function Greeting({ name }: { name: string }) {
	const hour = new Date().getHours();
	const part = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
	return (
		<>
			{part}, {name}
		</>
	);
}
