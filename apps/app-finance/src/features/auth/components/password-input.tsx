import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { type ComponentProps, useState } from "react";

export function PasswordInput(props: Omit<ComponentProps<typeof Input>, "type">) {
	const [visible, setVisible] = useState(false);
	return (
		<div className="relative">
			<Input type={visible ? "text" : "password"} className="pr-10" {...props} />
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground"
				onClick={() => setVisible((v) => !v)}
				aria-label={visible ? "Hide password" : "Show password"}
				aria-pressed={visible}
			>
				{visible ? <EyeOffIcon /> : <EyeIcon />}
			</Button>
		</div>
	);
}
